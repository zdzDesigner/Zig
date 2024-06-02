const std = @import("std");

test "eql:" {
    std.debug.print("meta.eql:{}\n", .{std.meta.eql("aaa", "aaa")}); // true
    std.debug.print("meta.eql:{}\n", .{std.mem.eql(u8, "aaab", "aaa")}); // false
}

test "stringToEnum:" {
    const ACTION = enum {
        ADD,
        EDIT,
        DEL,
    };
    std.debug.print("stringToEnum:{}\n", .{std.meta.stringToEnum(ACTION, "EDIT").? == .EDIT}); // true
}

test "Child:" {
    std.debug.print("Child([1]u8) == u8:{}\n", .{std.meta.Child([1]u8) == u8});
    std.debug.print("Child(*u8) == u8:{}\n", .{std.meta.Child(*u8) == u8});
    std.debug.print("Child([]u8) == u8:{}\n", .{std.meta.Child([]u8) == u8});
    std.debug.print("Child(?u8) == u8:{}\n", .{std.meta.Child(?u8) == u8});
    std.debug.print("Child(@Vector(2, u8)) == u8:{}\n", .{std.meta.Child(@Vector(2, u8)) == u8});
}
