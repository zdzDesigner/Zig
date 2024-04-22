const std = @import("std");
const ArrayList = std.ArrayList;

pub fn build(b: *std.Build) !void {
    // b.verbose_link = true;
    // const target = b.standardTargetOptions(.{});
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .thumb,
        .cpu_model = .{ .explicit = &std.Target.arm.cpu.cortex_m3 },
        .os_tag = .freestanding,
        // .abi = .eabi,
        .abi = .musleabihf,
    });
    const optimize = b.standardOptimizeOption(.{
        .preferred_optimize_mode = .ReleaseSmall,
    });

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    // c exec ======================
    const c_exe = b.addExecutable(.{
        .name = "c_stm32",
        .target = target,
        .optimize = optimize,
        // .link_libc = false,
    });

    c_exe.defineCMacro("STM32F10X_LD", null);
    c_exe.defineCMacro("USE_STDPERIPH_DRIVER", null);

    const headers = &.{
        // "src",
        // "sys",
        // "src/key",
        // "src/led",
        // "sys/oledv2",
        // "sys/util",
        // "sys/sr04",
        // "sys/debug",
        // "sys/nrf24",
        // "lib/CMSIS",
        // "lib/STM32F10x_StdPeriph_Driver/inc",
        // "/home/zdz/Application/gcc-arm-none-eabi-9-2019-q4-major/lib/gcc/arm-none-eabi/9.2.1/include",
    };
    inline for (headers) |header| {
        std.debug.print("header:{s}\n", .{header});
        c_exe.addIncludePath(.{ .path = header });
    }
    // c_exe.addIncludePath(.{ .path = "/usr/arm-none-eabi/include" });
    // c_exe.addObjectFile(.{ .path = "/usr/arm-none-eabi/lib/thumb/v7e-m+fp/hard/libc_nano.a" });
    // c_exe.addObjectFile(.{ .path = "/usr/arm-none-eabi/lib/thumb/v7e-m+fp/hard/libm.a" });

    const sources = &.{
        "src/main.c",
        // "sys",
        // "sys/debug",
        // "sys/nrf24",
        // "sys/util",
        // "sys/sr04",
        // "lib/CMSIS",
        // "lib/STM32F10x_StdPeriph_Driver/src",
    };
    inline for (sources) |source| {
        const arrlist = try dirFiles(b, allocator, source);
        defer arrlist.deinit();
        std.debug.print("arrlist:{s}\n", .{arrlist.items});

        c_exe.addCSourceFiles(.{
            .root = .{ .path = source },
            .files = arrlist.items,
            .flags = &.{ "-Og", "-mthumb", "-mcpu=cortex-m3", "-Wall", "-fdata-sections", "-ffunction-sections" },
        });
    }
    // c_exe.addAssemblyFile(.{ .path = "startup_stm32f103xb.s" });

    // c_exe.setLinkerScriptPath(.{ .path = "STM32F103C8Tx_FLASH.ld" });

    // c_exe.link_gc_sections = true;
    // c_exe.link_data_sections = true;
    // c_exe.link_function_sections = true;
    // c_exe.linkLibC();
    b.installArtifact(c_exe);

    // ======================
    const exe = b.addExecutable(.{
        .name = "stm32",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });

    b.installArtifact(exe);
    //
    // const run_cmd = b.addRunArtifact(exe);
    // run_cmd.step.dependOn(b.getInstallStep());
    //
    // if (b.args) |args| {
    //     run_cmd.addArgs(args);
    // }

    // const run_step = b.step("run", "Run the app");
    // run_step.dependOn(&run_cmd.step);
}

// fn addCSourceFiles(b: *std.Build, allocator: std.mem.Allocator, comp: *std.Build.Step.Compile) void {
//     const arrlist = try dirFiles(b, allocator, "src");
//     defer arrlist.deinit();
//     std.debug.print("arrlist:{s}\n", .{arrlist.items});
//
//     comp.addCSourceFiles(.{
//         .root = .{ .path = "src" },
//         .files = arrlist.items,
//     });
// }

// !!! 这里有错误
fn dirFiles(b: *std.Build, allocator: std.mem.Allocator, filepath: []const u8) !ArrayList([]const u8) {
    var list = ArrayList([]const u8).init(allocator);

    const dir = try std.fs.openDirAbsolute(b.pathFromRoot(filepath), .{ .iterate = true });
    // std.debug.print("dir:{}\n", .{dir});
    var iter = dir.iterate();
    while (try iter.next()) |entry| {
        // std.debug.print("kind:{any},name:{s}\n", .{ entry.kind, entry.name });
        if (entry.kind == .file and std.mem.eql(u8, std.fs.path.extension(entry.name), ".c")) {
            // const name = try std.mem.Allocator.dupe(allocator, u8, entry.name);
            const name = try allocator.dupe(u8, entry.name);
            try list.append(name);
            // std.debug.print("name:{s}\n", .{list.items});
        }
    }
    return list;
}
