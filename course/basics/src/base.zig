const std = @import("std");
const log = @import("std").log;
const expect = @import("std").testing.expect;
test "test undefined" {
    // undefined 可赋值给任何类型的变量, 这里"无法确认类型", 则类型为@TypeOf(undefined)
    // const maxage = undefined;
    // try expect(@TypeOf(maxage) == undefined);
    // error: 无法对比
    const maxage = undefined;
    try expect(@TypeOf(maxage) == @TypeOf(undefined));

    const str: [4]u8 = undefined;
    std.debug.print("str.len:{d}\n", .{str.len}); // 4
    std.debug.print("str.len:{}\n", .{str[0] == 0}); // true
    std.debug.print("str.len:{}\n", .{str[3] == 0}); // true

}

test "test @TypeOf" {
    const memory: u32 = undefined;
    try expect(@TypeOf(memory) == u32);
}

test "test array" {
    const greet = [_]u8{ 'h', 'e', 'l', 'l', 'o' };
    try expect(greet.len == 5);
}

test "test while" {
    var sum: u16 = 0;
    var i: u8 = 1;
    while (i <= 10) : (i += 1) {
        sum += i;
    }
    try expect(sum == 55);
}

test "test for" {
    const str = [_]u8{ 'z', 'd', 'z' };

    for (str, 0..) |char, i| {
        if (i == 0) {
            try expect(char == 'z');
        }
        if (char == 'd') {
            try expect(i == 1);
        }
    }
    for (str[0..2], 0..) |char, i| {
        if (i == 0) {
            try expect(char == 'z');
        }
        if (char == 'd') {
            try expect(i == 1);
        }
    }

    // for (str) |char| {
    //     log.info("{c}", char);
    //     // _ = char;
    //
    // }
}

fn get_name() [1]u8 {
    return [_]u8{'z'};
}

test "test function" {
    const name = get_name();
    try expect(name[0] == 'z');
    try expect(@TypeOf(name) == [1]u8);
}
