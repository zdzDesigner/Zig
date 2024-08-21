// run with:
// zig build && node example.mjs

import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const native = require("./zig-out/lib/example.node")

console.log(native.add(10, 22))
console.log(native.getEnv())
console.log(native.getNodeEnv())
