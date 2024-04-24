const std = @import("std");
const testing = std.testing;

pub var __bss_size: u8 = 3; // !!!zig 无法导出,从C 或 ld 导出

pub export fn add(a: i32, b: i32) i32 {
    return a + b;
}

test "basic add functionality" {
    try testing.expect(add(3, 7) == 10);
}
