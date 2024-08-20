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
    // const ft = "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc";
    const ft = "/usr/share/fonts/adobe-source-han-sans/SourceHanMonoSC-Medium.otf";
    const font_size = 100;
    const font = try ttf.openFont(ft, font_size);
    defer font.close();

    const Box = struct {
        width: c_int = 100,
        height: c_int = 80,
    };

    const long = struct {
        var top: c_int = 0;
        var left: c_int = 0;
        var box = Box{ .width = 1024, .height = 1024 };
        fn inBox(x: c_int, y: c_int) bool {
            // std.debug.print("x:{},y:{}\n", .{ x, y });
            // std.debug.print("l:{},r:{}\n", .{ left, left + box.width });
            // std.debug.print("l-t:{},r-b:{}\n", .{ left, left + box.width });
            return x >= left and x <= (left + box.width) and y >= top and y <= (top + box.height);
        }

        fn move(key: sdl.Scancode) void {
            switch (key) {
                .up => {
                    top -= 10;
                    if (top <= 0) top = 0;
                },
                .down => {
                    top += 10;
                    if (top >= window_height - box.height) top = window_height - box.height;
                },
                .left => {
                    left -= 10;
                    if (left <= 0) left = 0;
                },
                .right => {
                    left += 10;
                    if (left >= window_width - box.width) left = window_width - box.width;
                },
                else => {},
            }
        }
    };
    const mouse = struct {
        var top: c_int = 0;
        var left: c_int = -150;
        var box = Box{ .width = 100, .height = 120 };
        fn inBox(x: c_int, y: c_int) bool {
            return x >= left and x <= (left + box.width) and y >= top and y <= (top + box.height);
        }
        fn move(key: sdl.Scancode) void {
            switch (key) {
                .w => {
                    top -= 10;
                    if (top <= 0) top = 0;
                },
                .s => {
                    top += 10;
                    if (top >= window_height - box.height) top = window_height - box.height;
                },
                .a => {
                    left -= 10;
                    if (left <= 0) left = 0;
                },
                .d => {
                    left += 10;
                    if (left >= window_width - box.width) left = window_width - box.width;
                },
                else => {},
            }
        }
    };

    // var chips: [4]sdl.Rectangle = .{
    //     .{
    //         .x = 0,
    //         .y = 0,
    //         .width = 100,
    //         .height = 100,
    //     },
    //     .{
    //         .x = 100,
    //         .y = 0,
    //         .width = 100,
    //         .height = 100,
    //     },
    //     .{
    //         .x = 0,
    //         .y = 100,
    //         .width = 100,
    //         .height = 100,
    //     },
    //     .{
    //         .x = 100,
    //         .y = 100,
    //         .width = 100,
    //         .height = 100,
    //     },
    // };
    // std.debug.print("chips:{any}", .{chips});
    // try sdl.blitSurface(null, sdl.Rectangle{ .width = 100, .height = 100 }, null, &chips[0]);

    mainLoop: while (true) {
        // while (sdl.pollEvent()) |ev| {
        // }
        const evt = try sdl.waitEvent();
        // const key_state = sdl.getKeyboardState();
        // std.debug.print("key_state:{any}", .{key_state.states});
        // std.debug.print("ispress:{}\n", .{key_state.isPressed(.a)});
        switch (evt) {
            .quit => {
                break :mainLoop;
            },
            .key_down => |key| {
                switch (key.scancode) {
                    .escape => break :mainLoop,
                    else => {
                        long.move(key.scancode);
                        mouse.move(key.scancode);
                        // std.log.info("key pressed: {}\n", .{key.scancode});
                    },
                }
            },

            else => {},
        }

        // try render.setColorRGB(0, 0, 0);
        try render.setColorRGBA(10, 10, 10, 10);
        try render.clear();

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
            // try render.copy(img_texture, sdl.Rectangle{
            //     .x = long.left,
            //     .y = long.top,
            //     .width = long.box.width,
            //     .height = long.box.height,
            // }, null);
            try render.copy(img_texture, sdl.Rectangle{
                .x = long.left,
                .y = long.top,
                .width = long.box.width,
                .height = long.box.height,
            }, sdl.Rectangle{
                .x = long.left,
                .y = long.top,
                .width = long.box.width,
                .height = long.box.height,
            });
            _ = try img_texture_mouse.setAlphaMod(255);
            try render.copy(img_texture_mouse, sdl.Rectangle{
                .x = mouse.left,
                .y = mouse.top,
                .width = mouse.box.width,
                .height = mouse.box.height,
            }, null);
        }

        render.present();
    }
}
