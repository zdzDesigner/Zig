const std = @import("std");
const expect = @import("std").testing.expect;

pub fn logic() void {
    std.log.info("-------- error --------", .{});

    std.log.info("{}", .{@TypeOf(error{Err})}); // type
    const Err = error{VErr};
    std.log.info("@errorName:{s}", .{@errorName(Err.VErr)});
}

test "for result assignment error" {
    const arr = [_]u8{ 1, 3, 5, 7 };
    const val = for (arr) |item| {
        if (item > 100) break item;
        // if (item > 1) break item;
    } else {
        std.debug.print("== error ==\n", .{});
        std.process.exit(1);
    };
    std.debug.print("{d}\n", .{val});
}

// error sets
test "test error" {
    // 这里的 error 不是类型, 是错误类型集合: "类型生成器"
    const FileOpenError = error{ AccessDenied, OutOfMemory, FileNotFound };
    const AllocationError = error{OutOfMemory};

    try expect(FileOpenError.OutOfMemory == AllocationError.OutOfMemory);

    try expect(@TypeOf(FileOpenError.OutOfMemory) == FileOpenError);
}

test "test union test" {
    const AllocationError = error{OutOfMemory};
    const mybe_error: AllocationError!u8 = 10;
    const validVal = mybe_error catch 0;
    try expect(@TypeOf(validVal) == u8);
}

fn failing() error{Oops}!void {
    return error.Oops;
}

test "test failing" {
    // try x 是 x catch |err| return err 的快捷方式，通常用于不适合处理错误的地方。Zig 的 try 和 catch 与其他语言中的 try-catch 无关。
    failing() catch |err| {
        try expect(err == error.Oops);
        try expect(@TypeOf(err) == error{Oops});
    };
}

fn failFn() error{Oops}!u16 {
    try failing();
    return 100;
}

test "test catch prevent" {
    const val = failFn() catch |err| {
        try expect(err == error.Oops);
        return;
    };
    try expect(val == 100);
}

var problems: u16 = 10;
fn failConter() error{ErrDoing}!void {
    errdefer problems += 1;
    return error.ErrDoing;
}
test "test errdefer" {
    // errdefer 的工作方式与 defer 类似，但仅在返回函数并在 errdefer 的块内出现错误时才执行。
    failConter() catch |err| {
        try expect(err == error.ErrDoing);
        try expect(problems == 11);
    };
}

fn createFile(i: u8) !u8 {
    if (i == 0) return error.AccessDenied;
    return 100;
}
// try x 是 x catch |err| return err 的快捷方式，通常用于不适合处理错误的地方。Zig 的 try 和 catch 与其他语言中的 try-catch 无关。
test "test error type panic" {
    const val = try createFile(1);
    try expect(val == 100);
}
test "test error type derive" {
    const val = createFile(1) catch |err| {
        try expect(err == error.AccessDenied);
        return;
    };
    try expect(val == 100);
    // 错误推导
    // const val: error{AccessDenied}!u8 = createFile(0) catch |err| {
    //     try expect(err == error.AccessDenied);
    //     return;
    // };
    // try expect(val == error.AccessDenied);
}

// anyerror 是全局错误集，由于它是所有错误集的超集，因此*可能*会从任何集合*强制到其值时*出现错误。一般应避免使用它。
fn anyerrorFn() anyerror {
    return error.AccessDenied;
}
test "test anyerror" {
    const err = anyerrorFn();
    try expect(err == error.AccessDenied);
    try expect(@TypeOf(err) == anyerror);
}

const ErrorManager = struct {};
const Error = struct {};

test "error " {}
