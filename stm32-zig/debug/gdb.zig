const std = @import("std");
const chip = @import("chip");

const ErrorRread = error{
    FileNotFound,
};

fn curdir() []const u8 {
    return comptime std.fs.path.dirname(@src().file) orelse ".";
}

test "root:" {
    std.debug.print("path:{s}\n", .{comptime curdir() ++ "/gdb.tmp"});
}

// 读文件
fn readFile(allocator: std.mem.Allocator) ErrorRread!std.fs.File {
    // const dir = comptime curdir();
    const dir = std.fs.cwd().realpathAlloc(allocator, "./debug") catch return ErrorRread.FileNotFound;
    defer allocator.free(dir);
    const gdbpath = std.fs.path.resolve(allocator, &.{ dir, "./gdb.tmp" }) catch return ErrorRread.FileNotFound;
    defer allocator.free(gdbpath);

    std.debug.print("dir:{s},{s}\n", .{ dir, gdbpath });
    const file = std.fs.openFileAbsolute(gdbpath, .{ .mode = .read_write }) catch return ErrorRread.FileNotFound;
    return file;
}

// 读取行
fn parseFile(allocator: std.mem.Allocator, file: std.fs.File) ![][]u8 {
    var buf = std.ArrayList([]u8).init(allocator);
    var buftmp = std.ArrayList(u8).init(allocator);
    defer buftmp.deinit();

    std.debug.print("line:{s}\n", .{std.mem.trim(u8, "     sdfsd sdfs ", " ")});

    const reader = file.reader();
    while (true) {
        reader.streamUntilDelimiter(buftmp.writer(), '\n', null) catch break;
        // std.debug.print("line:{s},len:{}\n", .{ buftmp.items, buftmp.items.len });
        // std.debug.print("line:{s},len:{}\n", .{ std.mem.trim(u8, buftmp.items, " "), buftmp.items.len });
        try readLine(allocator, &buf, buftmp.items);

        buftmp.clearRetainingCapacity();
        std.time.sleep(100000000);
    }

    return buf.toOwnedSlice();
}
fn readLine(allocator: std.mem.Allocator, buf: *std.ArrayList([]u8), line: []const u8) !void {
    // std.debug.print("line:{s},len:{}\n", .{ line, line.len });
    // var lineIter = std.mem.split(u8, line, "0x");
    var lineIter = std.mem.splitScalar(u8, line, 0x09);

    while (lineIter.next()) |item| {
        std.debug.print("item:{s}\n", .{item});
        if (item.len == 0) continue;
        if (std.mem.indexOfScalar(u8, item, ':')) |i| {
            if (i >= 0) continue;
        }
        // std.mem.copyForwards(comptime T: type, dest: []T, source: []const T)
        try buf.append(try allocator.dupe(u8, item));
    }
}

test "file:" {
    const allocator = std.testing.allocator;
    const file = try readFile(allocator);
    std.debug.print("file:{}\n", .{file});
    // file.read(buffer: []u8)

    std.debug.print("reader:{}\n", .{file.reader()});
    const list = try parseFile(allocator, file);
    defer allocator.free(list);
    for (list) |item| {
        defer allocator.free(item);
        std.debug.print("list:{s}\n", .{item});
    }
    std.debug.print("list:{}\n", .{list.len});
}
pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const file = readFile(allocator) catch |err| {
        std.debug.print("err:{}\n", .{err});
        // unreachable;
        @panic("read file error");
    };
    std.debug.print("file:{}\n", .{file});
    const list = parseFile(allocator, file) catch |err| {
        std.debug.print("err:{}\n", .{err});
        // unreachable;
        @panic("xx");
    };
    defer allocator.free(list);
    std.debug.print("list:{}\n", .{list.len});
    for (list) |item| {
        std.debug.print("list:{s}\n", .{item});
    }

    std.debug.print("chip:{}\n", .{chip.devices.STM32F103.peripherals.RTC});
}
