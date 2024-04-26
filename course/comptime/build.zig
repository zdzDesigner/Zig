const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // depend ==========

    const exe = b.addExecutable(.{
        .name = "comptime",
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

    const exe_unit_tests = b.addTest(.{
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });

    const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_exe_unit_tests.step);

    // zig ast-check -t file.zig
    const ast_op = b.addSystemCommand(&.{
        "zig",
        "ast-check",
        "src/asm/op.zig",
    });
    const ast_step = b.step("ast", "ast op");
    ast_step.dependOn(&ast_op.step);

    // const asm_op = b.addSystemCommand(&.{
    //     "zig",
    //     "build-obj",
    //     "--name",
    //     "output",
    //     "-fno-emit-bin",
    //     "-femit-asm=output.s",
    //     "-OReleaseSmall",
    //     "src/asm/op.zig",
    // });
    const asm_op = b.addSystemCommand(&.{
        "zig",
        "build-obj",
        "--name",
        "output",
        "-fstrip",
        "-fno-emit-bin",
        "-femit-asm=output.s",
        "-OReleaseFast",
        "src/asm/op.zig",
    });

    const asm_step = b.step("asm", "asm op");
    asm_step.dependOn(&asm_op.step);

    // /home/zdz/Documents/Try/Zig/zig-pro/course/comptime/src/asm/op.zig
}
