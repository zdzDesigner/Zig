const std = @import("std");

pub fn build(b: *std.Build) void {
    installExample(b);
    // registers(b);
}

fn registers(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});
    const chip = b.addModule("chip", .{
        .root_source_file = .{ .path = "src/chip/chip.zig" },
        .target = target,
        .optimize = optimize,
    });

    const registersExc = b.addExecutable(.{
        .name = "registers",
        .root_source_file = .{ .path = "debug/gdb.zig" },
        .target = target,
        .optimize = optimize,
    });

    registersExc.root_module.addImport("chip", chip);
    b.installArtifact(registersExc);

    const run_cmd = b.addRunArtifact(registersExc);
    const run_step = b.step("reg", "");
    run_step.dependOn(&run_cmd.step);
}
fn cmd(b: *std.Build) !void {
    const flash_cmd = b.addSystemCommand(&.{
        "openocd",
        "-f",
        "./openocd.cfg",
    });

    const server_cmd = b.addSystemCommand(&.{
        "ST-LINK_gdbserver",                                "-p", "61234", "-l", "1",      "-d", "-z", "61235", "-s", "-cp",
        "/home/fran/.local/stm32/STM32CubeProgrammer/bin/", "-m", "0",     "-k", "--halt",
    });

    const debugger_cmd = b.addSystemCommand(&.{
        "arm-none-eabi-gdb",
        "-ex",
        "target remote localhost:61234",
    });

    // const bin_cmd = b.addSystemCommand(&.{
    //     "arm-none-eabi-objcopy",
    //     "-O",
    //     "binary",
    //     "stm32-zig-blinky.elf",
    //     "stm32-zig-blinky.bin",
    // });

    const flash_step = b.step("flash", "Flash the program");
    flash_step.dependOn(&flash_cmd.step);

    server_cmd.step.dependOn(&flash_cmd.step);
    const server_step = b.step("server", "Start the server");
    server_step.dependOn(&server_cmd.step);

    const debug_step = b.step("debug", "Debug the program");
    debug_step.dependOn(&debugger_cmd.step);
}

const examples = &.{
    // "blinky",
    // "blinky_irq",
    // "adc",
    // "adc_group",
    // "adc_temp",
    "adc_dma",
    // "adc_temp_irq",
    // "button",
    // "button_irq",
    // "uart",
    // "uart_irq",
};
fn installExample(
    b: *std.Build,
) void {
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .thumb,
        .cpu_model = .{ .explicit = &std.Target.arm.cpu.cortex_m3 },
        .os_tag = .freestanding,
        .abi = .eabi,
    });
    const optimize = b.standardOptimizeOption(.{
        // .preferred_optimize_mode = .ReleaseSafe,
        // .preferred_optimize_mode = .ReleaseSmall,
    });
    inline for (examples) |example| {
        const source = b.fmt("src/examples/{s}.zig", .{example});
        const artifact = b.fmt("stm32-zig-{s}.elf", .{example});
        const bin = b.fmt("stm32-zig-{s}.bin", .{example});

        const hal = b.addModule("hal", .{
            .root_source_file = .{ .path = "src/hal/hal.zig" },
            .target = target,
            .optimize = optimize,
        });

        const util = b.addModule("util", .{
            .root_source_file = .{ .path = "src/util/strings.zig" },
            .target = target,
            .optimize = optimize,
        });

        const app = b.addModule(example, .{
            .root_source_file = .{ .path = source },
            .target = target,
            .optimize = optimize,
        });

        const elf = b.addExecutable(.{
            .name = artifact,
            .root_source_file = .{ .path = "src/chip/start.zig" },
            .target = target,
            .optimize = optimize,
        });

        elf.link_gc_sections = true; // -g
        elf.link_data_sections = true; // -fdata-sections
        elf.link_function_sections = true; // -ffunction-sections

        elf.root_module.addImport("hal", hal);
        elf.root_module.addImport("app", app);

        hal.addImport("chip", &elf.root_module);
        hal.addImport("app", app);
        hal.addImport("util", util);

        app.addImport("chip", &elf.root_module);
        app.addImport("hal", hal);
        app.addImport("util", util);

        elf.setLinkerScript(.{ .path = "linker.ld" });

        // b.installArtifact(elf);
        const step_elf = b.addInstallArtifact(elf, .{});
        // const install_elf_step = b.addInstallBinFile(.{ .path = "zig-out/bin/" }, artifact);

        const step_bin = b.addObjCopy(
            elf.getEmittedBin(),
            .{ .format = .bin },
            // .{ .format = .elf },
        );

        const install_step_bin = b.addInstallBinFile(step_bin.getOutput(), bin);
        step_bin.step.dependOn(&step_elf.step);
        install_step_bin.step.dependOn(&step_bin.step);
        b.default_step.dependOn(&install_step_bin.step);
        // std.debug.print("{s}\n", .{elf.getEmittedBin().getDisplayName()});

        // flash_cmd.step.dependOn(&elf.step);
        // server_cmd.step.dependOn(&elf.step);
        // debugger_cmd.step.dependOn(&elf.step);
    }

    // if (b.args) |args| {
    //     const name = b.getInstallPath(.bin, b.fmt("stm32-zig-{s}.elf", .{args[0]}));
    //     flash_cmd.addArgs(&.{
    //         "-w",
    //         name,
    //         "--verify",
    //     });
    //     debugger_cmd.addArg(name);
    // }

    // 不生效 zig build test --verbose ===============
    const hal_test = b.addTest(.{
        .name = "test",
        .root_source_file = .{ .path = "src/hal/interrupts.zig" },
        .target = target,
    });

    hal_test.root_module.addImport("chip", b.addModule("chip", .{
        .target = target,
        .root_source_file = .{
            .path = "src/chip/F10X.zig",
        },
    }));

    const hal_test_step = b.step("test", "test hal");
    hal_test_step.dependOn(&hal_test.step);
    // --verbose 调整执行命令后:这里生效
    // zig test -ODebug --dep chip -Mroot=/home/zdz/Documents/Try/Zig/fork/stm32-zig/src/hal/interrupts.zig -Mchip=/home/zdz/Documents/Try/Zig/fork/stm32-zig/src/chip/F10X.zig
}
