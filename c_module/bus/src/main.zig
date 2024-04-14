const std = @import("std");
const sub = @cImport(@cInclude("sum.h"));

pub fn main() void {
    const val = sub.sum(2, 3);
    std.debug.print("val:{}\n", .{val});
}

test "simple test" {
    var list = std.ArrayList(i32).init(std.testing.allocator);
    defer list.deinit(); // try commenting this out and see if zig detects the memory leak!
    try list.append(42);
    try std.testing.expectEqual(@as(i32, 42), list.pop());
}
