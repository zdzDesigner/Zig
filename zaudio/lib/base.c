#include "portaudio.h"
#include <math.h>
#include <stdio.h>

int main()
{
    // 初始
    Pa_Initialize();

    // 版本号
    int version = Pa_GetVersion();
    printf("version:%d\n", version);
    int version_std = paMakeVersionNumber(18, 5, 1);
    printf("version_std:%d\n", version_std);

    const char *version_str = Pa_GetVersionText();
    printf("version_str:%s\n", version_str);

    // HostApi ===========================
    // host api 个数
    int hostapi_num = Pa_GetHostApiCount();
    printf("hostapi_num:%d\n", hostapi_num);

    PaHostApiIndex hostapi_def = Pa_GetDefaultHostApi();
    printf("hostapi_def:%d\n", hostapi_def);

    // PaHostApiInfo
    //     int 	structVersion
    //     PaHostApiTypeId 	type
    //     const char * 	name
    //     int 	deviceCount
    //     PaDeviceIndex 	defaultInputDevice
    //     PaDeviceIndex 	defaultOutputDevice
    PaHostApiInfo *hostapi_info = Pa_GetHostApiInfo(hostapi_def);
    printf("hostapi_info:%s\n", hostapi_info->name);
    // 检索特定PaHostApiTypeId的当前PaHostApiIndex(hostapi_def)
    // 通过PaHostApiTypeId获取 HostApi
    PaHostApiIndex hostapi_i = Pa_HostApiTypeIdToHostApiIndex(hostapi_info->type);
    printf("hostapi_i:%d\n", hostapi_i);

    // 获取设备个数 0 ~ (num-1)
    // PaDeviceIndex
    PaDeviceIndex num = Pa_GetDeviceCount();
    printf("num:%d\n", num);

    // PaDeviceInfo
    //     int 	structVersion
    //     const char * 	name
    //     PaHostApiIndex 	hostApi
    //     int 	maxInputChannels
    //     int 	maxOutputChannels
    //     PaTime 	defaultLowInputLatency
    //     PaTime 	defaultLowOutputLatency
    //     PaTime 	defaultHighInputLatency
    //     PaTime 	defaultHighOutputLatency
    //     double 	defaultSampleRate
    for (int i = 0; i < num; i++) {
        PaDeviceInfo *device_info = Pa_GetDeviceInfo(i); //
        printf("device_info.hostApi:%s\n", device_info->hostApi);
        printf("device_info.name:%s\n", device_info->name);
        printf("device_info.maxInputChannels:%d\n", device_info->maxInputChannels);
        printf("device_info.maxOutputChannels:%d\n", device_info->maxOutputChannels);
        printf("device_info.defaultSampleRate:%lf\n", device_info->defaultSampleRate);
    }

    // 从 PaHostApiInfo 获取 PaDeviceIndex 获取 device_info
    for (int i = 0; i < hostapi_info->deviceCount; i++) {
        // PaDeviceIndex device_i = Pa_HostApiDeviceIndexToDeviceIndex(hostapi_info->hostapi_i, i);
        //     printf("device_i:%d", device_i);
    }


    PaDeviceIndex device_input = Pa_GetDefaultInputDevice();
    printf("device_input:%d\n", device_input);
    PaDeviceIndex device_output = Pa_GetDefaultOutputDevice();
    printf("device_output:%d\n", device_output);


    Pa_Terminate();
    return 0;
}
