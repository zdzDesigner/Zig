const std = @import("std");

const chip = @import("chip");

const rcc = @import("rcc.zig");
pub const GPIO = @import("GPIO.zig");
pub const adc = @import("adc.zig");
pub const clocks = @import("clocks.zig");
pub const time = @import("time.zig");
pub const interrupts = @import("interrupts.zig");
pub const USART = @import("USART.zig");
pub const dma = @import("dma.zig");

pub const VectorTable = @import("vector_table.zig").VectorTable;

pub fn init() void {
    const FLASH = chip.peripherals.FLASH;
    rcc.reset(); // debug purposes
    rcc.openHSE();
    FLASH.ACR.modify(.{ .PRFTBE = 1 });
    interrupts.setNVICPriorityGroup(.g4);
    configTick();
}

pub fn configTick() void {
    const TICK = chip.peripherals.STK;

    // MAX clock frequency is 72 MHz. Div by 1000 uses less than 24 bits
    const ticks: u24 = @truncate(clocks.systemCoreClockFrequency() / 1000);

    TICK.LOAD_.modify(.{ .RELOAD = ticks });

    interrupts.CortexM3Interrupt.setPriority(.SysTick, .{ .preemptive = 15, .sub = 0 });

    TICK.VAL.raw = 0;
    TICK.CTRL.raw = 0b111;
}

var tick: u32 = 0;

pub fn getTick() u32 {
    return tick;
}

pub fn incrementTick() void {
    tick +%= 1;
}
