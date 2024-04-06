const std = @import("std");

// Run C code directly in Zig, without explicitly building a separate library.
// const math = @cImport({
//     @cDefine("INCREMENT_BY", "10");
//     @cInclude("math.c");
// });

// Run C code using a linked library.
extern fn add(a: i32, b: i32) i32;
extern fn increment(x: i32) i32;

pub fn main() !void {
    const a = 21;
    const b = 21;
    // const c = math.add(a, b);
    const c = add(a, b);

    std.debug.print("zig: a + b == {}\n", .{c});
    // std.debug.print("zig: a++ == {}\n", .{math.increment(a)});
    std.debug.print("zig: a++ == {}\n", .{increment(a)});

    // The C standard library is also available directly in
    // the Zig standardd library for convenience.
    _ = std.c.printf("zig: a + b == %d\n", c);
}
