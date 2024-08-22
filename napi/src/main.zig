const std = @import("std");
const napigen = @import("napigen");

export fn add(a: i32, b: i32) i32 {
    return a + b;
}

comptime {
    napigen.defineModule(initModule);
}

fn initModule(js: *napigen.JsContext, exports: napigen.napi_value) anyerror!napigen.napi_value {
    const info = struct {
        var version: u32 = undefined;
        fn getVersion() u32 {
            return version;
        }
        var version_node: []u8 = undefined;
        fn getNodeEnv() []u8 {
            return version_node;
        }
    };
    info.version = try js.getEnv();
    info.version_node = try js.getNodeEnv();

    try js.setNamedProperty(exports, "add", try js.createFunction(add));
    try js.setNamedProperty(exports, "getEnv", try js.createFunction(info.getVersion));
    try js.setNamedProperty(exports, "getNodeEnv", try js.createFunction(info.getNodeEnv));

    return exports;
}
