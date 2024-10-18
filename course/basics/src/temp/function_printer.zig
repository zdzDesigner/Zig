const std = @import("std");
// As a function body. Must be comptime-known.
// As a function pointer.
fn foo(str: []const u8) void {
    std.debug.print("{s}\n", .{str});
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    _ = std.ArrayList(u8).init(gpa.allocator());
}

fn asBody(comptime print: fn (str: []const u8) void) void {
    print("hello from function body");
}

fn asPointer(print: *const fn (str: []const u8) void) void {
    print("hello from function pointer");
}

pub fn main() void {
    asBody(foo);
    asPointer(foo);
}
