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
    // const User = struct {
    //     power: u64 = 0,
    //     name: []const u8,
    // }
    const user = User(){ .name = "zdz" };
    std.log.info("user.name type: {}", .{@TypeOf(user.name)});
    std.log.info("user.name: {s}", .{user.name});
    std.log.info("user.name: {*}", .{user.name}); // u8@10e1152  ({*} 和 pointer.ptr的关系)
    std.log.info("user.name.ptr: {*}", .{user.name.ptr}); // u8@10e1152
    std.log.info("user.name.len: {}", .{user.name.len});
    std.log.info("&user:{*}, &user.power:{*}, &user.name:{}", .{ &user, &user.power, &user.name });
    // info: &user:struct.User()@10ddc00,
    //       &user.power:u64@10ddc00,
    //       &user.name:[]const u8@10ddc08

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
