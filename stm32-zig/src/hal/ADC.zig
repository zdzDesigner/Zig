const std = @import("std");

const chip = @import("chip");

const GPIO = @import("GPIO.zig");
const time = @import("time.zig");
const dma = @import("dma.zig");

// debug =============
const strings = @import("util");
const uart = @import("USART.zig").USART1;

pub const Registers = chip.types.peripherals.ADC1;

const RCC = chip.peripherals.RCC;

pub const ADC1: ADC = .{ .registers = chip.peripherals.ADC1 };
pub const ADC2: ADC = .{ .registers = @ptrCast(chip.peripherals.ADC2) };

const ADC = @This();

registers: *volatile Registers,

pub inline fn apply(comptime adc: ADC, comptime config: Config) error{Timeout}!void {
    comptime {
        config.check(adc);
        if (config.requiresDMA()) @compileError("ADC config requires DMA");
    }
    adc.applyUnchecked(config);
    try adc.enable();
    try adc.calibrate();
}

pub inline fn withDMA(comptime adc: ADC) WithDMA(adc) {
    return .{};
}

pub fn start(adc: ADC) void {
    // read DR autoclear it, 防止超时手动清除
    adc.registers.SR.modify(.{ .EOC = 0 });
    // adc.registers.CR1.modify(.{
    //     .EOCIE = 1,
    // });

    if (adc.isSoftwareTriggered()) {
        adc.registers.CR2.modify(.{
            .SWSTART = 1,
            .EXTTRIG = 1,
        });
    } else {
        adc.registers.CR2.modify(.{ .EXTTRIG = 1 });
    }
}

pub fn isReady(adc: ADC) bool {
    std.debug.assert(!adc.isDMA());
    if (adc.isSingleConversion()) {
        return adc.registers.SR.read().EOC == 1;
    }
    // uart.transmitBlocking(strings.intToStr(30, "SQR1.L-----:{}\r\n", adc.registers.SQR1.read().L), null) catch unreachable;
    // uart.transmitBlocking(strings.intToStr(30, "SR.EOC-----:{}\r\n", adc.registers.SR.read().EOC), null) catch unreachable;
    while (adc.registers.SR.read().EOC == 0) {}
    return true;

    // TODO: Implement
    // unreachable;
}

pub fn wait(adc: ADC, timeout: ?u32) error{Timeout}!void {
    std.debug.assert(!adc.isDMA());
    const delay = time.absolute();
    // uart.transmitBlocking(strings.intToStr(30, "wait-----:{s}\r\n", ""), null) catch unreachable;

    while (!adc.isReady()) {
        if (delay.isReached(timeout)) return error.Timeout;
    }
}

pub fn read(adc: ADC) ?u16 {
    std.debug.assert(!adc.isDMA());
    if (!adc.isReady()) return null;
    return adc.registers.DR.read().DATA;
}

pub fn waitAndRead(adc: ADC, timeout: ?u32) error{Timeout}!u16 {
    std.debug.assert(!adc.isDMA());
    try adc.wait(timeout);
    return adc.registers.DR.read().DATA;
}

pub fn oneShot(adc: ADC, channel: Channel) Channel.Error!u16 {
    try adc.configChannels(&.{channel});
    adc.start();
    return adc.waitAndRead(null) catch unreachable;
}

/// Assumes config is valid. (Can be checked using config.check())
pub fn applyUnchecked(adc: ADC, config: Config) void {
    switch (@intFromPtr(adc.registers)) {
        @intFromPtr(ADC1.registers) => {
            { // 复位: 先开启后关闭
                RCC.APB2RSTR.modify(.{ .ADC1RST = 1 });
                time.delay_us(1);
                RCC.APB2RSTR.modify(.{ .ADC1RST = 0 });
            }
            RCC.APB2ENR.modify(.{ .ADC1EN = 1 });
            _ = RCC.APB2ENR.read().ADC1EN;
            RCC.CFGR.modify(.{ .ADCPRE = 0b11 });
        },
        @intFromPtr(ADC2.registers) => {
            RCC.APB2ENR.modify(.{ .ADC2EN = 1 });
            _ = RCC.APB2ENR.read().ADC2EN;
        },
        else => unreachable,
    }

    adc.registers.CR1.modify(.{
        .SCAN = @intFromBool(config.channels.len > 1),
        .DISCEN = @intFromBool(config.mode == .discontinuous),
        .DISCNUM = switch (config.mode) {
            .single, .continuous => 0,
            .discontinuous => |n| @as(u3, @truncate(n - 1)),
        },
        .EOCIE = @intFromBool(config.interrupt),
    });
    // std.debug.assert(config.interrupt);

    adc.registers.CR2.modify(.{
        .ALIGN = @intFromEnum(config.data_alignment),
        .CONT = @intFromBool(config.mode == .continuous),
        .EXTSEL = @intFromEnum(config.trigger),
        .EXTTRIG = 0,
    });

    adc.configChannels(config.channels) catch unreachable;
}

pub fn configChannels(adc: ADC, channels: []const Channel) Channel.Error!void {
    std.debug.assert(channels.len <= 16 and channels.len >= 1);

    enableGPIOs(channels);

    adc.registers.SQR1.modify(.{
        .L = @as(u4, @truncate(channels.len - 1)),
    });

    for (channels, 0..) |channel, rank| {
        try adc.configChannel(channel, @truncate(rank));
    }
}

inline fn mask_value(channel: Channel, move: u5) struct { value: u32, mask: u32 } {
    const value: u32 = @as(u32, channel.number) << move;
    const mask: u32 = @as(u32, 0b11111) << move;
    return .{
        .value = value,
        .mask = mask,
    };
}
inline fn getSQR(raw: u32, channel: Channel, move: u5) u32 {
    const value: u32 = @as(u32, channel.number) << move;
    const mask: u32 = @as(u32, 0b11111) << move;
    return (raw & ~mask) | value;
}
pub fn configChannel(adc: ADC, channel: Channel, rank: u5) Channel.Error!void {
    // Blue pill has up to channel 9 but channels 16 and 17 are
    // temperature sensor and Vbat sensor respectively
    // but they are only available in ADC
    // so we need to handle them too

    try channel.isValid(adc);

    {
        // 0b10100100
        // SQ1:0b00100 => 4
        // SQ2:0b101 => 5
        if (rank < 6) {
            // const mv = mask_value(channel, (rank - 0) * 5);
            // const temp = adc.registers.SQR3.raw;
            // adc.registers.SQR3.raw = (temp & ~mv.mask) | mv.value;
            // =========
            adc.registers.SQR3.raw = getSQR(adc.registers.SQR3.raw, channel, (rank - 0) * 5);
            // adc.registers.SQR3.raw = 0xa4;
        } else if (rank < 12) {
            // const move = (rank - 6) * 5;
            // const value: u32 = @as(u32, channel.number) << move;
            // const mask: u32 = @as(u32, 0b11111) << move;
            // =========
            // const mv = mask_value(channel, (rank - 6) * 5);
            // const temp = adc.registers.SQR2.raw;
            // adc.registers.SQR2.raw = (temp & ~mv.mask) | mv.value;
            // =========
            adc.registers.SQR2.raw = getSQR(adc.registers.SQR2.raw, channel, (rank - 6) * 5);
        } else {
            // const move = (rank - 12) * 5;
            // const value: u32 = @as(u32, channel.number) << move;
            // const mask: u32 = @as(u32, 0b11111) << move;
            // =========
            // const mv = mask_value(channel, (rank - 12) * 5);
            // const temp = adc.registers.SQR1.raw;
            // adc.registers.SQR1.raw = (temp & ~mv.mask) | mv.value;
            // =========
            adc.registers.SQR1.raw = getSQR(adc.registers.SQR1.raw, channel, (rank - 12) * 5);
        }
    }

    if (channel.number == Channel.temperature.number or channel.number == Channel.Vref.number) {
        adc.registers.CR2.modify(.{ .TSVREFE = 1 });
        time.delay_us(10);
    }

    {
        // const c = channel.number;
        // const sc: u32 = @intFromEnum(channel.sampling_cycles);
        // if (c >= 10) {
        //     const mask: u32 = @as(u32, 0b111) << (3 * (c - 10));
        //     const temp = adc.registers.SMPR1.raw;
        //     adc.registers.SMPR1.raw = (temp & ~mask) | (sc << (3 * (c - 10)));
        // } else {
        //     const mask: u32 = @as(u32, 0b111) << (3 * c);
        //     const temp = adc.registers.SMPR1.raw;
        //     adc.registers.SMPR1.raw = (temp & ~mask) | (sc << (3 * c));
        // }
        adc.registers.SMPR1.raw = 0;
        adc.registers.SMPR2.raw = 0x0002d000;
    }
}

// 校准
pub inline fn calibrate(adc: ADC) error{Timeout}!void {
    adc.registers.CR2.modify(.{ .RSTCAL = 1 });
    const delay = time.absolute();
    while (adc.registers.CR2.read().RSTCAL != 0) {
        if (delay.isReached(20)) return error.Timeout;
    }
    adc.registers.CR2.modify(.{ .CAL = 1 });
    const delay2 = time.absolute();
    while (adc.registers.CR2.read().CAL != 0) {
        if (delay2.isReached(20)) return error.Timeout;
    }
}

pub inline fn enable(adc: ADC) error{Timeout}!void {
    try adc.writeADON(1);
}

pub inline fn disable(adc: ADC) error{Timeout}!void {
    try adc.writeADON(0);
}

pub fn isSingleConversion(adc: ADC) bool {
    return adc.registers.CR1.read().SCAN == 0 and adc.registers.SQR1.read().L == 0;
}

pub fn isSoftwareTriggered(adc: ADC) bool {
    return adc.registers.CR2.read().EXTSEL == @intFromEnum(Config.Trigger.SOFTWARE);
}

pub fn isDMA(adc: ADC) bool {
    return adc.registers.CR2.read().DMA == 1;
}

fn writeADON(adc: ADC, value: u1) error{Timeout}!void {
    if (adc.registers.CR2.read().ADON == value) {
        return;
    }

    uart.transmitBlocking(strings.intToStr(30, "writeADON-----:{}\r\n", value), null) catch unreachable;
    adc.registers.CR2.modify(.{ .ADON = value });

    // time.delay_us(5);

    // const delay = time.absolute();
    while (adc.registers.CR2.read().ADON != value) {
        uart.transmitBlocking(strings.intToStr(30, "delay-----:{}\r\n", adc.registers.CR2.read().ADON), null) catch unreachable;
        // if (delay.isReached(200)) return error.Timeout;
    }
}

pub const Config = struct {
    /// Channels are converted in the given order. Slice len should be in the range [1, 16].
    channels: []const Channel,
    trigger: Trigger = .SOFTWARE,
    data_alignment: DataAlignment = .right,
    mode: Mode = .single,
    interrupt: bool = false,

    pub fn requiresDMA(config: Config) bool {
        // 单通道 and 连续转换
        if (config.channels.len == 1) return config.mode == .continuous;

        // 间断模式:子组(可以配置转换策略)
        return switch (config.mode) {
            .discontinuous => |n| n > 1,
            else => true,
        };
    }

    pub const DataAlignment = enum(u1) { right = 0, left = 1 };

    pub const Mode = union(enum) {
        single,
        continuous,
        /// Number between 1 and 8.
        discontinuous: u4,
    };

    pub const Trigger = enum(u3) {
        TIM1_CC1 = 0,
        TIM1_CC2 = 1,
        TIM1_CC3 = 2,
        TIM2_CC2 = 3,
        TIM3_TRGO = 4,
        TIM4_CC4 = 5,
        EXTI_11 = 6,
        SOFTWARE = 7,
    };

    pub fn check(comptime config: Config, adc: ADC) void {
        const print = std.fmt.comptimePrint;
        // 通道数量
        if (config.channels.len < 1) @compileError("Zero ADC converion channels");
        if (config.channels.len > 16) @compileError(print(
            "Too many ADC conversion channels: {}. Max is 16",
            .{config.channels.len},
        ));
        // 转换模式
        if (config.mode == .discontinuous) {
            const n = config.mode.discontinuous;
            if (n < 1) @compileError("Zero ADC discontinuous conversions when in discontinuous mode");
            if (n > 8) @compileError(print(
                "Too many ADC discontinuous conversions: {}. Max is 8",
                .{n},
            ));
        }

        for (config.channels) |channel| {
            channel.isValid(adc) catch |e| switch (e) {
                Channel.Error.InvalidChannel => @compileError(print(
                    "Invalid ADC conversion channel {}. Valid channels are 0-9, Vref (16) and temperature sensor (17)",
                    .{channel.number},
                )),
                Channel.Error.ChannelNotSupported => @compileError(print(
                    "ADC instance doesn't support channel {}",
                    .{channel.number},
                )),
            };
        }
    }
};

pub const Channel = packed struct(u8) {
    pub const Error = error{ InvalidChannel, ChannelNotSupported };

    // pub const A4: Channel = .{ .number = 1 };
    // pub const A5: Channel = .{ .number = 2 };
    pub const A0: Channel = .{ .number = 0 };
    pub const A1: Channel = .{ .number = 1 };
    pub const A2: Channel = .{ .number = 2 };
    pub const A3: Channel = .{ .number = 3 };
    pub const A4: Channel = .{ .number = 4 };
    pub const A5: Channel = .{ .number = 5 };
    pub const A6: Channel = .{ .number = 6 };
    pub const A7: Channel = .{ .number = 7 };
    pub const B0: Channel = .{ .number = 8 };
    pub const B1: Channel = .{ .number = 9 };
    pub const Vref: Channel = .{ .number = 16 };
    pub const temperature: Channel = .{ .number = 17 };

    number: u5,
    sampling_cycles: SamplingCycles = .@"1.5",

    pub inline fn withSamplingCycles(channel: Channel, sampling_cycles: SamplingCycles) Channel {
        return .{
            .number = channel.number,
            .sampling_cycles = sampling_cycles,
        };
    }

    pub inline fn getPort(channel: Channel) ?u1 {
        if (channel.number > 9) return null;
        return @truncate(channel.number >> 3);
    }

    pub inline fn getPin(channel: Channel) u3 {
        return @truncate(channel.number & 0b111);
    }

    pub inline fn isValid(channel: Channel, adc: ADC) Error!void {
        if (channel.number == temperature.number or channel.number == Vref.number) { // ADC1支持
            if (adc.registers != ADC1.registers) return Error.ChannelNotSupported;
        } else {
            if (channel.number > 9) return Error.InvalidChannel;
        }
    }

    pub const SamplingCycles = enum(u3) {
        @"1.5",
        @"7.5",
        @"13.5",
        @"28.5",
        @"41.5",
        @"55.5",
        @"71.5",
        @"239.5",
    };
};

fn enableGPIOs(channels: []const Channel) void {
    var ports: [2]bool = [_]bool{false} ** 2;
    var gpios: [10]bool = [_]bool{false} ** 10;
    for (channels) |channel| {
        const port = channel.getPort() orelse continue;
        const index = channel.number;

        if (!ports[port]) {
            GPIO.Port.enable(@enumFromInt(port));
            ports[port] = true;
        }

        if (!gpios[index]) {
            GPIO.init(@enumFromInt(port), channel.getPin()).asInput(.analog);
            gpios[index] = true;
        }
    }
}

fn WithDMA(comptime adc: ADC) type {
    if (adc.registers == ADC2.registers) @compileError("ADC2 doesn't support DMA");

    return struct {
        const Self = @This();

        pub inline fn apply(self: Self, comptime config: Config) error{Timeout}!void {
            comptime {
                config.check(adc);
                if (!config.requiresDMA()) @compileError("ADC config doesn't require DMA");
            }
            adc.applyUnchecked(config);
            // uart.transmitBlocking(strings.intToStr(30, "-apply----:{s}\r\n", ""), null) catch unreachable;
            try self.enable();
        }

        pub fn withoutDMA(_: Self) ADC {
            return adc;
        }

        pub inline fn enable(_: Self) error{Timeout}!void {
            try adc.enable();
            // uart.transmitBlocking(strings.intToStr(30, "-adc.enable ok----:{s}\r\n", ""), null) catch unreachable;
            dma.enable();
        }

        pub inline fn disable(_: Self) error{Timeout}!void {
            try adc.disable();
            adc.registers.CR2.modify(.{ .DMA = 0 });
        }

        pub inline fn start(_: Self, buffer: []u16, options: dma.TransferOptions) dma.Error!dma.Transfer {
            const l = adc.registers.SQR1.read().L;
            // uart.transmitBlocking(strings.intToStr(30, "l:{}\r\n", l), null) catch unreachable;
            std.debug.assert(buffer.len >= l);

            adc.registers.SR.modify(.{ .EOC = 0 });
            adc.registers.CR2.modify(.{ .DMA = 1 });
            // uart.transmitBlocking(strings.intToStr(30, "channel index:{s}\r\n", ""), null) catch unreachable;
            const transfer = try dma.read(u16, .adc1, buffer, options);

            adc.start();

            return transfer;
        }

        pub inline fn configChannels(_: Self, channels: []const Channel) Channel.Error!void {
            try adc.configChannels(channels);
        }
    };
}
