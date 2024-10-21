const formatter = @import("tree-fmt").defaultFormatter();

const std = @import("std");
const webui = @import("webui");
const zin = @import("./manager.zig");
const db = @import("../db/mysql/db.zig");
// const json = @import("json");
const mem = std.mem;
const json = std.json;

const StageList = struct {
    data: []db.Stage,
};

pub fn list(ctx: zin.Context) !void {
    std.debug.print("stage:router:{s}\n", .{"=====list===="});
    //
    // std.debug.print("ctx.dbcli:{any}\n", .{ctx.dbcli});
    var sqler = db.Sqler(db.Stage).init(ctx.allocator, ctx.dbcli);
    // const stages = try sqler.limit("3").selectSlice(null);
    const stages = try sqler.limit(try sqler.toLimit("2", "10")).selectSlice(null);
    // const stages = try sqler.selectSlice(&.{ "article_id", "data" });
    // try formatter.format(stages, .{
    //     .slice_elem_limit = 1000,
    //     .ignore_u8_in_lists = true,
    // });
    defer sqler.deinit(stages);

    if (ctx.evt == null) return;
    const ret = try json.stringifyAlloc(ctx.allocator, stages, .{});
    // defer ctx.allocator.free(ret);
    // ctx.evt.?.returnString(ret.ptr[0..ret.len :0]);
    ctx.evt.?.returnString(ret);
    //
    if (true) return;
    //
    // const key = ctx.evt.?.element;
    // std.debug.print("key:{s}\n", .{key});
    //
    // const val = ctx.evt.?.getString();
    // if (val.len == 0) return;
    // const res_stagelist = try json.parseFromSlice(StageList, ctx.allocator, val, .{});
    // defer res_stagelist.deinit();
    // std.debug.print("parse stage:{}\n", .{res_stagelist.value});
    //
    const str = try std.fmt.allocPrintZ(ctx.allocator, "response xx:{s}xxx", .{"aa"});
    defer ctx.allocator.free(str);
    ctx.evt.?.returnString(str);
}
