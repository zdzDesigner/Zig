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
