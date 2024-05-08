const std = @import("std");

test "eql:" {
    std.debug.print("meta.eql:{}\n", .{std.meta.eql("aaa", "aaa")});
    std.debug.print("meta.eql:{}\n", .{std.mem.eql(u8, "aaab", "aaa")});
}
