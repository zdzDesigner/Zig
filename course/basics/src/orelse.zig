const std = @import("std");

// orelse 用于option可选类型
test "orelse:" {
    std.debug.print("orelse:{any}\n", .{null orelse true});

    std.debug.print("orelse:{any}\n", .{orelseReturn()});
}

fn orelseReturn() bool {
    const v = null orelse return true;
    return v;
}
