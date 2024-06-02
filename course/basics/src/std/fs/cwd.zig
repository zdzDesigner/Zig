// cwd (Current Working Directory)
const std = @import("std");

fn root() []const u8 {
    return comptime (std.fs.path.dirname(@src().file) orelse ".");
}

test "root:" {
    const v = @import("root");
    std.debug.print("root:{any}\n", .{@typeInfo(v)});
}

test "@src():" {
    std.debug.print("@src:{s}\n", .{@src().file});
    std.debug.print("@src:{s}\n", .{@src().fn_name}); // test.@src():
    std.debug.print("@src:{}\n", .{@src().line}); // 11
    std.debug.print("@src:{}\n", .{@src().column}); // 36
}

test "pwd::" {
    std.debug.print("pwd:{s}\n", .{root()});
}

test "process::getCwd:" {
    var p: [300]u8 = undefined;
    std.debug.print("getCwd:{s}\n", .{std.process.getCwd(&p) catch "xxx"});
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

// 必须在根目录zig build run 测试
// test "create file:" {
//     const filepath = "temp/app/xxx/cc";
//     const file = try std.fs.cwd().createFile(filepath, .{});
//     _ = file;
// }

// test "cwd:: open file:" {
//     std.debug.print("filepath:{s}\n", .{comptime root() ++ "/system_file.json"});
//     // const file = try std.fs.cwd().openFile("./system_file.json", .{});
//     const file = try std.fs.openFileAbsolute(comptime root() ++ "/system_file.json", .{});
//     defer file.close();
//     // std.debug.print("{}\n", .{file});
//     var buf: [140]u8 = undefined;
//     const size = try file.read(&buf);
//     std.debug.print("size:{}\n", .{size});
//     std.debug.print("text:{s}\n", .{buf});
// }

test "read dir:" {
    const dir = try std.fs.openDirAbsolute("/home/zdz/temp/music/lz/wanj", .{ .iterate = true });
    std.debug.print("dir:{}\n", .{dir});
    var dirit = dir.iterate();
    // try dir.openDir("./", .{});
    while (try dirit.next()) |v| {
        if (!std.mem.endsWith(u8, v.name, ".flac")) continue;
        std.debug.print("kind:{} \t name:{s:<30} \n", .{
            v.kind,
            v.name,
        });
    }
}

// linker
test "read link:" {
    // /sys/class/tty/ttyS3/device

    var device = try std.fs.openDirAbsolute("/sys/class/tty/ttyS3/device", .{});
    defer device.close();

    var driver_path_buffer: [std.fs.MAX_PATH_BYTES]u8 = undefined;
    const p = try device.readLink("driver", &driver_path_buffer);
    std.debug.print("p:{s}\n", .{p}); // p:../../../bus/platform/drivers/serial8250
    std.debug.print("driver_path_buffer:{s}\n", .{driver_path_buffer});
}
