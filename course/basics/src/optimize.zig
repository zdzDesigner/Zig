const expect = @import("std").testing.expect;

fn acciiToUpper(x: u8) u8 {
    return switch (x) {
        'a'...'z' => x + 'A' - 'a',
        'A'...'Z' => x + 'A',
        else => unreachable,
    };
}

test "test unreachable" {
    // unreachable 是对编译器的断言，即不会到达此语句。它可以用来告诉编译器分支是不可能的，然后优化器可以利用它。达到 unreachable 是可检测到的非法行为。
    // 由于它是 noreturn 类型，它与所有其他类型兼容

    try expect('V' == acciiToUpper('v'));
}
