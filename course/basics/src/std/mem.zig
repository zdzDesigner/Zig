const std = @import("std");

test "copy::copyForwards:" {
    const source = "ccccx";
    var buf: [source.len]u8 = undefined;
    std.mem.copyForwards(u8, &buf, source);

    std.debug.print("buf:{s}\n", .{buf});

    var buf2: [8]u8 = std.mem.zeroes([8]u8);
    std.mem.copyForwards(u8, buf2[0..2], "FF");
    std.mem.copyForwards(u8, buf2[2..4], "FA");
    std.mem.copyForwards(u8, buf2[4..6], "FA");
    std.mem.copyForwards(u8, buf2[6..8], "FA");
    std.debug.print("buf2:{s}\n", .{buf2});
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

test "tokenize:" {
    std.debug.print("tokenize:{}\n", .{std.mem.tokenize(u8, "aaa;bbb", ";")});
    var it = std.mem.tokenize(u8, "aaa;bbb", ";");
    while (it.next()) |item| {
        std.debug.print("item:{s}\n", .{item});
    }

    // std.mem.split(comptime T: type, buffer: []const T, delimiter: []const T);
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

// 开头 js:'name'.startsWith('na')
test "std.mem.startsWith:" {
    std.debug.print("startsWith:{}\n", .{std.mem.startsWith(u8, "name", "na")}); // true
}

fn typeInfo(v: anytype) void {
    const v_info = @typeInfo(v);

    std.debug.print("v_info:{any}\n", .{v_info});
}

// span 哨兵转slice, 对C ABI 转换
// 字符串会自动转换[*:0]const u8, [:0] const u8, [] const u8
test "span:" {
    std.debug.print("======\n", .{});

    const debug = struct {
        fn print(v: []const u8) void {
            std.debug.print("v:{s}\n", .{v});
        }
    };
    const str: [*:0]const u8 = "xxx";
    typeInfo(@TypeOf(str)); // size:builtin.Type.Pointer.Size.Many,
    // v_info:builtin.Type{
    //     .Pointer = builtin.Type.Pointer{
    //         .size = builtin.Type.Pointer.Size.Many,
    //         --------------------------------------
    //         .is_const = true,
    //         .is_volatile = false,
    //         .alignment = 1,
    //         .address_space = builtin.AddressSpace.generic,
    //         .child = u8,
    //         .is_allowzero = false,
    //         .sentinel = anyopaque@110e028
    //         -----------------------------
    //     }
    // }
    std.debug.print("type of str:{}\n", .{@TypeOf(str)}); // [*:0]const u8
    std.debug.print("str:{s}\n", .{str}); // xxx
    const v = std.mem.span(str);
    typeInfo(@TypeOf(v)); // size:builtin.Type.Pointer.Size.Slice
    // v_info:builtin.Type{
    //     .Pointer = builtin.Type.Pointer{
    //         .size = builtin.Type.Pointer.Size.Slice,
    //         ---------------------------------------
    //         .is_const = true,
    //         .is_volatile = false,
    //         .alignment = 1,
    //         .address_space = builtin.AddressSpace.generic,
    //         .child = u8,
    //         .is_allowzero = false,
    //         .sentinel = anyopaque@110f028
    //         -----------------------------
    //     }
    // }

    std.debug.print("span:{}\n", .{@TypeOf(v)}); // [:0] const u8
    std.debug.print("span:{any}\n", .{v}); // { 120, 120, 120 }
    std.debug.print("span:{s}\n", .{v}); // xxx

    // 自动转换的字符串 ================
    const str1: []const u8 = "xxx";
    typeInfo(@TypeOf(str1)); // sentinel:null
    // v_info:builtin.Type{
    //     .Pointer = builtin.Type.Pointer{
    //         .size = builtin.Type.Pointer.Size.Slice,
    //         ---------------------------------------
    //         .is_const = true,
    //         .is_volatile = false,
    //         .alignment = 1,
    //         .address_space = builtin.AddressSpace.generic,
    //         .child = u8,
    //         .is_allowzero = false,
    //         .sentinel = null
    //         ----------------
    //     }
    // }
    std.debug.print("str1:{s}\n", .{str1}); // xxx
    const str2: [:0]const u8 = "xxx";
    std.debug.print("str2:{s}\n", .{str2}); // xxx
    debug.print(str2);
    const str3: [*:0]const u8 = "xxx";
    std.debug.print("str3:{s}\n", .{str3}); // xxx
}

test "asBytes:" {
    const bs = @as(u32, 0xDEADBEEF);
    std.debug.print("bs:{}\n", .{bs});
    std.debug.print("bs to bytes:{any}\n", .{std.mem.asBytes(&bs)}); // { 239, 190, 173, 222 }, 0xDE:222
    const bs2: u64 = undefined;
    std.debug.print("bs to bytes:{any}\n", .{std.mem.asBytes(&bs2)}); // { 0, 0, 0, 0, 0, 0, 0, 0 }
    var bs3: u64 = undefined;
    std.debug.print("bs to bytes:{any}\n", .{std.mem.asBytes(&bs3)}); // { 170, 170, 170, 170, 170, 170, 170, 170 }

}

test "indexOfPos:" {
    std.debug.print("indexOfPos:{d}\n", .{std.mem.indexOfPos(u8, "ab", 0, "").?}); // 0
}

// 至少包含
test "containsAtLeast:" {
    std.debug.print("字符串(元素)是否包含:{}\n", .{std.mem.containsAtLeast(u8, "day xx", 1, "day")}); // true
}
