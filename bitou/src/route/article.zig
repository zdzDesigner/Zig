const std = @import("std");
const String = @import("string").String;
const webui = @import("webui");
const zin = @import("./manager.zig");
const db = @import("../db/mysql/db.zig");
const lang = @import("../util/lang.zig");
const conv = @import("../util/conv.zig");
const buffer = @import("../util/buffer.zig");
const mem = std.mem;
const json = std.json;

pub fn list(ctx: zin.Context) !void {
    const data = try ctx.getData(struct {
        article_ids: ?[]const u8,
        manifest: ?bool,
    });
    defer data.?.deinit();

    // std.debug.print("data:{any}\n", .{data.?});
    // data.?.value.manifest

    var sqler = try db.Sqler(db.Article).init(ctx.allocator);

    var str = String.init(ctx.allocator);
    try str.concat(data.?.value.article_ids.?);
    // std.debug.print("v:{any}\n", .{v});
    const ops = try sqler.in("id", try sqler.toIn(try str.splitAll("-"))).selectSlice(null);
    defer sqler.deinit(ops);

    var res = buffer.Response.init(ctx.allocator);
    defer res.deinit();
    try res.toJSON(struct { code: usize, data: []db.Article }{
        .code = 0,
        .data = ops,
    });

    ctx.evt.?.returnString(res.buffer.data[0..res.buffer.pos :0]);
    // ctx.evt.?.returnString("[]");
}

pub fn save(ctx: zin.Context) !void {
    // {"data":[{"action_type":1,"action_entity":0,"action_entity_id":1,"update_time":1729569565}]}
    const Args = struct {
        data: []db.Article,
    };

    const data = try ctx.getData(Args);
    defer data.?.deinit();
    std.debug.print("data:{any}\n", .{data});

    // var sqler = try db.Sqler(db.Article).init(ctx.allocator);
    // const ops = try sqler.limit(try sqler.toLimit("200", "10")).selectSlice(null);
    // defer sqler.deinit(ops);
    //
    // var res = buffer.Response.init(ctx.allocator);
    // defer res.deinit();
    // try res.toJSON(ops);

    // 当前的接口
    ctx.evt.?.returnString("[]");
}
