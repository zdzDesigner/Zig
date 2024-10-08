const std = @import("std");
const expect = std.testing.expect;

const absolute = enum(u32) {
    _,
    fn get(v: absolute) u32 {
        return @intFromEnum(v);
    }
};
test "enum(_):" {
    std.debug.print("enum(_):{}\n", .{absolute.get(@enumFromInt(30))});
}

pub fn localEnum() void {
    std.log.info("--------- enum --------", .{});
    // const RET = enum {
    //     success,
    //     // error: use of undeclared identifier 'RET'
    //     pub fn isFail(self: RET) bool {
    //         return self == Code.fail;
    //     }
    // };
    const Small = enum {
        one,
        two,
        three,
        four,
        five,
        six,
    };
    std.log.info("Small.two:{d}", .{@intFromEnum(Small.two)}); // Small.two:1
    std.log.info("{}", .{@TypeOf(Small.five)}); // enum.localEnum.Small

    const which = .one; // 自动推导
    _ = which;

    std.log.info("{s}", .{@tagName(Small.six)}); // six
    std.log.info("equal:{}", .{std.mem.eql(u8, @tagName(Small.six), "six")}); // true
}

test "tagName:" {
    const Langx = union(enum) { zh: []const u8, en: []const u8 };
    std.debug.print("tagName:{}\n", .{Langx.en}); // tag_type.?.en
    switch (@typeInfo(Langx)) {
        .Union => |info| {
            std.debug.print("union(enum):{}\n", .{info.tag_type.?}); // Union.tag_type.?
            std.debug.print("zh:{}\n", .{info.tag_type.?.zh}); // Union.tag_type.?.zh
            std.debug.print("compare:{}\n", .{info.tag_type.?.zh == Langx.zh}); // true
        },
        else => {},
    }

    const STATE = enum { RUN, STOP };
    // @tagName(STATE.RUN) => "RUN"
    std.debug.print("std.meta.Tag(STATE):{}\n", .{std.meta.Tag(STATE)}); // u1
    std.debug.print("std.meta.Tag(Langx):{}\n", .{std.meta.Tag(Langx)}); // tag_type.?
    std.debug.print("std.builtin.TypeId:{}\n", .{std.builtin.TypeId}); // tag_type.?

    // 纯 union 无 tag_type============= error: enum.test.tagName:.Lang has no tag type
    const Lang = union { zh: []const u8, en: []const u8 };
    // std.debug.print("std.meta.Tag(Lang):{}\n", .{std.meta.Tag(Lang)});
    switch (@typeInfo(Lang)) {
        .Union => |info| {
            std.debug.print("union:{any}\n", .{info.tag_type}); // null
        },
        else => {},
    }
}

test "test enum" {
    // 从0开始递增
    const Code2 = enum {
        success,
        fail,
        server_error,
        server_panic,
    };
    // try expect(Code2.fail == 1);
    //  error: incompatible types: 'enum.test.test enum.Code' and 'comptime_int'
    try expect(@intFromEnum(Code2.fail) == 1);
    try expect(Code2.fail == @as(Code2, @enumFromInt(1)));
}
test "test enum value" {
    const Code3 = enum(u16) {
        success,
        fail,
        server_error = 500,
        server_panic, // 501
    };

    // try expect(Code.server_panic == 501);
    //  error: incompatible types: 'enum.test.test enum.Code' and 'comptime_int'
    try expect(@intFromEnum(Code3.server_panic) == 501);
}

const Code = enum(u16) {
    success,
    fail,
    server_error = 500,
    server_panic, // 501
    // 方法可以提供给枚举。它们充当可以使用点语法调用的命名空间函数。
    pub fn isSuccess(this: Code) bool {
        return this == Code.success;
    }
    pub fn isFail(this: Code) bool {
        return this == Code.fail;
    }
};
test "test enum function" {
    // 因为是枚举, 所以外部方法也是成员方法？
    // 第一个参数可以指向自身
    try expect(Code.fail.isFail());
    try expect(!Code.success.isFail());
    try expect(Code.success.isSuccess());

    try expect(Code.isFail(Code.fail));
    try expect(Code.isFail(.fail));
    try expect(!Code.isFail(.server_panic));
}

const RCC = enum {
    ON,
    OFF,
    Bypass,
};

fn setRCC(val: RCC) void {
    switch (val) {
        .ON => {
            std.debug.print("ON\n", .{});
        },
        .OFF => {
            std.debug.print("OFF\n", .{});
        },
        else => {
            std.debug.print("Nathing\n", .{});
        },
    }
}

test "switch:" {
    setRCC(RCC.OFF);
    setRCC(RCC.ON);
    setRCC(RCC.Bypass);
}
