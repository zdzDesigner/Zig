const std = @import("std");
const expect = std.expect;

pub fn logic() void {
    std.log.info("-------- optional -------", .{});

    const en: ?[]const u8 = "English";

    std.log.info("{}", .{@TypeOf(en)}); // ?[]const u8
    std.log.info("access en:{s}", .{en.?}); // English (取出了可选类型的有效值)
    std.log.info("direct access en: {any}", .{en}); // { 69, 110, 103, 108, 105, 115, 104 }
    if (en) |val| {
        std.log.info("unwrap en:{s}", .{val});
    }

    const lang: ?[]const u8 = null;
    std.log.info("{}", .{@TypeOf(lang)}); // ?[]const u8
    // std.log.info("{}", .{lang.?}); // error: unable to unwrap null 不能解构null
    if (lang) |val| {
        std.log.info("unwrap lang::unprint to there :{}", .{val});
    }

    const nonport: ?[]const u8 = null;

    const port = nonport orelse "8080";
    std.log.info("port:{s}", .{port});
}

test "optional::if:" {
    const isok: ?bool = null;

    const val: []const u8 = if (isok != null and isok.?) "vv" else "xx";
    std.debug.print("val:{s}\n", .{val});

    const isgo: bool = isok orelse false;
    std.debug.print("isgo:{}\n", .{isgo});
}
