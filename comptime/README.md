
➜  zig build-exe ./base.zig -femit-llvm-ir -DreleaseFast

➜  zig build-obj -O ReleaseSmall ./base.zig -femit-llvm-ir -target arm-freestanding 

