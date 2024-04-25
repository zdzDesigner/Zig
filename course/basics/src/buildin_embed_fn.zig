const std = @import("std");

test "@truncate:" {
    const v: u4 = @truncate(58); // 0b111010 << 2  = 0b1010

    std.debug.print("v:{}\n", .{v}); // 10
}

test "packed:" {
    const BitField = packed struct {
        a: u3,
        b: u3,
        c: u2,
    };

    std.debug.print("offset:{}\n", .{@bitOffsetOf(BitField, "a")}); // 0
    std.debug.print("offset:{}\n", .{@bitOffsetOf(BitField, "b")}); // 3
    std.debug.print("offset:{}\n", .{@bitOffsetOf(BitField, "c")}); // 6

    const Full = packed struct {
        number: u16,
    };

    const Divide = packed struct {
        first: u4,
        seconed: u4,
        three: u8,
    };
    std.debug.print("size:Full:{}\n", .{@sizeOf(Full)}); // 2
    std.debug.print("size:Divide:{}\n", .{@sizeOf(Divide)}); // 2

    const div: Divide = @bitCast(Full{ .number = 0b1100001111110000 }); // three:0b11000011 seconed:0b1111 first:0b0000

    std.debug.print("div:{}\n", .{div}); // Divide{ .first = 0, .seconed = 15, .three = 195 }
}
