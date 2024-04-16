#ifndef __DEBUG_H
#define __DEBUG_H

#define PAD_RIGHT 1
#define PAD_ZERO  2
#define PRINT_BUF_LEN 12

void PRINTF_DEBUG();
int my_printf(const char *format, ...);
int my_sprintf(char *out, const char *format, ...);
int my_snprintf( char *buf, unsigned int count, const char *format, ... );

#endif