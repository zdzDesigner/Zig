const std = @import("std");

test "print" {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("========\n", .{});
    try stdout.print("{}\n", .{true});
    std.debug.print("{}\n", .{true});
}
