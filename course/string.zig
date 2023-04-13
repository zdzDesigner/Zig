const expect = @import("std").testing.expect;
const info = @import("std").log.info;

pub fn main() void {
    const str = "Zig语言";
    info("str len:{d}", .{str.len});
}

test "single char equal to element" {
    const str = "Zig语言";

    try expect(str[0] == 'Z');
    try expect(str[2] == 'g');
    try expect(str[3] != '语');
    try expect(str[3] == 0xE8);
}
