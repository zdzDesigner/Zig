const hal = @import("hal");
const chip = @import("chip");
const strings = @import("util");
const SCB = chip.peripherals.SCB;
const RCC = chip.peripherals.RCC;
const time = hal.time;
const USART = hal.USART;

pub fn main() void {
    hal.init();

    const uart = USART.USART1;
    uart.apply(.{});

    while (true) {
        var i: u32 = 0;
        // uart.transmitBlocking("hello, worldx!\n", null) catch unreachable;
        while (i < 0xFFFFF) { // 硬等待
            i += 1;
        }

        // uart.transmitBlocking("hello, worldx!\r\n", null) catch unreachable;

        uart.transmitBlocking("======================\r\n", null) catch unreachable;
        uart.transmitBlocking(strings.intToStr(20, "RCC.CR.HSION:{}\r\n", RCC.CR.read().HSION), null) catch unreachable;
        uart.transmitBlocking(strings.intToStr(20, "RCC.CR.HSEON:{}\r\n", RCC.CR.read().HSEON), null) catch unreachable;
        uart.transmitBlocking(strings.intToStr(20, "RCC.CR.PLLON:{}\r\n", RCC.CR.read().PLLON), null) catch unreachable;
        uart.transmitBlocking(strings.intToStr(20, "RCC.CFGR.SWS:{}\r\n", RCC.CFGR.read().SWS), null) catch unreachable;
        uart.transmitBlocking(strings.intToStr(20, "RCC.CR.HSERDY:{}\r\n", RCC.CR.read().HSERDY), null) catch unreachable;

        // uart.transmitBlocking(strings.intToStr(20, "RCC.CR:{}\r\n", RCC.CR.read()), null) catch unreachable;
        // CFGR

        // uart.transmitBlocking(strings.intToStr(20, "PRIGROUP:{}\r\n", SCB.AIRCR.read().PRIGROUP), null) catch unreachable;
        // time.delay_ms(100);

        // const pri = hal.interrupts.Priority{ .preemptive = 15, .sub = 0 };
        // uart.transmitBlocking(strings.intToStr(20, "encode:{}\r\n", pri.encode()), null) catch unreachable;
        // uart.transmitBlocking(strings.intToStr(20, "encodeU16:{}\r\n", pri.encodeU16()), null) catch unreachable;
        // time.delay_ms(1000);

        // var buf: [10]u8 = undefined;
        // uart.readBlocking(&buf, null) catch unreachable;
    }
}
