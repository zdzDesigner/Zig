const std = @import("std");

test "TypeId:" {
    std.debug.print("direct:{}\n", .{@typeInfo(struct {}) == std.builtin.TypeId.Struct}); // true

}
