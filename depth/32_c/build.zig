const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{
        .preferred_optimize_mode = .ReleaseSmall,
    });

    // 可执行文件
    const exe = b.addExecutable(.{
        .name = "32_c",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });

    // 头文件
    exe.addIncludePath(.{ .path = "src" });

    // 链接标准 C 库
    exe.linkLibC();

    // Produce the actual executable artifact file.
    b.installArtifact(exe);

    // This allows you to run the produced execuatble
    // with zig build.
    const run_cmd = b.addRunArtifact(exe);
    // To run it, we depend on building and installing first.
    run_cmd.step.dependOn(b.getInstallStep());

    // This allows the user to pass arguments to the application in the build
    // command itself, like this: `zig build run -- arg1 arg2 etc`
    if (b.args) |args| run_cmd.addArgs(args);

    // This creates a build step. It will be visible in the `zig build --help` menu,
    // and can be selected like this: `zig build run`
    // This will evaluate the `run` step rather than the default, which is "install".
    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);
}

// zig build -Doptimize=ReleaseSmall
