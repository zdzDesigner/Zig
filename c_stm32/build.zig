const std = @import("std");
const ArrayList = std.ArrayList;

pub fn build(b: *std.Build) !void {
    // const target = b.standardTargetOptions(.{});
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .thumb,
        .cpu_model = .{ .explicit = &std.Target.arm.cpu.cortex_m3 },
        .os_tag = .freestanding,
        .abi = .eabi,
    });
    const optimize = b.standardOptimizeOption(.{});

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    var options = std.Build.Module.AddCSourceFilesOptions{ .files = &.{} };
    // const options = dirFiles(b, allocator, "src");
    try dirFiles(b, allocator, &options, "src");
    // var list = ArrayList([]const u8).init(allocator.allocator());
    // defer list.deinit();
    // try list.append("aaa");
    // try list.append("bbb");

    // c exec ======================
    const c_exe = b.addExecutable(.{
        .name = "c_stm32",
        .target = target,
        .optimize = optimize,
    });
    c_exe.addCSourceFiles(options);
    b.installArtifact(c_exe);

    // ======================
    const exe = b.addExecutable(.{
        .name = "stm32",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });

    b.installArtifact(exe);

    const run_cmd = b.addRunArtifact(exe);
    run_cmd.step.dependOn(b.getInstallStep());

    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);
}

fn dirFiles(b: *std.Build, allocator: std.mem.Allocator, optionsptr: *std.Build.Module.AddCSourceFilesOptions, filepath: []const u8) !void {
    var list = ArrayList([]const u8).init(allocator);

    const dir = try std.fs.openDirAbsolute(b.pathFromRoot(filepath), .{ .iterate = true });
    // const dir = std.fs.openDirAbsolute(b.pathFromRoot(filepath), .{}) catch @panic("OOM");
    std.debug.print("dir:{}\n", .{dir});
    var iter = dir.iterate();
    while (try iter.next()) |entry| {
        // std.debug.print("kind:{any},name:{s}\n", .{ entry.kind, entry.name });
        if (entry.kind == .file and std.mem.eql(u8, std.fs.path.extension(entry.name), ".c")) {
            try list.append(entry.name);
            // std.debug.print("name:{s}\n", .{list.items});
        }
    }

    optionsptr.*.root = .{ .path = filepath };
    optionsptr.*.files = list.items;
    // const options: std.Build.Module.AddCSourceFilesOptions = .{
    //     .root = .{ .path = filepath },
    //     .files = list.items,
    // };
    // // options.files = list.items;
    // return options;
}

// !!! 这里有错误
fn arrayListError(b: *std.Build, allocator: std.mem.Allocator) void {
    const filenames = dirFiles_old(b, allocator, "src");

    std.debug.print("list:{s}\n", .{filenames.items});
}
fn dirFiles_old(b: *std.Build, allocator: std.mem.Allocator, filepath: []const u8) ArrayList([]const u8) {
    var list = ArrayList([]const u8).init(allocator);

    const dir = std.fs.openDirAbsolute(b.pathFromRoot(filepath), .{ .iterate = true }) catch @panic("OOM");
    std.debug.print("dir:{}\n", .{dir});
    var iter = dir.iterate();
    while (iter.next() catch @panic("OOM")) |entry| {
        // std.debug.print("kind:{any},name:{s}\n", .{ entry.kind, entry.name });
        if (entry.kind == .file and std.mem.eql(u8, std.fs.path.extension(entry.name), ".c")) {
            list.append(entry.name) catch @panic("OOM");
            std.debug.print("name:{s}\n", .{list.items});
        }
    }
    return list;
}
