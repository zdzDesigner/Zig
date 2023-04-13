function main() {
  for (var i = 1; i <= 20; i++) {
    console.log(fib(i))
  }
}

function fib(i) {
  if (i == 1 || i == 2) return 1
  return fib(i - 1) + fib(i - 2)
}
main()
