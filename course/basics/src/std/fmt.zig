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
