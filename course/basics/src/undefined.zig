const std = @import("std");
test "undefined::Int:" {
    // !! 分配的值不确定
    const v2: u2 = undefined;
    std.debug.print("v2:{}\n", .{v2}); // v2:33  ? 分配为最大值
    const v4: u4 = undefined;
    std.debug.print("v4:{}\n", .{v4}); // v4:1
    const v8: u8 = undefined;
    std.debug.print("v8:{}\n", .{v8}); // v8:0
}

test "undefined::struct:" {
    // !! 不定
    const V = struct {
        name: []const u8,
        v2: u2,
        v8: u8,
    };

    var v: V = undefined;
    std.debug.print("v.v2:{}\n", .{v.v2}); // 3
    std.debug.print("v.v8:{}\n", .{v.v8}); // 0
    // !! v.name(指针), 溢出: 整数overflowcast导致指针为nullincorrect alignmentDeadlock检测到@memcpy参数有不相等的lengths@memcpy参数aliasfor在长度不相等的对象上循环整数强制转换截断位A0.12.0BB ')
    // std.debug.print("v.name:{s}\n", .{v.name}); // Error

    v.name = "xxx"; // v一定是非const
    std.debug.print("v.name:{s}\n", .{v.name});
}
