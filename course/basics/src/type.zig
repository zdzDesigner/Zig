const std = @import("std");
const expect = std.testing.expect;

pub fn logic() void {
    const page: u16 = 3;
    const max: u8 = 3;
    const db: i8 = 3;

    // @TypeOf: 它接受任意个表达式作为参数，并返回它们的"公共"可转换类型
    std.debug.print("{}\n", .{@TypeOf(page, max, db)}); // u16
    std.debug.print("{s}\n", .{@typeName(@TypeOf(page))}); // u16

    std.debug.print("{}\n", .{@typeInfo(@TypeOf(page))});
    // builtin.Type{ .Int = builtin.Type.Int{ .signedness = builtin.Signedness.unsigned, .bits =16 } }
    std.debug.print("{}\n", .{@typeInfo(@TypeOf(page)).Int.signedness});

    std.debug.print("{}\n", .{@TypeOf(2, 3.2)}); // comptime_float

    const Small = enum {
        one,
        two,
        three,
        four,
    };

    const which = .one;
    _ = which;

    std.debug.print("{}\n", .{@typeInfo(Small).Enum.tag_type});
    std.debug.print("{}\n", .{@typeInfo(Small).Enum.fields.len});
    // inline for (@typeInfo(Small).Enum) |value| {
    //     std.debug.print("{}\n", .{value});
    // }
}
