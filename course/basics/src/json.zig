const std = @import("std");

test "json::stringify " {
    const out = std.io.getStdOut();

    try std.json.stringify(.{
        .this_is = "an anonymous struct",
        .above = true,
        .last_param = "are options",
    }, .{ .whitespace = .indent_2 }, out.writer());
}

test "buf json" {
    var buf: [121]u8 = undefined; // 120 OutOfMemory
    var fa = std.heap.FixedBufferAllocator.init(&buf);
    defer fa.reset();

    const allocator = fa.allocator();

    const json = try std.json.stringifyAlloc(allocator, .{
        .this_is = "an anonymous struct",
        .above = true,
        .last_param = "are options",
    }, .{ .whitespace = .minified });
    defer allocator.free(json);

    std.debug.print("{s},{d}\n", .{ buf, buf.len });
    std.debug.print("{s},{d}\n", .{ json, json.len }); // 73
}

const V = struct {
    name: []const u8,
    size: u16,
};
test "json::parse:" {
    const res = try std.json.parseFromSlice(
        V,
        std.testing.allocator,
        "{\"name\":\"zdz\",\"size\":90}",
        .{},
    );
    std.debug.print("res:{}\n", .{res.value});
    std.debug.print("name:{s}\n", .{res.value.name});
    std.debug.print("size:{}\n", .{res.value.size});

    defer res.deinit();

    // 使用 反斜杠
    const res2 = try std.json.parseFromSlice(
        V,
        std.testing.allocator,
        \\{"name":"zdz","size":90}
    ,
        .{},
    );
    std.debug.print("res:{}\n", .{res2.value});

    defer res2.deinit();
}
