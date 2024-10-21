const std = @import("std");
const webui = @import("webui");
const zin = @import("./manager.zig");
const db = @import("../db/mysql/db.zig");
const lang = @import("../util/lang.zig");
const buffer = @import("../util/buffer.zig");
const mem = std.mem;
const json = std.json;

pub fn operation(ctx: zin.Context) !void {
    var sqler = try db.Sqler(db.Operation).init(ctx.allocator);
    const ops = try sqler.limit(try sqler.toLimit("200", "10")).selectSlice(null);
    defer sqler.deinit(ops);

    var res = buffer.Response.init(ctx.allocator);
    defer res.deinit();
    try res.toJSON(ops);

    if (ctx.evt == null) {
        return;
    }

    // 当前的接口
    const path = ctx.evt.?.element;
    std.debug.print("path:{s}\n", .{path});

    // 请求携带的数据
    const data = ctx.evt.?.getString();
    std.debug.print("data:{s}\n", .{data});
    ctx.evt.?.returnString(res.buffer.data[0..res.buffer.pos :0]);
}
