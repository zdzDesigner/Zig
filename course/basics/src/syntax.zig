const std = @import("std");

fn desctruct() struct { bool, []const u8 } {
    return .{ true, "ssss" };
}
// 解构
test "desctruction:" {
    const isok, const name = comptime desctruct();
    std.debug.print("isok:{}\n", .{isok});
    std.debug.print("name:{s}\n", .{name});
}
