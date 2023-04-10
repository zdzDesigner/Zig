const std = @import("std");
const CrossTarget = std.zig.CrossTarget;

pub fn build(b: *std.build.Builder) void {

    // Standard target options allows the person running `zig build` to choose
    // what target to build for. Here we do not override the defaults, which
    // means any target is allowed, and the default is native. Other options
    // for restricting supported target set are available.
    // const target = b.standardTargetOptions(.{});
    const target = CrossTarget.parse(.{
        .arch_os_abi = "thumb-freestanding",
        .cpu_features = "cortex_m3",
    });
    // zig build-exe -target thumb-freestanding -mcpu cortex_m3 --name application.elf --script memory.ld main.zig

    // Standard release options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall.
    // const mode = b.standardReleaseOptions(); // ReleaseSmall
    // const mode = std.builtin.Mode.ReleaseSmall; // ReleaseSmall
    // const mode = std.builtin.Mode.ReleaseFast; // ReleaseSmall
    const mode = std.builtin.Mode.Debug; // ReleaseSmall
    

    const exe = b.addExecutable("bluepill.elf", "src/main.zig");
    exe.setTarget(target catch |err| {
        std.debug.print("{}", .{err});
        return;
    });
    exe.setBuildMode(mode);
    exe.setLinkerScriptPath(std.build.FileSource.relative("./memory.ld"));
    exe.install();

    const run_cmd = exe.run();
    run_cmd.step.dependOn(b.getInstallStep());
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }
    // $ arm-none-eabi-objcopy -O binary ./zig-out/bin/bluepill.elf ./zig-out/bin/bluepill.bin


    // const run_step = b.step("run", "Run the app");
    // run_step.dependOn(&run_cmd.step);

    // const exe_tests = b.addTest("src/main.zig");
    // exe_tests.setTarget(target);
    // exe_tests.setBuildMode(mode);
    //
    // const test_step = b.step("test", "Run unit tests");
    // test_step.dependOn(&exe_tests.step);
}
