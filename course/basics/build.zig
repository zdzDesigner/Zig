const std = @import("std");

pub fn build(b: *std.Build) void {
    // 标准构建目标
    const target = b.standardTargetOptions(.{});
    // 标准构建模式
    const optimize = b.standardOptimizeOption(.{});

    // 获取包
    const httpz = b.dependency("httpz", .{});

    // 添加一个二进制可执行程序构建
    const exe = b.addExecutable(.{
        .name = "test",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    // 获取包中的模块
    exe.root_module.addImport("httpz", httpz.module("httpz"));

    // 添加到顶级 install step 中作为依赖
    // "Artifact" 是一个广泛用于软件开发和交付的术语，它强调了构建过程产生的最终输出物
    // "Artifact" 通常指的是编译、链接和打包后的二进制文件或库文件。这可以是可执行文件（例如，一个可运行的程序）、库文件（例如，一个共享库或静态库）等
    b.installArtifact(exe);
    const run_cmd = b.addRunArtifact(exe);

    // 注意：这个步骤不是必要的，显示声明运行依赖于构建
    // 这会使运行是从构建输出目录（默认为 zig-out/bin ）运行而不是构建缓存中运行
    // 不过，如果应用程序运行依赖于其他已存在的文件（例如某些 ini 配置文件）
    // 这可以确保它们正确的运行
    run_cmd.step.dependOn(b.getInstallStep());
    // 注意：此步骤不是必要的
    // 此操作允许用户通过构建系统的命令传递参数，例如 zig build  -- arg1 arg2
    // 当前是将参数传递给运行构建结果
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }
    // 指定一个 step 为 run
    const run_step = b.step("run", "Run the app");
    // 指定该 step 依赖于 run_cmd，即实际的运行
    run_step.dependOn(&run_cmd.step);

    const unit_tests = b.addTest(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_unit_tests = b.addRunArtifact(unit_tests);
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_unit_tests.step);
    // zig build test --summary all

    // @export test ==================
    const export_cmd = b.addSystemCommand(&.{ "zig", "build-obj", "./test/export.zig" });
    const export_mv = b.addSystemCommand(&.{ "mv", "./export.o", "./export.o.o", "./zig-out/" });
    // const export_nm = b.addSystemCommand(&.{ "nm", "-A", "./zig-out/export.o" });
    const export_nm = b.addSystemCommand(&.{ "nm", "-A", "./zig-out/export.o.o" });
    const export_step = b.step("export", "test @export");
    export_mv.step.dependOn(&export_cmd.step);
    export_nm.step.dependOn(&export_mv.step);
    export_step.dependOn(&export_nm.step);
}

// zig-cache : 缓存目录
// zig-out : 生成目标  zig build --prefix 更改
