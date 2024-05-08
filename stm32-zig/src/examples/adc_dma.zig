const hal = @import("hal");
const strings = @import("util");
const GPIO = hal.GPIO;
const adc = hal.ADC;
const dma = hal.dma;
const uart = hal.USART.USART1;

var buf: [2]u16 = undefined;
fn completion() void {
    uart.transmitBlocking(strings.intToStr(30, "x:{}\r\n", buf[0]), null) catch unreachable;
}
pub const VectorTable = struct {
    pub fn DMA1_Channel1() callconv(.C) void {
        uart.transmitBlocking(strings.intToStr(30, "DMA1_Channel1:{}\r\n", buf[0]), null) catch unreachable;
        hal.VectorTable.DMA1_Channel1();
    }
};

pub fn main() void {
    hal.init();
    uart.apply(.{});

    const adc1 = adc.ADC1.withDMA();
    // const adc1 = adc.ADC1;
    adc1.apply(.{
        .mode = .continuous,
        .channels = &.{
            // adc.Channel.A0,
            // adc.Channel.A1,
            adc.Channel.temperature,
            // You can repeat channels
            // adc.Channel.A1,
            // Default sampling cycles is 1.5, but you can change it
            // adc.Channel.A2.withSamplingCycles(.@"7.5"),
            // ===========
            adc.Channel.A4,
            // adc.Channel.A5,
        },
    }) catch @panic("Failed to enable ADC");

    GPIO.Port.enable(.A);
    const x = GPIO.init(.A, 4);
    // const y = GPIO.init(.A, 5);
    x.asInput(.analog);
    // y.asInput(.analog);

    // var buf: [1]u16 = undefined;
    while (true) {
        defer {
            hal.time.delay_ms(100);
        }
        uart.transmitBlocking(strings.intToStr(30, "start-----:{s}\r\n", ""), null) catch unreachable;
        const transfer = adc1.start(&buf, .{}) catch |err| {
            // const transfer = adc1.start(&buf, .{ .priority = .high, .callbacks = .{ .on_completion = completion } }) catch |err| {
            uart.transmitBlocking(strings.intToStr(30, "error-----:{s}\r\n", @errorName(err)), null) catch unreachable;
            continue;
        };
        // transfer.wait(1000) catch unreachable;
        transfer.wait(null) catch |err| {
            uart.transmitBlocking(strings.intToStr(30, "wait-----:{s}\r\n", @errorName(err)), null) catch unreachable;
            continue;
        };

        uart.transmitBlocking(strings.intToStr(20, "x:{d}\r\n", buf[0]), null) catch unreachable;
        uart.transmitBlocking(strings.intToStr(20, "y:{}\r\n", buf[1]), null) catch unreachable;
    }
}
