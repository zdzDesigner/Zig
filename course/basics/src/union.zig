const std = @import("std");
const expect = @import("std").testing.expect;

const TimestampType = enum {
    unix,
    datetime,
};

const Timestamp = union(TimestampType) {
    unix: i32,
    datetime: DateTime,

    const DateTime = struct {
        year: u16,
        month: u8,
        day: u8,
        hour: u8,
        minute: u8,
        second: u8,
    };

    fn seconds(self: Timestamp) u16 {
        switch (self) {
            .datetime => |dt| return dt.second,
            .unix => |ts| {
                const seconds_since_midnight: i32 = @rem(ts, 86400);
                return @intCast(@rem(seconds_since_midnight, 60));
            },
        }
    }
};
pub fn logic() void {
    std.log.info("----------- union ----------", .{});
    const Val = union {
        int: u64,
        float: u64,
        bool: bool,
        nan: void,
    };
    const v = Val{ .int = 3 };

    std.log.info("v.int:{}", .{v.int});
    std.log.info("v typeof:{}", .{@TypeOf(v)}); // union.logic.Val // 和枚举很像
    // std.log.info("v.float:{}", .{v.float}); // error: access of union field 'float' while field 'int' is active
    // std.log.info("{s}", .{@tagName(v)}); // error: union 'union.logic.Val' is untagged

    // switch (v) { // error: switch on union with no attached enum
    //     .int => {
    //         std.log.info("int", .{});
    //     },
    //     .float => {
    //         std.log.info("float", .{});
    //     },
    //     else => {
    //         std.log.info("default", .{});
    //     },
    // }


    // 带标签的联合的使用有点像接口，只要我们提前知道所有可能的实现，我们就能够将其转化带标签的联合这种形式。
    // ======== tagged union
    const LangType = enum {
        zh,
        en,
    };
    const Lang = union(LangType) { zh: []const u8, en: []const u8 };

    std.log.info("typeof Lang:{}", .{@TypeOf(Lang)}); // type
    std.log.info("{s}", .{@tagName(Lang.en)}); // enum 也有

    const lang = Lang{ .zh = "zdz" };
    std.log.info("lang.zh:{s}", .{lang.zh});
    // std.log.info("lang.en:{s}", .{lang.en}); // error: access of union field 'en' while field 'zh' is active
    switch (lang) {
        .zh => |val| {
            std.log.info("{s}", .{val});
        },
        .en => {
            std.log.info("this is en", .{});
        },
    }

    // ========= 自动推导, 创建一个隐式枚举
    const Langx = union(enum) { zh: []const u8, en: []const u8 };
    std.log.info("typeof Langx:{}", .{@TypeOf(Langx)});

    // ===========
    const ts = Timestamp{ .unix = 1693278411 };
    std.debug.print("{d}\n", .{ts.seconds()});
}

test "test union" {
    const Val = union {
        int: u64,
        float: u64,
        bool: bool,
        nan: void,
    };
    const v = Val{ .int = 3 };
    const v2: Val = .{ .int = 3 };

    try expect(v.int == 3);
    try expect(v2.int == 3);
}

test "mark with enum" {
    const ComplexTypeTag = enum {
        ok,
        not_ok,
    };
    const ComplexType = union(ComplexTypeTag) {
        ok: u8,
        not_ok: void,
    };

    var c = ComplexType{ .ok = 42 };

    switch (c) {
        ComplexTypeTag.ok => |*value| value.* += 1,
        ComplexTypeTag.not_ok => unreachable,
    }

    try expect(c.ok == 43);
}
