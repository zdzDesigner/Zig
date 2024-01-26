const std = @import("std");
const expect = std.testing.expect;

// Zig 中的普通指针不允许将 0 或 null 作为值。它们遵循语法 *T ，其中 T 是子类型。
// 引用使用 &variable 完成，取消引用使用 variable.* 完成。

// 有时，您可能有一个指向"未知数量元素"的指针。 [*]T 是解决方案，它的工作方式类似于 *T ，但也支持索引语法、指针算术和切片。
// 与 *T 不同，它不能指向没有已知大小的类型。 *T 强制到 [*]T 。

pub fn size() void {
    // usize 和 isize 作为无符号和有符号整数给出，其大小与指针相同。
    std.log.info("usize sizeof:{}, *u8 sizeof:{}", .{ @sizeOf(usize), @sizeOf(*u8) });
    std.log.info("u16 sizeof:{}, *u16 sizeof:{}", .{ @sizeOf(u16), @sizeOf(*u16) });
    std.log.info("u17 sizeof:{}, *u17 sizeof:{}", .{ @sizeOf(u17), @sizeOf(*u17) });
    std.log.info("u18 sizeof:{}, *u18 sizeof:{}", .{ @sizeOf(u18), @sizeOf(*u18) });
    var arr = [_]u8{ 5, 4, 2, 6 };
    std.log.info("&arr:{}", .{@TypeOf(&arr)}); // &arr:*[4]u8
}

fn inc(i: *u8) void {
    i.* += 1;
}

test "test pointer" {
    var i: u8 = 10;
    inc(&i);

    try expect(i == 11);
}

test "test force convert pointer to zero" {
    // 尝试将 *T 设置为值 0 是可检测到的非法行为。
    // _ = @intToPtr(*u8, 0);
    // error: pointer type '*u8' does not allow address zero

}

test "test const pointer" {
    // const i: u8 = 1;
    // var p: *u8 = &i;
    // error: expected type '*u8', found '*const u8
    // try expect(p.* == 1);

}

test "test [*]T" {
    var arr = [_]u8{ 5, 4, 2, 6 };
    try expect(arr.len == 4);
    const p: [*]u8 = &arr; // 从已知长度转换未知长度
    try expect(p[0] == 5);
    // try expect(p.*.len == 4);
    // error: index syntax required for unknown-length pointer type '[*]u8'
    // try expect(p.len == 4);
    // error: type '[*]u8' does not support field access
}

test "test usize and isize" {
    try expect(@sizeOf(usize) == @sizeOf(*u8));
    try expect(@sizeOf(isize) == @sizeOf(*u8));
}

// 可以将切片视为一对 [*]T （指向数据的指针）和 usize （元素计数）。它们的语法为 []T ，其中 T 是子类型。
// 切片在整个 Zig 中大量使用，用于当您需要对任意数量的数据进行操作时。
// 切片与指针具有相同的属性，这意味着也存在常量切片。对于循环也对切片进行操作。Zig 中的字符串文字强制为 []const u8 。

fn totle(arr: []const u8) u16 {
    var sum: u16 = 0;
    for (arr) |item| {
        sum += item;
    }
    return sum;
}
test "test slice" {
    const pool = [_]u8{ 4, 2, 6, 1, 8 };
    const sub = pool[2..4];
    try expect(sub.len == 2);
    try expect(totle(sub) == 7);

    // 当这些 n 和 m 值在编译时都是已知的时，切片实际上会生成"指向数组的指针"。这不是指向数组的指针的问题，即 *[N]T 将强制到 []T 。
    try expect(@TypeOf(sub) == *const [2]u8);
    try expect(pool[2..].len == 3);
}
