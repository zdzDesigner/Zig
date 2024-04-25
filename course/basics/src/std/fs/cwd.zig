const std = @import("std");

fn root() []const u8 {
    return comptime (std.fs.path.dirname(@src().file) orelse ".");
}

test "pwd::" {
    std.debug.print("pwd:{s}\n", .{root()});
}

test "cwd:: current dirname:" {
    // current working directory
    // std.fs.cwd();

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer std.debug.assert(gpa.deinit() == .ok);
    const allocator = gpa.allocator();

    // could also use std.os.getcwd()
    const cwd_path = try std.fs.cwd().realpathAlloc(allocator, ".");
    defer allocator.free(cwd_path);

    std.debug.print("cwd_path: {s}\n", .{cwd_path});

    // const absolute_path = try std.fs.path.resolve(allocator, &.{
    //     cwd_path,
    //     "../../baz/file.txt",
    // });
    // defer allocator.free(absolute_path);
    //
    // std.debug.print("absolute_path: {s}\n", .{absolute_path});
}

test "cwd:: open file:" {
    std.debug.print("filepath:{s}\n", .{comptime root() ++ "/system_file.json"});
    // const file = try std.fs.cwd().openFile("./system_file.json", .{});
    const file = try std.fs.openFileAbsolute(comptime root() ++ "/system_file.json", .{});
    defer file.close();
    // std.debug.print("{}\n", .{file});
    var buf: [140]u8 = undefined;
    const size = try file.read(&buf);
    std.debug.print("size:{}\n", .{size});
    std.debug.print("text:{s}\n", .{buf});
}
