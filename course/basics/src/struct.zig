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

// ======================================
// 快速创建
// ======================================
const shorthands = .{
    .S = "intermix-source",
    .b = "with-hexdump",
    .O = "with-offset",
    .o = "output",
};

test "struct 解构:" {
    std.debug.print("shorthands:{}\n", .{shorthands});
    // shorthands:
    // struct{
    //     comptime S: *const [15:0]u8 = "intermix-source",
    //     comptime b: *const [12:0]u8 = "with-hexdump",
    //     comptime O: *const [11:0]u8 = "with-offset",
    //     comptime o: *const [6:0]u8 = "output"
    //  }
    //  {
    //  .S = { 105, 110, 116, 101, 114, 109, 105, 120, 45, 115, 111, 117, 114, 99, 101 },
    //  .b = { 119, 105, 116, 104, 45, 104, 101, 120, 100, 117, 109, 112 },
    //  .O = { 119, 105, 116, 104, 45, 111, 102, 102, 115, 101, 116},
    //  .o = { 111, 117, 116, 112, 117, 116 }
    //  }
    // 前面居然是类型
    std.debug.print("@TypeOf(shorthands):{}\n", .{@TypeOf(shorthands)});
    // @TypeOf(shorthands):
    // struct{
    //     comptime S: *const [15:0]u8 = "intermix-source",
    //     comptime b: *const [12:0]u8 = "with-hexdump",
    //     comptime O: *const [11:0]u8 = "with-offset",
    //     comptime o: *const [6:0]u8 = "output"
    //  }

    std.debug.print("shorthands.S:{s}\n", .{shorthands.S});
    // shorthands.S:intermix-source
}
