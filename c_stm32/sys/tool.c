
char *itoa(int value, char *string, int radix) {
    int i, d;
    int flag  = 0;
    char *ptr = string;

    if (radix != 10) {
        *ptr = 0;
        return string;
    }

    if (!value) {
        *ptr++ = 0x30;
        *ptr   = 0;
        return string;
    }

    if (value < 0) {
        *ptr++ = '-';

        value *= -1;
    }

    for (i = 10000; i > 0; i /= 10) {
        d = value / i;

        if (d || flag) {
            *ptr++ = (char)(d + 0x30);
            value -= (d * i);
            flag = 1;
        }
    }

    *ptr = 0;

    return string;
}