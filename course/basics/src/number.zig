const std = @import("std");

fn truncat() u32 {
    return 15 / 10;
}

test "2*1.5:" {
    std.debug.print("2*1.5:{}\n", .{2 * 1.5}); // 3
    std.debug.print("2*truncat:{}\n", .{2 * truncat()}); // 2
}

test "overflow:" {
    var a: u32 = 20;
    a -%= 30;
    std.debug.print("a:{}\n", .{a});
}
