#ifndef __ADC_H
#define __ADC_H

#include "stm32f10x.h"



void ADC_Config(void);
uint16_t ADC_Read();
uint16_t ADC_ReadCh(uint8_t);
u16 ADC_AVG_Read(u16 times);
u16 ADC_AVG_ReadCh(uint8_t ch, u16 times);
void MYDMA_Enable(void);
void ADC_DMA_Avg();

#endif
