const std = @import("std");

fn closureScope(name: []const u8) void {
    const cfn = struct {
        fn handle() void {
            std.debug.print("name:{}\n", .{name});
        }
    };
    cfn.handle();
}

test "closure::args scope:" {
    closureScope("zdz");
}
