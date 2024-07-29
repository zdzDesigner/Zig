const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .thumb,
        .os_tag = .freestanding,
        .abi = .eabi,
        .cpu_model = std.zig.CrossTarget.CpuModel{ .explicit = &std.Target.arm.cpu.cortex_m3 },
        // Note that "fp_armv8d16sp" is the same instruction set as "fpv5-sp-d16", so LLVM only has the former
        // https://github.com/llvm/llvm-project/issues/95053
        // .cpu_features_add = std.Target.arm.featureSet(&[_]std.Target.arm.Feature{std.Target.arm.Feature.fp_armv8d16sp}),
    });

    const optimize = b.standardOptimizeOption(.{});
    const executable_name = "blinky";

    const blinky_exe = b.addExecutable(.{
        .name = executable_name ++ ".elf",
        .target = target,
        .optimize = optimize,
        .link_libc = false,
        .linkage = .static,
        .single_threaded = true,
    });
    // User Options

    // Try to find arm-none-eabi-gcc program at a user specified path, or PATH variable if none provided
    const arm_gcc_pgm = if (b.option([]const u8, "armgcc", "Path to arm-none-eabi-gcc compiler")) |arm_gcc_path|
        b.findProgram(&.{"arm-none-eabi-gcc"}, &.{arm_gcc_path}) catch {
            std.log.err("Couldn't find arm-none-eabi-gcc at provided path: {s}\n", .{arm_gcc_path});
            unreachable;
        }
    else
        b.findProgram(&.{"arm-none-eabi-gcc"}, &.{}) catch {
            std.log.err("Couldn't find arm-none-eabi-gcc in PATH, try manually providing the path to this executable with -Darmgcc=[path]\n", .{});
            unreachable;
        };

    // Allow user to enable float formatting in newlib (printf, sprintf, ...)
    if (b.option(bool, "NEWLIB_PRINTF_FLOAT", "Force newlib to include float support for printf()")) |_| {
        blinky_exe.forceUndefinedSymbol("_printf_float"); // GCC equivalent : "-u _printf_float"
    }

    //  Use gcc-arm-none-eabi to figure out where library paths are
    const gcc_arm_sysroot_path = std.mem.trim(u8, b.run(&.{ arm_gcc_pgm, "-print-sysroot" }), "\r\n");
    const gcc_arm_multidir_relative_path = std.mem.trim(u8, b.run(&.{ arm_gcc_pgm, "-mcpu=cortex-m3", "-mfpu=fpv5-sp-d16", "-mfloat-abi=soft", "-print-multi-directory" }), "\r\n");
    const gcc_arm_version = std.mem.trim(u8, b.run(&.{ arm_gcc_pgm, "-dumpversion" }), "\r\n");
    const gcc_arm_lib_path1 = b.fmt("{s}/../lib/gcc/arm-none-eabi/{s}/{s}", .{ gcc_arm_sysroot_path, gcc_arm_version, gcc_arm_multidir_relative_path });
    const gcc_arm_lib_path2 = b.fmt("{s}/lib/{s}", .{ gcc_arm_sysroot_path, gcc_arm_multidir_relative_path });

    std.debug.print("gcc_arm_sysroot_path:{s}\n", .{gcc_arm_sysroot_path});
    std.debug.print("gcc_arm_multidir_relative_path:{s}\n", .{gcc_arm_multidir_relative_path});
    std.debug.print("gcc_arm_version:{s}\n", .{gcc_arm_version});
    std.debug.print("gcc_arm_lib_path1:{s}\n", .{gcc_arm_lib_path1});
    std.debug.print("gcc_arm_lib_path2:{s}\n", .{gcc_arm_lib_path2});

    // Manually add "nano" variant newlib C standard lib from arm-none-eabi-gcc library folders
    blinky_exe.addLibraryPath(.{ .cwd_relative = gcc_arm_lib_path1 });
    blinky_exe.addLibraryPath(.{ .cwd_relative = gcc_arm_lib_path2 });
    blinky_exe.addSystemIncludePath(.{ .cwd_relative = b.fmt("{s}/include", .{gcc_arm_sysroot_path}) });
    blinky_exe.linkSystemLibrary("c_nano");
    blinky_exe.linkSystemLibrary("m");

    // Manually include C runtime objects bundled with arm-none-eabi-gcc
    blinky_exe.addObjectFile(.{ .cwd_relative = b.fmt("{s}/crt0.o", .{gcc_arm_lib_path2}) });
    blinky_exe.addObjectFile(.{ .cwd_relative = b.fmt("{s}/crti.o", .{gcc_arm_lib_path1}) });
    blinky_exe.addObjectFile(.{ .cwd_relative = b.fmt("{s}/crtbegin.o", .{gcc_arm_lib_path1}) });
    blinky_exe.addObjectFile(.{ .cwd_relative = b.fmt("{s}/crtend.o", .{gcc_arm_lib_path1}) });
    blinky_exe.addObjectFile(.{ .cwd_relative = b.fmt("{s}/crtn.o", .{gcc_arm_lib_path1}) });

    const includes = &.{
        "Core/Inc",
        "Drivers/STM32F1xx_HAL_Driver/Inc",
        "Drivers/STM32F1xx_HAL_Driver/Inc/Legacy",
        "Drivers/CMSIS/Device/ST/STM32F1xx/Include",
        "Drivers/CMSIS/Include",
    };
    inline for (includes) |include| {
        std.debug.print("include:{s}\n", .{include});
        blinky_exe.addIncludePath(b.path(include));
    }

    // Startup file
    blinky_exe.addAssemblyFile(b.path("startup_stm32f103xb.s"));

    // Source files
    blinky_exe.addCSourceFiles(.{
        .files = &.{
            "Core/Src/main.c",
            "Core/Src/stm32f1xx_it.c",
            "Core/Src/stm32f1xx_hal_msp.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_gpio_ex.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_tim.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_tim_ex.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_rcc.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_rcc_ex.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_gpio.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_dma.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_cortex.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_pwr.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_flash.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_flash_ex.c",
            "Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal_exti.c",
            "Core/Src/system_stm32f1xx.c",
            "Core/Src/sysmem.c",
            "Core/Src/syscalls.c",
        },
        .flags = &.{ "-Og", "-std=c11", "-DUSE_HAL_DRIVER", "-DSTM32F103xB" },
    });

    blinky_exe.link_gc_sections = true;
    blinky_exe.link_data_sections = true;
    blinky_exe.link_function_sections = true;
    blinky_exe.setLinkerScriptPath(b.path("./STM32F103C8Tx_FLASH.ld"));

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
