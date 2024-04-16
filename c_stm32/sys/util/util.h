#ifndef __UTIL_H
#define __UTIL_H

#include <stdint.h>
#include "scale.h"
#include "avg.h"


uint8_t Buffercmp(const uint32_t* pBuffer, uint32_t* pBuffer1, uint16_t BufferLength);
uint8_t BuffercmpUint8(const uint8_t* pBuffer, uint8_t* pBuffer1, uint8_t BufferLength);

void TraceElementU8(uint8_t* arr, uint16_t len, char* tag);

#endif