const std = @import("std");
const newlib = @import("hal").newlib;

pub fn build(b: *std.Build) void {
    const optimize = b.standardOptimizeOption(.{});
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .thumb,
        .os_tag = .freestanding,
        .abi = .eabi,
        .cpu_model = std.zig.CrossTarget.CpuModel{ .explicit = &std.Target.arm.cpu.cortex_m3 },
        // Note that "fp_armv8d16sp" is the same instruction set as "fpv5-sp-d16", so LLVM only has the former
        // https://github.com/llvm/llvm-project/issues/95053
        // .cpu_features_add = std.Target.arm.featureSet(&[_]std.Target.arm.Feature{std.Target.arm.Feature.fp_armv8d16sp}),
    });

    const executable_name = "blinky";
    const blinky_exe = b.addExecutable(.{
        .name = executable_name ++ ".elf",
        .target = target,
        .optimize = optimize,
        .link_libc = false,
        .linkage = .static,
        .single_threaded = true,
        .root_source_file = b.path("src/main.zig"),
    });
    const halobj = b.dependency("hal", .{ .target = target, .optimize = optimize }).artifact("hal");
    blinky_exe.addObject(halobj);

    // User Options
    newlib.addIncludeHeadersAndSystemPathsTo(b, target, blinky_exe) catch |err| switch (err) {
        newlib.Error.CompilerNotFound => {
            std.log.err("Couldn't find arm-none-eabi-gcc compiler!\n", .{});
            unreachable;
        },
        newlib.Error.IncompatibleCpu => {
            std.log.err("Cpu: {s} isn't supported by gatz!\n", .{target.result.cpu.model.name});
            unreachable;
        },
    };

    blinky_exe.addCSourceFiles(.{
        .files = &.{
            "src/hal/hal.c",
        },
        .flags = &.{"-std=c11"},
    });

    blinky_exe.defineCMacro("USE_HAL_DRIVER", null);
    blinky_exe.defineCMacro("STM32F103xB", null);
    blinky_exe.addAssemblyFile(b.path("./hal/startup_stm32f103xb.s"));
    blinky_exe.setLinkerScriptPath(b.path("./hal/STM32F103C8Tx_FLASH.ld"));
    blinky_exe.link_gc_sections = true;
    blinky_exe.link_data_sections = true;
    blinky_exe.link_function_sections = true;

    // Produce .bin file from .elf
    const bin = b.addObjCopy(blinky_exe.getEmittedBin(), .{
        .format = .bin,
    });
    bin.step.dependOn(&blinky_exe.step);
    const copy_bin = b.addInstallBinFile(bin.getOutput(), executable_name ++ ".bin");
    b.default_step.dependOn(&copy_bin.step);

    // Produce .hex file from .elf
    const hex = b.addObjCopy(blinky_exe.getEmittedBin(), .{
        .format = .hex,
    });
    hex.step.dependOn(&blinky_exe.step);
    const copy_hex = b.addInstallBinFile(hex.getOutput(), executable_name ++ ".hex");
    b.default_step.dependOn(&copy_hex.step);

    b.installArtifact(blinky_exe);
}
