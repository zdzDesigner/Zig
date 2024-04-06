#include "math.h"
#include <stdio.h>

int add(int a, int b)
{
    printf("a:%d,b:%d\n", a, b);
    return a + b;
}

int increment(int x) { return x + INCREMENT_BY; }
