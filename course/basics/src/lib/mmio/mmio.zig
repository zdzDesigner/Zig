// https://github.com/ZigEmbeddedGroup/microzig/blob/245401a0cad216f116a47af3d83316a444aecb92/core/src/mmio.zig

const std = @import("std");
const assert = std.debug.assert;

pub fn Mmio(comptime PackedT: type) type {
    const size = @bitSizeOf(PackedT);
    if ((size % 8) != 0)
        @compileError("size must be divisible by 8!");

    if (!std.math.isPowerOfTwo(size / 8))
        @compileError("size must encode a power of two number of bytes!");

    const IntT = std.meta.Int(.unsigned, size); // 动态创建Int类型

    if (@sizeOf(PackedT) != (size / 8))
        @compileError(std.fmt.comptimePrint("IntT and PackedT must have the same size!, they are {} and {} bytes respectively", .{ size / 8, @sizeOf(PackedT) }));

    return extern struct {
        const Self = @This();

        raw: IntT,

        pub const underlying_type = PackedT;

        pub inline fn read(addr: *volatile Self) PackedT {
            return @bitCast(addr.raw);
        }

        pub inline fn write(addr: *volatile Self, val: PackedT) void {
            comptime {
                assert(@bitSizeOf(PackedT) == @bitSizeOf(IntT));
            }
            addr.write_raw(@bitCast(val));
        }

        pub fn write_raw(addr: *volatile Self, val: IntT) void {
            addr.raw = val;
        }

        pub inline fn modify(addr: *volatile Self, fields: PackedT) void { // PackedT 单个属性无法编辑
            // pub inline fn modify(addr: *volatile Self, fields: anytype) void {
            var val = read(addr);
            inline for (@typeInfo(@TypeOf(fields)).Struct.fields) |field| {
                @field(val, field.name) = @field(fields, field.name);
            }
            write(addr, val);
        }

        pub inline fn toggle(addr: *volatile Self, fields: anytype) void {
            var val = read(addr);
            inline for (@typeInfo(@TypeOf(fields)).Struct.fields) |field| {
                @field(val, @tagName(field.default_value.?)) = !@field(val, @tagName(field.default_value.?));
            }
            write(addr, val);
        }
    };
}

test "modify explicit fields Type:" {
    const RCC_RC = Mmio(packed struct(u32) {
        HSION: u1 = 0,
        ///  Internal High Speed clock ready flag
        HSIRDY: u1 = 0,
        reserved3: u1 = 0,
        ///  Internal High Speed clock trimming
        HSITRIM: u5 = 0,
        ///  Internal High Speed clock Calibration
        HSICAL: u8 = 0,
        ///  External High Speed clock enable
        HSEON: u1 = 0,
        ///  External High Speed clock ready flag
        HSERDY: u1 = 0,
        ///  External High Speed clock Bypass
        HSEBYP: u1 = 0,
        ///  Clock Security System enable
        CSSON: u1 = 0,
        reserved24: u4 = 0,
        ///  PLL enable
        PLLON: u1 = 0,
        ///  PLL clock ready flag
        PLLRDY: u1 = 0,
        padding: u6 = 0,
    });

    const buf: u32 = 0; // 栈上分配u32

    const rc: *volatile RCC_RC = @as(*volatile RCC_RC, @ptrFromInt(@intFromPtr(&buf))); // 指针转为int再转为指针
    std.debug.print("RCC_RC.HSION:{}\n", .{rc.read().HSION});
    rc.modify(.{ .HSION = 1 });
    std.debug.print("RCC_RC.HSION:{}\n", .{rc.read().HSION});
}

test "allowzero" {
    const zero: usize = 0;
    const ptr: *allowzero i32 = @ptrFromInt(zero);
    std.debug.print("iszero:{}\n", .{@intFromPtr(ptr) == 0}); // true
}
