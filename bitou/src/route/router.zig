const std = @import("std");
const webui = @import("webui");
const manager = @import("./manager.zig");
const mem = std.mem;

pub const ManageRouter = manager.ManageRouter;

pub fn bind(allocator: mem.Allocator, win: webui) !manager.ManageRouter {
    var router = manager.ManageRouter.init(allocator, win);
    try router.use("/stage", struct {
        fn f(ctx: manager.Context) void {
            // std.debug.print("stage:router:{}\n", .{ctx.evt});
            // ctx.evt.returnString(str: [:0]const u8)
            const key = ctx.evt.element;
            std.debug.print("key:{s}\n", .{key});
            const str = std.fmt.allocPrintZ(ctx.allocator, "response:{s}", .{key}) catch unreachable;
            defer ctx.allocator.free(str);
            ctx.evt.returnString(str);
        }
    }.f);

    return router;
}
