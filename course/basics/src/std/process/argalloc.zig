const std = @import("std");

// std.process.argsFree 实现
pub fn argsFree(allocator: std.mem.Allocator, args_alloc: []const [:0]u8) void {
    var total_bytes: usize = 0;
    for (args_alloc) |arg| {
        total_bytes += @sizeOf([]u8) + arg.len + 1;
    }
    const unaligned_allocated_buf = @as([*]const u8, @ptrCast(args_alloc.ptr))[0..total_bytes];
    const aligned_allocated_buf: []align(@alignOf([]u8)) const u8 = @alignCast(unaligned_allocated_buf);
    return allocator.free(aligned_allocated_buf);
}

test "argsAlloc:" {
    const arg = try std.process.argsAlloc(std.testing.allocator);
    // defer std.process.argsFree(std.testing.allocator, arg);
    defer argsFree(std.testing.allocator, arg);
    std.debug.print("arg:{s}\n", .{arg});

    const v = try std.testing.allocator.alloc(u8, 100);
    defer std.testing.allocator.free(v);
    std.debug.print("v length:{}\n", .{v.len});
}
