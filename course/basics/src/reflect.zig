const std = @import("std");
const assert = std.debug.assert;

fn ArgumentStruct(comptime function: anytype) type {
    std.debug.print("ssssss", .{});
    const info = @typeInfo(@TypeOf(function)).Fn;
    var fields: [info.params.len + 1]std.builtin.Type.StructField = undefined;
    var count = 0;
    for (info.params) |param| {
        if (param.type != std.mem.Allocator) {
            const name = std.fmt.comptimePrint("{d}", .{count});
            fields[count] = .{
                .name = name,
                .type = param.type orelse void,
                .is_comptime = false,
                .alignment = @alignOf(param.type orelse void),
                .default_value = null,
            };
            count += 1;
        }
    }
    fields[count] = .{
        .name = "retval",
        .type = info.return_type orelse void,
        .is_comptime = false,
        .alignment = @alignOf(info.return_type orelse void),
        .default_value = null,
    };
    count += 1;
    return @Type(.{
        .Struct = .{
            .layout = std.builtin.Type.ContainerLayout.auto,
            .decls = &.{},
            .fields = fields[0..count],
            .is_tuple = false,
        },
    });
}

test "ArgumentStruct:" {
    const Test = struct {
        fn A(a: i32, b: bool) bool {
            return if (a > 10 and b) true else false;
        }

        fn B(s: []const u8) void {
            _ = s;
        }

        fn C(alloc: std.mem.Allocator, arg1: i32, arg2: i32) bool {
            _ = alloc;
            return arg1 < arg2;
        }
    };
    const ArgA = ArgumentStruct(Test.A);
    const fieldsA = std.meta.fields(ArgA);
    std.debug.print("fieldsA[0]:{any}\n", .{fieldsA[0]});
    // fieldsA[0]:builtin.Type.StructField{ .name = { 48 }, .type = i32, .default_value = null, .is_comptime = false, .alignment = 4 }
    std.debug.print("fieldsA[1]:{any}\n", .{fieldsA[1]});
    // fieldsA[1]:builtin.Type.StructField{ .name = { 49 }, .type = bool, .default_value = null, .is_comptime = false, .alignment = 1 }
    std.debug.print("fieldsA[2]:{any},name:{s}\n", .{ fieldsA[2], fieldsA[2].name });
    // fieldsA[2]:builtin.Type.StructField{ .name = { 114, 101, 116, 118, 97, 108 }, .type = bool, .default_value = null, .is_comptime = false, .alignment =1 }
    // name:retval
    assert(fieldsA.len == 3);
    assert(fieldsA[0].name[0] == '0');
    assert(fieldsA[1].name[0] == '1');
    assert(fieldsA[2].name[0] == 'r'); // retval

    const ArgB = ArgumentStruct(Test.B);
    const fieldsB = std.meta.fields(ArgB);
    std.debug.print("fieldsB[0]:{any}\n", .{fieldsB[0]});
    // fieldsB[0]:builtin.Type.StructField{ .name = { 48 }, .type = []const u8, .default_value = null, .is_comptime = false, .alignment = 8 }
    std.debug.print("fieldsB[1]:{any}\n", .{fieldsB[1]});
    // fieldsB[1]:builtin.Type.StructField{ .name = { 114, 101, 116, 118, 97, 108 }, .type = void, .default_value = null, .is_comptime = false, .alignment =1 }
    assert(fieldsB.len == 2);
    assert(fieldsB[0].name[0] == '0');
    assert(fieldsB[1].name[0] == 'r');

    const ArgC = ArgumentStruct(Test.C);
    const fieldsC = std.meta.fields(ArgC);
    assert(fieldsC.len == 3);
}
