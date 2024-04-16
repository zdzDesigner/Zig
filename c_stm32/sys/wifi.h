#ifndef __WIFI_USART_H
#define __WIFI_USART_H

#include "stm32f10x.h"

#define WIFI_DR_LIMIT 600

extern u8 WIFI_RX_BUF[WIFI_DR_LIMIT];
extern u8 WIFI_TX_BUF[WIFI_DR_LIMIT];
extern vu16 WIFI_RX_STA;

void WIFI_USART_Start(void);
void WIFI_TIM_Start(u16 psc, u16 nms);
void WIFI_Esp8266(void);

#endif
