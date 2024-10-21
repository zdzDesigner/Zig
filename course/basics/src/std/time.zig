const std = @import("std");

test "os sleep" {
    std.debug.print(": 3s\n", .{});
    std.debug.print("{s:10}:{d:>15}\n", .{ "begin", std.time.timestamp() });
    // std.time.sleep(1000000000 * 3);
    std.debug.print("{s:10}:{d:>15}\n", .{ "end", std.time.timestamp() });

    std.debug.print("{s:10}:{d:>15}\n", .{ "mill", std.time.milliTimestamp() });
    try std.testing.expect(true);
}
