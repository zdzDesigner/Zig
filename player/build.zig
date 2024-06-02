const std = @import("std");

pub fn build(b: *std.Build) void {
    const optimize = b.standardOptimizeOption(.{
        .preferred_optimize_mode = .ReleaseSafe,
    });
    const isarm = b.option(bool, "isarm", "arm platform") orelse false;
    const options = b.addOptions();
    options.addOption(bool, "isarm", isarm);

    const target = b.standardTargetOptions(.{
        .default_target = if (isarm) blk: {
            break :blk .{
                .cpu_arch = .aarch64,
                // .cpu_model = .{ .explicit = &std.Target.aarch64.cpu },
                // .cpu_model = .{ .explicit = &std.Target.arm.cpu.baseline },
                // .abi = .gnueabi,
                .abi = .gnu,
            };
        } else blk: {
            break :blk .{};
        },
    });

    _ = b.addModule("root", .{
        .root_source_file = .{ .path = "src/zaudio.zig" },
    });

    const miniaudio = b.addStaticLibrary(.{
        .name = "miniaudio",
        .target = target,
        .optimize = optimize,
    });

    // b.installArtifact(miniaudio);

    miniaudio.addIncludePath(.{ .path = "libs/miniaudio" });
    miniaudio.linkLibC();

    // const system_sdk = b.dependency("system_sdk", .{});

    if (target.result.os.tag == .macos) {
        // miniaudio.addFrameworkPath(.{ .path = system_sdk.path("macos12/System/Library/Frameworks").getPath(b) });
        // miniaudio.addSystemIncludePath(.{ .path = system_sdk.path("macos12/usr/include").getPath(b) });
        // miniaudio.addLibraryPath(.{ .path = system_sdk.path("macos12/usr/lib").getPath(b) });
        // miniaudio.linkFramework("CoreAudio");
        // miniaudio.linkFramework("CoreFoundation");
        // miniaudio.linkFramework("AudioUnit");
        // miniaudio.linkFramework("AudioToolbox");
    } else if (target.result.os.tag == .linux) {
        std.debug.print("target.result.os.tag:{s}\n", .{@tagName(target.result.os.tag)});
        if (isarm) {
            std.debug.print("isarm:{}\n", .{true});
            // miniaudio.addSystemIncludePath(.{ .path = "/usr/arm-linux-gnueabi/include" });
            // miniaudio.addIncludePath(.{ .path = "/usr/arm-linux-gnueabi/include" });
            // miniaudio.addLibraryPath(.{ .path = "/usr/arm-linux-gnueabi/lib" });
            miniaudio.addIncludePath(.{ .path = "/usr/aarch64-linux-gnu/include" });
            miniaudio.addLibraryPath(.{ .path = "/usr/aarch64-linux-gnu/lib" });
            //  --dynamic-linker /lib/ld-linux-aarch64.so.1
        }
        miniaudio.linkSystemLibrary("pthread");
        miniaudio.linkSystemLibrary("m");
        miniaudio.linkSystemLibrary("dl");
    }

    miniaudio.addCSourceFile(.{
        .file = .{ .path = "src/zaudio.c" },
        .flags = &.{
            "-std=c99",
            // "--dynamic-linker=/lib/ld-linux-aarch64.so.1",
        },
    });
    miniaudio.addCSourceFile(.{
        .file = .{ .path = "libs/miniaudio/miniaudio.c" },
        .flags = &.{
            "-DMA_NO_WEBAUDIO",
            "-DMA_NO_ENCODING",
            "-DMA_NO_NULL",
            "-DMA_NO_JACK",
            "-DMA_NO_DSOUND",
            "-DMA_NO_WINMM",
            "-std=c99",
            "-fno-sanitize=undefined",
            // "--dynamic-linker=/lib/ld-linux-aarch64.so.1",
            if (target.result.os.tag == .macos) "-DMA_NO_RUNTIME_LINKING" else "",
        },
    });

    // const test_step = b.step("test", "Run zaudio tests");
    // const tests = b.addTest(.{
    //     .name = "zaudio-tests",
    //     .root_source_file = .{ .path = "src/zaudio.zig" },
    //     .target = target,
    //     .optimize = optimize,
    // });
    // b.installArtifact(tests);
    // tests.linkLibrary(miniaudio);
    // test_step.dependOn(&b.addRunArtifact(tests).step);

    audioPlayer(b, miniaudio, target, optimize);
}

fn audioPlayer(b: *std.Build, miniaudio: *std.Build.Step.Compile, target: std.Build.ResolvedTarget, optimize: std.builtin.OptimizeMode) void {
    const znotify_sdk = b.dependency("znotify", .{});

    const audioplayer = b.addExecutable(.{
        .name = "audioplayer",
        .root_source_file = .{ .path = "src/audioplayer.zig" },
        .target = target,
        .optimize = optimize,
    });

    audioplayer.root_module.addImport("znotify", znotify_sdk.module("znotify"));

    audioplayer.linkLibrary(miniaudio);
    b.installArtifact(audioplayer);
    const step_ap = b.step("ap", "audioplayer");
    step_ap.dependOn(&b.addRunArtifact(audioplayer).step);
}

// /home/zdz/mnt/Application/zig/zig-linux-x86_64-0.12.0/zig build-exe /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache/o/5490763c27d0ffb8a46f03523b5ff7dc/libminiaudio.a -ODebug -target aarch64-native-gnu -mcpu baseline --dynamic-linker /lib/ld-linux-aarch64.so.1 -I /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache/o/bab42bbbea71a70c78c338ea9331fb6e --dep znotify -Mroot=/home/zdz/Documents/Try/Zig/fork/zaudio/src/audioplayer.zig -Mznotify=/home/zdz/Documents/Try/Zig/fork/znotify/src/root.zig -lc --cache-dir /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache --global-cache-dir /home/zdz/.cache/zig --name audioplayer
//
// /home/zdz/mnt/Application/zig/zig-linux-x86_64-0.12.0/zig build-exe /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache/o/61f6c055d12e6506af595558d2891c6f/libminiaudio.a -OReleaseSafe -target aarch64-native-gnu -mcpu baseline --dynamic-linker /lib/ld-linux-aarch64.so.1 -I /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache/o/bab42bbbea71a70c78c338ea9331fb6e --dep znotify -Mroot=/home/zdz/Documents/Try/Zig/fork/zaudio/src/audioplayer.zig -Mznotify=/home/zdz/Documents/Try/Zig/fork/znotify/src/root.zig -lc --cache-dir /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache --global-cache-dir /home/zdz/.cache/zig --name audioplayer
