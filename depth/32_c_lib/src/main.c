#include <stdio.h>

#include "math.h"

int main(void) {
	int a = 21;
	int b = 21;
	int c = add(a, b);

	printf("c: a + b == %d\n", c);
	printf("c: a++ == %d\n", increment(a));

	return 0;
}
