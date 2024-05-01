const std = @import("std");

pub fn logic() void {
    std.log.info("----------- buildin fn -------", .{});
    min();
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

test "alignment:" {
    const c: u8 = 'a';
    std.debug.print("c alignment:{}\n", .{@alignOf(@TypeOf(c))}); // 1
    const str: []const u8 = "xxxx";
    std.debug.print("str alignment:{}\n", .{@alignOf(@TypeOf(str))}); // 8 指针
    std.debug.print("V alignment:{}\n", .{@alignOf(V)}); // 8 指针
    const list_str: []const []const u8 = &.{ "aaa", "bbb" };
    std.debug.print("list_str alignment:{}\n", .{@alignOf(@TypeOf(list_str))}); // 8 指针
}

fn add(a: i32, b: i32) i32 {
    return a + b;
}
test "@call:" {
    // @call(modifier: std.builtin.CallModifier, function: anytype, args: anytype) anytype
    std.debug.print("@call::add:{}\n", .{@call(.auto, add, .{ 2, 3 })}); // 5
    // always_inline: 保证调用将内联在调用点。如果这是不可能的，则会发出编译错误。
    std.debug.print("@call::add:{}\n", .{@call(.always_inline, add, .{ 2, 3 })}); // 5
}

// struct 包含声明(declaration) 和 属性(field)
// std.buildin.Type.Struct
//      fields:[]const StructField
//      decls: []const Declaration
// filed 就是其内部的成员
// V struct 声明后的成员(类比C结构体)
//      PubLang: Enum
//      getname: fn () []const u8
//      names: []const u8@1105780 指针
//      Lang: Enum
//      conv: fn () void
// v = V{.name = "xxxx"} 初始化后的成员
//      name:[]const u8
//      index: u32
//      ... 可以调用 V 中@hasDecl带有@This的方法
const V = struct {
    name: []const u8, // filed
    index: u32 = 0, // filed

    // const Self = @This();
    pub const PubLang = enum { ZH }; // decl
    pub fn getname() []const u8 { // decl
        std.debug.print("V getname run\n", .{});
        return "";
    }

    const names: []const []const u8 = &.{};
    const Lang = enum { ZH };
    fn conv(this: @This()) void {
        _ = this;
        std.debug.print("V conv run\n", .{});
    }
};

const Point = struct {
    x: u32,
    y: u32,

    pub var z: u32 = 1;
};

test {
    std.testing.refAllDecls(@This()); // ? 具体作用
}
// 编译时通过字符串执行字段访问
test "field access by string" {
    const expect = std.testing.expect;
    var p = Point{ .x = 0, .y = 0 };

    @field(p, "x") = 4;
    @field(p, "y") = @field(p, "x") + 1;

    try expect(@field(p, "x") == 4);
    try expect(@field(p, "y") == 5);

    std.debug.print("p.y:{}\n", .{p.y});
}

test "decl access by string" {
    const expect = std.testing.expect;

    try expect(@field(Point, "z") == 1);

    @field(Point, "z") = 2;
    try expect(@field(Point, "z") == 2);
}

// hasDecl, hasField 第一个参数是类型('type')
test "hasDecl:" {
    // std.debug.print("@typeInfo:{}\n", .{@typeInfo(V)}); // false
    {
        std.debug.print("==============:\n", .{});
        std.debug.print("@typeInfo(@TypeOf(V)):{}\n", .{@typeInfo(@TypeOf(V))});
        std.debug.print("{any}\n", .{std.builtin.Type.Type});
        std.debug.print("{any}\n", .{@typeInfo(@TypeOf(V)) == std.builtin.Type.Type}); // true
        std.debug.print("@TypeOf(@field(V,'Lang')):{any}\n", .{@TypeOf(@field(V, "Lang"))}); // type: std.buildin.Type.Enum
        switch (@typeInfo(@TypeOf(V))) { // Type
            .Type => {
                std.debug.print("is type\n", .{}); // right
            },
            else => {
                std.debug.print("is error\n", .{});
            },
        }
        switch (@typeInfo(V)) { // Struct
            .Struct => |t| {
                std.debug.print("t.decls:{any}\n", .{t.decls});
                for (t.decls) |decl| { // 返回 pub 标识的声明
                    std.debug.print("decl:{s}\n", .{decl.name});
                }

                inline for (t.fields) |field| {
                    std.debug.print("field:{s}\n", .{field.name});
                }
            },
            else => {
                std.debug.print("error:\n", .{});
            },
        }
        std.debug.print("==============:\n", .{});
    }

    // 在当前目录可以访问
    std.debug.print("@hasDecl(V,conv):{}\n", .{@hasDecl(V, "conv")}); // true
    // 全局可访问
    std.debug.print("@hasDecl(V,'getname'):{}\n", .{@hasDecl(V, "getname")}); // true
    std.debug.print("@hasField(V,'name'):{}\n", .{@hasField(V, "name")}); // true
    std.debug.print("@hasField(V,'index'):{}\n", .{@hasField(V, "index")}); // true
    std.debug.print("@hasField(V,'Lang') :{}\n", .{@hasField(V, "Lang")}); // false

    // error: struct 'buildin_fn.V' has no member named 'name'
    // 对的, name 是 V 实例化后v 的成员
    // std.debug.print("@field(V,'name'):{}\n", .{@field(V, "name")});

    std.debug.print("@field(V,'PubLang'):{}\n", .{@field(V, "PubLang")}); // V.PubLang
    _ = @field(V, "conv"); // fn () void

    std.debug.print("@field(V,'names'):{s}\n", .{@field(V, "names")}); // []const u8@1105780

    std.debug.print("@field(V,'Lang'):{}\n", .{@field(V, "Lang")}); // V.Lang
    std.debug.print("@field(V, 'Lang') == V.Lang:{}\n", .{@field(V, "Lang") == V.Lang}); // true
    std.debug.print("Lang:{}\n", .{V.Lang.ZH}); // V.Lang.ZH
    // std.debug.print("@typeInfo(@field(V, \"Lang\")):{any}\n", .{@typeInfo(@field(V, "Lang"))}); // true
    //
    const v = V{ .name = "zdz" };

    std.debug.print("@field(v,'name'):{s}\n", .{@field(v, "name")}); // zdz
    std.debug.print("@field(v,'index'):{}\n", .{@field(v, "index")}); // 0

    v.conv(); // ok
    V.conv(v); // ok
    // _ = v.getname(); // not @This()  !!! error: no field or member function named 'getname' in 'buildin_fn.V'
    _ = V.getname(); // ok

    std.debug.print("name ptr:{*}\n", .{&v.name}); // []const u8@111ab68
    // std.debug.print("name ptr:{any}\n", .{@fieldParentPtr(V, &v.name)}); // buildin_fn.V@111ab68

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
