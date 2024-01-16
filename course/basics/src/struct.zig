const std = @import("std");
const expect = std.testing.expect;

const OTProtol = struct {
    ErrorCode: u2 = 1,
    Message: []const u8 = "OK",
    Data: ?Data, // "?" 可为null

    const List = struct {
        txt: []const u8,
        v: []const u8,
    };
    pub const Data = struct { list: []List };
};

const ot = OTProtol{ .ErrorCode = 2, .Message = "ok", .Data = null };

pub const User = struct {
    power: u64 = 0,
    name: []const u8,

    pub const SUPER_POWER = 9000;

    fn diagnose(user: User) void {
        if (user.power >= SUPER_POWER) {
            std.debug.print("it's over {d}!!!", .{SUPER_POWER});
        }
    }
};

pub fn access() void {
    std.log.info("OTProtol.Data:{}", .{OTProtol.Data}); // OTProtol.Data:struct.OTProtol.Data
    // info: OTProtol.Data:struct.OTProtol.Data
    std.log.info("OTProtol.List:{}", .{OTProtol.List}); // OTProtol.List:struct.OTProtol.List
    // info: OTProtol.List:struct.OTProtol.List

}

test "test struct" {
    try expect(ot.ErrorCode == 2);
    try expect(@TypeOf(ot) == OTProtol);
}
