const std = @import("std");
const webui = @import("webui");
const zin = @import("./manager.zig");
const db = @import("../db/mysql/db.zig");
const mem = std.mem;
const json = std.json;

pub fn operation(ctx: zin.Context) !void {
    const key = ctx.evt.element;
    std.debug.print("key:{s}\n", .{key});
    try db.select(ctx.allocator);
    const str = try std.fmt.allocPrintZ(ctx.allocator, "response xx:{s}xxx", .{key});
    defer ctx.allocator.free(str);
    ctx.evt.returnString(str);
}
