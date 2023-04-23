const std = @import("std");
const log = std.log;
const fs = std.fs;
const allocator = std.heap.page_allocator;

pub fn main() !void {
    // var args: std.process.ArgIterator = std.process.args();
    var args = std.process.args();
    log.info("get args {} ", .{args});

    const val = args.skip();
    log.info("get args  {}", .{val});

    // const arg1: [:0]const u8 = args.next().?;
    // std.log.info("get args  {}", .{@TypeOf(arg1)});
    // std.log.info("get args  {s}", .{arg1});
    const elffile: [:0]const u8 = args.next().?;
    log.info("get args  {s}", .{elffile}); // 一定要加 {s}

    var f = try fs.cwd().openFile(elffile, fs.File.OpenFlags{});

    // 分配
    const buf: []u8 = try allocator.alloc(u8, 4);
    defer allocator.free(buf);

    const size = try f.read(buf);
    log.info("valid size:{d}", .{size});
    log.info("read buf:{d}", .{buf.len});
    log.info("read buf:{s}", .{buf});

    // if (buf[0..4].* == [4]u8{ '\x7f', 'E', 'L', 'F' }) {
    //     log.info("OKxx", .{});
    // }
    eql([4]u8, buf[0..4], []u8{ '\x7f', 'E', 'L', 'F' });
}

// fn compare(buf1: []u8, buf2: []u8) bool {
// }
pub inline fn eql(comptime T: type, a: []const T, b: []const T) bool {
    const n = 32;
    const V8x32 = @Vector(n, T);
    if (a.len != b.len) return false;
    if (a.ptr == b.ptr) return true;
    if (a.len < n) {
        // Too small to fit, fallback to standard eql
        for (a) |item, index| {
            if (b[index] != item) return false;
        }
    } else {
        var end: usize = n;
        while (end < a.len) {
            const start = end - n;
            const a_chunk: V8x32 = a[start..end][0..n].*;
            const b_chunk: V8x32 = b[start..end][0..n].*;
            if (!@reduce(.And, a_chunk == b_chunk)) {
                return false;
            }
            end = std.math.min(end + n, a.len);
        }
    }
    return true;
}


test "simple test" {
    var list = std.ArrayList(i32).init(std.testing.allocator);
    defer list.deinit(); // try commenting this out and see if zig detects the memory leak!
    try list.append(42);
    try std.testing.expectEqual(@as(i32, 42), list.pop());
}
