const std = @import("std");

const Gene = []usize;

fn GA(comptime Func: type) type {
    return struct {
        const Self = @This();
        func: Func,

        pub fn evolve(self: *Self) void {
            var gene: [4]usize = .{ 1, 2, 3, 4 };
            const fitness = self.func.execute(&gene);
            std.debug.print("{d}\n", .{fitness});
        }
    };
}

pub fn main() void {
    const MyFunc = struct {
        const Self = @This();
        distmap: [4][4]f64 = .{
            .{ 1, 2, 3, 4 },
            .{ 1, 2, 3, 4 },
            .{ 1, 2, 3, 4 },
            .{ 1, 2, 3, 4 },
        },

        fn execute(self: *Self, gene: Gene) f64 {
            var distance: f64 = 0.0;
            for (1..gene.len) |i| {
                const dis: f64 = self.distmap[gene[i - 1]][gene[i - 1]];
                distance += dis;
            }
            return 1.0 / distance;
        }
    };

    var ga = GA(MyFunc){ .func = MyFunc{} };
    ga.evolve();
}

// OK ====================================================
// const std = @import("std");
// const Gene = []usize;
//
// const GA = struct {
//     pub fn evolve(closure: anytype) void {
//         var gene: [4]usize = .{ 1, 2, 3, 4 };
//         const fitness = closure.execute(&gene);
//         std.debug.print("{d}\n", .{fitness});
//     }
// };
//
// pub fn main() void {
//     const MyFunc = struct {
//         const A = @This();
//         distmap: [4][4]f64 = .{
//             .{ 1, 2, 3, 4 },
//             .{ 1, 2, 3, 4 },
//             .{ 1, 2, 3, 4 },
//             .{ 1, 2, 3, 4 },
//         },
//
//         fn execute(self: A, gene: Gene) f64 {
//             var distance: f64 = 0.0;
//             for (1..gene.len) |i| {
//                 const dis: f64 = self.distmap[gene[i - 1]][gene[i - 1]];
//                 distance += dis;
//             }
//             return 1.0 / distance;
//         }
//     };
//
//     GA.evolve(MyFunc{});
// }
