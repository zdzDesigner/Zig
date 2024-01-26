const std = @import("std");
const expect = std.testing.expect;

pub fn localEnum() void {
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
}

test "test enum" {
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
        server_panic,
    };

    // try expect(Code.server_panic == 501);
    //  error: incompatible types: 'enum.test.test enum.Code' and 'comptime_int'
    try expect(@intFromEnum(Code3.server_panic) == 501);
}

const Code = enum(u16) {
    success,
    fail,
    server_error = 500,
    server_panic,
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
