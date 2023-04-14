package main

import (
	"fmt"
)

func main() {
	for i := 1; i <= 20; i++ {
		fmt.Println(fib(i))
	}
}

func fib(i int) int {
	if i == 1 || i == 2 {
		return 1
	}
	return fib(i-1) + fib(i-2)
}
