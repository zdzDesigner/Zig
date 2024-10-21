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
    const ops = try sqler.limit(try sqler.toLimit("2", "10")).selectSlice(null);
    defer sqler.deinit(ops);

    var arena = std.heap.ArenaAllocator.init(ctx.allocator);
    defer arena.deinit();
    var res = buffer.Response{ .arena = arena.allocator() };
    try res.toJSON(ops);

    if (ctx.evt == null) {
        return;
    }

    const key = ctx.evt.?.element;
    std.debug.print("key:{s}\n", .{key});

    const val = ctx.evt.?.getString();
    std.debug.print("val:{s}\n", .{val});
    ctx.evt.?.returnString(res.buffer.data[0..res.buffer.pos :0]);
}
