const std = @import("std");
const iterator = @import("util/iterator.zig");

pub fn main() !void {
    var str_iter = iterator.GenIterator([]const u8).init(&.{ "aaa", "bbb" });
    std.debug.print("iter:{}\n", .{str_iter});
    std.debug.print("{s}\n", .{str_iter.next().?});
    std.debug.print("{s}\n", .{str_iter.next().?});

    var int_iter = iterator.GenIterator(u32).init(&[_]u32{ 1, 2 });
    std.debug.print("iter:{}\n", .{int_iter});
    std.debug.print(":{}\n", .{int_iter.next().?});
    std.debug.print(":{}\n", .{int_iter.next().?});

    const str_iter2 = iterator.GenIterator([]const u8).init(&.{ "aaa", "bbb" });
    std.debug.print("iter:{}\n", .{str_iter2});
    std.debug.print("slice:{s}\n", .{str_iter2.list.ptr[0..1]});

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
