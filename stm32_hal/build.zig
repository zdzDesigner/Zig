const std = @import("std");
const mem = std.mem;
const fs = std.fs;

pub fn build(b: *std.Build) void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const target = b.resolveTargetQuery(.{
        .abi = .eabi,
        .os_tag = .freestanding,
        .cpu_arch = .thumb,
        .cpu_model = .{ .explicit = &std.Target.arm.cpu.cortex_m3 },
    });

    // const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const exe = b.addExecutable(.{
        .name = "stm32_hal",
        .target = target,
        .optimize = optimize,
    });

    // exe.defineCMacro("STM32F10X_LD", null);

    // header ==============
    {
        const headers = &.{
            "src",
            "Core/Inc",
            "Drivers/STM32F1xx_HAL_Driver/Inc",
            "Drivers/CMSIS/Device/ST/STM32F1xx/Include",
            "Drivers/STM32F1xx_HAL_Driver/Inc",
        };
        inline for (headers) |header| {
            std.debug.print("header:{s}\n", .{header});
            exe.addIncludePath(b.path(header));
        }
    }
    // sources ==============
    {
        const sources = &.{
            "src",
            "Core/Src",
        };
        inline for (sources) |source| {
            const list = dirFiles(b, allocator, source) catch @panic("dirFiles error!");
            defer {
                for (list.items) |item| {
                    allocator.free(item);
                }
                list.deinit();
            }
            exe.addCSourceFiles(.{
                .root = b.path(source),
                .files = list.items,
                .flags = &.{ "-Og", "-mthumb", "-mcpu=cortex-m3", "-Wall", "-fdata-sections", "-ffunction-sections" },
            });
        }
    }

    // exe.linkLibC();
    b.installArtifact(exe);

    const run_cmd = b.addRunArtifact(exe);

    run_cmd.step.dependOn(b.getInstallStep());
}

// 文件夹内容
fn dirFiles(b: *std.Build, allocator: mem.Allocator, filepath: []const u8) !std.ArrayList([]const u8) {
    var list = std.ArrayList([]const u8).init(allocator);

    std.debug.print("filepath:{s},root:{s}\n", .{ filepath, b.pathFromRoot(filepath) });
    const dir = try fs.openDirAbsolute(b.pathFromRoot(filepath), .{ .iterate = true });
    // std.debug.print("dir:{}\n", .{dir});
    var iter = dir.iterate();
    while (try iter.next()) |entry| {
        // std.debug.print("kind:{any},name:{s}\n", .{ entry.kind, entry.name });
        if (entry.kind == .file and std.mem.eql(u8, fs.path.extension(entry.name), ".c")) {
            // const name = try std.mem.Allocator.dupe(allocator, u8, entry.name);
            const name = try allocator.dupe(u8, entry.name);
            try list.append(name);
            // std.debug.print("name:{s}\n", .{list.items});
        }
    }
    return list;
}
