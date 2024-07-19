const std = @import("std");
const manager = @import("./manager.zig");
const mem = std.mem;

pub fn bind(allocator: mem.Allocator) !void {
    manager.ManageRouter.init(allocator);
    try manager.ManageRouter.use("/stage", struct {
        fn handle(_: manager.Context) void {
            std.debug.print("stage:router:", .{});
        }
    }.handle);
}
