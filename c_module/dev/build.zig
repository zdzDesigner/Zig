const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // dependents ==============
    const bus_mod = b.dependency("bus", .{
        .target = target,
        .optimize = optimize,
    });

    const lib = b.addStaticLibrary(.{
        .name = "dev",
        .root_source_file = .{ .path = "src/root.zig" },
        .target = target,
        .optimize = optimize,
    });
    b.installArtifact(lib);

    // ================
    const exe = b.addExecutable(.{
        .name = "dev",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });
    exe.root_module.addImport("bus", bus_mod.module("bus"));
    // std.debug.print("include:{any}\n", .{bus_mod.module("bus").include_dirs.items.len});
    for (bus_mod.module("bus").include_dirs.items) |item| {
        std.debug.print("item:{s}\n", .{bus_mod.builder.pathFromRoot(item.path.path)});
        exe.addIncludePath(.{ .path = bus_mod.builder.pathFromRoot(item.path.path) });
    }
    // exe.addIncludePath(.{ .path = bus_mod.builder.pathFromRoot(bus_mod.module("libbus.include").root_source_file.?.path) });
    b.installArtifact(exe);
    const run_cmd = b.addRunArtifact(exe);

    // ===========
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
