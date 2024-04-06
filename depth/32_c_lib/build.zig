const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // 创建静态库
    const lib = b.addStaticLibrary(.{
        .name = "math",
        .root_source_file = .{ .path = "src/math.c" },
        .target = target,
        .optimize = optimize,
    });
    // lib.addCSourceFile();
    lib.addCSourceFile(.{
        .file = .{
            .path = "src/math.c",
        },
        .flags = &[_][]const u8{},
    });
    lib.addIncludePath(.{ .path = "src" });

    // If you want to use the library externally from here,you can install it as an output artifact .a file.
    b.installArtifact(lib);

    // Build the main executable for this project.
    // Could be Zig or C code.
    const exe = b.addExecutable(.{
        .name = "32_c",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });

    // // Add required C files when compiling a C app.
    // exe.addCSourceFile(.{
    //     .file = .{
    //         .path = "src/math.c",
    //     },
    //     .flags = &[_][]const u8{},
    // });

    // Where to find any C header files (.h).
    // exe.addIncludePath(.{ .path = "src" });

    // Link the built library to the executable.
    exe.linkLibrary(lib);

    // 链接标准 C 库
    // exe.linkLibC();

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
