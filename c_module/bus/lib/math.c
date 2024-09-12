#include "sum/sum.h"

int fib(int n)
{
    if (n == 1 || n == 2) {
        return 1;
    } else {
        return sum(fib(n - 1), fib(n - 2));
    }
}
