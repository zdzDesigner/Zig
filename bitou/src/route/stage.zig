const formatter = @import("tree-fmt").defaultFormatter();

const std = @import("std");
const webui = @import("webui");
const zin = @import("./manager.zig");
const db = @import("../db/mysql/db.zig");
const lang = @import("../util/lang.zig");
const buffer = @import("../util/buffer.zig");
const mem = std.mem;
const json = std.json;

// const StageList = struct {
//     page: usize = 1,
//     size: usize = 10,
//     data: []struct {
//         name: []const u8,
//     },
// };

pub fn list(ctx: zin.Context) !void {
    const Args = struct {
        stage_ids: []const u8,
        manifest: bool,
    };
    var sqler = try db.Sqler(db.Stage).init(ctx.allocator);
    // const stages = try sqler.limit("3").selectSlice(null);
    const stages = try sqler.limit(try sqler.toLimit("2", "10")).selectSlice(null);
    // try formatter.format(stages, .{
    //     .slice_elem_limit = 1000,
    //     .ignore_u8_in_lists = true,
    // });
    defer sqler.deinit(stages);

    // var arena = std.heap.ArenaAllocator.init(ctx.allocator);
    // defer arena.deinit();
    // var res = buffer.Response{ .arena = arena.allocator() };
    // try res.toJSON(stages);
    var res = buffer.Response.init(ctx.allocator);
    defer res.deinit();
    try res.toJSON(stages);

    if (ctx.evt == null) {
        return;
    }

    // const key = ctx.evt.?.element;
    const key = ctx.getPath();
    std.debug.print("key:{s}\n", .{key.?});

    const data = try ctx.getData(Args);
    defer data.?.deinit();
    // defer ctx.deinit();
    std.debug.print("parse stage:{}\n", .{data.?.value});

    // const str = try std.fmt.allocPrintZ(ctx.allocator, "response xx:{s}xxx", .{key});
    // defer ctx.allocator.free(str);
    ctx.evt.?.returnString(res.buffer.data[0..res.buffer.pos :0]);
    // ctx.evt.?.returnValue(res.buffer.data[0..res.buffer.pos]);
}

pub fn save(ctx: zin.Context) !void {
    // {"data":[
    //   {
    //     "stage_id":1,
    //     "parent_id":0,
    //     "update_time":1729575485,
    //     "title":"default",
    //     "data":"{\"view\":{\"x\":0,\"y\":1,\"width\":309,\"height\":846,\"scale\":1,\"isshowside\":false},\"points\":[]}"
    //   }]}
    const Args = struct {
        data: []db.Stage,
    };
    const key = ctx.getPath();
    std.debug.print("key:{s}\n", .{key.?});

    const data = try ctx.getData(Args);
    defer data.?.deinit();
    // defer ctx.deinit();
    std.debug.print("parse stage:{}\n", .{data.?.value});

    // const str = try std.fmt.allocPrintZ(ctx.allocator, "response xx:{s}xxx", .{key});
    // defer ctx.allocator.free(str);
    // ctx.evt.?.returnString(res.buffer.data[0..res.buffer.pos :0]);
    // ctx.evt.?.returnValue(res.buffer.data[0..res.buffer.pos]);
    ctx.evt.?.returnString("[]");
}
