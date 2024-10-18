const std = @import("std");

const Flag = enum(u2) {
    big,
    equal,
    small,
};

pub fn quickSort(
    comptime T: type,
    slice: []T,
    compare: *const fn (a: T, b: T) Flag,
) void {
    const sort = struct {
        fn do(arr: []T, compareFn: *const fn (a: T, b: T) Flag) usize {
            var i: usize = 0;
            var j: usize = arr.len - 1;
            const temp: T = arr[i];

            while (i < j) {
                while (i < j and compareFn(arr[j], temp) == .big) j -= 1;
                if (i < j) arr[i] = arr[j];

                while (i < j) {
                    const flag = compareFn(arr[i], temp);
                    if (flag == .small or flag == .equal) i += 1;
                }
                if (i < j) arr[j] = arr[i];
            }

            arr[j] = temp;
            return j;
        }
    };
    if (slice.len < 2) return;

    const k = sort.do(slice, compare);
    // if (k == 0) return;
    // std.debug.print("k:{d}\n", .{k});
    if (k > 0) {
        quickSort(T, slice[0 .. k - 1], compare);
    }
    quickSort(T, slice[k + 1 ..], compare);
}

test "quick sort" {
    const compare = struct {
        fn handle(a: u8, b: u8) Flag {
            if (a < b)
                return .small;
            if (a == b)
                return .equal;
            return .big;
        }
    };

    var arr = [_]u8{ 2, 3, 6, 5, 8, 3, 5, 4, 1, 9, 2 };
    // const sorted_arr = [_]u8{ 1, 2, 2, 3, 3, 4, 5, 5, 6, 8, 9 };

    quickSort(u8, &arr, compare.handle);
    for (0..arr.len) |i| {
        std.debug.print("v:{d}\n", .{arr[i]});
        // try std.testing.expect(arr[i] == sorted_arr[i]);
    }
}
