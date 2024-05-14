const std = @import("std");

test "stderr:" {
    try std.io.getStdOut().writer().print("aa:{s}", .{""});
    try std.io.getStdErr().writer().print("aa:{s}", .{""});
    try std.io.getStdIn().writer().print("stdin:{s}", .{"xx"});
    var buf: [100]u8 = undefined;
    const reader = std.io.getStdIn().reader();
    // const size = try std.io.getStdIn().reader().readAll(&buf);

    while (true) {
        _ = reader.readUntilDelimiterOrEof(&buf, '\n') catch |err| {
            std.debug.print("err:{}\n", .{err});
            @panic("");
        };
        // std.debug.print("size:{}\n", .{size});
        std.debug.print("buf:{s}\n", .{buf});
    }
}
