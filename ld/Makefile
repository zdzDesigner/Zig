
test:
	@bash ./tests/init.sh
	@printf "\e[32mOK\e[0m\n"



## optimize
ld:
	@go build -ldflags="-s -w" -o $@ && upx -9 $@

elf:
	@hexdump -C -n 8 out/init/out.o

elf8:
	@hexdump -C -n 8 out/init/out.o

.PHONY: test elf8 ld
