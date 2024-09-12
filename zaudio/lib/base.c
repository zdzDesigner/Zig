#include "portaudio.h"
#include <math.h>
#include <stdio.h>

int main()
{
    // 初始
    PaError err = Pa_Initialize();
    if (err != paNoError) {
        printf("PortAudio initialization failed: %s\n", Pa_GetErrorText(err));
        return -1;
    }

    // 版本号
    int version = Pa_GetVersion();
    printf("version:%d\n", version);
    int version_std = paMakeVersionNumber(18, 5, 1);
    printf("version_std:%d\n", version_std);

    const char *version_str = Pa_GetVersionText();
    printf("version_str:%s\n", version_str);

    // HostApi ===========================
    // host api 个数
    PaHostApiIndex hostapi_num = Pa_GetHostApiCount();
    printf("hostapi_num(host api个数):%d\n", hostapi_num);

    PaHostApiIndex hostapi_def = Pa_GetDefaultHostApi();
    printf("hostapi_def(默认 host api):%d\n", hostapi_def);

    // PaHostApiInfo
    //     int 	structVersion
    //     PaHostApiTypeId 	type
    //     const char * 	name
    //     int 	deviceCount
    //     PaDeviceIndex 	defaultInputDevice
    //     PaDeviceIndex 	defaultOutputDevice
    const PaHostApiInfo *hostapi_info = Pa_GetHostApiInfo(hostapi_def);
    printf("hostapi_info->name(host api 名称):%s\n", hostapi_info->name);
    // 检索特定PaHostApiTypeId的当前PaHostApiIndex(hostapi_def)
    // 通过PaHostApiTypeId获取 HostApi
    PaHostApiIndex hostapi_i = Pa_HostApiTypeIdToHostApiIndex(hostapi_info->type);
    printf("hostapi_i(通过PaHostApiTypeId获取 HostApiIndex):%d\n", hostapi_i);

    // 获取设备个数 0 ~ (num-1)
    // PaDeviceIndex
    PaDeviceIndex num = Pa_GetDeviceCount();
    printf("num(设备个数):%d\n", num);

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
        const PaDeviceInfo *device_info = Pa_GetDeviceInfo(i); //
        printf("device_info.hostApi(设备属于的HostApiIndex):%d\n", device_info->hostApi);
        // printf("device_info.name(设备名):%s\n", device_info->name);
        // printf("device_info.maxInputChannels(设备最大输入通道):%d\n", device_info->maxInputChannels);
        // printf("device_info.maxOutputChannels(设备最大输出通道):%d\n", device_info->maxOutputChannels);
        // printf("device_info.defaultSampleRate(设备默认采样率):%lf\n", device_info->defaultSampleRate);
        // printf("device_info.defaultLowOutputLatency(设备默认输出最低延迟):%lf\n", device_info->defaultLowOutputLatency);
        // printf("device_info.defaultHighOutputLatency(设备默认输出最高延迟):%lf\n", device_info->defaultHighOutputLatency);

        // PaHostApiInfo *hostapi_info = Pa_GetHostApiInfo(device_info->hostApi);
        // printf("hostapi_info->name(host api 名称):%s\n", hostapi_info->name);
    }

    // 从 PaHostApiInfo 获取 PaDeviceIndex 获取 device_info
    for (int i = 0; i < hostapi_info->deviceCount; i++) {
        // PaDeviceIndex device_i = Pa_HostApiDeviceIndexToDeviceIndex(hostapi_info->hostapi_i, i);
        //     printf("device_i:%d", device_i);
    }

    PaDeviceIndex device_def_input = Pa_GetDefaultInputDevice();
    printf("device_def_input(设备默认输入):%d\n", device_def_input);
    PaDeviceIndex device_def_output = Pa_GetDefaultOutputDevice();
    printf("device_def_output(设备默认输出):%d\n", device_def_output);

    // 打开 stream ==================================
    const PaDeviceInfo *device_info = Pa_GetDeviceInfo(device_def_output);
    printf("device_info.hostApi(设备属于的HostApiIndex):%d\n", device_info->hostApi);
    printf("device_info.name(设备名):%s\n", device_info->name);
    printf("device_info.maxInputChannels(设备最大输入通道):%d\n", device_info->maxInputChannels);
    printf("device_info.maxOutputChannels(设备最大输出通道):%d\n", device_info->maxOutputChannels);
    printf("device_info.defaultSampleRate(设备默认采样率):%lf\n", device_info->defaultSampleRate);
    printf("device_info.defaultLowOutputLatency(设备默认输出最低延迟):%lf\n", device_info->defaultLowOutputLatency);
    printf("device_info.defaultHighOutputLatency(设备默认输出最高延迟):%lf\n", device_info->defaultHighOutputLatency);

    PaStream *stream; // 所有和stream操作传入的不透明 opaque 指针
    PaStreamParameters output_params;

    int frames_per_buffer = 1024; // 缓冲区大小, 每个缓冲区包含帧数量
    int num_seconds = 5;
    int num_channels = 2;
    double sample_rate_def = device_info->defaultSampleRate;
    double suggested_latency = device_info->defaultHighOutputLatency;
    float buffer[frames_per_buffer * num_channels];
    // PaDeviceIndex 	device
    // int 	          channelCount
    // PaSampleFormat sampleFormat
    // PaTime 	      suggestedLatency
    // void * 	      hostApiSpecificStreamInfo
    // output_params.device = device_def_output;
    output_params.device = device_def_input;
    output_params.channelCount = num_channels;
    output_params.sampleFormat = paFloat32;
    // output_params.suggestedLatency = device_info->defaultLowOutputLatency;
    output_params.suggestedLatency = device_info->defaultHighOutputLatency;
    output_params.hostApiSpecificStreamInfo = NULL;

    // **PaStream 二级指针, 用于内部赋值
    // err = Pa_OpenStream(&stream, NULL, &output_params, sample_rate_def, frames_per_buffer, paClipOff, NULL, NULL);
    // err = Pa_OpenStream(&stream, &output_params, NULL, sample_rate_def, frames_per_buffer, paClipOff, NULL, NULL);
    err = Pa_OpenDefaultStream(&stream, num_channels, num_channels, paFloat32, sample_rate_def, frames_per_buffer, NULL, NULL);
    if (err != paNoError) goto error;

    const PaStreamInfo *stream_info = Pa_GetStreamInfo(stream);
    printf("stream_info.structVersion:%d\n", stream_info->structVersion);
    printf("stream_info.sampleRate:%f\n", stream_info->sampleRate);
    printf("stream_info.outputLatency:%f\n", stream_info->outputLatency);
    printf("stream_info.inputLatency:%f\n", stream_info->inputLatency);
    // 1(停止)/0/Error
    err = Pa_IsStreamStopped(stream);
    if (err < paNoError) goto error;
    printf("is stop:%d\n", err);

    err = Pa_StartStream(stream);
    if (err != paNoError) goto error;
    printf("start stream ...");

    // 1(停止)/0/Error
    err = Pa_IsStreamStopped(stream);
    if (err < paNoError) goto error;
    printf("is stop:%d\n", err);

    // err = Pa_IsStreamStopped(stream);
    // if (err < paNoError) goto error;
    // printf("is stop:%d\n", err);
    //
    // err = Pa_StopStream(stream);
    // if (err != paNoError) goto error;
    // printf("stop stream ...");
    //
    // err = Pa_IsStreamStopped(stream);
    // if (err < paNoError) goto error;
    // printf("is stop:%d\n", err);

    // 读取并播放音频数据 =======================
    for (int i = 0; i < (sample_rate_def / frames_per_buffer) * num_seconds; i++) {
        // 从输入设备读取数据
        err = Pa_ReadStream(stream, buffer, frames_per_buffer);
        if (err && err != paInputOverflowed) {
            fprintf(stderr, "PortAudio error: %s\n", Pa_GetErrorText(err));
            break;
        }
        // printf(buffer)
    }
    for (int i = 0; i < (sample_rate_def / frames_per_buffer) * num_seconds; i++) {
        // 将数据写入输出设备
        err = Pa_WriteStream(stream, buffer, frames_per_buffer);
        if (err && err != paOutputUnderflowed) {
            fprintf(stderr, "PortAudio error: %s\n", Pa_GetErrorText(err));
            break;
        }
    }

    err = Pa_StopStream(stream);
    if (err != paNoError) goto error;
    printf("stop stream ...");
error:

    printf("err:%d,%s\n", err, Pa_GetErrorText(err));
    Pa_Terminate();
    return 0;
}
