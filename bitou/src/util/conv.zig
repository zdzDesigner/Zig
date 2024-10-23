const std = @import("std");

// std.mem.split(comptime T: type, buffer: []const T, delimiter: []const T)

const Iter = struct {
    next: *fn () void,
};

pub fn iterToArrayList(comptime T: type, iter: std.mem.SplitIterator(T, .sequence)) !std.ArrayList([]const T) {
    while (iter.next()) |item| {
        std.debug.print("item:{d}\n", .{item.len});
    }
}
