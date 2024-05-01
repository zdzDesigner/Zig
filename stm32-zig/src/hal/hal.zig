const std = @import("std");
const assert = std.debug.assert;

const chip = @import("chip");
const comptimePrint = std.fmt.comptimePrint;

const rcc = @import("rcc.zig");
pub const GPIO = @import("GPIO.zig");
pub const adc = @import("adc.zig");
pub const clocks = @import("clocks.zig");
pub const time = @import("time.zig");
pub const interrupts = @import("interrupts.zig");
pub const USART = @import("USART.zig");
pub const dma = @import("dma.zig");

pub const VectorTable = @import("vector_table.zig").VectorTable;

pub fn init_test() void {
    const RCC = chip.peripherals.RCC;
    var hseon: u1 = 0;
    if (RCC.CR.read().HSEON == 0) {
        hseon = 0;
    } else {
        hseon = 1;
    }

    RCC.CR.modify(.{ .HSEON = 1 });
    var i: u32 = 0;
    while (RCC.CR.read().HSERDY == 0 and i < 100) : (i += 1) {
        hseon = 0;
    }
    hseon = 1;
    if (RCC.CR.read().HSERDY == 0) {
        hseon = 0;
    }
    hseon = 1;
}
pub fn init() void {
    const FLASH = chip.peripherals.FLASH;
    rcc.reset(); // debug purposes
    // rcc.openHSE(rcc.rcc_reg);
    const pll = clocks.PLL{ .multiplier = 9, .frequency = 72 * clocks.MHz, .source = .{ .hse = clocks.HSE{} } };
    clocks.Config.apply(.{ .sys = clocks.PLL.asOscillator(pll), .pll = pll, .pclk2_frequency = 72 * clocks.MHz }, .{}) catch undefined;
    FLASH.ACR.modify(.{ .PRFTBE = 1 });
    interrupts.setNVICPriorityGroup(.g4);
    configTick();
}

pub fn configTick() void {
    const TICK = chip.peripherals.STK;

    // MAX clock frequency is 72 MHz. Div by 1000 uses less than 24 bits
    const ticks: u24 = @truncate(clocks.systemCoreClockFrequency() / 1000); // 72是1us
    // const ticks: u24 = 72000; // 72是1us  (rcc.openHSE)

    tick = @as(u32, ticks - 1);

    TICK.LOAD.modify(.{ .RELOAD = ticks - 1 });

    interrupts.CortexM3Interrupt.setPriority(.SysTick, .{ .preemptive = 15, .sub = 0 });

    TICK.VAL.raw = 0;
    // TICK.CTRL.raw = 0b011; // 开启中断, 外部时钟源
    // TICK.CTRL.modify(.{ .ENABLE = 1, .TICKINT = 1, .CLKSOURCE = 0 });
    TICK.CTRL.modify(.{ .ENABLE = 1, .TICKINT = 1, .CLKSOURCE = 1 });
    // CLKSOURCE: 0: AHB/8, 1: Processor clock (AHB)
}

var tick: u32 = 0;
pub fn isTick(timeout: u32) bool {
    // return tick % time.uscount(timeout) == 0;
    return tick % timeout == 0;
}
pub fn getTick() u32 {
    return tick;
}

pub fn incrementTick() void {
    // tick = if (tick != 0) (tick - 1) else (72000 - 1);
    tick = switch (tick) {
        0 => 72000 - 1,
        else => tick - 1,
    };
}
