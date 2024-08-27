const std = @import("std");
test "allocator exception:" {
    const V = struct {
        name: []const u8,
    };

    const dest = try std.testing.allocator.create(V);
    defer std.testing.allocator.destroy(dest);

    // // error:.V{ .name = { General protection exception (no address available)
    // std.debug.print("dest:{}\n", .{dest.*});
    // std.debug.print("dest:{}\n", .{dest});

    // =========================
    // 给name赋值
    dest.name = "zdz";
    std.debug.print("dest:{}\n", .{dest});
}

// 分配 zero value
test "allocator zero:" {
    const V = struct {
        name: []const u8,
    };

    const dest = std.mem.zeroes(V);
    std.debug.print("dest:{}\n", .{dest});
}
