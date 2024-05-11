const std = @import("std");

const ErrorRread = error{
    FileNotFound,
};

fn curdir() ?[]const u8 {
    return comptime std.fs.path.dirname(@src().file);
}

test "root:" {
    if (comptime curdir()) |dir| {
        std.debug.print("path:{s}\n", .{dir ++ "/gdb.tmp"});
    }
}

fn readGdb() ErrorRread!std.fs.File {
    const dir = (comptime curdir()) orelse return .FileNotFound;
    const file = std.fs.openFileAbsolute(dir ++ "/gdb.tmp", .{ .mode = .read_write }) catch ErrorRread.FileNotFound;
    return file;
}

test "file:" {
    const file = try readGdb();
    std.debug.print("file:{}\n", .{file});
    // file.read(buffer: []u8)

    std.debug.print("reader:{}\n", .{file.reader()});
    readLine(std.testing.allocator, file);
}
fn readLine(alloctor: std.mem.Allocator, file: std.fs.File) void {
    var buf = std.ArrayList(u8).init(alloctor);
    defer buf.deinit();

    std.debug.print("line:{s}\n", .{std.mem.trim(u8, "     sdfsd sdfs ", " ")});

    const reader = file.reader();
    while (true) {
        // reader.streamUntilDelimiter(buf.writer(), '\n', null) catch |err| {
        //     std.debug.print("err:{}\n", .{err});
        //     break;
        // };
        reader.streamUntilDelimiter(buf.writer(), '\n', null) catch break;
        // std.debug.print("line:{s},len:{}\n", .{ buf.items, buf.items.len });
        std.debug.print("line:{s},len:{}\n", .{ std.mem.trim(u8, buf.items, " "), buf.items.len });

        buf.clearRetainingCapacity();
        std.time.sleep(100000000);
    }
}
pub fn main() !void {
    // readGdb()

    std.debug.print("xxxxxxx debug", .{});
}
