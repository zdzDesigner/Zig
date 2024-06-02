const hal = @import("hal");
const chip = @import("chip");
const strings = @import("util");
const SCB = chip.peripherals.SCB;
const RCC = chip.peripherals.RCC;
const FLASH = chip.peripherals.FLASH;
const time = hal.time;
const USART = hal.USART;
// const usart = USART.USART1;

// var count: u32 = 0;
var usart1_count: u32 = 0;
pub const VectorTable = struct {
    pub fn USART1() callconv(.C) void {
        // if (usart.isHasRead()) {
        //     writeResponse();
        // }
    }
};

pub fn main() void {
    hal.init();

    // usart.apply(.{ .receiver_irq = true });
    const usart = USART.USART1.whithDMA();
    usart.apply(.{});

    const buf: []const u8 = strings.intToStr(20, "encode:{s}\r\n", "");
    _ = usart.start(buf[0..], .{}) catch unreachable;

    while (true) {
        // usart1_count += 1;
        // const pri = hal.interrupts.Priority{ .preemptive = 15, .sub = 0 };
        // _ = pri;
        // usart.transmitBlocking(strings.intToStr(20, "encode:{}\r\n", pri.encode()), null) catch unreachable;
        // usart.transmitBlocking(strings.intToStr(20, "encodeU16:{}\r\n", pri.encodeU16()), null) catch unreachable;
        // usart.transmitBlocking(strings.intToStr(50, "system_core_clock_frequency:{}\r\n", hal.clocks.systemCoreClockFrequency()), null) catch unreachable;
        // usart.transmitBlocking(strings.intToStr(50, "usart1_count:{}\r\n", usart1_count), null) catch unreachable;

        // time.delay_ms(5000);
    }

    // var buf: [10]u8 = undefined;
    // usart.readBlocking(&buf, null) catch unreachable;

}

fn writeResponse() void {
    // var buf: [1]u8 = undefined;
    // usart.readBlocking(&buf, null) catch unreachable;
    // if (buf[0] == '\r' or buf[0] == '\n') { // 13 or 10
    //     usart.transmitBlocking(strings.intToStr(30, "{s}\r\n", ""), null) catch unreachable;
    // } else {
    //     usart.transmitBlocking(strings.intToStr(30, "{s}", buf), null) catch unreachable;
    // }
}
