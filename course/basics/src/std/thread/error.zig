const std = @import("std");

fn mybeError() !void {
    return error.ErrNothing;
}
test "return error:" {
    const sid = std.Thread.spawn(.{}, mybeError, .{}) catch |err| {
        std.debug.print("err:{}\n", .{err});
        unreachable;
    };

    // sid.join();
    // std.Thread.getHandle(sid);

    std.debug.print("sid:{}\n", .{sid});

    // sid.yield();
}
