const std = @import("std");
const config = @import("config");
const zigstr = @import("zigstr");
const libmod = @import("libmod");
const add = @cImport(@cInclude("add.h"));

const sections = struct {
    extern var __bss_size: u8;
    extern var __data_size: u8;
    extern var __text_size: u8;
};

pub fn main() !void {
    std.debug.print("config:{any}\n", .{@TypeOf(config.isarm)});
    if (config.isarm) netPatch();

    // 导入符号表
    std.debug.print("__bss_size:{any}\n", .{sections.__bss_size});
    std.debug.print("__data_size:{any}\n", .{sections.__data_size});
    std.debug.print("__text_size:{any}\n", .{sections.__text_size});
    std.debug.print("add:{}\n", .{libmod.add(@intCast(3), @intCast(4))});
    std.debug.print("mutil:{}\n", .{add.multi(3, 4)});
}

fn netPatch() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    var arena = std.heap.ArenaAllocator.init(gpa.allocator());
    defer arena.deinit();
    const allocator = arena.allocator();
    // // const str = try zigstr.fromConstBytes(allocator, "ifconfig eth0 169.254.108.227 netmask 255.255.255.0");
    // // const ss = try str.split(allocator, " ");
    // // std.debug.print("ss:{s}\n", .{ss});
    //
    const ret = try std.ChildProcess.run(.{
        .allocator = allocator,
        .argv = &.{ "ifconfig", "eth0", "169.254.108.227", "netmask", "255.255.255.0" },
        // .argv = ss,
        // .argv = &.{ "ifconfig", "status" },
    });
    // ifconfig eth0 169.254.108.227 netmask 255.255.255.0
    std.debug.print("ret.out:{s}", .{ret.stdout});
    // try callPgm("git status", "");

}

// callPgm( pgm, module)  ex: APPTERM (libVte)   module ex: Exemple
// pub fn callPgm(pgm: []const u8, module: []const u8) !void {
//     var gpa = std.heap.GeneralPurposeAllocator(.{}){};
//     var allocator = gpa.allocator();
//
//     // var arena = std.heap.ArenaAllocator.init(allocator.allocator());
//
//     const prog = std.fmt.allocPrint(allocator, "./{s}", .{pgm}) catch unreachable;
//     defer allocator.free(prog);
//
//     const cmd = std.fmt.allocPrint(allocator, "./{s}", .{module}) catch unreachable;
//     defer allocator.free(cmd);
//
//     // Retrieval of the working library.
//     var buf: [std.fs.MAX_PATH_BYTES]u8 = undefined;
//     const cwd = std.posix.getcwd(&buf) catch unreachable;
//
//     // Initialization of the process (calling a program, and parameter).
//     const allocChild = std.heap.page_allocator;
//     const args: [2][]const u8 = .{ prog, cmd };
//     var CallModule: std.ChildProcess = std.ChildProcess.init(args[0..], allocChild);
//
//     //The set of modules is located in the manager's library, for example: (APPTERM).
//     CallModule.cwd = cwd;
//
//     const childTerm = std.ChildProcess.spawnAndWait(&CallModule) catch unreachable;
//
//     // Error handling is provided to the calling procedure.
//     switch (childTerm) {
//         .Exited => |code| {
//             if (code != 0) return;
//         },
//         else => unreachable,
//     }
// }

// test "simple test" {
//     var list = std.ArrayList(i32).init(std.testing.allocator);
//     defer list.deinit(); // try commenting this out and see if zig detects the memory leak!
//     try list.append(42);
//     try std.testing.expectEqual(@as(i32, 42), list.pop());
// }
