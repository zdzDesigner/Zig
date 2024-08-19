const c = @cImport({
    @cInclude("../Nuklear//nuklear.h");
    @cInclude("../Nuklear/demo/sdl_opengl2/nuklear_sdl_gl2.h");
});

pub fn init(win: ?*c.SDL_Window) [*c]c.struct_nk_context {
    return c.nk_sdl_init(win);
}

// c.nk_sdl_init(win: ?*SDL_Window)
// c.nk_init(: [*c]struct_nk_context, : [*c]const struct_nk_allocator, : [*c]const struct_nk_user_font)
