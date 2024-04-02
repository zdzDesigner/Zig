const std = @import("std");
const expect = std.testing.expect;

pub fn logic() void {
    std.log.info("============== type ===============", .{});

    std.debug.print("{}\n", .{@TypeOf(2)}); // comptime_int
    std.debug.print("{}\n", .{@TypeOf(3.2)}); // comptime_float
    std.debug.print("{}\n", .{@TypeOf(2, 3.2)}); // comptime_float

    const istrue = true;
    std.debug.print("{}\n", .{@TypeOf(true)}); // bool
    std.debug.print("{}\n", .{@TypeOf(istrue)}); // bool
    std.debug.print("{}\n", .{true == istrue}); // bool

    // std.debug.print("@as bool:{}\n", .{@as(bool, 1)}); // error: expected type 'bool', found 'comptime_int'
    // std.debug.print("@as comptime_int:{}\n", .{@as(usize, -2)}); //  error: type 'usize' cannot represent integer value '-2'

    std.debug.print("@as bool:{}\n", .{@as(bool, true)}); // true
    std.debug.print("@as bool:{}\n", .{@as(bool, istrue)}); // true
    var istrue1 = true;
    istrue1 = false;
    std.debug.print("@as bool var:{}\n", .{@as(bool, istrue1)}); // false

    const page: u16 = 3;
    const max: u8 = 3;
    const db: i8 = 3;

    std.debug.print("@as comptime_int:{}\n", .{@as(usize, 2)}); // 2
    std.debug.print("@as u16 to usize:{}\n", .{@as(usize, max)}); // 3
    std.debug.print("@as u16 to usize:{}\n", .{@as(usize, @intFromBool(true))}); // 1

    // @TypeOf: 它接受任意个表达式作为参数，并返回它们的"公共"可转换类型
    std.debug.print("{}\n", .{@TypeOf(page, max, db)}); // u16
    std.debug.print("{s}\n", .{@typeName(@TypeOf(page))}); // u16
    //

    // @typeInfo 类型描述
    std.debug.print("{}\n", .{@typeInfo(@TypeOf(page))});
    // builtin.Type{ .Int = builtin.Type.Int{ .signedness = builtin.Signedness.unsigned, .bits =16 } }
    std.debug.print("{}\n", .{@typeInfo(@TypeOf(page)).Int.signedness});

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

    // std.log.info("{}", 3); // 错误 源码 std/fmt.zig
    typeInfo();
    // argsCheck(3);
}

fn typeInfo() void {
    std.log.info("{any}", .{@typeInfo(u32)});
    // builtin.Type{ .Int = builtin.Type.Int{ .signedness = builtin.Signedness.unsigned, .bits = 32 } }
    const ArgSetType = u32;
    std.log.info("{any}", .{@typeInfo(ArgSetType)});
    // builtin.Type{ .Int = builtin.Type.Int{ .signedness = builtin.Signedness.unsigned, .bits = 32 } }

    const max_format_args = @typeInfo(ArgSetType).Int.bits;
    std.log.info("max_format_args:{}", .{max_format_args}); // 32
    //
    //
}

fn argsCheck(args: anytype) void {
    const ArgsType = @TypeOf(args);
    const args_type_info = @typeInfo(ArgsType);
    if (args_type_info != .Struct) {
        @compileError("expected tuple or struct argument, found " ++ @typeName(ArgsType));
    }
    const fields_info = args_type_info.Struct.fields;

    std.log.info("fields_info:{any}", .{fields_info});
}
