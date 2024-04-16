Author = zdzDesigner

######################################
# target
######################################
TARGET = target


######################################
# building variables
######################################
# debug build?
DEBUG = 1
# optimization
OPT = -Og


#######################################
# paths
#######################################
# source path

# firmware library path
PERIFLIB_PATH = 

# Build path
BUILD_DIR = build

######################################
# source
######################################
# C sources
# C_SOURCES =  $(shell find ./ ! -name "core_cm3.c" -name '*.c')
C_SOURCES =  $(shell find ./ ! -name "core_cm3.c" ! -path "./.ccls-cache/*" -name '*.c')
 
read:
	$(C_SOURCES)
# C_SOURCES =  \
# src/main.c \
# src/led/led.c \
# src/stm32f10x_it.c \
# lib/STM32F10x_StdPeriph_Driver/src/misc.c \
# lib/STM32F10x_StdPeriph_Driver/src/stm32f10x_gpio.c \
# lib/STM32F10x_StdPeriph_Driver/src/stm32f10x_rcc.c \
# lib/STM32F10x_StdPeriph_Driver/src/stm32f10x_tim.c \
# lib/STM32F10x_StdPeriph_Driver/src/stm32f10x_usart.c \
# lib/CMSIS/system_stm32f10x.c \
# sys/delay.c \
# lib/CMSIS/core_cm3.c \


# ASM sources
ASM_SOURCES =  \
startup_stm32f103xb.s
# startup_stm32f103x_hd.s


######################################
# firmware library
######################################
PERIFLIB_SOURCES = 


#######################################
# binaries
#######################################

PREFIX = arm-none-eabi-
CC = $(PREFIX)gcc
AS = $(PREFIX)gcc -x assembler-with-cpp
CP = $(PREFIX)objcopy
AR = $(PREFIX)ar
SZ = $(PREFIX)size
HEX = $(CP) -O ihex
BIN = $(CP) -O binary -S
 
#######################################
# CFLAGS
#######################################
# cpu
CPU = -mcpu=cortex-m3

# float-abi

# mcu
MCU = $(CPU) -mthumb $(FPU) $(FLOAT-ABI)

# macros for gcc
# AS defines
AS_DEFS = 

# C defines
C_DEFS =  \
-DSTM32F10X_LD \
-DUSE_STDPERIPH_DRIVER

# DSTM32F10X_LD
# DSTM32F10X_MD

# AS includes
AS_INCLUDES = 

CUSTOM_DIRS := $(shell find ./ -maxdepth 3 -type d ! -path "./.git/*" | grep -E "^./src|^./sys")
custom = $(foreach dir,$(CUSTOM_DIRS),-I$(wildcard $(dir)) )


# C includes
C_INCLUDES = \
-Ilib/CMSIS \
-Ilib/STM32F10x_StdPeriph_Driver/inc \
$(custom)


# # C includes
# C_INCLUDES = \
# -Ilib/CMSIS \
# -Ilib/STM32F10x_StdPeriph_Driver/inc \
# -I./src \
# -I./src/led \
# -I./src/key \
# -I./sys \
# -I./sys/oledv2 \
# -I./sys/util \


# compile gcc flags
ASFLAGS = $(MCU) $(AS_DEFS) $(AS_INCLUDES) $(OPT) -Wall -fdata-sections -ffunction-sections

# CFLAGS = $(MCU) $(C_DEFS) $(C_INCLUDES) $(OPT) -Wall -fdata-sections -ffunction-sections
CFLAGS = $(MCU) $(C_DEFS) $(C_INCLUDES) $(OPT) -fdata-sections -ffunction-sections

ifeq ($(DEBUG), 1)
CFLAGS += -g -O0 -gdwarf-2
endif


# Generate dependency information
CFLAGS += -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)"


#######################################
# LDFLAGS
#######################################
# link script
# LDSCRIPT = STM32F103R8Tx_FLASH.ld
LDSCRIPT = STM32F103C8Tx_FLASH.ld


# libraries
LIBS = -lc -lm -lnosys 
LIBDIR = 
LDFLAGS = $(MCU) -specs=nano.specs -T$(LDSCRIPT) $(LIBDIR) $(LIBS) -Wl,-Map=$(BUILD_DIR)/$(TARGET).map,--cref -Wl,--gc-sections

# default action: build all
all: $(BUILD_DIR)/$(TARGET).elf $(BUILD_DIR)/$(TARGET).hex $(BUILD_DIR)/$(TARGET).bin


#######################################
# build the application
#######################################
# list of objects
OBJECTS = $(addprefix $(BUILD_DIR)/,$(notdir $(C_SOURCES:.c=.o)))
vpath %.c $(sort $(dir $(C_SOURCES)))
# list of ASM program objects
OBJECTS += $(addprefix $(BUILD_DIR)/,$(notdir $(ASM_SOURCES:.s=.o)))
vpath %.s $(sort $(dir $(ASM_SOURCES)))

$(BUILD_DIR)/%.o: %.c Makefile | $(BUILD_DIR) 
	$(CC) -c $(CFLAGS) -Wa,-a,-ad,-alms=$(BUILD_DIR)/$(notdir $(<:.c=.lst)) $< -o $@

$(BUILD_DIR)/%.o: %.s Makefile | $(BUILD_DIR)
	$(AS) -c $(CFLAGS) $< -o $@

$(BUILD_DIR)/$(TARGET).elf: $(OBJECTS) Makefile
	$(CC) $(OBJECTS) $(LDFLAGS) -o $@
	$(SZ) $@

$(BUILD_DIR)/%.hex: $(BUILD_DIR)/%.elf | $(BUILD_DIR)
	$(HEX) $< $@
	
$(BUILD_DIR)/%.bin: $(BUILD_DIR)/%.elf | $(BUILD_DIR)
	$(BIN) $< $@
	
$(BUILD_DIR):
	mkdir $@

#######################################
# clean up
#######################################
clean:
	-rm -fR $(BUILD_DIR)

down:$(BUILD_DIR)/$(TARGET).bin
	JLinkExe -autoconnect 1 -device STM32F103C8 -if swd -speed 4000  -commandfile ./download.jlink

erase:
	st-flash erase
  
#######################################
# dependencies
#######################################
-include $(shell mkdir .dep 2>/dev/null) $(wildcard .dep/*)

# *** EOF ***
