const std = @import("std");

pub fn main() !void {
    comptime var l: []const comp_struct = &.{};
    l = append(.{ .num = 1 }, l);
    l = append(.{ .num = 2 }, l);

    const p = std.fmt.comptimePrint("{any}", .{l});
    std.debug.print("{s}\n", .{p});
}

const comp_struct = struct {
    num: comptime_int,
};

fn append(comptime cs: comp_struct, comptime list: []const comp_struct) []const comp_struct {
    return list ++ @as([]const comp_struct, &.{cs});
}
