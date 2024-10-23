const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // 打印tree
    const tree = b.dependency("tree-fmt", .{
        // .target = target,
        // .optimize = optimize,
    });

    const string = b.dependency("zig-string", .{
        .target = target,
        .optimize = optimize,
    });

    const webui = b.dependency("zig-webui", .{
        .target = target,
        .optimize = optimize,
        .enable_tls = false, // whether enable tls support
        .is_static = true, // whether static link
    });

    const json = b.dependency("zig-json", .{
        .target = target,
        .optimize = optimize,
    });

    const myzql = b.dependency("myzql", .{
        // .target = target,
        // .optimize = optimize,
    });

    const exe = b.addExecutable(.{
        .name = "bitou",
        .root_source_file = b.path("src/main_new.zig"),
        .target = target,
        .optimize = optimize,
    });

    exe.root_module.addImport("tree-fmt", tree.module("tree-fmt"));
    exe.root_module.addImport("string", string.module("string"));
    exe.root_module.addImport("webui", webui.module("webui"));
    exe.root_module.addImport("json", json.module("zig-json"));
    exe.root_module.addImport("myzql", myzql.module("myzql"));
    b.installArtifact(exe);

    const run_cmd = b.addRunArtifact(exe);

    run_cmd.step.dependOn(b.getInstallStep());

    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    const exe_unit_tests = b.addTest(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_exe_unit_tests.step);
}
