#include "spi_duplex.h"

#include "sys.h"



/* Private typedef -----------------------------------------------------------*/
typedef enum { FAILED = 0,
               PASSED = !FAILED } TestStatus;

/* Private define ------------------------------------------------------------*/
#define BufferSize 32

/* Private macro -------------------------------------------------------------*/
/* Private variables ---------------------------------------------------------*/
SPI_InitTypeDef SPI_InitStructure;
static uint8_t SPIy_Buffer_Tx[BufferSize] = {0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
                                      0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E,
                                      0x0F, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15,
                                      0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C,
                                      0x1D, 0x1E, 0x1F, 0x20};
static uint8_t SPIz_Buffer_Tx[BufferSize] = {0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57,
                                      0x58, 0x59, 0x5A, 0x5B, 0x5C, 0x5D, 0x5E,
                                      0x5F, 0x60, 0x61, 0x62, 0x63, 0x64, 0x65,
                                      0x66, 0x67, 0x68, 0x69, 0x6A, 0x6B, 0x6C,
                                      0x6D, 0x6E, 0x6F, 0x70};
static uint8_t SPIy_Buffer_Rx[BufferSize], SPIz_Buffer_Rx[BufferSize];
static __IO uint8_t TxIdx = 0, RxIdx = 0, k = 0;
static volatile TestStatus TransferStatus1 = FAILED, TransferStatus2 = FAILED;
static volatile TestStatus TransferStatus3 = FAILED, TransferStatus4 = FAILED;

/* Private functions ---------------------------------------------------------*/
static void RCC_Configuration(void);
static void GPIO_Configuration(uint16_t SPIy_Mode, uint16_t SPIz_Mode);



static void RCC_Configuration(void) {
    /* PCLK2 = HCLK/2 */
    RCC_PCLK2Config(RCC_HCLK_Div2);

    /* Enable SPIy clock and GPIO clock for SPIy and SPIz */
    RCC_APB2PeriphClockCmd(SPIy_GPIO_CLK | SPIz_GPIO_CLK | SPIy_CLK, ENABLE);
    /* Enable SPIz Periph clock */
    RCC_APB1PeriphClockCmd(SPIz_CLK, ENABLE);
}