const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // _ = b.addModule("libsub.include", .{ .root_source_file = .{ .path = b.pathFromRoot("include") } });
    const sub_mod = b.addModule("submod", .{
        .target = target,
        .optimize = optimize,
        .link_libc = true,
    });

    sub_mod.addIncludePath(.{ .path = "include" });
    sub_mod.addCSourceFiles(.{
        .root = .{ .path = "lib" },
        // .files = ([_][]const u8{"sum.c"})[0..],
        // .files = &[_][]const u8{"sum.c"},
        .files = &.{"sum.c"},
    });

    // compile tool static library ===============
    const lib = b.addStaticLibrary(.{
        .name = "sub",
        .target = target,
        .optimize = optimize,
    });
    lib.addIncludePath(.{ .path = "include" });
    lib.installHeadersDirectory(.{ .path = "./include" }, "sum", .{});
    lib.addCSourceFiles(.{
        .root = .{ .path = "lib" },
        // .files = ([_][]const u8{"sum.c"})[0..],
        // .files = &[_][]const u8{"sum.c"},
        .files = &.{"sum.c"},
    });
    b.installArtifact(lib);

    // compile tool pure c =============
    const exe_c = b.addExecutable(.{
        .name = "sub_c",
        .target = target,
        .optimize = optimize,
    });
    exe_c.addCSourceFiles(.{
        .files = &.{"src/main.c"},
        .flags = &.{},
    });

    // exe_c.linkLibC(); // 无需主动引入( addCSourceFiles 这里会自动引入 )
    exe_c.addIncludePath(.{ .path = "include" });
    exe_c.root_module.addImport("sub", sub_mod);
    b.installArtifact(exe_c);

    // zig ================

    const exe = b.addExecutable(.{
        .name = "subexe",
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

    // This creates a build step. It will be visible in the `zig build --help` menu,
    // and can be selected like this: `zig build run`
    // This will evaluate the `run` step rather than the default, which is "install".
    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    // Creates a step for unit testing. This only builds the test executable
    // but does not run it.
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

    // Similar to creating the run step earlier, this exposes a `test` step to
    // the `zig build --help` menu, providing a way for the user to request
    // running the unit tests.
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
    test_step.dependOn(&run_exe_unit_tests.step);
}
