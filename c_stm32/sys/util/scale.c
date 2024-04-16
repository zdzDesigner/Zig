#include "scale.h"

static int factorGen(Scaler *s)
{
    return (int)(s->refmax - s->refmin) * 1000 / (s->max - s->min);
}

static int conv(Scaler *s, unsigned val)
{
    if (s->factor == 0) {
        s->factor = s->factorGen(s);
    }

    int xval = val - s->min; // 以真实最小值为基准, 得到当前值
    if (xval < 0) return 0; // 最小值

    xval = (int)(s->factor * xval) / 1000; // 乘以比例因子
    if (xval > s->refmax) return s->refmax; // 最大值
    return xval;
}

Scaler ScalerInit(unsigned refmin, unsigned refmax, unsigned min, unsigned max)
{
    Scaler scaler = {
        .refmin    = refmin,
        .refmax    = refmax,
        .min       = min,
        .max       = max,
        .factorGen = factorGen,
        .conv      = conv,
    };
    return scaler;
}
