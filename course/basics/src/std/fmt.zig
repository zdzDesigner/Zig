const std = @import("std");

test "parseInt" {
    // 第三个参数 ?
    // 0:默认为10
    std.debug.print("\n", .{});
    std.debug.print("parseInt:{any}\n", .{std.fmt.parseInt(u32, "0x12", 0)}); // 18
    // std.debug.print("parseInt:{any}\n", .{std.fmt.parseInt(u32, "0x2", 10)}); // error.InvalidCharacter
    // std.debug.print("parseInt:{any}\n", .{std.fmt.parseInt(u32, "0x2", 16)}); // error.InvalidCharacter
    std.debug.print("parseInt:{any}\n", .{std.fmt.parseInt(u32, "12", 0)}); // 12
    std.debug.print("parseInt:{any}\n", .{std.fmt.parseInt(u32, "5", 16)}); // 5
    std.debug.print("parseInt:{any}\n", .{std.fmt.parseInt(u32, "11", 16)}); // 17
    std.debug.print("parseInt:{any}\n", .{std.fmt.parseInt(u32, "35", 16)}); // 53: 3*16 + 5
    std.debug.print("parseInt:{any}\n", .{std.fmt.parseInt(i55, "-15", 16)}); // -21
    std.debug.print("parseInt:{any}\n", .{std.fmt.parseInt(u32, "0xA", 0)}); // 10
    std.debug.print("parseInt:{any}\n", .{std.fmt.parseInt(u32, "0xa", 0)}); // 10
}

test "tostring:" {
    std.debug.print("comptimePrint:{s}\n", .{std.fmt.comptimePrint("aa:{}", .{99})});
}

// 无需堆上分配
inline fn intToStr(comptime size: comptime_int, comptime format: []const u8, val: anytype) []const u8 {
    var buf: [size]u8 = undefined;
    return std.fmt.bufPrint(&buf, format, .{val}) catch "\r\n";
}

test "int to str:" {
    std.debug.print("intToStr:{s}\n", .{intToStr(20, "ddd{}\r\n", 8)});
}

const fmtId = std.zig.fmtId;
test "fmtId" {
    const expectFmt = std.testing.expectFmt;
    try expectFmt("@\"while\"", "{}", .{fmtId("while")});
    try expectFmt("@\"while\"", "{p}", .{fmtId("while")});
    try expectFmt("@\"while\"", "{_}", .{fmtId("while")});
    try expectFmt("@\"while\"", "{p_}", .{fmtId("while")});
    try expectFmt("@\"while\"", "{_p}", .{fmtId("while")});

    try expectFmt("hello", "{}", .{fmtId("hello")});
    try expectFmt("hello", "{p}", .{fmtId("hello")});
    try expectFmt("hello", "{_}", .{fmtId("hello")});
    try expectFmt("hello", "{p_}", .{fmtId("hello")});
    try expectFmt("hello", "{_p}", .{fmtId("hello")});

    try expectFmt("@\"type\"", "{}", .{fmtId("type")});
    try expectFmt("type", "{p}", .{fmtId("type")});
    try expectFmt("@\"type\"", "{_}", .{fmtId("type")});
    try expectFmt("type", "{p_}", .{fmtId("type")});
    try expectFmt("type", "{_p}", .{fmtId("type")});

    try expectFmt("@\"_\"", "{}", .{fmtId("_")});
    try expectFmt("@\"_\"", "{p}", .{fmtId("_")});
    try expectFmt("_", "{_}", .{fmtId("_")});
    try expectFmt("_", "{p_}", .{fmtId("_")});
    try expectFmt("_", "{_p}", .{fmtId("_")});

    try expectFmt("@\"i123\"", "{}", .{fmtId("i123")});
    try expectFmt("i123", "{p}", .{fmtId("i123")});
    try expectFmt("@\"4four\"", "{}", .{fmtId("4four")});
    try expectFmt("_underscore", "{}", .{fmtId("_underscore")});
    try expectFmt("@\"11\\\"23\"", "{}", .{fmtId("11\"23")});
    try expectFmt("@\"11\\x0f23\"", "{}", .{fmtId("11\x0F23")});

    // These are technically not currently legal in Zig.
    try expectFmt("@\"\"", "{}", .{fmtId("")});
    try expectFmt("@\"\\x00\"", "{}", .{fmtId("\x00")});
}
