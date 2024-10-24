pub fn Foo() type {
    const Bar = struct {
        x: usize,
        // fn baz(_: Bar) void {} // error: use of undeclared identifier 'Bar'
        fn baz(_: @This()) void {}
    };

    return Bar;
}

pub fn Foo2() type {
    return Bar2;
}
const Bar2 = struct {
    x: usize,
    fn baz(_: Bar2) void {} // 只有模块顶层命名才可以使用, 非顶层需要使用@This() 如上
};
