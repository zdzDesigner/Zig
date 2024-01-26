const log = @import("std").log;
const expect = @import("std").testing.expect;

pub fn u() void {
    const char = 'v';
    log.info("c:{c},u:{u},d:{d}", .{ char, char, char });
    // While we're on this subject, 'c' (ASCII encoded character)
    // would work in place for 'u' because the first 128 characters
    // of UTF-8 are the same as ASCII!
    const enname = "aaaa";
    log.info("{any}", .{@TypeOf(enname)});
}

test "test union" {}


// 字符串常量被存储在二进制文件的一个特殊位置，并且会去重。
// 因此，指向字符串字面量的变量将是指向这个特殊位置的指针。
// 也就是说，"Goku" 的类型更接近于 *const [4]u8，是一个指向 4 常量字节数组的指针。

test "string length" {
    const chname = "测试长度";
    try expect(@TypeOf(chname) == *const [12:0]u8);
    const enname = "aaaa";
    try expect(@TypeOf(enname) == *const [4:0]u8);
}

test "compare c" {
    // const char* name= "zdz";
}
