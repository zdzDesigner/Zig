const expect = @import("std").testing.expect;

test "test safe" {
    @setRuntimeSafety(false);
    const arr = [3]u8{ 1, 5, 2 };

    const index = 4;
    const val = arr[index];
    _ = val;
}
