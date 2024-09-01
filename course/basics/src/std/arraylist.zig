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

// FieldEnum 取出filed
test "MultiArrayList:" {
    // const list = std.MultiArrayList(Player){};
    var list = std.MultiArrayList(Player){};
    defer list.deinit(std.testing.allocator);
    std.debug.print("MultiArrayList::list:{}\n", .{list});
    try list.append(std.testing.allocator, Player{
        .name = "zdz",
        .isdead = false,
    });
    try list.append(std.testing.allocator, Player{
        .name = "zym",
        .isdead = true,
    });

    std.debug.print("list.items:{s}\n", .{list.items(.name)});
    std.debug.print("list.items:{any}\n", .{list.items(.isdead)});
}

test "toOwnedSlice:" {
    var list = std.ArrayList(Player).init(std.testing.allocator);
    defer list.deinit();

    try list.append(.{ .name = "111", .isdead = true });
    try list.append(.{ .name = "222", .isdead = false });
    try list.append(.{ .name = "333", .isdead = true });
    try list.append(.{ .name = "444", .isdead = true });
    try list.append(.{ .name = "555", .isdead = false });
    // std.debug.print("list:{}\n", .{list});

    const listitems = list.items.ptr[0..];
    std.debug.print("items =========== \n:{any}\n", .{listitems});

    const list_own = try list.toOwnedSlice();
    std.debug.print("list_own =========== \n:{any}\n", .{list_own});
    defer std.testing.allocator.free(list_own); // 单个释放

    const listcap = list.allocatedSlice();
    std.debug.print("listcap:{any}\n", .{listcap});
    defer std.testing.allocator.free(listcap); // 单个释放
}

test "toOwnedSlice::arena:" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit(); // 统一释放, 无需单个释放
    var list = std.ArrayList(Player).init(arena.allocator());

    try list.append(.{ .name = "111", .isdead = true });
    try list.append(.{ .name = "222", .isdead = false });
    try list.append(.{ .name = "333", .isdead = true });
    try list.append(.{ .name = "444", .isdead = true });
    try list.append(.{ .name = "555", .isdead = false });
    const listitems = list.items.ptr[0..];
    std.debug.print("items =========== \n:{any}\n", .{listitems});

    const list_own = try list.toOwnedSlice();
    std.debug.print("list_own =========== \n:{any}\n", .{list_own});

    const listcap = list.allocatedSlice();
    std.debug.print("listcap:{any}\n", .{listcap});
}
