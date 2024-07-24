const std = @import("std");
test "testing.expectEqualStrings" {
    try std.testing.expectEqualStrings("aaa", "aaa");
}

// refAllDecls 仅使用于pub
pub fn foo() void {
    const x: bool = 2; // compilation error if foo() is called
    _ = x;
}
test "refs" {
    // 虽然foo为调用, 通过refAllDecls去检查pub声明的对外接口是否编译通过
    std.testing.refAllDecls(@This());
}
