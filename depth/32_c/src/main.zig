const std = @import("std");

// Run C code directly in Zig, without explicitly building a separate library.
const math = @cImport({
    @cDefine("INCREMENT_BY", "10");
    @cInclude("math.c");
});

pub fn main() !void {
    const a = 22;
    const b = 21;
    const c = math.add(a, b);

    std.debug.print("zig: a + b == {}\n", .{c});
    std.debug.print("zig: a++ == {}\n", .{math.increment(a)});

    // The C standard library is also available directly in
    // the Zig standardd library for convenience.
    _ = std.c.printf("zig: a + b == %d\n", c);
}
