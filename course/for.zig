const std = @import("std");

pub fn main() void {
    const arrs = [_]u8{ 2, 5, 6, 7, 8 };

    for (arrs) |item, i| {
        std.debug.print("index:{d},item:{d}\n", .{ i, item });
    }
    for (arrs[0..]) |item, i| {
        std.debug.print("index:{d},item:{d}\n", .{ i, item });
    }
}
test "test for" {
    
    // 0.11 支持
    // for (0..10) |_, i| {
    // }
}
