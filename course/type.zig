const std = @import("std");

pub fn main() void {
    const val: u8 = 2;

    std.debug.print("conv u8 to u32 :{d}\n", .{@intCast(u32, val)});
}
