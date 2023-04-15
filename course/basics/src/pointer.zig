const std = @import("std");
const expect = @import("std").testing.expect;

// Zig 中的普通指针不允许将 0 或 null 作为值。它们遵循语法 *T ，其中 T 是子类型。
// 引用使用 &variable 完成，取消引用使用 variable.* 完成。

pub fn size() void {
    std.log.info("usize sizeof:{}, *u8 sizeof:{}", .{ @sizeOf(usize), @sizeOf(*u8) });
    std.log.info("*u16 sizeof:{}", .{ @sizeOf(*u16) });
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

test "test usize and isize" {
    try expect(@sizeOf(usize) == @sizeOf(*u8));
    try expect(@sizeOf(isize) == @sizeOf(*u8));
}
