const std = @import("std");
const mem = std.mem;
const myzql = @import("myzql");
const Conn = myzql.conn.Conn;

// var client: *Conn = undefined;
// pub fn init(allocator: mem.Allocator) !*Conn {
//     client.* = try Conn.init(allocator, &.{
//         .username = "zdz",
//         .password = "0",
//         .database = "badnib_zdz_3",
//     });
//     std.debug.print("ping .......", .{});
//     try client.ping();
//     std.debug.print("ok!\n", .{});
//     return client;
// }
//
// pub fn getcli() *Conn {
//     return client;
// }
pub fn init(allocator: mem.Allocator) !Conn {
    var client = try Conn.init(allocator, &.{
        .username = "zdz",
        .password = "0",
        .database = "badnib_zdz_3",
    });
    std.debug.print("ping .......", .{});
    try client.ping();
    std.debug.print("ok!\n", .{});
    return client;
}