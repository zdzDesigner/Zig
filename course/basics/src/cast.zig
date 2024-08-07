const std = @import("std");
// @as(i8, @intCast(10))
//
test "as" {
    std.debug.print("=============\n", .{});
    std.debug.print("{any}\n", .{@bitCast([_]u8{'G'})}); // 71
    std.debug.print("{any}\n", .{@as(u8, @bitCast([_]u8{'G'}))}); // 71
    // 01000111 => 71
    std.debug.print("{any}\n", .{@as(u16, @bitCast([_]u8{ 'G', 'G' }))}); // 18247
    // 0b0100011101000111 => 18247
    std.debug.print("{any}\n", .{@as(u32, @bitCast([4]u8{ 'G', 'E', 'T', ' ' }))});
    std.debug.print("{any}\n", .{@as(u32, @bitCast([_]u8{ 'a', 'a', 'a', 'a' }))});
    std.debug.print("{any}\n", .{@as(u32, @bitCast([4]u8{ 'a', 'a', 'a', 'a' }))});
}
