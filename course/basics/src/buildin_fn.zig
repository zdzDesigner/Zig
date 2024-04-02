const std = @import("std");

pub fn logic() void {
    std.log.info("----------- buildin fn -------", .{});
    min();
    declAndField();
    typeInfo();
    as();
}

fn as() void {
    std.log.info("null:{any}", .{null}); // null
    std.log.info("@as:{any}", .{@as(?[]const u8, null)}); // null
}

fn min() void {
    std.log.info("@min(2, 3)   number:{d:>2}", .{@min(2, 3)});
    std.log.info("@min(2.9, 3) number:{d:>2}", .{@min(2.9, 3)});
    std.log.info("@min(-1, 3)  number:{d:>2}", .{@min(-1, 3)});
    // std.log.info("@min('aa', 'bb')  number:{s:>2}", .{@min("aa", "bb")}); //  error: expected number, found '*const [2:0]u8'

}

const V = struct {
    name: []const u8,

    pub const PubLang = enum { ZH };
    pub fn getname() []const u8 {
        return "";
    }

    const Lang = enum { ZH };
    fn conv() void {}
};

// first argument expected type 'type'
// hasDecl, hasField 第一个参数 type 'type'
fn declAndField() void {
    std.log.info("V.name:{}", .{@hasDecl(V, "name")}); // false
    // first argument expected type 'type'
    std.log.info("V.name:{}", .{@hasField(V, "name")}); // true

    // 在当前目录可以访问
    std.log.info("V.conv:{}", .{@hasDecl(V, "conv")}); // true

    // 全局可访问
    std.log.info("V.getname:{}", .{@hasDecl(V, "getname")}); // true

    const v = V{ .name = "zdz" };
    std.log.info("@field(v,'name'):{s}", .{@field(v, "name")}); // zdz

    std.log.info("@field(V,'Lang'):{}", .{@field(V, "Lang")}); // buildin_fn.V.Lang

    std.log.info("Lang:{any}", .{V.Lang}); // buildin_fn.V.Lang
    std.log.info("PubLang:{any}", .{V.PubLang}); // buildin_fn.V.PubLang
    std.log.info("Lang:{}", .{V.Lang.ZH}); // buildin_fn.V.Lang.ZH

    std.log.info("name ptr:{*}", .{&v.name}); // []const u8@111ab68
    std.log.info("name ptr:{*}", .{@fieldParentPtr(V, "name", &v.name)}); // buildin_fn.V@111ab68

}

fn typeInfo() void {
    std.log.info("{any}", .{V}); // buildin_fn.V
    std.log.info("typeof: {any}", .{@TypeOf(V)}); // type
    std.log.info("typeinfo: {any}", .{@typeInfo(@TypeOf(V))}); //  builtin.Type{ .Type = void }
    std.log.info("{any}", .{@typeInfo(V).Struct.decls}); // buildin_fn.V
    // info: { builtin.Type.Declaration{ .name = { 80, 117, 98, 76, 97, 110, 103 } }, builtin.Type.Declaration{ .name = { 103, 101, 116, 110, 97, 109, 101 } } }
    reflectStruct(V);

    var v = V{ .name = "zdz" };
    std.log.info("{any}", .{v}); // buildin_fn.V{ .name = { 122, 100, 122 } }
    // std.log.info("typeof: {any}", .{@typeInfo(v)}); // error: expected type 'type', found 'buildin_fn.V'

    // std.log.info("typeinfo: {any}", .{@compileLog(@typeInfo(@TypeOf(V)))}); //  builtin.Type{ .Type = void }
    v.name = "22";

    // var temp = 2; // error: variable of type 'comptime_int' must be const or comptime
    // var temp: u8 = 2;
    // temp = 3;

    // const temp = 3;
    // std.log.info("temp:{}", .{temp});
    const E = enum { a, b, c };
    reflectEnum(E);
}

fn reflectStruct(comptime T: type) void {
    for (@typeInfo(T).Struct.decls) |decl| {
        std.log.debug("reflect typeinfo: {s}", .{decl.name});
        //  getname
        //  PubLang
    }
    // { builtin.Type.Declaration{ .name = { 103, 101, 116, 110, 97, 109, 101 } }, builtin.Type.Declaration{ .name = { 80, 117, 98, 76, 97, 110, 103 } } }
}
fn reflectEnum(comptime T: type) void {
    // std.log.debug("reflect typeinfo: {any}", .{@typeInfo(T).Enum.fields}); // `xxx` must be comptime-known, but index value is runtime-known
    std.log.debug("reflect typeinfo: {any}", .{@typeInfo(T).Enum.fields.len}); //  3
}
