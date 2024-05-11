const std = @import("std");

fn root() []const u8 {
    return comptime (std.fs.path.dirname(@src().file) orelse ".");
}

test "@src().file:" {
    std.debug.print("curpath:{s}\n", .{@src().file});
}

test "path:" {
    const v = try std.fs.path.resolve(std.testing.allocator, &.{ root(), "../../" });
    defer std.testing.allocator.free(v);
    std.debug.print("resolve::path:{s}\n", .{v});
}
