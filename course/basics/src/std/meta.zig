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
