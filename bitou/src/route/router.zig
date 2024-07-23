const std = @import("std");
const webui = @import("webui");
const zin = @import("./manager.zig");
const stage = @import("./stage.zig");
const mem = std.mem;
const json = std.json;

pub const ManageRouter = zin.ManageRouter;

// pub fn bind(allocator: mem.Allocator) !zin.ManageRouter {
//     // zin.ManageRouter.init(allocator);
//     // try zin.ManageRouter.use("/stage", struct {
//     //     fn handle(_: zin.Context) void {
//     //         std.debug.print("stage:router:", .{});
//     //     }
//     // }.handle);
//     var router = zin.ManageRouter.init(allocator);
//     try router.use("/stage", struct {
//         fn handle(_: zin.Context) void {
//             std.debug.print("stage:router:", .{});
//         }
//     }.handle);
//
//     return router;
// }
//
pub fn bind(allocator: mem.Allocator, win: webui) !zin.ManageRouter {
    var router = zin.ManageRouter.init(allocator, win);

    // stage
    try router.use("/stage", stage.stage);

    try router.use("/operation/list", struct {
        fn f(ctx: zin.Context) void {
            const key = ctx.evt.element;
            std.debug.print("key:{s}\n", .{key});
            const str = std.fmt.allocPrintZ(ctx.allocator, "response xx:{s}xxx", .{key}) catch unreachable;
            defer ctx.allocator.free(str);
            ctx.evt.returnString(str);
        }
    }.f);

    return router;
}
