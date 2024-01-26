const expect = @import("std").testing.expect;

test "test statement" {
    var i: i8 = 10;
    switch (i) {
        -1...100 => { // 区间
            i = 9;
        },
        else => {},
    }
    try expect(i == 9); // i=9

    switch (i) {
        1, 9 => { // 数组
            i = 20;
        },
        else => {},
    }
    try expect(i == 20); // i=20

    // 表达式
    const mulval = switch (i) {
        9, 20 => i * 2,
        else => i,
    };
    try expect(mulval == 40);

    const divval = switch (i) {
        // 9, 20 => @divExact(i, 10), // 除法
        9, 20 => @divTrunc(i, 10), // 除法
        // 9, 20 => i / 10, //  error: division with 'i8' and 'i8': signed integers must use @divTrunc, @divFloor, or @divExact
        else => i,
    };
    try expect(divval == 2);

    const ui: u16 = @as(u16, @intCast(i));
    const udivval = switch (ui) {
        9, 20 => ui / 10, // 成功
        else => ui,
    };
    try expect(udivval == 2);
}
