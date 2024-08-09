const std = @import("std");
pub const newlib = @import("gatz").newlib;

pub fn build(b: *std.Build) void {
    // const target = b.resolveTargetQuery(.{
    //     .cpu_arch = .thumb,
    //     .os_tag = .freestanding,
    //     .abi = .eabi,
    //     .cpu_model = std.zig.CrossTarget.CpuModel{ .explicit = &std.Target.arm.cpu.cortex_m3 },
    //     // Note that "fp_armv8d16sp" is the same instruction set as "fpv5-sp-d16", so LLVM only has the former
    //     // https://github.com/llvm/llvm-project/issues/95053
    //     // .cpu_features_add = std.Target.arm.featureSet(&[_]std.Target.arm.Feature{std.Target.arm.Feature.fp_armv8d16sp}),
    // });
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const hal = b.addObject(.{
        .name = "hal",
        .target = target,
        .optimize = optimize,
    });

    // // Try to find arm-none-eabi-gcc program at a user specified path, or PATH variable if none provided
    // const arm_gcc_pgm = if (b.option([]const u8, "armgcc", "Path to arm-none-eabi-gcc compiler")) |arm_gcc_path|
    //     b.findProgram(&.{"arm-none-eabi-gcc"}, &.{arm_gcc_path}) catch {
    //         std.log.err("Couldn't find arm-none-eabi-gcc at provided path: {s}\n", .{arm_gcc_path});
    //         unreachable;
    //     }
    // else
    //     b.findProgram(&.{"arm-none-eabi-gcc"}, &.{}) catch {
    //         std.log.err("Couldn't find arm-none-eabi-gcc in PATH, try manually providing the path to this executable with -Darmgcc=[path]\n", .{});
    //         unreachable;
    //     };
    //
    // // Allow user to enable float formatting in newlib (printf, sprintf, ...)
    // if (b.option(bool, "NEWLIB_PRINTF_FLOAT", "Force newlib to include float support for printf()")) |_| {
    //     hal.forceUndefinedSymbol("_printf_float"); // GCC equivalent : "-u _printf_float"
    // }
    //
    // //  Use gcc-arm-none-eabi to figure out where library paths are
    // const gcc_arm_sysroot_path = std.mem.trim(u8, b.run(&.{ arm_gcc_pgm, "-print-sysroot" }), "\r\n");
    // const gcc_arm_multidir_relative_path = std.mem.trim(u8, b.run(&.{ arm_gcc_pgm, "-mcpu=cortex-m3", "-mfpu=fpv5-sp-d16", "-mfloat-abi=soft", "-print-multi-directory" }), "\r\n");
    // const gcc_arm_version = std.mem.trim(u8, b.run(&.{ arm_gcc_pgm, "-dumpversion" }), "\r\n");
    // const gcc_arm_lib_path1 = b.fmt("{s}/../lib/gcc/arm-none-eabi/{s}/{s}", .{ gcc_arm_sysroot_path, gcc_arm_version, gcc_arm_multidir_relative_path });
    // const gcc_arm_lib_path2 = b.fmt("{s}/lib/{s}", .{ gcc_arm_sysroot_path, gcc_arm_multidir_relative_path });
    //
    // std.debug.print("gcc_arm_sysroot_path:{s}\n", .{gcc_arm_sysroot_path});
    // std.debug.print("gcc_arm_multidir_relative_path:{s}\n", .{gcc_arm_multidir_relative_path});
    // std.debug.print("gcc_arm_version:{s}\n", .{gcc_arm_version});
    // std.debug.print("gcc_arm_lib_path1:{s}\n", .{gcc_arm_lib_path1});
    // std.debug.print("gcc_arm_lib_path2:{s}\n", .{gcc_arm_lib_path2});
    //
    // // Manually add "nano" variant newlib C standard lib from arm-none-eabi-gcc library folders
    // hal.addLibraryPath(.{ .cwd_relative = gcc_arm_lib_path1 });
    // hal.addLibraryPath(.{ .cwd_relative = gcc_arm_lib_path2 });
    // hal.addSystemIncludePath(.{ .cwd_relative = b.fmt("{s}/include", .{gcc_arm_sysroot_path}) });
    // hal.linkSystemLibrary("c_nano");
    // hal.linkSystemLibrary("m");
    //
    // // Manually include C runtime objects bundled with arm-none-eabi-gcc
    // hal.addObjectFile(.{ .cwd_relative = b.fmt("{s}/crt0.o", .{gcc_arm_lib_path2}) });
    // hal.addObjectFile(.{ .cwd_relative = b.fmt("{s}/crti.o", .{gcc_arm_lib_path1}) });
    // hal.addObjectFile(.{ .cwd_relative = b.fmt("{s}/crtbegin.o", .{gcc_arm_lib_path1}) });
    // hal.addObjectFile(.{ .cwd_relative = b.fmt("{s}/crtend.o", .{gcc_arm_lib_path1}) });
    // hal.addObjectFile(.{ .cwd_relative = b.fmt("{s}/crtn.o", .{gcc_arm_lib_path1}) });

    const includes = &.{
        "Core/Inc",
        "Drivers/STM32F1xx_HAL_Driver/Inc",
        "Drivers/STM32F1xx_HAL_Driver/Inc/Legacy",
        "Drivers/CMSIS/Device/ST/STM32F1xx/Include",
        "Drivers/CMSIS/Include",
    };
    inline for (includes) |header| {
        std.debug.print("include:{s}\n", .{header});
        hal.installHeadersDirectory(b.path(header), "", .{});
        hal.addIncludePath(b.path(header));
    }

    // Source files
    hal.addCSourceFiles(.{
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
        .flags = &.{ "-std=c11", "-fno-lto" },
        // .flags = &.{ "-Og", "-std=c11" },
    });

    hal.defineCMacro("USE_HAL_DRIVER", null);
    hal.defineCMacro("STM32F103xB", null);

    // Startup file
    // hal.addAssemblyFile(b.path("startup_stm32f103xb.s"));
    // hal.setLinkerScriptPath(b.path("STM32F103C8Tx_FLASH.ld"));
    // Pull in Newlib with a utility
    newlib.addTo(b, target, hal) catch |err| switch (err) {
        newlib.Error.CompilerNotFound => {
            std.log.err("Couldn't find arm-none-eabi-gcc compiler!\n", .{});
            unreachable;
        },
        newlib.Error.IncompatibleCpu => {
            std.log.err("Cpu: {s} isn't supported by gatz!\n", .{target.result.cpu.model.name});
            unreachable;
        },
    };
    b.getInstallStep().dependOn(&b.addInstallArtifact(hal, .{ .dest_dir = .{ .override = .{ .custom = "" } } }).step);
}
