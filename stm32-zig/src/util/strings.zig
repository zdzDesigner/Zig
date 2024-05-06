const std = @import("std");

// 无需堆上分配
pub inline fn intToStr(comptime size: comptime_int, comptime format: []const u8, val: anytype) []const u8 {
    var buf: [size]u8 = undefined;
    return std.fmt.bufPrint(&buf, format, .{val}) catch "\r\n";
}
pub inline fn intToStr2(comptime size: comptime_int, comptime format: []const u8, val: anytype) []const u8 {
    var buf: [size]u8 = undefined;
    return std.fmt.bufPrint(&buf, format, val) catch "\r\n";
}
