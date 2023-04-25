const expect = @import("std").testing.expect;

test "test union" {
    const Val = union {
        int: u64,
        float: u64,
        bool: bool,
    };
    const v = Val{ .int = 3 };

    try expect(v.int == 3);
}
