const std = @import("std");

pub fn build(b: *std.Build) void {
    const isarm = b.option(bool, "isarm", "arm platform") orelse false;
    const options = b.addOptions();
    options.addOption(bool, "isarm", isarm);

    const target = b.standardTargetOptions(.{
        .default_target = if (isarm) blk: {
            break :blk .{
                .cpu_arch = .arm,
                .cpu_model = .{ .explicit = &std.Target.arm.cpu.baseline },
                // .os_tag = .freestanding, // 裸机; 非裸机报错 warning: cannot find entry symbol _start; not setting start address
                .abi = .eabi,
            };
        } else blk: {
            break :blk .{};
        },
    });
    const optimize = b.standardOptimizeOption(.{ .preferred_optimize_mode = .ReleaseSmall });

    const zigstr = b.dependency("zigstr", .{
        .target = target,
        .optimize = optimize,
    });

    const static = b.addStaticLibrary(.{
        .name = "libstatic",
        .root_source_file = .{ .path = "src/static.zig" },
        .target = target,
        .optimize = optimize,
    });
    b.installArtifact(static);

    const libmod = b.addModule("libmod", .{
        .root_source_file = .{ .path = "src/root.zig" },
        .target = target,
        .optimize = optimize,
    });
    // const arm = b.addModule("arm", .{ .target = target, .optimize = optimize });
    // arm.addObject(lib);

    const exe = b.addExecutable(.{
        .name = "arm",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });

    exe.addIncludePath(.{ .path = "lib" });
    exe.addCSourceFiles(.{ .files = &.{"lib/add.c"} });
    exe.linkLibrary(static);
    exe.root_module.addOptions("config", options);
    exe.root_module.addImport("zigstr", zigstr.module("zigstr"));
    exe.root_module.addImport("libmod", libmod);

    b.installArtifact(exe);

    const run_cmd = b.addRunArtifact(exe);
    run_cmd.step.dependOn(b.getInstallStep());

    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    const lib_unit_tests = b.addTest(.{
        .root_source_file = .{ .path = "src/root.zig" },
        .target = target,
        .optimize = optimize,
    });

    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);

    const exe_unit_tests = b.addTest(.{
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });

    const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
    test_step.dependOn(&run_exe_unit_tests.step);
}
