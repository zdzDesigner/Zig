// 关闭运行时检查, 默认开启
test "@setRuntimeSafety::" {
    @setRuntimeSafety(false); // pass
    var x: u8 = 255;
    x += 1;
    {
        @setRuntimeSafety(true); // 可以区域开启
        var x1: u8 = 255;
        x1 += 1;
    }
}

fn comp() !void {
    if (!@inComptime()) {
        // 运行时执行了
        @compileLog("=============");
    }
}

test "@inComptime::" {
    try comp();
}
