const std = @import("std");

test "stderr:" {
    // // var buf: [2]u8 = undefined;
    // const reader = std.io.getStdIn().reader();
    //
    // while (true) {
    //     const k = try reader.readByte();
    //     std.debug.print("buf:{c}\n", .{k});
    //     // if (k == 'S') break;
    //     // _ = reader.readUntilDelimiterOrEof(&buf, '\n') catch |err| {
    //     //     std.debug.print("err:{}\n", .{err});
    //     //     @panic("");
    //     // };
    //     // std.debug.print("size:{}\n", .{size});
    //     // std.debug.print("buf:{c}\n", .{k});
    // }
}

test "print:" {
    try std.io.getStdOut().writer().print("getStdOut:{s}\n", .{"xxxxxx-out"});
    try std.io.getStdErr().writer().print("getStdErr:{s}\n", .{"xxxxxx-err"});
}
