#ifndef __SPI_H
#define __SPI_H

#include "sys.h"

#define SPI_MASTER             SPI1
#define SPI_SLAVE              SPI2
#define SPI_MATER_GPIO         GPIOA
#define SPI_SLAVE_GPIO         GPIOB
#define SPI_MATER_GPIO_Pin     GPIO_Pin_5 | GPIO_Pin_6 | GPIO_Pin_7
#define SPI_MATER_GPIO_NSS_Pin GPIO_Pin_4
#define SPI_SLAVE_GPIO_Pin GPIO_Pin_13 | GPIO_Pin_14 | GPIO_Pin_15




#define RCC_GPIO_CLK()   RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA | RCC_APB2Periph_GPIOB, ENABLE)
#define RCC_MASTER_CLK() RCC_APB2PeriphClockCmd(RCC_APB2Periph_SPI1, ENABLE)
#define RCC_SLAVE_CLK()  RCC_APB1PeriphClockCmd(RCC_APB1Periph_SPI2, ENABLE)


#define SPI_NSS_LOW()  GPIO_ResetBits(SPI_MATER_GPIO, SPI_MATER_GPIO_NSS_Pin)
#define SPI_NSS_HIGH() GPIO_SetBits(SPI_MATER_GPIO, SPI_MATER_GPIO_NSS_Pin)


void CHECK_SPI_Config(void);

#endif