#include <SDL2/SDL.h>
#include <SDL2/SDL_syswm.h>
#include <X11/Xatom.h>
#include <X11/Xlib.h>
#include <stdio.h>

void printTest(char *str) { printf("%s\n", str); }
// Function to set window transparency using X11
void setWindowTransparency(Display *display, Window window, unsigned long opacity)
{
    Atom _NET_WM_WINDOW_OPACITY = XInternAtom(display, "_NET_WM_WINDOW_OPACITY", False);
    printf("_NET_WM_WINDOW_OPACITY: %d\n", _NET_WM_WINDOW_OPACITY != None);
    if (_NET_WM_WINDOW_OPACITY != None) {
        printf("opacity:%ld \n",opacity);
        printf("window:%ld \n",window);
        XChangeProperty(display, window, _NET_WM_WINDOW_OPACITY, XA_CARDINAL, 32, PropModeReplace, (unsigned char *)&opacity, 1);
    }
}

// void setWindowTransparency(SDL_SysWMinfo *info, unsigned long opacity)
// {
//     Display *display = info->info.x11.display;
//     Window window = info->info.x11.window;
//     Atom _NET_WM_WINDOW_OPACITY = XInternAtom(display, "_NET_WM_WINDOW_OPACITY", False);
//     if (_NET_WM_WINDOW_OPACITY != None) {
//         XChangeProperty(display, window, _NET_WM_WINDOW_OPACITY, XA_CARDINAL, 32, PropModeReplace, (unsigned char *)&opacity, 1);
//     }
// }
