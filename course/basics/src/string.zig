const std = @import("std");
const log = @import("std").log;
const expect = @import("std").testing.expect;

pub fn logic() void {
    log.info("--------- string ----------", .{});
    string();
    array();
    connect();
    extend();
}

fn extend() void {
    // 切片是指向数组的指针
    const names: []const []const u8 = &.{ "zdz", "zdc" };
    std.log.info("names len:{}", .{names.len});
    std.log.info("names typeof:{}", .{@TypeOf(names)}); // []const []const u8
    std.log.info("names pointer:{*}", .{names}); // []const u8@10f3140
    std.log.info("names value:{any}", .{names}); // { { 122, 100, 122 }, { 122, 100, 99 } }

    const names2 = &.{ "zdz", "zdc" };
    std.log.info("names2 len:{}", .{names2.len});
    std.log.info("names2 typeof:{}", .{@TypeOf(names2)}); // *const struct{comptime *const [3:0]u8 = "zdz", comptime *const [3:0]u8 = "zdc"}
    std.log.info("names2 pointer:{*}", .{names2}); // { { 122, 100, 122 }, { 122, 100, 99 } }
    std.log.info("names2 pointer2:{*}", .{&names2}); // *const struct{comptime *const [3:0]u8 = "zdz", comptime *const [3:0]u8 = "zdc"}@10f5620

    const names3 = .{ "zdz", "zdc" };
    std.log.info("names3 len:{}", .{names3.len});
    std.log.info("names3 typeof:{}", .{@TypeOf(names3)}); // struct{comptime *const [3:0]u8 = "zdz", comptime *const [3:0]u8 = "zdc"}
    std.log.info("names3 pointer:{*}", .{&names3});

    // 这里的inline 和 "v:{s}" 是关键, 编译时推到
    // inline for (.{ "zdz", "zdc" }) |v| {
    inline for (names3) |v| {
        std.log.info("v:{s}", .{v});
    }
}

fn array() void {
    // 切片是指向数组的指针，外加一个在运行时确定的长度
    const arr = [_]u8{ 3, 2, 49, 8 };
    log.info("arr typeof: {}", .{@TypeOf(arr)}); // [4]u8  静态区, 非哨兵数组(字符串)
    log.info("arr address: {*}", .{&arr}); // [4]u8@10dfbc6
    log.info("arr len: {}", .{arr.len});
    log.info("arr ptr: {*}", .{(&arr).ptr});

    const fakeslice = arr[0..3];
    log.info("fakeslice typeof: {}", .{@TypeOf(fakeslice)}); // 指向静态区的指针 *const [2]u8
    log.info("fakeslice address: {*}", .{fakeslice}); // [4]u8@10dfbc6

    var postion: u8 = 2;
    postion = 3;
    const slice = arr[0..postion];
    log.info("slice typeof: {}", .{@TypeOf(slice)}); // []const u8
    log.info("slice address: {*}", .{slice}); // [4]u8@10dfbc6 指向的还是静态区

    var arrstack = [_]u8{ 1, 3, 4, 5 }; // 栈里
    arrstack = [_]u8{ 1, 3, 4, 5 };
    log.info("arrstack typeof: {}", .{@TypeOf(arrstack)});
    log.info("arrstack address: {*}", .{&arrstack}); // u8@7ffc45361ac4

}

fn string() void {
    const char: u8 = '8';
    log.info("c:{c},u:{u},d:{d}", .{ char, char, char });

    const enname = "aaaa"; // 常量区
    log.info("enname typeof:{any}", .{@TypeOf(enname)}); // *const [4:0]u8  哨兵数组
    log.info("enname addr:{*}", .{&enname});
    log.info("enname:{s}", .{enname});
    log.info("enname.len:{}", .{enname.len});
    log.info("sentry enname:{}", .{enname[enname.len]});

    const zhname: []const u8 = "bbbb"; // 常量区
    log.info("zhname typeof:{any}", .{@TypeOf(zhname)}); // []const u8
    log.info("zhname addr:{*}", .{&zhname});
    log.info("zhname:{s}", .{zhname});
    log.info("enname.len:{}", .{zhname.len});
    // log.info("sentry enname:{}", .{zhname[zhname.len]}); // error: index 4 outside slice of length 4

    var stack = [_]u8{ 'a', 'a', 'a' };
    stack[1] = 'b';
    log.info("stack addr:{*}", .{&stack});

    const list = [_][]const u8{
        "aaa", "bbb",
    };

    log.info("list[0] typeof: {}", .{@TypeOf(list[0])}); // []const u8
    log.info("list[0].len : {}", .{list[0].len});
    // log.info("sentry list[0] : {}", .{list[0][list[0].len]}); //  error: index 3 outside slice of length 3

}
fn connect() void {
    const names = "aa" ++ "bbb";

    log.info("names:{s}", .{names}); //names:aabbb
}

test "test custom string type" {
    const String = []const u8;
    const list = [_]String{
        "aaa", "bbb",
    };

    try expect(std.mem.eql(u8, list[0], "aaa"));
    try expect(@TypeOf(list[0]) == []const u8);
}

// 字符串常量被存储在二进制文件的一个特殊位置，并且会去重。
// 因此，指向字符串字面量的变量将是指向这个特殊位置的指针。
// 也就是说，"Goku" 的类型更接近于 *const [4]u8，是一个指向 4 常量字节数组的指针。

test "string length" {
    const chname = "测试长度";
    try expect(@TypeOf(chname) == *const [12:0]u8);
    const enname = "aaaa";
    try expect(@TypeOf(enname) == *const [4:0]u8);
    const zhname: []const u8 = "bbbb";
    try expect(@TypeOf(zhname) == []const u8);
}

test "compare c" {
    // const char* name= "zdz";
    // name 存储在readonly data section
}

test "sentry extend" {
    const bs = [3:false]bool{ true, false, true };

    try expect(bs.len == 3);
    try expect(std.mem.asBytes(&bs).*.len == 4);

    const chname = "abcd";
    try expect(chname.len == 4);
    try expect(std.mem.asBytes(chname).*.len == 5);
}
