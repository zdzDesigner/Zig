const std = @import("std");
const math = @import("math");

pub fn main() !void {
    const a = 21;
    const b = 21;
    const c = math.add(a, b);

    std.debug.print("declaration lib zig: a + b == {}\n", .{c});
    std.debug.print("declaration lib zig: a++ == {}\n", .{math.increment(a)});
}
