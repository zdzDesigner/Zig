const std = @import("std");
const iterator = @import("util/iterator.zig");

pub fn main() !void {
    const str_iter = iterator.GenIterator([]const u8).init(&.{ "aaa", "bbb" });
    std.debug.print("iter:{}\n", .{str_iter});

    const int_iter = iterator.GenIterator(u32).init(&[_]u32{ 1, 2 });
    std.debug.print("iter:{}\n", .{int_iter});

    // !!! error: values of type '[]const comptime_int' must be comptime-known, but index value is runtime-known
    // const int_iter2 = iterator.GenIterator(comptime_int).init(&[_]comptime_int{ 1, 2 });
    // std.debug.print("iter:{}\n", .{int_iter2});
}

test "simple test" {
    var list = std.ArrayList(i32).init(std.testing.allocator);
    defer list.deinit(); // try commenting this out and see if zig detects the memory leak!
    try list.append(42);
    try std.testing.expectEqual(@as(i32, 42), list.pop());
}
