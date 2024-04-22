const std = @import("std");

test "**" {
    const list = [1]bool{false} ** 10;

    std.debug.print("list.len:{}\n", .{list.len}); // 10
    std.debug.print("list[9]:{}\n", .{list[9]}); // false
}
