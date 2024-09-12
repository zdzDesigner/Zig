const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // dependents =========
    const sub_mod = b.dependency("sub", .{ // zon 中的名字
        .target = target,
        .optimize = optimize,
    });

    // export ==============
    const bus_mod = b.addModule("busmod", .{
        .target = target,
        .optimize = optimize,
        .link_libc = true,
        // .imports = &.{
        //     // 导入依赖 std.Build.Module.Import
        //     // std.Build.Module.Import{ .name = "sub", .module = sub_mod.module("sub") },
        //     .{ .name = "submod", .module = sub_mod.module("submod") },
        // },
    });
    // 导入头文件
    // for (sub_mod.module("submod").include_dirs.items) |item| {
    //     // std.debug.print("x item:{s}\n", .{item.path.path});
    //     bus_mod.addIncludePath(b.path(sub_mod.builder.pathFromRoot(item.path.src_path.sub_path)));
    // }
    // sub_mod.module("submod")
    bus_mod.addIncludePath(b.path("lib"));
    bus_mod.addCSourceFiles(.{
        .files = &.{"lib/math.c"},
    });

    // c project =================
    const math_exe = b.addExecutable(.{
        .name = "math_c",
        .target = target,
        .optimize = optimize,
        .link_libc = true,
    });
    // for (sub_mod.module("submod").include_dirs.items) |item| {
    //     math_exe.addIncludePath(b.path(sub_mod.builder.pathFromRoot(item.path.src_path.sub_path)));
    // }
    math_exe.addIncludePath(b.path("lib"));
    math_exe.addCSourceFiles(.{ .files = &.{ "src/main.c", "lib/math.c" } });
    math_exe.linkLibrary(sub_mod.artifact("sub")); // 加载静态库, 从依赖库中的 `zig-out/lib/` 取
    // math_exe.root_module.addImport("submod", sub_mod.module("submod")); // 加载源码
    b.installArtifact(math_exe);

    // // zig static ====================
    // const lib = b.addStaticLibrary(.{
    //     .name = "bus",
    //     .root_source_file = b.path("src/root.zig"),
    //     .target = target,
    //     .optimize = optimize,
    // });
    // b.installArtifact(lib);

    // // zig exe ================
    // const exe = b.addExecutable(.{
    //     .name = "bus",
    //     .root_source_file = b.path("src/main.zig"),
    //     .target = target,
    //     .optimize = optimize,
    // });
    // // for (sub_mod.module("submod").include_dirs.items) |item| {
    // //     // std.debug.print("item:{s}\n", .{sub_mod.builder.pathFromRoot(item.path.path)});
    // //     exe.addIncludePath(b.path(sub_mod.builder.pathFromRoot(item.path.src_path.sub_path)));
    // // }
    // exe.addIncludePath(b.path("lib"));
    // exe.root_module.addImport("busmod", bus_mod);
    // b.installArtifact(exe);
    //
    // // ===========================================
    // const run_cmd = b.addRunArtifact(exe);
    // run_cmd.step.dependOn(b.getInstallStep());
    //
    // if (b.args) |args| {
    //     run_cmd.addArgs(args);
    // }
    //
    // // This creates a build step. It will be visible in the `zig build --help` menu,
    // // and can be selected like this: `zig build run`
    // // This will evaluate the `run` step rather than the default, which is "install".
    // const run_step = b.step("run", "Run the app");
    // run_step.dependOn(&run_cmd.step);
}
