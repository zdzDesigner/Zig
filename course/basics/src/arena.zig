const std = @import("std");
test "allocator exception:" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();

    const ret = try std.fmt.allocPrint(arena.allocator(), "{s}", .{"vvvvv"});

    std.debug.print("ret:{s}\n", .{ret});
}
