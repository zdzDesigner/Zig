const std = @import("std");

test "@truncate:" {
    const u: u4 = @truncate(58); // 0b111010 << 2  = 0b1010
    std.debug.print("u:{}\n", .{u}); // 10
    //
}

test "@ptrCast:" {
    const SHPR1 = packed struct(u32) {
        PRI_4: u8,
        ///  Priority of system handler 5
        PRI_5: u8,
        ///  Priority of system handler 6
        PRI_6: u8,
        padding: u8 = 0,
    };
    const size = @bitSizeOf(SHPR1);
    std.debug.print("bitsize:{}\n", .{size}); // 32
    const IntT = std.meta.Int(.unsigned, size);
    std.debug.print("IntT:{},size:{}\n", .{ IntT, @bitSizeOf(IntT) }); // IntT:u32,size:32

    var shpr1 = SHPR1{ .PRI_4 = 4, .PRI_5 = 5, .PRI_6 = 6 };
    const v: *[12]u8 = @ptrCast(&shpr1); // 指针投影, 修改成员值
    std.debug.print("v:{any}\n", .{v}); // v:{ 4, 5, 6, 0, 124, 142, 159, 24, 253, 127, 0, 0 }
    std.debug.print("equal:{}\n", .{v.*[0] == shpr1.PRI_4});
    shpr1.PRI_4 = 200;
    std.debug.print("v[0]:{}\n", .{v.*[0]}); // 200
    v.*[0] = 100;
    std.debug.print("shpr1.PRI_4:{}\n", .{shpr1.PRI_4}); // 100
}

test "packed:" {
    const BitField = packed struct {
        a: u3,
        b: u3,
        c: u2,
    };

    // 位移
    std.debug.print("offset:{}\n", .{@bitOffsetOf(BitField, "a")}); // 0
    std.debug.print("offset:{}\n", .{@bitOffsetOf(BitField, "b")}); // 3
    std.debug.print("offset:{}\n", .{@bitOffsetOf(BitField, "c")}); // 6

    const Full = packed struct {
        number: u16,
    };

    const Divide = packed struct {
        first: u4,
        seconed: u4,
        three: u8,
    };
    std.debug.print("size:Full:{}\n", .{@sizeOf(Full)}); // 2
    std.debug.print("size:Divide:{}\n", .{@sizeOf(Divide)}); // 2

    const div: Divide = @bitCast(Full{ .number = 0b1100001111110000 }); // three:0b11000011 seconed:0b1111 first:0b0000

    std.debug.print("div:{}\n", .{div}); // Divide{ .first = 0, .seconed = 15, .three = 195 }
}

test "@as" {
    std.debug.print("@as(u5,12):{}\n", .{@as(u5, 12) << 2}); // 16

    std.debug.print("div:{}\n", .{@as(u3, 4) - @as(u4, 3)}); // 1
}

const CortexM3Interrupt = enum(u4) {
    HardFault = 8,
    Systick = 15,
};

test "@intFromEnum" {
    std.debug.print("intFromEnum:{}\n", .{@intFromEnum(CortexM3Interrupt.HardFault)}); // 8
    std.debug.print("intFromEnum:{}\n", .{@intFromEnum(CortexM3Interrupt.Systick)}); // 15
}
