#include "avg.h"

uint16_t avg(uint16_t *arr, uint8_t len)
{
    uint32_t total = 0;
    uint8_t i = 0;
    do {
        total += arr[i];
        i++;
    } while (len > i);
    return total / len;
}
