const expect = @import("std").testing.expect;

test "test statement" {
    var i: i8 = 10;
    switch (i) {
        -1...100 => { // 区间
            i = 9;
        },
        else => {},
    }
    try expect(i == 9);
    switch (i) {
        1, 9 => { // 数组
            i = 20;
        },
        else => {},
    }
    try expect(i == 20);

    // 表达式
    i = switch (i) {
        9, 20 => @divExact(i, 10), // 除法
        else => i,
    };
    try expect(i == 2);
}
