const chip = @import("chip");
const clocks = @import("clocks.zig");
const GPIO = @import("GPIO.zig");
const dma = @import("dma.zig");
const time = @import("time.zig");
const interrupts = @import("interrupts.zig");

const RCC = chip.peripherals.RCC;
const AFIO = chip.peripherals.AFIO;

pub const Registers = chip.types.peripherals.USART1;

pub const USART1: USART = .{ .registers = chip.peripherals.USART1 };
// TODO Implement other two
// pub const USART2: USART = .{ .registers = chip.peripherals.USART2 };
// pub const USART3: USART = .{ .registers = chip.peripherals.USART3 };

const USART = @This();

registers: *volatile Registers,

pub const Config = struct {
    baudrate: u32 = 115200,
    data_bits: DataBits = .b8,
    stop_bits: StopBits = .@"1",
    parity: Parity = .none,
    receiver: bool = true,
    receiver_irq: bool = false,
    transmitter: bool = true,
    transmitter_irq: bool = false,
    remap: Remap = .none,

    pub const DataBits = enum { b8, b9 };
    pub const StopBits = enum(u2) { @"1", @"0.5", @"2", @"1.5" };
    pub const Parity = enum { none, even, odd };
    pub const Remap = enum { none, partial, full };
};

pub fn apply(self: USART, config: Config) void {
    applyImpl(self, config);
}
pub fn applyImpl(self: USART, config: Config) void {
    var tx: GPIO = undefined;
    var rx: GPIO = undefined;

    switch (@intFromPtr(self.registers)) {
        @intFromPtr(USART1.registers) => {
            RCC.APB2ENR.modify(.{
                .USART1EN = 1,
                .AFIOEN = 1,
            });
            _ = RCC.APB2ENR.read().USART1EN;

            if (config.remap == .none) {
                GPIO.Port.enable(.A);
                tx = GPIO.init(.A, 9);
                rx = GPIO.init(.A, 10);
            } else {
                AFIO.MAPR.modify(.{ .USART1_REMAP = 1 });
                GPIO.Port.enable(.B);
                tx = GPIO.init(.B, 6);
                rx = GPIO.init(.B, 7);
            }
        },
        else => unreachable,
    }

    if (config.transmitter) {
        tx.asOutput(.{
            .speed = .s50MHz,
            .function = .alternate,
            .drain = .push_pull,
        });
    }

    if (config.receiver) {
        rx.asInput(.floating);
    }

    // TODO:: 抽离(测试:当前具体指定USART1)中断
    if (config.transmitter_irq or config.receiver_irq) {
        interrupts.DeviceInterrupt.enable(interrupts.DeviceInterrupt.USART1);
        interrupts.DeviceInterrupt.setPriority(interrupts.DeviceInterrupt.USART1, .{ .preemptive = 1, .sub = 1 });
    }

    self.registers.CR2.modify(.{
        .STOP = @intFromEnum(config.stop_bits),
        .LINEN = 0,
        .CLKEN = 0,
    });

    self.registers.CR1.modify(.{
        .M = @intFromEnum(config.data_bits), // 数据字的长度
        .PCE = @intFromBool(config.parity != .none), // 使能奇偶检测
        .PS = if (config.parity == .odd) @as(u1, 1) else @as(u1, 0), // 奇偶检测
        .TE = @intFromBool(config.transmitter), // 发送使能
        .RE = @intFromBool(config.receiver), // 接收使能
        .RXNEIE = @intFromBool(config.receiver_irq),
        .TCIE = @intFromBool(config.transmitter_irq),
    });

    // TODO
    self.registers.CR3.modify(.{
        .CTSE = 0,
        .RTSE = 0,
        .SCEN = 0,
        .HDSEL = 0,
        .IREN = 0,
    });

    // config.baudrate = 115200
    const clock_freq = switch (@intFromPtr(self.registers)) {
        @intFromPtr(USART1.registers) => clocks.pclk2ClockFrequency(),
        else => unreachable,
    };
    self.registers.BRR.raw = calculateBRR(config.baudrate, clock_freq);

    // self.registers.BRR.raw = calculateBRR(config.baudrate, 72000000); // PPRE2 = 0 部分频

    self.registers.CR1.modify(.{ .UE = 1 });
}

fn calculateBRR(baud: u32, pclk: u32) u32 {
    const brr = pclk / baud;
    const rounding = ((pclk % baud) + (baud / 2)) / baud;
    return brr + rounding;
    // return ((pclk / baud) * 10 + 5) / 10;
}

pub fn flush(self: USART, timeout: ?u32) error{Timeout}!void {
    const delay = time.absolute(timeout);

    while (!self.registers.SR.read().TC) {
        if (delay.isReached()) return error.Timeout;
    }
}

pub fn isHasRead(self: USART) bool {
    return self.registers.SR.read().RXNE != 0;
}

/// For now 9 bit data without parity bit will not work :)
// pub fn transmitBlocking(_: USART, _: []const u8, _: ?u32) error{Timeout}!void {}
pub fn transmitBlocking(self: USART, buffer: []const u8, timeout: ?u32) error{Timeout}!void {
    const delay = time.absolute();

    const regs = self.registers;
    for (buffer) |b| {
        // I may be able to remove this one?
        if (delay.isReached(timeout)) return error.Timeout;

        while (regs.SR.read().TXE != 1) { // 等待TDR数据发送出去(未发送出去会报错)
            // Or maybe this one is not needed?
            // if (delay.isReached(timeout)) return error.Timeout;
        }

        regs.DR.modify(.{ .DR = b });
    }
    while (regs.SR.read().TC != 1) {} // 确保最后一个字符发出去
}

pub const ReadError = error{
    Timeout,
    Frame,
    Parity,
    Overrun,
};

pub fn readBlocking(self: USART, buffer: []u8, timeout: ?u32) ReadError!void {
    const delay = time.absolute();

    const regs = self.registers;
    for (buffer) |*b| {
        // I may be able to remove this one?
        if (delay.isReached(timeout)) return error.Timeout;

        while (!try self.checkRXflags()) {
            // Or maybe this one is not needed?
            if (delay.isReached(timeout)) return error.Timeout;
        }

        // TODO: Handle flags on 9-bit transmission
        b.* = @truncate(regs.DR.read().DR);
    }
}

pub fn checkRXflags(self: USART) ReadError!bool {
    const sr = self.registers.SR.read();
    if (sr.RXNE == 1) {
        if (sr.ORE == 1) return error.Overrun;
        if (sr.PE == 1) return error.Parity;
        if (sr.FE == 1) return error.Frame;

        return true;
    }
    return false;
}

pub fn whithDMA(comptime usart: USART) WhithDMA(usart) {
    return .{};
}

fn WhithDMA(comptime usart: USART) type {
    return struct {
        const Self = @This();
        pub inline fn apply(self: Self, config: Config) void {
            applyImpl(usart, config);
            self.enable();
        }
        pub inline fn enable(_: Self) void {
            dma.enable();
            usart.registers.CR3.modify(.{ .DMAT = 1 });
        }
        pub fn start(_: Self, buffer: []u8, options: dma.TransferOptions) dma.Error!dma.Transfer {
            const transfer = try dma.write(u8, buffer, .{ .usart = .one }, options);
            return transfer;
        }
        pub fn send(_: Self, buffer: []const u8, timeout: ?u32) error{Timeout}!void {
            return transmitBlocking(usart, buffer, timeout);
        }
    };
}
