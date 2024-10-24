const std = @import("std");

// blk 有两种模式
// blk 有两种模式

// 1. 运行模式(runtime)
fn normalBlk(comptime source: []const u8) void {
    const litters = blk: {
        var buffer: [source.len]u8 = undefined;
        break :blk std.ascii.lowerString(&buffer, source);
    };

    std.debug.print("litters:{s}\n", .{litters});
}

// 2. 编译期模式(comptime)
fn comptimeBlk(comptime source: []const u8) void {
    const litters = comptime blk: {
        var buffer: [source.len]u8 = undefined;
        _ = std.ascii.lowerString(&buffer, source);
        break :blk buffer;
    };

    std.debug.print("litters:{s}\n", .{litters});
}

pub fn main() void {
    comptimeBlk("AAAAAA");
    normalBlk("BBBBBB");
}
