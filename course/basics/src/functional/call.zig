const std = @import("std");

pub fn main() !void {
    try pool.init(.{ .allocator = std.heap.page_allocator });
    try call2(printStuff, .{ 12, "hello" });

    std.time.sleep(std.time.ns_per_s);
}

fn printStuff(a: i32, b: []const u8) !void {
    std.log.info("a = {d}, b = {s}", .{ a, b });
}

/// -------------
var pool = std.Thread.Pool{ .allocator = undefined, .threads = undefined };

/// fn f(args: anytype) !void
pub fn call2(f: anytype, args: anytype) !void {
    try pool.spawn(execute, .{ f, args });
}

fn execute(f: anytype, args: anytype) void {
    @call(.auto, f, args) catch |err| {
        std.log.err("error: {s}", .{err});
    };
}
