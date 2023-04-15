const std = @import("std");
const expect = std.testing.expect;

pub fn deferReturn() u8 {
    var i: u8 = 1;
    defer {
        i += 10;
        std.log.info("i:{d}", .{i});
    }
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
        defer i *= 2;
        try expect(i == 8);
    }
    try expect(i == 17);
}
