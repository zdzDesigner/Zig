const std = @import("std");
const webui = @import("webui");
const zin = @import("./manager.zig");
const mem = std.mem;
const json = std.json;

const Stage = struct {
    stage_id: u32,
    parent_id: u32,
    update_time: u32,
    title: []const u8,
    data: []const u8,
};

const StageList = struct {
    data: []Stage,
};

pub fn list(ctx: zin.Context) !void {
    // std.debug.print("stage:router:{}\n", .{ctx.evt});

    const key = ctx.evt.element;
    std.debug.print("key:{s}\n", .{key});

    const val = ctx.evt.getString();
    const res_stagelist = try json.parseFromSlice(StageList, ctx.allocator, val, .{});
    defer res_stagelist.deinit();
    std.debug.print("parse stage:{}\n", .{res_stagelist.value});

    const str = try std.fmt.allocPrintZ(ctx.allocator, "response xx:{s}xxx", .{key});
    defer ctx.allocator.free(str);
    ctx.evt.returnString(str);
}
