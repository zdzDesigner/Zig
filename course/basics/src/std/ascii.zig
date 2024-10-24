const std = @import("std");

test "isASCII:" {
    std.debug.print("isASCII:{}\n", .{std.ascii.isASCII('r')}); // true (< 128)
    std.debug.print("isASCII:{}\n", .{std.ascii.isASCII(129)}); // false
}

test "isControl:" {
    std.debug.print("isControl:{}\n", .{std.ascii.isControl(0x01)}); // true (0x00<0x1F || ==0x7F)
}
test "isPrint:" {
    std.debug.print("isPrint:{}\n", .{std.ascii.isPrint(0x00)}); // false (isASCII() and !isControl())
}

test "toUpper:" {
    std.debug.print("toUpper:{c}\n", .{std.ascii.toUpper('y')}); // Y
}

test "toLower:" {
    std.debug.print("toLower:{c}\n", .{std.ascii.toLower('A')});
}

test "eqlIgnoreCase:" {
    std.debug.print("eqlIgnoreCase:{}\n", .{std.ascii.eqlIgnoreCase("AA", "aa")}); // true
}

test "lowerString:" {
    // const original = "HELLO, WORLD!";
    // const lowercased = std.ascii.lowerString(original);

    const original = "HELLO, WORLD!";
    var buffer: [13]u8 = undefined; // Create a buffer to hold the lowercase string.

    _ = std.ascii.lowerString(&buffer, original);
    std.debug.print("Lowercased: {s}\n", .{buffer});
}

// ====================================
// 1. 运行模式(runtime)
test "blk:" {
    const chars = "HELLO, WORLD!";

    const lower_chars = comptime blk: {
        var buffer: [chars.len]u8 = undefined; // 创建一个与输入字符串长度相同的缓冲区
        _ = std.ascii.lowerString(&buffer, chars); // 使用 std.ascii.lowerString 将字符转换为小写并存储在缓冲区中
        break :blk buffer; // 返回缓冲区中的内容
    };

    std.debug.print("Lowercased: {s}\n", .{lower_chars}); // 打印转换后的小写字符串

}
// 2. 编译期模式(comptime)
test "blk:error:" {
    const chars = "HELLO, WORLD!";
    const lower_chars = blk: {
        var buffer: [chars.len]u8 = undefined;
        break :blk std.ascii.lowerString(&buffer, chars);
    };
    // error: runtime value contains reference to comptime var
    std.debug.print("Lowercased: {s}\n", .{lower_chars}); // 打印转换后的小写字符串
}
