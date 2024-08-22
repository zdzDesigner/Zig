const std = @import("std");
const mem = std.mem;
const http = std.http;
const net = std.net;
const io = std.io;

pub fn main() !void {
    std.debug.print("pid:{}\n", .{std.os.linux.getpid()});

    // const stream = try net.connectUnixSocket(":8089");
    // const address: net.Address = .{ .in = .{ .sa = .{ .port = 8089, .addr = 0 } } };
    const address = net.Address.initIp4([4]u8{ 0, 0, 0, 0 }, 8089);
    var server = try address.listen(.{}); // 生成接收socket_fd
    std.debug.print("server:{}\n", .{server});
    defer server.deinit();

    // var buf: [1024]u8 = undefined;
    while (true) {
        const conn = try server.accept(); // 生成发送socket_fd
        std.debug.print("conn:{}\n", .{conn});
        defer conn.stream.close();

        // const size = try server.stream.readAll(&buf);
        // const size = try read(conn.stream.reader());
        try read(conn.stream.reader());
        // std.debug.print("size:{}\n", .{size});
        std.time.sleep(std.time.ns_per_s * 10);
        try conn.stream.writeAll("HTTP/1.1 200 OK\r\nContent-Length: 13\r\n\r\nHello, World!");
    }
    // const server = http.Server.init(.{ .stream = , .address = address }, &buf);

    // std.debug.print("server:{}\n", .{server});

    // server.next_request_start

    while (true) {}
}

fn read(reader: net.Stream.Reader) !void {
    var buf: [4]u8 = undefined;
    while (true) {
        const b = reader.readByte() catch |err| {
            if (err == error.EndOfStream) break;
            return err;
        };
        buf[0] = buf[1];
        buf[1] = buf[2];
        buf[2] = buf[3];
        buf[3] = b;
        std.debug.print("{c}", .{b});
        if (mem.eql(u8, &buf, "\r\n\r\n")) {
            break;
        }
    }
}
