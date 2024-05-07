const std = @import("std");

test "std.mem.indexOfDiff:" {
    std.debug.print("indexOfDiff:{any}\n", .{std.mem.indexOfDiff(u8, "bbb", "bbb")}); // null
    std.debug.print("indexOfDiff:{any}\n", .{std.mem.indexOfDiff(u8, "bbb", "bbc")}); // 2
}
