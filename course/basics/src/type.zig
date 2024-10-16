const std = @import("std");
const expect = std.testing.expect;

// pub fn logic() void {
test "logic::" {
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
    std.debug.print("@TypeOf(db):{any}\n", .{@TypeOf(db)}); // i8
    std.debug.print("{s}\n", .{@typeName(@TypeOf(db))}); // i8
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

test "compare u1 and comptime_int:" {
    const v: u1 = 0;
    std.debug.print("u1 == comptime_int:{}\n", .{v == 0}); // true
    const v2: u8 = 20;
    std.debug.print("u2 == comptime_int:{}\n", .{v2 == 20}); // true
}

// ======================================================
// error: opaque types have unknown size and therefore cannot be directly embedded in structs
// opaque 不能用于 field
// 和 pub 无关
const Auth = struct {
    key: []const u8,
    pub const password = opaque {};
    pub const val = 3;
    const nopub_val = 3;
    fn method() !void {}
};

// 属性
test "Properties:" {
    const auth = Auth{ .key = "zdz" };
    std.debug.print("field key:{}\n", .{@hasField(Auth, "key")}); // true
    std.debug.print("decl key:{}\n", .{@hasDecl(Auth, "key")}); // false
    std.debug.print("field val:{}\n", .{@hasField(Auth, "val")}); // false
    std.debug.print("decl val:{}\n", .{@hasDecl(Auth, "val")}); // true
    std.debug.print("@field(decl val):{}\n", .{@field(Auth, "val")}); // 3
    std.debug.print("nopub field val:{}\n", .{@hasField(Auth, "nopub_val")}); // false
    std.debug.print("nopub decl val:{}\n", .{@hasDecl(Auth, "nopub_val")}); // true
    std.debug.print("field method:{}\n", .{@hasField(Auth, "method")}); // false
    std.debug.print("decl method:{}\n", .{@hasDecl(Auth, "method")}); // true

    std.debug.print("decl password:{}\n", .{@hasDecl(Auth, "password")}); // true

    std.debug.print("auth:{}\n", .{auth});
    _ = Auth.password;
    _ = Auth.val;
}
// 可以重复
const SameFieldAndDecl = struct {
    val: u3,
    pub const val = 3;
};

test "more properties:" {
    const v = SameFieldAndDecl{ .val = 3 };
    std.debug.print("v:{}\n", .{v});
}

test "@typeName:" {
    std.debug.print("@typeName(SameFieldAndDecl):{s}\n", .{@typeName(SameFieldAndDecl)});
    // type.SameFieldAndDecl
    // type 是当前文件名(模块域), SameFieldAndDecl struct名
    std.debug.print("@typeName(std.MultiArrayList):{s}\n", .{@typeName(std.MultiArrayList(SameFieldAndDecl))});
    // multi_array_list.MultiArrayList(type.SameFieldAndDecl)
}

test "std.builtin.TypeId:" {
    std.debug.print("std.builtin.TypeId:{}\n", .{std.builtin.TypeId});
    // @typeInfo(builtin.Type).Union.tag_type.?

    // std.debug.print("type info std.builtin.TypeId:{}\n", .{@typeInfo(std.builtin.TypeId)});
    // @typeInfo(builtin.Type).Union.tag_type.?

    switch (@typeInfo(std.builtin.TypeId)) {
        .Enum => |e| {
            inline for (e.fields) |field| {
                std.debug.print("enum.field.name:{s}\n", .{field.name});
            }
            // enum.field.name:Type
            // enum.field.name:Void
            // enum.field.name:Bool
            // enum.field.name:NoReturn
            // enum.field.name:Int
            // enum.field.name:Float
            // enum.field.name:Pointer
            // enum.field.name:Array
            // enum.field.name:Struct
            // enum.field.name:ComptimeFloat
            // enum.field.name:ComptimeInt
            // enum.field.name:Undefined
            // enum.field.name:Null
            // enum.field.name:Optional
            // enum.field.name:ErrorUnion
            // enum.field.name:ErrorSet
            // enum.field.name:Enum
            // enum.field.name:Union
            // enum.field.name:Fn
            // enum.field.name:Opaque
            // enum.field.name:Frame
            // enum.field.name:AnyFrame
            // enum.field.name:Vector
            // enum.field.name:EnumLiteral

        },
        .Struct => |s| {
            std.debug.print("struct:{}", .{s});
        },
        else => {},
        // std.debug.print("item:{}\n", .{item});
    }
}

test "@Type" {
    // std.builtin.Type
    const T = @Type(.{
        .Int = .{
            .signedness = .signed,
            .bits = 32,
        },
    });
    std.debug.print("T:{}, @TypeOf(T):{}\n", .{ T, @TypeOf(T) }); // T:i32, @TypeOf(T):type
    std.debug.print("i32:{},@TypeOf(i32):{} \n", .{ i32, @TypeOf(i32) }); // i32:i32, @TypeOf(i32):type

    std.debug.print("T==i32:{}\n", .{T == i32}); // true

    std.debug.print("@alignOf(void):{}\n", .{@alignOf(void)}); // 1, bit
    std.debug.print("@alignOf([]const u8):{}\n", .{@alignOf([]const u8)}); // 8, bit

    // 构造Struct ======================
    const fields: []const std.builtin.Type.StructField = &.{
        .{
            .name = "name",
            .type = []const u8,
            .is_comptime = false,
            .alignment = @alignOf([]const u8),
            .default_value = null,
        },
    };

    const MyStruct = @Type(.{ .Struct = .{
        .layout = std.builtin.Type.ContainerLayout.auto,
        .decls = &.{},
        .fields = fields[0..fields.len],
        .is_tuple = false,
    } });

    const my_fields = std.meta.fields(MyStruct);
    std.debug.print("@TypeOf(my_fields):{any}\n", .{@TypeOf(my_fields)});
    // @TypeOf(my_fields):[]const builtin.Type.StructField

    std.debug.print("my_fields:{any}\n", .{my_fields[0]});
    // my_fields:builtin.Type.StructField{
    //      .name = { 110, 97, 109, 101 },
    //      .type = []const u8,
    //      .default_value = null,
    //      .is_comptime = false,
    //      .alignment = 8
    // }

    var my_struct = MyStruct{ .name = "xxxx" };
    std.debug.print("@TypeOf(my_fields):{any}\n", .{@TypeOf(my_struct)}); // @TypeOf(my_fields):type.test.@Type.MyStruct

    std.debug.print("my_struct.name:{s}\n", .{my_struct.name}); // xxxx
    @field(my_struct, "name") = "ccccccc";
    std.debug.print("my_struct.name:{s}\n", .{my_struct.name}); // xxxx
}

test "writer:" {
    std.debug.print("@TypeOf(Writer):{}\n", .{@TypeOf(std.io.getStdErr().writer())});
    // io.Writer(File, WriteError, write);
    // @TypeOf(Writer):io.GenericWriter(
    //     fs.File,error{
    //         DiskQuota,
    //         FileTooBig,
    //         InputOutput,
    //         NoSpaceLeft,
    //         DeviceBusy,
    //         InvalidArgument,
    //         AccessDenied,
    //         BrokenPipe,
    //         SystemResources,
    //         OperationAborted,
    //         NotOpenForWriting,
    //         LockViolation,
    //         WouldBlock,
    //         ConnectionResetByPeer,
    //         Unexpected
    //     },
    //     (function 'write')
    // )
    std.debug.print("hasDecl writeAll:{}\n", .{@hasDecl(@TypeOf(std.io.getStdErr().writer()), "writeAll")}); // true
}

test "eq type::" {
    const v = std.builtin.Type.Optional{ .child = u8 };
    std.debug.print("@typeInfo(std.builtin.Type.Optional) == .Optional:{}\n", .{@typeInfo(@TypeOf(v)) == .Optional}); // false
    const v2: ?u8 = 3;
    std.debug.print("@typeInfo(std.builtin.Type.Optional) == .Optional:{}\n", .{@typeInfo(@TypeOf(v2)) == .Optional}); // true
}

test "Int::" {
    const v: u16 = 3;

    std.debug.print("bits:{}\n", .{@typeInfo(@TypeOf(v)).Int.bits});
    std.debug.print("@divExact(bits,8):{}\n", .{@divExact(@typeInfo(@TypeOf(v)).Int.bits, 8)});
}
