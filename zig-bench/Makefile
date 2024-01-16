

all:c zig go cpp rust

c:c/main.c
	cd c && gcc -o main main.c

zig:zig/main.zig
	cd zig && zig build-exe  main.zig  --name main
	# cd zig && zig build-exe  main.zig  -O ReleaseSmall  --name main


go:go/main.go
	cd go && go build main.go

cpp:cpp/main.cpp
	cd cpp && g++ -o main main.cpp

rust:rust/main.rs
	cd rust && rustc main.rs

bench:
	hyperfine -N --warmup 10 'go/main' 'node js/main.js'  'lua lua/main.lua' 'rust/main' 'zig/main' 'c/main' 'go/main' 'cpp/main' 'zig/main'


# hyperfine -N --warmup 10 'go/main' 'node js/main.js' 'zig/main' 'c/main'

# --warmup 3 'grep -R TODO *'

.PHONY:c zig go cpp rust
