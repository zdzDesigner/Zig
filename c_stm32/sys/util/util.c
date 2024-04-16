#include "util.h"

/**
 * 判断指定长度的两个数据源是否完全相等，
 * 如果完全相等返回1，只要其中一对数据不相等返回0
 */
uint8_t Buffercmp(const uint32_t *pBuffer, uint32_t *pBuffer1, uint16_t BufferLength)
{
    /* 数据长度递减 */
    while (BufferLength--) {
        printf("BufferLength: %d\n", BufferLength);
        printf("*pBuffer: %lX\n", *pBuffer);
        printf("*pBuffer1: %lX\n", *pBuffer1);

        /* 判断两个数据源是否对应相等 */
        if (*pBuffer != *pBuffer1) {
            /* 对应数据源不相等马上退出函数，并返回0 */
            return 0;
        }
        /* 递增两个数据源的地址指针 */
        pBuffer++;
        pBuffer1++;
    }
    /* 完成判断并且对应数据相对 */
    return 1;
}

uint8_t BuffercmpUint8(const uint8_t *pBuffer, uint8_t *pBuffer1, uint8_t BufferLength)
{
    /* 数据长度递减 */
    while (BufferLength--) {
        printf("BufferLength: %d\n", BufferLength);
        printf("*pBuffer: %lX\n", *pBuffer);
        printf("*pBuffer1: %lX\n", *pBuffer1);

        /* 判断两个数据源是否对应相等 */
        if (*pBuffer != *pBuffer1) {
            /* 对应数据源不相等马上退出函数，并返回0 */
            return 0;
        }
        /* 递增两个数据源的地址指针 */
        pBuffer++;
        pBuffer1++;
    }
    /* 完成判断并且对应数据相对 */
    return 1;
}

void TraceElementU8(uint8_t *arr, uint16_t len, char *tag)
{
    while (len--) {
        printf("%s:%d\n", tag, *arr);
        arr++;
    }
}
