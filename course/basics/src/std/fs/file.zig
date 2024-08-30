const std = @import("std");

test "std:" {
    try std.io.getStdOut().writer().print("std out:{s}\n", .{""});
    try std.io.getStdErr().writer().print("std err:{s}\n", .{""});
    try std.io.getStdIn().writer().print("std in:{s}\n", .{"xx"});
}
test "stdIn read:" {
    // var buf: [2]u8 = undefined;
    // const reader = std.io.getStdIn().reader();
    // // const size = try std.io.getStdIn().reader().readAll(&buf);
    //
    // while (true) {
    //     _ = reader.readUntilDelimiterOrEof(&buf, '\n') catch |err| {
    //         std.debug.print("err:{}\n", .{err});
    //         @panic("");
    //     };
    //     // std.debug.print("size:{}\n", .{size});
    //     std.debug.print("buf:{s}\n", .{buf});
    // }
}

test "read file:" {
    const f = try std.fs.openFileAbsolute("/home/zdz/Documents/Try/Zig/zig-pro/course/basics/src/std/fs/system_file.json", .{ .mode = .read_write });
    defer f.close();
    const reader = f.reader();
    // 方式一 ========================
    // while (true) {
    //     const b = reader.readByte() catch |err| switch (err) {
    //         error.EndOfStream => break,
    //         else => |e| return e,
    //     };
    //     std.debug.print("{}", .{b});
    // }
    // 方式二 ========================
    while (true) {
        const b = reader.readByte() catch |err| {
            if (err == error.EndOfStream) break;
            return err;
        };
        std.debug.print("{}", .{b});
    }
}
test "read file2:" {
    const f = try std.fs.openFileAbsolute("/home/zdz/Documents/Try/Zig/zig-pro/course/basics/src/std/fs/system_file.json", .{ .mode = .read_write });
    defer f.close();
    const reader = f.reader();

    var list = std.ArrayList(u8).init(std.testing.allocator);
    defer list.deinit();

    while (true) {
        reader.streamUntilDelimiter(list.writer(), '\n', null) catch |err| {
            if (error.EndOfStream != err) return err;
            std.debug.print("file file2:{s}\n", .{list.items});
            break;
        };
    }
}
test "read file3:" {
    const f = try std.fs.openFileAbsolute("/home/zdz/Documents/Try/Zig/zig-pro/course/basics/src/std/fs/system_file.json", .{ .mode = .read_write });
    defer f.close();

    var list = std.ArrayList(u8).init(std.testing.allocator);
    defer list.deinit();

    var buf: [100]u8 = undefined;
    const size = try f.readAll(&buf);
    std.debug.print("read file3:{s}\n", .{buf[0..size]});
    std.debug.print("size:{}\n", .{size});
}
test "read file4:" {
    const f = try std.fs.openFileAbsolute("/home/zdz/Documents/Try/Zig/zig-pro/course/basics/src/std/fs/system_file.json", .{ .mode = .read_write });
    defer f.close();

    var list = std.ArrayList(u8).init(std.testing.allocator);
    defer list.deinit();

    while (true) {
        var buf: [2]u8 = undefined;
        const size = try f.readAll(&buf);
        // std.debug.print("{s}", .{buf[0..size]});
        try list.appendSlice(buf[0..size]);
        if (size < 2) break;
    }
    std.debug.print("read file4:{s}\n", .{list.items});
}

test "read file5:" {
    const allocator = std.testing.allocator;
    const f = try std.fs.openFileAbsolute("/home/zdz/Documents/Try/Zig/zig-pro/course/basics/src/std/fs/system_file.json", .{ .mode = .read_write });
    defer f.close();

    var bufs: []u8 = allocator.alloc(u8, 0) catch @panic("OOM");
    while (true) {
        var buf: [2]u8 = undefined;
        const size = try f.readAll(&buf);
        const newbufs = try std.fmt.allocPrint(allocator, "{s}{s}", .{ bufs, buf[0..size] });
        allocator.free(bufs);
        bufs = newbufs;

        if (size < 2) break;
    }
    std.debug.print("read file5:{s}\n", .{bufs});
    allocator.free(bufs);
}
test "read file6:" {
    const allocator = std.testing.allocator;
    const f = try std.fs.openFileAbsolute("/home/zdz/Documents/Try/Zig/zig-pro/course/basics/src/std/fs/system_file.json", .{ .mode = .read_write });
    defer f.close();

    var bufs: []u8 = allocator.alloc(u8, 0) catch @panic("OOM");
    while (true) {
        var buf: [2]u8 = undefined;
        const size = try f.readAll(&buf);

        const newbufs = try std.mem.join(allocator, "", &.{ bufs, buf[0..size] });
        allocator.free(bufs);

        bufs = newbufs;

        if (size < 2) break;
    }
    std.debug.print("read file6:{s}\n", .{bufs});
    allocator.free(bufs);
}
test "read file7:" {
    const allocator = std.testing.allocator;
    const f = try std.fs.openFileAbsolute("/home/zdz/Documents/Try/Zig/zig-pro/course/basics/src/std/fs/system_file.json", .{ .mode = .read_write });
    defer f.close();

    var bufs: []u8 = allocator.alloc(u8, 0) catch @panic("OOM");
    while (true) {
        var buf: [2]u8 = undefined;
        const size = try f.readAll(&buf);

        const total = bufs.len + size;
        const newbufs = try allocator.alloc(u8, total); // 分配
        @memcpy(newbufs[0..bufs.len], bufs); // 拷贝
        @memcpy(newbufs[bufs.len..total], buf[0..size]); // 拷贝
        allocator.free(bufs); // 释放

        bufs = newbufs;

        if (size < 2) break;
    }
    std.debug.print("read file7:{s}\n", .{bufs});
    allocator.free(bufs);
}
test "read file8:" {
    const allocator = std.testing.allocator;
    const f = try std.fs.openFileAbsolute("/home/zdz/Documents/Try/Zig/zig-pro/course/basics/src/std/fs/system_file.json", .{ .mode = .read_write });
    defer f.close();

    var bufs: []u8 = allocator.alloc(u8, 0) catch @panic("OOM");
    while (true) {
        var buf: [2]u8 = undefined;
        const size = try f.readAll(&buf);

        const prelen = bufs.len;
        const aftlen = bufs.len + size;
        bufs = try allocator.realloc(bufs, aftlen); // 分配
        // std.debug.print("bufs.len:{},size:{}\n", .{ bufs.len, size });
        @memcpy(bufs[prelen..aftlen], buf[0..size]); // 拷贝

        if (size < 2) break;
    }
    std.debug.print("read file8:{s}\n", .{bufs});
    allocator.free(bufs);
}

// =====================================================
// =====================================================
// =====================================================
// !!!!! 后插, 手动编辑后会换行(手动编辑后默认添加\r\n)
test "write file:" {
    const f = try std.fs.openFileAbsolute("/home/zdz/Documents/Try/Zig/zig-pro/course/basics/src/std/fs/system_file.json", .{ .mode = .read_write });
    defer f.close();

    // 长度限制 write()
    // .linux => 0x7ffff000,
    // .macos, .ios, .watchos, .tvos, .visionos => maxInt(i32),

    // const size = try f.write("{xx"); //  从第一个字符开始替换
    // std.debug.print("size:{}\n", .{size}); // 3

    // const size = try f.pwrite("---", 8); //  从n个字符开始替换
    // std.debug.print("size:{}\n", .{size}); // 3

    // std.debug.print("pos:{}\n", .{try f.getPos()}); // 0
    // try f.seekTo(30); // 设置偏移
    // std.debug.print("pos:{}\n", .{try f.getPos()}); // 30
    // try f.seekBy(-2); // 设置相对偏移
    // std.debug.print("pos:{}\n", .{try f.getPos()}); // 28
    // _ = try f.write("{xx"); //  从第一个字符开始替换

    // 后插入
    // const pos_end = try f.getEndPos();
    // std.debug.print("pos_end:{}\n", .{pos_end});
    // const size = try f.pwrite("---", pos_end); //  从n个字符开始替换
    // std.debug.print("size:{}\n", .{size}); // 3
    // 后插, 手动编辑后会换行
    try f.seekFromEnd(0);
    _ = try f.write("555");

    // 无长度限制
    // try f.writeAll("1234"); // 从第一个字符开始替换
    // try writeAll(f, "abcde|");

    // const writer = f.writer();
}
// write 有长度限制
pub fn writeAll(f: std.fs.File, bytes: []const u8) std.posix.WriteError!void {
    var index: usize = 0;
    while (index < bytes.len) {
        std.debug.print("index:{}\n", .{index});
        index += try f.write(bytes[index..]);
        std.debug.print("index:{}\n", .{index});
    }
}
