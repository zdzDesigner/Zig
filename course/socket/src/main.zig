const std = @import("std");
const http = std.http;
const net = std.net;

pub fn main() !void {
    var buf: [1024]u8 = undefined;

    // const stream = try net.connectUnixSocket(":8089");
    // const address: net.Address = .{ .in = .{ .sa = .{ .port = 8089, .addr = 0 } } };
    const address = net.Address.initIp4([4]u8{ 0, 0, 0, 0 }, 8089);
    var server = try address.listen(.{});

    while (true) {
        const conn = try server.accept();
        std.debug.print("conn:{}\n", .{conn});

        const size = try server.stream.readAll(&buf);
        std.debug.print("size:{}\n", .{size});
    }
    // const server = http.Server.init(.{ .stream = , .address = address }, &buf);

    // std.debug.print("server:{}\n", .{server});

    // server.next_request_start

}
