#ifndef __DMA_H
#define __DMA_H

#define M2M_DMA_CLK     RCC_AHBPeriph_DMA1
#define M2M_DMA_CHANNEL DMA1_Channel2
#define DMA_IT_TCx      DMA1_IT_TC2
#define DMA_IT_HTx      DMA1_IT_HT2
#define DMA_IT_TEx      DMA1_IT_TE2
#define DMA_FLAG_TCx    DMA1_FLAG_TC2
#define DMA_IRQn        DMA1_Channel2_IRQn

void DMA_M2M_Demo(void);

#endif
