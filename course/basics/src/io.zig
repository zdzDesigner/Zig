const std = @import("std");

pub fn logic() !void {
    std.log.info("--------- io ---------", .{});
    var buf: [40]u8 = undefined;
    std.log.info("{}", .{@TypeOf(&buf)}); // *[40]u8

    readBuf(&buf);
    try json();
    try cmd();
}

fn readBuf(buf: []u8) void { // ??? 隐士转换
    std.log.info("{}", .{@TypeOf(buf)}); // []u8
    // _ = buf;
}

fn json() !void {
    const out = std.io.getStdOut();

    try std.json.stringify(.{
        .name = "zdz",
    }, .{}, out.writer());
}

const User = struct {
    index: usize,
};
fn cmd() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    // 所有权问题(生命周期)
    var lookup = std.StringHashMap(User).init(allocator);
    defer {
        var it = lookup.keyIterator();
        while (it.next()) |key| {
            // 释放实际的值，因为这是我们通过 `dupe` 分配的，所以我们使用 `key.*`
            allocator.free(key.*); // 释放复制的key
        }
        lookup.deinit();
    }

    const stdin = std.io.getStdIn().reader();

    const stdout = std.io.getStdOut().writer();

    var i: usize = 0;

    while (true) : (i += 1) {
        try stdout.print("Please enter a name:", .{});
        var buf: [40]u8 = undefined;

        if (try stdin.readUntilDelimiterOrEof(&buf, '\n')) |line| {
            std.log.info("{s}", .{line});
            const name: []u8 = line;
            if (name.len == 0) {
                break;
            }
            // dupe 复制
            try lookup.put(try allocator.dupe(u8, name), .{ .index = i });

            // try lookup.put(line, .{ .length = i });
            // break;
        }
    }

    var it = lookup.iterator();
    while (it.next()) |kv| {
        std.log.info("{s} = {any}", .{ kv.key_ptr.*, kv.value_ptr.* });
    }

    const iszdz = lookup.contains("zdz");

    std.log.info("{any}", .{iszdz});
}

test "hashmap leak" {
    try cmd();
}
