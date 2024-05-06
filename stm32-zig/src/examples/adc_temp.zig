const std = @import("std");
const hal = @import("hal");
const time = hal.time;
const strings = @import("util");
const GPIO = hal.GPIO;
const adc = hal.ADC;
const USART = hal.USART;

pub fn main() void {
    hal.init();

    const uart = USART.USART1;
    uart.apply(.{});

    const adc1 = adc.ADC1;
    adc1.apply(.{
        .channels = &.{
            // adc.Channel.temperature,
            adc.Channel.Vref,
            // Default sampling cycles is 1.5, but you can change it
            // adc.Channel.A0.withSamplingCycles(.@"7.5"),
        },
    }) catch @panic("Failed to enable ADC");

    // GPIO.Port.enable(.A);
    // const x = GPIO.init(.A, 4);
    // x.asInput(.analog);

    while (true) {
        adc1.start();
        const value = adc1.waitAndRead(1000) catch continue;
        var v = @as(f16, @floatFromInt(value)) * 3.3 / 4096;
        v = ((1.43 - v) * 1000 / 43) + 25;
        const inum = @as(i16, @intFromFloat(v));
        const fnum = @as(i16, @intFromFloat((v - @as(f16, @floatFromInt(inum))) * 100));
        uart.transmitBlocking(strings.intToStr2(30, "Vref:{}.{}\r\n", .{ inum, fnum }), null) catch unreachable;
        // led.write(@intFromBool(value < 1000));
        time.delay_ms(300);
    }
}
