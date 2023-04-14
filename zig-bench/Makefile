

all:c/main zig/main go/main cpp/main

c/main:
	cd c && gcc -o main main.c



zig/main:
	cd zig && zig build-exe  main.zig  -O ReleaseSmall  --name main


go/main:
	cd go && go build main.go

cpp/main:
	cd cpp && g++ -o main main.cpp


bench:
	hyperfine -N --warmup 10 'go/main' 'node js/main.js'  'lua lua/main.lua'  'zig/main' 'c/main' 'go/main' 'cpp/main' 'zig/main'


# hyperfine -N --warmup 10 'go/main' 'node js/main.js' 'zig/main' 'c/main'

# --warmup 3 'grep -R TODO *'

