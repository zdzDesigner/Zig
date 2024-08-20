const std = @import("std");
const sdl = @import("sdl2");
const ttf = sdl.ttf;
const target_os = @import("builtin").os;

pub extern fn printTest([*c]const u8) void;
pub extern fn setWindowTransparency(display: sdl.c.SDL_SysWMInfo_Display, window: c_ulong, opacity: c_ulong) void;
// pub extern fn setWindowTransparency(info: *sdl.c.SDL_SysWMInfo, opacity: c_ulong) void;

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
    const window_height = 200;

    // std.time.sleep(5 * std.time.ns_per_s);

    var window = try sdl.createWindow(
        "sdl.zig Basic Demo",
        .{ .centered = {} },
        .{ .centered = {} },
        window_width,
        window_height,
        .{ .vis = .shown, .context = .opengl },
    );
    defer window.destroy();
    const window_info = try window.getWMInfo();

    printTest("xxxxxx");
    // window.setVisible(false);
    // _ = window.setWindowOpacity(0);
    //     Display *display = info.info.x11.display;
    // Window xwindow = info.info.x11.window;

    // Set window transparency (0x80000000 for 50% transparent)
    setWindowTransparency(window_info.u.x11.display, window_info.u.x11.window, 0x100000000 * 80 / 100);

    std.debug.print("window:info:{}\n", .{window_info});

    var render = try sdl.createRenderer(window, null, .{ .accelerated = true });
    defer render.destroy();

    // font ============================
    // const ft = "/home/zdz/Documents/Try/Zig/fork/SDL.zig/examples/assets/fonts/8bitOperatorPlus8-Regular.ttf";
    // const ft = "/home/zdz/.local/share/fonts/NerdFonts/monofur Nerd Font Complete Mono.ttf";
    const ft = "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc";
    const font_size = 60;
    const font = try ttf.openFont(ft, font_size);
    defer font.close();
    // font.setSize(10);
    // font.setStyle(.{ .italic = true });
    // 输出成SDL_Surface 意味着文字已经转换一个图像数据
    // const font_surface = try font.renderTextSolid("ab一二", sdl.Color{ .r = 200, .g = 200, .b = 200 });
    //177, 7, 184
    //144, 6, 123
    const bg_color = sdl.Color{ .r = 144, .g = 6, .b = 123 };
    const font_surface = try font.renderUtf8Solid("请充电!", sdl.Color{ .r = 255, .g = 255, .b = 255 });
    const font_rect = sdl.Rectangle{ .x = window_width / 2 - font_size * 3 / 2, .y = window_height / 2 - font_size / 2, .width = font_size * 3, .height = font_size };
    const font_texture = try sdl.createTextureFromSurface(render, font_surface);
    font_surface.destroy();
    defer font_texture.destroy();

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

        try render.setColorRGB(bg_color.r, bg_color.g, bg_color.b);
        try render.clear();

        try render.copy(font_texture, font_rect, null);

        render.present();
        // std.time.sleep(1 * std.time.ns_per_s);
        sdl.delay(1000);
        break :mainLoop;
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
