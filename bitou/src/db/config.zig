const std = @import("std");
const mem = std.mem;
const myzql = @import("myzql");
const Conn = myzql.conn.Conn;

pub fn init(allocator: mem.Allocator) !void {
    var client = try Conn.init(allocator, &.{
        // .username = "root",
        // .password = "",
        .database = "badnib_zdz_3",
    });
    defer client.deinit();

    std.debug.print("ping .......", .{});
    try client.ping();
    std.debug.print("ok!", .{});
}
