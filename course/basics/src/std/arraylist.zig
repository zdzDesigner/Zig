const std = @import("std");

test "ArrayList:" {
    var buf = std.ArrayList(u8).init(std.testing.allocator);
    defer buf.deinit();
    try buf.append('a');
    try buf.append('b');

    std.debug.print("buf.item:{s}\n", .{buf.items});
}

test "ArrayList::str:" {
    var buf = std.ArrayList([]const u8).init(std.testing.allocator);
    defer buf.deinit();
    try buf.append("aa");
    try buf.append("bb");

    std.debug.print("buf.item:{s}\n", .{buf.items});
    std.debug.print("buf.items[0]:{s}\n", .{buf.items[0]});
}

const Player = struct {
    name: []const u8,
    isdead: bool,
};
test "MultiArrayList:" {
    const list = std.MultiArrayList(Player){};
    std.debug.print("list:{}\n", .{list});
}
