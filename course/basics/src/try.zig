const std = @import("std");

const Error = error{
    XXXX,
};

fn genErr(val: u32) !void {
    if (val > 10) return;
    return Error.XXXX;
}

test "try::step:" {
    std.debug.print("111111\n", .{});
    std.debug.print("222222\n", .{});
    try genErr(11); // 失败阻止后续执行
    std.debug.print("333333\n", .{});
}
