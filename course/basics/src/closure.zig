const std = @import("std");

//  error: 'name' not accessible from inner function
//             std.debug.print("name:{}\n", .{name});
//
// fn closureScope(name: []const u8) void {

// convert comptime
fn closureScope(comptime name: []const u8) void {
    struct {
        fn f() void {
            std.debug.print("name:{s}\n", .{name});
        }
    }.f();
}

test "closure::args scope:" {
    closureScope("zdz");
}
