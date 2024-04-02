const std = @import("std");

test "json " {
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
