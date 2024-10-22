const std = @import("std");
const webui = @import("webui");
const myzql = @import("myzql");
const zin = @import("./manager.zig");
const operation = @import("./operation.zig");
const stage = @import("./stage.zig");
const article = @import("./article.zig");
const mem = std.mem;
const json = std.json;

pub fn bind(allocator: mem.Allocator, win: webui) !zin.ManageRouter {
    var router = zin.ManageRouter.init(allocator, win);

    try router.get("/operation/list", operation.list);
    try router.post("/operation/list", operation.save);
    try router.get("/stage", stage.list);
    try router.post("/stage", stage.save);
    try router.get("/article", article.list);
    try router.post("/stage", stage.save);

    return router;
}
