const std = @import("std");

pub fn GenIterator(comptime T: type) type {
    return struct {
        list: []const T,
        index: u32 = 0,
        const Self = @This();

        pub fn init(items: []const T) Self {
            return Self{ .list = items };
        }

        pub fn next(iter: Self) ?[]const T {
            if (iter.index >= iter.list.len) return null;

            const item = iter.list[iter.index];
            iter.index += 1;
            return item;
        }
    };
}
