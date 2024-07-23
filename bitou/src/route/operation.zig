const std = @import("std");
const webui = @import("webui");
const zin = @import("./manager.zig");
const mem = std.mem;
const json = std.json;

pub fn operation(ctx: zin.Context) void {
    const key = ctx.evt.element;
    std.debug.print("key:{s}\n", .{key});
    const str = std.fmt.allocPrintZ(ctx.allocator, "response xx:{s}xxx", .{key}) catch unreachable;
    defer ctx.allocator.free(str);
    ctx.evt.returnString(str);
}
