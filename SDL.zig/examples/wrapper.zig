const std = @import("std");
const sdl = @import("sdl2");
const ttf = sdl.ttf;
const target_os = @import("builtin").os;

pub fn main() !void {
    try sdl.init(.{
        // .video = true,
        .events = true,
        // .audio = true,
    });
    defer sdl.quit();
    // ttf ==================
    try ttf.init();
    defer ttf.quit();

    // std.time.sleep(5 * std.time.ns_per_s);

    var window = try sdl.createWindow(
        "sdl.zig Basic Demo",
        .{ .centered = {} },
        .{ .centered = {} },
        640,
        480,
        .{ .vis = .shown },
    );
    defer window.destroy();
    const window_info = try window.getWMInfo();
    // window.setVisible(false);
    _ = window.setWindowOpacity(0);

    std.debug.print("window:info:{}\n", .{window_info});

    var render = try sdl.createRenderer(window, null, .{ .accelerated = true });
    defer render.destroy();

    // font ============================
    // const font = try ttf.openFont("./assets/fonts/8bitOperatorPlus8-Regular.ttf", 32);
    // const ft = "/home/zdz/Documents/Try/Zig/fork/SDL.zig/examples/assets/fonts/8bitOperatorPlus8-Regular.ttf";
    // const ft = "/home/zdz/.local/share/fonts/NerdFonts/monofur Nerd Font Complete Mono.ttf";
    const ft = "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc";
    const font = try ttf.openFont(ft, 42);
    defer font.close();
    // font.setSize(10);
    // font.setStyle(.{ .italic = true });
    // 输出成SDL_Surface 意味着文字已经转换一个图像数据
    // const font_surface = try font.renderTextSolid("ab一二", sdl.Color{ .r = 200, .g = 200, .b = 200 });
    const font_surface = try font.renderUtf8Solid("ab你好赢曦龘", sdl.Color{ .r = 200, .g = 200, .b = 200 });
    // const font_surface = try font.renderUnicodESolid("ab你好赢", sdl.Color{ .r = 200, .g = 200, .b = 200 });
    const font_texture = try sdl.createTextureFromSurface(render, font_surface);
    // font_surface.destroy();
    defer font_texture.destroy();
    const font_rect = sdl.Rectangle{ .x = 0, .y = 0, .width = 380, .height = 20 };

    const p = [_]sdl.Point{
        .{ .x = 0, .y = 0 },
        .{ .x = 200, .y = 10 },
        .{ .x = 100, .y = 300 },
        .{ .x = 400, .y = 400 },
        .{ .x = 640, .y = 480 },
    };

    mainLoop: while (true) {
        // while (sdl.pollEvent()) |ev| {
        // }
        const ev = try sdl.waitEvent();
        switch (ev) {
            .quit => {
                break :mainLoop;
            },
            .key_down => |key| {
                switch (key.scancode) {
                    .escape => break :mainLoop,
                    else => {
                        // std.log.info("key pressed: {}\n", .{key.scancode});
                    },
                }
            },

            else => {},
        }

        // try render.setColorRGB(0, 0, 0);
        try render.setColorRGBA(10, 10, 10, 10);
        try render.clear();

        try render.setColor(sdl.Color.parse("#F7A41D") catch unreachable);
        try render.drawRect(sdl.Rectangle{
            .x = 70,
            .y = 215,
            .width = 100,
            .height = 50,
        });
        try render.drawRect(sdl.Rectangle{
            .x = Random.intRange(u8, 0, 255),
            .y = 215,
            .width = 100,
            .height = 50,
        });

        try render.setColor(sdl.Color.parse("#22A41D") catch unreachable);
        try render.drawLines(&p);

        try render.setColor(sdl.Color.parse("#FF0000") catch unreachable);
        try render.drawPoints(&p);

        try render.copy(font_texture, font_rect, null);
        try render.setColor(sdl.Color.parse("#ffffff") catch unreachable);
        try render.drawRect(font_rect);

        // if (target_os.tag != .linux) {
        //     // Ubuntu CI doesn't have this function available yet
        //     try render.drawGeometry(
        //         null,
        //         &[_]sdl.Vertex{
        //             .{
        //                 .position = .{ .x = 400, .y = 150 },
        //                 .color = sdl.Color.rgb(255, 0, 0),
        //             },
        //             .{
        //                 .position = .{ .x = 350, .y = 200 },
        //                 .color = sdl.Color.rgb(0, 0, 255),
        //             },
        //             .{
        //                 .position = .{ .x = 450, .y = 200 },
        //                 .color = sdl.Color.rgb(0, 255, 0),
        //             },
        //         },
        //         null,
        //     );
        // }

        render.present();
    }
}

const Random = struct {
    var instance: ?std.rand.DefaultPrng = null;

    pub fn intRange(comptime T: type, min: T, max: T) T {
        var r = random();
        return r.intRangeAtMost(T, min, max);
    }

    pub fn shuffle(comptime T: type, buf: []T) void {
        return random().shuffle(T, buf);
    }

    pub fn random() std.rand.Random {
        if (instance == null) {
            var seed: u64 = undefined;
            std.posix.getrandom(std.mem.asBytes(&seed)) catch unreachable;
            instance = std.rand.DefaultPrng.init(seed);
        }
        return instance.?.random();
    }
};
