const expect = @import("std").testing.expect;

test "test union" {
    const Val = union {
        int: u64,
        float: u64,
        bool: bool,
    };
    Val{ .int = 3 };
}
