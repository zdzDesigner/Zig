

elf:
	-zig build

bin:
	arm-none-eabi-objcopy -O binary -S ./zig-out/bin/bluepill.elf ./zig-out/bin/bluepill.bin


down:bin
	JLinkExe -autoconnect 1 -device STM32F103C8 -if swd -speed 4000  -commandfile ./download.jlink

