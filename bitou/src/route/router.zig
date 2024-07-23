const std = @import("std");
const webui = @import("webui");
const zin = @import("./manager.zig");
const stage = @import("./stage.zig");
const operation = @import("./operation.zig");
const mem = std.mem;
const json = std.json;

pub fn bind(allocator: mem.Allocator, win: webui) !zin.ManageRouter {
    var router = zin.ManageRouter.init(allocator, win);

    try router.use("/stage", stage.stage);
    try router.use("/operation/list", operation.operation);

    return router;
}
