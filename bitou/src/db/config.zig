const std = @import("std");
const mem = std.mem;
const myzql = @import("myzql");
const Conn = myzql.conn.Conn;

pub fn init(allocator: mem.Allocator) !void {
    var client = try Conn.init(allocator, &.{
        // .username = "root",
        // .password = "",
        .database = "badnib_zdz",
    });
    defer client.deinit();

    std.debug.print("ping .......", .{});
    try client.ping();
}
