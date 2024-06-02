const std = @import("std");

const isTrait = fn (type) bool;
fn is(comptime id: std.builtin.TypeId) isTrait {
    return struct {
        fn trait(comptime T: type) bool {
            return id == @typeInfo(T);
        }
    }.trait;
}

test "is:" {
    const V = struct {};
    std.debug.print("is(.Struct)(V):{}\n", .{is(.Struct)(V)}); // true

    std.debug.print("direct:{}\n", .{@typeInfo(V) == std.builtin.TypeId.Struct}); // true
}
