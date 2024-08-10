const std = @import("std");

fn append(buf: []u8) void {
    for (0..buf.len) |i| {
        buf[i] = 'a';
    }
}
test "buffer assgin:" {
    const buf: [8]u8 = undefined; // 分配8个0

    std.debug.print("buf.len:{}\n", .{buf.len});
    std.debug.print("buf:{s}\n", .{buf});
    std.debug.print("buf[0]:{}\n", .{buf[0]});
    std.debug.print("buf[1]:{}\n", .{buf[1]});

    // 安全 0 ================================
    const buf2: [8]u8 = std.mem.zeroes([8]u8); // 分配8个0
    std.debug.print("buf2.len:{}\n", .{buf2.len});
    std.debug.print("buf2:{s}\n", .{buf2});
    std.debug.print("buf2[0]:{}\n", .{buf2[0]});
    std.debug.print("buf2[1]:{}\n", .{buf2[1]});
}

test "buffer jump add:" {
    var buf: [8]u8 = std.mem.zeroes([8]u8); // 分配8个0

    std.debug.print("buf.ptr:{*}\n", .{&buf});
    append(buf[0..3]);
    append(buf[5..6]);
    std.debug.print("buf.ptr:{*}\n", .{buf[0..3]});
    std.debug.print("buf.ptr:{*}\n", .{buf[5..6]});

    // buf[1..3] 指针: &buf+1,  长度为2
    // buf[1..3][1..2]  在buf[1..3]内 指针:&buf +1 +1,  长度为1

    const p = buf[1..3][1..2]; // 指针: &buf + 2 , len:1
    std.debug.print("buf.ptr:{*}\n", .{p});
    std.debug.print("buf.len:{}\n", .{p.len});

    std.debug.print("buf:{s}\n", .{buf});

    for (0..buf.len) |i| {
        std.debug.print("{}\n", .{buf[i]});
    }
}
