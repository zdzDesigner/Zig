const std = @import("std");
const testing = std.testing;

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
    std.debug.print("parseInt:{any}\n", .{std.fmt.parseInt(u32, "11", 2)}); // 3

    const val = try std.fmt.allocPrint(testing.allocator, "{b}", .{11});
    defer testing.allocator.free(val);
    std.debug.print("unparseInt:{s}\n", .{val}); // 1011
}

test "parseFloat" {
    std.debug.print("parseFloat:{any}\n", .{std.fmt.parseFloat(f32, "23")});
    std.debug.print("parseFloat:{any}\n", .{std.fmt.parseFloat(f64, "23")});
    std.debug.print("parseFloat:{any}\n", .{std.fmt.parseFloat(f32, "0x23")});
}

test "formatFloat" {
    var buf: [100]u8 = undefined;
    const fval: f32 = 24234;
    std.debug.print("formatFloat:{s}\n", .{try std.fmt.formatFloat(&buf, fval, .{})});
}

test "formatInt" {
    // std.fmt.formatInt(value: anytype, base: u8, case: Case, options: FormatOptions, writer: anytype)
}

test "bytesToHex" {
    // const v: u8 = 32;
    // std.debug.print("hex:{any}\n", .{std.fmt.bytesToHex(v, .lower)});
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

test "fmt::count:" {
    std.debug.print("count:{}\n", .{std.fmt.count("aa:{s}", .{"cc"})}); // 5
}

// int to string =======================
pub inline fn intToStr(comptime size: comptime_int, comptime format: []const u8, val: anytype) []const u8 {
    var buf: [size]u8 = undefined;
    return std.fmt.bufPrint(&buf, format, val) catch "\r\n";
}
test "merge string:" {
    std.debug.print("merge string:{s}\n", .{intToStr(10, "val:{s}", .{"xxx"})});
}

test "int to str:" {
    std.debug.print("intToStr:{s}\n", .{intToStr(20, "ddd{}\r\n", .{8})});
}

// 内部实现, 编译器完成计算
pub inline fn comptimePrint(comptime fmt: []const u8, args: anytype) *const [std.fmt.count(fmt, args):0]u8 {
    comptime {
        var buf: [std.fmt.count(fmt, args):0]u8 = undefined;
        _ = std.fmt.bufPrint(&buf, fmt, args) catch unreachable;
        buf[buf.len] = 0;
        const final = buf;
        return &final;
    }
}

// comptimePrint 会调用 bufPrint
test "comptimePrint:" {
    std.debug.print("comptimePrint:{s}\n", .{std.fmt.comptimePrint("aa:{}", .{99})}); // aa:99
    std.debug.print("comptimePrint:{s}\n", .{std.fmt.comptimePrint("aa:{s}", .{"bb"})}); // aa:bb
    const v = 33;
    std.debug.print("comptimePrint:{s}\n", .{std.fmt.comptimePrint("aa:{d}", .{v})}); // aa:33
}

test "int to hex:" {
    std.debug.print("hex:{any}\n", .{std.fmt.bytesToHex("32", .lower)});
    std.debug.print("hex:{s}\n", .{std.fmt.comptimePrint("0x{x}", .{32})}); // aa:33
}

// 分配
test "allocPrint:" {
    const v = try std.fmt.allocPrint(std.testing.allocator, "{s}", .{"vvvvvvvvvv"});
    defer std.testing.allocator.free(v);
    std.debug.print("v:{s}\n", .{v});
}

test "allocPrintZ:" {}
