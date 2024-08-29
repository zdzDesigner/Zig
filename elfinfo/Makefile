.PHONY: build clean
build:
	zig build-exe -O ReleaseFast -freference-trace elfinfo.zig
fmt:
	zig fmt elfinfo.zig defs.zig

test:
	./elfinfo /home/zdz/Documents/Try/IOT/STM32/blink/blink.elf

clean:
	rm -rf *.o elfinfo
