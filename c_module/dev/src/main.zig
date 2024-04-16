const std = @import("std");
const bus = @cImport(@cInclude("bus_math.h"));

pub fn main() void {
    const val = bus.fib(10);
    std.log.info("val:{}", .{val});
}
