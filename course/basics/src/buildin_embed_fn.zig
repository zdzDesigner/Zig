const std = @import("std");
const posix = std.posix;

test "@trun:" {
    std.debug.print("typeof @trunc(58.0):{}\n", .{@TypeOf(@trunc(58.1892))}); // comptime_float
    std.debug.print("equal:{}\n", .{58.0 == @trunc(58.1892)}); // true
    std.debug.print("equal:{}\n", .{58 == @trunc(58.1892)}); // true
    std.debug.print("equal:{}\n", .{58 == 58.0}); // true

    const v: u8 = @as(u8, @trunc(58.0));
    std.debug.print("v:{}\n", .{v}); // 58

    const v2: u4 = @truncate(v); // 0b111010 << 2  = 0b1010
    std.debug.print("v2:{}\n", .{v2}); // 10
}
test "@truncate:" {
    const u: u4 = @truncate(58); // 0b111010 << 2  = 0b1010
    std.debug.print("u:{}\n", .{u}); // 10
}

test "u32 to i32:" {
    var a: u64 = 30;
    const v: i64 = @as(u32, @truncate(a * 10));
    a = 3;
    std.debug.print("v:{}\n", .{v});
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
    const NormalField = struct {
        a: u3,
        b: u3,
        c: u2,
    };
    std.debug.print("size:NormalField:{}\n", .{@sizeOf(NormalField)}); // 3 字节

    const BitField = packed struct {
        a: u3,
        b: u3,
        c: u2,
    };
    std.debug.print("size:BitField:{}\n", .{@sizeOf(BitField)}); // 1 字节

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
    std.debug.print("size:Full:{}\n", .{@sizeOf(Full)}); // 2 字节
    std.debug.print("size:Divide:{}\n", .{@sizeOf(Divide)}); // 2 字节

    const div: Divide = @bitCast(Full{ .number = 0b1100001111110000 }); // three:0b11000011 seconed:0b1111 first:0b0000

    std.debug.print("div:{}\n", .{div}); // Divide{ .first = 0, .seconed = 15, .three = 195 }
}

test "@as" {
    std.debug.print("@as(u5,12):{}\n", .{@as(u5, 12) << 2}); // 16

    std.debug.print("div:{}\n", .{@as(u3, 4) - @as(u4, 3)}); // 1
    std.debug.print("NONBLOCK:{}\n", .{@as(u32, @bitCast(posix.O{ .NONBLOCK = true }))}); // 1<<11
    std.debug.print("NONBLOCK:{}\n", .{@as(u32, @bitCast(posix.O{ .NONBLOCK = true }))}); // 1<<11
}

const CortexM3Interrupt = enum(u4) {
    HardFault = 8,
    Systick = 15,
};

test "@intFromEnum" {
    std.debug.print("intFromEnum:{}\n", .{@intFromEnum(CortexM3Interrupt.HardFault)}); // 8
    std.debug.print("intFromEnum:{}\n", .{@intFromEnum(CortexM3Interrupt.Systick)}); // 15
}

test "@sizeOf:" {
    std.debug.print("size of:{}\n", .{@sizeOf(CortexM3Interrupt)}); // 1 字节
    std.debug.print("字节对齐:{}\n", .{@sizeOf(struct { v: u1, id: u32 })}); // 8 字节(字节对齐)
    std.debug.print("字节对齐:{}\n", .{@sizeOf(struct { v: u1, v2: u1, id: u32 })}); // 8 字节(字节对齐)
    std.debug.print("字节对齐:{}\n", .{@sizeOf(struct { v: u1, id: u32, v2: u2 })}); // 8 字节(字节对齐)
    std.debug.print("字节对齐:{}\n", .{@sizeOf(struct { v: u3, id: u32 })}); // 8 字节(字节对齐)
    std.debug.print("切片:{}\n", .{@sizeOf(struct { v: []const u1 })}); // 胖指针 16 字节(指针+长度[字节对齐])
    std.debug.print("多项指针:{}\n", .{@sizeOf(struct { v: [*]const u8 })}); // 8 字节

}
