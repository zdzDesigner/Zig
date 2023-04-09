const std = @import("std");

pub fn main() !void {
    std.log.info("vvv", .{});
    std.log.debug("vvv", .{});
    const path = try pageAlloc();

    // exe.linkLibC()
    // const path = try cAlloc();

    std.log.info("{s}", .{path});
}
fn pageAlloc() ![]u8 {
    var message = [_]u8{ 'p', 'a', 'g', 'e', 'A', 'l', 'l', 'o', 'c' };

    // std.log.info("{s}", .{message});
    std.debug.print("print::{s}\n", .{message});

    const message_copy = try std.heap.page_allocator.dupe(u8, &message);

    return message_copy;
}
fn cAlloc() ![]u8 {
    var message = [_]u8{ 'c', 'A', 'l', 'l', 'o', 'c' };

    std.log.info("{s}", .{message});

    const message_copy = try std.heap.c_allocator.dupe(u8, &message);

    return message_copy;
}

test "simple test" {}
