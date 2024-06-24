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

    audioPlayer(b, target, optimize);
}

fn audioPlayer(b: *std.Build, target: std.Build.ResolvedTarget, optimize: std.builtin.OptimizeMode) void {
    const znotify_sdk = b.dependency("znotify", .{});
    const zaudio_sdk = b.dependency("zaudio", .{});

    const audioplayer = b.addExecutable(.{
        .name = "audioplayer",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });

    audioplayer.root_module.addImport("znotify", znotify_sdk.module("znotify"));
    audioplayer.root_module.addImport("zaudio", zaudio_sdk.module("root"));

    audioplayer.linkLibrary(zaudio_sdk.artifact("miniaudio"));
    b.installArtifact(audioplayer);
    const step_ap = b.step("ap", "audioplayer");
    step_ap.dependOn(&b.addRunArtifact(audioplayer).step);
}

// /home/zdz/mnt/Application/zig/zig-linux-x86_64-0.12.0/zig build-exe /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache/o/5490763c27d0ffb8a46f03523b5ff7dc/libminiaudio.a -ODebug -target aarch64-native-gnu -mcpu baseline --dynamic-linker /lib/ld-linux-aarch64.so.1 -I /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache/o/bab42bbbea71a70c78c338ea9331fb6e --dep znotify -Mroot=/home/zdz/Documents/Try/Zig/fork/zaudio/src/audioplayer.zig -Mznotify=/home/zdz/Documents/Try/Zig/fork/znotify/src/root.zig -lc --cache-dir /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache --global-cache-dir /home/zdz/.cache/zig --name audioplayer
//
// /home/zdz/mnt/Application/zig/zig-linux-x86_64-0.12.0/zig build-exe /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache/o/61f6c055d12e6506af595558d2891c6f/libminiaudio.a -OReleaseSafe -target aarch64-native-gnu -mcpu baseline --dynamic-linker /lib/ld-linux-aarch64.so.1 -I /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache/o/bab42bbbea71a70c78c338ea9331fb6e --dep znotify -Mroot=/home/zdz/Documents/Try/Zig/fork/zaudio/src/audioplayer.zig -Mznotify=/home/zdz/Documents/Try/Zig/fork/znotify/src/root.zig -lc --cache-dir /home/zdz/Documents/Try/Zig/fork/zaudio/zig-cache --global-cache-dir /home/zdz/.cache/zig --name audioplayer
