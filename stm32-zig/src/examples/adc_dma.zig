const hal = @import("hal");
const strings = @import("util");
const interrupts = hal.interrupts;
const GPIO = hal.GPIO;
const adc = hal.ADC;
const dma = hal.dma;
const DMA1 = dma.DMA1;
const uart = hal.USART.USART1;

// var count: u16 = 0;
var buf: [2000]u16 = undefined;
// var buf: [200]u16 = undefined;
fn completion() void {
    // if (count > 100) return;
    // count += 1;
    // uart.transmitBlocking(strings.intToStr(3000, "buf:{any}\r\n", buf), null) catch unreachable;
    var x: u32 = 0;
    var y: u32 = 0;
    for (buf, 0..) |_, i| {
        if (i % 2 == 1) {
            y += buf[i];
            // uart.transmitBlocking(strings.intToStr2(30, "x:{},y:{}\r\n", .{ x, y }), null) catch unreachable;
        } else {
            x += buf[i];
        }
    }
    uart.transmitBlocking(strings.intToStr2(30, "x:{},y:{}\r\n", .{ x / 1000, y / 1000 }), null) catch unreachable;
    // uart.transmitBlocking(strings.intToStr2(30, "x:{},y:{}\r\n", .{ buf[0], buf[1] }), null) catch unreachable;
    // adc.ADC1.registers.SR.modify(.{ .EOC = 0 });
    // DMA1.IFCR.raw = @as(u32, 0b1111);

}
// pub const VectorTable = struct {
//     pub fn DMA1_Channel1() callconv(.C) void {
//         const v = buf;
//         _ = v;
//
//         // uart.transmitBlocking(strings.intToStr(30, "DMA1_Channel1:{}\r\n", buf[0]), null) catch unreachable;
//         hal.VectorTable.DMA1_Channel1();
//     }
// };

pub fn main() void {
    hal.init();
    uart.apply(.{});

    interrupts.DeviceInterrupt.enable(.DMA1_Channel1);
    // interrupts.DeviceInterrupt.setPriority(.DMA1_Channel1, .{ .preemptive = 15, .sub = 0 });
    const adc1 = adc.ADC1.withDMA();
    // uart.transmitBlocking(strings.intToStr(30, "-xxx----:{s}\r\n", ""), null) catch unreachable;
    // const adc1 = adc.ADC1;
    adc1.apply(.{
        .mode = .continuous,
        // .mode = .single,
        // .mode = .{ .discontinuous = 1 },
        .channels = &.{
            // adc.Channel.A0,
            // adc.Channel.A1,
            // adc.Channel.temperature,
            // adc.Channel.Vref,
            // You can repeat channels
            // adc.Channel.A1,
            // Default sampling cycles is 1.5, but you can change it
            // adc.Channel.A2.withSamplingCycles(.@"7.5"),
            // ===========
            adc.Channel.A4.withSamplingCycles(.@"239.5"),
            adc.Channel.A5.withSamplingCycles(.@"239.5"),
        },
    }) catch @panic("Failed to enable ADC");
    // uart.transmitBlocking(strings.intToStr(30, "-----:{s}\r\n", ""), null) catch unreachable;

    GPIO.Port.enable(.A);
    const x = GPIO.init(.A, 4);
    const y = GPIO.init(.A, 5);
    x.asInput(.analog);
    y.asInput(.analog);

    // var buf: [1]u16 = undefined;
    // _ = adc1.start(&buf, .{}) catch |err| {
    const option = .{ .priority = .high, .callbacks = .{ .on_completion = completion } };
    _ = adc1.start(&buf, option) catch |err| {
        uart.transmitBlocking(strings.intToStr(30, "error-----:{s}\r\n", @errorName(err)), null) catch unreachable;
    };
    while (true) {}

    // ==============================
    // while (true) {
    //     defer {
    //         hal.time.delay_ms(100);
    //     }
    //     const transfer = adc1.start(&buf, .{}) catch |err| {
    //         uart.transmitBlocking(strings.intToStr(30, "error-----:{s}\r\n", @errorName(err)), null) catch unreachable;
    //         continue;
    //     };
    //     transfer.wait(null) catch |err| {
    //         uart.transmitBlocking(strings.intToStr(30, "wait-----:{s}\r\n", @errorName(err)), null) catch unreachable;
    //         continue;
    //     };
    //     uart.transmitBlocking(strings.intToStr2(30, "x:{},y:{}\r\n", .{ buf[0], buf[1] }), null) catch unreachable;
    // }
}
