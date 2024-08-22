const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const lib = b.addSharedLibrary(.{
        .name = "example",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    // weak-linkage
    lib.linker_allow_shlib_undefined = true;

    // add correct path to this lib
    const napigen = b.createModule(.{ .root_source_file = b.path("../../fork/napigen/napigen.zig") });
    lib.root_module.addImport("napigen", napigen);
    lib.linkLibC();

    // build the lib
    b.installArtifact(lib);

    // copy the result to a *.node file so we can require() it
    const copy_node = b.addInstallLibFile(lib.getEmittedBin(), "example.node");
    const step_install = b.getInstallStep();
    step_install.dependOn(&copy_node.step);

    const cmd_node = b.addSystemCommand(&.{ "node", "./example.mjs" });
    const step_node = b.step("run", "node demo");

    cmd_node.step.dependOn(step_install);
    step_node.dependOn(&copy_node.step);
    step_node.dependOn(&cmd_node.step);
}
