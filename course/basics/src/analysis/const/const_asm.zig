const std = @import("std");

const A = struct {
    v: u8,
};

fn change(a1: A, a2: *A) void {
    std.debug.print("a1 addr:{*}\n", .{&a1});
    a2.v = 4;
    _ = a1.v + a2.v;
}
pub fn main() !void {
    var a = A{ .v = 8 };
    std.debug.print("a1 addr:{*}\n", .{&a});
    change(a, &a);
}
