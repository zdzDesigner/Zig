const std = @import("std");
const zcc = @import("compile_commands");

pub fn build(b: *std.Build) void {
    var targets = std.ArrayList(*std.Build.Step.Compile).init(b.allocator);
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const exe_cexamples = build_cexamples(b, target, optimize);
    build_zig(b, target, optimize);
    targets.append(exe_cexamples) catch @panic("OOM");
    zcc.createStep(b, "cdb", targets.toOwnedSlice() catch @panic("OOM"));
}

fn build_zig(
    b: *std.Build,
    target: std.Build.ResolvedTarget,
    optimize: std.builtin.OptimizeMode,
) void {
    const portaudio_dep = b.dependency("portaudio", .{
        .target = target,
        .optimize = optimize,
    });

    const mod = b.addModule("zaudio", .{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });
    const pa_lib = portaudio_dep.artifact("portaudio");
    mod.linkLibrary(pa_lib);

    const exe = b.addExecutable(.{
        .name = "zig-portaudio",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    exe.root_module.addImport("zaudio", mod);
    b.installArtifact(exe);

    const run_cmd = b.addRunArtifact(exe);

    run_cmd.step.dependOn(b.getInstallStep());

    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    const lib_unit_tests = b.addTest(.{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
}

fn build_cexamples(
    b: *std.Build,
    target: std.Build.ResolvedTarget,
    optimize: std.builtin.OptimizeMode,
) *std.Build.Step.Compile {
    const portaudio_dep = b.dependency("portaudio", .{
        .target = target,
        .optimize = optimize,
    });
    const pa_lib = portaudio_dep.artifact("portaudio");
    const exe = b.addExecutable(.{
        .name = "portaudio",
        .target = target,
        .optimize = optimize,
    });
    // exe.addCSourceFiles(.{ .files = &.{"lib/base.c"} });
    // exe.addCSourceFiles(.{ .files = &.{"lib/paex_write_sine.c"} });
    // exe.addCSourceFiles(.{ .files = &.{"lib/paex_record_file.c"} });

    exe.addCSourceFiles(.{ .files = &.{"lib/muisc.c"} });
    // exe.addCSourceFiles(.{ .files = &.{"lib/paex_record_file.c"} });
    // exe.addCSourceFiles(.{ .files = &.{"lib/paex_read_write_wire.c"} });
    // FIX:: compile_commands 头文件问题
    exe.addIncludePath(portaudio_dep.path("zig-out/include"));
    exe.linkLibrary(pa_lib);
    b.installArtifact(exe);

    const run_cmd = b.addRunArtifact(exe);
    run_cmd.step.dependOn(b.getInstallStep());

    const run_step = b.step("c", "run c exmaples");
    run_step.dependOn(&run_cmd.step);

    // const run_example = b.step("c", "run c exmaples");
    return exe;
}
