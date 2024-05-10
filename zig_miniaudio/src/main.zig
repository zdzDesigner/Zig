const std = @import("std");
const audio = @import("./miniaudio.zig");

pub fn main() !void {
    const filepath = "/home/zdz/Documents/Try/Zig/zig-pro/zig_miniaudio/asserts/the_flower.mp3";

    try audio.play(filepath);

    // var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    // var allocator = gpa.allocator();

    // var engine = try audio.AudioEngine.create(&allocator);
    // defer engine.destroy();
    // const rootpath = try root(allocator);
    // // const info = @typeInfo(@TypeOf(rootpath)).Pointer;
    // defer allocator.free(rootpath);
    // std.debug.print("rootpath:{s}\n", .{rootpath});
    //
    // try engine.playOneShot("/home/zdz/Documents/Try/Zig/zig-pro/zig_miniaudio/asserts/the_flower.mp3");

    // std.time.sleep(100000000000);
}

inline fn root(allocator: std.mem.Allocator) ![]u8 {
    const main_path = comptime (std.fs.path.dirname(@src().file) orelse ".");
    std.debug.print("main_path:{s}\n", .{@src().file});
    std.debug.print("main_path:{s}\n", .{main_path});
    return try std.fs.path.resolve(allocator, &.{ main_path, "../../" });
}
