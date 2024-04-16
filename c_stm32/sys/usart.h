#ifndef __USART_H
#define __USART_H

#include "stm32f10x.h"

void PRINT_Config(void);

void SendByte(char ch);
void USART_SendString(USART_TypeDef *USARTx, char *str);
uint8_t USART_ReceiveByte(USART_TypeDef *USARTx);
void USART_SendByte(USART_TypeDef *USARTx, uint16_t Data);
int my_putchar(int c);

#endif
