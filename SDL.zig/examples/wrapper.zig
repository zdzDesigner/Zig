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

    const window_width = 640;
    const window_height = 240;

    // std.time.sleep(5 * std.time.ns_per_s);

    var window = try sdl.createWindow(
        "sdl.zig Basic Demo",
        .{ .centered = {} },
        .{ .centered = {} },
        window_width,
        window_height,
        .{ .vis = .shown },
    );
    defer window.destroy();
    const window_info = try window.getWMInfo();
    // window.setVisible(false);
    _ = window.setWindowOpacity(0);

    std.debug.print("window:info:{}\n", .{window_info});

    var render = try sdl.createRenderer(window, null, .{ .accelerated = true, .present_vsync = true });
    defer render.destroy();
    const img = @embedFile("zero.png");
    const img_texture = try sdl.image.loadTextureMem(render, img[0..], sdl.image.ImgFormat.png);
    defer img_texture.destroy();
    const img_mouse = @embedFile("mouse.png");
    const img_texture_mouse = try sdl.image.loadTextureMem(render, img_mouse[0..], sdl.image.ImgFormat.png);
    defer img_texture_mouse.destroy();

    // font ============================
    // const font = try ttf.openFont("./assets/fonts/8bitOperatorPlus8-Regular.ttf", 32);
    // const ft = "/home/zdz/Documents/Try/Zig/fork/SDL.zig/examples/assets/fonts/8bitOperatorPlus8-Regular.ttf";
    // const ft = "/home/zdz/.local/share/fonts/NerdFonts/monofur Nerd Font Complete Mono.ttf";
    const ft = "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc";
    const font_size = 100;
    const font = try ttf.openFont(ft, font_size);
    defer font.close();
    // font.setSize(10);
    // font.setStyle(.{ .italic = true });
    // // 输出成SDL_Surface 意味着文字已经转换一个图像数据
    // // const font_surface = try font.renderTextSolid("ab一二", sdl.Color{ .r = 200, .g = 200, .b = 200 });
    // const font_surface = try font.renderUtf8Solid("请充电!", sdl.Color{ .r = 200, .g = 20, .b = 20 });
    // const font_rect = sdl.Rectangle{ .x = window_width / 2 - 150, .y = window_height / 2 - 50, .width = 300, .height = 100 };
    // // const font_surface = try font.renderUnicodESolid("ab你好赢", sdl.Color{ .r = 200, .g = 200, .b = 200 });
    // const font_texture = try sdl.createTextureFromSurface(render, font_surface);
    // // font_surface.destroy();
    // defer font_texture.destroy();
    //
    // const p = [_]sdl.Point{
    //     .{ .x = 0, .y = 0 },
    //     .{ .x = 200, .y = 10 },
    //     .{ .x = 100, .y = 300 },
    //     .{ .x = 400, .y = 400 },
    //     .{ .x = 640, .y = 480 },
    // };
    const Box = struct {
        width: c_int = 100,
        height: c_int = 80,
    };

    const long = struct {
        var top: c_int = 0;
        var left: c_int = 0;
        var box = Box{ .width = 100, .height = 80 };
        fn inBox(x: c_int, y: c_int) bool {
            // std.debug.print("x:{},y:{}\n", .{ x, y });
            // std.debug.print("l:{},r:{}\n", .{ left, left + box.width });
            // std.debug.print("l-t:{},r-b:{}\n", .{ left, left + box.width });
            return x >= left and x <= (left + box.width) and y >= top and y <= (top + box.height);
        }
    };
    const mouse = struct {
        var top: c_int = 0;
        var left: c_int = -150;
        var box = Box{ .width = 100, .height = 120 };
        fn inBox(x: c_int, y: c_int) bool {
            return x >= left and x <= (left + box.width) and y >= top and y <= (top + box.height);
        }
    };

    // var top: c_int = 0;
    // var left: c_int = 0;
    // const box_width = 100;
    // const box_height = 80;

    mainLoop: while (true) {
        // while (sdl.pollEvent()) |ev| {
        // }
        const ev = try sdl.waitEvent();
        // const key_state = sdl.getKeyboardState();
        // std.debug.print("key_state:{any}", .{key_state.states});
        // std.debug.print("ispress:{}\n", .{key_state.isPressed(.a)});
        switch (ev) {
            .quit => {
                break :mainLoop;
            },
            .key_down => |key| {
                switch (key.scancode) {
                    // long ==============================
                    .up => {
                        long.top -= 10;
                        if (long.top <= 0) long.top = 0;
                    },
                    .down => {
                        long.top += 10;
                        if (long.top >= window_height - long.box.height) long.top = window_height - long.box.height;
                    },
                    .left => {
                        long.left -= 10;
                        if (long.left <= 0) long.left = 0;
                    },
                    .right => {
                        long.left += 10;
                        if (long.left >= window_width - long.box.width) long.left = window_width - long.box.width;
                    },
                    // mouse =============================
                    .w => {
                        mouse.top -= 10;
                        if (mouse.top <= 0) mouse.top = 0;
                    },
                    .s => {
                        mouse.top += 10;
                        if (mouse.top >= window_height - mouse.box.height) mouse.top = window_height - mouse.box.height;
                    },
                    .a => {
                        mouse.left -= 10;
                        if (mouse.left <= 0) mouse.left = 0;
                    },
                    .d => {
                        mouse.left += 10;
                        if (mouse.left >= window_width - mouse.box.width) mouse.left = window_width - mouse.box.width;
                    },
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

        // try render.setColor(sdl.Color.parse("#F7A41D") catch unreachable);
        // try render.drawRect(sdl.Rectangle{
        //     .x = left,
        //     .y = top,
        //     .width = box_width,
        //     .height = box_height,
        // });
        // try render.drawRect(sdl.Rectangle{
        //     .x = Random.intRange(u8, 0, 255),
        //     .y = 215,
        //     .width = 100,
        //     .height = 50,
        // });

        // try render.setColor(sdl.Color.parse("#22A41D") catch unreachable);
        // try render.drawLines(&p);
        //
        // try render.setColor(sdl.Color.parse("#FF0000") catch unreachable);
        // try render.drawPoints(&p);
        // 碰撞检测 ==========================

        if (long.inBox(mouse.left, mouse.top) or
            long.inBox(mouse.left, mouse.top + mouse.box.height) or
            long.inBox(mouse.left + mouse.box.width, mouse.top) or
            long.inBox(mouse.left + mouse.box.width, mouse.top + mouse.box.height) or
            mouse.inBox(long.left, long.top) or
            mouse.inBox(long.left, long.top + long.box.height) or
            mouse.inBox(long.left + long.box.width, long.top) or
            mouse.inBox(long.left + long.box.width, long.top + long.box.height))
        {
            // std.debug.print("xxxxxxxx", .{});
            // try render.copy(img_texture, null, null);
            // try render.copy(img_texture_mouse, null, null);
            try render.copy(img_texture, sdl.Rectangle{
                .x = long.left,
                .y = long.top,
                .width = long.box.width,
                .height = long.box.height,
            }, null);
            _ = try img_texture_mouse.setAlphaMod(29);
            try render.copy(img_texture_mouse, sdl.Rectangle{
                .x = mouse.left,
                .y = mouse.top,
                .width = mouse.box.width,
                .height = mouse.box.height,
            }, null);
        } else {
            try render.copy(img_texture, sdl.Rectangle{
                .x = long.left,
                .y = long.top,
                .width = long.box.width,
                .height = long.box.height,
            }, null);
            _ = try img_texture_mouse.setAlphaMod(255);
            try render.copy(img_texture_mouse, sdl.Rectangle{
                .x = mouse.left,
                .y = mouse.top,
                .width = mouse.box.width,
                .height = mouse.box.height,
            }, null);
        }

        // try render.setColor(sdl.Color.parse("#ffffff") catch unreachable);
        // try render.drawRect(font_rect);

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
