const std = @import("std");
const expect = std.testing.expect;

pub fn deferReturn() u8 {
    var i: u8 = 1;
    defer {
        i += 10;
        std.log.info("defer i:{d}", .{i});
    }
    return i;
}
pub fn deferReturnPointer() *u8 {
    var val: u8 = 1;
    var i: *u8 = &val;
    // defer {
    //     *i += 10; //  出错: 如何修改指针指向的值
    //     std.log.info("defer i:{d}", .{i});
    // }
    return i;
}
test "test defer" {
    // 和golang 一致
    try expect(deferReturn() == 1);

    var i: u16 = 6;
    { // 退出这个语句块时执行
        defer {
            i += 2;
        }
        try expect(i == 6);
    }
    try expect(i == 8);

    { // 和 golang 的执行顺序一致
        defer i += 1;
        defer i *= 2; // 倒叙:这个先执行
        try expect(i == 8);
    }
    try expect(i == 17);
}
