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

test "bytesAsValue:" {
    const v = "\xEF\xBE\xAD\xDE";
    std.debug.print("v:{X}\n", .{std.mem.bytesAsValue(u32, v).*}); // v:DEADBEEF

    const V = struct {
        NO: bool,
        ID: u8,
    };

    std.debug.print("v:{}\n", .{std.mem.bytesToValue(V, "\x01\x08")}); // {.NO = true, .ID = 8}
}

test "std.mem.startsWith:" {
    std.debug.print("startsWith:{}\n", .{std.mem.startsWith(u8, "name", "n")}); // true
}

// 字符串会自动转换[*:0]const u8, [:0] const u8, [] const u8
test "span:" {
    const str: [*:0]const u8 = "xxx";
    const v = std.mem.span(str);

    std.debug.print("span:{}\n", .{@TypeOf(v)}); // [:0] const u8
    std.debug.print("span:{any}\n", .{v}); // { 120, 120, 120 }
    std.debug.print("span:{s}\n", .{v}); // xxx

    // 自动转换的字符串 ================
    const str1: []const u8 = "xxx";
    std.debug.print("str1:{s}\n", .{str1});
    const str2: [:0]const u8 = "xxx";
    std.debug.print("str2:{s}\n", .{str2});
    const str3: [*:0]const u8 = "xxx";
    std.debug.print("str3:{s}\n", .{str3});
}

test "asBytes:" {
    const bs = @as(u32, 0xDEADBEEF);
    std.debug.print("bs to bytes:{any}\n", .{std.mem.asBytes(&bs)}); // { 239, 190, 173, 222 }
    const bs2: u64 = undefined;
    std.debug.print("bs to bytes:{any}\n", .{std.mem.asBytes(&bs2)}); // { 0, 0, 0, 0, 0, 0, 0, 0 }
    var bs3: u64 = undefined;
    std.debug.print("bs to bytes:{any}\n", .{std.mem.asBytes(&bs3)}); // { 170, 170, 170, 170, 170, 170, 170, 170 }

}
