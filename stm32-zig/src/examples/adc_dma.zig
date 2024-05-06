const hal = @import("hal");
const strings = @import("util");
const GPIO = hal.GPIO;
const adc = hal.ADC;
const dma = hal.dma;
const uart = hal.USART.USART1;

pub fn main() void {
    hal.init();
    uart.apply(.{});

    const adc1 = adc.ADC1.withDMA();
    adc1.apply(.{
        .channels = &.{
            // adc.Channel.A0,
            // adc.Channel.A1,
            // adc.Channel.temperature,
            // You can repeat channels
            // adc.Channel.A1,
            // Default sampling cycles is 1.5, but you can change it
            // adc.Channel.A2.withSamplingCycles(.@"7.5"),
            // ===========
            adc.Channel.A4,
            adc.Channel.A5,
        },
    }) catch @panic("Failed to enable ADC");

    GPIO.Port.enable(.A);
    const x = GPIO.init(.A, 4);
    // const y = GPIO.init(.A, 5);
    x.asInput(.analog);
    // y.asInput(.analog);

    // var buf: [2]u16 = undefined;
    var buf: [1]u16 = undefined;
    while (true) {
        const transfer = adc1.start(&buf) catch continue;
        transfer.wait(1000) catch unreachable;
        // transfer.wait(null) catch continue;

        uart.transmitBlocking(strings.intToStr(10, "x:{}\r\n", buf[0]), null) catch unreachable;
        // uart.transmitBlocking(strings.intToStr(10, "y:{}\r\n", buf[1]), null) catch unreachable;
        hal.time.delay_ms(300);
    }
}
