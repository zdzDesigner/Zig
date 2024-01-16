const std = @import("std");
const log = std.log;

pub fn conv() void {
    log.info("force convert @intCast:{d}", .{@as(u32, @intCast(10))});
    log.info("force convert @TypeOf(@intCast):{}", .{@TypeOf(@as(u32, @intCast(10)))});
    // std.log.info("{}", .{@TypeOf(val)});
}
