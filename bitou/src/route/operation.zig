const std = @import("std");
const webui = @import("webui");
const zin = @import("./manager.zig");
const db = @import("../db/mysql/db.zig");
const lang = @import("../util/lang.zig");
const buffer = @import("../util/buffer.zig");
const mem = std.mem;
const json = std.json;

pub fn list(ctx: zin.Context) !void {
    const Args = struct {};

    const data = try ctx.getData(Args);
    defer data.?.deinit();

    var sqler = try db.Sqler(db.Operation).init(ctx.allocator);
    const ops = try sqler.selectSlice(null);
    defer sqler.deinit(ops);

    try ctx.data(struct {
        code: usize,
        data: []db.Operation,
    }{
        .code = 0,
        .data = ops,
    });
}

pub fn save(ctx: zin.Context) !void {
    // {"data":[{"action_type":1,"action_entity":0,"action_entity_id":1,"update_time":1729569565}]}
    const Args = struct {
        data: []db.Operation,
    };

    const data = try ctx.getData(Args);
    defer data.?.deinit();
    // std.debug.print("data:{any}\n", .{data});

    // var sqler = try db.Sqler(db.Operation).init(ctx.allocator);
    // const ops = try sqler.limit(try sqler.toLimit("200", "10")).selectSlice(null);
    // defer sqler.deinit(ops);
    //
    // var res = buffer.Response.init(ctx.allocator);
    // defer res.deinit();
    // try res.toJSON(ops);

    // 当前的接口
    ctx.evt.?.returnString("[]");
}
