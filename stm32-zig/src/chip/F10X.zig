const chip = @import("chip.zig");
pub const types = chip.types;

const STM32F103 = chip.devices.STM32F103;
pub const peripherals = STM32F103.peripherals;
pub const memory = STM32F103.memory;
pub const VectorTable = STM32F103.VectorTable;
pub const properties = STM32F103.properties;
