const expect = @import("std").testing.expect;

pub fn localEnum() void {
    // const RET = enum {
    //     success,
    //     // error: use of undeclared identifier 'RET'
    //     pub fn isFail(self: RET) bool {
    //         return self == Code.fail;
    //     }
    // };
}

test "test enum" {
    const Code2 = enum {
        success,
        fail,
        server_error,
        server_panic,
    };
    // try expect(Code.fail == 1);
    //  error: incompatible types: 'enum.test.test enum.Code' and 'comptime_int'
    try expect(@enumToInt(Code2.fail) == 1);
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
    try expect(@enumToInt(Code3.server_panic) == 501);
}

const Code = enum(u16) {
    success,
    fail,
    server_error = 500,
    server_panic,
    // 方法可以提供给枚举。它们充当可以使用点语法调用的命名空间函数。
    pub fn isFail(this: Code) bool {
        return this == Code.fail;
    }
};
test "test enum function" {
    // 第一个参数可以指向自身
    try expect(Code.fail.isFail());

    try expect(Code.isFail(Code.fail));
    try expect(Code.isFail(.fail));
    try expect(!Code.isFail(.server_panic));
}
