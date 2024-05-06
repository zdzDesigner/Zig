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
            adc.Channel.A4,
            // adc.Channel.A5,
            // Default sampling cycles is 1.5, but you can change it
            // adc.Channel.A0.withSamplingCycles(.@"7.5"),
        },
    }) catch @panic("Failed to enable ADC");

    GPIO.Port.enable(.A);
    const x = GPIO.init(.A, 4);
    // const y = GPIO.init(.A, 5);
    x.asInput(.analog);
    // y.asOutput(.{});

    while (true) {
        adc1.start();
        const value = adc1.waitAndRead(1000) catch continue;
        uart.transmitBlocking(strings.intToStr(10, "{}\r\n", value), null) catch unreachable;
        // led.write(@intFromBool(value < 1000));
        time.delay_ms(300);
    }
}
