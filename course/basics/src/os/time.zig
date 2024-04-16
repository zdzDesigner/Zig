const std = @import("std");

test "os sleep" {
    std.debug.print(": 3s\n", .{});
    std.debug.print("{s:10}:{d:>15}\n", .{ "begin", std.time.timestamp() });
    std.time.sleep(1000000000 * 3);
    std.debug.print("{s:10}:{d:>15}\n", .{ "end", std.time.timestamp() });
    try std.testing.expect(true);
}
