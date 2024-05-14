const std = @import("std");

test "copy:" {
    const source = "ccccx";
    var buf: [source.len]u8 = undefined;
    std.mem.copyForwards(u8, &buf, source);

    std.debug.print("buf:{s}\n", .{buf});
}

test "std.mem.indexOfDiff:" {
    std.debug.print("indexOfDiff:{any}\n", .{std.mem.indexOfDiff(u8, "bbb", "bbb")}); // null
    std.debug.print("indexOfDiff:{any}\n", .{std.mem.indexOfDiff(u8, "bbb", "bbc")}); // 2
    // std.mem.indexOf
    // std.mem.indexOfScalar
}

test "alloctor::dupe:" {
    const allocator = std.testing.allocator;
    const val = try allocator.dupe(u8, "xxxx");
    defer allocator.free(val);
    const val2 = try allocator.dupe(u8, "/xxxx");
    defer allocator.free(val2);
    std.debug.print("val:{s}\n", .{val2});
}

test "join:" {
    const allocator = std.testing.allocator;
    const v = try std.mem.join(allocator, "/", &.{ "aa", "bb", "cc" });
    defer allocator.free(v);
    std.debug.print("v:{s}\n", .{v});
}

test "split:" {
    var listIter = std.mem.split(u8, "aa/bb/cc", "/");
    while (listIter.next()) |item| {
        std.debug.print("item:{s}\n", .{item});
    }
}
test "split::mutil:" {
    var listIter = std.mem.split(u8, "0x40020000:        0x00000005      0x00000000      0x000025a3      0x00000002", " ");
    while (listIter.next()) |item| {
        if (item.len == 0) continue;
        std.debug.print("item:{s},{}\n", .{ item, item.len });
    }
}

test "splitScalar:" {
    // tab 键
    var lineIter = std.mem.splitScalar(u8, "0x40020000:\n0x00000005\n0x00000000\n0x000025a3\n0x00000002", '\n');
    while (lineIter.next()) |item| {
        if (item.len == 0) continue;
        std.debug.print("item:{s},{}\n", .{ item, item.len });
    }
}
