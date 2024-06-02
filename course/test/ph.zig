const std = @import("std");
const rng = std.rand.DefaultPrng.init(@intCast(std.time.milliTimestamp()));

test "ph" {
    var numbers: [1000]u32 = undefined;

    // 生成1000个随机数
    for (numbers) |*number| {
        const randomNumber = rng.nextUniform(0, 100);
        number.* = randomNumber;
    }

    // 初始化最大和最小的20个数的索引
    var maxIndices: [20]usize = undefined;
    var minIndices: [20]usize = undefined;
    for (0..20) |i| {
        maxIndices[i] = 0;
        minIndices[i] = 0;
    }

    // 找到最大和最小的20个数的索引
    for (1..1000) |i| {
        var j: i32 = 19;
        while (j >= 0 and numbers[i] > numbers[maxIndices[j]]) : (j -= 1) {}
        const insertIndex: usize = @intCast(j + 1);
        if (insertIndex < 20) {
            std.mem.memmove(@intFromPtr(&maxIndices[insertIndex]), @intFromPtr(&maxIndices[insertIndex + 1]), usize.size * (20 - insertIndex - 1));
            maxIndices[insertIndex] = i;
        }

        j = 19;
        while (j >= 0 and numbers[i] < numbers[minIndices[j]]) : (j -= 1) {}
        const insertIndex2: usize = @intCast(j + 1);
        if (insertIndex2 < 20) {
            memmove(@ptrToInt(&minIndices[insertIndex2]), @ptrToInt(&minIndices[insertIndex2 + 1]), usize.size * (20 - insertIndex2 - 1));
            minIndices[insertIndex2] = i;
        }
    }

    // 移除最大和最小的20个数
    for (maxIndices) |index| {
        numbers[index] = 0;
    }
    for (minIndices) |index| {
        numbers[index] = 0;
    }

    // 计算剩余数的和
    var sumWithoutExtremes: u64 = 0;
    for (numbers) |number| {
        sumWithoutExtremes += number;
    }

    // 打印结果
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Sum without extremes: {}\n", .{sumWithoutExtremes});
}
