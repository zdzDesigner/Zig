const std = @import("std");

test "stderr:" {
    // try std.io.getStdOut().writer().print("aa:{s}", .{""});
    // try std.io.getStdErr().writer().print("aa:{s}", .{""});
    // try std.io.getStdIn().writer().print("stdin:{s}", .{"xx"});
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

    var list = std.ArrayList(u8).init(std.testing.allocator);
    defer list.deinit();
    const reader = f.reader();
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
        // const bufs2 = try allocator.alloc(u8, newbufs.len);
        // defer allocator.free(bufs2);
        // @memcpy(bufs[0..newbufs.len], newbufs);
        bufs = newbufs;
        // const cpbufs = try allocator.dupe(u8, bufs);
        // bufs = try std.mem.join(allocator, "", &.{ cpbufs, buf[0..size] });
        // allocator.free(cpbufs);

        if (size < 2) break;
    }
    std.debug.print("read file5:{s}\n", .{bufs});
    allocator.free(bufs);
}
