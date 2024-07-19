const std = @import("std");
const expect = std.expect;

pub fn logic() void {
    std.log.info("------- while --------", .{});
    // `while` 可以包含 `else` 子句

    var i: u8 = 1;
    while (i < 10) : (i += 2) {
        std.log.info("while sub else:{}", .{i});
    }

    // while (true) {}
}

test "while::true:" {
    while (false) {
        std.debug.print("is while conent\n", .{});
    }
    std.debug.print("is while out\n", .{});
}

test "while::sub command:" {
    var len: u8 = 10;
    while (len > 0) : (len -= 1) {
        std.debug.print("len:{}\n", .{len - 1});
    }
}
