const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // dependents =========
    const sub_mod = b.dependency("sub", .{
        .target = target,
        .optimize = optimize,
    });

    // export ==============
    const bus_mod = b.addModule("bus", .{
        .target = target,
        .optimize = optimize,
        .link_libc = true,
        .imports = &.{
            // 导入依赖 std.Build.Module.Import
            // std.Build.Module.Import{ .name = "sub", .module = sub_mod.module("sub") },
            .{ .name = "sub", .module = sub_mod.module("sub") },
        },
    });
    // 导入头文件
    for (sub_mod.module("sub").include_dirs.items) |item| {
        // std.debug.print("x item:{s}\n", .{item.path.path});
        bus_mod.addIncludePath(.{ .path = sub_mod.builder.pathFromRoot(item.path.path) });
    }

    bus_mod.addIncludePath(.{ .path = "lib" });
    bus_mod.addCSourceFiles(.{
        .files = &.{"lib/math.c"},
    });

    // c project =================
    const math_exe = b.addExecutable(.{
        .name = "math_c",
        .target = target,
        .optimize = optimize,
    });
    for (sub_mod.module("sub").include_dirs.items) |item| {
        // std.debug.print("item:{s}\n", .{sub_mod.builder.pathFromRoot(item.path.path)});
        math_exe.addIncludePath(.{ .path = sub_mod.builder.pathFromRoot(item.path.path) });
    }

    math_exe.addIncludePath(.{ .path = "lib" });
    math_exe.addCSourceFiles(.{ .files = &.{ "src/main.c", "lib/math.c" } });
    math_exe.root_module.addImport("sub", sub_mod.module("sub"));
    b.installArtifact(math_exe);

    // zig static ====================
    const lib = b.addStaticLibrary(.{
        .name = "bus",
        .root_source_file = .{ .path = "src/root.zig" },
        .target = target,
        .optimize = optimize,
    });
    b.installArtifact(lib);

    // zig exe ================
    const exe = b.addExecutable(.{
        .name = "bus",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });
    for (sub_mod.module("sub").include_dirs.items) |item| {
        // std.debug.print("item:{s}\n", .{sub_mod.builder.pathFromRoot(item.path.path)});
        exe.addIncludePath(.{ .path = sub_mod.builder.pathFromRoot(item.path.path) });
    }
    exe.addIncludePath(.{ .path = "lib" });
    exe.root_module.addImport("bus", bus_mod);
    b.installArtifact(exe);

    // ===========================================
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
