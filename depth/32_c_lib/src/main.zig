const std = @import("std");

// Run C code using a linked library.
extern fn add(a: i32, b: i32) i32;
extern fn increment(x: i32) i32;

pub fn main() !void {
    const a = 21;
    const b = 21;
    // const c = math.add(a, b);
    const c = add(a, b);

    std.debug.print("lib zig: a + b == {}\n", .{c});
    // std.debug.print("zig: a++ == {}\n", .{math.increment(a)});
    std.debug.print("lib zig: a++ == {}\n", .{increment(a)});

    _ = std.c.printf("zig: a + b == %d\n", c);
}
