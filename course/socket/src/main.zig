const std = @import("std");
const testing = std.testing;
const mem = std.mem;
const http = std.http;
const net = std.net;
const io = std.io;

pub fn main() !void {
    std.debug.print("pid:{}\n", .{std.os.linux.getpid()});

    // const stream = try net.connectUnixSocket(":8089");
    // const address: net.Address = .{ .in = .{ .sa = .{ .port = 8089, .addr = 0 } } };
    const address = net.Address.initIp4([4]u8{ 0, 0, 0, 0 }, 8089);
    // var server = try address.listen(.{ .force_nonblocking = true }); // 暂不支持nonblock
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

// https://github.com/ziglang/zig/blob/5c0766b6c8f1aea18815206e0698953a35384a21/lib/std/net/test.zig#L167
test "server/client:" {
    const localhost = try net.Address.parseIp("127.0.0.1", 0);

    var server = try localhost.listen(.{});
    defer server.deinit();

    const S = struct {
        fn clientFn(server_address: net.Address) !void {
            const socket = try net.tcpConnectToAddress(server_address);
            defer socket.close();

            _ = try socket.writer().writeAll("Hello world!");
        }
    };

    const t = try std.Thread.spawn(.{}, S.clientFn, .{server.listen_address});
    defer t.join();

    var client = try server.accept();
    defer client.stream.close();
    var buf: [16]u8 = undefined;
    const n = try client.stream.reader().read(&buf);

    try testing.expectEqual(@as(usize, 12), n);
    try testing.expectEqualSlices(u8, "Hello world!", buf[0..n]);
}
