const std = @import("std");
const CrossTarget = std.zig.CrossTarget;

pub fn build(b: *std.build.Builder) void {
    const target = CrossTarget.parse(.{
        .arch_os_abi = "thumb-freestanding",
        .cpu_features = "cortex_m3",
    });
    // zig build-exe -target thumb-freestanding -mcpu cortex_m3 --name application.elf --script memory.ld main.zig

    const mode = std.builtin.Mode.Debug; // ReleaseSmall

    const exe = b.addExecutable("bluepill.elf", "src/main.zig");
    exe.setTarget(target catch |err| {
        std.debug.print("{}", .{err});
        return;
    });
    exe.setBuildMode(mode);
    exe.setLinkerScriptPath(std.build.FileSource.relative("./memory.ld"));
    // exe.setLinkerScriptPath(std.build.FileSource.relative("./STM32F103C8Tx_FLASH.ld"));
    exe.install();

    const run_cmd = exe.run();
    run_cmd.step.dependOn(b.getInstallStep());
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }
    // $ arm-none-eabi-objcopy -O binary ./zig-out/bin/bluepill.elf ./zig-out/bin/bluepill.bin

}
