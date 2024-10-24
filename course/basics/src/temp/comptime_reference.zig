const std = @import("std");

pub const hi = brk: {
    var buf: [4][]const u8 = undefined;

    for (0..2) |i| {
        buf[i] = "hello";
    }

    // error: comptime dereference requires '[2][]const u8' to have a well-defined layout, but it does not.
    const names = buf[0..2].*;
    break :brk names;
};

const lower_chars = blk: {
    const chars = "aaabbb";
    var buffer: [chars.len]u8 = undefined;
    // break :blk std.ascii.lowerString(&buffer, chars);
    for (chars, 0..) |c, i| {
        // buffer[i] = std.ascii.toLower(c);
        buffer[i] = c;
    }
    break :blk &buffer;
};

const HashTag = enum {
    sha1,
    // pub const map = std.ComptimeStringMap(@This(), .{
    //     .{ encode("1.3.14.3.2.26"), .sha1 },
    // });

    // error: global variable contains reference to comptime var
    // pub const map = std.StaticStringMap(HashTag).initComptime(.{
    //     .{ encode("1.3.14.3.2.26"), .sha1 },
    // });
    pub const map = std.StaticStringMap(HashTag).initComptime(.{
        .{ "1.3.14.3.2.26", .sha1 },
    });
};

pub inline fn encode(comptime oid: []const u8) []const u8 {
    var res: [256]u8 = undefined;
    res[0] = @intCast(oid.len);
    @memcpy(res[1..][0..oid.len], oid);
    return res[0 .. oid.len + 1];
}

test {
    std.debug.print("hi:{s}\n", .{comptime hi});
    std.debug.print("lower_chars:{s}\n", .{comptime lower_chars});
    std.debug.print("{?}\n", .{HashTag.map.get("1.3.14.3.2.26asdf")});
}
