#ifndef __SPI_SINGLE_H
#define __SPI_SINGLE_H


#define SPI_MASTER          SPI1
#define SPI_MASTER_CLK      RCC_APB2Periph_SPI1
#define SPI_MASTER_GPIO     GPIOA
#define SPI_MASTER_GPIO_CLK RCC_APB2Periph_GPIOA
#define SPI_MASTER_PIN_SCK  GPIO_Pin_5
#define SPI_MASTER_PIN_MISO GPIO_Pin_6
#define SPI_MASTER_PIN_MOSI GPIO_Pin_7
#define SPI_MASTER_IRQn     SPI1_IRQn

#define SPI_SLAVE          SPI2
#define SPI_SLAVE_CLK      RCC_APB1Periph_SPI2
#define SPI_SLAVE_GPIO     GPIOB
#define SPI_SLAVE_GPIO_CLK RCC_APB2Periph_GPIOB
#define SPI_SLAVE_PIN_SCK  GPIO_Pin_13
#define SPI_SLAVE_PIN_MISO GPIO_Pin_14
#define SPI_SLAVE_PIN_MOSI GPIO_Pin_15
// #define SPI_SLAVE_IRQn     SPI2_IRQn

// #define SPI_SLAVE          SPI1
// #define SPI_SLAVE_CLK      RCC_APB2Periph_SPI1
// #define SPI_SLAVE_GPIO     GPIOA
// #define SPI_SLAVE_GPIO_CLK RCC_APB2Periph_GPIOA
// #define SPI_SLAVE_PIN_SCK  GPIO_Pin_5
// #define SPI_SLAVE_PIN_MISO GPIO_Pin_6
// #define SPI_SLAVE_PIN_MOSI GPIO_Pin_7
// #define SPI_SLAVE_IRQn     SPI1_IRQn

// #define SPI_MASTER          SPI2
// #define SPI_MASTER_CLK      RCC_APB1Periph_SPI2
// #define SPI_MASTER_GPIO     GPIOB
// #define SPI_MASTER_GPIO_CLK RCC_APB2Periph_GPIOB
// #define SPI_MASTER_PIN_SCK  GPIO_Pin_13
// #define SPI_MASTER_PIN_MISO GPIO_Pin_14
// #define SPI_MASTER_PIN_MOSI GPIO_Pin_15
// #define SPI_MASTER_IRQn     SPI2_IRQn


void CHECK_SPI_SINGLE_Config(void);

#endif