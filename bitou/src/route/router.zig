const std = @import("std");
const webui = @import("webui");
const myzql = @import("myzql");
const zin = @import("./manager.zig");
const stage = @import("./stage.zig");
const operation = @import("./operation.zig");
const mem = std.mem;
const json = std.json;

pub fn bind(allocator: mem.Allocator, win: webui, client: *myzql.conn.Conn) !zin.ManageRouter {
    var router = zin.ManageRouter.init(allocator, win, client);

    try router.use("/stage", stage.list);
    try router.use("/operation/list", operation.operation);

    return router;
}
