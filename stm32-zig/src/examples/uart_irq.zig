const hal = @import("hal");
const chip = @import("chip");
const strings = @import("util");
const SCB = chip.peripherals.SCB;
const RCC = chip.peripherals.RCC;
const FLASH = chip.peripherals.FLASH;
const time = hal.time;
const USART = hal.USART;
const uart = USART.USART1;

// var count: u32 = 0;
var uart1_count: u32 = 0;
pub const VectorTable = struct {
    //     //     pub fn SysTick() callconv(.C) void {
    //     //         count += 1;
    //     //         if (hal.isCycTick(1000)) {
    //     //             // const pri = hal.interrupts.Priority{ .preemptive = 15, .sub = 0 };
    //     //             // uart.transmitBlocking(strings.intToStr(20, "encode:{}\r\n", pri.encode()), null) catch unreachable;
    //     //             // uart.transmitBlocking(strings.intToStr(20, "encodeU16:{}\r\n", pri.encodeU16()), null) catch unreachable;
    //     //             uart.transmitBlocking(strings.intToStr(20, "getTick:{}\r\n", hal.getTick()), null) catch unreachable;
    //     //             uart.transmitBlocking(strings.intToStr(50, "system_core_clock_frequency:{}\r\n", hal.clocks.systemCoreClockFrequency()), null) catch unreachable;
    //     //             uart.transmitBlocking(strings.intToStr(50, "================ count:{}\r\n", count), null) catch unreachable;
    //     //             uart.transmitBlocking(strings.intToStr(20, "RCC.CFGR.PPRE2:{}\r\n", RCC.CFGR.read().PPRE2), null) catch unreachable;
    //     //         }
    //     //         //
    //     //         hal.incrementTick();
    //     //     }
    pub fn USART1() callconv(.C) void {
        if (uart.isHasRead()) {
            // var buf: [1]u8 = undefined;
            // uart.readBlocking(&buf, null) catch unreachable; // 中断时,不读出去,无法发送
            writeResponse();
            // uart.transmitBlocking(strings.intToStr(20, "{s}", buf), null) catch unreachable;
            // uart1_count = 0;
        }
    }
};

pub fn main() void {
    hal.init();

    // const uart = USART.USART1;
    // uart.apply(.{});
    // uart.apply(.{ .transmitter_irq = true });
    uart.apply(.{ .receiver_irq = true });

    // uart.transmitBlocking("hello, worldx!\r\n", null) catch unreachable;

    // while (true) {
    //     var i: u32 = 0;
    //     while (i < 0xFFFFF) { // 硬等待
    //         i += 1;
    //     }
    //     uart.transmitBlocking("======================\r\n", null) catch unreachable;
    //     uart.transmitBlocking(strings.intToStr(20, "RCC.CR.HSION:{}\r\n", RCC.CR.read().HSION), null) catch unreachable;
    //     uart.transmitBlocking(strings.intToStr(20, "RCC.CR.HSEON:{}\r\n", RCC.CR.read().HSEON), null) catch unreachable;
    //     uart.transmitBlocking(strings.intToStr(20, "RCC.CR.PLLON:{}\r\n", RCC.CR.read().PLLON), null) catch unreachable;
    //     uart.transmitBlocking(strings.intToStr(20, "RCC.CFGR.SWS:{}\r\n", RCC.CFGR.read().SWS), null) catch unreachable;
    //     uart.transmitBlocking(strings.intToStr(20, "RCC.CFGR.SW:{}\r\n", RCC.CFGR.read().SW), null) catch unreachable;
    //     uart.transmitBlocking(strings.intToStr(20, "RCC.CR.HSERDY:{}\r\n", RCC.CR.read().HSERDY), null) catch unreachable;
    //     uart.transmitBlocking(strings.intToStr(30, "FLASH.ACR.LATENCY:{}\r\n", FLASH.ACR.read().LATENCY), null) catch unreachable;
    // }

    // uart.transmitBlocking(strings.intToStr(20, "RCC.CR:{}\r\n", RCC.CR.read()), null) catch unreachable;
    // CFGR

    // uart.transmitBlocking(strings.intToStr(20, "PRIGROUP:{}\r\n", SCB.AIRCR.read().PRIGROUP), null) catch unreachable;
    // time.delay_ms(100);

    while (true) {
        uart1_count += 1;
        const pri = hal.interrupts.Priority{ .preemptive = 15, .sub = 0 };
        uart.transmitBlocking(strings.intToStr(20, "encode:{}\r\n", pri.encode()), null) catch unreachable;
        uart.transmitBlocking(strings.intToStr(20, "encodeU16:{}\r\n", pri.encodeU16()), null) catch unreachable;
        uart.transmitBlocking(strings.intToStr(50, "system_core_clock_frequency:{}\r\n", hal.clocks.systemCoreClockFrequency()), null) catch unreachable;
        uart.transmitBlocking(strings.intToStr(50, "uart1_count:{}\r\n", uart1_count), null) catch unreachable;

        time.delay_ms(5000);
    }

    // var buf: [10]u8 = undefined;
    // uart.readBlocking(&buf, null) catch unreachable;

}

fn writeResponse() void {
    var buf: [1]u8 = undefined;
    uart.readBlocking(&buf, null) catch unreachable;
    if (buf[0] == '\r' or buf[0] == '\n') { // 13 or 10
        uart.transmitBlocking(strings.intToStr(30, "{s}\r\n", ""), null) catch unreachable;
    } else {
        uart.transmitBlocking(strings.intToStr(30, "{s}", buf), null) catch unreachable;
    }
}
