const std = @import("std");
const testing = std.testing;

const SliceIterator = struct {
    args: []const []const u8,
    index: usize = 0,

    const Self = @This();
    fn next(self: *Self) ?[]const u8 {
        if (self.args.len <= self.index) return null;

        defer self.index += 1;
        return self.args[self.index];
    }
};

test "iterator string" {
    // const iter = SliceIterator{ // 如果是const iter.index 无法修改
    var iter = SliceIterator{
        .args = &.{ "zdz", "zdc" },
    };

    std.debug.print("\n", .{});
    std.debug.print("{s}\n", .{iter.next().?});
    std.debug.print("{s}\n", .{iter.next().?});
    if (iter.next() == null) {
        std.debug.print("is end\n", .{});
    }

    const names = [_][]const u8{ "zdz", "zdc" };
    var iter2 = SliceIterator{
        .args = &names,
    };

    for (names) |name| {
        // std.debug.print("name:{s}\n", .{name});
        try testing.expectEqualStrings(name, iter2.next().?);
    }
}
