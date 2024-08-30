const std = @import("std");
const os = std.os;

// zig build-exe /home/zdz/Documents/Try/Zig/zig-pro/course/basics/src/argv.zig
// ./argv dd 22
pub fn main() !void {
    std.debug.print("std.os.argv:{s}\n", .{std.os.argv}); // std.os.argv:{ ./argv, dd, 22 }
    std.debug.print("std.os.argv.len:{d}\n", .{std.os.argv.len}); // 3

    // std.process.args(); //  std.process.ArgIterator.init() 别名

    var it_arg = std.process.ArgIterator.init();
    while (it_arg.next()) |v| {
        std.debug.print("v:{s}\n", .{v});
    }
}
