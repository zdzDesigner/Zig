-- add_rules("mode.debug", "mode.release")
add_rules("mode.debug")
-- 编译工具链
toolchain("arm-none-eabi", function()
  set_kind("standalone")
  -- set_toolset("cc", "arm-none-eabi-gcc")
  -- set_toolset("as", "arm-none-eabi-gcc")
  -- set_toolset("ld", "arm-none-eabi-gcc")
  set_toolset("cc", "clang")
  set_toolset("as", "clang")
  set_toolset("ld", "clang")
end)
-- 编译目标
target("stm32", function()
  set_kind("binary")
  set_toolchains("arm-none-eabi")

  add_files(
    "./src/**.c",
    "./sys/**.c",
    "./lib/CMSIS/system_stm32f10x.c",
    "./lib/STM32F10x_StdPeriph_Driver/src/*.c",
    "./startup_stm32f103xb.s"
  )
  add_includedirs(
    "./src",
    "./src/key",
    "./src/led",
    "./sys",
    "./sys/oledv2",
    "./sys/util",
    "./sys/sr04",
    "./sys/debug",
    "./sys/nrf24",
    "./lib/CMSIS",
    "./lib/STM32F10x_StdPeriph_Driver/inc"
  )
  -- ./prj/MDK-ARM/PRESSURE_CONTROL_PY_V1.uvprojx
  -- PY32F002Ax5,USE_FULL_LL_DRIVER,USE_HAL_DRIVER

  add_defines( -- 预编译阶段
    "STM32F10X_LD",
    "USE_STDPERIPH_DRIVER"
  )
  add_cflags( -- 编译阶段
    "-target arm-none-eabi",
    "-Og",
    "-mthumb",
    -- "-mcpu=cortex-m0",
    "-mcpu=cortex-m3",
    "-Wall -fdata-sections -ffunction-sections",
    "-g -gdwarf-2", { force = true }
  )
  add_asflags( -- 汇编阶段
    "-Og",
    "-mthumb",
    -- "-mcpu=cortex-m0",
    "-mcpu=cortex-m0plus",
    "-x assembler-with-cpp",
    "-Wall -fdata-sections -ffunction-sections",
    "-g -gdwarf-2", { force = true }
  )
  add_ldflags( -- 链接阶段
  -- "-Og",
    "-mthumb",
    -- "-mcpu=cortex-m0",
    "-mcpu=cortex-m3",
    -- "-L./",
    "-TSTM32F103C8Tx_FLASH.ld",
    "-Wl,--gc-sections",
    "-Wl,--print-memory-usage",
    "-specs=nano.specs",
    -- "-specs=nosys.specs",
    "-lc -lm -lnosys",
    -- "-lc -lm -lnosys -lrdimon -u _printf_float",
    { force = true }
  )
  -- 设置导出路径
  set_targetdir("build")
  -- 设置导出文件名
  set_filename("output.elf")
  -- 构建完成后的hock
  after_build(function(target)
    print("生成HEX 和BIN 文件")
    os.exec("arm-none-eabi-objcopy -O ihex ./build//output.elf ./build//output.hex")
    os.exec("arm-none-eabi-objcopy -O binary ./build//output.elf ./build//output.bin")
    print("生成已完成")
    print("********************储存空间占用情况*****************************")
    os.exec("arm-none-eabi-size -Ax ./build/output.elf")
    os.exec("arm-none-eabi-size -Bx ./build/output.elf")
    os.exec("arm-none-eabi-size -Bd ./build/output.elf")
    print("heap-堆、stck-栈、.data-已初始化的变量全局/静态变量，bss-未初始化的data、.text-代码和常量")
    import("core.project.task")
    task.run("debug")
  end)
  -- 运行阶段
  on_run(function()
    import("core.project.task")
    task.run("flash")
  end)
end)


task("flash", function()
  on_run(function()
    print("******************** flash *****************************")
    -- os.exec("JLinkExe -autoconnect 1 -device STM32F103C8 -if swd -speed 4000  -commandfile ./flash.jlink")
  end)
end)

task("debug", function()
  on_run(function()
    print("******************** debug *****************************")
    os.exec("openocd -f ./openocd.cfg")
  end)
end)
