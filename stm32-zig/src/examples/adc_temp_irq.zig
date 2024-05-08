const std = @import("std");
const hal = @import("hal");
const time = hal.time;
const clocks = hal.clocks;
const strings = @import("util");
const interrupts = hal.interrupts;
const GPIO = hal.GPIO;
const adc = hal.ADC;
const adc1 = adc.ADC1;
const USART = hal.USART;

pub const Callbacks = struct {
    pub fn ADC1() void {
        if (adc1.read()) |val| {
            _ = val;
        }
        adc1.registers.SR.modify(.{ .EOC = 0 });
    }
};

pub fn main() void {
    hal.init();

    interrupts.DeviceInterrupt.enable(.ADC1_2);
    const uart = USART.USART1;
    uart.apply(.{});

    adc1.apply(.{
        .interrupt = true,
        .mode = .continuous,
        // .mode = .single,
        .channels = &.{
            adc.Channel.temperature,
            // adc.Channel.Vref,
            // Default sampling cycles is 1.5, but you can change it
            // adc.Channel.A0.withSamplingCycles(.@"7.5"),
        },
    }) catch @panic("Failed to enable ADC");

    adc1.start();
    while (true) {
        // 0x40012400
        // const registers = adc1.registers;
        // _ = registers;
        // const EOCIE = adc1.registers.CR1.read().EOCIE;
        // _ = EOCIE;
        // const EOC = adc1.registers.SR.read().EOC;
        // _ = EOC;

        // const value = adc1.waitAndRead(1000) catch continue;
        // _ = value;
        // var v = @as(f16, @floatFromInt(value)) * 3.3 / 4096;
        // v = ((1.43 - v) * 1000 / 43) + 25;
        // // 测试 d 打印
        // uart.transmitBlocking(strings.intToStr2(30, "Vref:{d}\r\n", .{v}), null) catch unreachable;
        // uart.transmitBlocking(strings.intToStr2(30, "xx:Vref:{d}\r\n", .{@trunc(v * 100) / 100}), null) catch unreachable;
        // uart.transmitBlocking(strings.intToStr2(30, "hz:{d}\r\n", .{time.uscount(300 * 1000)}), null) catch unreachable;
        // uart.transmitBlocking(strings.intToStr2(30, "hz:{d}\r\n", .{clocks.systemCoreClockFrequency()}), null) catch unreachable;
        //
        // const inum = @as(i16, @intFromFloat(v));
        // const fnum = @as(i16, @intFromFloat((v - @as(f16, @floatFromInt(inum))) * 100));
        // uart.transmitBlocking(strings.intToStr2(30, "Vref:{}.{}\r\n", .{ inum, fnum }), null) catch unreachable;
        // // led.write(@intFromBool(value < 1000));
        // time.delay_ms(300);
    }
}
