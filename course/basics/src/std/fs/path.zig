const std = @import("std");

fn root() []const u8 {
    return comptime (std.fs.path.dirname(@src().file) orelse ".");
}

test "@src().file:" {
    std.debug.print("curpath:{s}\n", .{@src().file});
}

test "path:" {
    const v = try std.fs.path.resolve(std.testing.allocator, &.{ root(), "../../" });
    defer std.testing.allocator.free(v);
    std.debug.print("resolve::path:{s}\n", .{v});
}

test "isAbsolute:" {
    std.debug.print("isAbsolute:{}\n", .{std.fs.path.isAbsolute("ssss")}); // false
    std.debug.print("isAbsolute:{}\n", .{std.fs.path.isAbsolute("ssss/vvv")}); // false
    std.debug.print("isAbsolute:{}\n", .{std.fs.path.isAbsolute("/ssss")}); // true
    std.debug.print("isAbsolute:{}\n", .{std.fs.path.isAbsolute("/ssss/vvv")}); // true

    const dirpath = "/home/zdz/Documents/Try/Zig/zig-pro/course/basics/src/std/fs/";
    std.debug.print("isAbsolute:{}\n", .{std.fs.path.isAbsolute(dirpath)}); // true

    const dir = try std.fs.openDirAbsolute(dirpath, .{ .iterate = true });
    var it = dir.iterate();

    while (try it.next()) |entry| {
        std.debug.print("entry.name:{s}\n", .{entry.name});
    }
}

test "dirname:" {
    const filepath = "temp/app/xxx/cc";
    std.debug.print("dirname:{s}\n", .{std.fs.path.dirname(filepath).?}); // temp/app/xxx
    if (std.fs.path.dirname(filepath)) |dirname| {
        try std.fs.cwd().makePath(dirname); // 在当前目录下递归创建文件夹(没有就创建)
        std.debug.print("ok!\n", .{});
    }
}

test "basename:" {
    const filepath = "temp/app/xxx/cc.exe";
    std.debug.print("basename:{s}\n", .{std.fs.path.basename(filepath)}); // cc.exe
}
