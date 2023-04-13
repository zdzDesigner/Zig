#include <stdio.h>

int fib(int n) {
  if (n == 1 || n == 2) {
    return 1;
  } else {
    return fib(n - 1) + fib(n - 2);
  }
}

int main(int argc, char *argv[]) {
  for (int i = 1; i <= 20; i++) {
    printf("%d\n", fib(i));
  }

  return 0;
}
