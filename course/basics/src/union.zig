const expect = @import("std").testing.expect;

test "test union" {
    const Val = union {
        int: u64,
        float: u64,
        bool: bool,
    };
    const v = Val{ .int = 3 };
    const v2: Val = .{ .int = 3 };

    try expect(v.int == 3);
    try expect(v2.int == 3);
}

test "mark with enum" {
    const ComplexTypeTag = enum {
        ok,
        not_ok,
    };
    const ComplexType = union(ComplexTypeTag) {
        ok: u8,
        not_ok: void,
    };

    var c = ComplexType{ .ok = 42 };

    switch (c) {
        ComplexTypeTag.ok => |*value| value.* += 1,
        ComplexTypeTag.not_ok => unreachable,
    }

    try expect(c.ok == 43);
}
