#include <stdio.h>
#include <math.h>
#include <portaudio.h>

#define SAMPLE_RATE       44100
#define FRAMES_PER_BUFFER 256
#define TABLE_SIZE        200
#define NOTE_DURATION     0.5 // 每个音符的持续时间（秒）
#define PAUSE_DURATION    0.1 // 音符之间的暂停时间（秒）

// 音符频率（Hz）
const double notes[] = {
    261.63, // C
    277.18, // C#
    293.66, // D
    311.13, // D#
    329.63, // E
    349.23, // F
    369.99, // F#
    392.00, // G
    415.30, // G#
    440.00, // A
    466.16, // A#
    493.88  // B
};

// 生日歌音符序列（简单版本）
const int melody[] = {
    0,  0,  2, 0, 5, 4,    // C C D C F E
    0,  0,  2, 0, 7, 5,    // C C D C G F
    0,  0,  0, 9, 5, 4, 2, // C C C A F E D
    10, 10, 9, 5, 7, 5,    // A# A# A F G F
    0,  0,  0, 9, 5, 4, 2, // C C C A F E D
    10, 10, 9, 5, 7, 5     // A# A# A F G F
};

typedef struct {
    int noteIndex;
    int sampleIndex;
    double frequency;
    int isPaused;
    double sampleRate;
} AudioData;

static int audioCallback(const void *inputBuffer, void *outputBuffer, unsigned long framesPerBuffer, const PaStreamCallbackTimeInfo *timeInfo, PaStreamCallbackFlags statusFlags,
                         void *userData)
{
    float *out = (float *)outputBuffer;
    AudioData *data = (AudioData *)userData;

    (void)inputBuffer;
    (void)timeInfo;
    (void)statusFlags;

    // 计算当前音符的频率
    if (!data->isPaused) {
        data->frequency = notes[melody[data->noteIndex]];
    }

    // 生成音频信号
    for (unsigned long i = 0; i < framesPerBuffer; i++) {
        if (data->isPaused) {
            *out++ = 0.0f; // 添加静默以实现暂停
        } else {
            double sample = sin(2.0 * M_PI * data->frequency * data->sampleIndex / data->sampleRate);
            *out++ = (float)sample;
            data->sampleIndex++;

            if ((double)data->sampleIndex / data->sampleRate >= NOTE_DURATION) {
                data->noteIndex++;
                data->sampleIndex = 0;
                data->isPaused = 1;
                if (data->noteIndex >= sizeof(melody) / sizeof(melody[0])) {
                    return paComplete;
                }
            }
        }
    }

    if (data->isPaused) {
        data->isPaused = 0;
        data->sampleIndex = 0;
        if ((double)data->sampleIndex / data->sampleRate >= PAUSE_DURATION) {
            data->isPaused = 0;
            data->sampleIndex = 0;
        }
    }

    return paContinue;
}

int main()
{
    PaError err;
    AudioData data = {0, 0, 0, 0, SAMPLE_RATE};

    err = Pa_Initialize();
    if (err != paNoError) {
        fprintf(stderr, "PortAudio error: %s\n", Pa_GetErrorText(err));
        return 1;
    }

    PaStream *stream;
    err = Pa_OpenDefaultStream(&stream, 0, 1, paFloat32, SAMPLE_RATE, FRAMES_PER_BUFFER, audioCallback, &data);
    if (err != paNoError) {
        fprintf(stderr, "PortAudio error: %s\n", Pa_GetErrorText(err));
        return 1;
    }

    err = Pa_StartStream(stream);
    if (err != paNoError) {
        fprintf(stderr, "PortAudio error: %s\n", Pa_GetErrorText(err));
        return 1;
    }

    printf("Playing birthday song. Press Enter to stop...\n");
    getchar();

    err = Pa_StopStream(stream);
    if (err != paNoError) {
        fprintf(stderr, "PortAudio error: %s\n", Pa_GetErrorText(err));
        return 1;
    }

    err = Pa_CloseStream(stream);
    if (err != paNoError) {
        fprintf(stderr, "PortAudio error: %s\n", Pa_GetErrorText(err));
        return 1;
    }

    Pa_Terminate();
    return 0;
}
