const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const sub_mod = b.dependency("sub", .{
        .target = target,
        .optimize = optimize,
    });

    // c=================
    const math_exe = b.addExecutable(.{
        .name = "math_c",
        .target = target,
        .optimize = optimize,
    });
    math_exe.addIncludePath(.{ .path = "lib" });
    math_exe.addCSourceFiles(.{ .files = &.{ "src/main.c", "lib/math.c" } });
    math_exe.root_module.addImport("sub", sub_mod.module("sub"));
    math_exe.addIncludePath(.{
        .path = sub_mod.builder.pathFromRoot(
            sub_mod.module("libsub.include").root_source_file.?.path,
        ),
    });
    b.installArtifact(math_exe);

    // ====================

    const lib = b.addStaticLibrary(.{
        .name = "bus",
        .root_source_file = .{ .path = "src/root.zig" },
        .target = target,
        .optimize = optimize,
    });
    b.installArtifact(lib);

    const exe = b.addExecutable(.{
        .name = "bus",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });
    exe.root_module.addImport("sub", sub_mod.module("sub"));
    exe.addIncludePath(.{
        .path = sub_mod.builder.pathFromRoot(
            sub_mod.module("libsub.include").root_source_file.?.path,
        ),
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
}
