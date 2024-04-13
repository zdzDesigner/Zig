const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // 创建静态库 ====================
    const lib = b.addStaticLibrary(.{
        .name = "math",
        // .root_source_file = .{ .path = "src/math.c" },
        .target = target,
        .optimize = optimize,
    });

    // 添加头文件
    lib.addIncludePath(.{ .path = "src" });
    // 添加源文件
    lib.addCSourceFile(.{
        .file = .{
            .path = "src/math.c",
        },
        .flags = &[_][]const u8{},
    });

    // 载入构建依赖流
    b.installArtifact(lib);

    // 可执行 ===================================================
    // Build the main executable for this project.
    // Could be Zig or C code.
    const exe = b.addExecutable(.{
        .name = "32_c",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });

    // 链接外部库
    exe.linkLibrary(lib);
    // 链接标准 C 库
    exe.linkLibC();

    // Produce the actual executable artifact file.
    b.installArtifact(exe);

    // build run =====================
    const run_cmd = b.addRunArtifact(exe);
    // To run it, we depend on building and installing first.
    run_cmd.step.dependOn(b.getInstallStep());

    // zig build 参数传递到run_cmd中
    if (b.args) |args| run_cmd.addArgs(args);

    // build test ===================
    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);
}
