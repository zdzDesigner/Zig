const std = @import("std");

const clocks = @import("clocks.zig");
const hal = @import("hal.zig");

const strings = @import("util");
const uart = hal.USART.USART1;

// const SCALE = if (@import("builtin").mode == .Debug) 20 else 1;
const SCALE = 1;
pub inline fn uscount(us: u32) u32 {
    return us * (clocks.systemCoreClockFrequency() / 1_000_000) / SCALE;
}

// TODO:: 查询法
pub fn delay_us(us: u32) void {
    // var wait_loop_index = us * (clocks.systemCoreClockFrequency() / 1_000_000) / SCALE;
    // uart.transmitBlocking(strings.intToStr(50, "wait_loop_index:{}\r\n", wait_loop_index), null) catch unreachable;
    var wait_loop_index = uscount(us);
    while (wait_loop_index != 0) {
        wait_loop_index -= 1;
    }
}

pub fn delay_ms(ms: u32) void {
    delay_us(ms * 1000);
}
pub fn cycms(ms: u32) void {
    // delay_us(ms * 1000);
    while (!hal.isCycTick(ms)) {}
}

pub fn absolute() Absolute {
    return @enumFromInt(hal.getTick()); // 记录初始时间
}

pub const Absolute = enum(u32) {
    _,

    pub inline fn isReached(self: Absolute, timeout: ?u32) bool {
        const n = timeout orelse return false;
        // return hal.getTick() - self.to_ms() > n; // 实时时间 - 初始时间 > timeout
        return hal.getTick() - self.oldTick() > n; // 实时时间 - 初始时间 > timeout
    }

    pub inline fn oldTick(self: Absolute) u32 {
        return @intFromEnum(self);
    }
};
