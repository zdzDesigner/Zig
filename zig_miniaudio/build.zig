const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const exe = b.addExecutable(.{
        .name = "zig_miniaudio",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    exe.root_module.addIncludePath(.{ .path = "./miniaudio" });
    exe.root_module.addIncludePath(.{ .path = "./miniaudio/extras" });
    // exe.defineCMacro("MINIAUDIO_IMPLEMENTATION", null);
    // const cflags = &[_][]const u8{ "-DMA_NO_FLAC", "-DMA_NO_WEBAUDIO", "-DMA_NO_ENCODING", "-DMA_NO_NULL", "-DMA_NO_RUNTIME_LINKING" };
    // exe.root_module.addCSourceFile(.{ .file = .{ .path = "src/c/miniaudio.c" }, .flags = cflags });
    exe.root_module.addCSourceFile(.{ .file = .{ .path = "src/c/miniaudio.c" }, .flags = &.{ "-ldl", "-lm", "-lpthread" } });
    exe.linkLibC();
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

    const exe_unit_tests = b.addTest(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
    test_step.dependOn(&run_exe_unit_tests.step);
}
