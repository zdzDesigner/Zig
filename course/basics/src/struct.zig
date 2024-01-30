const std = @import("std");
const expect = std.testing.expect;

const OTProtol = struct {
    ErrorCode: u2 = 1,
    Message: []const u8 = "OK",
    Data: ?Data, // "?" 可为null

    pub const List = struct {
        txt: []const u8,
        v: []const u8,
    };
    pub const Data = struct { list: []List };
};

const ot = OTProtol{ .ErrorCode = 2, .Message = "ok", .Data = null };

fn User() type {
    return struct {
        power: u64 = 0,
        name: []const u8,

        pub const SUPER_POWER = 9000;

        fn diagnose(user: User) void {
            if (user.power >= SUPER_POWER) {
                std.debug.print("it's over {d}!!!", .{SUPER_POWER});
            }
        }
    };
}

const UserInitial = struct {
    age: u8 = 0,
    // name: *const []u8,
    name: []const u8,

    fn init(name: []const u8, age: u8) UserInitial {
        return .{
            .name = name,
            .age = age,
        };
    }
};

fn Table() type {
    return struct {};
}

pub fn logic() void {
    std.log.info("---------- struct --------", .{});
    access();
    const user = User(){ .name = "zdz" };
    std.log.info("user.name: {s}\n", .{user.name});
    std.log.info("user.name type: {}\n", .{@TypeOf(user.name)});

    const userInitial = UserInitial.init("zdz", 36);
    std.log.info("userInitial age: {}\n", .{userInitial.age});
}

fn access() void {
    std.log.info("OTProtol.Data:{}", .{OTProtol.Data}); // OTProtol.Data:struct.OTProtol.Data
    // info: OTProtol.Data:struct.OTProtol.Data
    std.log.info("OTProtol.List:{}", .{OTProtol.List}); // OTProtol.List:struct.OTProtol.List
    // info: OTProtol.List:struct.OTProtol.List
}

test "test struct" {
    try expect(ot.ErrorCode == 2);
    try expect(@TypeOf(ot) == OTProtol);
}
