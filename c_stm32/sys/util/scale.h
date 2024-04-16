#ifndef __SCALE_H
#define __SCALE_H

typedef struct scaler {
    unsigned refmin;                        // 参考最低值
    unsigned refmax;                        // 参考最高值
    unsigned min;                           // 实际最低值
    unsigned max;                           // 实际最高值
    int      factor;                        // 比例系数
    int (*factorGen)(struct scaler *);      // 系数生成器
    int (*conv)(struct scaler *, unsigned); // 转换值
} Scaler;

Scaler ScalerInit(unsigned refmin, unsigned refmax, unsigned min, unsigned max);

#endif
