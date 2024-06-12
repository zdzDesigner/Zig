const std = @import("std");
const math = @import("math");

pub fn main() !void {
    std.debug.print("add:{}\n", .{math.add(3, 8)});
    std.debug.print("increment:{}\n", .{math.increment(3)});
}
