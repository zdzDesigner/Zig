function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _regeneratorRuntime() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

  _regeneratorRuntime = function () {
    return exports;
  };

  var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }

  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
    return generator._invoke = function (innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");

        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }

        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);

          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }

          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }(innerFn, self, context), generator;
  }

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  exports.wrap = wrap;
  var ContinueSentinel = {};

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {}

  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if ("throw" !== record.type) {
        var result = record.arg,
            value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }

      reject(record.arg);
    }

    var previousPromise;

    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    };
  }

  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (undefined === method) {
      if (context.delegate = null, "throw" === context.method) {
        if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }

  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;

          return next.value = undefined, next.done = !0, next;
        };

        return next.next = next;
      }
    }

    return {
      next: doneResult
    };
  }

  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }

  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (object) {
    var keys = [];

    for (var key in object) keys.push(key);

    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }

      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;

      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
            record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      }

      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _wrapRegExp() {
  _wrapRegExp = function (re, groups) {
    return new BabelRegExp(re, void 0, groups);
  };

  var _super = RegExp.prototype,
      _groups = new WeakMap();

  function BabelRegExp(re, flags, groups) {
    var _this = new RegExp(re, flags);

    return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype);
  }

  function buildGroups(result, re) {
    var g = _groups.get(re);

    return Object.keys(g).reduce(function (groups, name) {
      var i = g[name];
      if ("number" == typeof i) groups[name] = result[i];else {
        for (var k = 0; void 0 === result[i[k]] && k + 1 < i.length;) k++;

        groups[name] = result[i[k]];
      }
      return groups;
    }, Object.create(null));
  }

  return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) {
    var result = _super.exec.call(this, str);

    return result && (result.groups = buildGroups(result, this)), result;
  }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
    if ("string" == typeof substitution) {
      var groups = _groups.get(this);

      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
        return "$" + groups[name];
      }));
    }

    if ("function" == typeof substitution) {
      var _this = this;

      return _super[Symbol.replace].call(this, str, function () {
        var args = arguments;
        return "object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args);
      });
    }

    return _super[Symbol.replace].call(this, str, substitution);
  }, _wrapRegExp.apply(this, arguments);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

const methods$1 = {};
const names = [];

function registerMethods (name, m) {
  if (Array.isArray(name)) {
    for (const _name of name) {
      registerMethods(_name, m);
    }
    return
  }

  if (typeof name === 'object') {
    for (const _name in name) {
      registerMethods(_name, name[_name]);
    }
    return
  }

  addMethodNames(Object.getOwnPropertyNames(m));
  methods$1[name] = Object.assign(methods$1[name] || {}, m);
}

function getMethodsFor (name) {
  return methods$1[name] || {}
}

function getMethodNames () {
  return [ ...new Set(names) ]
}

function addMethodNames (_names) {
  names.push(..._names);
}

// Map function
function map (array, block) {
  let i;
  const il = array.length;
  const result = [];

  for (i = 0; i < il; i++) {
    result.push(block(array[i]));
  }

  return result
}

// Filter function
function filter (array, block) {
  let i;
  const il = array.length;
  const result = [];

  for (i = 0; i < il; i++) {
    if (block(array[i])) {
      result.push(array[i]);
    }
  }

  return result
}

// Degrees to radians
function radians (d) {
  return d % 360 * Math.PI / 180
}

// Convert dash-separated-string to camelCase
function camelCase (s) {
  return s.toLowerCase().replace(/-(.)/g, function (m, g) {
    return g.toUpperCase()
  })
}

// Convert camel cased string to dash separated
function unCamelCase (s) {
  return s.replace(/([A-Z])/g, function (m, g) {
    return '-' + g.toLowerCase()
  })
}

// Capitalize first letter of a string
function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Calculate proportional width and height values when necessary
function proportionalSize (element, width, height, box) {
  if (width == null || height == null) {
    box = box || element.bbox();

    if (width == null) {
      width = box.width / box.height * height;
    } else if (height == null) {
      height = box.height / box.width * width;
    }
  }

  return {
    width: width,
    height: height
  }
}

/**
 * This function adds support for string origins.
 * It searches for an origin in o.origin o.ox and o.originX.
 * This way, origin: {x: 'center', y: 50} can be passed as well as ox: 'center', oy: 50
**/
function getOrigin (o, element) {
  const origin = o.origin;
  // First check if origin is in ox or originX
  let ox = o.ox != null
    ? o.ox
    : o.originX != null
      ? o.originX
      : 'center';
  let oy = o.oy != null
    ? o.oy
    : o.originY != null
      ? o.originY
      : 'center';

  // Then check if origin was used and overwrite in that case
  if (origin != null) {
    [ ox, oy ] = Array.isArray(origin)
      ? origin
      : typeof origin === 'object'
        ? [ origin.x, origin.y ]
        : [ origin, origin ];
  }

  // Make sure to only call bbox when actually needed
  const condX = typeof ox === 'string';
  const condY = typeof oy === 'string';
  if (condX || condY) {
    const { height, width, x, y } = element.bbox();

    // And only overwrite if string was passed for this specific axis
    if (condX) {
      ox = ox.includes('left')
        ? x
        : ox.includes('right')
          ? x + width
          : x + width / 2;
    }

    if (condY) {
      oy = oy.includes('top')
        ? y
        : oy.includes('bottom')
          ? y + height
          : y + height / 2;
    }
  }

  // Return the origin as it is if it wasn't a string
  return [ ox, oy ]
}

// Default namespaces
const svg = 'http://www.w3.org/2000/svg';
const html = 'http://www.w3.org/1999/xhtml';
const xmlns = 'http://www.w3.org/2000/xmlns/';
const xlink = 'http://www.w3.org/1999/xlink';
const svgjs = 'http://svgjs.dev/svgjs';

const globals = {
  window: typeof window === 'undefined' ? null : window,
  document: typeof document === 'undefined' ? null : document
};

class Base {
  // constructor (node/*, {extensions = []} */) {
  //   // this.tags = []
  //   //
  //   // for (let extension of extensions) {
  //   //   extension.setup.call(this, node)
  //   //   this.tags.push(extension.name)
  //   // }
  // }
}

const elements = {};
const root$2 = '___SYMBOL___ROOT___';

// Method for element creation
function create (name, ns = svg) {
  // create element
  return globals.document.createElementNS(ns, name)
}

function makeInstance (element, isHTML = false) {
  if (element instanceof Base) return element

  if (typeof element === 'object') {
    return adopter(element)
  }

  if (element == null) {
    return new elements[root$2]()
  }

  if (typeof element === 'string' && element.charAt(0) !== '<') {
    return adopter(globals.document.querySelector(element))
  }

  // Make sure, that HTML elements are created with the correct namespace
  const wrapper = isHTML ? globals.document.createElement('div') : create('svg');
  wrapper.innerHTML = element;

  // We can use firstChild here because we know,
  // that the first char is < and thus an element
  element = adopter(wrapper.firstChild);

  // make sure, that element doesnt have its wrapper attached
  wrapper.removeChild(wrapper.firstChild);
  return element
}

function nodeOrNew (name, node) {
  return (node && node.ownerDocument && node instanceof node.ownerDocument.defaultView.Node) ? node : create(name)
}

// Adopt existing svg elements
function adopt (node) {
  // check for presence of node
  if (!node) return null

  // make sure a node isn't already adopted
  if (node.instance instanceof Base) return node.instance

  if (node.nodeName === '#document-fragment') {
    return new elements.Fragment(node)
  }

  // initialize variables
  let className = capitalize(node.nodeName || 'Dom');

  // Make sure that gradients are adopted correctly
  if (className === 'LinearGradient' || className === 'RadialGradient') {
    className = 'Gradient';

  // Fallback to Dom if element is not known
  } else if (!elements[className]) {
    className = 'Dom';
  }

  return new elements[className](node)
}

let adopter = adopt;

function register$1 (element, name = element.name, asRoot = false) {
  elements[name] = element;
  if (asRoot) elements[root$2] = element;

  addMethodNames(Object.getOwnPropertyNames(element.prototype));

  return element
}

function getClass (name) {
  return elements[name]
}

// Element id sequence
let did = 1000;

// Get next named element id
function eid (name) {
  return 'Svgjs' + capitalize(name) + (did++)
}

// Deep new id assignment
function assignNewId (node) {
  // do the same for SVG child nodes as well
  for (let i = node.children.length - 1; i >= 0; i--) {
    assignNewId(node.children[i]);
  }

  if (node.id) {
    node.id = eid(node.nodeName);
    return node
  }

  return node
}

// Method for extending objects
function extend (modules, methods) {
  let key, i;

  modules = Array.isArray(modules) ? modules : [ modules ];

  for (i = modules.length - 1; i >= 0; i--) {
    for (key in methods) {
      modules[i].prototype[key] = methods[key];
    }
  }
}

function wrapWithAttrCheck (fn) {
  return function (...args) {
    const o = args[args.length - 1];

    if (o && o.constructor === Object && !(o instanceof Array)) {
      return fn.apply(this, args.slice(0, -1)).attr(o)
    } else {
      return fn.apply(this, args)
    }
  }
}

// Get all siblings, including myself
function siblings () {
  return this.parent().children()
}

// Get the current position siblings
function position$1 () {
  return this.parent().index(this)
}

// Get the next element (will return null if there is none)
function next$1 () {
  return this.siblings()[this.position() + 1]
}

// Get the next element (will return null if there is none)
function prev$1 () {
  return this.siblings()[this.position() - 1]
}

// Send given element one step forward
function forward () {
  const i = this.position();
  const p = this.parent();

  // move node one step forward
  p.add(this.remove(), i + 1);

  return this
}

// Send given element one step backward
function backward () {
  const i = this.position();
  const p = this.parent();

  p.add(this.remove(), i ? i - 1 : 0);

  return this
}

// Send given element all the way to the front
function front () {
  const p = this.parent();

  // Move node forward
  p.add(this.remove());

  return this
}

// Send given element all the way to the back
function back () {
  const p = this.parent();

  // Move node back
  p.add(this.remove(), 0);

  return this
}

// Inserts a given element before the targeted element
function before (element) {
  element = makeInstance(element);
  element.remove();

  const i = this.position();

  this.parent().add(element, i);

  return this
}

// Inserts a given element after the targeted element
function after (element) {
  element = makeInstance(element);
  element.remove();

  const i = this.position();

  this.parent().add(element, i + 1);

  return this
}

function insertBefore$1 (element) {
  element = makeInstance(element);
  element.before(this);
  return this
}

function insertAfter (element) {
  element = makeInstance(element);
  element.after(this);
  return this
}

registerMethods('Dom', {
  siblings,
  position: position$1,
  next: next$1,
  prev: prev$1,
  forward,
  backward,
  front,
  back,
  before,
  after,
  insertBefore: insertBefore$1,
  insertAfter
});

// Parse unit value
const numberAndUnit = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i;

// Parse hex value
const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

// Parse rgb value
const rgb = /rgb\((\d+),(\d+),(\d+)\)/;

// Parse reference id
const reference = /(#[a-z_][a-z0-9\-_]*)/i;

// splits a transformation chain
const transforms = /\)\s*,?\s*/;

// Whitespace
const whitespace = /\s/g;

// Test hex value
const isHex = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i;

// Test rgb value
const isRgb = /^rgb\(/;

// Test for blank string
const isBlank = /^(\s+)?$/;

// Test for numeric string
const isNumber = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;

// Test for image url
const isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i;

// split at whitespace and comma
const delimiter = /[\s,]+/;

// Test for path letter
const isPathLetter = /[MLHVCSQTAZ]/i;

// Return array of classes on the node
function classes () {
  const attr = this.attr('class');
  return attr == null ? [] : attr.trim().split(delimiter)
}

// Return true if class exists on the node, false otherwise
function hasClass (name) {
  return this.classes().indexOf(name) !== -1
}

// Add class to the node
function addClass (name) {
  if (!this.hasClass(name)) {
    const array = this.classes();
    array.push(name);
    this.attr('class', array.join(' '));
  }

  return this
}

// Remove class from the node
function removeClass (name) {
  if (this.hasClass(name)) {
    this.attr('class', this.classes().filter(function (c) {
      return c !== name
    }).join(' '));
  }

  return this
}

// Toggle the presence of a class on the node
function toggleClass (name) {
  return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
}

registerMethods('Dom', {
  classes, hasClass, addClass, removeClass, toggleClass
});

// Dynamic style generator
function css (style, val) {
  const ret = {};
  if (arguments.length === 0) {
    // get full style as object
    this.node.style.cssText.split(/\s*;\s*/)
      .filter(function (el) {
        return !!el.length
      })
      .forEach(function (el) {
        const t = el.split(/\s*:\s*/);
        ret[t[0]] = t[1];
      });
    return ret
  }

  if (arguments.length < 2) {
    // get style properties as array
    if (Array.isArray(style)) {
      for (const name of style) {
        const cased = camelCase(name);
        ret[name] = this.node.style[cased];
      }
      return ret
    }

    // get style for property
    if (typeof style === 'string') {
      return this.node.style[camelCase(style)]
    }

    // set styles in object
    if (typeof style === 'object') {
      for (const name in style) {
        // set empty string if null/undefined/'' was given
        this.node.style[camelCase(name)]
          = (style[name] == null || isBlank.test(style[name])) ? '' : style[name];
      }
    }
  }

  // set style for property
  if (arguments.length === 2) {
    this.node.style[camelCase(style)]
      = (val == null || isBlank.test(val)) ? '' : val;
  }

  return this
}

// Show element
function show () {
  return this.css('display', '')
}

// Hide element
function hide () {
  return this.css('display', 'none')
}

// Is element visible?
function visible () {
  return this.css('display') !== 'none'
}

registerMethods('Dom', {
  css, show, hide, visible
});

// Store data values on svg nodes
function data (a, v, r) {
  if (a == null) {
    // get an object of attributes
    return this.data(map(filter(this.node.attributes, (el) => el.nodeName.indexOf('data-') === 0), (el) => el.nodeName.slice(5)))
  } else if (a instanceof Array) {
    const data = {};
    for (const key of a) {
      data[key] = this.data(key);
    }
    return data
  } else if (typeof a === 'object') {
    for (v in a) {
      this.data(v, a[v]);
    }
  } else if (arguments.length < 2) {
    try {
      return JSON.parse(this.attr('data-' + a))
    } catch (e) {
      return this.attr('data-' + a)
    }
  } else {
    this.attr('data-' + a,
      v === null
        ? null
        : r === true || typeof v === 'string' || typeof v === 'number'
          ? v
          : JSON.stringify(v)
    );
  }

  return this
}

registerMethods('Dom', { data });

// Remember arbitrary data
function remember (k, v) {
  // remember every item in an object individually
  if (typeof arguments[0] === 'object') {
    for (const key in k) {
      this.remember(key, k[key]);
    }
  } else if (arguments.length === 1) {
    // retrieve memory
    return this.memory()[k]
  } else {
    // store memory
    this.memory()[k] = v;
  }

  return this
}

// Erase a given memory
function forget () {
  if (arguments.length === 0) {
    this._memory = {};
  } else {
    for (let i = arguments.length - 1; i >= 0; i--) {
      delete this.memory()[arguments[i]];
    }
  }
  return this
}

// This triggers creation of a new hidden class which is not performant
// However, this function is not rarely used so it will not happen frequently
// Return local memory object
function memory () {
  return (this._memory = this._memory || {})
}

registerMethods('Dom', { remember, forget, memory });

function sixDigitHex (hex) {
  return hex.length === 4
    ? [ '#',
      hex.substring(1, 2), hex.substring(1, 2),
      hex.substring(2, 3), hex.substring(2, 3),
      hex.substring(3, 4), hex.substring(3, 4)
    ].join('')
    : hex
}

function componentHex (component) {
  const integer = Math.round(component);
  const bounded = Math.max(0, Math.min(255, integer));
  const hex = bounded.toString(16);
  return hex.length === 1 ? '0' + hex : hex
}

function is (object, space) {
  for (let i = space.length; i--;) {
    if (object[space[i]] == null) {
      return false
    }
  }
  return true
}

function getParameters (a, b) {
  const params = is(a, 'rgb')
    ? { _a: a.r, _b: a.g, _c: a.b, _d: 0, space: 'rgb' }
    : is(a, 'xyz')
      ? { _a: a.x, _b: a.y, _c: a.z, _d: 0, space: 'xyz' }
      : is(a, 'hsl')
        ? { _a: a.h, _b: a.s, _c: a.l, _d: 0, space: 'hsl' }
        : is(a, 'lab')
          ? { _a: a.l, _b: a.a, _c: a.b, _d: 0, space: 'lab' }
          : is(a, 'lch')
            ? { _a: a.l, _b: a.c, _c: a.h, _d: 0, space: 'lch' }
            : is(a, 'cmyk')
              ? { _a: a.c, _b: a.m, _c: a.y, _d: a.k, space: 'cmyk' }
              : { _a: 0, _b: 0, _c: 0, space: 'rgb' };

  params.space = b || params.space;
  return params
}

function cieSpace (space) {
  if (space === 'lab' || space === 'xyz' || space === 'lch') {
    return true
  } else {
    return false
  }
}

function hueToRgb (p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

class Color$1 {
  constructor (...inputs) {
    this.init(...inputs);
  }

  // Test if given value is a color
  static isColor (color) {
    return color && (
      color instanceof Color$1
      || this.isRgb(color)
      || this.test(color)
    )
  }

  // Test if given value is an rgb object
  static isRgb (color) {
    return color && typeof color.r === 'number'
      && typeof color.g === 'number'
      && typeof color.b === 'number'
  }

  /*
  Generating random colors
  */
  static random (mode = 'vibrant', t, u) {

    // Get the math modules
    const { random, round, sin, PI: pi } = Math;

    // Run the correct generator
    if (mode === 'vibrant') {

      const l = (81 - 57) * random() + 57;
      const c = (83 - 45) * random() + 45;
      const h = 360 * random();
      const color = new Color$1(l, c, h, 'lch');
      return color

    } else if (mode === 'sine') {

      t = t == null ? random() : t;
      const r = round(80 * sin(2 * pi * t / 0.5 + 0.01) + 150);
      const g = round(50 * sin(2 * pi * t / 0.5 + 4.6) + 200);
      const b = round(100 * sin(2 * pi * t / 0.5 + 2.3) + 150);
      const color = new Color$1(r, g, b);
      return color

    } else if (mode === 'pastel') {

      const l = (94 - 86) * random() + 86;
      const c = (26 - 9) * random() + 9;
      const h = 360 * random();
      const color = new Color$1(l, c, h, 'lch');
      return color

    } else if (mode === 'dark') {

      const l = 10 + 10 * random();
      const c = (125 - 75) * random() + 86;
      const h = 360 * random();
      const color = new Color$1(l, c, h, 'lch');
      return color

    } else if (mode === 'rgb') {

      const r = 255 * random();
      const g = 255 * random();
      const b = 255 * random();
      const color = new Color$1(r, g, b);
      return color

    } else if (mode === 'lab') {

      const l = 100 * random();
      const a = 256 * random() - 128;
      const b = 256 * random() - 128;
      const color = new Color$1(l, a, b, 'lab');
      return color

    } else if (mode === 'grey') {

      const grey = 255 * random();
      const color = new Color$1(grey, grey, grey);
      return color

    } else {

      throw new Error('Unsupported random color mode')

    }
  }

  // Test if given value is a color string
  static test (color) {
    return (typeof color === 'string')
      && (isHex.test(color) || isRgb.test(color))
  }

  cmyk () {

    // Get the rgb values for the current color
    const { _a, _b, _c } = this.rgb();
    const [ r, g, b ] = [ _a, _b, _c ].map(v => v / 255);

    // Get the cmyk values in an unbounded format
    const k = Math.min(1 - r, 1 - g, 1 - b);

    if (k === 1) {
      // Catch the black case
      return new Color$1(0, 0, 0, 1, 'cmyk')
    }

    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);

    // Construct the new color
    const color = new Color$1(c, m, y, k, 'cmyk');
    return color
  }

  hsl () {

    // Get the rgb values
    const { _a, _b, _c } = this.rgb();
    const [ r, g, b ] = [ _a, _b, _c ].map(v => v / 255);

    // Find the maximum and minimum values to get the lightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    // If the r, g, v values are identical then we are grey
    const isGrey = max === min;

    // Calculate the hue and saturation
    const delta = max - min;
    const s = isGrey
      ? 0
      : l > 0.5
        ? delta / (2 - max - min)
        : delta / (max + min);
    const h = isGrey
      ? 0
      : max === r
        ? ((g - b) / delta + (g < b ? 6 : 0)) / 6
        : max === g
          ? ((b - r) / delta + 2) / 6
          : max === b
            ? ((r - g) / delta + 4) / 6
            : 0;

    // Construct and return the new color
    const color = new Color$1(360 * h, 100 * s, 100 * l, 'hsl');
    return color
  }

  init (a = 0, b = 0, c = 0, d = 0, space = 'rgb') {
    // This catches the case when a falsy value is passed like ''
    a = !a ? 0 : a;

    // Reset all values in case the init function is rerun with new color space
    if (this.space) {
      for (const component in this.space) {
        delete this[this.space[component]];
      }
    }

    if (typeof a === 'number') {
      // Allow for the case that we don't need d...
      space = typeof d === 'string' ? d : space;
      d = typeof d === 'string' ? 0 : d;

      // Assign the values straight to the color
      Object.assign(this, { _a: a, _b: b, _c: c, _d: d, space });
    // If the user gave us an array, make the color from it
    } else if (a instanceof Array) {
      this.space = b || (typeof a[3] === 'string' ? a[3] : a[4]) || 'rgb';
      Object.assign(this, { _a: a[0], _b: a[1], _c: a[2], _d: a[3] || 0 });
    } else if (a instanceof Object) {
      // Set the object up and assign its values directly
      const values = getParameters(a, b);
      Object.assign(this, values);
    } else if (typeof a === 'string') {
      if (isRgb.test(a)) {
        const noWhitespace = a.replace(whitespace, '');
        const [ _a, _b, _c ] = rgb.exec(noWhitespace)
          .slice(1, 4).map(v => parseInt(v));
        Object.assign(this, { _a, _b, _c, _d: 0, space: 'rgb' });
      } else if (isHex.test(a)) {
        const hexParse = v => parseInt(v, 16);
        const [ , _a, _b, _c ] = hex.exec(sixDigitHex(a)).map(hexParse);
        Object.assign(this, { _a, _b, _c, _d: 0, space: 'rgb' });
      } else throw Error('Unsupported string format, can\'t construct Color')
    }

    // Now add the components as a convenience
    const { _a, _b, _c, _d } = this;
    const components = this.space === 'rgb'
      ? { r: _a, g: _b, b: _c }
      : this.space === 'xyz'
        ? { x: _a, y: _b, z: _c }
        : this.space === 'hsl'
          ? { h: _a, s: _b, l: _c }
          : this.space === 'lab'
            ? { l: _a, a: _b, b: _c }
            : this.space === 'lch'
              ? { l: _a, c: _b, h: _c }
              : this.space === 'cmyk'
                ? { c: _a, m: _b, y: _c, k: _d }
                : {};
    Object.assign(this, components);
  }

  lab () {
    // Get the xyz color
    const { x, y, z } = this.xyz();

    // Get the lab components
    const l = (116 * y) - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);

    // Construct and return a new color
    const color = new Color$1(l, a, b, 'lab');
    return color
  }

  lch () {

    // Get the lab color directly
    const { l, a, b } = this.lab();

    // Get the chromaticity and the hue using polar coordinates
    const c = Math.sqrt(a ** 2 + b ** 2);
    let h = 180 * Math.atan2(b, a) / Math.PI;
    if (h < 0) {
      h *= -1;
      h = 360 - h;
    }

    // Make a new color and return it
    const color = new Color$1(l, c, h, 'lch');
    return color
  }
  /*
  Conversion Methods
  */

  rgb () {
    if (this.space === 'rgb') {
      return this
    } else if (cieSpace(this.space)) {
      // Convert to the xyz color space
      let { x, y, z } = this;
      if (this.space === 'lab' || this.space === 'lch') {
        // Get the values in the lab space
        let { l, a, b } = this;
        if (this.space === 'lch') {
          const { c, h } = this;
          const dToR = Math.PI / 180;
          a = c * Math.cos(dToR * h);
          b = c * Math.sin(dToR * h);
        }

        // Undo the nonlinear function
        const yL = (l + 16) / 116;
        const xL = a / 500 + yL;
        const zL = yL - b / 200;

        // Get the xyz values
        const ct = 16 / 116;
        const mx = 0.008856;
        const nm = 7.787;
        x = 0.95047 * ((xL ** 3 > mx) ? xL ** 3 : (xL - ct) / nm);
        y = 1.00000 * ((yL ** 3 > mx) ? yL ** 3 : (yL - ct) / nm);
        z = 1.08883 * ((zL ** 3 > mx) ? zL ** 3 : (zL - ct) / nm);
      }

      // Convert xyz to unbounded rgb values
      const rU = x * 3.2406 + y * -1.5372 + z * -0.4986;
      const gU = x * -0.9689 + y * 1.8758 + z * 0.0415;
      const bU = x * 0.0557 + y * -0.2040 + z * 1.0570;

      // Convert the values to true rgb values
      const pow = Math.pow;
      const bd = 0.0031308;
      const r = (rU > bd) ? (1.055 * pow(rU, 1 / 2.4) - 0.055) : 12.92 * rU;
      const g = (gU > bd) ? (1.055 * pow(gU, 1 / 2.4) - 0.055) : 12.92 * gU;
      const b = (bU > bd) ? (1.055 * pow(bU, 1 / 2.4) - 0.055) : 12.92 * bU;

      // Make and return the color
      const color = new Color$1(255 * r, 255 * g, 255 * b);
      return color
    } else if (this.space === 'hsl') {
      // https://bgrins.github.io/TinyColor/docs/tinycolor.html
      // Get the current hsl values
      let { h, s, l } = this;
      h /= 360;
      s /= 100;
      l /= 100;

      // If we are grey, then just make the color directly
      if (s === 0) {
        l *= 255;
        const color = new Color$1(l, l, l);
        return color
      }

      // TODO I have no idea what this does :D If you figure it out, tell me!
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      // Get the rgb values
      const r = 255 * hueToRgb(p, q, h + 1 / 3);
      const g = 255 * hueToRgb(p, q, h);
      const b = 255 * hueToRgb(p, q, h - 1 / 3);

      // Make a new color
      const color = new Color$1(r, g, b);
      return color
    } else if (this.space === 'cmyk') {
      // https://gist.github.com/felipesabino/5066336
      // Get the normalised cmyk values
      const { c, m, y, k } = this;

      // Get the rgb values
      const r = 255 * (1 - Math.min(1, c * (1 - k) + k));
      const g = 255 * (1 - Math.min(1, m * (1 - k) + k));
      const b = 255 * (1 - Math.min(1, y * (1 - k) + k));

      // Form the color and return it
      const color = new Color$1(r, g, b);
      return color
    } else {
      return this
    }
  }

  toArray () {
    const { _a, _b, _c, _d, space } = this;
    return [ _a, _b, _c, _d, space ]
  }

  toHex () {
    const [ r, g, b ] = this._clamped().map(componentHex);
    return `#${r}${g}${b}`
  }

  toRgb () {
    const [ rV, gV, bV ] = this._clamped();
    const string = `rgb(${rV},${gV},${bV})`;
    return string
  }

  toString () {
    return this.toHex()
  }

  xyz () {

    // Normalise the red, green and blue values
    const { _a: r255, _b: g255, _c: b255 } = this.rgb();
    const [ r, g, b ] = [ r255, g255, b255 ].map(v => v / 255);

    // Convert to the lab rgb space
    const rL = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    const gL = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    const bL = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // Convert to the xyz color space without bounding the values
    const xU = (rL * 0.4124 + gL * 0.3576 + bL * 0.1805) / 0.95047;
    const yU = (rL * 0.2126 + gL * 0.7152 + bL * 0.0722) / 1.00000;
    const zU = (rL * 0.0193 + gL * 0.1192 + bL * 0.9505) / 1.08883;

    // Get the proper xyz values by applying the bounding
    const x = (xU > 0.008856) ? Math.pow(xU, 1 / 3) : (7.787 * xU) + 16 / 116;
    const y = (yU > 0.008856) ? Math.pow(yU, 1 / 3) : (7.787 * yU) + 16 / 116;
    const z = (zU > 0.008856) ? Math.pow(zU, 1 / 3) : (7.787 * zU) + 16 / 116;

    // Make and return the color
    const color = new Color$1(x, y, z, 'xyz');
    return color
  }

  /*
  Input and Output methods
  */

  _clamped () {
    const { _a, _b, _c } = this.rgb();
    const { max, min, round } = Math;
    const format = v => max(0, min(round(v), 255));
    return [ _a, _b, _c ].map(format)
  }

  /*
  Constructing colors
  */

}

class Point {
  // Initialize
  constructor (...args) {
    this.init(...args);
  }

  // Clone point
  clone () {
    return new Point(this)
  }

  init (x, y) {
    const base = { x: 0, y: 0 };

    // ensure source as object
    const source = Array.isArray(x)
      ? { x: x[0], y: x[1] }
      : typeof x === 'object'
        ? { x: x.x, y: x.y }
        : { x: x, y: y };

    // merge source
    this.x = source.x == null ? base.x : source.x;
    this.y = source.y == null ? base.y : source.y;

    return this
  }

  toArray () {
    return [ this.x, this.y ]
  }

  transform (m) {
    return this.clone().transformO(m)
  }

  // Transform point with matrix
  transformO (m) {
    if (!Matrix.isMatrixLike(m)) {
      m = new Matrix(m);
    }

    const { x, y } = this;

    // Perform the matrix multiplication
    this.x = m.a * x + m.c * y + m.e;
    this.y = m.b * x + m.d * y + m.f;

    return this
  }

}

function point (x, y) {
  return new Point(x, y).transform(this.screenCTM().inverse())
}

function closeEnough (a, b, threshold) {
  return Math.abs(b - a) < (threshold || 1e-6)
}

class Matrix {
  constructor (...args) {
    this.init(...args);
  }

  static formatTransforms (o) {
    // Get all of the parameters required to form the matrix
    const flipBoth = o.flip === 'both' || o.flip === true;
    const flipX = o.flip && (flipBoth || o.flip === 'x') ? -1 : 1;
    const flipY = o.flip && (flipBoth || o.flip === 'y') ? -1 : 1;
    const skewX = o.skew && o.skew.length
      ? o.skew[0]
      : isFinite(o.skew)
        ? o.skew
        : isFinite(o.skewX)
          ? o.skewX
          : 0;
    const skewY = o.skew && o.skew.length
      ? o.skew[1]
      : isFinite(o.skew)
        ? o.skew
        : isFinite(o.skewY)
          ? o.skewY
          : 0;
    const scaleX = o.scale && o.scale.length
      ? o.scale[0] * flipX
      : isFinite(o.scale)
        ? o.scale * flipX
        : isFinite(o.scaleX)
          ? o.scaleX * flipX
          : flipX;
    const scaleY = o.scale && o.scale.length
      ? o.scale[1] * flipY
      : isFinite(o.scale)
        ? o.scale * flipY
        : isFinite(o.scaleY)
          ? o.scaleY * flipY
          : flipY;
    const shear = o.shear || 0;
    const theta = o.rotate || o.theta || 0;
    const origin = new Point(o.origin || o.around || o.ox || o.originX, o.oy || o.originY);
    const ox = origin.x;
    const oy = origin.y;
    // We need Point to be invalid if nothing was passed because we cannot default to 0 here. Thats why NaN
    const position = new Point(o.position || o.px || o.positionX || NaN, o.py || o.positionY || NaN);
    const px = position.x;
    const py = position.y;
    const translate = new Point(o.translate || o.tx || o.translateX, o.ty || o.translateY);
    const tx = translate.x;
    const ty = translate.y;
    const relative = new Point(o.relative || o.rx || o.relativeX, o.ry || o.relativeY);
    const rx = relative.x;
    const ry = relative.y;

    // Populate all of the values
    return {
      scaleX, scaleY, skewX, skewY, shear, theta, rx, ry, tx, ty, ox, oy, px, py
    }
  }

  static fromArray (a) {
    return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
  }

  static isMatrixLike (o) {
    return (
      o.a != null
      || o.b != null
      || o.c != null
      || o.d != null
      || o.e != null
      || o.f != null
    )
  }

  // left matrix, right matrix, target matrix which is overwritten
  static matrixMultiply (l, r, o) {
    // Work out the product directly
    const a = l.a * r.a + l.c * r.b;
    const b = l.b * r.a + l.d * r.b;
    const c = l.a * r.c + l.c * r.d;
    const d = l.b * r.c + l.d * r.d;
    const e = l.e + l.a * r.e + l.c * r.f;
    const f = l.f + l.b * r.e + l.d * r.f;

    // make sure to use local variables because l/r and o could be the same
    o.a = a;
    o.b = b;
    o.c = c;
    o.d = d;
    o.e = e;
    o.f = f;

    return o
  }

  around (cx, cy, matrix) {
    return this.clone().aroundO(cx, cy, matrix)
  }

  // Transform around a center point
  aroundO (cx, cy, matrix) {
    const dx = cx || 0;
    const dy = cy || 0;
    return this.translateO(-dx, -dy).lmultiplyO(matrix).translateO(dx, dy)
  }

  // Clones this matrix
  clone () {
    return new Matrix(this)
  }

  // Decomposes this matrix into its affine parameters
  decompose (cx = 0, cy = 0) {
    // Get the parameters from the matrix
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;

    // Figure out if the winding direction is clockwise or counterclockwise
    const determinant = a * d - b * c;
    const ccw = determinant > 0 ? 1 : -1;

    // Since we only shear in x, we can use the x basis to get the x scale
    // and the rotation of the resulting matrix
    const sx = ccw * Math.sqrt(a * a + b * b);
    const thetaRad = Math.atan2(ccw * b, ccw * a);
    const theta = 180 / Math.PI * thetaRad;
    const ct = Math.cos(thetaRad);
    const st = Math.sin(thetaRad);

    // We can then solve the y basis vector simultaneously to get the other
    // two affine parameters directly from these parameters
    const lam = (a * c + b * d) / determinant;
    const sy = ((c * sx) / (lam * a - b)) || ((d * sx) / (lam * b + a));

    // Use the translations
    const tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy);
    const ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy);

    // Construct the decomposition and return it
    return {
      // Return the affine parameters
      scaleX: sx,
      scaleY: sy,
      shear: lam,
      rotate: theta,
      translateX: tx,
      translateY: ty,
      originX: cx,
      originY: cy,

      // Return the matrix parameters
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    }
  }

  // Check if two matrices are equal
  equals (other) {
    if (other === this) return true
    const comp = new Matrix(other);
    return closeEnough(this.a, comp.a) && closeEnough(this.b, comp.b)
      && closeEnough(this.c, comp.c) && closeEnough(this.d, comp.d)
      && closeEnough(this.e, comp.e) && closeEnough(this.f, comp.f)
  }

  // Flip matrix on x or y, at a given offset
  flip (axis, around) {
    return this.clone().flipO(axis, around)
  }

  flipO (axis, around) {
    return axis === 'x'
      ? this.scaleO(-1, 1, around, 0)
      : axis === 'y'
        ? this.scaleO(1, -1, 0, around)
        : this.scaleO(-1, -1, axis, around || axis) // Define an x, y flip point
  }

  // Initialize
  init (source) {
    const base = Matrix.fromArray([ 1, 0, 0, 1, 0, 0 ]);

    // ensure source as object
    source = source instanceof Element
      ? source.matrixify()
      : typeof source === 'string'
        ? Matrix.fromArray(source.split(delimiter).map(parseFloat))
        : Array.isArray(source)
          ? Matrix.fromArray(source)
          : (typeof source === 'object' && Matrix.isMatrixLike(source))
            ? source
            : (typeof source === 'object')
              ? new Matrix().transform(source)
              : arguments.length === 6
                ? Matrix.fromArray([].slice.call(arguments))
                : base;

    // Merge the source matrix with the base matrix
    this.a = source.a != null ? source.a : base.a;
    this.b = source.b != null ? source.b : base.b;
    this.c = source.c != null ? source.c : base.c;
    this.d = source.d != null ? source.d : base.d;
    this.e = source.e != null ? source.e : base.e;
    this.f = source.f != null ? source.f : base.f;

    return this
  }

  inverse () {
    return this.clone().inverseO()
  }

  // Inverses matrix
  inverseO () {
    // Get the current parameters out of the matrix
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;

    // Invert the 2x2 matrix in the top left
    const det = a * d - b * c;
    if (!det) throw new Error('Cannot invert ' + this)

    // Calculate the top 2x2 matrix
    const na = d / det;
    const nb = -b / det;
    const nc = -c / det;
    const nd = a / det;

    // Apply the inverted matrix to the top right
    const ne = -(na * e + nc * f);
    const nf = -(nb * e + nd * f);

    // Construct the inverted matrix
    this.a = na;
    this.b = nb;
    this.c = nc;
    this.d = nd;
    this.e = ne;
    this.f = nf;

    return this
  }

  lmultiply (matrix) {
    return this.clone().lmultiplyO(matrix)
  }

  lmultiplyO (matrix) {
    const r = this;
    const l = matrix instanceof Matrix
      ? matrix
      : new Matrix(matrix);

    return Matrix.matrixMultiply(l, r, this)
  }

  // Left multiplies by the given matrix
  multiply (matrix) {
    return this.clone().multiplyO(matrix)
  }

  multiplyO (matrix) {
    // Get the matrices
    const l = this;
    const r = matrix instanceof Matrix
      ? matrix
      : new Matrix(matrix);

    return Matrix.matrixMultiply(l, r, this)
  }

  // Rotate matrix
  rotate (r, cx, cy) {
    return this.clone().rotateO(r, cx, cy)
  }

  rotateO (r, cx = 0, cy = 0) {
    // Convert degrees to radians
    r = radians(r);

    const cos = Math.cos(r);
    const sin = Math.sin(r);

    const { a, b, c, d, e, f } = this;

    this.a = a * cos - b * sin;
    this.b = b * cos + a * sin;
    this.c = c * cos - d * sin;
    this.d = d * cos + c * sin;
    this.e = e * cos - f * sin + cy * sin - cx * cos + cx;
    this.f = f * cos + e * sin - cx * sin - cy * cos + cy;

    return this
  }

  // Scale matrix
  scale (x, y, cx, cy) {
    return this.clone().scaleO(...arguments)
  }

  scaleO (x, y = x, cx = 0, cy = 0) {
    // Support uniform scaling
    if (arguments.length === 3) {
      cy = cx;
      cx = y;
      y = x;
    }

    const { a, b, c, d, e, f } = this;

    this.a = a * x;
    this.b = b * y;
    this.c = c * x;
    this.d = d * y;
    this.e = e * x - cx * x + cx;
    this.f = f * y - cy * y + cy;

    return this
  }

  // Shear matrix
  shear (a, cx, cy) {
    return this.clone().shearO(a, cx, cy)
  }

  shearO (lx, cx = 0, cy = 0) {
    const { a, b, c, d, e, f } = this;

    this.a = a + b * lx;
    this.c = c + d * lx;
    this.e = e + f * lx - cy * lx;

    return this
  }

  // Skew Matrix
  skew (x, y, cx, cy) {
    return this.clone().skewO(...arguments)
  }

  skewO (x, y = x, cx = 0, cy = 0) {
    // support uniformal skew
    if (arguments.length === 3) {
      cy = cx;
      cx = y;
      y = x;
    }

    // Convert degrees to radians
    x = radians(x);
    y = radians(y);

    const lx = Math.tan(x);
    const ly = Math.tan(y);

    const { a, b, c, d, e, f } = this;

    this.a = a + b * lx;
    this.b = b + a * ly;
    this.c = c + d * lx;
    this.d = d + c * ly;
    this.e = e + f * lx - cy * lx;
    this.f = f + e * ly - cx * ly;

    return this
  }

  // SkewX
  skewX (x, cx, cy) {
    return this.skew(x, 0, cx, cy)
  }

  // SkewY
  skewY (y, cx, cy) {
    return this.skew(0, y, cx, cy)
  }

  toArray () {
    return [ this.a, this.b, this.c, this.d, this.e, this.f ]
  }

  // Convert matrix to string
  toString () {
    return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
  }

  // Transform a matrix into another matrix by manipulating the space
  transform (o) {
    // Check if o is a matrix and then left multiply it directly
    if (Matrix.isMatrixLike(o)) {
      const matrix = new Matrix(o);
      return matrix.multiplyO(this)
    }

    // Get the proposed transformations and the current transformations
    const t = Matrix.formatTransforms(o);
    const current = this;
    const { x: ox, y: oy } = new Point(t.ox, t.oy).transform(current);

    // Construct the resulting matrix
    const transformer = new Matrix()
      .translateO(t.rx, t.ry)
      .lmultiplyO(current)
      .translateO(-ox, -oy)
      .scaleO(t.scaleX, t.scaleY)
      .skewO(t.skewX, t.skewY)
      .shearO(t.shear)
      .rotateO(t.theta)
      .translateO(ox, oy);

    // If we want the origin at a particular place, we force it there
    if (isFinite(t.px) || isFinite(t.py)) {
      const origin = new Point(ox, oy).transform(transformer);
      // TODO: Replace t.px with isFinite(t.px)
      // Doesnt work because t.px is also 0 if it wasnt passed
      const dx = isFinite(t.px) ? t.px - origin.x : 0;
      const dy = isFinite(t.py) ? t.py - origin.y : 0;
      transformer.translateO(dx, dy);
    }

    // Translate now after positioning
    transformer.translateO(t.tx, t.ty);
    return transformer
  }

  // Translate matrix
  translate (x, y) {
    return this.clone().translateO(x, y)
  }

  translateO (x, y) {
    this.e += x || 0;
    this.f += y || 0;
    return this
  }

  valueOf () {
    return {
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    }
  }

}

function ctm () {
  return new Matrix(this.node.getCTM())
}

function screenCTM () {
  /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
     This is needed because FF does not return the transformation matrix
     for the inner coordinate system when getScreenCTM() is called on nested svgs.
     However all other Browsers do that */
  if (typeof this.isRoot === 'function' && !this.isRoot()) {
    const rect = this.rect(1, 1);
    const m = rect.node.getScreenCTM();
    rect.remove();
    return new Matrix(m)
  }
  return new Matrix(this.node.getScreenCTM())
}

register$1(Matrix, 'Matrix');

function parser () {
  // Reuse cached element if possible
  if (!parser.nodes) {
    const svg = makeInstance().size(2, 0);
    svg.node.style.cssText = [
      'opacity: 0',
      'position: absolute',
      'left: -100%',
      'top: -100%',
      'overflow: hidden'
    ].join(';');

    svg.attr('focusable', 'false');
    svg.attr('aria-hidden', 'true');

    const path = svg.path().node;

    parser.nodes = { svg, path };
  }

  if (!parser.nodes.svg.node.parentNode) {
    const b = globals.document.body || globals.document.documentElement;
    parser.nodes.svg.addTo(b);
  }

  return parser.nodes
}

function isNulledBox (box) {
  return !box.width && !box.height && !box.x && !box.y
}

function domContains (node) {
  return node === globals.document
    || (globals.document.documentElement.contains || function (node) {
      // This is IE - it does not support contains() for top-level SVGs
      while (node.parentNode) {
        node = node.parentNode;
      }
      return node === globals.document
    }).call(globals.document.documentElement, node)
}

class Box {
  constructor (...args) {
    this.init(...args);
  }

  addOffset () {
    // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
    this.x += globals.window.pageXOffset;
    this.y += globals.window.pageYOffset;
    return new Box(this)
  }

  init (source) {
    const base = [ 0, 0, 0, 0 ];
    source = typeof source === 'string'
      ? source.split(delimiter).map(parseFloat)
      : Array.isArray(source)
        ? source
        : typeof source === 'object'
          ? [ source.left != null
            ? source.left
            : source.x, source.top != null ? source.top : source.y, source.width, source.height ]
          : arguments.length === 4
            ? [].slice.call(arguments)
            : base;

    this.x = source[0] || 0;
    this.y = source[1] || 0;
    this.width = this.w = source[2] || 0;
    this.height = this.h = source[3] || 0;

    // Add more bounding box properties
    this.x2 = this.x + this.w;
    this.y2 = this.y + this.h;
    this.cx = this.x + this.w / 2;
    this.cy = this.y + this.h / 2;

    return this
  }

  isNulled () {
    return isNulledBox(this)
  }

  // Merge rect box with another, return a new instance
  merge (box) {
    const x = Math.min(this.x, box.x);
    const y = Math.min(this.y, box.y);
    const width = Math.max(this.x + this.width, box.x + box.width) - x;
    const height = Math.max(this.y + this.height, box.y + box.height) - y;

    return new Box(x, y, width, height)
  }

  toArray () {
    return [ this.x, this.y, this.width, this.height ]
  }

  toString () {
    return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
  }

  transform (m) {
    if (!(m instanceof Matrix)) {
      m = new Matrix(m);
    }

    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    const pts = [
      new Point(this.x, this.y),
      new Point(this.x2, this.y),
      new Point(this.x, this.y2),
      new Point(this.x2, this.y2)
    ];

    pts.forEach(function (p) {
      p = p.transform(m);
      xMin = Math.min(xMin, p.x);
      xMax = Math.max(xMax, p.x);
      yMin = Math.min(yMin, p.y);
      yMax = Math.max(yMax, p.y);
    });

    return new Box(
      xMin, yMin,
      xMax - xMin,
      yMax - yMin
    )
  }

}

function getBox (el, getBBoxFn, retry) {
  let box;

  try {
    // Try to get the box with the provided function
    box = getBBoxFn(el.node);

    // If the box is worthless and not even in the dom, retry
    // by throwing an error here...
    if (isNulledBox(box) && !domContains(el.node)) {
      throw new Error('Element not in the dom')
    }
  } catch (e) {
    // ... and calling the retry handler here
    box = retry(el);
  }

  return box
}

function bbox () {
  // Function to get bbox is getBBox()
  const getBBox = (node) => node.getBBox();

  // Take all measures so that a stupid browser renders the element
  // so we can get the bbox from it when we try again
  const retry = (el) => {
    try {
      const clone = el.clone().addTo(parser().svg).show();
      const box = clone.node.getBBox();
      clone.remove();
      return box
    } catch (e) {
      // We give up...
      throw new Error(`Getting bbox of element "${el.node.nodeName}" is not possible: ${e.toString()}`)
    }
  };

  const box = getBox(this, getBBox, retry);
  const bbox = new Box(box);

  return bbox
}

function rbox (el) {
  const getRBox = (node) => node.getBoundingClientRect();
  const retry = (el) => {
    // There is no point in trying tricks here because if we insert the element into the dom ourselves
    // it obviously will be at the wrong position
    throw new Error(`Getting rbox of element "${el.node.nodeName}" is not possible`)
  };

  const box = getBox(this, getRBox, retry);
  const rbox = new Box(box);

  // If an element was passed, we want the bbox in the coordinate system of that element
  if (el) {
    return rbox.transform(el.screenCTM().inverseO())
  }

  // Else we want it in absolute screen coordinates
  // Therefore we need to add the scrollOffset
  return rbox.addOffset()
}

// Checks whether the given point is inside the bounding box
function inside (x, y) {
  const box = this.bbox();

  return x > box.x
    && y > box.y
    && x < box.x + box.width
    && y < box.y + box.height
}

registerMethods({
  viewbox: {
    viewbox (x, y, width, height) {
      // act as getter
      if (x == null) return new Box(this.attr('viewBox'))

      // act as setter
      return this.attr('viewBox', new Box(x, y, width, height))
    },

    zoom (level, point) {
      // Its best to rely on the attributes here and here is why:
      // clientXYZ: Doesn't work on non-root svgs because they dont have a CSSBox (silly!)
      // getBoundingClientRect: Doesn't work because Chrome just ignores width and height of nested svgs completely
      //                        that means, their clientRect is always as big as the content.
      //                        Furthermore this size is incorrect if the element is further transformed by its parents
      // computedStyle: Only returns meaningful values if css was used with px. We dont go this route here!
      // getBBox: returns the bounding box of its content - that doesnt help!
      let { width, height } = this.attr([ 'width', 'height' ]);

      // Width and height is a string when a number with a unit is present which we can't use
      // So we try clientXYZ
      if ((!width && !height) || (typeof width === 'string' || typeof height === 'string')) {
        width = this.node.clientWidth;
        height = this.node.clientHeight;
      }

      // Giving up...
      if (!width || !height) {
        throw new Error('Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element')
      }

      const v = this.viewbox();

      const zoomX = width / v.width;
      const zoomY = height / v.height;
      const zoom = Math.min(zoomX, zoomY);

      if (level == null) {
        return zoom
      }

      let zoomAmount = zoom / level;

      // Set the zoomAmount to the highest value which is safe to process and recover from
      // The * 100 is a bit of wiggle room for the matrix transformation
      if (zoomAmount === Infinity) zoomAmount = Number.MAX_SAFE_INTEGER / 100;

      point = point || new Point(width / 2 / zoomX + v.x, height / 2 / zoomY + v.y);

      const box = new Box(v).transform(
        new Matrix({ scale: zoomAmount, origin: point })
      );

      return this.viewbox(box)
    }
  }
});

register$1(Box, 'Box');

// import { subClassArray } from './ArrayPolyfill.js'

class List extends Array {
  constructor (arr = [], ...args) {
    super(arr, ...args);
    if (typeof arr === 'number') return this
    this.length = 0;
    this.push(...arr);
  }
}

extend([ List ], {
  each (fnOrMethodName, ...args) {
    if (typeof fnOrMethodName === 'function') {
      return this.map((el, i, arr) => {
        return fnOrMethodName.call(el, el, i, arr)
      })
    } else {
      return this.map(el => {
        return el[fnOrMethodName](...args)
      })
    }
  },

  toArray () {
    return Array.prototype.concat.apply([], this)
  }
});

const reserved = [ 'toArray', 'constructor', 'each' ];

List.extend = function (methods) {
  methods = methods.reduce((obj, name) => {
    // Don't overwrite own methods
    if (reserved.includes(name)) return obj

    // Don't add private methods
    if (name[0] === '_') return obj

    // Relay every call to each()
    obj[name] = function (...attrs) {
      return this.each(name, ...attrs)
    };
    return obj
  }, {});

  extend([ List ], methods);
};

function baseFind (query, parent) {
  return new List(map((parent || globals.document).querySelectorAll(query), function (node) {
    return adopt(node)
  }))
}

// Scoped find method
function find (query) {
  return baseFind(query, this.node)
}

function findOne (query) {
  return adopt(this.node.querySelector(query))
}

let listenerId = 0;
const windowEvents = {};

function getEvents (instance) {
  let n = instance.getEventHolder();

  // We dont want to save events in global space
  if (n === globals.window) n = windowEvents;
  if (!n.events) n.events = {};
  return n.events
}

function getEventTarget (instance) {
  return instance.getEventTarget()
}

function clearEvents (instance) {
  let n = instance.getEventHolder();
  if (n === globals.window) n = windowEvents;
  if (n.events) n.events = {};
}

// Add event binder in the SVG namespace
function on (node, events, listener, binding, options) {
  const l = listener.bind(binding || node);
  const instance = makeInstance(node);
  const bag = getEvents(instance);
  const n = getEventTarget(instance);

  // events can be an array of events or a string of events
  events = Array.isArray(events) ? events : events.split(delimiter);

  // add id to listener
  if (!listener._svgjsListenerId) {
    listener._svgjsListenerId = ++listenerId;
  }

  events.forEach(function (event) {
    const ev = event.split('.')[0];
    const ns = event.split('.')[1] || '*';

    // ensure valid object
    bag[ev] = bag[ev] || {};
    bag[ev][ns] = bag[ev][ns] || {};

    // reference listener
    bag[ev][ns][listener._svgjsListenerId] = l;

    // add listener
    n.addEventListener(ev, l, options || false);
  });
}

// Add event unbinder in the SVG namespace
function off (node, events, listener, options) {
  const instance = makeInstance(node);
  const bag = getEvents(instance);
  const n = getEventTarget(instance);

  // listener can be a function or a number
  if (typeof listener === 'function') {
    listener = listener._svgjsListenerId;
    if (!listener) return
  }

  // events can be an array of events or a string or undefined
  events = Array.isArray(events) ? events : (events || '').split(delimiter);

  events.forEach(function (event) {
    const ev = event && event.split('.')[0];
    const ns = event && event.split('.')[1];
    let namespace, l;

    if (listener) {
      // remove listener reference
      if (bag[ev] && bag[ev][ns || '*']) {
        // removeListener
        n.removeEventListener(ev, bag[ev][ns || '*'][listener], options || false);

        delete bag[ev][ns || '*'][listener];
      }
    } else if (ev && ns) {
      // remove all listeners for a namespaced event
      if (bag[ev] && bag[ev][ns]) {
        for (l in bag[ev][ns]) {
          off(n, [ ev, ns ].join('.'), l);
        }

        delete bag[ev][ns];
      }
    } else if (ns) {
      // remove all listeners for a specific namespace
      for (event in bag) {
        for (namespace in bag[event]) {
          if (ns === namespace) {
            off(n, [ event, ns ].join('.'));
          }
        }
      }
    } else if (ev) {
      // remove all listeners for the event
      if (bag[ev]) {
        for (namespace in bag[ev]) {
          off(n, [ ev, namespace ].join('.'));
        }

        delete bag[ev];
      }
    } else {
      // remove all listeners on a given node
      for (event in bag) {
        off(n, event);
      }

      clearEvents(instance);
    }
  });
}

function dispatch (node, event, data, options) {
  const n = getEventTarget(node);

  // Dispatch event
  if (event instanceof globals.window.Event) {
    n.dispatchEvent(event);
  } else {
    event = new globals.window.CustomEvent(event, { detail: data, cancelable: true, ...options });
    n.dispatchEvent(event);
  }
  return event
}

class EventTarget extends Base {
  addEventListener () {}

  dispatch (event, data, options) {
    return dispatch(this, event, data, options)
  }

  dispatchEvent (event) {
    const bag = this.getEventHolder().events;
    if (!bag) return true

    const events = bag[event.type];

    for (const i in events) {
      for (const j in events[i]) {
        events[i][j](event);
      }
    }

    return !event.defaultPrevented
  }

  // Fire given event
  fire (event, data, options) {
    this.dispatch(event, data, options);
    return this
  }

  getEventHolder () {
    return this
  }

  getEventTarget () {
    return this
  }

  // Unbind event from listener
  off (event, listener, options) {
    off(this, event, listener, options);
    return this
  }

  // Bind given event to listener
  on (event, listener, binding, options) {
    on(this, event, listener, binding, options);
    return this
  }

  removeEventListener () {}
}

register$1(EventTarget, 'EventTarget');

function noop$2 () {}

// Default animation values
const timeline = {
  duration: 400,
  ease: '>',
  delay: 0
};

// Default attribute values
const attrs = {

  // fill and stroke
  'fill-opacity': 1,
  'stroke-opacity': 1,
  'stroke-width': 0,
  'stroke-linejoin': 'miter',
  'stroke-linecap': 'butt',
  fill: '#000000',
  stroke: '#000000',
  opacity: 1,

  // position
  x: 0,
  y: 0,
  cx: 0,
  cy: 0,

  // size
  width: 0,
  height: 0,

  // radius
  r: 0,
  rx: 0,
  ry: 0,

  // gradient
  offset: 0,
  'stop-opacity': 1,
  'stop-color': '#000000',

  // text
  'text-anchor': 'start'
};

class SVGArray extends Array {
  constructor (...args) {
    super(...args);
    this.init(...args);
  }

  clone () {
    return new this.constructor(this)
  }

  init (arr) {
    // This catches the case, that native map tries to create an array with new Array(1)
    if (typeof arr === 'number') return this
    this.length = 0;
    this.push(...this.parse(arr));
    return this
  }

  // Parse whitespace separated string
  parse (array = []) {
    // If already is an array, no need to parse it
    if (array instanceof Array) return array

    return array.trim().split(delimiter).map(parseFloat)
  }

  toArray () {
    return Array.prototype.concat.apply([], this)
  }

  toSet () {
    return new Set(this)
  }

  toString () {
    return this.join(' ')
  }

  // Flattens the array if needed
  valueOf () {
    const ret = [];
    ret.push(...this);
    return ret
  }

}

// Module for unit conversions
class SVGNumber {
  // Initialize
  constructor (...args) {
    this.init(...args);
  }

  convert (unit) {
    return new SVGNumber(this.value, unit)
  }

  // Divide number
  divide (number) {
    number = new SVGNumber(number);
    return new SVGNumber(this / number, this.unit || number.unit)
  }

  init (value, unit) {
    unit = Array.isArray(value) ? value[1] : unit;
    value = Array.isArray(value) ? value[0] : value;

    // initialize defaults
    this.value = 0;
    this.unit = unit || '';

    // parse value
    if (typeof value === 'number') {
      // ensure a valid numeric value
      this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value;
    } else if (typeof value === 'string') {
      unit = value.match(numberAndUnit);

      if (unit) {
        // make value numeric
        this.value = parseFloat(unit[1]);

        // normalize
        if (unit[5] === '%') {
          this.value /= 100;
        } else if (unit[5] === 's') {
          this.value *= 1000;
        }

        // store unit
        this.unit = unit[5];
      }
    } else {
      if (value instanceof SVGNumber) {
        this.value = value.valueOf();
        this.unit = value.unit;
      }
    }

    return this
  }

  // Subtract number
  minus (number) {
    number = new SVGNumber(number);
    return new SVGNumber(this - number, this.unit || number.unit)
  }

  // Add number
  plus (number) {
    number = new SVGNumber(number);
    return new SVGNumber(this + number, this.unit || number.unit)
  }

  // Multiply number
  times (number) {
    number = new SVGNumber(number);
    return new SVGNumber(this * number, this.unit || number.unit)
  }

  toArray () {
    return [ this.value, this.unit ]
  }

  toJSON () {
    return this.toString()
  }

  toString () {
    return (this.unit === '%'
      ? ~~(this.value * 1e8) / 1e6
      : this.unit === 's'
        ? this.value / 1e3
        : this.value
    ) + this.unit
  }

  valueOf () {
    return this.value
  }

}

const hooks$1 = [];
function registerAttrHook (fn) {
  hooks$1.push(fn);
}

// Set svg element attribute
function attr (attr, val, ns) {
  // act as full getter
  if (attr == null) {
    // get an object of attributes
    attr = {};
    val = this.node.attributes;

    for (const node of val) {
      attr[node.nodeName] = isNumber.test(node.nodeValue)
        ? parseFloat(node.nodeValue)
        : node.nodeValue;
    }

    return attr
  } else if (attr instanceof Array) {
    // loop through array and get all values
    return attr.reduce((last, curr) => {
      last[curr] = this.attr(curr);
      return last
    }, {})
  } else if (typeof attr === 'object' && attr.constructor === Object) {
    // apply every attribute individually if an object is passed
    for (val in attr) this.attr(val, attr[val]);
  } else if (val === null) {
    // remove value
    this.node.removeAttribute(attr);
  } else if (val == null) {
    // act as a getter if the first and only argument is not an object
    val = this.node.getAttribute(attr);
    return val == null
      ? attrs[attr]
      : isNumber.test(val)
        ? parseFloat(val)
        : val
  } else {
    // Loop through hooks and execute them to convert value
    val = hooks$1.reduce((_val, hook) => {
      return hook(attr, _val, this)
    }, val);

    // ensure correct numeric values (also accepts NaN and Infinity)
    if (typeof val === 'number') {
      val = new SVGNumber(val);
    } else if (Color$1.isColor(val)) {
      // ensure full hex color
      val = new Color$1(val);
    } else if (val.constructor === Array) {
      // Check for plain arrays and parse array values
      val = new SVGArray(val);
    }

    // if the passed attribute is leading...
    if (attr === 'leading') {
      // ... call the leading method instead
      if (this.leading) {
        this.leading(val);
      }
    } else {
      // set given attribute on node
      typeof ns === 'string'
        ? this.node.setAttributeNS(ns, attr, val.toString())
        : this.node.setAttribute(attr, val.toString());
    }

    // rebuild if required
    if (this.rebuild && (attr === 'font-size' || attr === 'x')) {
      this.rebuild();
    }
  }

  return this
}

class Dom extends EventTarget {
  constructor (node, attrs) {
    super();
    this.node = node;
    this.type = node.nodeName;

    if (attrs && node !== attrs) {
      this.attr(attrs);
    }
  }

  // Add given element at a position
  add (element, i) {
    element = makeInstance(element);

    // If non-root svg nodes are added we have to remove their namespaces
    if (element.removeNamespace && this.node instanceof globals.window.SVGElement) {
      element.removeNamespace();
    }

    if (i == null) {
      this.node.appendChild(element.node);
    } else if (element.node !== this.node.childNodes[i]) {
      this.node.insertBefore(element.node, this.node.childNodes[i]);
    }

    return this
  }

  // Add element to given container and return self
  addTo (parent, i) {
    return makeInstance(parent).put(this, i)
  }

  // Returns all child elements
  children () {
    return new List(map(this.node.children, function (node) {
      return adopt(node)
    }))
  }

  // Remove all elements in this container
  clear () {
    // remove children
    while (this.node.hasChildNodes()) {
      this.node.removeChild(this.node.lastChild);
    }

    return this
  }

  // Clone element
  clone (deep = true) {
    // write dom data to the dom so the clone can pickup the data
    this.writeDataToDom();

    // clone element and assign new id
    return new this.constructor(assignNewId(this.node.cloneNode(deep)))
  }

  // Iterates over all children and invokes a given block
  each (block, deep) {
    const children = this.children();
    let i, il;

    for (i = 0, il = children.length; i < il; i++) {
      block.apply(children[i], [ i, children ]);

      if (deep) {
        children[i].each(block, deep);
      }
    }

    return this
  }

  element (nodeName, attrs) {
    return this.put(new Dom(create(nodeName), attrs))
  }

  // Get first child
  first () {
    return adopt(this.node.firstChild)
  }

  // Get a element at the given index
  get (i) {
    return adopt(this.node.childNodes[i])
  }

  getEventHolder () {
    return this.node
  }

  getEventTarget () {
    return this.node
  }

  // Checks if the given element is a child
  has (element) {
    return this.index(element) >= 0
  }

  html (htmlOrFn, outerHTML) {
    return this.xml(htmlOrFn, outerHTML, html)
  }

  // Get / set id
  id (id) {
    // generate new id if no id set
    if (typeof id === 'undefined' && !this.node.id) {
      this.node.id = eid(this.type);
    }

    // don't set directly with this.node.id to make `null` work correctly
    return this.attr('id', id)
  }

  // Gets index of given element
  index (element) {
    return [].slice.call(this.node.childNodes).indexOf(element.node)
  }

  // Get the last child
  last () {
    return adopt(this.node.lastChild)
  }

  // matches the element vs a css selector
  matches (selector) {
    const el = this.node;
    const matcher = el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector || null;
    return matcher && matcher.call(el, selector)
  }

  // Returns the parent element instance
  parent (type) {
    let parent = this;

    // check for parent
    if (!parent.node.parentNode) return null

    // get parent element
    parent = adopt(parent.node.parentNode);

    if (!type) return parent

    // loop trough ancestors if type is given
    do {
      if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
    } while ((parent = adopt(parent.node.parentNode)))

    return parent
  }

  // Basically does the same as `add()` but returns the added element instead
  put (element, i) {
    element = makeInstance(element);
    this.add(element, i);
    return element
  }

  // Add element to given container and return container
  putIn (parent, i) {
    return makeInstance(parent).add(this, i)
  }

  // Remove element
  remove () {
    if (this.parent()) {
      this.parent().removeElement(this);
    }

    return this
  }

  // Remove a given child
  removeElement (element) {
    this.node.removeChild(element.node);

    return this
  }

  // Replace this with element
  replace (element) {
    element = makeInstance(element);

    if (this.node.parentNode) {
      this.node.parentNode.replaceChild(element.node, this.node);
    }

    return element
  }

  round (precision = 2, map = null) {
    const factor = 10 ** precision;
    const attrs = this.attr(map);

    for (const i in attrs) {
      if (typeof attrs[i] === 'number') {
        attrs[i] = Math.round(attrs[i] * factor) / factor;
      }
    }

    this.attr(attrs);
    return this
  }

  // Import / Export raw svg
  svg (svgOrFn, outerSVG) {
    return this.xml(svgOrFn, outerSVG, svg)
  }

  // Return id on string conversion
  toString () {
    return this.id()
  }

  words (text) {
    // This is faster than removing all children and adding a new one
    this.node.textContent = text;
    return this
  }

  wrap (node) {
    const parent = this.parent();

    if (!parent) {
      return this.addTo(node)
    }

    const position = parent.index(this);
    return parent.put(node, position).put(this)
  }

  // write svgjs data to the dom
  writeDataToDom () {
    // dump variables recursively
    this.each(function () {
      this.writeDataToDom();
    });

    return this
  }

  // Import / Export raw svg
  xml (xmlOrFn, outerXML, ns) {
    if (typeof xmlOrFn === 'boolean') {
      ns = outerXML;
      outerXML = xmlOrFn;
      xmlOrFn = null;
    }

    // act as getter if no svg string is given
    if (xmlOrFn == null || typeof xmlOrFn === 'function') {
      // The default for exports is, that the outerNode is included
      outerXML = outerXML == null ? true : outerXML;

      // write svgjs data to the dom
      this.writeDataToDom();
      let current = this;

      // An export modifier was passed
      if (xmlOrFn != null) {
        current = adopt(current.node.cloneNode(true));

        // If the user wants outerHTML we need to process this node, too
        if (outerXML) {
          const result = xmlOrFn(current);
          current = result || current;

          // The user does not want this node? Well, then he gets nothing
          if (result === false) return ''
        }

        // Deep loop through all children and apply modifier
        current.each(function () {
          const result = xmlOrFn(this);
          const _this = result || this;

          // If modifier returns false, discard node
          if (result === false) {
            this.remove();

            // If modifier returns new node, use it
          } else if (result && this !== _this) {
            this.replace(_this);
          }
        }, true);
      }

      // Return outer or inner content
      return outerXML
        ? current.node.outerHTML
        : current.node.innerHTML
    }

    // Act as setter if we got a string

    // The default for import is, that the current node is not replaced
    outerXML = outerXML == null ? false : outerXML;

    // Create temporary holder
    const well = create('wrapper', ns);
    const fragment = globals.document.createDocumentFragment();

    // Dump raw svg
    well.innerHTML = xmlOrFn;

    // Transplant nodes into the fragment
    for (let len = well.children.length; len--;) {
      fragment.appendChild(well.firstElementChild);
    }

    const parent = this.parent();

    // Add the whole fragment at once
    return outerXML
      ? this.replace(fragment) && parent
      : this.add(fragment)
  }
}

extend(Dom, { attr, find, findOne });
register$1(Dom, 'Dom');

class Element extends Dom {
  constructor (node, attrs) {
    super(node, attrs);

    // initialize data object
    this.dom = {};

    // create circular reference
    this.node.instance = this;

    if (node.hasAttribute('svgjs:data')) {
      // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
      this.setData(JSON.parse(node.getAttribute('svgjs:data')) || {});
    }
  }

  // Move element by its center
  center (x, y) {
    return this.cx(x).cy(y)
  }

  // Move by center over x-axis
  cx (x) {
    return x == null
      ? this.x() + this.width() / 2
      : this.x(x - this.width() / 2)
  }

  // Move by center over y-axis
  cy (y) {
    return y == null
      ? this.y() + this.height() / 2
      : this.y(y - this.height() / 2)
  }

  // Get defs
  defs () {
    const root = this.root();
    return root && root.defs()
  }

  // Relative move over x and y axes
  dmove (x, y) {
    return this.dx(x).dy(y)
  }

  // Relative move over x axis
  dx (x = 0) {
    return this.x(new SVGNumber(x).plus(this.x()))
  }

  // Relative move over y axis
  dy (y = 0) {
    return this.y(new SVGNumber(y).plus(this.y()))
  }

  getEventHolder () {
    return this
  }

  // Set height of element
  height (height) {
    return this.attr('height', height)
  }

  // Move element to given x and y values
  move (x, y) {
    return this.x(x).y(y)
  }

  // return array of all ancestors of given type up to the root svg
  parents (until = this.root()) {
    const isSelector = typeof until === 'string';
    if (!isSelector) {
      until = makeInstance(until);
    }
    const parents = new List();
    let parent = this;

    while (
      (parent = parent.parent())
      && parent.node !== globals.document
      && parent.nodeName !== '#document-fragment') {

      parents.push(parent);

      if (!isSelector && (parent.node === until.node)) {
        break
      }
      if (isSelector && parent.matches(until)) {
        break
      }
      if (parent.node === this.root().node) {
        // We worked our way to the root and didn't match `until`
        return null
      }
    }

    return parents
  }

  // Get referenced element form attribute value
  reference (attr) {
    attr = this.attr(attr);
    if (!attr) return null

    const m = (attr + '').match(reference);
    return m ? makeInstance(m[1]) : null
  }

  // Get parent document
  root () {
    const p = this.parent(getClass(root$2));
    return p && p.root()
  }

  // set given data to the elements data property
  setData (o) {
    this.dom = o;
    return this
  }

  // Set element size to given width and height
  size (width, height) {
    const p = proportionalSize(this, width, height);

    return this
      .width(new SVGNumber(p.width))
      .height(new SVGNumber(p.height))
  }

  // Set width of element
  width (width) {
    return this.attr('width', width)
  }

  // write svgjs data to the dom
  writeDataToDom () {
    // remove previously set data
    this.node.removeAttribute('svgjs:data');

    if (Object.keys(this.dom).length) {
      this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)); // see #428
    }

    return super.writeDataToDom()
  }

  // Move over x-axis
  x (x) {
    return this.attr('x', x)
  }

  // Move over y-axis
  y (y) {
    return this.attr('y', y)
  }
}

extend(Element, {
  bbox, rbox, inside, point, ctm, screenCTM
});

register$1(Element, 'Element');

// Define list of available attributes for stroke and fill
const sugar = {
  stroke: [ 'color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset' ],
  fill: [ 'color', 'opacity', 'rule' ],
  prefix: function (t, a) {
    return a === 'color' ? t : t + '-' + a
  }
}

// Add sugar for fill and stroke
;[ 'fill', 'stroke' ].forEach(function (m) {
  const extension = {};
  let i;

  extension[m] = function (o) {
    if (typeof o === 'undefined') {
      return this.attr(m)
    }
    if (typeof o === 'string' || o instanceof Color$1 || Color$1.isRgb(o) || (o instanceof Element)) {
      this.attr(m, o);
    } else {
      // set all attributes from sugar.fill and sugar.stroke list
      for (i = sugar[m].length - 1; i >= 0; i--) {
        if (o[sugar[m][i]] != null) {
          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]]);
        }
      }
    }

    return this
  };

  registerMethods([ 'Element', 'Runner' ], extension);
});

registerMethods([ 'Element', 'Runner' ], {
  // Let the user set the matrix directly
  matrix: function (mat, b, c, d, e, f) {
    // Act as a getter
    if (mat == null) {
      return new Matrix(this)
    }

    // Act as a setter, the user can pass a matrix or a set of numbers
    return this.attr('transform', new Matrix(mat, b, c, d, e, f))
  },

  // Map rotation to transform
  rotate: function (angle, cx, cy) {
    return this.transform({ rotate: angle, ox: cx, oy: cy }, true)
  },

  // Map skew to transform
  skew: function (x, y, cx, cy) {
    return arguments.length === 1 || arguments.length === 3
      ? this.transform({ skew: x, ox: y, oy: cx }, true)
      : this.transform({ skew: [ x, y ], ox: cx, oy: cy }, true)
  },

  shear: function (lam, cx, cy) {
    return this.transform({ shear: lam, ox: cx, oy: cy }, true)
  },

  // Map scale to transform
  scale: function (x, y, cx, cy) {
    return arguments.length === 1 || arguments.length === 3
      ? this.transform({ scale: x, ox: y, oy: cx }, true)
      : this.transform({ scale: [ x, y ], ox: cx, oy: cy }, true)
  },

  // Map translate to transform
  translate: function (x, y) {
    return this.transform({ translate: [ x, y ] }, true)
  },

  // Map relative translations to transform
  relative: function (x, y) {
    return this.transform({ relative: [ x, y ] }, true)
  },

  // Map flip to transform
  flip: function (direction = 'both', origin = 'center') {
    if ('xybothtrue'.indexOf(direction) === -1) {
      origin = direction;
      direction = 'both';
    }

    return this.transform({ flip: direction, origin: origin }, true)
  },

  // Opacity
  opacity: function (value) {
    return this.attr('opacity', value)
  }
});

registerMethods('radius', {
  // Add x and y radius
  radius: function (x, y = x) {
    const type = (this._element || this).type;
    return type === 'radialGradient'
      ? this.attr('r', new SVGNumber(x))
      : this.rx(x).ry(y)
  }
});

registerMethods('Path', {
  // Get path length
  length: function () {
    return this.node.getTotalLength()
  },
  // Get point at length
  pointAt: function (length) {
    return new Point(this.node.getPointAtLength(length))
  }
});

registerMethods([ 'Element', 'Runner' ], {
  // Set font
  font: function (a, v) {
    if (typeof a === 'object') {
      for (v in a) this.font(v, a[v]);
      return this
    }

    return a === 'leading'
      ? this.leading(v)
      : a === 'anchor'
        ? this.attr('text-anchor', v)
        : a === 'size' || a === 'family' || a === 'weight' || a === 'stretch' || a === 'variant' || a === 'style'
          ? this.attr('font-' + a, v)
          : this.attr(a, v)
  }
});

// Add events to elements
const methods = [ 'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'mousemove',
  'mouseenter',
  'mouseleave',
  'touchstart',
  'touchmove',
  'touchleave',
  'touchend',
  'touchcancel' ].reduce(function (last, event) {
  // add event to Element
  const fn = function (f) {
    if (f === null) {
      this.off(event);
    } else {
      this.on(event, f);
    }
    return this
  };

  last[event] = fn;
  return last
}, {});

registerMethods('Element', methods);

// Reset all transformations
function untransform () {
  return this.attr('transform', null)
}

// merge the whole transformation chain into one matrix and returns it
function matrixify () {
  const matrix = (this.attr('transform') || '')
    // split transformations
    .split(transforms).slice(0, -1).map(function (str) {
      // generate key => value pairs
      const kv = str.trim().split('(');
      return [ kv[0],
        kv[1].split(delimiter)
          .map(function (str) {
            return parseFloat(str)
          })
      ]
    })
    .reverse()
    // merge every transformation into one matrix
    .reduce(function (matrix, transform) {
      if (transform[0] === 'matrix') {
        return matrix.lmultiply(Matrix.fromArray(transform[1]))
      }
      return matrix[transform[0]].apply(matrix, transform[1])
    }, new Matrix());

  return matrix
}

// add an element to another parent without changing the visual representation on the screen
function toParent (parent, i) {
  if (this === parent) return this
  const ctm = this.screenCTM();
  const pCtm = parent.screenCTM().inverse();

  this.addTo(parent, i).untransform().transform(pCtm.multiply(ctm));

  return this
}

// same as above with parent equals root-svg
function toRoot (i) {
  return this.toParent(this.root(), i)
}

// Add transformations
function transform (o, relative) {
  // Act as a getter if no object was passed
  if (o == null || typeof o === 'string') {
    const decomposed = new Matrix(this).decompose();
    return o == null ? decomposed : decomposed[o]
  }

  if (!Matrix.isMatrixLike(o)) {
    // Set the origin according to the defined transform
    o = { ...o, origin: getOrigin(o, this) };
  }

  // The user can pass a boolean, an Element or an Matrix or nothing
  const cleanRelative = relative === true ? this : (relative || false);
  const result = new Matrix(cleanRelative).transform(o);
  return this.attr('transform', result)
}

registerMethods('Element', {
  untransform, matrixify, toParent, toRoot, transform
});

class Container extends Element {
  flatten (parent = this, index) {
    this.each(function () {
      if (this instanceof Container) {
        return this.flatten().ungroup()
      }
    });

    return this
  }

  ungroup (parent = this.parent(), index = parent.index(this)) {
    // when parent != this, we want append all elements to the end
    index = index === -1 ? parent.children().length : index;

    this.each(function (i, children) {
      // reverse each
      return children[children.length - i - 1].toParent(parent, index)
    });

    return this.remove()
  }
}

register$1(Container, 'Container');

class Defs extends Container {
  constructor (node, attrs = node) {
    super(nodeOrNew('defs', node), attrs);
  }

  flatten () {
    return this
  }

  ungroup () {
    return this
  }
}

register$1(Defs, 'Defs');

class Shape extends Element {}

register$1(Shape, 'Shape');

// Radius x value
function rx (rx) {
  return this.attr('rx', rx)
}

// Radius y value
function ry (ry) {
  return this.attr('ry', ry)
}

// Move over x-axis
function x$3 (x) {
  return x == null
    ? this.cx() - this.rx()
    : this.cx(x + this.rx())
}

// Move over y-axis
function y$3 (y) {
  return y == null
    ? this.cy() - this.ry()
    : this.cy(y + this.ry())
}

// Move by center over x-axis
function cx$1 (x) {
  return this.attr('cx', x)
}

// Move by center over y-axis
function cy$1 (y) {
  return this.attr('cy', y)
}

// Set width of element
function width$3 (width) {
  return width == null
    ? this.rx() * 2
    : this.rx(new SVGNumber(width).divide(2))
}

// Set height of element
function height$3 (height) {
  return height == null
    ? this.ry() * 2
    : this.ry(new SVGNumber(height).divide(2))
}

var circled = /*#__PURE__*/Object.freeze({
  __proto__: null,
  rx: rx,
  ry: ry,
  x: x$3,
  y: y$3,
  cx: cx$1,
  cy: cy$1,
  width: width$3,
  height: height$3
});

class Ellipse extends Shape {
  constructor (node, attrs = node) {
    super(nodeOrNew('ellipse', node), attrs);
  }

  size (width, height) {
    const p = proportionalSize(this, width, height);

    return this
      .rx(new SVGNumber(p.width).divide(2))
      .ry(new SVGNumber(p.height).divide(2))
  }
}

extend(Ellipse, circled);

registerMethods('Container', {
  // Create an ellipse
  ellipse: wrapWithAttrCheck(function (width = 0, height = width) {
    return this.put(new Ellipse()).size(width, height).move(0, 0)
  })
});

register$1(Ellipse, 'Ellipse');

class Fragment extends Dom {
  constructor (node = globals.document.createDocumentFragment()) {
    super(node);
  }

  // Import / Export raw xml
  xml (xmlOrFn, outerXML, ns) {
    if (typeof xmlOrFn === 'boolean') {
      ns = outerXML;
      outerXML = xmlOrFn;
      xmlOrFn = null;
    }

    // because this is a fragment we have to put all elements into a wrapper first
    // before we can get the innerXML from it
    if (xmlOrFn == null || typeof xmlOrFn === 'function') {
      const wrapper = new Dom(create('wrapper', ns));
      wrapper.add(this.node.cloneNode(true));

      return wrapper.xml(false, ns)
    }

    // Act as setter if we got a string
    return super.xml(xmlOrFn, false, ns)
  }

}

register$1(Fragment, 'Fragment');

function from (x, y) {
  return (this._element || this).type === 'radialGradient'
    ? this.attr({ fx: new SVGNumber(x), fy: new SVGNumber(y) })
    : this.attr({ x1: new SVGNumber(x), y1: new SVGNumber(y) })
}

function to (x, y) {
  return (this._element || this).type === 'radialGradient'
    ? this.attr({ cx: new SVGNumber(x), cy: new SVGNumber(y) })
    : this.attr({ x2: new SVGNumber(x), y2: new SVGNumber(y) })
}

var gradiented = /*#__PURE__*/Object.freeze({
  __proto__: null,
  from: from,
  to: to
});

class Gradient extends Container {
  constructor (type, attrs) {
    super(
      nodeOrNew(type + 'Gradient', typeof type === 'string' ? null : type),
      attrs
    );
  }

  // custom attr to handle transform
  attr (a, b, c) {
    if (a === 'transform') a = 'gradientTransform';
    return super.attr(a, b, c)
  }

  bbox () {
    return new Box()
  }

  targets () {
    return baseFind('svg [fill*="' + this.id() + '"]')
  }

  // Alias string conversion to fill
  toString () {
    return this.url()
  }

  // Update gradient
  update (block) {
    // remove all stops
    this.clear();

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this);
    }

    return this
  }

  // Return the fill id
  url () {
    return 'url("#' + this.id() + '")'
  }
}

extend(Gradient, gradiented);

registerMethods({
  Container: {
    // Create gradient element in defs
    gradient (...args) {
      return this.defs().gradient(...args)
    }
  },
  // define gradient
  Defs: {
    gradient: wrapWithAttrCheck(function (type, block) {
      return this.put(new Gradient(type)).update(block)
    })
  }
});

register$1(Gradient, 'Gradient');

class Pattern extends Container {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('pattern', node), attrs);
  }

  // custom attr to handle transform
  attr (a, b, c) {
    if (a === 'transform') a = 'patternTransform';
    return super.attr(a, b, c)
  }

  bbox () {
    return new Box()
  }

  targets () {
    return baseFind('svg [fill*="' + this.id() + '"]')
  }

  // Alias string conversion to fill
  toString () {
    return this.url()
  }

  // Update pattern by rebuilding
  update (block) {
    // remove content
    this.clear();

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this);
    }

    return this
  }

  // Return the fill id
  url () {
    return 'url("#' + this.id() + '")'
  }

}

registerMethods({
  Container: {
    // Create pattern element in defs
    pattern (...args) {
      return this.defs().pattern(...args)
    }
  },
  Defs: {
    pattern: wrapWithAttrCheck(function (width, height, block) {
      return this.put(new Pattern()).update(block).attr({
        x: 0,
        y: 0,
        width: width,
        height: height,
        patternUnits: 'userSpaceOnUse'
      })
    })
  }
});

register$1(Pattern, 'Pattern');

class Image extends Shape {
  constructor (node, attrs = node) {
    super(nodeOrNew('image', node), attrs);
  }

  // (re)load image
  load (url, callback) {
    if (!url) return this

    const img = new globals.window.Image();

    on(img, 'load', function (e) {
      const p = this.parent(Pattern);

      // ensure image size
      if (this.width() === 0 && this.height() === 0) {
        this.size(img.width, img.height);
      }

      if (p instanceof Pattern) {
        // ensure pattern size if not set
        if (p.width() === 0 && p.height() === 0) {
          p.size(this.width(), this.height());
        }
      }

      if (typeof callback === 'function') {
        callback.call(this, e);
      }
    }, this);

    on(img, 'load error', function () {
      // dont forget to unbind memory leaking events
      off(img);
    });

    return this.attr('href', (img.src = url), xlink)
  }
}

registerAttrHook(function (attr, val, _this) {
  // convert image fill and stroke to patterns
  if (attr === 'fill' || attr === 'stroke') {
    if (isImage.test(val)) {
      val = _this.root().defs().image(val);
    }
  }

  if (val instanceof Image) {
    val = _this.root().defs().pattern(0, 0, (pattern) => {
      pattern.add(val);
    });
  }

  return val
});

registerMethods({
  Container: {
    // create image element, load image and set its size
    image: wrapWithAttrCheck(function (source, callback) {
      return this.put(new Image()).size(0, 0).load(source, callback)
    })
  }
});

register$1(Image, 'Image');

class PointArray extends SVGArray {
  // Get bounding box of points
  bbox () {
    let maxX = -Infinity;
    let maxY = -Infinity;
    let minX = Infinity;
    let minY = Infinity;
    this.forEach(function (el) {
      maxX = Math.max(el[0], maxX);
      maxY = Math.max(el[1], maxY);
      minX = Math.min(el[0], minX);
      minY = Math.min(el[1], minY);
    });
    return new Box(minX, minY, maxX - minX, maxY - minY)
  }

  // Move point string
  move (x, y) {
    const box = this.bbox();

    // get relative offset
    x -= box.x;
    y -= box.y;

    // move every point
    if (!isNaN(x) && !isNaN(y)) {
      for (let i = this.length - 1; i >= 0; i--) {
        this[i] = [ this[i][0] + x, this[i][1] + y ];
      }
    }

    return this
  }

  // Parse point string and flat array
  parse (array = [ 0, 0 ]) {
    const points = [];

    // if it is an array, we flatten it and therefore clone it to 1 depths
    if (array instanceof Array) {
      array = Array.prototype.concat.apply([], array);
    } else { // Else, it is considered as a string
      // parse points
      array = array.trim().split(delimiter).map(parseFloat);
    }

    // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
    // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
    if (array.length % 2 !== 0) array.pop();

    // wrap points in two-tuples
    for (let i = 0, len = array.length; i < len; i = i + 2) {
      points.push([ array[i], array[i + 1] ]);
    }

    return points
  }

  // Resize poly string
  size (width, height) {
    let i;
    const box = this.bbox();

    // recalculate position of all points according to new size
    for (i = this.length - 1; i >= 0; i--) {
      if (box.width) this[i][0] = ((this[i][0] - box.x) * width) / box.width + box.x;
      if (box.height) this[i][1] = ((this[i][1] - box.y) * height) / box.height + box.y;
    }

    return this
  }

  // Convert array to line object
  toLine () {
    return {
      x1: this[0][0],
      y1: this[0][1],
      x2: this[1][0],
      y2: this[1][1]
    }
  }

  // Convert array to string
  toString () {
    const array = [];
    // convert to a poly point string
    for (let i = 0, il = this.length; i < il; i++) {
      array.push(this[i].join(','));
    }

    return array.join(' ')
  }

  transform (m) {
    return this.clone().transformO(m)
  }

  // transform points with matrix (similar to Point.transform)
  transformO (m) {
    if (!Matrix.isMatrixLike(m)) {
      m = new Matrix(m);
    }

    for (let i = this.length; i--;) {
      // Perform the matrix multiplication
      const [ x, y ] = this[i];
      this[i][0] = m.a * x + m.c * y + m.e;
      this[i][1] = m.b * x + m.d * y + m.f;
    }

    return this
  }

}

const MorphArray = PointArray;

// Move by left top corner over x-axis
function x$2 (x) {
  return x == null ? this.bbox().x : this.move(x, this.bbox().y)
}

// Move by left top corner over y-axis
function y$2 (y) {
  return y == null ? this.bbox().y : this.move(this.bbox().x, y)
}

// Set width of element
function width$2 (width) {
  const b = this.bbox();
  return width == null ? b.width : this.size(width, b.height)
}

// Set height of element
function height$2 (height) {
  const b = this.bbox();
  return height == null ? b.height : this.size(b.width, height)
}

var pointed = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MorphArray: MorphArray,
  x: x$2,
  y: y$2,
  width: width$2,
  height: height$2
});

class Line extends Shape {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('line', node), attrs);
  }

  // Get array
  array () {
    return new PointArray([
      [ this.attr('x1'), this.attr('y1') ],
      [ this.attr('x2'), this.attr('y2') ]
    ])
  }

  // Move by left top corner
  move (x, y) {
    return this.attr(this.array().move(x, y).toLine())
  }

  // Overwrite native plot() method
  plot (x1, y1, x2, y2) {
    if (x1 == null) {
      return this.array()
    } else if (typeof y1 !== 'undefined') {
      x1 = { x1, y1, x2, y2 };
    } else {
      x1 = new PointArray(x1).toLine();
    }

    return this.attr(x1)
  }

  // Set element size to given width and height
  size (width, height) {
    const p = proportionalSize(this, width, height);
    return this.attr(this.array().size(p.width, p.height).toLine())
  }
}

extend(Line, pointed);

registerMethods({
  Container: {
    // Create a line element
    line: wrapWithAttrCheck(function (...args) {
      // make sure plot is called as a setter
      // x1 is not necessarily a number, it can also be an array, a string and a PointArray
      return Line.prototype.plot.apply(
        this.put(new Line())
        , args[0] != null ? args : [ 0, 0, 0, 0 ]
      )
    })
  }
});

register$1(Line, 'Line');

class Marker extends Container {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('marker', node), attrs);
  }

  // Set height of element
  height (height) {
    return this.attr('markerHeight', height)
  }

  orient (orient) {
    return this.attr('orient', orient)
  }

  // Set marker refX and refY
  ref (x, y) {
    return this.attr('refX', x).attr('refY', y)
  }

  // Return the fill id
  toString () {
    return 'url(#' + this.id() + ')'
  }

  // Update marker
  update (block) {
    // remove all content
    this.clear();

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this);
    }

    return this
  }

  // Set width of element
  width (width) {
    return this.attr('markerWidth', width)
  }

}

registerMethods({
  Container: {
    marker (...args) {
      // Create marker element in defs
      return this.defs().marker(...args)
    }
  },
  Defs: {
    // Create marker
    marker: wrapWithAttrCheck(function (width, height, block) {
      // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
      return this.put(new Marker())
        .size(width, height)
        .ref(width / 2, height / 2)
        .viewbox(0, 0, width, height)
        .attr('orient', 'auto')
        .update(block)
    })
  },
  marker: {
    // Create and attach markers
    marker (marker, width, height, block) {
      let attr = [ 'marker' ];

      // Build attribute name
      if (marker !== 'all') attr.push(marker);
      attr = attr.join('-');

      // Set marker attribute
      marker = arguments[1] instanceof Marker
        ? arguments[1]
        : this.defs().marker(width, height, block);

      return this.attr(attr, marker)
    }
  }
});

register$1(Marker, 'Marker');

/***
Base Class
==========
The base stepper class that will be
***/

function makeSetterGetter (k, f) {
  return function (v) {
    if (v == null) return this[k]
    this[k] = v;
    if (f) f.call(this);
    return this
  }
}

const easing$1 = {
  '-': function (pos) {
    return pos
  },
  '<>': function (pos) {
    return -Math.cos(pos * Math.PI) / 2 + 0.5
  },
  '>': function (pos) {
    return Math.sin(pos * Math.PI / 2)
  },
  '<': function (pos) {
    return -Math.cos(pos * Math.PI / 2) + 1
  },
  bezier: function (x1, y1, x2, y2) {
    // see https://www.w3.org/TR/css-easing-1/#cubic-bezier-algo
    return function (t) {
      if (t < 0) {
        if (x1 > 0) {
          return y1 / x1 * t
        } else if (x2 > 0) {
          return y2 / x2 * t
        } else {
          return 0
        }
      } else if (t > 1) {
        if (x2 < 1) {
          return (1 - y2) / (1 - x2) * t + (y2 - x2) / (1 - x2)
        } else if (x1 < 1) {
          return (1 - y1) / (1 - x1) * t + (y1 - x1) / (1 - x1)
        } else {
          return 1
        }
      } else {
        return 3 * t * (1 - t) ** 2 * y1 + 3 * t ** 2 * (1 - t) * y2 + t ** 3
      }
    }
  },
  // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
  steps: function (steps, stepPosition = 'end') {
    // deal with "jump-" prefix
    stepPosition = stepPosition.split('-').reverse()[0];

    let jumps = steps;
    if (stepPosition === 'none') {
      --jumps;
    } else if (stepPosition === 'both') {
      ++jumps;
    }

    // The beforeFlag is essentially useless
    return (t, beforeFlag = false) => {
      // Step is called currentStep in referenced url
      let step = Math.floor(t * steps);
      const jumping = (t * step) % 1 === 0;

      if (stepPosition === 'start' || stepPosition === 'both') {
        ++step;
      }

      if (beforeFlag && jumping) {
        --step;
      }

      if (t >= 0 && step < 0) {
        step = 0;
      }

      if (t <= 1 && step > jumps) {
        step = jumps;
      }

      return step / jumps
    }
  }
};

class Stepper {
  done () {
    return false
  }
}

/***
Easing Functions
================
***/

class Ease extends Stepper {
  constructor (fn = timeline.ease) {
    super();
    this.ease = easing$1[fn] || fn;
  }

  step (from, to, pos) {
    if (typeof from !== 'number') {
      return pos < 1 ? from : to
    }
    return from + (to - from) * this.ease(pos)
  }
}

/***
Controller Types
================
***/

class Controller extends Stepper {
  constructor (fn) {
    super();
    this.stepper = fn;
  }

  done (c) {
    return c.done
  }

  step (current, target, dt, c) {
    return this.stepper(current, target, dt, c)
  }

}

function recalculate () {
  // Apply the default parameters
  const duration = (this._duration || 500) / 1000;
  const overshoot = this._overshoot || 0;

  // Calculate the PID natural response
  const eps = 1e-10;
  const pi = Math.PI;
  const os = Math.log(overshoot / 100 + eps);
  const zeta = -os / Math.sqrt(pi * pi + os * os);
  const wn = 3.9 / (zeta * duration);

  // Calculate the Spring values
  this.d = 2 * zeta * wn;
  this.k = wn * wn;
}

class Spring extends Controller {
  constructor (duration = 500, overshoot = 0) {
    super();
    this.duration(duration)
      .overshoot(overshoot);
  }

  step (current, target, dt, c) {
    if (typeof current === 'string') return current
    c.done = dt === Infinity;
    if (dt === Infinity) return target
    if (dt === 0) return current

    if (dt > 100) dt = 16;

    dt /= 1000;

    // Get the previous velocity
    const velocity = c.velocity || 0;

    // Apply the control to get the new position and store it
    const acceleration = -this.d * velocity - this.k * (current - target);
    const newPosition = current
      + velocity * dt
      + acceleration * dt * dt / 2;

    // Store the velocity
    c.velocity = velocity + acceleration * dt;

    // Figure out if we have converged, and if so, pass the value
    c.done = Math.abs(target - newPosition) + Math.abs(velocity) < 0.002;
    return c.done ? target : newPosition
  }
}

extend(Spring, {
  duration: makeSetterGetter('_duration', recalculate),
  overshoot: makeSetterGetter('_overshoot', recalculate)
});

class PID extends Controller {
  constructor (p = 0.1, i = 0.01, d = 0, windup = 1000) {
    super();
    this.p(p).i(i).d(d).windup(windup);
  }

  step (current, target, dt, c) {
    if (typeof current === 'string') return current
    c.done = dt === Infinity;

    if (dt === Infinity) return target
    if (dt === 0) return current

    const p = target - current;
    let i = (c.integral || 0) + p * dt;
    const d = (p - (c.error || 0)) / dt;
    const windup = this._windup;

    // antiwindup
    if (windup !== false) {
      i = Math.max(-windup, Math.min(i, windup));
    }

    c.error = p;
    c.integral = i;

    c.done = Math.abs(p) < 0.001;

    return c.done ? target : current + (this.P * p + this.I * i + this.D * d)
  }
}

extend(PID, {
  windup: makeSetterGetter('_windup'),
  p: makeSetterGetter('P'),
  i: makeSetterGetter('I'),
  d: makeSetterGetter('D')
});

const segmentParameters = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

const pathHandlers = {
  M: function (c, p, p0) {
    p.x = p0.x = c[0];
    p.y = p0.y = c[1];

    return [ 'M', p.x, p.y ]
  },
  L: function (c, p) {
    p.x = c[0];
    p.y = c[1];
    return [ 'L', c[0], c[1] ]
  },
  H: function (c, p) {
    p.x = c[0];
    return [ 'H', c[0] ]
  },
  V: function (c, p) {
    p.y = c[0];
    return [ 'V', c[0] ]
  },
  C: function (c, p) {
    p.x = c[4];
    p.y = c[5];
    return [ 'C', c[0], c[1], c[2], c[3], c[4], c[5] ]
  },
  S: function (c, p) {
    p.x = c[2];
    p.y = c[3];
    return [ 'S', c[0], c[1], c[2], c[3] ]
  },
  Q: function (c, p) {
    p.x = c[2];
    p.y = c[3];
    return [ 'Q', c[0], c[1], c[2], c[3] ]
  },
  T: function (c, p) {
    p.x = c[0];
    p.y = c[1];
    return [ 'T', c[0], c[1] ]
  },
  Z: function (c, p, p0) {
    p.x = p0.x;
    p.y = p0.y;
    return [ 'Z' ]
  },
  A: function (c, p) {
    p.x = c[5];
    p.y = c[6];
    return [ 'A', c[0], c[1], c[2], c[3], c[4], c[5], c[6] ]
  }
};

const mlhvqtcsaz = 'mlhvqtcsaz'.split('');

for (let i = 0, il = mlhvqtcsaz.length; i < il; ++i) {
  pathHandlers[mlhvqtcsaz[i]] = (function (i) {
    return function (c, p, p0) {
      if (i === 'H') c[0] = c[0] + p.x;
      else if (i === 'V') c[0] = c[0] + p.y;
      else if (i === 'A') {
        c[5] = c[5] + p.x;
        c[6] = c[6] + p.y;
      } else {
        for (let j = 0, jl = c.length; j < jl; ++j) {
          c[j] = c[j] + (j % 2 ? p.y : p.x);
        }
      }

      return pathHandlers[i](c, p, p0)
    }
  })(mlhvqtcsaz[i].toUpperCase());
}

function makeAbsolut (parser) {
  const command = parser.segment[0];
  return pathHandlers[command](parser.segment.slice(1), parser.p, parser.p0)
}

function segmentComplete (parser) {
  return parser.segment.length && parser.segment.length - 1 === segmentParameters[parser.segment[0].toUpperCase()]
}

function startNewSegment (parser, token) {
  parser.inNumber && finalizeNumber(parser, false);
  const pathLetter = isPathLetter.test(token);

  if (pathLetter) {
    parser.segment = [ token ];
  } else {
    const lastCommand = parser.lastCommand;
    const small = lastCommand.toLowerCase();
    const isSmall = lastCommand === small;
    parser.segment = [ small === 'm' ? (isSmall ? 'l' : 'L') : lastCommand ];
  }

  parser.inSegment = true;
  parser.lastCommand = parser.segment[0];

  return pathLetter
}

function finalizeNumber (parser, inNumber) {
  if (!parser.inNumber) throw new Error('Parser Error')
  parser.number && parser.segment.push(parseFloat(parser.number));
  parser.inNumber = inNumber;
  parser.number = '';
  parser.pointSeen = false;
  parser.hasExponent = false;

  if (segmentComplete(parser)) {
    finalizeSegment(parser);
  }
}

function finalizeSegment (parser) {
  parser.inSegment = false;
  if (parser.absolute) {
    parser.segment = makeAbsolut(parser);
  }
  parser.segments.push(parser.segment);
}

function isArcFlag (parser) {
  if (!parser.segment.length) return false
  const isArc = parser.segment[0].toUpperCase() === 'A';
  const length = parser.segment.length;

  return isArc && (length === 4 || length === 5)
}

function isExponential (parser) {
  return parser.lastToken.toUpperCase() === 'E'
}

function pathParser (d, toAbsolute = true) {

  let index = 0;
  let token = '';
  const parser = {
    segment: [],
    inNumber: false,
    number: '',
    lastToken: '',
    inSegment: false,
    segments: [],
    pointSeen: false,
    hasExponent: false,
    absolute: toAbsolute,
    p0: new Point(),
    p: new Point()
  };

  while ((parser.lastToken = token, token = d.charAt(index++))) {
    if (!parser.inSegment) {
      if (startNewSegment(parser, token)) {
        continue
      }
    }

    if (token === '.') {
      if (parser.pointSeen || parser.hasExponent) {
        finalizeNumber(parser, false);
        --index;
        continue
      }
      parser.inNumber = true;
      parser.pointSeen = true;
      parser.number += token;
      continue
    }

    if (!isNaN(parseInt(token))) {

      if (parser.number === '0' || isArcFlag(parser)) {
        parser.inNumber = true;
        parser.number = token;
        finalizeNumber(parser, true);
        continue
      }

      parser.inNumber = true;
      parser.number += token;
      continue
    }

    if (token === ' ' || token === ',') {
      if (parser.inNumber) {
        finalizeNumber(parser, false);
      }
      continue
    }

    if (token === '-') {
      if (parser.inNumber && !isExponential(parser)) {
        finalizeNumber(parser, false);
        --index;
        continue
      }
      parser.number += token;
      parser.inNumber = true;
      continue
    }

    if (token.toUpperCase() === 'E') {
      parser.number += token;
      parser.hasExponent = true;
      continue
    }

    if (isPathLetter.test(token)) {
      if (parser.inNumber) {
        finalizeNumber(parser, false);
      } else if (!segmentComplete(parser)) {
        throw new Error('parser Error')
      } else {
        finalizeSegment(parser);
      }
      --index;
    }
  }

  if (parser.inNumber) {
    finalizeNumber(parser, false);
  }

  if (parser.inSegment && segmentComplete(parser)) {
    finalizeSegment(parser);
  }

  return parser.segments

}

function arrayToString (a) {
  let s = '';
  for (let i = 0, il = a.length; i < il; i++) {
    s += a[i][0];

    if (a[i][1] != null) {
      s += a[i][1];

      if (a[i][2] != null) {
        s += ' ';
        s += a[i][2];

        if (a[i][3] != null) {
          s += ' ';
          s += a[i][3];
          s += ' ';
          s += a[i][4];

          if (a[i][5] != null) {
            s += ' ';
            s += a[i][5];
            s += ' ';
            s += a[i][6];

            if (a[i][7] != null) {
              s += ' ';
              s += a[i][7];
            }
          }
        }
      }
    }
  }

  return s + ' '
}

class PathArray extends SVGArray {
  // Get bounding box of path
  bbox () {
    parser().path.setAttribute('d', this.toString());
    return new Box(parser.nodes.path.getBBox())
  }

  // Move path string
  move (x, y) {
    // get bounding box of current situation
    const box = this.bbox();

    // get relative offset
    x -= box.x;
    y -= box.y;

    if (!isNaN(x) && !isNaN(y)) {
      // move every point
      for (let l, i = this.length - 1; i >= 0; i--) {
        l = this[i][0];

        if (l === 'M' || l === 'L' || l === 'T') {
          this[i][1] += x;
          this[i][2] += y;
        } else if (l === 'H') {
          this[i][1] += x;
        } else if (l === 'V') {
          this[i][1] += y;
        } else if (l === 'C' || l === 'S' || l === 'Q') {
          this[i][1] += x;
          this[i][2] += y;
          this[i][3] += x;
          this[i][4] += y;

          if (l === 'C') {
            this[i][5] += x;
            this[i][6] += y;
          }
        } else if (l === 'A') {
          this[i][6] += x;
          this[i][7] += y;
        }
      }
    }

    return this
  }

  // Absolutize and parse path to array
  parse (d = 'M0 0') {
    if (Array.isArray(d)) {
      d = Array.prototype.concat.apply([], d).toString();
    }

    return pathParser(d)
  }

  // Resize path string
  size (width, height) {
    // get bounding box of current situation
    const box = this.bbox();
    let i, l;

    // If the box width or height is 0 then we ignore
    // transformations on the respective axis
    box.width = box.width === 0 ? 1 : box.width;
    box.height = box.height === 0 ? 1 : box.height;

    // recalculate position of all points according to new size
    for (i = this.length - 1; i >= 0; i--) {
      l = this[i][0];

      if (l === 'M' || l === 'L' || l === 'T') {
        this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x;
        this[i][2] = ((this[i][2] - box.y) * height) / box.height + box.y;
      } else if (l === 'H') {
        this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x;
      } else if (l === 'V') {
        this[i][1] = ((this[i][1] - box.y) * height) / box.height + box.y;
      } else if (l === 'C' || l === 'S' || l === 'Q') {
        this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x;
        this[i][2] = ((this[i][2] - box.y) * height) / box.height + box.y;
        this[i][3] = ((this[i][3] - box.x) * width) / box.width + box.x;
        this[i][4] = ((this[i][4] - box.y) * height) / box.height + box.y;

        if (l === 'C') {
          this[i][5] = ((this[i][5] - box.x) * width) / box.width + box.x;
          this[i][6] = ((this[i][6] - box.y) * height) / box.height + box.y;
        }
      } else if (l === 'A') {
        // resize radii
        this[i][1] = (this[i][1] * width) / box.width;
        this[i][2] = (this[i][2] * height) / box.height;

        // move position values
        this[i][6] = ((this[i][6] - box.x) * width) / box.width + box.x;
        this[i][7] = ((this[i][7] - box.y) * height) / box.height + box.y;
      }
    }

    return this
  }

  // Convert array to string
  toString () {
    return arrayToString(this)
  }

}

const getClassForType = (value) => {
  const type = typeof value;

  if (type === 'number') {
    return SVGNumber
  } else if (type === 'string') {
    if (Color$1.isColor(value)) {
      return Color$1
    } else if (delimiter.test(value)) {
      return isPathLetter.test(value)
        ? PathArray
        : SVGArray
    } else if (numberAndUnit.test(value)) {
      return SVGNumber
    } else {
      return NonMorphable
    }
  } else if (morphableTypes.indexOf(value.constructor) > -1) {
    return value.constructor
  } else if (Array.isArray(value)) {
    return SVGArray
  } else if (type === 'object') {
    return ObjectBag
  } else {
    return NonMorphable
  }
};

class Morphable {
  constructor (stepper) {
    this._stepper = stepper || new Ease('-');

    this._from = null;
    this._to = null;
    this._type = null;
    this._context = null;
    this._morphObj = null;
  }

  at (pos) {
    return this._morphObj.morph(this._from, this._to, pos, this._stepper, this._context)

  }

  done () {
    const complete = this._context
      .map(this._stepper.done)
      .reduce(function (last, curr) {
        return last && curr
      }, true);
    return complete
  }

  from (val) {
    if (val == null) {
      return this._from
    }

    this._from = this._set(val);
    return this
  }

  stepper (stepper) {
    if (stepper == null) return this._stepper
    this._stepper = stepper;
    return this
  }

  to (val) {
    if (val == null) {
      return this._to
    }

    this._to = this._set(val);
    return this
  }

  type (type) {
    // getter
    if (type == null) {
      return this._type
    }

    // setter
    this._type = type;
    return this
  }

  _set (value) {
    if (!this._type) {
      this.type(getClassForType(value));
    }

    let result = (new this._type(value));
    if (this._type === Color$1) {
      result = this._to
        ? result[this._to[4]]()
        : this._from
          ? result[this._from[4]]()
          : result;
    }

    if (this._type === ObjectBag) {
      result = this._to
        ? result.align(this._to)
        : this._from
          ? result.align(this._from)
          : result;
    }

    result = result.toConsumable();

    this._morphObj = this._morphObj || new this._type();
    this._context = this._context
      || Array.apply(null, Array(result.length))
        .map(Object)
        .map(function (o) {
          o.done = true;
          return o
        });
    return result
  }

}

class NonMorphable {
  constructor (...args) {
    this.init(...args);
  }

  init (val) {
    val = Array.isArray(val) ? val[0] : val;
    this.value = val;
    return this
  }

  toArray () {
    return [ this.value ]
  }

  valueOf () {
    return this.value
  }

}

class TransformBag {
  constructor (...args) {
    this.init(...args);
  }

  init (obj) {
    if (Array.isArray(obj)) {
      obj = {
        scaleX: obj[0],
        scaleY: obj[1],
        shear: obj[2],
        rotate: obj[3],
        translateX: obj[4],
        translateY: obj[5],
        originX: obj[6],
        originY: obj[7]
      };
    }

    Object.assign(this, TransformBag.defaults, obj);
    return this
  }

  toArray () {
    const v = this;

    return [
      v.scaleX,
      v.scaleY,
      v.shear,
      v.rotate,
      v.translateX,
      v.translateY,
      v.originX,
      v.originY
    ]
  }
}

TransformBag.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};

const sortByKey = (a, b) => {
  return (a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0))
};

class ObjectBag {
  constructor (...args) {
    this.init(...args);
  }

  align (other) {
    const values = this.values;
    for (let i = 0, il = values.length; i < il; ++i) {

      // If the type is the same we only need to check if the color is in the correct format
      if (values[i + 1] === other[i + 1]) {
        if (values[i + 1] === Color$1 && other[i + 7] !== values[i + 7]) {
          const space = other[i + 7];
          const color = new Color$1(this.values.splice(i + 3, 5))[space]().toArray();
          this.values.splice(i + 3, 0, ...color);
        }

        i += values[i + 2] + 2;
        continue
      }

      if (!other[i + 1]) {
        return this
      }

      // The types differ, so we overwrite the new type with the old one
      // And initialize it with the types default (e.g. black for color or 0 for number)
      const defaultObject = new (other[i + 1])().toArray();

      // Than we fix the values array
      const toDelete = (values[i + 2]) + 3;

      values.splice(i, toDelete, other[i], other[i + 1], other[i + 2], ...defaultObject);

      i += values[i + 2] + 2;
    }
    return this
  }

  init (objOrArr) {
    this.values = [];

    if (Array.isArray(objOrArr)) {
      this.values = objOrArr.slice();
      return
    }

    objOrArr = objOrArr || {};
    const entries = [];

    for (const i in objOrArr) {
      const Type = getClassForType(objOrArr[i]);
      const val = new Type(objOrArr[i]).toArray();
      entries.push([ i, Type, val.length, ...val ]);
    }

    entries.sort(sortByKey);

    this.values = entries.reduce((last, curr) => last.concat(curr), []);
    return this
  }

  toArray () {
    return this.values
  }

  valueOf () {
    const obj = {};
    const arr = this.values;

    // for (var i = 0, len = arr.length; i < len; i += 2) {
    while (arr.length) {
      const key = arr.shift();
      const Type = arr.shift();
      const num = arr.shift();
      const values = arr.splice(0, num);
      obj[key] = new Type(values);// .valueOf()
    }

    return obj
  }

}

const morphableTypes = [
  NonMorphable,
  TransformBag,
  ObjectBag
];

function registerMorphableType (type = []) {
  morphableTypes.push(...[].concat(type));
}

function makeMorphable () {
  extend(morphableTypes, {
    to (val) {
      return new Morphable()
        .type(this.constructor)
        .from(this.toArray())// this.valueOf())
        .to(val)
    },
    fromArray (arr) {
      this.init(arr);
      return this
    },
    toConsumable () {
      return this.toArray()
    },
    morph (from, to, pos, stepper, context) {
      const mapper = function (i, index) {
        return stepper.step(i, to[index], pos, context[index], context)
      };

      return this.fromArray(from.map(mapper))
    }
  });
}

class Path extends Shape {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('path', node), attrs);
  }

  // Get array
  array () {
    return this._array || (this._array = new PathArray(this.attr('d')))
  }

  // Clear array cache
  clear () {
    delete this._array;
    return this
  }

  // Set height of element
  height (height) {
    return height == null ? this.bbox().height : this.size(this.bbox().width, height)
  }

  // Move by left top corner
  move (x, y) {
    return this.attr('d', this.array().move(x, y))
  }

  // Plot new path
  plot (d) {
    return (d == null)
      ? this.array()
      : this.clear().attr('d', typeof d === 'string' ? d : (this._array = new PathArray(d)))
  }

  // Set element size to given width and height
  size (width, height) {
    const p = proportionalSize(this, width, height);
    return this.attr('d', this.array().size(p.width, p.height))
  }

  // Set width of element
  width (width) {
    return width == null ? this.bbox().width : this.size(width, this.bbox().height)
  }

  // Move by left top corner over x-axis
  x (x) {
    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
  }

  // Move by left top corner over y-axis
  y (y) {
    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
  }

}

// Define morphable array
Path.prototype.MorphArray = PathArray;

// Add parent method
registerMethods({
  Container: {
    // Create a wrapped path element
    path: wrapWithAttrCheck(function (d) {
      // make sure plot is called as a setter
      return this.put(new Path()).plot(d || new PathArray())
    })
  }
});

register$1(Path, 'Path');

// Get array
function array$1 () {
  return this._array || (this._array = new PointArray(this.attr('points')))
}

// Clear array cache
function clear () {
  delete this._array;
  return this
}

// Move by left top corner
function move$2 (x, y) {
  return this.attr('points', this.array().move(x, y))
}

// Plot new path
function plot (p) {
  return (p == null)
    ? this.array()
    : this.clear().attr('points', typeof p === 'string'
      ? p
      : (this._array = new PointArray(p)))
}

// Set element size to given width and height
function size$1 (width, height) {
  const p = proportionalSize(this, width, height);
  return this.attr('points', this.array().size(p.width, p.height))
}

var poly = /*#__PURE__*/Object.freeze({
  __proto__: null,
  array: array$1,
  clear: clear,
  move: move$2,
  plot: plot,
  size: size$1
});

class Polygon extends Shape {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('polygon', node), attrs);
  }
}

registerMethods({
  Container: {
    // Create a wrapped polygon element
    polygon: wrapWithAttrCheck(function (p) {
      // make sure plot is called as a setter
      return this.put(new Polygon()).plot(p || new PointArray())
    })
  }
});

extend(Polygon, pointed);
extend(Polygon, poly);
register$1(Polygon, 'Polygon');

class Polyline extends Shape {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('polyline', node), attrs);
  }
}

registerMethods({
  Container: {
    // Create a wrapped polygon element
    polyline: wrapWithAttrCheck(function (p) {
      // make sure plot is called as a setter
      return this.put(new Polyline()).plot(p || new PointArray())
    })
  }
});

extend(Polyline, pointed);
extend(Polyline, poly);
register$1(Polyline, 'Polyline');

class Rect extends Shape {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('rect', node), attrs);
  }
}

extend(Rect, { rx, ry });

registerMethods({
  Container: {
    // Create a rect element
    rect: wrapWithAttrCheck(function (width, height) {
      return this.put(new Rect()).size(width, height)
    })
  }
});

register$1(Rect, 'Rect');

class Queue {
  constructor () {
    this._first = null;
    this._last = null;
  }

  // Shows us the first item in the list
  first () {
    return this._first && this._first.value
  }

  // Shows us the last item in the list
  last () {
    return this._last && this._last.value
  }

  push (value) {
    // An item stores an id and the provided value
    const item = typeof value.next !== 'undefined' ? value : { value: value, next: null, prev: null };

    // Deal with the queue being empty or populated
    if (this._last) {
      item.prev = this._last;
      this._last.next = item;
      this._last = item;
    } else {
      this._last = item;
      this._first = item;
    }

    // Return the current item
    return item
  }

  // Removes the item that was returned from the push
  remove (item) {
    // Relink the previous item
    if (item.prev) item.prev.next = item.next;
    if (item.next) item.next.prev = item.prev;
    if (item === this._last) this._last = item.prev;
    if (item === this._first) this._first = item.next;

    // Invalidate item
    item.prev = null;
    item.next = null;
  }

  shift () {
    // Check if we have a value
    const remove = this._first;
    if (!remove) return null

    // If we do, remove it and relink things
    this._first = remove.next;
    if (this._first) this._first.prev = null;
    this._last = this._first ? this._last : null;
    return remove.value
  }

}

const Animator = {
  nextDraw: null,
  frames: new Queue(),
  timeouts: new Queue(),
  immediates: new Queue(),
  timer: () => globals.window.performance || globals.window.Date,
  transforms: [],

  frame (fn) {
    // Store the node
    const node = Animator.frames.push({ run: fn });

    // Request an animation frame if we don't have one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    }

    // Return the node so we can remove it easily
    return node
  },

  timeout (fn, delay) {
    delay = delay || 0;

    // Work out when the event should fire
    const time = Animator.timer().now() + delay;

    // Add the timeout to the end of the queue
    const node = Animator.timeouts.push({ run: fn, time: time });

    // Request another animation frame if we need one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    }

    return node
  },

  immediate (fn) {
    // Add the immediate fn to the end of the queue
    const node = Animator.immediates.push(fn);
    // Request another animation frame if we need one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    }

    return node
  },

  cancelFrame (node) {
    node != null && Animator.frames.remove(node);
  },

  clearTimeout (node) {
    node != null && Animator.timeouts.remove(node);
  },

  cancelImmediate (node) {
    node != null && Animator.immediates.remove(node);
  },

  _draw (now) {
    // Run all the timeouts we can run, if they are not ready yet, add them
    // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
    let nextTimeout = null;
    const lastTimeout = Animator.timeouts.last();
    while ((nextTimeout = Animator.timeouts.shift())) {
      // Run the timeout if its time, or push it to the end
      if (now >= nextTimeout.time) {
        nextTimeout.run();
      } else {
        Animator.timeouts.push(nextTimeout);
      }

      // If we hit the last item, we should stop shifting out more items
      if (nextTimeout === lastTimeout) break
    }

    // Run all of the animation frames
    let nextFrame = null;
    const lastFrame = Animator.frames.last();
    while ((nextFrame !== lastFrame) && (nextFrame = Animator.frames.shift())) {
      nextFrame.run(now);
    }

    let nextImmediate = null;
    while ((nextImmediate = Animator.immediates.shift())) {
      nextImmediate();
    }

    // If we have remaining timeouts or frames, draw until we don't anymore
    Animator.nextDraw = Animator.timeouts.first() || Animator.frames.first()
      ? globals.window.requestAnimationFrame(Animator._draw)
      : null;
  }
};

const makeSchedule = function (runnerInfo) {
  const start = runnerInfo.start;
  const duration = runnerInfo.runner.duration();
  const end = start + duration;
  return { start: start, duration: duration, end: end, runner: runnerInfo.runner }
};

const defaultSource = function () {
  const w = globals.window;
  return (w.performance || w.Date).now()
};

class Timeline extends EventTarget {
  // Construct a new timeline on the given element
  constructor (timeSource = defaultSource) {
    super();

    this._timeSource = timeSource;

    // Store the timing variables
    this._startTime = 0;
    this._speed = 1.0;

    // Determines how long a runner is hold in memory. Can be a dt or true/false
    this._persist = 0;

    // Keep track of the running animations and their starting parameters
    this._nextFrame = null;
    this._paused = true;
    this._runners = [];
    this._runnerIds = [];
    this._lastRunnerId = -1;
    this._time = 0;
    this._lastSourceTime = 0;
    this._lastStepTime = 0;

    // Make sure that step is always called in class context
    this._step = this._stepFn.bind(this, false);
    this._stepImmediate = this._stepFn.bind(this, true);
  }

  active () {
    return !!this._nextFrame
  }

  finish () {
    // Go to end and pause
    this.time(this.getEndTimeOfTimeline() + 1);
    return this.pause()
  }

  // Calculates the end of the timeline
  getEndTime () {
    const lastRunnerInfo = this.getLastRunnerInfo();
    const lastDuration = lastRunnerInfo ? lastRunnerInfo.runner.duration() : 0;
    const lastStartTime = lastRunnerInfo ? lastRunnerInfo.start : this._time;
    return lastStartTime + lastDuration
  }

  getEndTimeOfTimeline () {
    const endTimes = this._runners.map((i) => i.start + i.runner.duration());
    return Math.max(0, ...endTimes)
  }

  getLastRunnerInfo () {
    return this.getRunnerInfoById(this._lastRunnerId)
  }

  getRunnerInfoById (id) {
    return this._runners[this._runnerIds.indexOf(id)] || null
  }

  pause () {
    this._paused = true;
    return this._continue()
  }

  persist (dtOrForever) {
    if (dtOrForever == null) return this._persist
    this._persist = dtOrForever;
    return this
  }

  play () {
    // Now make sure we are not paused and continue the animation
    this._paused = false;
    return this.updateTime()._continue()
  }

  reverse (yes) {
    const currentSpeed = this.speed();
    if (yes == null) return this.speed(-currentSpeed)

    const positive = Math.abs(currentSpeed);
    return this.speed(yes ? -positive : positive)
  }

  // schedules a runner on the timeline
  schedule (runner, delay, when) {
    if (runner == null) {
      return this._runners.map(makeSchedule)
    }

    // The start time for the next animation can either be given explicitly,
    // derived from the current timeline time or it can be relative to the
    // last start time to chain animations directly

    let absoluteStartTime = 0;
    const endTime = this.getEndTime();
    delay = delay || 0;

    // Work out when to start the animation
    if (when == null || when === 'last' || when === 'after') {
      // Take the last time and increment
      absoluteStartTime = endTime;
    } else if (when === 'absolute' || when === 'start') {
      absoluteStartTime = delay;
      delay = 0;
    } else if (when === 'now') {
      absoluteStartTime = this._time;
    } else if (when === 'relative') {
      const runnerInfo = this.getRunnerInfoById(runner.id);
      if (runnerInfo) {
        absoluteStartTime = runnerInfo.start + delay;
        delay = 0;
      }
    } else if (when === 'with-last') {
      const lastRunnerInfo = this.getLastRunnerInfo();
      const lastStartTime = lastRunnerInfo ? lastRunnerInfo.start : this._time;
      absoluteStartTime = lastStartTime;
    } else {
      throw new Error('Invalid value for the "when" parameter')
    }

    // Manage runner
    runner.unschedule();
    runner.timeline(this);

    const persist = runner.persist();
    const runnerInfo = {
      persist: persist === null ? this._persist : persist,
      start: absoluteStartTime + delay,
      runner
    };

    this._lastRunnerId = runner.id;

    this._runners.push(runnerInfo);
    this._runners.sort((a, b) => a.start - b.start);
    this._runnerIds = this._runners.map(info => info.runner.id);

    this.updateTime()._continue();
    return this
  }

  seek (dt) {
    return this.time(this._time + dt)
  }

  source (fn) {
    if (fn == null) return this._timeSource
    this._timeSource = fn;
    return this
  }

  speed (speed) {
    if (speed == null) return this._speed
    this._speed = speed;
    return this
  }

  stop () {
    // Go to start and pause
    this.time(0);
    return this.pause()
  }

  time (time) {
    if (time == null) return this._time
    this._time = time;
    return this._continue(true)
  }

  // Remove the runner from this timeline
  unschedule (runner) {
    const index = this._runnerIds.indexOf(runner.id);
    if (index < 0) return this

    this._runners.splice(index, 1);
    this._runnerIds.splice(index, 1);

    runner.timeline(null);
    return this
  }

  // Makes sure, that after pausing the time doesn't jump
  updateTime () {
    if (!this.active()) {
      this._lastSourceTime = this._timeSource();
    }
    return this
  }

  // Checks if we are running and continues the animation
  _continue (immediateStep = false) {
    Animator.cancelFrame(this._nextFrame);
    this._nextFrame = null;

    if (immediateStep) return this._stepImmediate()
    if (this._paused) return this

    this._nextFrame = Animator.frame(this._step);
    return this
  }

  _stepFn (immediateStep = false) {
    // Get the time delta from the last time and update the time
    const time = this._timeSource();
    let dtSource = time - this._lastSourceTime;

    if (immediateStep) dtSource = 0;

    const dtTime = this._speed * dtSource + (this._time - this._lastStepTime);
    this._lastSourceTime = time;

    // Only update the time if we use the timeSource.
    // Otherwise use the current time
    if (!immediateStep) {
      // Update the time
      this._time += dtTime;
      this._time = this._time < 0 ? 0 : this._time;
    }
    this._lastStepTime = this._time;
    this.fire('time', this._time);

    // This is for the case that the timeline was seeked so that the time
    // is now before the startTime of the runner. Thats why we need to set
    // the runner to position 0

    // FIXME:
    // However, reseting in insertion order leads to bugs. Considering the case,
    // where 2 runners change the same attribute but in different times,
    // reseting both of them will lead to the case where the later defined
    // runner always wins the reset even if the other runner started earlier
    // and therefore should win the attribute battle
    // this can be solved by reseting them backwards
    for (let k = this._runners.length; k--;) {
      // Get and run the current runner and ignore it if its inactive
      const runnerInfo = this._runners[k];
      const runner = runnerInfo.runner;

      // Make sure that we give the actual difference
      // between runner start time and now
      const dtToStart = this._time - runnerInfo.start;

      // Dont run runner if not started yet
      // and try to reset it
      if (dtToStart <= 0) {
        runner.reset();
      }
    }

    // Run all of the runners directly
    let runnersLeft = false;
    for (let i = 0, len = this._runners.length; i < len; i++) {
      // Get and run the current runner and ignore it if its inactive
      const runnerInfo = this._runners[i];
      const runner = runnerInfo.runner;
      let dt = dtTime;

      // Make sure that we give the actual difference
      // between runner start time and now
      const dtToStart = this._time - runnerInfo.start;

      // Dont run runner if not started yet
      if (dtToStart <= 0) {
        runnersLeft = true;
        continue
      } else if (dtToStart < dt) {
        // Adjust dt to make sure that animation is on point
        dt = dtToStart;
      }

      if (!runner.active()) continue

      // If this runner is still going, signal that we need another animation
      // frame, otherwise, remove the completed runner
      const finished = runner.step(dt).done;
      if (!finished) {
        runnersLeft = true;
        // continue
      } else if (runnerInfo.persist !== true) {
        // runner is finished. And runner might get removed
        const endTime = runner.duration() - runner.time() + this._time;

        if (endTime + runnerInfo.persist < this._time) {
          // Delete runner and correct index
          runner.unschedule();
          --i;
          --len;
        }
      }
    }

    // Basically: we continue when there are runners right from us in time
    // when -->, and when runners are left from us when <--
    if ((runnersLeft && !(this._speed < 0 && this._time === 0)) || (this._runnerIds.length && this._speed < 0 && this._time > 0)) {
      this._continue();
    } else {
      this.pause();
      this.fire('finished');
    }

    return this
  }

}

registerMethods({
  Element: {
    timeline: function (timeline) {
      if (timeline == null) {
        this._timeline = (this._timeline || new Timeline());
        return this._timeline
      } else {
        this._timeline = timeline;
        return this
      }
    }
  }
});

class Runner extends EventTarget {
  constructor (options) {
    super();

    // Store a unique id on the runner, so that we can identify it later
    this.id = Runner.id++;

    // Ensure a default value
    options = options == null
      ? timeline.duration
      : options;

    // Ensure that we get a controller
    options = typeof options === 'function'
      ? new Controller(options)
      : options;

    // Declare all of the variables
    this._element = null;
    this._timeline = null;
    this.done = false;
    this._queue = [];

    // Work out the stepper and the duration
    this._duration = typeof options === 'number' && options;
    this._isDeclarative = options instanceof Controller;
    this._stepper = this._isDeclarative ? options : new Ease();

    // We copy the current values from the timeline because they can change
    this._history = {};

    // Store the state of the runner
    this.enabled = true;
    this._time = 0;
    this._lastTime = 0;

    // At creation, the runner is in reseted state
    this._reseted = true;

    // Save transforms applied to this runner
    this.transforms = new Matrix();
    this.transformId = 1;

    // Looping variables
    this._haveReversed = false;
    this._reverse = false;
    this._loopsDone = 0;
    this._swing = false;
    this._wait = 0;
    this._times = 1;

    this._frameId = null;

    // Stores how long a runner is stored after beeing done
    this._persist = this._isDeclarative ? true : null;
  }

  static sanitise (duration, delay, when) {
    // Initialise the default parameters
    let times = 1;
    let swing = false;
    let wait = 0;
    duration = duration || timeline.duration;
    delay = delay || timeline.delay;
    when = when || 'last';

    // If we have an object, unpack the values
    if (typeof duration === 'object' && !(duration instanceof Stepper)) {
      delay = duration.delay || delay;
      when = duration.when || when;
      swing = duration.swing || swing;
      times = duration.times || times;
      wait = duration.wait || wait;
      duration = duration.duration || timeline.duration;
    }

    return {
      duration: duration,
      delay: delay,
      swing: swing,
      times: times,
      wait: wait,
      when: when
    }
  }

  active (enabled) {
    if (enabled == null) return this.enabled
    this.enabled = enabled;
    return this
  }

  /*
  Private Methods
  ===============
  Methods that shouldn't be used externally
  */
  addTransform (transform, index) {
    this.transforms.lmultiplyO(transform);
    return this
  }

  after (fn) {
    return this.on('finished', fn)
  }

  animate (duration, delay, when) {
    const o = Runner.sanitise(duration, delay, when);
    const runner = new Runner(o.duration);
    if (this._timeline) runner.timeline(this._timeline);
    if (this._element) runner.element(this._element);
    return runner.loop(o).schedule(o.delay, o.when)
  }

  clearTransform () {
    this.transforms = new Matrix();
    return this
  }

  // TODO: Keep track of all transformations so that deletion is faster
  clearTransformsFromQueue () {
    if (!this.done || !this._timeline || !this._timeline._runnerIds.includes(this.id)) {
      this._queue = this._queue.filter((item) => {
        return !item.isTransform
      });
    }
  }

  delay (delay) {
    return this.animate(0, delay)
  }

  duration () {
    return this._times * (this._wait + this._duration) - this._wait
  }

  during (fn) {
    return this.queue(null, fn)
  }

  ease (fn) {
    this._stepper = new Ease(fn);
    return this
  }
  /*
  Runner Definitions
  ==================
  These methods help us define the runtime behaviour of the Runner or they
  help us make new runners from the current runner
  */

  element (element) {
    if (element == null) return this._element
    this._element = element;
    element._prepareRunner();
    return this
  }

  finish () {
    return this.step(Infinity)
  }

  loop (times, swing, wait) {
    // Deal with the user passing in an object
    if (typeof times === 'object') {
      swing = times.swing;
      wait = times.wait;
      times = times.times;
    }

    // Sanitise the values and store them
    this._times = times || Infinity;
    this._swing = swing || false;
    this._wait = wait || 0;

    // Allow true to be passed
    if (this._times === true) { this._times = Infinity; }

    return this
  }

  loops (p) {
    const loopDuration = this._duration + this._wait;
    if (p == null) {
      const loopsDone = Math.floor(this._time / loopDuration);
      const relativeTime = (this._time - loopsDone * loopDuration);
      const position = relativeTime / this._duration;
      return Math.min(loopsDone + position, this._times)
    }
    const whole = Math.floor(p);
    const partial = p % 1;
    const time = loopDuration * whole + this._duration * partial;
    return this.time(time)
  }

  persist (dtOrForever) {
    if (dtOrForever == null) return this._persist
    this._persist = dtOrForever;
    return this
  }

  position (p) {
    // Get all of the variables we need
    const x = this._time;
    const d = this._duration;
    const w = this._wait;
    const t = this._times;
    const s = this._swing;
    const r = this._reverse;
    let position;

    if (p == null) {
      /*
      This function converts a time to a position in the range [0, 1]
      The full explanation can be found in this desmos demonstration
        https://www.desmos.com/calculator/u4fbavgche
      The logic is slightly simplified here because we can use booleans
      */

      // Figure out the value without thinking about the start or end time
      const f = function (x) {
        const swinging = s * Math.floor(x % (2 * (w + d)) / (w + d));
        const backwards = (swinging && !r) || (!swinging && r);
        const uncliped = Math.pow(-1, backwards) * (x % (w + d)) / d + backwards;
        const clipped = Math.max(Math.min(uncliped, 1), 0);
        return clipped
      };

      // Figure out the value by incorporating the start time
      const endTime = t * (w + d) - w;
      position = x <= 0
        ? Math.round(f(1e-5))
        : x < endTime
          ? f(x)
          : Math.round(f(endTime - 1e-5));
      return position
    }

    // Work out the loops done and add the position to the loops done
    const loopsDone = Math.floor(this.loops());
    const swingForward = s && (loopsDone % 2 === 0);
    const forwards = (swingForward && !r) || (r && swingForward);
    position = loopsDone + (forwards ? p : 1 - p);
    return this.loops(position)
  }

  progress (p) {
    if (p == null) {
      return Math.min(1, this._time / this.duration())
    }
    return this.time(p * this.duration())
  }

  /*
  Basic Functionality
  ===================
  These methods allow us to attach basic functions to the runner directly
  */
  queue (initFn, runFn, retargetFn, isTransform) {
    this._queue.push({
      initialiser: initFn || noop$2,
      runner: runFn || noop$2,
      retarget: retargetFn,
      isTransform: isTransform,
      initialised: false,
      finished: false
    });
    const timeline = this.timeline();
    timeline && this.timeline()._continue();
    return this
  }

  reset () {
    if (this._reseted) return this
    this.time(0);
    this._reseted = true;
    return this
  }

  reverse (reverse) {
    this._reverse = reverse == null ? !this._reverse : reverse;
    return this
  }

  schedule (timeline, delay, when) {
    // The user doesn't need to pass a timeline if we already have one
    if (!(timeline instanceof Timeline)) {
      when = delay;
      delay = timeline;
      timeline = this.timeline();
    }

    // If there is no timeline, yell at the user...
    if (!timeline) {
      throw Error('Runner cannot be scheduled without timeline')
    }

    // Schedule the runner on the timeline provided
    timeline.schedule(this, delay, when);
    return this
  }

  step (dt) {
    // If we are inactive, this stepper just gets skipped
    if (!this.enabled) return this

    // Update the time and get the new position
    dt = dt == null ? 16 : dt;
    this._time += dt;
    const position = this.position();

    // Figure out if we need to run the stepper in this frame
    const running = this._lastPosition !== position && this._time >= 0;
    this._lastPosition = position;

    // Figure out if we just started
    const duration = this.duration();
    const justStarted = this._lastTime <= 0 && this._time > 0;
    const justFinished = this._lastTime < duration && this._time >= duration;

    this._lastTime = this._time;
    if (justStarted) {
      this.fire('start', this);
    }

    // Work out if the runner is finished set the done flag here so animations
    // know, that they are running in the last step (this is good for
    // transformations which can be merged)
    const declarative = this._isDeclarative;
    this.done = !declarative && !justFinished && this._time >= duration;

    // Runner is running. So its not in reseted state anymore
    this._reseted = false;

    let converged = false;
    // Call initialise and the run function
    if (running || declarative) {
      this._initialise(running);

      // clear the transforms on this runner so they dont get added again and again
      this.transforms = new Matrix();
      converged = this._run(declarative ? dt : position);

      this.fire('step', this);
    }
    // correct the done flag here
    // declaritive animations itself know when they converged
    this.done = this.done || (converged && declarative);
    if (justFinished) {
      this.fire('finished', this);
    }
    return this
  }

  /*
  Runner animation methods
  ========================
  Control how the animation plays
  */
  time (time) {
    if (time == null) {
      return this._time
    }
    const dt = time - this._time;
    this.step(dt);
    return this
  }

  timeline (timeline) {
    // check explicitly for undefined so we can set the timeline to null
    if (typeof timeline === 'undefined') return this._timeline
    this._timeline = timeline;
    return this
  }

  unschedule () {
    const timeline = this.timeline();
    timeline && timeline.unschedule(this);
    return this
  }

  // Run each initialise function in the runner if required
  _initialise (running) {
    // If we aren't running, we shouldn't initialise when not declarative
    if (!running && !this._isDeclarative) return

    // Loop through all of the initialisers
    for (let i = 0, len = this._queue.length; i < len; ++i) {
      // Get the current initialiser
      const current = this._queue[i];

      // Determine whether we need to initialise
      const needsIt = this._isDeclarative || (!current.initialised && running);
      running = !current.finished;

      // Call the initialiser if we need to
      if (needsIt && running) {
        current.initialiser.call(this);
        current.initialised = true;
      }
    }
  }

  // Save a morpher to the morpher list so that we can retarget it later
  _rememberMorpher (method, morpher) {
    this._history[method] = {
      morpher: morpher,
      caller: this._queue[this._queue.length - 1]
    };

    // We have to resume the timeline in case a controller
    // is already done without being ever run
    // This can happen when e.g. this is done:
    //    anim = el.animate(new SVG.Spring)
    // and later
    //    anim.move(...)
    if (this._isDeclarative) {
      const timeline = this.timeline();
      timeline && timeline.play();
    }
  }

  // Try to set the target for a morpher if the morpher exists, otherwise
  // Run each run function for the position or dt given
  _run (positionOrDt) {
    // Run all of the _queue directly
    let allfinished = true;
    for (let i = 0, len = this._queue.length; i < len; ++i) {
      // Get the current function to run
      const current = this._queue[i];

      // Run the function if its not finished, we keep track of the finished
      // flag for the sake of declarative _queue
      const converged = current.runner.call(this, positionOrDt);
      current.finished = current.finished || (converged === true);
      allfinished = allfinished && current.finished;
    }

    // We report when all of the constructors are finished
    return allfinished
  }

  // do nothing and return false
  _tryRetarget (method, target, extra) {
    if (this._history[method]) {
      // if the last method wasnt even initialised, throw it away
      if (!this._history[method].caller.initialised) {
        const index = this._queue.indexOf(this._history[method].caller);
        this._queue.splice(index, 1);
        return false
      }

      // for the case of transformations, we use the special retarget function
      // which has access to the outer scope
      if (this._history[method].caller.retarget) {
        this._history[method].caller.retarget.call(this, target, extra);
        // for everything else a simple morpher change is sufficient
      } else {
        this._history[method].morpher.to(target);
      }

      this._history[method].caller.finished = false;
      const timeline = this.timeline();
      timeline && timeline.play();
      return true
    }
    return false
  }

}

Runner.id = 0;

class FakeRunner {
  constructor (transforms = new Matrix(), id = -1, done = true) {
    this.transforms = transforms;
    this.id = id;
    this.done = done;
  }

  clearTransformsFromQueue () { }
}

extend([ Runner, FakeRunner ], {
  mergeWith (runner) {
    return new FakeRunner(
      runner.transforms.lmultiply(this.transforms),
      runner.id
    )
  }
});

// FakeRunner.emptyRunner = new FakeRunner()

const lmultiply = (last, curr) => last.lmultiplyO(curr);
const getRunnerTransform = (runner) => runner.transforms;

function mergeTransforms () {
  // Find the matrix to apply to the element and apply it
  const runners = this._transformationRunners.runners;
  const netTransform = runners
    .map(getRunnerTransform)
    .reduce(lmultiply, new Matrix());

  this.transform(netTransform);

  this._transformationRunners.merge();

  if (this._transformationRunners.length() === 1) {
    this._frameId = null;
  }
}

class RunnerArray {
  constructor () {
    this.runners = [];
    this.ids = [];
  }

  add (runner) {
    if (this.runners.includes(runner)) return
    const id = runner.id + 1;

    this.runners.push(runner);
    this.ids.push(id);

    return this
  }

  clearBefore (id) {
    const deleteCnt = this.ids.indexOf(id + 1) || 1;
    this.ids.splice(0, deleteCnt, 0);
    this.runners.splice(0, deleteCnt, new FakeRunner())
      .forEach((r) => r.clearTransformsFromQueue());
    return this
  }

  edit (id, newRunner) {
    const index = this.ids.indexOf(id + 1);
    this.ids.splice(index, 1, id + 1);
    this.runners.splice(index, 1, newRunner);
    return this
  }

  getByID (id) {
    return this.runners[this.ids.indexOf(id + 1)]
  }

  length () {
    return this.ids.length
  }

  merge () {
    let lastRunner = null;
    for (let i = 0; i < this.runners.length; ++i) {
      const runner = this.runners[i];

      const condition = lastRunner
        && runner.done && lastRunner.done
        // don't merge runner when persisted on timeline
        && (!runner._timeline || !runner._timeline._runnerIds.includes(runner.id))
        && (!lastRunner._timeline || !lastRunner._timeline._runnerIds.includes(lastRunner.id));

      if (condition) {
        // the +1 happens in the function
        this.remove(runner.id);
        const newRunner = runner.mergeWith(lastRunner);
        this.edit(lastRunner.id, newRunner);
        lastRunner = newRunner;
        --i;
      } else {
        lastRunner = runner;
      }
    }

    return this
  }

  remove (id) {
    const index = this.ids.indexOf(id + 1);
    this.ids.splice(index, 1);
    this.runners.splice(index, 1);
    return this
  }

}

registerMethods({
  Element: {
    animate (duration, delay, when) {
      const o = Runner.sanitise(duration, delay, when);
      const timeline = this.timeline();
      return new Runner(o.duration)
        .loop(o)
        .element(this)
        .timeline(timeline.play())
        .schedule(o.delay, o.when)
    },

    delay (by, when) {
      return this.animate(0, by, when)
    },

    // this function searches for all runners on the element and deletes the ones
    // which run before the current one. This is because absolute transformations
    // overwfrite anything anyway so there is no need to waste time computing
    // other runners
    _clearTransformRunnersBefore (currentRunner) {
      this._transformationRunners.clearBefore(currentRunner.id);
    },

    _currentTransform (current) {
      return this._transformationRunners.runners
        // we need the equal sign here to make sure, that also transformations
        // on the same runner which execute before the current transformation are
        // taken into account
        .filter((runner) => runner.id <= current.id)
        .map(getRunnerTransform)
        .reduce(lmultiply, new Matrix())
    },

    _addRunner (runner) {
      this._transformationRunners.add(runner);

      // Make sure that the runner merge is executed at the very end of
      // all Animator functions. Thats why we use immediate here to execute
      // the merge right after all frames are run
      Animator.cancelImmediate(this._frameId);
      this._frameId = Animator.immediate(mergeTransforms.bind(this));
    },

    _prepareRunner () {
      if (this._frameId == null) {
        this._transformationRunners = new RunnerArray()
          .add(new FakeRunner(new Matrix(this)));
      }
    }
  }
});

// Will output the elements from array A that are not in the array B
const difference = (a, b) => a.filter(x => !b.includes(x));

extend(Runner, {
  attr (a, v) {
    return this.styleAttr('attr', a, v)
  },

  // Add animatable styles
  css (s, v) {
    return this.styleAttr('css', s, v)
  },

  styleAttr (type, nameOrAttrs, val) {
    if (typeof nameOrAttrs === 'string') {
      return this.styleAttr(type, { [nameOrAttrs]: val })
    }

    let attrs = nameOrAttrs;
    if (this._tryRetarget(type, attrs)) return this

    let morpher = new Morphable(this._stepper).to(attrs);
    let keys = Object.keys(attrs);

    this.queue(function () {
      morpher = morpher.from(this.element()[type](keys));
    }, function (pos) {
      this.element()[type](morpher.at(pos).valueOf());
      return morpher.done()
    }, function (newToAttrs) {

      // Check if any new keys were added
      const newKeys = Object.keys(newToAttrs);
      const differences = difference(newKeys, keys);

      // If their are new keys, initialize them and add them to morpher
      if (differences.length) {
        // Get the values
        const addedFromAttrs = this.element()[type](differences);

        // Get the already initialized values
        const oldFromAttrs = new ObjectBag(morpher.from()).valueOf();

        // Merge old and new
        Object.assign(oldFromAttrs, addedFromAttrs);
        morpher.from(oldFromAttrs);
      }

      // Get the object from the morpher
      const oldToAttrs = new ObjectBag(morpher.to()).valueOf();

      // Merge in new attributes
      Object.assign(oldToAttrs, newToAttrs);

      // Change morpher target
      morpher.to(oldToAttrs);

      // Make sure that we save the work we did so we don't need it to do again
      keys = newKeys;
      attrs = newToAttrs;
    });

    this._rememberMorpher(type, morpher);
    return this
  },

  zoom (level, point) {
    if (this._tryRetarget('zoom', level, point)) return this

    let morpher = new Morphable(this._stepper).to(new SVGNumber(level));

    this.queue(function () {
      morpher = morpher.from(this.element().zoom());
    }, function (pos) {
      this.element().zoom(morpher.at(pos), point);
      return morpher.done()
    }, function (newLevel, newPoint) {
      point = newPoint;
      morpher.to(newLevel);
    });

    this._rememberMorpher('zoom', morpher);
    return this
  },

  /**
   ** absolute transformations
   **/

  //
  // M v -----|-----(D M v = F v)------|----->  T v
  //
  // 1. define the final state (T) and decompose it (once)
  //    t = [tx, ty, the, lam, sy, sx]
  // 2. on every frame: pull the current state of all previous transforms
  //    (M - m can change)
  //   and then write this as m = [tx0, ty0, the0, lam0, sy0, sx0]
  // 3. Find the interpolated matrix F(pos) = m + pos * (t - m)
  //   - Note F(0) = M
  //   - Note F(1) = T
  // 4. Now you get the delta matrix as a result: D = F * inv(M)

  transform (transforms, relative, affine) {
    // If we have a declarative function, we should retarget it if possible
    relative = transforms.relative || relative;
    if (this._isDeclarative && !relative && this._tryRetarget('transform', transforms)) {
      return this
    }

    // Parse the parameters
    const isMatrix = Matrix.isMatrixLike(transforms);
    affine = transforms.affine != null
      ? transforms.affine
      : (affine != null ? affine : !isMatrix);

    // Create a morepher and set its type
    const morpher = new Morphable(this._stepper)
      .type(affine ? TransformBag : Matrix);

    let origin;
    let element;
    let current;
    let currentAngle;
    let startTransform;

    function setup () {
      // make sure element and origin is defined
      element = element || this.element();
      origin = origin || getOrigin(transforms, element);

      startTransform = new Matrix(relative ? undefined : element);

      // add the runner to the element so it can merge transformations
      element._addRunner(this);

      // Deactivate all transforms that have run so far if we are absolute
      if (!relative) {
        element._clearTransformRunnersBefore(this);
      }
    }

    function run (pos) {
      // clear all other transforms before this in case something is saved
      // on this runner. We are absolute. We dont need these!
      if (!relative) this.clearTransform();

      const { x, y } = new Point(origin).transform(element._currentTransform(this));

      let target = new Matrix({ ...transforms, origin: [ x, y ] });
      let start = this._isDeclarative && current
        ? current
        : startTransform;

      if (affine) {
        target = target.decompose(x, y);
        start = start.decompose(x, y);

        // Get the current and target angle as it was set
        const rTarget = target.rotate;
        const rCurrent = start.rotate;

        // Figure out the shortest path to rotate directly
        const possibilities = [ rTarget - 360, rTarget, rTarget + 360 ];
        const distances = possibilities.map(a => Math.abs(a - rCurrent));
        const shortest = Math.min(...distances);
        const index = distances.indexOf(shortest);
        target.rotate = possibilities[index];
      }

      if (relative) {
        // we have to be careful here not to overwrite the rotation
        // with the rotate method of Matrix
        if (!isMatrix) {
          target.rotate = transforms.rotate || 0;
        }
        if (this._isDeclarative && currentAngle) {
          start.rotate = currentAngle;
        }
      }

      morpher.from(start);
      morpher.to(target);

      const affineParameters = morpher.at(pos);
      currentAngle = affineParameters.rotate;
      current = new Matrix(affineParameters);

      this.addTransform(current);
      element._addRunner(this);
      return morpher.done()
    }

    function retarget (newTransforms) {
      // only get a new origin if it changed since the last call
      if (
        (newTransforms.origin || 'center').toString()
        !== (transforms.origin || 'center').toString()
      ) {
        origin = getOrigin(newTransforms, element);
      }

      // overwrite the old transformations with the new ones
      transforms = { ...newTransforms, origin };
    }

    this.queue(setup, run, retarget, true);
    this._isDeclarative && this._rememberMorpher('transform', morpher);
    return this
  },

  // Animatable x-axis
  x (x, relative) {
    return this._queueNumber('x', x)
  },

  // Animatable y-axis
  y (y) {
    return this._queueNumber('y', y)
  },

  dx (x = 0) {
    return this._queueNumberDelta('x', x)
  },

  dy (y = 0) {
    return this._queueNumberDelta('y', y)
  },

  dmove (x, y) {
    return this.dx(x).dy(y)
  },

  _queueNumberDelta (method, to) {
    to = new SVGNumber(to);

    // Try to change the target if we have this method already registerd
    if (this._tryRetarget(method, to)) return this

    // Make a morpher and queue the animation
    const morpher = new Morphable(this._stepper).to(to);
    let from = null;
    this.queue(function () {
      from = this.element()[method]();
      morpher.from(from);
      morpher.to(from + to);
    }, function (pos) {
      this.element()[method](morpher.at(pos));
      return morpher.done()
    }, function (newTo) {
      morpher.to(from + new SVGNumber(newTo));
    });

    // Register the morpher so that if it is changed again, we can retarget it
    this._rememberMorpher(method, morpher);
    return this
  },

  _queueObject (method, to) {
    // Try to change the target if we have this method already registerd
    if (this._tryRetarget(method, to)) return this

    // Make a morpher and queue the animation
    const morpher = new Morphable(this._stepper).to(to);
    this.queue(function () {
      morpher.from(this.element()[method]());
    }, function (pos) {
      this.element()[method](morpher.at(pos));
      return morpher.done()
    });

    // Register the morpher so that if it is changed again, we can retarget it
    this._rememberMorpher(method, morpher);
    return this
  },

  _queueNumber (method, value) {
    return this._queueObject(method, new SVGNumber(value))
  },

  // Animatable center x-axis
  cx (x) {
    return this._queueNumber('cx', x)
  },

  // Animatable center y-axis
  cy (y) {
    return this._queueNumber('cy', y)
  },

  // Add animatable move
  move (x, y) {
    return this.x(x).y(y)
  },

  // Add animatable center
  center (x, y) {
    return this.cx(x).cy(y)
  },

  // Add animatable size
  size (width, height) {
    // animate bbox based size for all other elements
    let box;

    if (!width || !height) {
      box = this._element.bbox();
    }

    if (!width) {
      width = box.width / box.height * height;
    }

    if (!height) {
      height = box.height / box.width * width;
    }

    return this
      .width(width)
      .height(height)
  },

  // Add animatable width
  width (width) {
    return this._queueNumber('width', width)
  },

  // Add animatable height
  height (height) {
    return this._queueNumber('height', height)
  },

  // Add animatable plot
  plot (a, b, c, d) {
    // Lines can be plotted with 4 arguments
    if (arguments.length === 4) {
      return this.plot([ a, b, c, d ])
    }

    if (this._tryRetarget('plot', a)) return this

    const morpher = new Morphable(this._stepper)
      .type(this._element.MorphArray).to(a);

    this.queue(function () {
      morpher.from(this._element.array());
    }, function (pos) {
      this._element.plot(morpher.at(pos));
      return morpher.done()
    });

    this._rememberMorpher('plot', morpher);
    return this
  },

  // Add leading method
  leading (value) {
    return this._queueNumber('leading', value)
  },

  // Add animatable viewbox
  viewbox (x, y, width, height) {
    return this._queueObject('viewbox', new Box(x, y, width, height))
  },

  update (o) {
    if (typeof o !== 'object') {
      return this.update({
        offset: arguments[0],
        color: arguments[1],
        opacity: arguments[2]
      })
    }

    if (o.opacity != null) this.attr('stop-opacity', o.opacity);
    if (o.color != null) this.attr('stop-color', o.color);
    if (o.offset != null) this.attr('offset', o.offset);

    return this
  }
});

extend(Runner, { rx, ry, from, to });
register$1(Runner, 'Runner');

class Svg extends Container {
  constructor (node, attrs = node) {
    super(nodeOrNew('svg', node), attrs);
    this.namespace();
  }

  // Creates and returns defs element
  defs () {
    if (!this.isRoot()) return this.root().defs()

    return adopt(this.node.querySelector('defs'))
      || this.put(new Defs())
  }

  isRoot () {
    return !this.node.parentNode
      || (!(this.node.parentNode instanceof globals.window.SVGElement) && this.node.parentNode.nodeName !== '#document-fragment')
  }

  // Add namespaces
  namespace () {
    if (!this.isRoot()) return this.root().namespace()
    return this
      .attr({ xmlns: svg, version: '1.1' })
      .attr('xmlns:xlink', xlink, xmlns)
      .attr('xmlns:svgjs', svgjs, xmlns)
  }

  removeNamespace () {
    return this.attr({ xmlns: null, version: null })
      .attr('xmlns:xlink', null, xmlns)
      .attr('xmlns:svgjs', null, xmlns)
  }

  // Check if this is a root svg
  // If not, call root() from this element
  root () {
    if (this.isRoot()) return this
    return super.root()
  }

}

registerMethods({
  Container: {
    // Create nested svg document
    nested: wrapWithAttrCheck(function () {
      return this.put(new Svg())
    })
  }
});

register$1(Svg, 'Svg', true);

class Symbol$3 extends Container {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('symbol', node), attrs);
  }
}

registerMethods({
  Container: {
    symbol: wrapWithAttrCheck(function () {
      return this.put(new Symbol$3())
    })
  }
});

register$1(Symbol$3, 'Symbol');

// Create plain text node
function plain (text) {
  // clear if build mode is disabled
  if (this._build === false) {
    this.clear();
  }

  // create text node
  this.node.appendChild(globals.document.createTextNode(text));

  return this
}

// Get length of text element
function length () {
  return this.node.getComputedTextLength()
}

// Move over x-axis
// Text is moved by its bounding box
// text-anchor does NOT matter
function x$1 (x, box = this.bbox()) {
  if (x == null) {
    return box.x
  }

  return this.attr('x', this.attr('x') + x - box.x)
}

// Move over y-axis
function y$1 (y, box = this.bbox()) {
  if (y == null) {
    return box.y
  }

  return this.attr('y', this.attr('y') + y - box.y)
}

function move$1 (x, y, box = this.bbox()) {
  return this.x(x, box).y(y, box)
}

// Move center over x-axis
function cx (x, box = this.bbox()) {
  if (x == null) {
    return box.cx
  }

  return this.attr('x', this.attr('x') + x - box.cx)
}

// Move center over y-axis
function cy (y, box = this.bbox()) {
  if (y == null) {
    return box.cy
  }

  return this.attr('y', this.attr('y') + y - box.cy)
}

function center (x, y, box = this.bbox()) {
  return this.cx(x, box).cy(y, box)
}

function ax (x) {
  return this.attr('x', x)
}

function ay (y) {
  return this.attr('y', y)
}

function amove (x, y) {
  return this.ax(x).ay(y)
}

// Enable / disable build mode
function build (build) {
  this._build = !!build;
  return this
}

var textable = /*#__PURE__*/Object.freeze({
  __proto__: null,
  plain: plain,
  length: length,
  x: x$1,
  y: y$1,
  move: move$1,
  cx: cx,
  cy: cy,
  center: center,
  ax: ax,
  ay: ay,
  amove: amove,
  build: build
});

class Text extends Shape {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('text', node), attrs);

    this.dom.leading = new SVGNumber(1.3); // store leading value for rebuilding
    this._rebuild = true; // enable automatic updating of dy values
    this._build = false; // disable build mode for adding multiple lines
  }

  // Set / get leading
  leading (value) {
    // act as getter
    if (value == null) {
      return this.dom.leading
    }

    // act as setter
    this.dom.leading = new SVGNumber(value);

    return this.rebuild()
  }

  // Rebuild appearance type
  rebuild (rebuild) {
    // store new rebuild flag if given
    if (typeof rebuild === 'boolean') {
      this._rebuild = rebuild;
    }

    // define position of all lines
    if (this._rebuild) {
      const self = this;
      let blankLineOffset = 0;
      const leading = this.dom.leading;

      this.each(function (i) {
        const fontSize = globals.window.getComputedStyle(this.node)
          .getPropertyValue('font-size');

        const dy = leading * new SVGNumber(fontSize);

        if (this.dom.newLined) {
          this.attr('x', self.attr('x'));

          if (this.text() === '\n') {
            blankLineOffset += dy;
          } else {
            this.attr('dy', i ? dy + blankLineOffset : 0);
            blankLineOffset = 0;
          }
        }
      });

      this.fire('rebuild');
    }

    return this
  }

  // overwrite method from parent to set data properly
  setData (o) {
    this.dom = o;
    this.dom.leading = new SVGNumber(o.leading || 1.3);
    return this
  }

  // Set the text content
  text (text) {
    // act as getter
    if (text === undefined) {
      const children = this.node.childNodes;
      let firstLine = 0;
      text = '';

      for (let i = 0, len = children.length; i < len; ++i) {
        // skip textPaths - they are no lines
        if (children[i].nodeName === 'textPath') {
          if (i === 0) firstLine = 1;
          continue
        }

        // add newline if its not the first child and newLined is set to true
        if (i !== firstLine && children[i].nodeType !== 3 && adopt(children[i]).dom.newLined === true) {
          text += '\n';
        }

        // add content of this node
        text += children[i].textContent;
      }

      return text
    }

    // remove existing content
    this.clear().build(true);

    if (typeof text === 'function') {
      // call block
      text.call(this, this);
    } else {
      // store text and make sure text is not blank
      text = (text + '').split('\n');

      // build new lines
      for (let j = 0, jl = text.length; j < jl; j++) {
        this.newLine(text[j]);
      }
    }

    // disable build mode and rebuild lines
    return this.build(false).rebuild()
  }

}

extend(Text, textable);

registerMethods({
  Container: {
    // Create text element
    text: wrapWithAttrCheck(function (text = '') {
      return this.put(new Text()).text(text)
    }),

    // Create plain text element
    plain: wrapWithAttrCheck(function (text = '') {
      return this.put(new Text()).plain(text)
    })
  }
});

register$1(Text, 'Text');

class Tspan extends Shape {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('tspan', node), attrs);
    this._build = false; // disable build mode for adding multiple lines
  }

  // Shortcut dx
  dx (dx) {
    return this.attr('dx', dx)
  }

  // Shortcut dy
  dy (dy) {
    return this.attr('dy', dy)
  }

  // Create new line
  newLine () {
    // mark new line
    this.dom.newLined = true;

    // fetch parent
    const text = this.parent();

    // early return in case we are not in a text element
    if (!(text instanceof Text)) {
      return this
    }

    const i = text.index(this);

    const fontSize = globals.window.getComputedStyle(this.node)
      .getPropertyValue('font-size');
    const dy = text.dom.leading * new SVGNumber(fontSize);

    // apply new position
    return this.dy(i ? dy : 0).attr('x', text.x())
  }

  // Set text content
  text (text) {
    if (text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '')

    if (typeof text === 'function') {
      this.clear().build(true);
      text.call(this, this);
      this.build(false);
    } else {
      this.plain(text);
    }

    return this
  }

}

extend(Tspan, textable);

registerMethods({
  Tspan: {
    tspan: wrapWithAttrCheck(function (text = '') {
      const tspan = new Tspan();

      // clear if build mode is disabled
      if (!this._build) {
        this.clear();
      }

      // add new tspan
      return this.put(tspan).text(text)
    })
  },
  Text: {
    newLine: function (text = '') {
      return this.tspan(text).newLine()
    }
  }
});

register$1(Tspan, 'Tspan');

class Circle extends Shape {
  constructor (node, attrs = node) {
    super(nodeOrNew('circle', node), attrs);
  }

  radius (r) {
    return this.attr('r', r)
  }

  // Radius x value
  rx (rx) {
    return this.attr('r', rx)
  }

  // Alias radius x value
  ry (ry) {
    return this.rx(ry)
  }

  size (size) {
    return this.radius(new SVGNumber(size).divide(2))
  }
}

extend(Circle, { x: x$3, y: y$3, cx: cx$1, cy: cy$1, width: width$3, height: height$3 });

registerMethods({
  Container: {
    // Create circle element
    circle: wrapWithAttrCheck(function (size = 0) {
      return this.put(new Circle())
        .size(size)
        .move(0, 0)
    })
  }
});

register$1(Circle, 'Circle');

class ClipPath extends Container {
  constructor (node, attrs = node) {
    super(nodeOrNew('clipPath', node), attrs);
  }

  // Unclip all clipped elements and remove itself
  remove () {
    // unclip all targets
    this.targets().forEach(function (el) {
      el.unclip();
    });

    // remove clipPath from parent
    return super.remove()
  }

  targets () {
    return baseFind('svg [clip-path*="' + this.id() + '"]')
  }
}

registerMethods({
  Container: {
    // Create clipping element
    clip: wrapWithAttrCheck(function () {
      return this.defs().put(new ClipPath())
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipper () {
      return this.reference('clip-path')
    },

    clipWith (element) {
      // use given clip or create a new one
      const clipper = element instanceof ClipPath
        ? element
        : this.parent().clip().add(element);

      // apply mask
      return this.attr('clip-path', 'url("#' + clipper.id() + '")')
    },

    // Unclip element
    unclip () {
      return this.attr('clip-path', null)
    }
  }
});

register$1(ClipPath, 'ClipPath');

class ForeignObject extends Element {
  constructor (node, attrs = node) {
    super(nodeOrNew('foreignObject', node), attrs);
  }
}

registerMethods({
  Container: {
    foreignObject: wrapWithAttrCheck(function (width, height) {
      return this.put(new ForeignObject()).size(width, height)
    })
  }
});

register$1(ForeignObject, 'ForeignObject');

function dmove (dx, dy) {
  this.children().forEach((child, i) => {

    let bbox;

    // We have to wrap this for elements that dont have a bbox
    // e.g. title and other descriptive elements
    try {
      // Get the childs bbox
      bbox = child.bbox();
    } catch (e) {
      return
    }

    // Get childs matrix
    const m = new Matrix(child);
    // Translate childs matrix by amount and
    // transform it back into parents space
    const matrix = m.translate(dx, dy).transform(m.inverse());
    // Calculate new x and y from old box
    const p = new Point(bbox.x, bbox.y).transform(matrix);
    // Move element
    child.move(p.x, p.y);
  });

  return this
}

function dx (dx) {
  return this.dmove(dx, 0)
}

function dy (dy) {
  return this.dmove(0, dy)
}

function height$1 (height, box = this.bbox()) {
  if (height == null) return box.height
  return this.size(box.width, height, box)
}

function move (x = 0, y = 0, box = this.bbox()) {
  const dx = x - box.x;
  const dy = y - box.y;

  return this.dmove(dx, dy)
}

function size (width, height, box = this.bbox()) {
  const p = proportionalSize(this, width, height, box);
  const scaleX = p.width / box.width;
  const scaleY = p.height / box.height;

  this.children().forEach((child, i) => {
    const o = new Point(box).transform(new Matrix(child).inverse());
    child.scale(scaleX, scaleY, o.x, o.y);
  });

  return this
}

function width$1 (width, box = this.bbox()) {
  if (width == null) return box.width
  return this.size(width, box.height, box)
}

function x (x, box = this.bbox()) {
  if (x == null) return box.x
  return this.move(x, box.y, box)
}

function y (y, box = this.bbox()) {
  if (y == null) return box.y
  return this.move(box.x, y, box)
}

var containerGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  dmove: dmove,
  dx: dx,
  dy: dy,
  height: height$1,
  move: move,
  size: size,
  width: width$1,
  x: x,
  y: y
});

class G extends Container {
  constructor (node, attrs = node) {
    super(nodeOrNew('g', node), attrs);
  }
}

extend(G, containerGeometry);

registerMethods({
  Container: {
    // Create a group element
    group: wrapWithAttrCheck(function () {
      return this.put(new G())
    })
  }
});

register$1(G, 'G');

class A extends Container {
  constructor (node, attrs = node) {
    super(nodeOrNew('a', node), attrs);
  }

  // Link target attribute
  target (target) {
    return this.attr('target', target)
  }

  // Link url
  to (url) {
    return this.attr('href', url, xlink)
  }

}

extend(A, containerGeometry);

registerMethods({
  Container: {
    // Create a hyperlink element
    link: wrapWithAttrCheck(function (url) {
      return this.put(new A()).to(url)
    })
  },
  Element: {
    unlink () {
      const link = this.linker();

      if (!link) return this

      const parent = link.parent();

      if (!parent) {
        return this.remove()
      }

      const index = parent.index(link);
      parent.add(this, index);

      link.remove();
      return this
    },
    linkTo (url) {
      // reuse old link if possible
      let link = this.linker();

      if (!link) {
        link = new A();
        this.wrap(link);
      }

      if (typeof url === 'function') {
        url.call(link, link);
      } else {
        link.to(url);
      }

      return this
    },
    linker () {
      const link = this.parent();
      if (link && link.node.nodeName.toLowerCase() === 'a') {
        return link
      }

      return null
    }
  }
});

register$1(A, 'A');

class Mask extends Container {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('mask', node), attrs);
  }

  // Unmask all masked elements and remove itself
  remove () {
    // unmask all targets
    this.targets().forEach(function (el) {
      el.unmask();
    });

    // remove mask from parent
    return super.remove()
  }

  targets () {
    return baseFind('svg [mask*="' + this.id() + '"]')
  }
}

registerMethods({
  Container: {
    mask: wrapWithAttrCheck(function () {
      return this.defs().put(new Mask())
    })
  },
  Element: {
    // Distribute mask to svg element
    masker () {
      return this.reference('mask')
    },

    maskWith (element) {
      // use given mask or create a new one
      const masker = element instanceof Mask
        ? element
        : this.parent().mask().add(element);

      // apply mask
      return this.attr('mask', 'url("#' + masker.id() + '")')
    },

    // Unmask element
    unmask () {
      return this.attr('mask', null)
    }
  }
});

register$1(Mask, 'Mask');

class Stop extends Element {
  constructor (node, attrs = node) {
    super(nodeOrNew('stop', node), attrs);
  }

  // add color stops
  update (o) {
    if (typeof o === 'number' || o instanceof SVGNumber) {
      o = {
        offset: arguments[0],
        color: arguments[1],
        opacity: arguments[2]
      };
    }

    // set attributes
    if (o.opacity != null) this.attr('stop-opacity', o.opacity);
    if (o.color != null) this.attr('stop-color', o.color);
    if (o.offset != null) this.attr('offset', new SVGNumber(o.offset));

    return this
  }
}

registerMethods({
  Gradient: {
    // Add a color stop
    stop: function (offset, color, opacity) {
      return this.put(new Stop()).update(offset, color, opacity)
    }
  }
});

register$1(Stop, 'Stop');

function cssRule (selector, rule) {
  if (!selector) return ''
  if (!rule) return selector

  let ret = selector + '{';

  for (const i in rule) {
    ret += unCamelCase(i) + ':' + rule[i] + ';';
  }

  ret += '}';

  return ret
}

class Style extends Element {
  constructor (node, attrs = node) {
    super(nodeOrNew('style', node), attrs);
  }

  addText (w = '') {
    this.node.textContent += w;
    return this
  }

  font (name, src, params = {}) {
    return this.rule('@font-face', {
      fontFamily: name,
      src: src,
      ...params
    })
  }

  rule (selector, obj) {
    return this.addText(cssRule(selector, obj))
  }
}

registerMethods('Dom', {
  style (selector, obj) {
    return this.put(new Style()).rule(selector, obj)
  },
  fontface  (name, src, params) {
    return this.put(new Style()).font(name, src, params)
  }
});

register$1(Style, 'Style');

class TextPath extends Text {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('textPath', node), attrs);
  }

  // return the array of the path track element
  array () {
    const track = this.track();

    return track ? track.array() : null
  }

  // Plot path if any
  plot (d) {
    const track = this.track();
    let pathArray = null;

    if (track) {
      pathArray = track.plot(d);
    }

    return (d == null) ? pathArray : this
  }

  // Get the path element
  track () {
    return this.reference('href')
  }
}

registerMethods({
  Container: {
    textPath: wrapWithAttrCheck(function (text, path) {
      // Convert text to instance if needed
      if (!(text instanceof Text)) {
        text = this.text(text);
      }

      return text.path(path)
    })
  },
  Text: {
    // Create path for text to run on
    path: wrapWithAttrCheck(function (track, importNodes = true) {
      const textPath = new TextPath();

      // if track is a path, reuse it
      if (!(track instanceof Path)) {
        // create path element
        track = this.defs().path(track);
      }

      // link textPath to path and add content
      textPath.attr('href', '#' + track, xlink);

      // Transplant all nodes from text to textPath
      let node;
      if (importNodes) {
        while ((node = this.node.firstChild)) {
          textPath.node.appendChild(node);
        }
      }

      // add textPath element as child node and return textPath
      return this.put(textPath)
    }),

    // Get the textPath children
    textPath () {
      return this.findOne('textPath')
    }
  },
  Path: {
    // creates a textPath from this path
    text: wrapWithAttrCheck(function (text) {
      // Convert text to instance if needed
      if (!(text instanceof Text)) {
        text = new Text().addTo(this.parent()).text(text);
      }

      // Create textPath from text and path and return
      return text.path(this)
    }),

    targets () {
      return baseFind('svg textPath').filter((node) => {
        return (node.attr('href') || '').includes(this.id())
      })

      // Does not work in IE11. Use when IE support is dropped
      // return baseFind('svg textPath[*|href*="' + this.id() + '"]')
    }
  }
});

TextPath.prototype.MorphArray = PathArray;
register$1(TextPath, 'TextPath');

class Use extends Shape {
  constructor (node, attrs = node) {
    super(nodeOrNew('use', node), attrs);
  }

  // Use element as a reference
  use (element, file) {
    // Set lined element
    return this.attr('href', (file || '') + '#' + element, xlink)
  }
}

registerMethods({
  Container: {
    // Create a use element
    use: wrapWithAttrCheck(function (element, file) {
      return this.put(new Use()).use(element, file)
    })
  }
});

register$1(Use, 'Use');

/* Optional Modules */
const SVG = makeInstance;

extend([
  Svg,
  Symbol$3,
  Image,
  Pattern,
  Marker
], getMethodsFor('viewbox'));

extend([
  Line,
  Polyline,
  Polygon,
  Path
], getMethodsFor('marker'));

extend(Text, getMethodsFor('Text'));
extend(Path, getMethodsFor('Path'));

extend(Defs, getMethodsFor('Defs'));

extend([
  Text,
  Tspan
], getMethodsFor('Tspan'));

extend([
  Rect,
  Ellipse,
  Gradient,
  Runner
], getMethodsFor('radius'));

extend(EventTarget, getMethodsFor('EventTarget'));
extend(Dom, getMethodsFor('Dom'));
extend(Element, getMethodsFor('Element'));
extend(Shape, getMethodsFor('Shape'));
extend([ Container, Fragment ], getMethodsFor('Container'));
extend(Gradient, getMethodsFor('Gradient'));

extend(Runner, getMethodsFor('Runner'));

List.extend(getMethodNames());

registerMorphableType([
  SVGNumber,
  Color$1,
  Box,
  Matrix,
  SVGArray,
  PointArray,
  PathArray,
  Point
]);

makeMorphable();

function Mitt(n){return {all:n=n||new Map,on:function(t,e){var i=n.get(t);i?i.push(e):n.set(t,[e]);},off:function(t,e){var i=n.get(t);i&&(e?i.splice(i.indexOf(e)>>>0,1):n.set(t,[]));},emit:function(t,e){var i=n.get(t);i&&i.slice().map(function(n){n(e);}),(i=n.get("*"))&&i.slice().map(function(n){n(t,e);});}}}

function Event() {
  Object.assign(this, Mitt());
}

const cloneList = list => Array.prototype.slice.call(list);

function curry(fn, args = []) {
  return (..._args) => (rest => rest.length >= fn.length ? fn(...rest) : curry(fn, rest))([...args, ..._args]);
}

const {
  isArray: isArray$2
} = Array;

class ReduceStopper {
  constructor(value) {
    this.value = value;
  }

}

function reduceFn(reducer, acc, list) {
  if (!isArray$2(list)) {
    throw new TypeError('reduce: list must be array or iterable');
  }

  let index = 0;
  const len = list.length;

  while (index < len) {
    acc = reducer(acc, list[index], index, list);

    if (acc instanceof ReduceStopper) {
      return acc.value;
    }

    index++;
  }

  return acc;
}
const reduce = curry(reduceFn);

function _arity(n, fn) {
  switch (n) {
    case 0:
      return function () {
        return fn.apply(this, arguments);
      };

    case 1:
      return function (a0) {
        return fn.apply(this, arguments);
      };

    case 2:
      return function (a0, a1) {
        return fn.apply(this, arguments);
      };

    case 3:
      return function (a0, a1, a2) {
        return fn.apply(this, arguments);
      };

    case 4:
      return function (a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };

    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };

    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };

    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };

    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };

    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };

    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };

    default:
      throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}
function _pipe(f, g) {
  return function () {
    return g.call(this, f.apply(this, arguments));
  };
}
function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }

  return _arity(arguments[0].length, reduceFn(_pipe, arguments[0], Array.prototype.slice.call(arguments, 1, Infinity)));
}

function compose() {
  if (arguments.length === 0) {
    throw new Error('compose requires at least one argument');
  }

  return pipe.apply(this, Array.prototype.slice.call(arguments, 0).reverse());
}

function type(input) {
  if (input === null) {
    return 'Null';
  } else if (input === undefined) {
    return 'Undefined';
  } else if (Number.isNaN(input)) {
    return 'NaN';
  }

  const typeResult = Object.prototype.toString.call(input).slice(8, -1);
  return typeResult === 'AsyncFunction' ? 'Promise' : typeResult;
}
function _indexOf(valueToFind, list) {
  if (!isArray$2(list)) {
    throw new Error(`Cannot read property 'indexOf' of ${list}`);
  }

  const typeOfValue = type(valueToFind);
  if (!['Object', 'Array', 'NaN', 'RegExp'].includes(typeOfValue)) return list.indexOf(valueToFind);
  let index = -1;
  let foundIndex = -1;
  const {
    length
  } = list;

  while (++index < length && foundIndex === -1) {
    if (equals(list[index], valueToFind)) {
      foundIndex = index;
    }
  }

  return foundIndex;
}

function _arrayFromIterator(iter) {
  const list = [];
  let next;

  while (!(next = iter.next()).done) {
    list.push(next.value);
  }

  return list;
}

function _equalsSets(a, b) {
  if (a.size !== b.size) {
    return false;
  }

  const aList = _arrayFromIterator(a.values());

  const bList = _arrayFromIterator(b.values());

  const filtered = aList.filter(aInstance => _indexOf(aInstance, bList) === -1);
  return filtered.length === 0;
}

function parseError(maybeError) {
  const typeofError = maybeError.__proto__.toString();

  if (!['Error', 'TypeError'].includes(typeofError)) return [];
  return [typeofError, maybeError.message];
}

function parseDate(maybeDate) {
  if (!maybeDate.toDateString) return [false];
  return [true, maybeDate.getTime()];
}

function parseRegex(maybeRegex) {
  if (maybeRegex.constructor !== RegExp) return [false];
  return [true, maybeRegex.toString()];
}

function equals(a, b) {
  if (arguments.length === 1) return _b => equals(a, _b);
  const aType = type(a);
  if (aType !== type(b)) return false;

  if (aType === 'Function') {
    return a.name === undefined ? false : a.name === b.name;
  }

  if (['NaN', 'Undefined', 'Null'].includes(aType)) return true;

  if (aType === 'Number') {
    if (Object.is(-0, a) !== Object.is(-0, b)) return false;
    return a.toString() === b.toString();
  }

  if (['String', 'Boolean'].includes(aType)) {
    return a.toString() === b.toString();
  }

  if (aType === 'Array') {
    const aClone = Array.from(a);
    const bClone = Array.from(b);

    if (aClone.toString() !== bClone.toString()) {
      return false;
    }

    let loopArrayFlag = true;
    aClone.forEach((aCloneInstance, aCloneIndex) => {
      if (loopArrayFlag) {
        if (aCloneInstance !== bClone[aCloneIndex] && !equals(aCloneInstance, bClone[aCloneIndex])) {
          loopArrayFlag = false;
        }
      }
    });
    return loopArrayFlag;
  }

  const aRegex = parseRegex(a);
  const bRegex = parseRegex(b);

  if (aRegex[0]) {
    return bRegex[0] ? aRegex[1] === bRegex[1] : false;
  } else if (bRegex[0]) return false;

  const aDate = parseDate(a);
  const bDate = parseDate(b);

  if (aDate[0]) {
    return bDate[0] ? aDate[1] === bDate[1] : false;
  } else if (bDate[0]) return false;

  const aError = parseError(a);
  const bError = parseError(b);

  if (aError[0]) {
    return bError[0] ? aError[0] === bError[0] && aError[1] === bError[1] : false;
  }

  if (aType === 'Set') {
    return _equalsSets(a, b);
  }

  if (aType === 'Object') {
    const aKeys = Object.keys(a);

    if (aKeys.length !== Object.keys(b).length) {
      return false;
    }

    let loopObjectFlag = true;
    aKeys.forEach(aKeyInstance => {
      if (loopObjectFlag) {
        const aValue = a[aKeyInstance];
        const bValue = b[aKeyInstance];

        if (aValue !== bValue && !equals(aValue, bValue)) {
          loopObjectFlag = false;
        }
      }
    });
    return loopObjectFlag;
  }

  return false;
}

function includes(valueToFind, iterable) {
  if (arguments.length === 1) return _iterable => includes(valueToFind, _iterable);

  if (typeof iterable === 'string') {
    return iterable.includes(valueToFind);
  }

  if (!iterable) {
    throw new TypeError(`Cannot read property \'indexOf\' of ${iterable}`);
  }

  if (!isArray$2(iterable)) return false;
  return _indexOf(valueToFind, iterable) > -1;
}

class _Set {
  constructor() {
    this.set = new Set();
    this.items = {};
  }

  checkUniqueness(item) {
    const type$1 = type(item);

    if (['Null', 'Undefined', 'NaN'].includes(type$1)) {
      if (type$1 in this.items) {
        return false;
      }

      this.items[type$1] = true;
      return true;
    }

    if (!['Object', 'Array'].includes(type$1)) {
      const prevSize = this.set.size;
      this.set.add(item);
      return this.set.size !== prevSize;
    }

    if (!(type$1 in this.items)) {
      this.items[type$1] = [item];
      return true;
    }

    if (_indexOf(item, this.items[type$1]) === -1) {
      this.items[type$1].push(item);
      return true;
    }

    return false;
  }

}

function uniq$1(list) {
  const set = new _Set();
  const willReturn = [];
  list.forEach(item => {
    if (set.checkUniqueness(item)) {
      willReturn.push(item);
    }
  });
  return willReturn;
}

function multiply(x, y) {
  if (arguments.length === 1) return _y => multiply(x, _y);
  return x * y;
}

reduce(multiply, 1);

function union(x, y) {
  if (arguments.length === 1) return _y => union(x, _y);
  const toReturn = cloneList(x);
  y.forEach(yInstance => {
    if (!includes(yInstance, x)) toReturn.push(yInstance);
  });
  return toReturn;
}

//  按下键盘后看看是否有命中, 在步骤中则继续push到栈中, 否则清除
var GlobalPreventDefault = function GlobalPreventDefault(evt) {
  var _evtmap = evtmap(evt),
      ctrl = _evtmap.ctrl;
      _evtmap.shift;
      var code = _evtmap.code; // console.log('enter:', ctrl, code, enter({ ctrl, code }))


  if (evt.preventDefault && (keyMCtrl({
    ctrl: ctrl,
    code: code
  }) || toggleEdit({
    code: code,
    ctrl: ctrl
  }))) {
    // console.log('---- global prevent')
    evt.preventDefault();
  }
};
var evtmap = function evtmap(evt) {
  var code = evt.keyCode,
      key = evt.key,
      altKey = evt.altKey,
      ctrlKey = evt.ctrlKey,
      shift = evt.shiftKey;
  var ctrl = altKey || ctrlKey;
  return {
    key: key,
    altKey: altKey,
    ctrl: ctrl,
    shift: shift,
    code: code
  };
};

var keyAbort = function keyAbort(_ref) {
  var code = _ref.code,
      _ref$ctrl = _ref.ctrl,
      ctrl = _ref$ctrl === void 0 ? false : _ref$ctrl,
      _ref$shift = _ref.shift,
      shift = _ref$shift === void 0 ? false : _ref$shift;
  return shift && code == 16 || ctrl && code == 17;
};

var isKeyAbort = compose(keyAbort, evtmap);

var esc = function esc(_ref2) {
  var code = _ref2.code,
      _ref2$ctrl = _ref2.ctrl,
      ctrl = _ref2$ctrl === void 0 ? false : _ref2$ctrl;
  return code == 27 || ctrl && code == 219;
};

var isEsc = compose(esc, evtmap);

var left = function left(_ref3) {
  var code = _ref3.code;
  return code == 37 || code == 72;
}; // h


var isLeft = compose(left, evtmap);

var right = function right(_ref4) {
  var code = _ref4.code;
  return code == 39 || code == 76;
}; // l


var isRight = compose(right, evtmap);

var top = function top(_ref5) {
  var code = _ref5.code;
  return code == 38 || code == 75;
}; // k


var isTop = compose(top, evtmap);

var bottom = function bottom(_ref6) {
  var code = _ref6.code;
  return code == 40 || code == 74;
}; // j


var isBottom = compose(bottom, evtmap);

var zoomIn = function zoomIn(_ref7) {
  var code = _ref7.code,
      _ref7$ctrl = _ref7.ctrl,
      ctrl = _ref7$ctrl === void 0 ? true : _ref7$ctrl;
  return ctrl && code == 189;
};

var isZoomIn = compose(zoomIn, evtmap);

var zoomOut = function zoomOut(_ref8) {
  var code = _ref8.code,
      _ref8$ctrl = _ref8.ctrl,
      ctrl = _ref8$ctrl === void 0 ? true : _ref8$ctrl;
  return ctrl && code == 187;
};

var isZoomOut = compose(zoomOut, evtmap);

var zoomRest = function zoomRest(_ref9) {
  var code = _ref9.code,
      _ref9$ctrl = _ref9.ctrl,
      ctrl = _ref9$ctrl === void 0 ? true : _ref9$ctrl,
      _ref9$shift = _ref9.shift,
      shift = _ref9$shift === void 0 ? false : _ref9$shift;
  return ctrl && !shift && code == 48;
};

var isZoomRest = compose(zoomRest, evtmap);

var zoomMin = function zoomMin(_ref10) {
  var code = _ref10.code,
      _ref10$ctrl = _ref10.ctrl,
      ctrl = _ref10$ctrl === void 0 ? true : _ref10$ctrl,
      _ref10$shift = _ref10.shift,
      shift = _ref10$shift === void 0 ? false : _ref10$shift;
  return ctrl && shift && code == 48;
};

var isZoomMin = compose(zoomMin, evtmap);

var copy = function copy(_ref11) {
  var code = _ref11.code,
      _ref11$ctrl = _ref11.ctrl,
      ctrl = _ref11$ctrl === void 0 ? true : _ref11$ctrl,
      _ref11$shift = _ref11.shift,
      shift = _ref11$shift === void 0 ? false : _ref11$shift;
  return !shift && ctrl && code == 67;
}; // ctrl + c


var isCopy = compose(copy, evtmap);

var close = function close(_ref12) {
  var code = _ref12.code;
  return code == 67;
}; // C


var isClose = compose(close, evtmap);

var viewCenter = function viewCenter(_ref13) {
  var code = _ref13.code;
  return code == 90;
}; // z


var isViewCenter = compose(viewCenter, evtmap);

var historyPrev = function historyPrev(_ref14) {
  var code = _ref14.code,
      _ref14$ctrl = _ref14.ctrl,
      ctrl = _ref14$ctrl === void 0 ? false : _ref14$ctrl;
  return ctrl && code == 90;
}; // ctrl + z


var isHistoryPrev = compose(historyPrev, evtmap);

var historyNext = function historyNext(_ref15) {
  var code = _ref15.code,
      _ref15$ctrl = _ref15.ctrl,
      ctrl = _ref15$ctrl === void 0 ? false : _ref15$ctrl,
      _ref15$shift = _ref15.shift,
      shift = _ref15$shift === void 0 ? false : _ref15$shift;
  return ctrl && shift && code == 90;
};

var isHistoryNext = compose(historyNext, evtmap);

var keyMCtrl = function keyMCtrl(_ref16) {
  var code = _ref16.code,
      _ref16$ctrl = _ref16.ctrl,
      ctrl = _ref16$ctrl === void 0 ? false : _ref16$ctrl;
  return ctrl && code == 77;
};

var enter = function enter(_ref17) {
  var code = _ref17.code,
      _ref17$ctrl = _ref17.ctrl,
      ctrl = _ref17$ctrl === void 0 ? false : _ref17$ctrl;
  return keyMCtrl({
    code: code,
    ctrl: ctrl
  }) || code == 13;
};

var isEnter = compose(enter, evtmap);

var nextSearch = function nextSearch(_ref18) {
  var code = _ref18.code,
      _ref18$shift = _ref18.shift,
      shift = _ref18$shift === void 0 ? false : _ref18$shift;
  return !shift && code == 78;
};

compose(nextSearch, evtmap);

var prevSearch = function prevSearch(_ref19) {
  var code = _ref19.code,
      _ref19$shift = _ref19.shift,
      shift = _ref19$shift === void 0 ? false : _ref19$shift;
  return shift && code == 78;
}; // sheft + n


compose(prevSearch, evtmap);

var tagSearch = function tagSearch(_ref20) {
  var code = _ref20.code,
      _ref20$ctrl = _ref20.ctrl,
      ctrl = _ref20$ctrl === void 0 ? false : _ref20$ctrl,
      _ref20$shift = _ref20.shift,
      shift = _ref20$shift === void 0 ? false : _ref20$shift;
  return !ctrl && !shift && code == 70;
}; // f


var isTagSearch = compose(tagSearch, evtmap);

var parent = function parent(_ref21) {
  var code = _ref21.code;
      _ref21.shift;
  return code == 80;
}; // sheft + p


var isParent = compose(parent, evtmap);

var editViewKey = function editViewKey(_ref22) {
  var code = _ref22.code,
      _ref22$shift = _ref22.shift,
      shift = _ref22$shift === void 0 ? false : _ref22$shift;
  return !shift && code == 73;
}; //  i


var isEditViewKey = compose(editViewKey, evtmap);

var addNodeManager = function addNodeManager(_ref23) {
  var code = _ref23.code;
  return code == 65;
};

var isAddNodeManager = compose(addNodeManager, evtmap); // const showAdd = ({ code, shift = false }) => shift && code == 65
// export const isShowAdd = compose(showAdd, evtmap)

var addEnd = function addEnd(_ref24) {
  var code = _ref24.code,
      _ref24$ctrl = _ref24.ctrl,
      ctrl = _ref24$ctrl === void 0 ? false : _ref24$ctrl;
  return !ctrl && code == 84;
};

var isAddEnd = compose(addEnd, evtmap);

var del = function del(_ref25) {
  var code = _ref25.code,
      _ref25$shift = _ref25.shift,
      shift = _ref25$shift === void 0 ? false : _ref25$shift;
  return shift && code == 68;
};

var isDel = compose(del, evtmap); // export const isDel = (code, shift = false) => shift && code == 83

var def = function def(_ref26) {
  var code = _ref26.code;
  return code == 68;
}; // 设置默认值


compose(def, evtmap);

var space = function space(_ref27) {
  var code = _ref27.code;
  return code == 32;
};

var isSpace = compose(space, evtmap);

var tab = function tab(_ref28) {
  var code = _ref28.code;
  return code == 9;
};

var isTab = compose(tab, evtmap);

var shapeZoomIn = function shapeZoomIn(_ref29) {
  var code = _ref29.code,
      _ref29$shift = _ref29.shift,
      shift = _ref29$shift === void 0 ? false : _ref29$shift;
  return shift && code == 189;
}; // shift + -


var isShapeZoomIn = compose(shapeZoomIn, evtmap);

var shapeZoomOut = function shapeZoomOut(_ref30) {
  var code = _ref30.code,
      _ref30$shift = _ref30.shift,
      shift = _ref30$shift === void 0 ? false : _ref30$shift;
  return shift && code == 187;
}; // shift + +


var isShapeZoomOut = compose(shapeZoomOut, evtmap);

var backspace = function backspace(_ref31) {
  var code = _ref31.code;
  return code == 8;
};

var isBackspace = compose(backspace, evtmap);

var mockBackspace = function mockBackspace(_ref32) {
  var code = _ref32.code,
      _ref32$ctrl = _ref32.ctrl,
      ctrl = _ref32$ctrl === void 0 ? false : _ref32$ctrl;
  return ctrl && code == 89;
}; // ctrl+h


compose(mockBackspace, evtmap);

var shift = function shift(_ref33) {
  var code = _ref33.code;
  return code == 16;
};

var isShift = compose(shift, evtmap);

var ctrl = function ctrl(_ref34) {
  var code = _ref34.code;
  return code == 17;
};

var isCtrl = compose(ctrl, evtmap); // command

var toggleEdit = function toggleEdit(_ref35) {
  var code = _ref35.code,
      _ref35$ctrl = _ref35.ctrl,
      ctrl = _ref35$ctrl === void 0 ? false : _ref35$ctrl;
  return ctrl && code == 69;
}; // ctrl + e


var isToggleEdit = compose(toggleEdit, evtmap);

var switchPrevCommand = function switchPrevCommand(_ref36) {
  var code = _ref36.code,
      _ref36$ctrl = _ref36.ctrl,
      ctrl = _ref36$ctrl === void 0 ? false : _ref36$ctrl,
      _ref36$shift = _ref36.shift,
      shift = _ref36$shift === void 0 ? false : _ref36$shift;
  return ctrl && shift && enter({
    code: code
  });
};

var isSwitchPrevCommand = compose(switchPrevCommand, evtmap);

var switchNextCommand = function switchNextCommand(_ref37) {
  var code = _ref37.code,
      ctrl = _ref37.ctrl,
      _ref37$shift = _ref37.shift,
      shift = _ref37$shift === void 0 ? false : _ref37$shift;
  return shift && enter({
    ctrl: ctrl,
    code: code
  });
};

var isSwitchNextCommand = compose(switchNextCommand, evtmap); // editview

var isToggleEditView = isToggleEdit; //  scroll

var scrollUp = function scrollUp(_ref38) {
  var code = _ref38.code,
      _ref38$shift = _ref38.shift,
      shift = _ref38$shift === void 0 ? false : _ref38$shift;
  return shift && space({
    code: code
  });
};

var isScrollUp = compose(scrollUp, evtmap);

var scrollDown = function scrollDown(_ref39) {
  var code = _ref39.code,
      _ref39$shift = _ref39.shift,
      shift = _ref39$shift === void 0 ? false : _ref39$shift;
  return !shift && space({
    code: code
  });
};

var isScrollDown = compose(scrollDown, evtmap); // 新舞台

var openStage = function openStage(_ref40) {
  var code = _ref40.code,
      _ref40$ctrl = _ref40.ctrl,
      ctrl = _ref40$ctrl === void 0 ? false : _ref40$ctrl,
      _ref40$shift = _ref40.shift,
      shift = _ref40$shift === void 0 ? true : _ref40$shift;
  return !ctrl && shift && code == 79;
}; // o


var isOpenStage = compose(openStage, evtmap);

var backStage = function backStage(_ref41) {
  var code = _ref41.code,
      _ref41$ctrl = _ref41.ctrl,
      ctrl = _ref41$ctrl === void 0 ? false : _ref41$ctrl,
      _ref41$shift = _ref41.shift,
      shift = _ref41$shift === void 0 ? true : _ref41$shift;
  return !ctrl && shift && code == 66;
}; // B


var isBackStage = compose(backStage, evtmap); // 新建组

var group$1 = function group(_ref42) {
  var code = _ref42.code;
      _ref42.ctrl;
      var _ref42$shift = _ref42.shift,
      shift = _ref42$shift === void 0 ? true : _ref42$shift;
  return shift && code == 71;
}; // shift + g


var isGroup = compose(group$1, evtmap);

var ungroup = function ungroup(_ref43) {
  var code = _ref43.code;
      _ref43.ctrl;
      var _ref43$shift = _ref43.shift,
      shift = _ref43$shift === void 0 ? false : _ref43$shift;
  return !shift && code == 71;
}; // g


var isUnGroup = compose(ungroup, evtmap);

var isSpaceKeyDown = false;
window.addEventListener('keydown', function (evt) {
  if (isSpace(evt)) isSpaceKeyDown = true;
  if (isShift(evt)) ;
  if (isCtrl(evt)) ;
}, true);
window.addEventListener('keyup', function (evt) {
  if (isSpace(evt)) isSpaceKeyDown = false;
  if (isShift(evt)) ;
  if (isCtrl(evt)) ;
}, true);

var isEditView = function isEditView(evt) {
  return isEditViewKey(evt);
};
var isCommandEnter = function isCommandEnter(evt) {
  return !EDIT_VIEW_ISSHOW && isEnter(evt);
};
var isToggleCommandEdit = function isToggleCommandEdit(evt) {
  return !EDIT_VIEW_ISSHOW && isToggleEdit(evt);
};
var isGlobalKey = function isGlobalKey(_ref) {
  var keyCode = _ref.keyCode,
      ctrlKey = _ref.ctrlKey,
      shiftKey = _ref.shiftKey;
  return isZoomIn({
    keyCode: keyCode,
    ctrlKey: ctrlKey,
    shiftKey: shiftKey
  }) || isZoomOut({
    keyCode: keyCode,
    ctrlKey: ctrlKey,
    shiftKey: shiftKey
  });
};
var isGlobalStageKey = function isGlobalStageKey(_ref2) {
  var keyCode = _ref2.keyCode,
      ctrlKey = _ref2.ctrlKey,
      shiftKey = _ref2.shiftKey;
  return isZoomIn({
    keyCode: keyCode,
    ctrlKey: ctrlKey
  }) || isZoomOut({
    keyCode: keyCode,
    ctrlKey: ctrlKey
  }) || isLeft({
    keyCode: keyCode
  }) || isRight({
    keyCode: keyCode
  }) || isTop({
    keyCode: keyCode
  }) || isBottom({
    keyCode: keyCode
  }) || isViewCenter({
    keyCode: keyCode
  }) || isTagSearch({
    keyCode: keyCode,
    ctrlKey: ctrlKey,
    shiftKey: shiftKey
  });
}; // 上 k,  shift+k,  space+k
// 下 j,  shfit+j,  space+j
// 左 h,  shfit+h,  space+h
// 右 l,  shfit+l,  space+l

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

var freeGlobal$1 = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal$1 || freeSelf || Function('return this')();

var root$1 = root;

/** Built-in value references. */
var Symbol$1 = root$1.Symbol;

var Symbol$2 = Symbol$1;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$b.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$8.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$a.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag$1);
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray$1 = isArray;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray$1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
}

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** Used as references for various `Number` constants. */
var NAN$1 = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN$1;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN$1 : +value);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag$1 = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root$1['__core-js_shared__'];

var coreJsData$1 = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto$9 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty$7).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */
var WeakMap$1 = getNative(root$1, 'WeakMap');

var WeakMap$2 = WeakMap$1;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop$1() {
  // No operation performed.
}

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var defineProperty$1 = defineProperty;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty$1 ? identity : function(func, string) {
  return defineProperty$1(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

var baseSetToString$1 = baseSetToString;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString$1);

var setToString$1 = setToString;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$1 = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax$1(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax$1(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString$1(overRest(func, start, identity), func + '');
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

  return value === proto;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$2;
}

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$7.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$6.call(value, 'callee') &&
    !propertyIsEnumerable$1.call(value, 'callee');
};

var isArguments$1 = isArguments;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Built-in value references. */
var Buffer = moduleExports$1 ? root$1.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

var isBuffer$1 = isBuffer;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag = '[object Function]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag$2 = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    weakMapTag$1 = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] =
typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
typedArrayTags[dataViewTag$2] = typedArrayTags[dateTag$1] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag] =
typedArrayTags[mapTag$2] = typedArrayTags[numberTag$1] =
typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$1] =
typedArrayTags[setTag$2] = typedArrayTags[stringTag$1] =
typedArrayTags[weakMapTag$1] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal$1.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

var nodeUtil$1 = nodeUtil;

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

var isTypedArray$1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray$1(value),
      isArg = !isArr && isArguments$1(value),
      isBuff = !isArr && !isArg && isBuffer$1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray$1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$5.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

var nativeKeys$1 = nativeKeys;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys$1(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$4.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray$1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

var nativeCreate$1 = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? undefined : result;
  }
  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty$2.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate$1 && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(root$1, 'Map');

var Map$2 = Map$1;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$2 || ListCache),
    'string': new Hash
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Error message constants. */
var FUNC_ERROR_TEXT$2 = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT$2);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var stringToPath$1 = stringToPath;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray$1(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath$1(toString(value));
}

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/** Built-in value references. */
var spreadableSymbol = Symbol$2 ? Symbol$2.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray$1(value) || isArguments$1(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$1 = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map$2 || (pairs.length < LARGE_ARRAY_SIZE$1 - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

var getSymbols$1 = getSymbols;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols$1);
}

/* Built-in method references that are verified to be native. */
var DataView = getNative(root$1, 'DataView');

var DataView$1 = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root$1, 'Promise');

var Promise$2 = Promise$1;

/* Built-in method references that are verified to be native. */
var Set$1 = getNative(root$1, 'Set');

var Set$2 = Set$1;

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag$1 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView$1),
    mapCtorString = toSource(Map$2),
    promiseCtorString = toSource(Promise$2),
    setCtorString = toSource(Set$2),
    weakMapCtorString = toSource(WeakMap$2);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag$1) ||
    (Map$2 && getTag(new Map$2) != mapTag$1) ||
    (Promise$2 && getTag(Promise$2.resolve()) != promiseTag) ||
    (Set$2 && getTag(new Set$2) != setTag$1) ||
    (WeakMap$2 && getTag(new WeakMap$2) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$1;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$1;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

var getTag$1 = getTag;

/** Built-in value references. */
var Uint8Array = root$1.Uint8Array;

var Uint8Array$1 = Uint8Array;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG$3) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$2 ? Symbol$2.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$2;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray$1(object),
      othIsArr = isArray$1(other),
      objTag = objIsArr ? arrayTag : getTag$1(object),
      othTag = othIsArr ? arrayTag : getTag$1(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer$1(object)) {
    if (!isBuffer$1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray$1(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray$1(object) || isArguments$1(object));
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray$1(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root$1.Date.now();
};

var now$1 = now;

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin$1 = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin$1(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now$1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now$1());
  }

  function debounced() {
    var time = now$1(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.gt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than `other`,
 *  else `false`.
 */
function baseGt(value, other) {
  return value > other;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

var intersection$1 = intersection;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * The base implementation of `_.lt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than `other`,
 *  else `false`.
 */
function baseLt(value, other) {
  return value < other;
}

/**
 * The base implementation of methods like `_.max` and `_.min` which accepts a
 * `comparator` to determine the extremum value.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per iteration.
 * @param {Function} comparator The comparator used to compare values.
 * @returns {*} Returns the extremum value.
 */
function baseExtremum(array, iteratee, comparator) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index],
        current = iteratee(value);

    if (current != null && (computed === undefined
          ? (current === current && !isSymbol(current))
          : comparator(current, computed)
        )) {
      var computed = current,
          result = value;
    }
  }
  return result;
}

/**
 * Computes the maximum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * _.max([]);
 * // => undefined
 */
function max(array) {
  return (array && array.length)
    ? baseExtremum(array, identity, baseGt)
    : undefined;
}

/**
 * This method is like `_.max` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * _.maxBy(objects, function(o) { return o.n; });
 * // => { 'n': 2 }
 *
 * // The `_.property` iteratee shorthand.
 * _.maxBy(objects, 'n');
 * // => { 'n': 2 }
 */
function maxBy(array, iteratee) {
  return (array && array.length)
    ? baseExtremum(array, baseIteratee(iteratee), baseGt)
    : undefined;
}

/**
 * The base implementation of `_.sum` and `_.sumBy` without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {number} Returns the sum.
 */
function baseSum(array, iteratee) {
  var result,
      index = -1,
      length = array.length;

  while (++index < length) {
    var current = iteratee(array[index]);
    if (current !== undefined) {
      result = result === undefined ? current : (result + current);
    }
  }
  return result;
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/**
 * The base implementation of `_.mean` and `_.meanBy` without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {number} Returns the mean.
 */
function baseMean(array, iteratee) {
  var length = array == null ? 0 : array.length;
  return length ? (baseSum(array, iteratee) / length) : NAN;
}

/**
 * Computes the mean of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the mean.
 * @example
 *
 * _.mean([4, 2, 8, 6]);
 * // => 5
 */
function mean(array) {
  return baseMean(array, identity);
}

/**
 * Computes the minimum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * _.min([]);
 * // => undefined
 */
function min(array) {
  return (array && array.length)
    ? baseExtremum(array, identity, baseLt)
    : undefined;
}

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set$2 && (1 / setToArray(new Set$2([,-0]))[1]) == INFINITY) ? noop$1 : function(values) {
  return new Set$2(values);
};

var createSet$1 = createSet;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet$1(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length) ? baseUniq(array) : [];
}

/**
 * This method is like `_.uniq` except that it accepts `comparator` which
 * is invoked to compare elements of `array`. The order of result values is
 * determined by the order they occur in the array.The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.uniqWith(objects, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
 */
function uniqWith(array, comparator) {
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
}

var easing = {
  quadIn: function quadIn(pos) {
    return Math.pow(pos, 2);
  },
  quadOut: function quadOut(pos) {
    return -(Math.pow(pos - 1, 2) - 1);
  },
  quadInOut: function quadInOut(pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 2);
    return -0.5 * ((pos -= 2) * pos - 2);
  },
  cubicIn: function cubicIn(pos) {
    return Math.pow(pos, 3);
  },
  cubicOut: function cubicOut(pos) {
    return Math.pow(pos - 1, 3) + 1;
  },
  cubicInOut: function cubicInOut(pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 3);
    return 0.5 * (Math.pow(pos - 2, 3) + 2);
  },
  quartIn: function quartIn(pos) {
    return Math.pow(pos, 4);
  },
  quartOut: function quartOut(pos) {
    return -(Math.pow(pos - 1, 4) - 1);
  },
  quartInOut: function quartInOut(pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 4);
    return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
  },
  quintIn: function quintIn(pos) {
    return Math.pow(pos, 5);
  },
  quintOut: function quintOut(pos) {
    return Math.pow(pos - 1, 5) + 1;
  },
  quintInOut: function quintInOut(pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 5);
    return 0.5 * (Math.pow(pos - 2, 5) + 2);
  },
  sineIn: function sineIn(pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
  },
  sineOut: function sineOut(pos) {
    return Math.sin(pos * (Math.PI / 2));
  },
  sineInOut: function sineInOut(pos) {
    return -0.5 * (Math.cos(Math.PI * pos) - 1);
  },
  expoIn: function expoIn(pos) {
    return pos == 0 ? 0 : Math.pow(2, 10 * (pos - 1));
  },
  expoOut: function expoOut(pos) {
    return pos == 1 ? 1 : -Math.pow(2, -10 * pos) + 1;
  },
  expoInOut: function expoInOut(pos) {
    if (pos == 0) return 0;
    if (pos == 1) return 1;
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (pos - 1));
    return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
  },
  circIn: function circIn(pos) {
    return -(Math.sqrt(1 - pos * pos) - 1);
  },
  circOut: function circOut(pos) {
    return Math.sqrt(1 - Math.pow(pos - 1, 2));
  },
  circInOut: function circInOut(pos) {
    if ((pos /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
    return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
  },
  backIn: function backIn(pos) {
    var s = 1.70158;
    return pos * pos * ((s + 1) * pos - s);
  },
  backOut: function backOut(pos) {
    pos = pos - 1;
    var s = 1.70158;
    return pos * pos * ((s + 1) * pos + s) + 1;
  },
  backInOut: function backInOut(pos) {
    var s = 1.70158;
    if ((pos /= 0.5) < 1) return 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s));
    return 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
  },
  swingFromTo: function swingFromTo(pos) {
    var s = 1.70158;
    return (pos /= 0.5) < 1 ? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
  },
  swingFrom: function swingFrom(pos) {
    var s = 1.70158;
    return pos * pos * ((s + 1) * pos - s);
  },
  swingTo: function swingTo(pos) {
    var s = 1.70158;
    return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
  },
  bounce: function bounce(pos) {
    console.log({
      pos: pos
    });
    var s = 7.5625,
        p = 2.75,
        l;

    if (pos < 1 / p) {
      l = s * pos * pos;
    } else {
      if (pos < 2 / p) {
        pos -= 1.5 / p;
        l = s * pos * pos + 0.75;
      } else {
        if (pos < 2.5 / p) {
          pos -= 2.25 / p;
          l = s * pos * pos + 0.9375;
        } else {
          pos -= 2.625 / p;
          l = s * pos * pos + 0.984375;
        }
      }
    }

    return l;
  },
  bounceOut: function bounceOut(pos) {
    if (pos < 1 / 2.75) {
      return 7.5625 * pos * pos;
    } else if (pos < 2 / 2.75) {
      return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
    } else if (pos < 2.5 / 2.75) {
      return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
    } else {
      return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
    }
  },
  elastic: function elastic(pos) {
    if (pos == !!pos) return pos;
    return Math.pow(2, -10 * pos) * Math.sin((pos - 0.075) * (2 * Math.PI) / 0.3) + 1;
  }
};

var noop = function noop() {};
var isUnDef = function isUnDef(v) {
  return typeof v == 'undefined' || typeof v == 'number' && isNaN(v) || v === null;
}; // export const isUnDef = (v) => typeof (v) == 'undefined'

var isDef$1 = function isDef(v) {
  return !!v;
}; // export const isDef = (v) => !!v && (typeof (v) != 'string' || typeof (v) != 'number')

var isFunc = function isFunc(v) {
  return typeof v == 'function';
};
var isObj = function isObj(v) {
  return v != null && _typeof(v) == 'object';
};
var isStr = function isStr(v) {
  return typeof v == 'string';
};
var undef = function undef(old, now) {
  return isUnDef(now) ? old : now;
};
var isDefEqual = function isDefEqual(old, now) {
  return isUnDef(old) ? true : old == now;
};
var isEmptyStr = function isEmptyStr(str) {
  return str.trim() == '';
}; // const issafe = ()=>{}
// export const undefSafe = (old, now) => isUnDef(now) ? old : now

var pickv = function pickv(key) {
  return function (kv) {
    return kv[key];
  };
};
var nowsec = function nowsec() {
  return parseInt(Date.now() / 1000);
};
var accHF = function accHF(base, curval) {
  return base + (curval - base) / 2;
};
var lastindex = function lastindex(list) {
  return list.length - 1;
};
var head = function head(list) {
  return list[0];
};
var tail = function tail(list) {
  return list[lastindex(list)];
};
var stepval = function stepval(v, len) {
  return v / len;
};
var createLock = function createLock() {
  var bool = false;
  return {
    islocked: function islocked(val) {
      if (val) bool = true;
      return bool;
    },
    unlock: function unlock() {
      bool = false;
    }
  };
};
var prev = function prev(arr, id) {
  console.log({
    arr: arr
  });
  return arr[arr.indexOf(id) - 1];
};
var next = function next(arr, id) {
  return arr[arr.indexOf(id) + 1];
}; // 链表

var padding = function padding(_ref, padval) {
  var x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height;

  if (!isObj(padval)) {
    padval = {
      top: padval,
      right: padval,
      bottom: padval,
      left: padval
    };
  }

  var _padval = padval,
      top = _padval.top,
      right = _padval.right,
      bottom = _padval.bottom,
      left = _padval.left;
  return {
    x: x - left,
    y: y - top,
    width: width + left + right,
    height: height + top + bottom
  };
};
var round = function round(v, offset) {
  if (isDef$1(offset)) {
    offset = Math.pow(10, offset);
    return Math.round(v * offset) / offset;
  }

  return Math.round(v);
}; // lodash as pick
// export const pick = (keys) => (arg) => keys.reduce((memo, k) => { memo[k] = arg[k]; return memo }, {})
// var a = [{ name: 2, v: 4 }, { name: 1, v: 6 }]
// console.log(a.map(pick(['name'])))

var indexOf = function indexOf(v, k) {
  return v.indexOf(k) != -1;
};

var include = function include(parr, carr) {
  return carr.length == intersection$1(parr, carr).length;
};

var has = function has(v, k) {
  if (isArray$1(k)) return include(v, k);
  return indexOf(v, k);
};
var logmid = function logmid() {
  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  var theme = [// 'patchNodeProperty',
  // 'JSON_PARSE',
  // 'COMMAND',
  // 'cacheAction',
  // 'HISTORY',
  // 'NODE_UPDATE',
  'VNODE' // 'DB_CLIENT',
  // 'DB_OPERATION',
  // 'MAIN',
  // 'STAGE_TITLE',
  // 'SYNC_DATA',
  // 'STAGE_LIFE',
  // 'NODE_SELECT',
  // 'DOT',
  // 'ARTICLE'
  ];

  if (arg.length == 1) {
    var _console;

    (_console = console).log.apply(_console, arg);
  } else {
    theme.forEach(function (t) {
      if (arg[0].indexOf(t) != -1) {
        var _console2;

        (_console2 = console).log.apply(_console2, arg);
      }
    });
  }

  return true;
};
var GC = /*#__PURE__*/_createClass(function GC() {
  _classCallCheck(this, GC);
});

var centerDiffPoint = function centerDiffPoint(viewbox, _ref) {
  var x = _ref.x,
      y = _ref.y;
  var vx = viewbox.x,
      vy = viewbox.y,
      _viewbox$window = viewbox.window,
      width = _viewbox$window.width,
      height = _viewbox$window.height,
      scale = _viewbox$window.scale,
      _viewbox$window$issho = _viewbox$window.isshowside,
      isshowside = _viewbox$window$issho === void 0 ? false : _viewbox$window$issho; // console.log({ width, height }, viewport.sizeTach(isshowside, viewport.detach, width))

  var _scale = scale(viewport.sizeTach(isshowside, viewport.detach, width), height),
      _scale2 = _slicedToArray(_scale, 2),
      sw = _scale2[0],
      sh = _scale2[1];

  var dx = x - (vx + sw / 2),
      dy = y - (vy + sh / 2);
  return [dx, dy, viewbox];
}; // 真实视口边界范围 [top,right,bottom,left]

var curViewBoundary = function curViewBoundary(viewbox) {
  var vx = viewbox.x,
      vy = viewbox.y,
      _viewbox$window2 = viewbox.window,
      width = _viewbox$window2.width,
      height = _viewbox$window2.height,
      scale = _viewbox$window2.scale; // console.log({ vx, vy, width, height, zoom: scale(1) })

  var _scale3 = scale(width, height),
      _scale4 = _slicedToArray(_scale3, 2),
      sw = _scale4[0],
      sh = _scale4[1];

  var top = vy,
      right = vx + sw,
      bottom = vy + sh,
      left = vx;
  return {
    source: [top, right, bottom, left],
    isInViewbox: function isInViewbox(x, y) {
      return x < left || x > right || y < top || y > bottom;
    }
  };
};

var clearzero = function clearzero(o) {
  return Object.keys(o).filter(function (k) {
    return !!o[k];
  }).reduce(function (memo, k) {
    memo[k] = o[k];
    return memo;
  }, {});
}; // 启动程序, 读取存储 初始


var viewboxBoot = function viewboxBoot(view, _ref2) {
  var width = _ref2.width,
      height = _ref2.height;
  var vw = view.width,
      vh = view.height,
      scale = view.scale;
      view.isshowside; // console.log({ vw, width, vh, height, scale })

  round(vw / width, 2);
  round(vh / height, 2);
  round(scale, 2); // console.log('wscale:', wscale)

  view.vw = view.scale * width;
  view.vh = view.scale * height;
  view.width = width;
  view.height = height; // console.log({ view })

  return view;
};

var viewportGen = function viewportGen(percent) {
  // 视口变化引发的缩放和恢复
  var ratio = 0.6;
  var scaleratio = 100 / (100 - percent); // 40%: 100/60

  var attach = function attach(scale) {
    return scale * percent / 100;
  }; // 正向比例, 针对新增窗口


  var detach = function detach(scale) {
    return scale / scaleratio;
  }; // 针对老窗口


  var diffscale = function diffscale(scale) {
    return scale - detach(scale);
  }; // 差值


  var sizeTach = function sizeTach(isshowside, fn, val) {
    return isshowside ? fn(val) : val;
  };

  return {
    scaleratio: scaleratio,
    attach: attach,
    detach: detach,
    sizeTach: sizeTach,
    diffscale: diffscale,
    ratio: ratio
  };
}; // export const viewport = viewportGen(40)


var viewport = viewportGen(60); // export const viewport = viewportGen(60)

var createViewbox = function createViewbox(_ref3) {
  var width = _ref3.width,
      height = _ref3.height,
      svg = _ref3.svg,
      _ref3$zoomsize = _ref3.zoomsize,
      zoomsize = _ref3$zoomsize === void 0 ? 1 : _ref3$zoomsize;
  // zoomsize 越大 视图越大(图形缩小了)
  var move = viewboxMove({
    width: width,
    height: height,
    svg: svg
  });

  var _viewboxZoom = viewboxZoom({
    width: width,
    height: height,
    svg: svg,
    zoomsize: zoomsize
  }),
      scale = _viewboxZoom.scale,
      zoom = _viewboxZoom.zoom;

  var isshowside = false;
  // 2. 和窗口缩放成正比, 回去(恢复窗口大小)
  // 3. 自定义缩放比例(和窗口大小无关), 居中, 回去(恢复窗口大小)

  return {
    move: move.keydown,
    scale: scale,
    zoom: zoom,
    get: function get() {
      return _objectSpread2(_objectSpread2({}, rounds(svg.viewbox())), {}, {
        window: {
          width: width,
          height: height,
          scale: scale,
          isshowside: isshowside
        }
      });
    },
    set: function set(vnew) {
      var isreset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var showside = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (!isreset) {
        // 初始
        var _rounds$clearzero2 = _objectSpread2(_objectSpread2({}, rounds(svg.viewbox())), clearzero(vnew)),
            x = _rounds$clearzero2.x,
            y = _rounds$clearzero2.y,
            _width = _rounds$clearzero2.width,
            _height = _rounds$clearzero2.height,
            _rounds$clearzero$vw2 = _rounds$clearzero2.vw,
            vw = _rounds$clearzero$vw2 === void 0 ? _width : _rounds$clearzero$vw2,
            _rounds$clearzero$vh2 = _rounds$clearzero2.vh,
            vh = _rounds$clearzero$vh2 === void 0 ? _height : _rounds$clearzero$vh2;

        return svg.viewbox(x, y, vw, vh);
      }

      if (showside) {
        var _rounds2 = _objectSpread2({}, rounds(svg.viewbox()));
            _rounds2.x;
            _rounds2.y;
            _rounds2.width;
            _rounds2.height;
        // console.log({ _x, _y, _width, _height, dw, dh })
        // svg.viewbox(_x + (dw / 2), _y, _width, _height)
      }

      isshowside = showside; // 视口变化
      // let [_x, _y, _width, _height, dw] = zoomTo(showside, viewport.scaleratio * viewport.ratio)
      // const dx = (showside ? 1 : -1) * width / 2 / (viewport.scaleratio * viewport.ratio)
      // console.log({ width, height, dw }, viewport.scaleratio, viewport.ratio, dx)
      // svg.viewbox(_x + dx, _y, _width, _height)
      // svg.viewbox(_x + (dw / 2), _y, _width, _height)
      // svg.viewbox(_x + dw / 2, _y, _width, _height).size(width, height)
      // let [_x, _y, _width, _height, dw] = zoomTo(showside, viewport.scaleratio * ratio)
      // svg.viewbox(_x + dw / (2 * (1 - ratio)), _y, _width, _height)
    }
  };
};
var viewboxZoom = function viewboxZoom(_ref4) {
  var width = _ref4.width,
      height = _ref4.height,
      svg = _ref4.svg,
      zoomsize = _ref4.zoomsize;
  // console.log('viewboxZoom::', svg.viewbox(), { width, height })
  var delay = 40;
  var isscaleing = false;
  var easingZoom = easing.sineIn;
  throttle(function (arg) {
  }, 100);

  var scaleGen = function scaleGen() {
    var defratio = 1.1,
        max = 5,
        min = 0.2;
    return {
      "in": function _in(val, ratio) {
        ratio = ratio || defratio;
        if (round(zoomsize * ratio, 2) > max) return val;
        return round(val * ratio, 2);
      },
      out: function out(val, ratio) {
        ratio = ratio || defratio;
        if (round(zoomsize / ratio, 2) < min) return val;
        return round(val / ratio, 2);
      }
    };
  };

  var scale = scaleGen();

  var easeAfter = function easeAfter(state, ratio) {
    isscaleing = true;
    var size = zoomsize;
    if (state == 'in') size = scale["in"](size, ratio);
    if (state == 'out') size = scale.out(size, ratio);
    if (state == 'reset') size = 1;
    return function () {
      // stage.fire('scale', size)
      isscaleing = false;
      zoomsize = size;
    };
  };

  var zoomAnimateIn = function zoomAnimateIn(ratio) {
    var _svg$animate$ease$aft;

    return (_svg$animate$ease$aft = svg.animate(delay).ease(easingZoom).after(easeAfter('in', ratio))).viewbox.apply(_svg$animate$ease$aft, _toConsumableArray(zoomIn(ratio)));
  };

  var zoomIn = function zoomIn(ratio) {
    var _svg$viewbox = svg.viewbox(),
        x = _svg$viewbox.x,
        y = _svg$viewbox.y,
        width = _svg$viewbox.width,
        height = _svg$viewbox.height;

    var _ref5 = [scale["in"](width, ratio), scale["in"](height, ratio)],
        w = _ref5[0],
        h = _ref5[1];
    var dw = w - width,
        dh = h - height;
    return [x - dw / 2, y - dh / 2, w, h, dw, dh].map(function (v) {
      return round(v, 2);
    });
  };

  var zoomAnimateOut = function zoomAnimateOut(ratio) {
    var _svg$animate$ease$aft2;

    return (_svg$animate$ease$aft2 = svg.animate(delay).ease(easingZoom).after(easeAfter('out', ratio))).viewbox.apply(_svg$animate$ease$aft2, _toConsumableArray(zoomOut(ratio)));
  };

  var zoomOut = function zoomOut(ratio) {
    var _svg$viewbox2 = svg.viewbox(),
        x = _svg$viewbox2.x,
        y = _svg$viewbox2.y,
        width = _svg$viewbox2.width,
        height = _svg$viewbox2.height;

    var _ref6 = [scale.out(width, ratio), scale.out(height, ratio)],
        w = _ref6[0],
        h = _ref6[1];
    var dw = w - width,
        dh = h - height;
    return [x - dw / 2, y - dh / 2, w, h, dw, dh].map(function (v) {
      return round(v, 2);
    });
  };

  var zoomRest = function zoomRest() {
    // 中心坐标
    var _svg$viewbox3 = svg.viewbox(),
        x = _svg$viewbox3.x,
        y = _svg$viewbox3.y;

    var _centerDiffPoint = centerDiffPoint({
      x: x,
      y: y,
      window: {
        width: width,
        height: height,
        scale: scaleMap
      }
    }, {
      x: 0,
      y: 0
    }),
        _centerDiffPoint2 = _slicedToArray(_centerDiffPoint, 2),
        dx = _centerDiffPoint2[0],
        dy = _centerDiffPoint2[1];

    var cx = 0 - dx - width / 2;
    var cy = 0 - dy - height / 2; // console.log({ cx, cy, dx: -dx, dy: -dy, width, height })

    return svg.animate(delay).ease(easingZoom).after(easeAfter('reset')).viewbox(cx, cy, width, height);
  };

  var zoomMin = function zoomMin() {
    // if (zoomsize >= 5) return
    zoomAnimateIn(5 / zoomsize);
  };

  var zoomTo = function zoomTo(isin, ratio) {
    var ret = isin ? zoomIn(ratio) : zoomOut(ratio);
    easeAfter(isin ? 'in' : 'out', ratio)();
    return ret;
  };

  var scaleMap = function scaleMap() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.map(function (v) {
      return v * zoomsize;
    });
  };

  return {
    scale: scaleMap,
    zoomTo: zoomTo,
    zoom: function zoom(evt, prevFn) {
      // console.log(evt)
      var ctrlKey = evt.ctrlKey;
      if (!ctrlKey) return;
      if (!(isZoomIn(evt) || isZoomOut(evt) || isZoomRest(evt) || isZoomMin(evt))) return; // console.log(vBoundray.boundray())

      evt.preventDefault();
      if (isscaleing) return;
      if (isZoomIn(evt)) zoomAnimateIn();
      if (isZoomOut(evt)) zoomAnimateOut();

      if (isZoomRest(evt)) {
        prevFn(); // 前置工作: 选中节点居中

        zoomRest();
      }

      if (isZoomMin(evt)) zoomMin();
      return true; // 命中快捷键
    }
  };
};
var viewboxMove = function viewboxMove(_ref7) {
  _ref7.width;
      _ref7.height;
      var svg = _ref7.svg;
  var easingMove = easing.sineIn;
  var delay = 10;
  var ismoveing = false;

  var easeAfter = function easeAfter(state) {
    ismoveing = true;
    return function () {
      ismoveing = false;
    };
  };

  var dd = function dd(val) {
    if (isSpaceKeyDown) return 1 * 5;
    return round(val / 16);
  };

  var scaleUp = function scaleUp(val) {
    var rate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
    return val * rate;
  };

  var distance = function distance(val) {
    var v = dd(val);
    return function (shiftKey) {
      return shiftKey ? scaleUp(v) : v;
    };
  };

  var left = function left(shiftKey) {
    var _rounds3 = rounds(svg.viewbox()),
        x = _rounds3.x,
        y = _rounds3.y,
        width = _rounds3.width,
        height = _rounds3.height;

    x = x - distance(width)(shiftKey);
    svg.animate(delay).ease(easingMove).after(easeAfter()).viewbox(x, y, width, height);
  };

  var right = function right(shiftKey) {
    var _rounds4 = rounds(svg.viewbox()),
        x = _rounds4.x,
        y = _rounds4.y,
        width = _rounds4.width,
        height = _rounds4.height;

    x = x + distance(width)(shiftKey);
    svg.animate(delay).ease(easingMove).after(easeAfter()).viewbox(x, y, width, height);
  };

  var top = function top(shiftKey) {
    var _rounds5 = rounds(svg.viewbox()),
        x = _rounds5.x,
        y = _rounds5.y,
        width = _rounds5.width,
        height = _rounds5.height;

    y = y - distance(height)(shiftKey);
    svg.animate(delay).ease(easingMove).after(easeAfter()).viewbox(x, y, width, height);
  };

  var bottom = function bottom(shiftKey) {
    var _rounds6 = rounds(svg.viewbox()),
        x = _rounds6.x,
        y = _rounds6.y,
        width = _rounds6.width,
        height = _rounds6.height;

    y = y + distance(height)(shiftKey);
    svg.animate(delay).ease(easingMove).after(easeAfter()).viewbox(x, y, width, height);
  };

  return {
    keydown: function keydown(evt) {
      var keyCode = evt.keyCode,
          shiftKey = evt.shiftKey;
      if (!(isLeft({
        keyCode: keyCode
      }) || isRight({
        keyCode: keyCode
      }) || isTop({
        keyCode: keyCode
      }) || isBottom({
        keyCode: keyCode
      }))) return;
      evt.preventDefault();
      if (ismoveing) return;
      if (isLeft({
        keyCode: keyCode
      })) left(shiftKey);
      if (isRight({
        keyCode: keyCode
      })) right(shiftKey);
      if (isTop({
        keyCode: keyCode
      })) top(shiftKey);
      if (isBottom({
        keyCode: keyCode
      })) bottom(shiftKey);
    }
  };
};

var rounds = function rounds(_ref8) {
  var x = _ref8.x,
      y = _ref8.y,
      width = _ref8.width,
      height = _ref8.height;
  return {
    x: round(x),
    y: round(y),
    width: round(width),
    height: round(height)
  };
}; // 漫游, 视图切换

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var jsstore_commonjs2 = {exports: {}};

/*!
 * @license :jsstore - V4.4.3 - 20/08/2022
 * https://github.com/ujjwalguptaofficial/JsStore
 * Copyright (c) 2022 @Ujjwal Gupta; Licensed MIT
 */

(function (module) {
	/******/ (() => { // webpackBootstrap
	/******/ 	// The require scope
	/******/ 	var __webpack_require__ = {};
	/******/ 	
	/************************************************************************/
	/******/ 	/* webpack/runtime/define property getters */
	/******/ 	(() => {
	/******/ 		// define getter functions for harmony exports
	/******/ 		__webpack_require__.d = (exports, definition) => {
	/******/ 			for(var key in definition) {
	/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
	/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
	/******/ 				}
	/******/ 			}
	/******/ 		};
	/******/ 	})();
	/******/ 	
	/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
	/******/ 	(() => {
	/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
	/******/ 	})();
	/******/ 	
	/******/ 	/* webpack/runtime/make namespace object */
	/******/ 	(() => {
	/******/ 		// define __esModule on exports
	/******/ 		__webpack_require__.r = (exports) => {
	/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
	/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	/******/ 			}
	/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
	/******/ 		};
	/******/ 	})();
	/******/ 	
	/************************************************************************/
	var __webpack_exports__ = {};
	// ESM COMPAT FLAG
	__webpack_require__.r(__webpack_exports__);

	// EXPORTS
	__webpack_require__.d(__webpack_exports__, {
	  "API": () => (/* reexport */ API),
	  "CONNECTION_STATUS": () => (/* reexport */ CONNECTION_STATUS),
	  "Connection": () => (/* reexport */ Connection),
	  "DATA_TYPE": () => (/* reexport */ DATA_TYPE),
	  "ERROR_TYPE": () => (/* reexport */ ERROR_TYPE),
	  "EVENT": () => (/* reexport */ EVENT),
	  "IDB_MODE": () => (/* reexport */ IDB_MODE),
	  "OCCURENCE": () => (/* reexport */ OCCURENCE),
	  "QUERY_OPTION": () => (/* reexport */ QUERY_OPTION),
	  "WORKER_STATUS": () => (/* reexport */ WORKER_STATUS),
	  "forObj": () => (/* reexport */ forObj),
	  "promise": () => (/* reexport */ promise),
	  "promiseAll": () => (/* reexport */ promiseAll),
	  "promiseResolve": () => (/* reexport */ promiseResolve)
	});
	var LogHelper = /** @class */ (function () {
	    function LogHelper(type, info) {
	        this.type = type;
	        this._info = info;
	        this.message = this.getMsg();
	    }
	    LogHelper.prototype.throw = function () {
	        throw this;
	    };
	    LogHelper.prototype.log = function (msg) {
	        if (this.status) {
	            console.log(msg);
	        }
	    };
	    LogHelper.prototype.logError = function () {
	        console.error(this.get());
	    };
	    LogHelper.prototype.logWarning = function () {
	        console.warn(this.get());
	    };
	    LogHelper.prototype.get = function () {
	        return {
	            message: this.message,
	            type: this.type
	        };
	    };
	    LogHelper.prototype.getMsg = function () {
	        var errMsg;
	        switch (this.type) {
	            default:
	                errMsg = this.message;
	                break;
	        }
	        return errMsg;
	    };
	    return LogHelper;
	}());
	var ERROR_TYPE = {
	    InvalidUpdateColumn: "invalid_update_column",
	    UndefinedColumn: "undefined_column",
	    UndefinedValue: "undefined_value",
	    UndefinedColumnName: "undefined_column_name",
	    UndefinedDbName: "undefined_database_name",
	    UndefinedColumnValue: "undefined_column_value",
	    NotArray: "not_array",
	    NoValueSupplied: "no_value_supplied",
	    ColumnNotExist: "column_not_exist",
	    NoIndexFound: "no_index_found",
	    InvalidOp: "invalid_operator",
	    NullValue: "null_value",
	    WrongDataType: "wrong_data_type",
	    TableNotExist: "table_not_exist",
	    DbNotExist: "db_not_exist",
	    ConnectionAborted: "connection_aborted",
	    ConnectionClosed: "connection_closed",
	    NotObject: "not_object",
	    InvalidConfig: "invalid_config",
	    DbBlocked: "Db_blocked",
	    IndexedDbNotSupported: "indexeddb_not_supported",
	    NullValueInWhere: "null_value_in_where",
	    InvalidJoinQuery: 'invalid_join_query',
	    InvalidQuery: 'invalid_query',
	    ImportScriptsFailed: 'import_scripts_failed',
	    MethodNotExist: 'method_not_exist',
	    Unknown: "unknown",
	    InvalidMiddleware: "invalid_middleware"
	};
	{
	    Object.assign(ERROR_TYPE, {
	        InvalidOrderQuery: 'invalid_order_query',
	        InvalidGroupQuery: 'invalid_group_query'
	    });
	}
	var WORKER_STATUS;
	(function (WORKER_STATUS) {
	    WORKER_STATUS["Registered"] = "registerd";
	    WORKER_STATUS["Failed"] = "failed";
	    WORKER_STATUS["NotStarted"] = "not_started";
	})(WORKER_STATUS || (WORKER_STATUS = {}));
	var DATA_TYPE;
	(function (DATA_TYPE) {
	    DATA_TYPE["String"] = "string";
	    DATA_TYPE["Object"] = "object";
	    DATA_TYPE["Array"] = "array";
	    DATA_TYPE["Number"] = "number";
	    DATA_TYPE["Boolean"] = "boolean";
	    DATA_TYPE["Null"] = "null";
	    DATA_TYPE["DateTime"] = "date_time";
	})(DATA_TYPE || (DATA_TYPE = {}));
	var API;
	(function (API) {
	    API["InitDb"] = "init_db";
	    API["Get"] = "get";
	    API["Set"] = "set";
	    API["Select"] = "select";
	    API["Insert"] = "insert";
	    API["Update"] = "update";
	    API["Remove"] = "remove";
	    API["OpenDb"] = "open_db";
	    API["Clear"] = "clear";
	    API["DropDb"] = "drop_db";
	    API["Count"] = "count";
	    API["ChangeLogStatus"] = "change_log_status";
	    API["Terminate"] = "terminate";
	    API["Transaction"] = "transaction";
	    API["CloseDb"] = "close_db";
	    API["Union"] = "union";
	    API["Intersect"] = "intersect";
	    API["ImportScripts"] = "import_scripts";
	    API["Middleware"] = "middleware";
	})(API || (API = {}));
	var EVENT;
	(function (EVENT) {
	    EVENT["RequestQueueEmpty"] = "requestQueueEmpty";
	    EVENT["RequestQueueFilled"] = "requestQueueFilled";
	    EVENT["Upgrade"] = "upgrade";
	    EVENT["Create"] = "create";
	    EVENT["Open"] = "open";
	})(EVENT || (EVENT = {}));
	var QUERY_OPTION;
	(function (QUERY_OPTION) {
	    QUERY_OPTION["Where"] = "where";
	    QUERY_OPTION["Like"] = "like";
	    QUERY_OPTION["Regex"] = "regex";
	    QUERY_OPTION["In"] = "in";
	    QUERY_OPTION["Equal"] = "=";
	    QUERY_OPTION["Between"] = "-";
	    QUERY_OPTION["GreaterThan"] = ">";
	    QUERY_OPTION["LessThan"] = "<";
	    QUERY_OPTION["GreaterThanEqualTo"] = ">=";
	    QUERY_OPTION["LessThanEqualTo"] = "<=";
	    QUERY_OPTION["NotEqualTo"] = "!=";
	    QUERY_OPTION["Aggregate"] = "aggregate";
	    QUERY_OPTION["Max"] = "max";
	    QUERY_OPTION["Min"] = "min";
	    QUERY_OPTION["Avg"] = "avg";
	    QUERY_OPTION["Count"] = "count";
	    QUERY_OPTION["Sum"] = "sum";
	    QUERY_OPTION["Or"] = "or";
	    QUERY_OPTION["Skip"] = "skip";
	    QUERY_OPTION["Limit"] = "limit";
	    QUERY_OPTION["And"] = "and";
	    QUERY_OPTION["IgnoreCase"] = "ignoreCase";
	    QUERY_OPTION["Then"] = "then";
	})(QUERY_OPTION || (QUERY_OPTION = {}));
	var IDB_MODE;
	(function (IDB_MODE) {
	    IDB_MODE["ReadOnly"] = "readonly";
	    IDB_MODE["ReadWrite"] = "readwrite";
	})(IDB_MODE || (IDB_MODE = {}));
	var OCCURENCE;
	(function (OCCURENCE) {
	    OCCURENCE["First"] = "f";
	    OCCURENCE["Last"] = "l";
	    OCCURENCE["Any"] = "a";
	})(OCCURENCE || (OCCURENCE = {}));
	var CONNECTION_STATUS;
	(function (CONNECTION_STATUS) {
	    CONNECTION_STATUS["Connected"] = "connected";
	    CONNECTION_STATUS["Closed"] = "closed";
	    CONNECTION_STATUS["NotStarted"] = "not_started";
	    CONNECTION_STATUS["UnableToStart"] = "unable_to_start";
	    CONNECTION_STATUS["ClosedByJsStore"] = "closed_by_jsstore";
	})(CONNECTION_STATUS || (CONNECTION_STATUS = {}));
	var promise = function (cb) {
	    return new Promise(cb);
	};
	var promiseResolve = function (value) {
	    return Promise.resolve(value);
	};
	var __spreadArray = function (to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	};
	var EventBus = /** @class */ (function () {
	    function EventBus(ctx) {
	        this._events = {};
	        this._ctx = ctx;
	    }
	    EventBus.prototype.on = function (event, cb) {
	        if (this._events[event] == null) {
	            this._events[event] = [];
	        }
	        this._events[event].push(cb);
	        return this;
	    };
	    EventBus.prototype.off = function (event, cb) {
	        if (this._events[event]) {
	            if (cb) {
	                var index = this._events[event].indexOf(cb);
	                this._events[event].splice(index, 1);
	            }
	            else {
	                this._events[event] = [];
	            }
	        }
	    };
	    EventBus.prototype.emit = function (event) {
	        var _this = this;
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        var events = this._events[event] || [];
	        var index = 0;
	        var length = events.length;
	        var results = [];
	        var callMethod = function () {
	            var eventCb = events[index++];
	            if (eventCb) {
	                var result = eventCb.call.apply(eventCb, __spreadArray([_this._ctx], args, false));
	                return result && result.then ? result : Promise.resolve(result);
	            }
	        };
	        return new Promise(function (res) {
	            var checkAndCall = function () {
	                if (index < length) {
	                    callMethod().then(function (result) {
	                        results.push(result);
	                        checkAndCall();
	                    });
	                }
	                else {
	                    res(results);
	                }
	            };
	            checkAndCall();
	        });
	    };
	    EventBus.prototype.destroy = function () {
	        this._events = null;
	        this._ctx = null;
	    };
	    return EventBus;
	}());



	var ConnectionHelper = /** @class */ (function () {
	    function ConnectionHelper(worker) {
	        this.isConOpened_ = false;
	        this.isDbIdle_ = true;
	        this.requestQueue_ = [];
	        this.isCodeExecuting_ = false;
	        this.inactivityTimer_ = -1000;
	        this.middlewares = [];
	        this.eventBus_ = new EventBus(this);
	        // these apis have special permissions. These apis dont wait for database open.
	        this.whiteListApi_ = [
	            API.InitDb,
	            API.OpenDb,
	            API.Get,
	            API.Set,
	            API.ChangeLogStatus,
	            API.Terminate,
	            API.DropDb
	        ];
	        this.isWorker = true;
	        this.logger = new LogHelper(null);
	        if (worker) {
	            this.worker_ = worker;
	            this.worker_.onmessage = this.onMessageFromWorker_.bind(this);
	        }
	        else {
	            this.isWorker = false;
	            this.initQueryManager_();
	        }
	    }
	    Object.defineProperty(ConnectionHelper.prototype, "jsstoreWorker", {
	        get: function () {
	            return this.$worker || self['JsStoreWorker'];
	        },
	        enumerable: false,
	        configurable: true
	    });
	    ConnectionHelper.prototype.initQueryManager_ = function () {
	        var workerRef = this.jsstoreWorker;
	        if (workerRef) {
	            this.queryManager = new workerRef.QueryManager(this.processFinishedQuery_.bind(this));
	        }
	    };
	    ConnectionHelper.prototype.onMessageFromWorker_ = function (msg) {
	        this.processFinishedQuery_(msg.data);
	    };
	    ConnectionHelper.prototype.processFinishedQuery_ = function (message) {
	        var finishedRequest = this.requestQueue_.shift();
	        if (finishedRequest) {
	            this.logger.log("request ".concat(finishedRequest.name, " finished"));
	            if (message.error) {
	                finishedRequest.onError(message.error);
	            }
	            else {
	                switch (finishedRequest.name) {
	                    case API.OpenDb:
	                    case API.InitDb:
	                        this.isConOpened_ = true;
	                        break;
	                    case API.Terminate:
	                        this.isConOpened_ = false;
	                        if (this.isWorker === true) {
	                            this.worker_.terminate();
	                        }
	                    case API.DropDb:
	                        this.isConOpened_ = false;
	                        this.requestQueue_ = [];
	                        this.isDbIdle_ = true;
	                        break;
	                    case API.CloseDb:
	                        if (this.requestQueue_.length > 0) {
	                            this.openDb_();
	                        }
	                        else {
	                            this.isDbIdle_ = true;
	                            this.eventBus_.emit(EVENT.RequestQueueEmpty, []);
	                        }
	                        break;
	                }
	                finishedRequest.onSuccess(message.result);
	            }
	            this.isCodeExecuting_ = false;
	            this.executeQry_();
	        }
	    };
	    ConnectionHelper.prototype.openDb_ = function () {
	        this.prcoessExecutionOfQry_({
	            name: API.OpenDb,
	            query: {
	                name: this.database.name,
	                version: this.database.version
	            },
	            onSuccess: function () {
	            },
	            onError: function (err) {
	                console.error(err);
	            }
	        }, 0);
	    };
	    ConnectionHelper.prototype.executeMiddleware_ = function (input) {
	        var _this = this;
	        return promise(function (res) {
	            var index = 0;
	            var lastIndex = _this.middlewares.length - 1;
	            var callNextMiddleware = function () {
	                if (index <= lastIndex) {
	                    var promiseResult = _this.middlewares[index++](input);
	                    if (!promiseResult || !promiseResult.then) {
	                        promiseResult = promiseResolve(promiseResult);
	                    }
	                    promiseResult.then(function (_) {
	                        callNextMiddleware();
	                    });
	                }
	                else {
	                    res();
	                }
	            };
	            callNextMiddleware();
	        });
	    };
	    ConnectionHelper.prototype.callResultMiddleware = function (middlewares, result) {
	        return promise(function (res) {
	            var index = 0;
	            var lastIndex = middlewares.length - 1;
	            var callNextMiddleware = function () {
	                if (index <= lastIndex) {
	                    var promiseResult = middlewares[index++](result);
	                    if (!promiseResult.then) {
	                        promiseResult = promiseResolve(promiseResult);
	                    }
	                    promiseResult.then(function (modifiedResult) {
	                        result = modifiedResult;
	                        callNextMiddleware();
	                    });
	                }
	                else {
	                    res(result);
	                }
	            };
	            callNextMiddleware();
	        });
	    };
	    ConnectionHelper.prototype.pushApi = function (request) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            var middlewares = [];
	            request.onResult = function (cb) {
	                middlewares.push(function (result) {
	                    return cb(result);
	                });
	            };
	            _this.executeMiddleware_(request).then(function () {
	                request.onSuccess = function (result) {
	                    _this.callResultMiddleware(middlewares, result).then(function (modifiedResult) {
	                        resolve(modifiedResult);
	                    }).catch(function (err) {
	                        request.onError(err);
	                    });
	                };
	                request.onError = function (err) {
	                    middlewares = [];
	                    reject(err);
	                };
	                if (_this.requestQueue_.length === 0) {
	                    _this.eventBus_.emit(EVENT.RequestQueueFilled, []);
	                    var isConnectionApi = [API.CloseDb, API.DropDb, API.OpenDb, API.Terminate].indexOf(request.name) >= 0;
	                    if (!isConnectionApi && _this.isDbIdle_ && _this.isConOpened_) {
	                        _this.openDb_();
	                    }
	                    else {
	                        clearTimeout(_this.inactivityTimer_);
	                    }
	                }
	                _this.prcoessExecutionOfQry_(request);
	            }).catch(reject);
	        });
	    };
	    ConnectionHelper.prototype.prcoessExecutionOfQry_ = function (request, index) {
	        this.isDbIdle_ = false;
	        if (index != null) {
	            this.requestQueue_.splice(index, 0, request);
	        }
	        else {
	            this.requestQueue_.push(request);
	        }
	        this.logger.log("request pushed: " + request.name);
	        this.executeQry_();
	    };
	    ConnectionHelper.prototype.executeQry_ = function () {
	        var _this = this;
	        var requestQueueLength = this.requestQueue_.length;
	        if (!this.isCodeExecuting_ && requestQueueLength > 0) {
	            if (this.isConOpened_ === true) {
	                this.sendRequestToWorker_(this.requestQueue_[0]);
	                return;
	            }
	            var allowedQueryIndex = this.requestQueue_.findIndex(function (item) { return _this.whiteListApi_.indexOf(item.name) >= 0; });
	            // shift allowed query to zeroth index
	            if (allowedQueryIndex >= 0) {
	                this.requestQueue_.splice(0, 0, this.requestQueue_.splice(allowedQueryIndex, 1)[0]);
	                this.sendRequestToWorker_(this.requestQueue_[0]);
	            }
	        }
	        else if (requestQueueLength === 0 && this.isDbIdle_ === false && this.isConOpened_) {
	            this.inactivityTimer_ = setTimeout(function () {
	                _this.prcoessExecutionOfQry_({
	                    name: API.CloseDb,
	                    onSuccess: function () {
	                    },
	                    onError: function (err) {
	                        console.error(err);
	                    }
	                });
	            }, 100);
	        }
	    };
	    ConnectionHelper.prototype.sendRequestToWorker_ = function (request) {
	        this.isCodeExecuting_ = true;
	        this.logger.log("request executing: " + request.name);
	        var requestForWorker = {
	            name: request.name,
	            query: request.query
	        };
	        if (this.isWorker === true) {
	            this.worker_.postMessage(requestForWorker);
	        }
	        else {
	            this.queryManager.run(requestForWorker);
	        }
	    };
	    return ConnectionHelper;
	}());
	var __extends = (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();


	var Connection = /** @class */ (function (_super) {
	    __extends(Connection, _super);
	    function Connection(worker) {
	        return _super.call(this, worker) || this;
	    }
	    /**
	     * initiate DataBase
	     *
	     * @param {IDataBase} dataBase
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.initDb = function (dataBase) {
	        var _this = this;
	        this.database = dataBase;
	        return this.pushApi({
	            name: API.InitDb,
	            query: dataBase
	        }).then(function (result) {
	            var promiseObj;
	            var db = result.database;
	            if (result.isCreated) {
	                if (result.oldVersion) {
	                    promiseObj = _this.eventBus_.emit(EVENT.Upgrade, db, result.oldVersion, result.newVersion);
	                }
	                else {
	                    promiseObj = _this.eventBus_.emit(EVENT.Create, db);
	                }
	            }
	            return (promiseObj || promiseResolve()).then(function (_) {
	                return _this.eventBus_.emit(EVENT.Open, db);
	            }).then(function (_) {
	                return result.isCreated;
	            });
	        });
	    };
	    /**
	     * drop dataBase
	     *
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.dropDb = function () {
	        return this.pushApi({
	            name: API.DropDb
	        });
	    };
	    /**
	     * select data from table
	     *
	     * @template T
	     * @param {ISelectQuery} query
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.select = function (query) {
	        return this.pushApi({
	            name: API.Select,
	            query: query
	        });
	    };
	    /**
	     * get no of record from table
	     *
	     * @param {ICountQuery} query
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.count = function (query) {
	        return this.pushApi({
	            name: API.Count,
	            query: query
	        });
	    };
	    /**
	     * insert data into table
	     *
	     * @template T
	     * @param {IInsertQuery} query
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.insert = function (query) {
	        return this.pushApi({
	            name: API.Insert,
	            query: query
	        });
	    };
	    /**
	     * update data into table
	     *
	     * @param {IUpdateQuery} query
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.update = function (query) {
	        return this.pushApi({
	            name: API.Update,
	            query: query
	        });
	    };
	    /**
	     * remove data from table
	     *
	     * @param {IRemoveQuery} query
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.remove = function (query) {
	        return this.pushApi({
	            name: API.Remove,
	            query: query
	        });
	    };
	    /**
	     * delete all data from table
	     *
	     * @param {string} tableName
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.clear = function (tableName) {
	        return this.pushApi({
	            name: API.Clear,
	            query: tableName
	        });
	    };
	    Object.defineProperty(Connection.prototype, "logStatus", {
	        /**
	         * set log status
	         *
	         * @param {boolean} status
	         * @memberof Connection
	         */
	        set: function (status) {
	            this.logger.status = status;
	            this.pushApi({
	                name: API.ChangeLogStatus,
	                query: status
	            });
	        },
	        enumerable: false,
	        configurable: true
	    });
	    /**
	     * open database
	     *
	     * @param {string} dbName
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.openDb = function (dbName, version) {
	        var _this = this;
	        return this.pushApi({
	            name: API.OpenDb,
	            query: {
	                version: version,
	                name: dbName
	            }
	        }).then(function (dataBase) {
	            _this.database = dataBase;
	            return dataBase;
	        });
	    };
	    /**
	     * returns list of database created
	     *
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.getDbList = function () {
	        console.warn("Api getDbList is recommended to use for debugging only. Do not use in code.");
	        return indexedDB.databases();
	    };
	    /**
	     * get the value from keystore table
	     *
	     * @template T
	     * @param {string} key
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.get = function (key) {
	        return this.pushApi({
	            name: API.Get,
	            query: key
	        });
	    };
	    /**
	     * set the value in keystore table
	     *
	     * @param {string} key
	     * @param {*} value
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.set = function (key, value) {
	        return this.pushApi({
	            name: API.Set,
	            query: {
	                key: key, value: value
	            }
	        });
	    };
	    /**
	     * terminate the connection
	     *
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.terminate = function () {
	        return this.pushApi({
	            name: API.Terminate
	        });
	    };
	    /**
	     * execute transaction
	     *
	     * @template T
	     * @param {ITranscationQuery} query
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.transaction = function (query) {
	        return this.pushApi({
	            name: API.Transaction,
	            query: query
	        });
	    };
	    Connection.prototype.on = function (event, eventCallBack) {
	        this.eventBus_.on(event, eventCallBack);
	    };
	    Connection.prototype.off = function (event, eventCallBack) {
	        this.eventBus_.off(event, eventCallBack);
	    };
	    Connection.prototype.union = function (query) {
	        return this.pushApi({
	            name: API.Union,
	            query: query
	        });
	    };
	    Connection.prototype.intersect = function (query) {
	        return this.pushApi({
	            name: API.Intersect,
	            query: query
	        });
	    };
	    Connection.prototype.addPlugin = function (plugin, params) {
	        return plugin.setup(this, params);
	    };
	    Connection.prototype.addMiddleware = function (middleware, forWorker) {
	        if (forWorker) {
	            return this.pushApi({
	                name: API.Middleware,
	                query: middleware
	            });
	        }
	        this.middlewares.push(middleware);
	        return Promise.resolve();
	    };
	    /**
	     * import scripts in jsstore web worker.
	     * Scripts method can be called using transaction api.
	     *
	     * @param {...string[]} urls
	     * @returns
	     * @memberof Connection
	     */
	    Connection.prototype.importScripts = function () {
	        var urls = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            urls[_i] = arguments[_i];
	        }
	        return this.pushApi({
	            name: API.ImportScripts,
	            query: urls
	        });
	    };
	    return Connection;
	}(ConnectionHelper));
	var promiseAll = function (promises) {
	    return Promise.all(promises);
	};
	var forObj = function (obj, cb) {
	    for (var key in obj) {
	        cb(key, obj[key]);
	    }
	};



	module.exports = __webpack_exports__;
	/******/ })()
	;
	
} (jsstore_commonjs2));

var client = /*@__PURE__*/getDefaultExportFromCjs(jsstore_commonjs2.exports);

var DB_TPL = function DB_TPL(id) {
  var common = {
    updateTime: {
      notNull: true,
      dataType: jsstore_commonjs2.exports.DATA_TYPE.number
    },
    syncTime: {
      notNull: true,
      dataType: jsstore_commonjs2.exports.DATA_TYPE.number
    }
  };
  var TPL_OPERATION = {
    name: "OPERATION",
    columns: _objectSpread2({
      uid: {
        primaryKey: true,
        unique: true
      },
      entity: {
        notNull: true,
        dataType: jsstore_commonjs2.exports.DATA_TYPE.number
      },
      // 操作实体 0:stage, 1:article
      entityUid: {
        notNull: true,
        dataType: jsstore_commonjs2.exports.DATA_TYPE.number
      },
      // 操作的实体对应的用户ID, 示例:删除了用户哪个stage_id
      type: {
        notNull: true,
        dataType: jsstore_commonjs2.exports.DATA_TYPE.number
      }
    }, common)
  };
  var TPL_NODE = {
    name: "NODE",
    columns: _objectSpread2({
      uid: {
        primaryKey: true
      },
      data: {
        notNull: true
      }
    }, common)
  };
  var TPL_ARTICLE = {
    name: "ARTICLE",
    columns: _objectSpread2({
      uid: {
        primaryKey: true,
        unique: true
      },
      data: {
        notNull: true
      }
    }, common)
  };
  var TPL_STAGE = {
    name: "STAGE",
    columns: _objectSpread2({
      uid: {
        primaryKey: true,
        unique: true
      },
      title: {
        notNull: true
      },
      parent: {
        notNull: true,
        dataType: jsstore_commonjs2.exports.DATA_TYPE.number
      },
      // parent id
      data: {
        notNull: true
      }
    }, common)
  };
  var TPL_REMOTE_MAPPING = {
    name: "REMOTE_MAPPING",
    columns: {
      entity: {
        notNull: true,
        dataType: jsstore_commonjs2.exports.DATA_TYPE.number
      },
      // 操作实体 0:stage, 1:article
      entityUid: {
        notNull: true,
        dataType: jsstore_commonjs2.exports.DATA_TYPE.number
      },
      // 本地uid
      entityDBUid: {
        notNull: true,
        dataType: jsstore_commonjs2.exports.DATA_TYPE.number
      } // 远程uid

    }
  };
  var DB = {
    name: "DATA_".concat(id),
    tables: [TPL_OPERATION, TPL_NODE, TPL_ARTICLE, TPL_STAGE, TPL_REMOTE_MAPPING]
  };
  return {
    DB: DB,
    OPERATION: TPL_OPERATION.name,
    NODE: TPL_NODE.name,
    ARTICLE: TPL_ARTICLE.name,
    STAGE: TPL_STAGE.name,
    REMOTE_MAPPING: TPL_REMOTE_MAPPING.name
  };
};

var _DB_TPL = DB_TPL(0),
    OPERATION = _DB_TPL.OPERATION,
    NODE = _DB_TPL.NODE,
    ARTICLE$1 = _DB_TPL.ARTICLE,
    STAGE$2 = _DB_TPL.STAGE,
    REMOTE_MAPPING = _DB_TPL.REMOTE_MAPPING,
    DB = _DB_TPL.DB;

var _connect = function connect(db) {
  return db.initDb(DB);
};

var createDB = function createDB(_ref) {
  var middleware = _ref.middleware;
  // logmid('DB_CLIENT::','import.meta.url', import.meta.url)
  var url = new URL('./jsstore.worker.min.js', import.meta.url);
  var db = new client.Connection(new Worker(url.href)); // db.addPlugin(plugins)

  db.addMiddleware(middleware);

  var insert = function insert(tpl_name, list, middledata) {
    return db.insert({
      into: tpl_name,
      values: list,
      middledata: middledata
    });
  };

  var update = function update(tpl_name, _ref2, middledata) {
    var set = _ref2.set,
        where = _ref2.where;
    return db.update({
      "in": tpl_name,
      set: set,
      where: where,
      middledata: middledata
    });
  };

  var remove = function remove(tpl_name, where) {
    return db.remove({
      from: tpl_name,
      where: where
    });
  };

  var removeUid = function removeUid(tpl_name, uid) {
    return db.remove({
      from: tpl_name,
      where: {
        uid: uid
      }
    });
  };

  var select = function select(tpl_name, where, middledata) {
    return db.select({
      from: tpl_name,
      where: where,
      middledata: middledata
    });
  };

  var count = function count(tpl_name) {
    return db.count({
      from: tpl_name
    });
  };

  var aggregate = function aggregate(tpl_name, _aggregate) {
    return db.select({
      from: tpl_name,
      aggregate: _aggregate
    });
  };

  var last = function last(tpl_name) {
    return db.select({
      from: tpl_name,
      order: {
        by: 'uid',
        type: 'desc'
      },
      limit: 1
    });
  };

  var _fetch = function fetch(tpl_name, uid) {
    var options = {
      from: tpl_name
    };
    if (!isUnDef(uid)) options.where = {
      uid: uid
    };
    return db.select(options);
  }; // 历史, 独立的uid


  var historycount = 20;

  var historyGen = function historyGen(tpl_name) {
    var _uid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    return {
      uid: function uid(val) {
        return isUnDef(val) ? _uid : _uid = val;
      },
      prev: function prev() {
        return _fetch(tpl_name, --_uid);
      },
      next: function next() {
        return _fetch(tpl_name, ++_uid);
      }
    };
  }; // 创建独立的作用域


  var createScope = function createScope() {
    var _uid2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var islock = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return {
      probe: function probe() {
        return ++i % limit == 0;
      },
      uid: function uid(step) {
        if (isUnDef(step)) return _uid2;
        return _uid2 += step;
      },
      lock: function lock(bool) {
        if (isUnDef(bool)) return islock;
        return islock = bool;
      }
    };
  };

  var TABLES = [OPERATION, NODE, ARTICLE$1, STAGE$2, REMOTE_MAPPING].reduce(function (memo, tpl_name) {
    memo[tpl_name] = createScope();
    memo[tpl_name].history = historyGen(tpl_name);
    return memo;
  }, {});
  return {
    select: select,
    update: update,
    insert: insert,
    remove: remove,
    removeUid: removeUid,
    aggregate: aggregate,
    table: function table(tpl_name) {
      return TABLES[tpl_name];
    },
    history: function history(tpl_name) {
      return TABLES[tpl_name].history;
    },
    connect: function connect() {
      var _this = this;

      return _connect(db).then(function (isDbCreated) {
        return _this.listen(isDbCreated);
      });
    },
    listen: function listen(isDbCreated) {
      return this;
    },
    send: function send(tpl_name, data) {
      var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      // force 对比前/后和当前数据差异
      var _this$table = this.table(tpl_name),
          huid = _this$table.history.uid,
          uid = _this$table.uid,
          probe = _this$table.probe,
          lock = _this$table.lock; // logmid('DB_CLIENT::',huid(), uid())


      if (force || huid() >= uid() && !lock() && probe()) {
        insert(tpl_name, [].concat({
          uid: uid(1),
          data: data,
          updateTime: 0,
          syncTime: 0
        }));
        huid(uid());
      }
    },
    fetch: function fetch(tpl_name, uid) {
      return _fetch(tpl_name, uid);
    },
    clear: function clear(tpl_name) {
      this.table(tpl_name).lock(false);
      return db.clear(tpl_name);
    },
    stop: function stop() {
      TABLES.forEach(function (tb) {
        return tb.lock(false);
      });
      return db.dropDb().then(function () {
        return db.terminate();
      });
    },
    datainit: function datainit() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var lastitem, uid, len;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this2.connect();

            case 2:
              _context.next = 4;
              return last(NODE);

            case 4:
              lastitem = _context.sent;
              logmid('DB_CLIENT::', {
                lastitem: lastitem
              });

              if (!(lastitem.length == 0)) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return", 0);

            case 8:
              uid = lastitem[0].uid;

              _this2.table(NODE).uid(uid);

              _context.next = 12;
              return count(NODE);

            case 12:
              len = _context.sent;
              logmid('DB_CLIENT::', 'datainit:', {
                len: len,
                uid: uid
              });
              if (len > 10) remove(NODE, {
                uid: {
                  '<': uid - historycount
                }
              });
              logmid('DB_CLIENT::', 'uid:', _this2.history(NODE).uid(uid));
              return _context.abrupt("return", uid);

            case 17:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    }
  };
};

var cacheUid = function cacheUid(db, TABLE_NAME) {
  return function () {
    var minid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var maxid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var invalid = function invalid(val) {
      return isUnDef(val) || val === 0 || val == Infinity;
    };

    var min = function min(val) {
      return minid = undef(minid, val);
    };

    var max = function max(val) {
      return maxid = undef(maxid, val);
    }; // {min:'uid'} => 'min(uid)'


    var merge = function merge(where) {
      return "".concat(Object.keys(where)[0], "(").concat(Object.values(where)[0], ")");
    };

    var fromDB = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(where) {
        var _yield$db$aggregate, _yield$db$aggregate2, item, val;

        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return db.aggregate(TABLE_NAME, where);

            case 2:
              _yield$db$aggregate = _context.sent;
              _yield$db$aggregate2 = _slicedToArray(_yield$db$aggregate, 1);
              item = _yield$db$aggregate2[0];
              val = undef({}, item)[merge(where)]; // console.log({ item, val })

              return _context.abrupt("return", invalid(val) ? 0 : val);

            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));

      return function fromDB(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    fromDB({
      min: 'uid'
    }).then(min)["catch"](console.warn);
    fromDB({
      max: 'uid'
    }).then(max)["catch"](console.warn);
    return {
      min: min,
      max: max,
      minuid: function minuid(issync) {
        return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                if (!(!issync && !invalid(min()))) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", min());

              case 2:
                _context2.t0 = min;
                _context2.next = 5;
                return fromDB({
                  min: 'uid'
                });

              case 5:
                _context2.t1 = _context2.sent;
                return _context2.abrupt("return", (0, _context2.t0)(_context2.t1));

              case 7:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }))();
      },
      maxuid: function maxuid(issync) {
        return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                if (!(!issync && !invalid(max()))) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return", max());

              case 2:
                _context3.t0 = max;
                _context3.next = 5;
                return fromDB({
                  max: 'uid'
                });

              case 5:
                _context3.t1 = _context3.sent;
                return _context3.abrupt("return", (0, _context3.t0)(_context3.t1));

              case 7:
              case "end":
                return _context3.stop();
            }
          }, _callee3);
        }))();
      },
      modify: function modify(uids) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                if (!has(uids, min())) {
                  _context4.next = 3;
                  break;
                }

                _context4.next = 3;
                return _this.minuid(true);

              case 3:
                if (!has(uids, max())) {
                  _context4.next = 6;
                  break;
                }

                _context4.next = 6;
                return _this.maxuid(true);

              case 6:
              case "end":
                return _context4.stop();
            }
          }, _callee4);
        }))();
      }
    };
  };
};

var createArticle = function createArticle(db) {
  var cuid = cacheUid(db, ARTICLE$1)();
  return {
    minuid: cuid.minuid,
    maxuid: cuid.maxuid,
    allUids: function allUids() {
      return this.fetch().then(function (list) {
        return list.filter(function (_ref) {
          var data = _ref.data;
          return !!data.trim();
        }).map(function (_ref2) {
          var uid = _ref2.uid;
          return uid;
        });
      });
    },
    fetch: function fetch(uid) {
      return db.fetch(ARTICLE$1, uid);
    },
    fetchUid: function fetchUid(uid, ismapping) {
      if (isUnDef(uid)) return Promise.resolve([]); // return db.select(ARTICLE, { uid }, { ismapping })

      return this.fetch(uid);
    },
    fetchIn: function fetchIn(uids) {
      return db.select(ARTICLE$1, {
        uid: {
          "in": uids
        }
      });
    },
    "delete": function _delete(uid) {
      console.log({
        uid: uid
      });
      var ret = db.removeUid(ARTICLE$1, uid);
      cuid.modify([uid]);
      return ret;
    },
    send: function send(_ref3, ismapping) {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var uid, data, _ref3$updateTime, updateTime, _ref3$syncTime, syncTime, isupdate, isinsert, article;

        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              uid = _ref3.uid, data = _ref3.data, _ref3$updateTime = _ref3.updateTime, updateTime = _ref3$updateTime === void 0 ? nowsec() : _ref3$updateTime, _ref3$syncTime = _ref3.syncTime, syncTime = _ref3$syncTime === void 0 ? 0 : _ref3$syncTime;
              isupdate = false, isinsert = false;
              _context.next = 5;
              return _this.fetchUid(uid, ismapping);

            case 5:
              article = _context.sent;

              if (!(article.length > 0)) {
                _context.next = 12;
                break;
              }

              _context.next = 9;
              return db.update(ARTICLE$1, {
                set: {
                  data: data,
                  updateTime: updateTime,
                  syncTime: syncTime
                },
                where: {
                  uid: uid
                }
              });

            case 9:
              isupdate = true;
              _context.next = 18;
              break;

            case 12:
              if (!db.table(ARTICLE$1).lock()) {
                _context.next = 14;
                break;
              }

              return _context.abrupt("return");

            case 14:
              if (isUnDef(uid)) {
                uid = cuid.max(cuid.max() + 1);
              } else if (uid > cuid.max()) {
                uid = cuid.max(uid);
              } else {
                console.error('uid  小于 maxuid::', {
                  uid: uid
                }, cuid.max());
              } // uid = cuid.max() + 1
              // await db.insert(ARTICLE, [].concat({ uid, updateTime, syncTime, data }), { dbuid: article_id })


              _context.next = 17;
              return db.insert(ARTICLE$1, [].concat({
                uid: uid,
                updateTime: updateTime,
                syncTime: syncTime,
                data: data
              }));

            case 17:
              // cuid.max(uid)
              isinsert = true;

            case 18:
              return _context.abrupt("return", {
                uid: uid,
                isinsert: isinsert,
                isupdate: isupdate
              });

            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    }
  };
};

var createNode$1 = function createNode(db) {
  return {
    fetch: function fetch(uid) {
      return db.fetch(NODE, uid);
    },
    send: function send(data) {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return db.send(NODE, data);

            case 2:
              return _context.abrupt("return", _context.sent);

            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    }
  };
};

var createStage$1 = function createStage(db) {
  // 记录uid
  var cuid = cacheUid(db, STAGE$2)(); // logmid('STAGE_LIFE_DB::cuid:', cuid.min(), cuid.max())

  return {
    minuid: function minuid() {
      return cuid.minuid();
    },
    maxuid: function maxuid() {
      return cuid.maxuid();
    },
    fetch: function fetch(uid) {
      return db.fetch(STAGE$2, uid);
    },
    fetchIn: function fetchIn(uids) {
      return db.select(STAGE$2, {
        uid: {
          "in": uids
        }
      });
    },
    goasync: function goasync() {},
    allUids: function allUids() {
      return this.fetch().then(function (list) {
        return list.filter(function (_ref) {
          var data = _ref.data;
          return !!data.trim();
        }).map(function (_ref2) {
          var uid = _ref2.uid;
          return uid;
        });
      });
    },
    fetchUid: function fetchUid(uid, ismapping) {
      if (isUnDef(uid)) return Promise.resolve([]);
      logmid('STAGE_LIFE_DB::', {
        uid: uid
      }); // return db.select(STAGE, { uid }, { ismapping })

      return this.fetch(uid);
    },
    "delete": function _delete(uids) {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var ret;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return db.remove(STAGE$2, {
                uid: {
                  "in": uids
                }
              });

            case 2:
              ret = _context.sent;
              _context.next = 5;
              return cuid.modify(uids);

            case 5:
              return _context.abrupt("return", ret);

            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    },
    sendList: function sendList(list) {
      return db.insert(STAGE$2, list);
    },
    send: function send(_ref3, ismapping) {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var uid, parent, title, data, _ref3$updateTime, updateTime, syncTime, isupdate, isinsert, stage, _stage2, _stage$2, p, t, d, st;

        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              uid = _ref3.uid, parent = _ref3.parent, title = _ref3.title, data = _ref3.data, _ref3$updateTime = _ref3.updateTime, updateTime = _ref3$updateTime === void 0 ? nowsec() : _ref3$updateTime, syncTime = _ref3.syncTime;
              logmid('STAGE_LIFE_DB:send:', {
                uid: uid
              });
              isupdate = false, isinsert = false;
              _context2.next = 6;
              return _this.fetchUid(uid, ismapping);

            case 6:
              stage = _context2.sent;

              if (!(stage.length > 0)) {
                _context2.next = 20;
                break;
              }

              _stage2 = _slicedToArray(stage, 1), _stage$2 = _stage2[0], p = _stage$2.parent, t = _stage$2.title, d = _stage$2.data, st = _stage$2.syncTime;

              if (!(isDefEqual(parent, p) && isDefEqual(title, t) && isDefEqual(data, d) && isDefEqual(syncTime, st))) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("return", {
                uid: uid
              });

            case 11:
              parent = undef(p, parent);
              title = undef(t, title);
              data = undef(d, data);
              syncTime = undef(st, syncTime); // console.log({ parent, title, data, updateTime, syncTime })

              _context2.next = 17;
              return db.update(STAGE$2, {
                set: {
                  parent: parent,
                  title: title,
                  data: data,
                  updateTime: updateTime,
                  syncTime: syncTime
                },
                where: {
                  uid: uid
                }
              });

            case 17:
              isupdate = true;
              _context2.next = 36;
              break;

            case 20:
              if (!db.table(STAGE$2).lock()) {
                _context2.next = 22;
                break;
              }

              return _context2.abrupt("return", {
                uid: uid
              });

            case 22:
              syncTime = undef(0, syncTime);
              parent = undef(0, parent);
              data = undef('{}', data);
              _context2.prev = 25;

              // 同步存储变异步,记录错误操作, 用于重新发起
              if (isUnDef(uid)) {
                uid = cuid.max(cuid.max() + 1);
              } else if (uid > cuid.max()) {
                uid = cuid.max(uid);
              } else {
                console.error('uid  小于 maxuid::', {
                  uid: uid
                }, cuid.max());
              } //  TODO::如果有重要请求出现存储错误情况, 应在中间件中发起重新操作指令
              // await db.insert(STAGE, [].concat({ uid, parent, title, data, updateTime, syncTime }), { dbuid: stage_id })


              _context2.next = 29;
              return db.insert(STAGE$2, [].concat({
                uid: uid,
                parent: parent,
                title: title,
                data: data,
                updateTime: updateTime,
                syncTime: syncTime
              }));

            case 29:
              _context2.next = 35;
              break;

            case 31:
              _context2.prev = 31;
              _context2.t0 = _context2["catch"](25);
              console.log('errr');
              return _context2.abrupt("return", {
                uid: uid
              });

            case 35:
              // cuid.max(uid)
              isinsert = true;

            case 36:
              return _context2.abrupt("return", {
                uid: uid,
                isinsert: isinsert,
                isupdate: isupdate
              });

            case 37:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[25, 31]]);
      }))();
    }
  };
};

var createOperation = function createOperation(db) {
  var cuid = cacheUid(db, OPERATION)();
  return {
    minuid: cuid.minuid,
    maxuid: cuid.maxuid,
    select: function select(where) {
      return db.select(OPERATION, where);
    },
    allUids: function allUids() {
      return this.fetch().then(function (list) {
        return list.filter(function (_ref) {
          var data = _ref.data;
          return !!data.trim();
        }).map(function (_ref2) {
          var uid = _ref2.uid;
          return uid;
        });
      });
    },
    fetch: function fetch(uid) {
      return db.fetch(OPERATION, uid);
    },
    fetchIn: function fetchIn(entity, entityUids) {
      return db.select(OPERATION, {
        entity: entity,
        entityUid: {
          "in": entityUids
        }
      });
    },
    fetchUid: function fetchUid(uid) {
      if (isUnDef(uid)) return Promise.resolve([]);
      return this.fetch(uid);
    },
    goasync: function goasync() {},
    sendList: function sendList(list) {
      return db.insert(OPERATION, list);
    },
    update: function update(_ref3) {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var set, where;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              set = _ref3.set, where = _ref3.where;
              logmid('DB_OPERATION::', '', {
                set: set,
                where: where
              });
              _context.next = 4;
              return db.update(OPERATION, {
                set: set,
                where: where
              });

            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    },
    send: function send(_ref4) {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var uid, entityUid, entity, type, _ref4$updateTime, updateTime, syncTime, isupdate, isinsert, stage, _stage2, _stage$2, t, st;

        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              uid = _ref4.uid, entityUid = _ref4.entityUid, entity = _ref4.entity, type = _ref4.type, _ref4$updateTime = _ref4.updateTime, updateTime = _ref4$updateTime === void 0 ? nowsec() : _ref4$updateTime, syncTime = _ref4.syncTime;
              isupdate = false, isinsert = false; // console.log('----------send stage----------', JSON.stringify(data))

              _context2.next = 4;
              return db.select(OPERATION, {
                entity: entity,
                entityUid: entityUid
              });

            case 4:
              stage = _context2.sent;

              if (!(stage.length > 0)) {
                _context2.next = 14;
                break;
              }

              _stage2 = _slicedToArray(stage, 1), _stage$2 = _stage2[0], t = _stage$2.type, st = _stage$2.syncTime; // entityUid = undef(eu, entityUid)
              // entity = undef(e, entity)

              type = undef(t, type);
              syncTime = undef(st, syncTime); // console.log({ entity, type, updateTime, syncTime })

              _context2.next = 11;
              return db.update(OPERATION, {
                set: {
                  type: type,
                  updateTime: updateTime,
                  syncTime: syncTime
                },
                where: {
                  entity: entity,
                  entityUid: entityUid
                }
              });

            case 11:
              isupdate = true;
              _context2.next = 21;
              break;

            case 14:
              if (!db.table(OPERATION).lock()) {
                _context2.next = 16;
                break;
              }

              return _context2.abrupt("return", {});

            case 16:
              syncTime = undef(0, syncTime); // uid = cuid.max() + 1

              uid = cuid.max(cuid.max() + 1);
              _context2.next = 20;
              return db.insert(OPERATION, [].concat({
                uid: uid,
                entityUid: entityUid,
                entity: entity,
                type: type,
                updateTime: updateTime,
                syncTime: syncTime
              }));

            case 20:
              // cuid.max(uid)
              isinsert = true;

            case 21:
              return _context2.abrupt("return", {
                uid: uid,
                isinsert: isinsert,
                isupdate: isupdate
              });

            case 22:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }))();
    }
  };
};

var hasconcat = function hasconcat(arr, item) {
  return [].concat(arr || [], item);
};

var STAGE$1 = 0,
    ARTICLE = 1;
var isstage = function isstage(v) {
  return v == STAGE$1;
};
var isarticle = function isarticle(v) {
  return v == ARTICLE;
};
var DEL = 0,
    ADD = 1,
    UPDATE$1 = 2;
var isdel = function isdel(v) {
  return v == DEL;
};
var isadd = function isadd(v) {
  return v == ADD;
};
var isupdate = function isupdate(v) {
  return v == UPDATE$1;
}; // 归并实体

var reduceEntity = function reduceEntity(list) {
  return list.reduce(function (memo, _ref) {
    var entity = _ref.entity,
        entityUid = _ref.entityUid,
        type = _ref.type,
        updateTime = _ref.updateTime;

    if (isstage(entity)) {
      memo.stage[entityUid] = hasconcat(memo.stage[entityUid], {
        type: type,
        updateTime: updateTime
      });
    }

    if (isarticle(entity)) {
      memo.artical[entityUid] = hasconcat(memo.artical[entityUid], {
        type: type,
        updateTime: updateTime
      });
    }

    return memo;
  }, {
    stage: {},
    artical: {}
  });
}; //

var operateModel = function operateModel() {
  return [];
};

var typeUpdateTime = function typeUpdateTime(local, remote) {
  // logmid('SYNC_DATA::',{ local, remote })
  var baseLocal = operateModel(),
      baseRemote = operateModel(); // pre type 唯一值
  // local = reduceType(local)
  // remote = reduceType(remote)
  // const [localType, localUTime] = maxBy(Object.entries(local), ([_, updateTime]) => updateTime)
  // const [remoteType, remoteUTime] = maxBy(Object.entries(remote), ([_, updateTime]) => updateTime)
  // logmid('SYNC_DATA::','oooooooo:', { local, remote })

  var _maxBy = maxBy(local, function (_ref3) {
    var updateTime = _ref3.updateTime;
    return updateTime;
  }),
      localType = _maxBy.type,
      localUTime = _maxBy.updateTime;

  var _maxBy2 = maxBy(remote, function (_ref4) {
    var updateTime = _ref4.updateTime;
    return updateTime;
  }),
      remoteType = _maxBy2.type,
      remoteUTime = _maxBy2.updateTime; // logmid('SYNC_DATA::',[localType, localUTime], [remoteType, remoteUTime])


  if (localUTime > remoteUTime) baseRemote.push({
    type: localType,
    updateTime: localUTime
  });
  if (localUTime < remoteUTime) baseLocal.push({
    type: remoteType,
    updateTime: remoteUTime
  });
  return {
    localUpdate: baseLocal,
    remoteUpdate: baseRemote
  };
}; // 独有的,丢失的


var lose = function lose(old, now) {
  return Object.keys(now).filter(function (entityUid) {
    return isUnDef(old[entityUid]);
  }).reduce(function (memo, key) {
    memo[key] = now[key];
    return memo;
  }, {});
}; // 公共的


var common = function common(local, remote, commonuids) {
  logmid('SYNC_DATA::', {
    commonuids: commonuids
  }); // 本地过滤掉远程没有的, 二者都有的

  return commonuids.reduce(function (memo, entityUid) {
    var _typeUpdateTime = typeUpdateTime(local[entityUid], remote[entityUid]),
        localUpdate = _typeUpdateTime.localUpdate,
        remoteUpdate = _typeUpdateTime.remoteUpdate;

    memo.local[entityUid] = hasconcat(memo.local[entityUid], localUpdate);
    memo.remote[entityUid] = hasconcat(memo.remote[entityUid], remoteUpdate);
    return memo;
  }, {
    local: {},
    remote: {}
  }); // }, { local: loseLocal, remote: loseRemote })
}; // {entity:[{type,updateTime}]}


var margeUpdateTime = function margeUpdateTime(local, remote) {
  // logmid('SYNC_DATA::',{ local, remote })
  var loseLocal = lose(local, remote); // 本地没有

  var loseRemote = lose(remote, local); // 远程没有

  logmid('SYNC_DATA::', {
    loseRemote: loseRemote,
    loseLocal: loseLocal
  });
  var localUniqueUids = Object.keys(loseRemote);
  var commonuids = Object.keys(local).filter(function (entityUid) {
    return !has(localUniqueUids, entityUid);
  });

  var _common = common(local, remote, commonuids),
      commonLocal = _common.local,
      commonRemote = _common.remote;

  return {
    local: _objectSpread2(_objectSpread2({}, loseLocal), commonLocal),
    remote: _objectSpread2(_objectSpread2({}, loseRemote), commonRemote)
  };
};

var filterEmpty = function filterEmpty(karr) {
  return Object.keys(karr).reduce(function (memo, k) {
    if (karr[k].length) memo[k] = karr[k];
    return memo;
  }, {});
};

var update = function update(local, remote) {
  var _margeUpdateTime = margeUpdateTime(local, remote),
      l = _margeUpdateTime.local,
      r = _margeUpdateTime.remote;

  logmid('SYNC_DATA::', {
    l: l,
    r: r,
    local: local,
    remote: remote
  });
  return {
    local: filterEmpty(l),
    remote: filterEmpty(r)
  };
};

var merge$1 = function merge(local, remote) {
  // logmid('SYNC_DATA::',JSON.stringify(local))
  logmid('SYNC_DATA::', {
    local: local,
    remote: remote
  });
  return {
    stageUpdate: update(reduceEntity(local).stage, reduceEntity(remote).stage),
    articleUpdate: update(reduceEntity(local).artical, reduceEntity(remote).artical),
    deleted: function deleted(_ref5, _ref6) {
      var local = _ref5.local,
          remote = _ref5.remote;
      var entity = _ref6.entity,
          deletedEntityUidS = _ref6.deletedEntityUidS;
      deletedEntityUidS.forEach(function (_ref7) {
        var entityUid = _ref7.entityUid;
        delete remote[entityUid];
        local[entityUid] = [{
          entity: entity,
          type: 0,
          entityUid: entityUid,
          updateTime: nowsec()
        }];
      });
      return {
        local: local,
        remote: remote
      };
    }
  };
}; // merge(local, remote)

var tnames = [STAGE$2, ARTICLE$1];

var getEntity = function getEntity(t) {
  return tnames.indexOf(t);
};

var middleware = function middleware(request) {
  var _request$query = request.query;
      _request$query.middledata;
      var from = _request$query.from,
      into = _request$query.into,
      update = _request$query["in"],
      set = _request$query.set,
      where = _request$query.where,
      values = _request$query.values;
  var entity = getEntity(into || update || from); // console.log('request.name:', request.name, request, entity)
  // console.log({ middledata, into, update, set, where, values, entity })

  if (entity == -1) return; // 从服务端同步的数据, 无需触发中间件
  // if (entity == -1 || middledata.ignore) return // 从服务端同步的数据, 无需触发中间件

  var action = {
    select: function select() {// if (middledata.ismapping && !isUnDef(request.query.where?.uid)) {
      //   console.log(request.query.where.uid)
      //   request.query.where.uid = db_mapping.map.rtl(entity, request.query.where.uid)
      //   console.log(request.query.where.uid)
      // }
      // request.onResult((result) => {
      //   return result
      // })
    },
    insert: function insert() {
      request.onResult(function (result) {
        // console.log('----middleware::insert-----', { request }, query.where, query.set)
        var data = values[0];
        var updateTime = data.updateTime;
        var entityUid = data.uid; // console.log({ data, middledata })

        if (isstage(entity)) {
          db_operation.send({
            entity: entity,
            type: 1,
            entityUid: entityUid,
            updateTime: updateTime
          }); // db_mapping.send({ entity, entityUid, entityDBUid: middledata.dbuid })
          // db_stage.maxuid().then((entityUid) => {
          //   logmid('DB_OPERATION::insert:', 'stage:', entityUid)
          // })
        } else if (isarticle(entity)) {
          db_operation.send({
            entity: entity,
            type: 1,
            entityUid: entityUid,
            updateTime: updateTime
          }); // db_mapping.send({ entity, entityUid, entityDBUid: middledata.dbuid })
          // db_article.maxuid().then((entityUid) => {
          //   logmid('DB_OPERATION::insert:', 'article:', entityUid)
          // })
        }

        return result;
      });
    },
    update: function update() {
      request.onResult(function (result) {
        var entityUid = where.uid;
        var updateTime = set.updateTime;

        if (set.parent == 0) {
          // 把节点删除, 节点对应的舞台变为游离
          db_stage.minuid().then(function (rootuid) {
            // 根节点
            logmid('DB_OPERATION::', '', {
              entityUid: entityUid,
              rootuid: rootuid
            });

            if (entityUid == rootuid) {
              // 根节点默认是游离
              db_operation.update({
                set: {
                  type: 2,
                  updateTime: updateTime
                },
                where: {
                  entity: entity,
                  entityUid: entityUid
                }
              });
            } else {
              db_operation.update({
                set: {
                  type: 0,
                  updateTime: updateTime
                },
                where: {
                  entity: entity,
                  entityUid: entityUid
                }
              });
            }
          });
          logmid('DB_OPERATION::', 'unbind');
        } else {
          db_operation.send({
            type: 2,
            updateTime: updateTime,
            entity: entity,
            entityUid: entityUid
          });
          logmid('DB_OPERATION::', 'update stage', {
            entityUid: entityUid,
            entity: entity
          });
        }

        return result;
      });
    },
    "delete": function _delete() {// console.log('----delete-----', query.where, query.set)
    }
  };
  action[request.name] && action[request.name]();
};

var db = createDB({
  middleware: middleware
});
var db_node = createNode$1(db);
var db_article = createArticle(db);
var db_stage = createStage$1(db);
var db_operation = createOperation(db); // export const db_mapping = createMapping(db)

var elmt_byid = function elmt_byid(id) {
  return document.getElementById(id);
};
var elmt_style = function elmt_style(dom, v) {
  var deserialize = function deserialize(str) {
    return str.split(';').filter(function (v) {
      return v;
    }).map(function (item) {
      return item.split(':');
    }).reduce(function (memo, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];

      memo[k] = v;
      return memo;
    }, {});
  };

  var mergeVal = _objectSpread2(_objectSpread2({}, deserialize(dom.getAttribute('style') || '')), deserialize(v));

  var serialize = function serialize(val) {
    return Object.keys(val).reduce(function (memo, k) {
      memo.push("".concat(k, ":").concat(val[k]));
      return memo;
    }, []).join(';');
  };

  dom.setAttribute('style', serialize(mergeVal));
};
var elmt_display = function elmt_display(dom, v) {
  return elmt_style(dom, "display:".concat(v));
};
var elmt_classname = function elmt_classname(dom, v) {
  return dom.setAttribute('class', v);
}; // textarea tab 快捷键

var textareaTab = function textareaTab(elm) {
  var start = elm.selectionStart;
  var end = elm.selectionEnd;
  elm.value = elm.value.substring(0, start) + '\t' + elm.value.substring(end);
  elm.selectionStart = elm.selectionEnd = start + 1;
};
var showGen = function showGen(dom) {
  var isshow = false;
  return {
    show: function show(bool) {
      if (isUnDef(bool) || bool == isshow) return isshow;
      elmt_display(dom, (isshow = bool) ? 'block' : 'none');
      return isshow;
    }
  };
};

/**
 * marked - a markdown parser
 * Copyright (c) 2011-2022, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

/**
 * DO NOT EDIT THIS FILE
 * The code in this file is generated from files in ./src/
 */

function getDefaults() {
  return {
    async: false,
    baseUrl: null,
    breaks: false,
    extensions: null,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    highlight: null,
    langPrefix: 'language-',
    mangle: true,
    pedantic: false,
    renderer: null,
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    tokenizer: null,
    walkTokens: null,
    xhtml: false
  };
}

let defaults = getDefaults();

function changeDefaults(newDefaults) {
  defaults = newDefaults;
}

/**
 * Helpers
 */
const escapeTest = /[&<>"']/;
const escapeReplace = /[&<>"']/g;
const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
const escapeReplacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
const getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape(html, encode) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
}

const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

/**
 * @param {string} html
 */
function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(unescapeTest, (_, n) => {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

const caret = /(^|[^\[])\^/g;

/**
 * @param {string | RegExp} regex
 * @param {string} opt
 */
function edit$1(regex, opt) {
  regex = typeof regex === 'string' ? regex : regex.source;
  opt = opt || '';
  const obj = {
    replace: (name, val) => {
      val = val.source || val;
      val = val.replace(caret, '$1');
      regex = regex.replace(name, val);
      return obj;
    },
    getRegex: () => {
      return new RegExp(regex, opt);
    }
  };
  return obj;
}

const nonWordAndColonTest = /[^\w:]/g;
const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

/**
 * @param {boolean} sanitize
 * @param {string} base
 * @param {string} href
 */
function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    let prot;
    try {
      prot = decodeURIComponent(unescape(href))
        .replace(nonWordAndColonTest, '')
        .toLowerCase();
    } catch (e) {
      return null;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

const baseUrls = {};
const justDomain = /^[^:]+:\/*[^/]*$/;
const protocol = /^([^:]+:)[\s\S]*$/;
const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

/**
 * @param {string} base
 * @param {string} href
 */
function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (justDomain.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = rtrim(base, '/', true);
    }
  }
  base = baseUrls[' ' + base];
  const relativeBase = base.indexOf(':') === -1;

  if (href.substring(0, 2) === '//') {
    if (relativeBase) {
      return href;
    }
    return base.replace(protocol, '$1') + href;
  } else if (href.charAt(0) === '/') {
    if (relativeBase) {
      return href;
    }
    return base.replace(domain, '$1') + href;
  } else {
    return base + href;
  }
}

const noopTest = { exec: function noopTest() {} };

function merge(obj) {
  let i = 1,
    target,
    key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

function splitCells(tableRow, count) {
  // ensure that every cell-delimiting pipe has a space
  // before it to distinguish it from an escaped pipe
  const row = tableRow.replace(/\|/g, (match, offset, str) => {
      let escaped = false,
        curr = offset;
      while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
      if (escaped) {
        // odd number of slashes means | is escaped
        // so we leave it alone
        return '|';
      } else {
        // add space before unescaped |
        return ' |';
      }
    }),
    cells = row.split(/ \|/);
  let i = 0;

  // First/last cell in a row cannot be empty if it has no leading/trailing pipe
  if (!cells[0].trim()) { cells.shift(); }
  if (cells.length > 0 && !cells[cells.length - 1].trim()) { cells.pop(); }

  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count) cells.push('');
  }

  for (; i < cells.length; i++) {
    // leading or trailing whitespace is ignored per the gfm spec
    cells[i] = cells[i].trim().replace(/\\\|/g, '|');
  }
  return cells;
}

/**
 * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
 * /c*$/ is vulnerable to REDOS.
 *
 * @param {string} str
 * @param {string} c
 * @param {boolean} invert Remove suffix of non-c chars instead. Default falsey.
 */
function rtrim(str, c, invert) {
  const l = str.length;
  if (l === 0) {
    return '';
  }

  // Length of suffix matching the invert condition.
  let suffLen = 0;

  // Step left until we fail to match the invert condition.
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }

  return str.slice(0, l - suffLen);
}

function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  const l = str.length;
  let level = 0,
    i = 0;
  for (; i < l; i++) {
    if (str[i] === '\\') {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}

function checkSanitizeDeprecation(opt) {
  if (opt && opt.sanitize && !opt.silent) {
    console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
  }
}

// copied from https://stackoverflow.com/a/5450113/806777
/**
 * @param {string} pattern
 * @param {number} count
 */
function repeatString(pattern, count) {
  if (count < 1) {
    return '';
  }
  let result = '';
  while (count > 1) {
    if (count & 1) {
      result += pattern;
    }
    count >>= 1;
    pattern += pattern;
  }
  return result + pattern;
}

function outputLink(cap, link, raw, lexer) {
  const href = link.href;
  const title = link.title ? escape(link.title) : null;
  const text = cap[1].replace(/\\([\[\]])/g, '$1');

  if (cap[0].charAt(0) !== '!') {
    lexer.state.inLink = true;
    const token = {
      type: 'link',
      raw,
      href,
      title,
      text,
      tokens: lexer.inlineTokens(text)
    };
    lexer.state.inLink = false;
    return token;
  }
  return {
    type: 'image',
    raw,
    href,
    title,
    text: escape(text)
  };
}

function indentCodeCompensation(raw, text) {
  const matchIndentToCode = raw.match(/^(\s+)(?:```)/);

  if (matchIndentToCode === null) {
    return text;
  }

  const indentToCode = matchIndentToCode[1];

  return text
    .split('\n')
    .map(node => {
      const matchIndentInNode = node.match(/^\s+/);
      if (matchIndentInNode === null) {
        return node;
      }

      const [indentInNode] = matchIndentInNode;

      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }

      return node;
    })
    .join('\n');
}

/**
 * Tokenizer
 */
class Tokenizer {
  constructor(options) {
    this.options = options || defaults;
  }

  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: 'space',
        raw: cap[0]
      };
    }
  }

  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ {1,4}/gm, '');
      return {
        type: 'code',
        raw: cap[0],
        codeBlockStyle: 'indented',
        text: !this.options.pedantic
          ? rtrim(text, '\n')
          : text
      };
    }
  }

  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || '');

      return {
        type: 'code',
        raw,
        lang: cap[2] ? cap[2].trim() : cap[2],
        text
      };
    }
  }

  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();

      // remove trailing #s
      if (/#$/.test(text)) {
        const trimmed = rtrim(text, '#');
        if (this.options.pedantic) {
          text = trimmed.trim();
        } else if (!trimmed || / $/.test(trimmed)) {
          // CommonMark requires space before trailing #s
          text = trimmed.trim();
        }
      }

      return {
        type: 'heading',
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }

  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: 'hr',
        raw: cap[0]
      };
    }
  }

  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ *>[ \t]?/gm, '');

      return {
        type: 'blockquote',
        raw: cap[0],
        tokens: this.lexer.blockTokens(text, []),
        text
      };
    }
  }

  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine,
        line, nextLine, rawLine, itemContents, endEarly;

      let bull = cap[1].trim();
      const isordered = bull.length > 1;

      const list = {
        type: 'list',
        raw: '',
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : '',
        loose: false,
        items: []
      };

      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;

      if (this.options.pedantic) {
        bull = isordered ? bull : '[*+-]';
      }

      // Get next list item
      const itemRegex = new RegExp(`^( {0,3}${bull})((?:[\t ][^\\n]*)?(?:\\n|$))`);

      // Check if current bullet point can start a new List Item
      while (src) {
        endEarly = false;
        if (!(cap = itemRegex.exec(src))) {
          break;
        }

        if (this.rules.block.hr.test(src)) { // End list if bullet was actually HR (possibly move into itemRegex?)
          break;
        }

        raw = cap[0];
        src = src.substring(raw.length);

        line = cap[2].split('\n', 1)[0];
        nextLine = src.split('\n', 1)[0];

        if (this.options.pedantic) {
          indent = 2;
          itemContents = line.trimLeft();
        } else {
          indent = cap[2].search(/[^ ]/); // Find first non-space char
          indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }

        blankLine = false;

        if (!line && /^ *$/.test(nextLine)) { // Items begin with at most one blank line
          raw += nextLine + '\n';
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }

        if (!endEarly) {
          const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?: [^\\n]*)?(?:\\n|$))`);
          const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
          const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
          const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);

          // Check if following lines should be included in List Item
          while (src) {
            rawLine = src.split('\n', 1)[0];
            line = rawLine;

            // Re-align to follow commonmark nesting rules
            if (this.options.pedantic) {
              line = line.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ');
            }

            // End list item if found code fences
            if (fencesBeginRegex.test(line)) {
              break;
            }

            // End list item if found start of new heading
            if (headingBeginRegex.test(line)) {
              break;
            }

            // End list item if found start of new bullet
            if (nextBulletRegex.test(line)) {
              break;
            }

            // Horizontal rule found
            if (hrRegex.test(src)) {
              break;
            }

            if (line.search(/[^ ]/) >= indent || !line.trim()) { // Dedent if possible
              itemContents += '\n' + line.slice(indent);
            } else if (!blankLine) { // Until blank line, item doesn't need indentation
              itemContents += '\n' + line;
            } else { // Otherwise, improper indentation ends this item
              break;
            }

            if (!blankLine && !line.trim()) { // Check if current line is blank
              blankLine = true;
            }

            raw += rawLine + '\n';
            src = src.substring(rawLine.length + 1);
          }
        }

        if (!list.loose) {
          // If the previous item ended with a blank line, the list is loose
          if (endsWithBlankLine) {
            list.loose = true;
          } else if (/\n *\n *$/.test(raw)) {
            endsWithBlankLine = true;
          }
        }

        // Check for task list items
        if (this.options.gfm) {
          istask = /^\[[ xX]\] /.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== '[ ] ';
            itemContents = itemContents.replace(/^\[[ xX]\] +/, '');
          }
        }

        list.items.push({
          type: 'list_item',
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents
        });

        list.raw += raw;
      }

      // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
      list.items[list.items.length - 1].raw = raw.trimRight();
      list.items[list.items.length - 1].text = itemContents.trimRight();
      list.raw = list.raw.trimRight();

      const l = list.items.length;

      // Item child tokens handled here at end because we needed to have the final item to trim it first
      for (i = 0; i < l; i++) {
        this.lexer.state.top = false;
        list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);
        const spacers = list.items[i].tokens.filter(t => t.type === 'space');
        const hasMultipleLineBreaks = spacers.every(t => {
          const chars = t.raw.split('');
          let lineBreaks = 0;
          for (const char of chars) {
            if (char === '\n') {
              lineBreaks += 1;
            }
            if (lineBreaks > 1) {
              return true;
            }
          }

          return false;
        });

        if (!list.loose && spacers.length && hasMultipleLineBreaks) {
          // Having a single line break doesn't mean a list is loose. A single line break is terminating the last list item
          list.loose = true;
          list.items[i].loose = true;
        }
      }

      return list;
    }
  }

  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token = {
        type: 'html',
        raw: cap[0],
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      };
      if (this.options.sanitize) {
        const text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
        token.type = 'paragraph';
        token.text = text;
        token.tokens = this.lexer.inline(text);
      }
      return token;
    }
  }

  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
      const tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
      return {
        type: 'def',
        tag,
        raw: cap[0],
        href: cap[2],
        title: cap[3]
      };
    }
  }

  table(src) {
    const cap = this.rules.block.table.exec(src);
    if (cap) {
      const item = {
        type: 'table',
        header: splitCells(cap[1]).map(c => { return { text: c }; }),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        rows: cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, '').split('\n') : []
      };

      if (item.header.length === item.align.length) {
        item.raw = cap[0];

        let l = item.align.length;
        let i, j, k, row;
        for (i = 0; i < l; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        l = item.rows.length;
        for (i = 0; i < l; i++) {
          item.rows[i] = splitCells(item.rows[i], item.header.length).map(c => { return { text: c }; });
        }

        // parse child tokens inside headers and cells

        // header child tokens
        l = item.header.length;
        for (j = 0; j < l; j++) {
          item.header[j].tokens = this.lexer.inline(item.header[j].text);
        }

        // cell child tokens
        l = item.rows.length;
        for (j = 0; j < l; j++) {
          row = item.rows[j];
          for (k = 0; k < row.length; k++) {
            row[k].tokens = this.lexer.inline(row[k].text);
          }
        }

        return item;
      }
    }
  }

  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: 'heading',
        raw: cap[0],
        depth: cap[2].charAt(0) === '=' ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1])
      };
    }
  }

  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const text = cap[1].charAt(cap[1].length - 1) === '\n'
        ? cap[1].slice(0, -1)
        : cap[1];
      return {
        type: 'paragraph',
        raw: cap[0],
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }

  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: 'text',
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0])
      };
    }
  }

  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: 'escape',
        raw: cap[0],
        text: escape(cap[1])
      };
    }
  }

  tag(src) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
        this.lexer.state.inLink = false;
      }
      if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = true;
      } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = false;
      }

      return {
        type: this.options.sanitize
          ? 'text'
          : 'html',
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        text: this.options.sanitize
          ? (this.options.sanitizer
            ? this.options.sanitizer(cap[0])
            : escape(cap[0]))
          : cap[0]
      };
    }
  }

  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && /^</.test(trimmedUrl)) {
        // commonmark requires matching angle brackets
        if (!(/>$/.test(trimmedUrl))) {
          return;
        }

        // ending angle bracket cannot be escaped
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        // find closing parenthesis
        const lastParenIndex = findClosingBracket(cap[2], '()');
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf('!') === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = '';
        }
      }
      let href = cap[2];
      let title = '';
      if (this.options.pedantic) {
        // split pedantic href and title
        const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

        if (link) {
          href = link[1];
          title = link[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : '';
      }

      href = href.trim();
      if (/^</.test(href)) {
        if (this.options.pedantic && !(/>$/.test(trimmedUrl))) {
          // pedantic allows starting angle bracket without ending angle bracket
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
        title: title ? title.replace(this.rules.inline._escapes, '$1') : title
      }, cap[0], this.lexer);
    }
  }

  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src))
        || (cap = this.rules.inline.nolink.exec(src))) {
      let link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = links[link.toLowerCase()];
      if (!link || !link.href) {
        const text = cap[0].charAt(0);
        return {
          type: 'text',
          raw: text,
          text
        };
      }
      return outputLink(cap, link, cap[0], this.lexer);
    }
  }

  emStrong(src, maskedSrc, prevChar = '') {
    let match = this.rules.inline.emStrong.lDelim.exec(src);
    if (!match) return;

    // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
    if (match[3] && prevChar.match(/[\p{L}\p{N}]/u)) return;

    const nextChar = match[1] || match[2] || '';

    if (!nextChar || (nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))) {
      const lLength = match[0].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;

      const endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
      endReg.lastIndex = 0;

      // Clip maskedSrc to same section of string as src (move to lexer?)
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];

        if (!rDelim) continue; // skip single * in __abc*abc__

        rLength = rDelim.length;

        if (match[3] || match[4]) { // found another Left Delim
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) { // either Left or Right Delim
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue; // CommonMark Emphasis Rules 9-10
          }
        }

        delimTotal -= rLength;

        if (delimTotal > 0) continue; // Haven't found enough closing delimiters

        // Remove extra characters. *a*** -> *a*
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);

        // Create `em` if smallest delimiter has odd char count. *a***
        if (Math.min(lLength, rLength) % 2) {
          const text = src.slice(1, lLength + match.index + rLength);
          return {
            type: 'em',
            raw: src.slice(0, lLength + match.index + rLength + 1),
            text,
            tokens: this.lexer.inlineTokens(text)
          };
        }

        // Create 'strong' if smallest delimiter has even char count. **a***
        const text = src.slice(2, lLength + match.index + rLength - 1);
        return {
          type: 'strong',
          raw: src.slice(0, lLength + match.index + rLength + 1),
          text,
          tokens: this.lexer.inlineTokens(text)
        };
      }
    }
  }

  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(/\n/g, ' ');
      const hasNonSpaceChars = /[^ ]/.test(text);
      const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      text = escape(text, true);
      return {
        type: 'codespan',
        raw: cap[0],
        text
      };
    }
  }

  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: 'br',
        raw: cap[0]
      };
    }
  }

  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: 'del',
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2])
      };
    }
  }

  autolink(src, mangle) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === '@') {
        text = escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
        href = 'mailto:' + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }

      return {
        type: 'link',
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: 'text',
            raw: text,
            text
          }
        ]
      };
    }
  }

  url(src, mangle) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text, href;
      if (cap[2] === '@') {
        text = escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
        href = 'mailto:' + text;
      } else {
        // do extended autolink path validation
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape(cap[0]);
        if (cap[1] === 'www.') {
          href = 'http://' + text;
        } else {
          href = text;
        }
      }
      return {
        type: 'link',
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: 'text',
            raw: text,
            text
          }
        ]
      };
    }
  }

  inlineText(src, smartypants) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      let text;
      if (this.lexer.state.inRawBlock) {
        text = this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0];
      } else {
        text = escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
      }
      return {
        type: 'text',
        raw: cap[0],
        text
      };
    }
  }
}

/**
 * Block-Level Grammar
 */
const block = {
  newline: /^(?: *(?:\n|$))+/,
  code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
  fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
  hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
  html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
    + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (6)
    + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) open tag
    + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) closing tag
    + ')',
  def: /^ {0,3}\[(label)\]: *(?:\n *)?<?([^\s>]+)>?(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
  table: noopTest,
  lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
  text: /^[^\n]+/
};

block._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit$1(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
block.listItemStart = edit$1(/^( *)(bull) */)
  .replace('bull', block.bullet)
  .getRegex();

block.list = edit$1(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
  .replace('def', '\\n+(?=' + block.def.source + ')')
  .getRegex();

block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
  + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
  + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
  + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
  + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
  + '|track|ul';
block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
block.html = edit$1(block.html, 'i')
  .replace('comment', block._comment)
  .replace('tag', block._tag)
  .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
  .getRegex();

block.paragraph = edit$1(block._paragraph)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('|table', '')
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();

block.blockquote = edit$1(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  table: '^ *([^\\n ].*\\|.*)\\n' // Header
    + ' {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?' // Align
    + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells
});

block.gfm.table = edit$1(block.gfm.table)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('blockquote', ' {0,3}>')
  .replace('code', ' {4}[^\\n]')
  .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
  .replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
  .getRegex();

block.gfm.paragraph = edit$1(block._paragraph)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('table', block.gfm.table) // interrupt paragraphs with table
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();
/**
 * Pedantic grammar (original John Gruber's loose markdown specification)
 */

block.pedantic = merge({}, block.normal, {
  html: edit$1(
    '^ *(?:comment *(?:\\n|\\s*$)'
    + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
    .replace('comment', block._comment)
    .replace(/tag/g, '(?!(?:'
      + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
      + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
      + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
    .getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest, // fences not supported
  paragraph: edit$1(block.normal._paragraph)
    .replace('hr', block.hr)
    .replace('heading', ' *#{1,6} *[^\n]')
    .replace('lheading', block.lheading)
    .replace('blockquote', ' {0,3}>')
    .replace('|fences', '')
    .replace('|list', '')
    .replace('|html', '')
    .getRegex()
});

/**
 * Inline-Level Grammar
 */
const inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noopTest,
  tag: '^comment'
    + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(ref)\]/,
  nolink: /^!?\[(ref)\](?:\[\])?/,
  reflinkSearch: 'reflink|nolink(?!\\()',
  emStrong: {
    lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
    //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
    //          () Skip orphan inside strong  () Consume to delim (1) #***                (2) a***#, a***                   (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
    rDelimAst: /^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[^*]+(?=[^*])|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
    rDelimUnd: /^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _
  },
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noopTest,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  punctuation: /^([\spunctuation])/
};

// list of punctuation marks from CommonMark spec
// without * and _ to handle the different emphasis markers * and _
inline._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
inline.punctuation = edit$1(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();

// sequences em should skip over [title](link), `code`, <html>
inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
inline.escapedEmSt = /\\\*|\\_/g;

inline._comment = edit$1(block._comment).replace('(?:-->|$)', '-->').getRegex();

inline.emStrong.lDelim = edit$1(inline.emStrong.lDelim)
  .replace(/punct/g, inline._punctuation)
  .getRegex();

inline.emStrong.rDelimAst = edit$1(inline.emStrong.rDelimAst, 'g')
  .replace(/punct/g, inline._punctuation)
  .getRegex();

inline.emStrong.rDelimUnd = edit$1(inline.emStrong.rDelimUnd, 'g')
  .replace(/punct/g, inline._punctuation)
  .getRegex();

inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit$1(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex();

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

inline.tag = edit$1(inline.tag)
  .replace('comment', inline._comment)
  .replace('attribute', inline._attribute)
  .getRegex();

inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

inline.link = edit$1(inline.link)
  .replace('label', inline._label)
  .replace('href', inline._href)
  .replace('title', inline._title)
  .getRegex();

inline.reflink = edit$1(inline.reflink)
  .replace('label', inline._label)
  .replace('ref', block._label)
  .getRegex();

inline.nolink = edit$1(inline.nolink)
  .replace('ref', block._label)
  .getRegex();

inline.reflinkSearch = edit$1(inline.reflinkSearch, 'g')
  .replace('reflink', inline.reflink)
  .replace('nolink', inline.nolink)
  .getRegex();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: {
    start: /^__|\*\*/,
    middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    endAst: /\*\*(?!\*)/g,
    endUnd: /__(?!_)/g
  },
  em: {
    start: /^_|\*/,
    middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
    endAst: /\*(?!\*)/g,
    endUnd: /_(?!_)/g
  },
  link: edit$1(/^!?\[(label)\]\((.*?)\)/)
    .replace('label', inline._label)
    .getRegex(),
  reflink: edit$1(/^!?\[(label)\]\s*\[([^\]]*)\]/)
    .replace('label', inline._label)
    .getRegex()
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: edit$1(inline.escape).replace('])', '~|])').getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
});

inline.gfm.url = edit$1(inline.gfm.url, 'i')
  .replace('email', inline.gfm._extended_email)
  .getRegex();
/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: edit$1(inline.br).replace('{2,}', '*').getRegex(),
  text: edit$1(inline.gfm.text)
    .replace('\\b_', '\\b_| {2,}\\n')
    .replace(/\{2,\}/g, '*')
    .getRegex()
});

/**
 * smartypants text replacement
 * @param {string} text
 */
function smartypants(text) {
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
}

/**
 * mangle email addresses
 * @param {string} text
 */
function mangle(text) {
  let out = '',
    i,
    ch;

  const l = text.length;
  for (i = 0; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
}

/**
 * Block Lexer
 */
class Lexer {
  constructor(options) {
    this.tokens = [];
    this.tokens.links = Object.create(null);
    this.options = options || defaults;
    this.options.tokenizer = this.options.tokenizer || new Tokenizer();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    this.tokenizer.lexer = this;
    this.inlineQueue = [];
    this.state = {
      inLink: false,
      inRawBlock: false,
      top: true
    };

    const rules = {
      block: block.normal,
      inline: inline.normal
    };

    if (this.options.pedantic) {
      rules.block = block.pedantic;
      rules.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules.block = block.gfm;
      if (this.options.breaks) {
        rules.inline = inline.breaks;
      } else {
        rules.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules;
  }

  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block,
      inline
    };
  }

  /**
   * Static Lex Method
   */
  static lex(src, options) {
    const lexer = new Lexer(options);
    return lexer.lex(src);
  }

  /**
   * Static Lex Inline Method
   */
  static lexInline(src, options) {
    const lexer = new Lexer(options);
    return lexer.inlineTokens(src);
  }

  /**
   * Preprocessing
   */
  lex(src) {
    src = src
      .replace(/\r\n|\r/g, '\n');

    this.blockTokens(src, this.tokens);

    let next;
    while (next = this.inlineQueue.shift()) {
      this.inlineTokens(next.src, next.tokens);
    }

    return this.tokens;
  }

  /**
   * Lexing
   */
  blockTokens(src, tokens = []) {
    if (this.options.pedantic) {
      src = src.replace(/\t/g, '    ').replace(/^ +$/gm, '');
    } else {
      src = src.replace(/^( *)(\t+)/gm, (_, leading, tabs) => {
        return leading + '    '.repeat(tabs.length);
      });
    }

    let token, lastToken, cutSrc, lastParagraphClipped;

    while (src) {
      if (this.options.extensions
        && this.options.extensions.block
        && this.options.extensions.block.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
        continue;
      }

      // newline
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        if (token.raw.length === 1 && tokens.length > 0) {
          // if there's a single \n as a spacer, it's terminating the last line,
          // so move it there so that we don't get unecessary paragraph tags
          tokens[tokens.length - 1].raw += '\n';
        } else {
          tokens.push(token);
        }
        continue;
      }

      // code
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        // An indented code block cannot interrupt a paragraph.
        if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.text;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // fences
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // heading
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // hr
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // blockquote
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // list
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // html
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // def
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.raw;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }

      // table (gfm)
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // lheading
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // top-level paragraph
      // prevent paragraph consuming extensions by clipping 'src' to extension start
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        lastToken = tokens[tokens.length - 1];
        if (lastParagraphClipped && lastToken.type === 'paragraph') {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = (cutSrc.length !== src.length);
        src = src.substring(token.raw.length);
        continue;
      }

      // text
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === 'text') {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      if (src) {
        const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }

    this.state.top = true;
    return tokens;
  }

  inline(src, tokens = []) {
    this.inlineQueue.push({ src, tokens });
    return tokens;
  }

  /**
   * Lexing/Compiling
   */
  inlineTokens(src, tokens = []) {
    let token, lastToken, cutSrc;

    // String with links masked to avoid interference with em and strong
    let maskedSrc = src;
    let match;
    let keepPrevChar, prevChar;

    // Mask out reflinks
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    // Mask out other blocks
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }

    // Mask out escaped em & strong delimiters
    while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
    }

    while (src) {
      if (!keepPrevChar) {
        prevChar = '';
      }
      keepPrevChar = false;

      // extensions
      if (this.options.extensions
        && this.options.extensions.inline
        && this.options.extensions.inline.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
        continue;
      }

      // escape
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // tag
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === 'text' && lastToken.type === 'text') {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // link
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // reflink, nolink
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === 'text' && lastToken.type === 'text') {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // em & strong
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // code
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // br
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // del (gfm)
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // autolink
      if (token = this.tokenizer.autolink(src, mangle)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // url (gfm)
      if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // text
      // prevent inlineText consuming extensions by clipping 'src' to extension start
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === 'text') {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      if (src) {
        const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }

    return tokens;
  }
}

/**
 * Renderer
 */
class Renderer {
  constructor(options) {
    this.options = options || defaults;
  }

  code(code, infostring, escaped) {
    const lang = (infostring || '').match(/\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    code = code.replace(/\n$/, '') + '\n';

    if (!lang) {
      return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '</code></pre>\n';
    }

    return '<pre><code class="'
      + this.options.langPrefix
      + escape(lang, true)
      + '">'
      + (escaped ? code : escape(code, true))
      + '</code></pre>\n';
  }

  /**
   * @param {string} quote
   */
  blockquote(quote) {
    return `<blockquote>\n${quote}</blockquote>\n`;
  }

  html(html) {
    return html;
  }

  /**
   * @param {string} text
   * @param {string} level
   * @param {string} raw
   * @param {any} slugger
   */
  heading(text, level, raw, slugger) {
    if (this.options.headerIds) {
      const id = this.options.headerPrefix + slugger.slug(raw);
      return `<h${level} id="${id}">${text}</h${level}>\n`;
    }

    // ignore IDs
    return `<h${level}>${text}</h${level}>\n`;
  }

  hr() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
  }

  list(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
  }

  /**
   * @param {string} text
   */
  listitem(text) {
    return `<li>${text}</li>\n`;
  }

  checkbox(checked) {
    return '<input '
      + (checked ? 'checked="" ' : '')
      + 'disabled="" type="checkbox"'
      + (this.options.xhtml ? ' /' : '')
      + '> ';
  }

  /**
   * @param {string} text
   */
  paragraph(text) {
    return `<p>${text}</p>\n`;
  }

  /**
   * @param {string} header
   * @param {string} body
   */
  table(header, body) {
    if (body) body = `<tbody>${body}</tbody>`;

    return '<table>\n'
      + '<thead>\n'
      + header
      + '</thead>\n'
      + body
      + '</table>\n';
  }

  /**
   * @param {string} content
   */
  tablerow(content) {
    return `<tr>\n${content}</tr>\n`;
  }

  tablecell(content, flags) {
    const type = flags.header ? 'th' : 'td';
    const tag = flags.align
      ? `<${type} align="${flags.align}">`
      : `<${type}>`;
    return tag + content + `</${type}>\n`;
  }

  /**
   * span level renderer
   * @param {string} text
   */
  strong(text) {
    return `<strong>${text}</strong>`;
  }

  /**
   * @param {string} text
   */
  em(text) {
    return `<em>${text}</em>`;
  }

  /**
   * @param {string} text
   */
  codespan(text) {
    return `<code>${text}</code>`;
  }

  br() {
    return this.options.xhtml ? '<br/>' : '<br>';
  }

  /**
   * @param {string} text
   */
  del(text) {
    return `<del>${text}</del>`;
  }

  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  link(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a href="' + escape(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  }

  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  image(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }

    let out = `<img src="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
  }

  text(text) {
    return text;
  }
}

/**
 * TextRenderer
 * returns only the textual part of the token
 */
class TextRenderer {
  // no need for block level renderers
  strong(text) {
    return text;
  }

  em(text) {
    return text;
  }

  codespan(text) {
    return text;
  }

  del(text) {
    return text;
  }

  html(text) {
    return text;
  }

  text(text) {
    return text;
  }

  link(href, title, text) {
    return '' + text;
  }

  image(href, title, text) {
    return '' + text;
  }

  br() {
    return '';
  }
}

/**
 * Slugger generates header id
 */
class Slugger {
  constructor() {
    this.seen = {};
  }

  /**
   * @param {string} value
   */
  serialize(value) {
    return value
      .toLowerCase()
      .trim()
      // remove html tags
      .replace(/<[!\/a-z].*?>/ig, '')
      // remove unwanted chars
      .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
      .replace(/\s/g, '-');
  }

  /**
   * Finds the next safe (unique) slug to use
   * @param {string} originalSlug
   * @param {boolean} isDryRun
   */
  getNextSafeSlug(originalSlug, isDryRun) {
    let slug = originalSlug;
    let occurenceAccumulator = 0;
    if (this.seen.hasOwnProperty(slug)) {
      occurenceAccumulator = this.seen[originalSlug];
      do {
        occurenceAccumulator++;
        slug = originalSlug + '-' + occurenceAccumulator;
      } while (this.seen.hasOwnProperty(slug));
    }
    if (!isDryRun) {
      this.seen[originalSlug] = occurenceAccumulator;
      this.seen[slug] = 0;
    }
    return slug;
  }

  /**
   * Convert string to unique id
   * @param {object} [options]
   * @param {boolean} [options.dryrun] Generates the next unique slug without
   * updating the internal accumulator.
   */
  slug(value, options = {}) {
    const slug = this.serialize(value);
    return this.getNextSafeSlug(slug, options.dryrun);
  }
}

/**
 * Parsing & Compiling
 */
class Parser {
  constructor(options) {
    this.options = options || defaults;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.textRenderer = new TextRenderer();
    this.slugger = new Slugger();
  }

  /**
   * Static Parse Method
   */
  static parse(tokens, options) {
    const parser = new Parser(options);
    return parser.parse(tokens);
  }

  /**
   * Static Parse Inline Method
   */
  static parseInline(tokens, options) {
    const parser = new Parser(options);
    return parser.parseInline(tokens);
  }

  /**
   * Parse Loop
   */
  parse(tokens, top = true) {
    let out = '',
      i,
      j,
      k,
      l2,
      l3,
      row,
      cell,
      header,
      body,
      token,
      ordered,
      start,
      loose,
      itemBody,
      item,
      checked,
      task,
      checkbox,
      ret;

    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];

      // Run any renderer extensions
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(token.type)) {
          out += ret || '';
          continue;
        }
      }

      switch (token.type) {
        case 'space': {
          continue;
        }
        case 'hr': {
          out += this.renderer.hr();
          continue;
        }
        case 'heading': {
          out += this.renderer.heading(
            this.parseInline(token.tokens),
            token.depth,
            unescape(this.parseInline(token.tokens, this.textRenderer)),
            this.slugger);
          continue;
        }
        case 'code': {
          out += this.renderer.code(token.text,
            token.lang,
            token.escaped);
          continue;
        }
        case 'table': {
          header = '';

          // header
          cell = '';
          l2 = token.header.length;
          for (j = 0; j < l2; j++) {
            cell += this.renderer.tablecell(
              this.parseInline(token.header[j].tokens),
              { header: true, align: token.align[j] }
            );
          }
          header += this.renderer.tablerow(cell);

          body = '';
          l2 = token.rows.length;
          for (j = 0; j < l2; j++) {
            row = token.rows[j];

            cell = '';
            l3 = row.length;
            for (k = 0; k < l3; k++) {
              cell += this.renderer.tablecell(
                this.parseInline(row[k].tokens),
                { header: false, align: token.align[k] }
              );
            }

            body += this.renderer.tablerow(cell);
          }
          out += this.renderer.table(header, body);
          continue;
        }
        case 'blockquote': {
          body = this.parse(token.tokens);
          out += this.renderer.blockquote(body);
          continue;
        }
        case 'list': {
          ordered = token.ordered;
          start = token.start;
          loose = token.loose;
          l2 = token.items.length;

          body = '';
          for (j = 0; j < l2; j++) {
            item = token.items[j];
            checked = item.checked;
            task = item.task;

            itemBody = '';
            if (item.task) {
              checkbox = this.renderer.checkbox(checked);
              if (loose) {
                if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
                  item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                  if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                    item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                  }
                } else {
                  item.tokens.unshift({
                    type: 'text',
                    text: checkbox
                  });
                }
              } else {
                itemBody += checkbox;
              }
            }

            itemBody += this.parse(item.tokens, loose);
            body += this.renderer.listitem(itemBody, task, checked);
          }

          out += this.renderer.list(body, ordered, start);
          continue;
        }
        case 'html': {
          // TODO parse inline content if parameter markdown=1
          out += this.renderer.html(token.text);
          continue;
        }
        case 'paragraph': {
          out += this.renderer.paragraph(this.parseInline(token.tokens));
          continue;
        }
        case 'text': {
          body = token.tokens ? this.parseInline(token.tokens) : token.text;
          while (i + 1 < l && tokens[i + 1].type === 'text') {
            token = tokens[++i];
            body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
          }
          out += top ? this.renderer.paragraph(body) : body;
          continue;
        }

        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }

    return out;
  }

  /**
   * Parse Inline Tokens
   */
  parseInline(tokens, renderer) {
    renderer = renderer || this.renderer;
    let out = '',
      i,
      token,
      ret;

    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];

      // Run any renderer extensions
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
          out += ret || '';
          continue;
        }
      }

      switch (token.type) {
        case 'escape': {
          out += renderer.text(token.text);
          break;
        }
        case 'html': {
          out += renderer.html(token.text);
          break;
        }
        case 'link': {
          out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
          break;
        }
        case 'image': {
          out += renderer.image(token.href, token.title, token.text);
          break;
        }
        case 'strong': {
          out += renderer.strong(this.parseInline(token.tokens, renderer));
          break;
        }
        case 'em': {
          out += renderer.em(this.parseInline(token.tokens, renderer));
          break;
        }
        case 'codespan': {
          out += renderer.codespan(token.text);
          break;
        }
        case 'br': {
          out += renderer.br();
          break;
        }
        case 'del': {
          out += renderer.del(this.parseInline(token.tokens, renderer));
          break;
        }
        case 'text': {
          out += renderer.text(token.text);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
}

/**
 * Marked
 */
function marked$1(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type '
      + Object.prototype.toString.call(src) + ', string expected');
  }

  if (typeof opt === 'function') {
    callback = opt;
    opt = null;
  }

  opt = merge({}, marked$1.defaults, opt || {});
  checkSanitizeDeprecation(opt);

  if (callback) {
    const highlight = opt.highlight;
    let tokens;

    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    const done = function(err) {
      let out;

      if (!err) {
        try {
          if (opt.walkTokens) {
            marked$1.walkTokens(tokens, opt.walkTokens);
          }
          out = Parser.parse(tokens, opt);
        } catch (e) {
          err = e;
        }
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!tokens.length) return done();

    let pending = 0;
    marked$1.walkTokens(tokens, function(token) {
      if (token.type === 'code') {
        pending++;
        setTimeout(() => {
          highlight(token.text, token.lang, function(err, code) {
            if (err) {
              return done(err);
            }
            if (code != null && code !== token.text) {
              token.text = code;
              token.escaped = true;
            }

            pending--;
            if (pending === 0) {
              done();
            }
          });
        }, 0);
      }
    });

    if (pending === 0) {
      done();
    }

    return;
  }

  function onError(e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if (opt.silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }

  try {
    const tokens = Lexer.lex(src, opt);
    if (opt.walkTokens) {
      if (opt.async) {
        return Promise.all(marked$1.walkTokens(tokens, opt.walkTokens))
          .then(() => {
            return Parser.parse(tokens, opt);
          })
          .catch(onError);
      }
      marked$1.walkTokens(tokens, opt.walkTokens);
    }
    return Parser.parse(tokens, opt);
  } catch (e) {
    onError(e);
  }
}

/**
 * Options
 */

marked$1.options =
marked$1.setOptions = function(opt) {
  merge(marked$1.defaults, opt);
  changeDefaults(marked$1.defaults);
  return marked$1;
};

marked$1.getDefaults = getDefaults;

marked$1.defaults = defaults;

/**
 * Use Extension
 */

marked$1.use = function(...args) {
  const opts = merge({}, ...args);
  const extensions = marked$1.defaults.extensions || { renderers: {}, childTokens: {} };
  let hasExtensions;

  args.forEach((pack) => {
    // ==-- Parse "addon" extensions --== //
    if (pack.extensions) {
      hasExtensions = true;
      pack.extensions.forEach((ext) => {
        if (!ext.name) {
          throw new Error('extension name required');
        }
        if (ext.renderer) { // Renderer extensions
          const prevRenderer = extensions.renderers ? extensions.renderers[ext.name] : null;
          if (prevRenderer) {
            // Replace extension with func to run new extension but fall back if false
            extensions.renderers[ext.name] = function(...args) {
              let ret = ext.renderer.apply(this, args);
              if (ret === false) {
                ret = prevRenderer.apply(this, args);
              }
              return ret;
            };
          } else {
            extensions.renderers[ext.name] = ext.renderer;
          }
        }
        if (ext.tokenizer) { // Tokenizer Extensions
          if (!ext.level || (ext.level !== 'block' && ext.level !== 'inline')) {
            throw new Error("extension level must be 'block' or 'inline'");
          }
          if (extensions[ext.level]) {
            extensions[ext.level].unshift(ext.tokenizer);
          } else {
            extensions[ext.level] = [ext.tokenizer];
          }
          if (ext.start) { // Function to check for start of token
            if (ext.level === 'block') {
              if (extensions.startBlock) {
                extensions.startBlock.push(ext.start);
              } else {
                extensions.startBlock = [ext.start];
              }
            } else if (ext.level === 'inline') {
              if (extensions.startInline) {
                extensions.startInline.push(ext.start);
              } else {
                extensions.startInline = [ext.start];
              }
            }
          }
        }
        if (ext.childTokens) { // Child tokens to be visited by walkTokens
          extensions.childTokens[ext.name] = ext.childTokens;
        }
      });
    }

    // ==-- Parse "overwrite" extensions --== //
    if (pack.renderer) {
      const renderer = marked$1.defaults.renderer || new Renderer();
      for (const prop in pack.renderer) {
        const prevRenderer = renderer[prop];
        // Replace renderer with func to run extension, but fall back if false
        renderer[prop] = (...args) => {
          let ret = pack.renderer[prop].apply(renderer, args);
          if (ret === false) {
            ret = prevRenderer.apply(renderer, args);
          }
          return ret;
        };
      }
      opts.renderer = renderer;
    }
    if (pack.tokenizer) {
      const tokenizer = marked$1.defaults.tokenizer || new Tokenizer();
      for (const prop in pack.tokenizer) {
        const prevTokenizer = tokenizer[prop];
        // Replace tokenizer with func to run extension, but fall back if false
        tokenizer[prop] = (...args) => {
          let ret = pack.tokenizer[prop].apply(tokenizer, args);
          if (ret === false) {
            ret = prevTokenizer.apply(tokenizer, args);
          }
          return ret;
        };
      }
      opts.tokenizer = tokenizer;
    }

    // ==-- Parse WalkTokens extensions --== //
    if (pack.walkTokens) {
      const walkTokens = marked$1.defaults.walkTokens;
      opts.walkTokens = function(token) {
        let values = [];
        values.push(pack.walkTokens.call(this, token));
        if (walkTokens) {
          values = values.concat(walkTokens.call(this, token));
        }
        return values;
      };
    }

    if (hasExtensions) {
      opts.extensions = extensions;
    }

    marked$1.setOptions(opts);
  });
};

/**
 * Run callback for every token
 */

marked$1.walkTokens = function(tokens, callback) {
  let values = [];
  for (const token of tokens) {
    values = values.concat(callback.call(marked$1, token));
    switch (token.type) {
      case 'table': {
        for (const cell of token.header) {
          values = values.concat(marked$1.walkTokens(cell.tokens, callback));
        }
        for (const row of token.rows) {
          for (const cell of row) {
            values = values.concat(marked$1.walkTokens(cell.tokens, callback));
          }
        }
        break;
      }
      case 'list': {
        values = values.concat(marked$1.walkTokens(token.items, callback));
        break;
      }
      default: {
        if (marked$1.defaults.extensions && marked$1.defaults.extensions.childTokens && marked$1.defaults.extensions.childTokens[token.type]) { // Walk any extensions
          marked$1.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
            values = values.concat(marked$1.walkTokens(token[childTokens], callback));
          });
        } else if (token.tokens) {
          values = values.concat(marked$1.walkTokens(token.tokens, callback));
        }
      }
    }
  }
  return values;
};

/**
 * Parse Inline
 * @param {string} src
 */
marked$1.parseInline = function(src, opt) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked.parseInline(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked.parseInline(): input parameter is of type '
      + Object.prototype.toString.call(src) + ', string expected');
  }

  opt = merge({}, marked$1.defaults, opt || {});
  checkSanitizeDeprecation(opt);

  try {
    const tokens = Lexer.lexInline(src, opt);
    if (opt.walkTokens) {
      marked$1.walkTokens(tokens, opt.walkTokens);
    }
    return Parser.parseInline(tokens, opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if (opt.silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
};

/**
 * Expose
 */
marked$1.Parser = Parser;
marked$1.parser = Parser.parse;
marked$1.Renderer = Renderer;
marked$1.TextRenderer = TextRenderer;
marked$1.Lexer = Lexer;
marked$1.lexer = Lexer.lex;
marked$1.Tokenizer = Tokenizer;
marked$1.Slugger = Slugger;
marked$1.parse = marked$1;

marked$1.options;
marked$1.setOptions;
marked$1.use;
marked$1.walkTokens;
marked$1.parseInline;
Parser.parse;
Lexer.lex;

var code$1 = {exports: {}};

/* PrismJS 1.29.0
https://prismjs.com/download.html#themes=prism-dark&languages=markup+css+clike+javascript+c+cpp */

(function (module) {
  var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
      Prism = function (e) {
    var n = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
        t = 0,
        r = {},
        a = {
      manual: e.Prism && e.Prism.manual,
      disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
      util: {
        encode: function e(n) {
          return n instanceof i ? new i(n.type, e(n.content), n.alias) : Array.isArray(n) ? n.map(e) : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
        },
        type: function type(e) {
          return Object.prototype.toString.call(e).slice(8, -1);
        },
        objId: function objId(e) {
          return e.__id || Object.defineProperty(e, "__id", {
            value: ++t
          }), e.__id;
        },
        clone: function e(n, t) {
          var r, i;

          switch (t = t || {}, a.util.type(n)) {
            case "Object":
              if (i = a.util.objId(n), t[i]) return t[i];

              for (var l in r = {}, t[i] = r, n) n.hasOwnProperty(l) && (r[l] = e(n[l], t));

              return r;

            case "Array":
              return i = a.util.objId(n), t[i] ? t[i] : (r = [], t[i] = r, n.forEach(function (n, a) {
                r[a] = e(n, t);
              }), r);

            default:
              return n;
          }
        },
        getLanguage: function getLanguage(e) {
          for (; e;) {
            var t = n.exec(e.className);
            if (t) return t[1].toLowerCase();
            e = e.parentElement;
          }

          return "none";
        },
        setLanguage: function setLanguage(e, t) {
          e.className = e.className.replace(RegExp(n, "gi"), ""), e.classList.add("language-" + t);
        },
        currentScript: function currentScript() {
          if ("undefined" == typeof document) return null;
          if ("currentScript" in document) return document.currentScript;

          try {
            throw new Error();
          } catch (r) {
            var e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack) || [])[1];

            if (e) {
              var n = document.getElementsByTagName("script");

              for (var t in n) if (n[t].src == e) return n[t];
            }

            return null;
          }
        },
        isActive: function isActive(e, n, t) {
          for (var r = "no-" + n; e;) {
            var a = e.classList;
            if (a.contains(n)) return !0;
            if (a.contains(r)) return !1;
            e = e.parentElement;
          }

          return !!t;
        }
      },
      languages: {
        plain: r,
        plaintext: r,
        text: r,
        txt: r,
        extend: function extend(e, n) {
          var t = a.util.clone(a.languages[e]);

          for (var r in n) t[r] = n[r];

          return t;
        },
        insertBefore: function insertBefore(e, n, t, r) {
          var i = (r = r || a.languages)[e],
              l = {};

          for (var o in i) if (i.hasOwnProperty(o)) {
            if (o == n) for (var s in t) t.hasOwnProperty(s) && (l[s] = t[s]);
            t.hasOwnProperty(o) || (l[o] = i[o]);
          }

          var u = r[e];
          return r[e] = l, a.languages.DFS(a.languages, function (n, t) {
            t === u && n != e && (this[n] = l);
          }), l;
        },
        DFS: function e(n, t, r, i) {
          i = i || {};
          var l = a.util.objId;

          for (var o in n) if (n.hasOwnProperty(o)) {
            t.call(n, o, n[o], r || o);
            var s = n[o],
                u = a.util.type(s);
            "Object" !== u || i[l(s)] ? "Array" !== u || i[l(s)] || (i[l(s)] = !0, e(s, t, o, i)) : (i[l(s)] = !0, e(s, t, null, i));
          }
        }
      },
      plugins: {},
      highlightAll: function highlightAll(e, n) {
        a.highlightAllUnder(document, e, n);
      },
      highlightAllUnder: function highlightAllUnder(e, n, t) {
        var r = {
          callback: t,
          container: e,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };
        a.hooks.run("before-highlightall", r), r.elements = Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)), a.hooks.run("before-all-elements-highlight", r);

        for (var i, l = 0; i = r.elements[l++];) a.highlightElement(i, !0 === n, r.callback);
      },
      highlightElement: function highlightElement(n, t, r) {
        var i = a.util.getLanguage(n),
            l = a.languages[i];
        a.util.setLanguage(n, i);
        var o = n.parentElement;
        o && "pre" === o.nodeName.toLowerCase() && a.util.setLanguage(o, i);
        var s = {
          element: n,
          language: i,
          grammar: l,
          code: n.textContent
        };

        function u(e) {
          s.highlightedCode = e, a.hooks.run("before-insert", s), s.element.innerHTML = s.highlightedCode, a.hooks.run("after-highlight", s), a.hooks.run("complete", s), r && r.call(s.element);
        }

        if (a.hooks.run("before-sanity-check", s), (o = s.element.parentElement) && "pre" === o.nodeName.toLowerCase() && !o.hasAttribute("tabindex") && o.setAttribute("tabindex", "0"), !s.code) return a.hooks.run("complete", s), void (r && r.call(s.element));
        if (a.hooks.run("before-highlight", s), s.grammar) {
          if (t && e.Worker) {
            var c = new Worker(a.filename);
            c.onmessage = function (e) {
              u(e.data);
            }, c.postMessage(JSON.stringify({
              language: s.language,
              code: s.code,
              immediateClose: !0
            }));
          } else u(a.highlight(s.code, s.grammar, s.language));
        } else u(a.util.encode(s.code));
      },
      highlight: function highlight(e, n, t) {
        var r = {
          code: e,
          grammar: n,
          language: t
        };
        if (a.hooks.run("before-tokenize", r), !r.grammar) throw new Error('The language "' + r.language + '" has no grammar.');
        return r.tokens = a.tokenize(r.code, r.grammar), a.hooks.run("after-tokenize", r), i.stringify(a.util.encode(r.tokens), r.language);
      },
      tokenize: function tokenize(e, n) {
        var t = n.rest;

        if (t) {
          for (var r in t) n[r] = t[r];

          delete n.rest;
        }

        var a = new s();
        return u(a, a.head, e), o(e, a, n, a.head, 0), function (e) {
          for (var n = [], t = e.head.next; t !== e.tail;) n.push(t.value), t = t.next;

          return n;
        }(a);
      },
      hooks: {
        all: {},
        add: function add(e, n) {
          var t = a.hooks.all;
          t[e] = t[e] || [], t[e].push(n);
        },
        run: function run(e, n) {
          var t = a.hooks.all[e];
          if (t && t.length) for (var r, i = 0; r = t[i++];) r(n);
        }
      },
      Token: i
    };

    function i(e, n, t, r) {
      this.type = e, this.content = n, this.alias = t, this.length = 0 | (r || "").length;
    }

    function l(e, n, t, r) {
      e.lastIndex = n;
      var a = e.exec(t);

      if (a && r && a[1]) {
        var i = a[1].length;
        a.index += i, a[0] = a[0].slice(i);
      }

      return a;
    }

    function o(e, n, t, r, s, g) {
      for (var f in t) if (t.hasOwnProperty(f) && t[f]) {
        var h = t[f];
        h = Array.isArray(h) ? h : [h];

        for (var d = 0; d < h.length; ++d) {
          if (g && g.cause == f + "," + d) return;
          var v = h[d],
              p = v.inside,
              m = !!v.lookbehind,
              y = !!v.greedy,
              k = v.alias;

          if (y && !v.pattern.global) {
            var x = v.pattern.toString().match(/[imsuy]*$/)[0];
            v.pattern = RegExp(v.pattern.source, x + "g");
          }

          for (var b = v.pattern || v, w = r.next, A = s; w !== n.tail && !(g && A >= g.reach); A += w.value.length, w = w.next) {
            var E = w.value;
            if (n.length > e.length) return;

            if (!(E instanceof i)) {
              var P,
                  L = 1;

              if (y) {
                if (!(P = l(b, A, e, m)) || P.index >= e.length) break;
                var S = P.index,
                    O = P.index + P[0].length,
                    j = A;

                for (j += w.value.length; S >= j;) j += (w = w.next).value.length;

                if (A = j -= w.value.length, w.value instanceof i) continue;

                for (var C = w; C !== n.tail && (j < O || "string" == typeof C.value); C = C.next) L++, j += C.value.length;

                L--, E = e.slice(A, j), P.index -= A;
              } else if (!(P = l(b, 0, E, m))) continue;

              S = P.index;

              var N = P[0],
                  _ = E.slice(0, S),
                  M = E.slice(S + N.length),
                  W = A + E.length;

              g && W > g.reach && (g.reach = W);
              var z = w.prev;

              if (_ && (z = u(n, z, _), A += _.length), c(n, z, L), w = u(n, z, new i(f, p ? a.tokenize(N, p) : N, k, N)), M && u(n, w, M), L > 1) {
                var I = {
                  cause: f + "," + d,
                  reach: W
                };
                o(e, n, t, w.prev, A, I), g && I.reach > g.reach && (g.reach = I.reach);
              }
            }
          }
        }
      }
    }

    function s() {
      var e = {
        value: null,
        prev: null,
        next: null
      },
          n = {
        value: null,
        prev: e,
        next: null
      };
      e.next = n, this.head = e, this.tail = n, this.length = 0;
    }

    function u(e, n, t) {
      var r = n.next,
          a = {
        value: t,
        prev: n,
        next: r
      };
      return n.next = a, r.prev = a, e.length++, a;
    }

    function c(e, n, t) {
      for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next;

      n.next = r, r.prev = n, e.length -= a;
    }

    if (e.Prism = a, i.stringify = function e(n, t) {
      if ("string" == typeof n) return n;

      if (Array.isArray(n)) {
        var r = "";
        return n.forEach(function (n) {
          r += e(n, t);
        }), r;
      }

      var i = {
        type: n.type,
        content: e(n.content, t),
        tag: "span",
        classes: ["token", n.type],
        attributes: {},
        language: t
      },
          l = n.alias;
      l && (Array.isArray(l) ? Array.prototype.push.apply(i.classes, l) : i.classes.push(l)), a.hooks.run("wrap", i);
      var o = "";

      for (var s in i.attributes) o += " " + s + '="' + (i.attributes[s] || "").replace(/"/g, "&quot;") + '"';

      return "<" + i.tag + ' class="' + i.classes.join(" ") + '"' + o + ">" + i.content + "</" + i.tag + ">";
    }, !e.document) return e.addEventListener ? (a.disableWorkerMessageHandler || e.addEventListener("message", function (n) {
      var t = JSON.parse(n.data),
          r = t.language,
          i = t.code,
          l = t.immediateClose;
      e.postMessage(a.highlight(i, a.languages[r], r)), l && e.close();
    }, !1), a) : a;
    var g = a.util.currentScript();

    function f() {
      a.manual || a.highlightAll();
    }

    if (g && (a.filename = g.src, g.hasAttribute("data-manual") && (a.manual = !0)), !a.manual) {
      var h = document.readyState;
      "loading" === h || "interactive" === h && g && g.defer ? document.addEventListener("DOMContentLoaded", f) : window.requestAnimationFrame ? window.requestAnimationFrame(f) : window.setTimeout(f, 16);
    }

    return a;
  }(_self);

  module.exports && (module.exports = Prism), "undefined" != typeof commonjsGlobal && (commonjsGlobal.Prism = Prism);
  Prism.languages.markup = {
    comment: {
      pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
      greedy: !0
    },
    prolog: {
      pattern: /<\?[\s\S]+?\?>/,
      greedy: !0
    },
    doctype: {
      pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: !0,
      inside: {
        "internal-subset": {
          pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
          lookbehind: !0,
          greedy: !0,
          inside: null
        },
        string: {
          pattern: /"[^"]*"|'[^']*'/,
          greedy: !0
        },
        punctuation: /^<!|>$|[[\]]/,
        "doctype-tag": /^DOCTYPE/i,
        name: /[^\s<>'"]+/
      }
    },
    cdata: {
      pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
      greedy: !0
    },
    tag: {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: !0,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/,
          inside: {
            punctuation: /^<\/?/,
            namespace: /^[^\s>\/:]+:/
          }
        },
        "special-attr": [],
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            punctuation: [{
              pattern: /^=/,
              alias: "attr-equals"
            }, {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: !0
            }]
          }
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: {
            namespace: /^[^\s>\/:]+:/
          }
        }
      }
    },
    entity: [{
      pattern: /&[\da-z]{1,8};/i,
      alias: "named-entity"
    }, /&#x?[\da-f]{1,8};/i]
  }, Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity, Prism.languages.markup.doctype.inside["internal-subset"].inside = Prism.languages.markup, Prism.hooks.add("wrap", function (a) {
    "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"));
  }), Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function value(a, e) {
      var s = {};
      s["language-" + e] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[e]
      }, s.cdata = /^<!\[CDATA\[|\]\]>$/i;
      var t = {
        "included-cdata": {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: s
        }
      };
      t["language-" + e] = {
        pattern: /[\s\S]+/,
        inside: Prism.languages[e]
      };
      var n = {};
      n[a] = {
        pattern: RegExp("(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(/__/g, function () {
          return a;
        }), "i"),
        lookbehind: !0,
        greedy: !0,
        inside: t
      }, Prism.languages.insertBefore("markup", "cdata", n);
    }
  }), Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
    value: function value(a, e) {
      Prism.languages.markup.tag.inside["special-attr"].push({
        pattern: RegExp("(^|[\"'\\s])(?:" + a + ")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))", "i"),
        lookbehind: !0,
        inside: {
          "attr-name": /^[^\s=]+/,
          "attr-value": {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: !0,
                alias: [e, "language-" + e],
                inside: Prism.languages[e]
              },
              punctuation: [{
                pattern: /^=/,
                alias: "attr-equals"
              }, /"|'/]
            }
          }
        }
      });
    }
  }), Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup, Prism.languages.xml = Prism.languages.extend("markup", {}), Prism.languages.ssml = Prism.languages.xml, Prism.languages.atom = Prism.languages.xml, Prism.languages.rss = Prism.languages.xml;
  !function (s) {
    var e = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
    s.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: RegExp("@[\\w-](?:[^;{\\s\"']|\\s+(?!\\s)|" + e.source + ")*?(?:;|(?=\\s*\\{))"),
        inside: {
          rule: /^@[\w-]+/,
          "selector-function-argument": {
            pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
            lookbehind: !0,
            alias: "selector"
          },
          keyword: {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: !0
          }
        }
      },
      url: {
        pattern: RegExp("\\burl\\((?:" + e.source + "|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)", "i"),
        greedy: !0,
        inside: {
          "function": /^url/i,
          punctuation: /^\(|\)$/,
          string: {
            pattern: RegExp("^" + e.source + "$"),
            alias: "url"
          }
        }
      },
      selector: {
        pattern: RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" + e.source + ")*(?=\\s*\\{)"),
        lookbehind: !0
      },
      string: {
        pattern: e,
        greedy: !0
      },
      property: {
        pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
        lookbehind: !0
      },
      important: /!important\b/i,
      "function": {
        pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
        lookbehind: !0
      },
      punctuation: /[(){};:,]/
    }, s.languages.css.atrule.inside.rest = s.languages.css;
    var t = s.languages.markup;
    t && (t.tag.addInlined("style", "css"), t.tag.addAttribute("style", "css"));
  }(Prism);
  Prism.languages.clike = {
    comment: [{
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: !0,
      greedy: !0
    }, {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: !0,
      greedy: !0
    }],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: !0
    },
    "class-name": {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: !0,
      inside: {
        punctuation: /[.\\]/
      }
    },
    keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    "boolean": /\b(?:false|true)\b/,
    "function": /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/
  };
  Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [Prism.languages.clike["class-name"], {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
      lookbehind: !0
    }],
    keyword: [{
      pattern: /((?:^|\})\s*)catch\b/,
      lookbehind: !0
    }, {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0
    }],
    "function": /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    number: {
      pattern: RegExp("(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])"),
      lookbehind: !0
    },
    operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
  }), Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/, Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern: RegExp("((?:^|[^$\\w\\xA0-\\uFFFF.\"'\\])\\s]|\\b(?:return|yield))\\s*)/(?:(?:\\[(?:[^\\]\\\\\r\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|/\\*(?:[^*]|\\*(?!/))*\\*/)*(?:$|[\r\n,.;:})\\]]|//))"),
      lookbehind: !0,
      greedy: !0,
      inside: {
        "regex-source": {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: !0,
          alias: "language-regex",
          inside: Prism.languages.regex
        },
        "regex-delimiter": /^\/|\/$/,
        "regex-flags": /^[a-z]+$/
      }
    },
    "function-variable": {
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: "function"
    },
    parameter: [{
      pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
      lookbehind: !0,
      inside: Prism.languages.javascript
    }, {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
      lookbehind: !0,
      inside: Prism.languages.javascript
    }, {
      pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
      lookbehind: !0,
      inside: Prism.languages.javascript
    }, {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
      lookbehind: !0,
      inside: Prism.languages.javascript
    }],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  }), Prism.languages.insertBefore("javascript", "string", {
    hashbang: {
      pattern: /^#!.*/,
      greedy: !0,
      alias: "comment"
    },
    "template-string": {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: !0,
      inside: {
        "template-punctuation": {
          pattern: /^`|`$/,
          alias: "string"
        },
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: !0,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation"
            },
            rest: Prism.languages.javascript
          }
        },
        string: /[\s\S]+/
      }
    },
    "string-property": {
      pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: !0,
      greedy: !0,
      alias: "property"
    }
  }), Prism.languages.insertBefore("javascript", "operator", {
    "literal-property": {
      pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: !0,
      alias: "property"
    }
  }), Prism.languages.markup && (Prism.languages.markup.tag.addInlined("script", "javascript"), Prism.languages.markup.tag.addAttribute("on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)", "javascript")), Prism.languages.js = Prism.languages.javascript;
  Prism.languages.c = Prism.languages.extend("clike", {
    comment: {
      pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
      greedy: !0
    },
    string: {
      pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
      greedy: !0
    },
    "class-name": {
      pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
      lookbehind: !0
    },
    keyword: /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
    "function": /\b[a-z_]\w*(?=\s*\()/i,
    number: /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
    operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/
  }), Prism.languages.insertBefore("c", "string", {
    "char": {
      pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
      greedy: !0
    }
  }), Prism.languages.insertBefore("c", "string", {
    macro: {
      pattern: /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
      lookbehind: !0,
      greedy: !0,
      alias: "property",
      inside: {
        string: [{
          pattern: /^(#\s*include\s*)<[^>]+>/,
          lookbehind: !0
        }, Prism.languages.c.string],
        "char": Prism.languages.c["char"],
        comment: Prism.languages.c.comment,
        "macro-name": [{
          pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
          lookbehind: !0
        }, {
          pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
          lookbehind: !0,
          alias: "function"
        }],
        directive: {
          pattern: /^(#\s*)[a-z]+/,
          lookbehind: !0,
          alias: "keyword"
        },
        "directive-hash": /^#/,
        punctuation: /##|\\(?=[\r\n])/,
        expression: {
          pattern: /\S[\s\S]*/,
          inside: Prism.languages.c
        }
      }
    }
  }), Prism.languages.insertBefore("c", "function", {
    constant: /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/
  }), delete Prism.languages.c["boolean"];
  !function (e) {
    var t = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
        n = "\\b(?!<keyword>)\\w+(?:\\s*\\.\\s*\\w+)*\\b".replace(/<keyword>/g, function () {
      return t.source;
    });
    e.languages.cpp = e.languages.extend("c", {
      "class-name": [{
        pattern: RegExp("(\\b(?:class|concept|enum|struct|typename)\\s+)(?!<keyword>)\\w+".replace(/<keyword>/g, function () {
          return t.source;
        })),
        lookbehind: !0
      }, /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/, /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i, /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/],
      keyword: t,
      number: {
        pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
        greedy: !0
      },
      operator: />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
      "boolean": /\b(?:false|true)\b/
    }), e.languages.insertBefore("cpp", "string", {
      module: {
        pattern: RegExp('(\\b(?:import|module)\\s+)(?:"(?:\\\\(?:\r\n|[^])|[^"\\\\\r\n])*"|<[^<>\r\n]*>|' + "<mod-name>(?:\\s*:\\s*<mod-name>)?|:\\s*<mod-name>".replace(/<mod-name>/g, function () {
          return n;
        }) + ")"),
        lookbehind: !0,
        greedy: !0,
        inside: {
          string: /^[<"][\s\S]+/,
          operator: /:/,
          punctuation: /\./
        }
      },
      "raw-string": {
        pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
        alias: "string",
        greedy: !0
      }
    }), e.languages.insertBefore("cpp", "keyword", {
      "generic-function": {
        pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
        inside: {
          "function": /^\w+/,
          generic: {
            pattern: /<[\s\S]+/,
            alias: "class-name",
            inside: e.languages.cpp
          }
        }
      }
    }), e.languages.insertBefore("cpp", "operator", {
      "double-colon": {
        pattern: /::/,
        alias: "punctuation"
      }
    }), e.languages.insertBefore("cpp", "class-name", {
      "base-clause": {
        pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
        lookbehind: !0,
        greedy: !0,
        inside: e.languages.extend("cpp", {})
      }
    }), e.languages.insertBefore("inside", "double-colon", {
      "class-name": /\b[a-z_]\w*\b(?!\s*::)/i
    }, e.languages.cpp["base-clause"]);
  }(Prism);
})(code$1);

var code = code$1.exports;

// import { marked } from './textarea.js'
console.log({
  code: code
});
var render = new Renderer();
var renderer = {
  heading: function heading(text, level) {
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return "\n            <h".concat(level, ">\n              <a name=\"").concat(escapedText, "\" class=\"anchor\" href=\"#").concat(escapedText, "\">\n                <span class=\"header-link\"></span>\n              </a>\n              ").concat(text, "\n            </h").concat(level, ">");
  },
  code: function code(_code, infostring, escaped) {
    // console.log(render.code(code, infostring, escaped))
    return render.code(_code, infostring, escaped).replace(/[\u4e00-\u9fa5]/g, function (v) {
      return "<span class=\"font-zh\">".concat(v, "</span>");
    }); // const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');
  }
};
marked$1.use({
  renderer: renderer
});
var marked = (function (arg) {
  // console.log({ arg })
  if (arg == '') return 'Not Found';
  return marked$1(arg);
});

var createScroll = function createScroll(viewer) {
  return {
    down: function down() {
      return viewer.scrollTo(viewer.scrollTo() + 100);
    },
    up: function up() {
      return viewer.scrollTo(viewer.scrollTo() - 100);
    }
  }; // let scrollTop = 0
  // let scrollHeight = 0
  // return {
  //   down: () => viewer.scrollTo(viewer.scrollTo() + 100),
  //   up: () => viewer.scrollTo(viewer.scrollTo() - 100)
  // down() {
  //   if (!scrollHeight) scrollHeight = viewer.maxTop()
  //   scrollTop = viewer.scrollTo(scrollTop + 100)
  //   if (scrollTop > scrollHeight) scrollTop = scrollHeight
  //
  // },
  // up() {
  //   scrollTop = viewer.scrollTo(scrollTop - 100)
  //   if (scrollTop < 0) scrollTop = 0
  // }
  // }
};

var EDIT_VIEW_ISSHOW = false;

var container = function container(t, d) {
  var evDom = elmt_byid('GEditAndView');
  elmt_style(evDom, "width:".concat(viewport.attach(100), "%;"));

  var _showGen = showGen(evDom),
      _show = _showGen.show;

  return {
    show: function show(val) {
      return EDIT_VIEW_ISSHOW = _show(val);
    }
  };
};

var edit = function edit() {
  var editDom = elmt_byid('GEdit');

  var _showGen2 = showGen(editDom),
      show = _showGen2.show;

  editDom.addEventListener('keydown', function (evt) {
    if (!isTab(evt)) return;
    evt.preventDefault();
    textareaTab(editDom);
  });
  return {
    show: show,
    value: function value(val) {
      return editDom.value = undef(editDom.value, val);
    },
    focus: function focus() {
      editDom.focus();
      return this;
    },
    clear: function clear() {
      this.show(false);
      this.value('');
    }
  };
};

var view = function view() {
  var viewDom = elmt_byid('GView');

  var _showGen3 = showGen(viewDom),
      show = _showGen3.show;

  return {
    show: show,
    // TODO:: 添加遮罩动画
    // focus(){viewDom.click()},
    value: function value(val) {
      return viewDom.innerHTML = undef(viewDom.innerHTML, val);
    },
    scrollTo: function scrollTo(val) {
      return viewDom.scrollTop = undef(viewDom.scrollTop, val);
    },
    maxTop: function maxTop() {
      return viewDom.scrollHeight - viewDom.clientHeight;
    },
    clear: function clear() {
      this.show(false);
      this.value('');
    }
  };
};

var createEditView = function createEditView() {
  var pubsub = new Event();

  var _container = container(),
      show = _container.show;

  var editer = edit();
  var viewer = view();
  var scroll = createScroll(viewer);

  var cacheGen = function cacheGen() {
    var _uid = 0;
    var article = 'Not Found';
    return {
      uid: function uid(val) {
        return _uid = undef(_uid, val);
      },
      value: function value(val) {
        return article = undef(article, val);
      },
      clear: function clear() {
        this.uid(0);
        this.value('');
      }
    };
  };

  var cache = cacheGen();

  var articleData = function articleData(prevToggle) {
    // 永久存储
    var editval = editer.value();
    var isNonempty = !isEmptyStr(editval);
    if (cache.value() == editval) return {
      isNonempty: isNonempty
    }; // 存储

    prevToggle && prevToggle(editval);
    return {
      uid: cache.uid(),
      data: editval,
      isNonempty: isNonempty
    }; // 永久存储
  }; // pubsub.on('EDIT_OPEN_END', (data = '') => { // 拉取||新建数据完成hook
  //   if (data) { // 展示
  //     editer.show(!viewer.show(true))
  //   } else {
  //     editer.show(!viewer.show(false))
  //     editer.focus()
  //   }
  //   editer.value(data)
  //   viewer.value(marked(data))
  //   cache.value(data)
  // })


  var open = function open() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (data) {
      // 展示
      editer.show(!viewer.show(true));
    } else {
      editer.show(!viewer.show(false));
      editer.focus();
    }

    editer.value(data);
    viewer.value(marked(data));
    cache.value(data);
  }; // pubsub.on('EDIT_CLOSE_END', () => { // 发送完成hook
  //   show(false)
  //   cache.clear()
  //   editer.clear()
  //   viewer.clear()
  // })


  var close = function close() {
    show(false);
    cache.clear();
    editer.clear();
    viewer.clear();
  }; // isnode 是否选中节点, 不选中节点不应该进入


  var exec = function exec(evt, nodeid) {
    if (isUnDef(nodeid)) return; // console.log('editview::', { nodeid })
    // 关闭, 清除工作

    if (isEsc(evt) && show()) {
      pubsub.emit('EDIT_CLOSE', articleData()); // 存储数据

      return;
    } // (没有打开eidtview) || (非快捷键) => 走你


    if (!show() && !isEditView(evt)) return; // 打开
    // console.log('editview::cache.uid:', cache.uid())

    if (nodeid != cache.uid()) {
      evt.preventDefault(); // 禁止打开devtool

      show(true);
      pubsub.emit('EDIT_OPEN', cache.uid(nodeid));
      return;
    } // (正在编辑) && (非快捷键) => 走你


    if (editer.show() && !isToggleEditView(evt)) return; // 快捷键, 切换 Edit and View

    if (isToggleEditView(evt)) {
      evt.preventDefault();

      if (editer.show(!editer.show())) {
        // 设置并返回结果
        editer.focus().value(cache.value());
      } // console.log('cache.value:', cache.value(), 'editer.value:', editer.value())


      if (viewer.show(!viewer.show())) {
        var data = articleData(function (editval) {
          cache.value(editval); // 缓存

          viewer.value(marked(editval)); // 渲染
        });
        pubsub.emit('EDIT_SAVE_ARTICLE', data); // 存储数据
      }
    } // view 上线快捷键


    if (viewer.show()) {
      if (isScrollDown(evt)) scroll.down();
      if (isScrollUp(evt)) scroll.up();
    }
  };

  return {
    pubsub: pubsub,
    exec: exec,
    open: open,
    close: close,
    state: {
      show: show,
      editshow: function editshow() {
        return show() && editer.show();
      }
    }
  };
};

axios.interceptors.response.use( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(response, config) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", response.data);

        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); // type Stage struct {
// 	ID         int    `json:"id"`
// 	UserID     int    `json:"user_id"`
// 	StageID    int    `json:"stage_id"`
// 	ParentID   int    `json:"parent_id"`
// 	UpdateTime int    `json:"update_time"`
// 	Title      string `json:"title"`
// 	Data       string `json:"data"`
// }

var parseStage = function parseStage(_ref2) {
  var id = _ref2.id,
      parent_id = _ref2.parent_id,
      stage_id = _ref2.stage_id,
      title = _ref2.title,
      update_time = _ref2.update_time,
      data = _ref2.data;
  return {
    id: id,
    uid: stage_id,
    parent: parent_id,
    updateTime: update_time,
    syncTime: update_time,
    title: title,
    data: data
  };
};
var unparseStage = function unparseStage(_ref3) {
  var id = _ref3.id,
      uid = _ref3.uid,
      parent = _ref3.parent,
      updateTime = _ref3.updateTime,
      title = _ref3.title,
      data = _ref3.data;
  return {
    id: id,
    stage_id: uid,
    parent_id: parent,
    update_time: updateTime,
    title: title,
    data: data
  };
};
var stage_get = function stage_get(_ref4) {
  var stageIDS = _ref4.stageIDS,
      _ref4$manifest = _ref4.manifest,
      manifest = _ref4$manifest === void 0 ? true : _ref4$manifest;
  return axios.get("/stage?stage_ids=".concat(stageIDS.join('-'), "&manifest=").concat(manifest)).then(function (_ref5) {
    var _ref5$data = _ref5.data,
        data = _ref5$data === void 0 ? [] : _ref5$data;
    return data.map(parseStage);
  });
};
var stage_save = function stage_save(list) {
  // return Promise.reject()
  // console.log({ list })
  var data = list.map(function (item) {
    return unparseStage(item);
  }); // console.log({ data })

  return axios.post('/stage', {
    data: data
  }).then(function (data) {// console.log({ data })
  });
};
var stage_set = stage_save; // '/stage/free' 解绑

var stage_put = function stage_put(list, isfree) {
  // return Promise.reject()
  // console.log({ list })
  var data = list.map(function (item) {
    return unparseStage(item);
  });
  var path = isfree ? '/stage/free' : '/stage';
  return axios.put(path, {
    data: data
  }).then(function (data) {// console.log({ data })
  });
};
var parseArticle = function parseArticle(_ref6) {
  var id = _ref6.id,
      article_id = _ref6.article_id,
      update_time = _ref6.update_time,
      data = _ref6.data;
  return {
    id: id,
    uid: article_id,
    updateTime: update_time,
    syncTime: update_time,
    data: data
  };
};
var unparseArticle = function unparseArticle(_ref7) {
  var id = _ref7.id,
      uid = _ref7.uid,
      updateTime = _ref7.updateTime,
      data = _ref7.data;
  // updateTime: 1667027443, syncTime: 0, data: "## aaaaaaa", uid: 2
  return {
    id: id,
    article_id: uid,
    update_time: updateTime,
    data: data
  };
};
var article_save = function article_save(list) {
  // return Promise.reject()
  // console.log({ list })
  var data = list.map(function (item) {
    return unparseArticle(item);
  });
  return axios.post('/article', {
    data: data
  }).then(function (data) {// console.log({ data })
  });
};
var article_set = article_save;
var article_get = function article_get(_ref8) {
  var _ref8$articleIDS = _ref8.articleIDS,
      articleIDS = _ref8$articleIDS === void 0 ? [] : _ref8$articleIDS,
      _ref8$manifest = _ref8.manifest,
      manifest = _ref8$manifest === void 0 ? true : _ref8$manifest;
  // console.log({ articleIDS })
  return axios.get("/article?article_ids=".concat(articleIDS.join('-'), "&manifest=").concat(manifest)).then(function (_ref9) {
    var _ref9$data = _ref9.data,
        data = _ref9$data === void 0 ? [] : _ref9$data;
    return data.map(parseArticle);
  });
}; // 舞台关联保存
var parseOperation = function parseOperation(_ref11) {
  var id = _ref11.id,
      action_type = _ref11.action_type,
      action_entity = _ref11.action_entity,
      action_entity_id = _ref11.action_entity_id,
      update_time = _ref11.update_time;
  return {
    id: id,
    type: action_type,
    entity: action_entity,
    entityUid: action_entity_id,
    updateTime: update_time
  };
};
var unparseOperation = function unparseOperation(_ref12) {
  var id = _ref12.id,
      type = _ref12.type,
      entity = _ref12.entity,
      entityUid = _ref12.entityUid,
      updateTime = _ref12.updateTime;
  return {
    id: id,
    action_type: type,
    action_entity: entity,
    action_entity_id: entityUid,
    update_time: updateTime
  };
}; // 获取操作列表

var operation_get = function operation_get() {
  return axios.get("/operation/list").then(function (_ref13) {
    var _ref13$data = _ref13.data,
        data = _ref13$data === void 0 ? [] : _ref13$data;
    return data.map(parseOperation);
  });
};
var operation_set = function operation_set(list) {
  // return Promise.reject()
  var data = list.map(function (item) {
    return unparseOperation(item);
  });
  console.log({
    data: data
  });
  return axios.post("/operation/list", {
    data: data
  });
};
var operation_put = function operation_put(list) {
  // return Promise.reject()
  var data = list.map(function (item) {
    return unparseOperation(item);
  });
  console.log({
    data: data
  });
  return axios.put("/operation/list", {
    data: data
  });
};
var operation_synctime_get = function operation_synctime_get(syncTime) {
  if (isUnDef(syncTime)) return Promise.resolve([]);
  return axios.get("/operation/synctime/".concat(syncTime)).then(function (_ref14) {
    var _ref14$data = _ref14.data,
        data = _ref14$data === void 0 ? [] : _ref14$data;
    return data.map(parseOperation);
  });
};

var hascircle = function hascircle(type) {
  return iscircle(type);
};

var hasrect = function hasrect(type) {
  return isrect(type) || isgroup(type);
};

var PI = Math.PI / 2.8;
var r = function r(d) {
  return d / 2;
};
var cos = function cos(r) {
  return Math.cos(PI) * r;
};
var sin = function sin(r) {
  return Math.sin(PI) * r;
};
var scaled = function scaled(v, ratio) {
  var nv = v * ratio;
  return [nv, v - nv];
}; // 是否重叠

var distance = function distance(x1, y1, x2, y2) {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}; // 最短距离


var compare = function compare(points1, points2) {
  return distance.apply(void 0, _toConsumableArray(points1)) < distance.apply(void 0, _toConsumableArray(points2)) ? points1 : points2;
}; // 最短距离的坐标


var rectcoord = function rectcoord(_ref5, _ref6) {
  var tx = _ref5.tx,
      ty = _ref5.ty;
  var top = _ref6.top,
      right = _ref6.right,
      bottom = _ref6.bottom,
      left = _ref6.left;
  var cx = left + (right - left) / 2,
      cy = top + (bottom - top) / 2;
  var x2 = tx > cx ? right : left; // 当前点在目标点的左边或右边

  var y2 = ty > cy ? bottom : top; // 当前点在目标点的上边或下边

  return compare([tx, ty, x2, cy], [tx, ty, cx, y2]);
};

var circlecoord = function circlecoord(_ref7, _ref8) {
  var r = _ref7.r,
      tx = _ref7.tx,
      ty = _ref7.ty;
  var x = _ref8.x,
      y = _ref8.y;
  var a = x - tx; // a 边

  var b = y - ty; // b 边

  var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)); // c 边

  var dx = round(r * a / c);
  var dy = round(r * b / c);
  return {
    dx: dx,
    dy: dy
  };
}; // 线段的两点坐标


var linecoord = function linecoord(head, tail) {
  var _boxcxy = boxcxy(head),
      x1 = _boxcxy.cx,
      y1 = _boxcxy.cy;

  var _boxcxy2 = boxcxy(tail),
      x2 = _boxcxy2.cx,
      y2 = _boxcxy2.cy; // console.log({ x1, y1, x2, y2 })


  if (hasrect(head.type)) {
    //  确定起点
    var _rectcoord3 = rectcoord({
      tx: x2,
      ty: y2
    }, boxtrbl(head)),
        _rectcoord4 = _slicedToArray(_rectcoord3, 4);
        _rectcoord4[0];
        _rectcoord4[1];
        var newX1 = _rectcoord4[2],
        newY1 = _rectcoord4[3];

    x1 = newX1, y1 = newY1;
  }

  if (hasrect(tail.type)) {
    // 确定终点
    // const { cx, cy } = boxcxy(head)
    var _rectcoord7 = rectcoord({
      tx: x1,
      ty: y1
    }, boxtrbl(tail)),
        _rectcoord8 = _slicedToArray(_rectcoord7, 4);
        _rectcoord8[0];
        _rectcoord8[1];
        var newX2 = _rectcoord8[2],
        newY2 = _rectcoord8[3];

    x2 = newX2, y2 = newY2;
  }

  if (hascircle(head.type)) {
    var _r = head.d / 2;

    var _circlecoord2 = circlecoord({
      r: _r,
      tx: x1,
      ty: y1
    }, {
      x: x2,
      y: y2
    }),
        dx = _circlecoord2.dx,
        dy = _circlecoord2.dy;

    x1 += dx;
    y1 += dy;
  } // 过两圆心直线和圆相交的点


  if (hascircle(tail.type)) {
    // 使用比例尺得出坐标
    var _r2 = tail.d / 2;

    var _circlecoord4 = circlecoord({
      r: _r2,
      tx: x2,
      ty: y2
    }, {
      x: x1,
      y: y1
    }),
        _dx = _circlecoord4.dx,
        _dy = _circlecoord4.dy;

    x2 += _dx;
    y2 += _dy;
  } // console.log({ x1, y1, x2, y2 })


  return {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2
  };
};

var avginc = function avginc(arr) {
  // 均分递增
  var len = arr.length;
  if (len <= 2) return;
  var minval = min(arr);
  var maxval = max(arr);
  var stepval = (maxval - minval) / (len - 1);

  var inc = function inc(_, i) {
    return minval + stepval * (i + 1);
  };

  return [minval].concat(_toConsumableArray(Array(len - 2).fill(0).map(inc)), [maxval]);
};

var nodeid = function nodeid(data, stageid) {
  try {
    var _JSON$parse2 = JSON.parse(data),
        view = _JSON$parse2.view,
        points = _JSON$parse2.points;

    console.log({
      view: view,
      points: points
    });

    var _points$filter3 = points.filter(function (_ref) {
      var stage = _ref.stage;
      return stageid == stage;
    }),
        _points$filter4 = _slicedToArray(_points$filter3, 1),
        id = _points$filter4[0].id;

    console.log({
      id: id
    });
    return id;
  } catch (err) {}
};

var unbindStageOfNode = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(entityUid) {
    var _yield$db_stage$fetch, _yield$db_stage$fetch2, stage, parent, _yield$db_stage$fetch3, _yield$db_stage$fetch4, parentstage;

    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return db_stage.fetchUid(entityUid);

        case 2:
          _yield$db_stage$fetch = _context.sent;
          _yield$db_stage$fetch2 = _slicedToArray(_yield$db_stage$fetch, 1);
          stage = _yield$db_stage$fetch2[0];

          if (!isUnDef(stage)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return");

        case 7:
          console.log({
            stage: stage
          });
          parent = stage.parent;
          _context.next = 11;
          return db_stage.fetchUid(parent);

        case 11:
          _yield$db_stage$fetch3 = _context.sent;
          _yield$db_stage$fetch4 = _slicedToArray(_yield$db_stage$fetch3, 1);
          parentstage = _yield$db_stage$fetch4[0];
          console.log({
            parentstage: parentstage
          });
          nodeid(parentstage.data, entityUid);

        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));

  return function unbindStageOfNode(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var SYNC_STAGE_INIT = 1;
var SYNC_STAGE_UPDTE = 2;
var SYNC_STAGE_NOTATA = 3;

var convdata = function convdata(data) {
  return Object.keys(data).reduce(function (memo, entityUid) {
    // logmid('SYNC_DATA::',data[entityUid], maxBy(data[entityUid], ({ updateTime }) => updateTime))
    var _maxBy = maxBy(data[entityUid], function (_ref) {
      var updateTime = _ref.updateTime;
      return updateTime;
    }),
        type = _maxBy.type,
        updateTime = _maxBy.updateTime; // 最大时间


    var item = {
      entityUid: +entityUid,
      updateTime: updateTime
    };
    if (isadd(type)) memo.add.push(item);
    if (isupdate(type)) memo.update.push(item);
    if (isdel(type)) memo.del.push(item);
    return memo;
  }, {
    add: [],
    update: [],
    del: []
  }); // update 中如果当前db数据中不不包含的需要转移到add
};

var getEntityUid = function getEntityUid(_ref2) {
  var entityUid = _ref2.entityUid;
  return entityUid;
};

var localOperationSend = function localOperationSend(entity, type) {
  return function (_ref3) {
    var entityUid = _ref3.entityUid,
        updateTime = _ref3.updateTime;
    return db_operation.send({
      entity: entity,
      entityUid: entityUid,
      type: type,
      updateTime: updateTime
    });
  };
};

var syncLocalOperation = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var localOperation, localStage, localArticle;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return db_operation.fetch();

        case 2:
          localOperation = _context.sent;
          _context.next = 5;
          return db_stage.fetch();

        case 5:
          localStage = _context.sent;
          _context.next = 8;
          return db_article.fetch();

        case 8:
          localArticle = _context.sent;

          if (!localOperation.length) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return");

        case 11:
          console.log({
            localStage: localStage,
            localArticle: localArticle
          });
          localStage.forEach(function (_ref5) {
            var uid = _ref5.uid,
                updateTime = _ref5.updateTime;
            return localOperationSend(0, 2)({
              entityUid: uid,
              updateTime: updateTime
            });
          });
          localArticle.forEach(function (_ref6) {
            var uid = _ref6.uid,
                updateTime = _ref6.updateTime;
            return localOperationSend(1, 2)({
              entityUid: uid,
              updateTime: updateTime
            });
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));

  return function syncLocalOperation() {
    return _ref4.apply(this, arguments);
  };
}();

syncLocalOperation(); // 更新本地舞台

var localStageUpdate = function localStageUpdate(updates) {
  return stage_get({
    stageIDS: updates.map(getEntityUid),
    manifest: false
  }).then(function (list) {
    logmid('SYNC_DATA::stage_get:', {
      list: list
    });

    var combined = function combined(item) {
      return function (_ref7) {
        var isupdate = _ref7.isupdate,
            isinsert = _ref7.isinsert,
            uid = _ref7.uid;
        return {
          data: item,
          isupdate: isupdate,
          isinsert: isinsert,
          uid: uid
        };
      };
    };

    var send = function send(item) {
      return db_stage.send(item, true).then(combined(item));
    };

    var sort = function sort(list) {
      return list.sort(function (_ref8, _ref9) {
        var u1 = _ref8.uid;
        var u2 = _ref9.uid;
        return u1 - u2;
      });
    };

    return sort(list).map(send);
  });
}; // 更新本地文章


var localArticleUpdate = function localArticleUpdate(updates) {
  return article_get({
    articleIDS: updates.map(getEntityUid),
    manifest: false
  }).then(function (list) {
    logmid('SYNC_DATA::article list:', {
      list: list
    });

    var combined = function combined(item) {
      return function (_ref10) {
        var isupdate = _ref10.isupdate,
            isinsert = _ref10.isinsert,
            uid = _ref10.uid;
        return {
          data: item,
          isupdate: isupdate,
          isinsert: isinsert,
          uid: uid
        };
      };
    };

    var send = function send(item) {
      return db_article.send(item, true).then(combined(item));
    };

    var sort = function sort(list) {
      return list.sort(function (_ref11, _ref12) {
        var u1 = _ref11.uid;
        var u2 = _ref12.uid;
        return u1 - u2;
      });
    };

    return sort(list).map(function (item) {
      console.log({
        item: item
      });
      send(item);
    });
  });
}; // 更新本地


var updateLocal = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(local) {
    var entity,
        _convdata,
        add,
        update,
        del,
        pms,
        pulls,
        _args3 = arguments;

    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          entity = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 0;
          _convdata = convdata(local), add = _convdata.add, update = _convdata.update, del = _convdata.del;
          logmid('SYNC_DATA::', 'local::entity:', entity, {
            add: add,
            update: update,
            del: del
          });
          pms = [];
          pulls = update.concat(add); // return
          // console.log({ pulls })

          if (pulls.length) {
            // 更新动作
            if (isstage(entity)) {
              pms.push(localStageUpdate(pulls)); // pms.push(...pulls.map(localOperationSend(2))) // 更新操作表
            }

            if (isarticle(entity)) {
              localArticleUpdate(pulls);
            }
          }

          if (add.length) {
            // 添加
            logmid('SYNC_DATA::', {
              add: add
            });
          }

          if (del.length) {
            logmid('SYNC_DATA::', {
              del: del
            }); // 1. 更新视图 node 状态, 解绑vnode中的stage, 根据parent找到stage
            // 2. 更新stage数据

            del.forEach( /*#__PURE__*/function () {
              var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(_ref14) {
                var entityUid;
                return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      entityUid = _ref14.entityUid;
                      unbindStageOfNode(entityUid);

                    case 2:
                    case "end":
                      return _context2.stop();
                  }
                }, _callee2);
              }));

              return function (_x2) {
                return _ref15.apply(this, arguments);
              };
            }()); // 3. 更新operation数据
            // const operations = del.map(({ entityUid, updateTime }) => db_operation.send({ entity: 0, entityUid, type: 0, updateTime }))
          }

          if (pms.length) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", []);

        case 10:
          return _context3.abrupt("return", Promise.all(pms).then(function (_ref16) {
            var _ref17 = _slicedToArray(_ref16, 1),
                stages = _ref17[0];

            logmid('SYNC_DATA::updateLocal:', {
              stages: stages
            });
            return Promise.all(stages);
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));

  return function updateLocal(_x) {
    return _ref13.apply(this, arguments);
  };
}();

var remoteStageUpdate = function remoteStageUpdate(update) {
  var stagePm = db_stage.fetchIn(update.map(getEntityUid)).then(stage_set);
  var operationPm = db_operation.fetchIn(0, update.map(getEntityUid)).then(operation_put);
  return Promise.all([stagePm, operationPm]);
};

var remoteStageAdd = function remoteStageAdd(add) {
  return db_stage.fetchIn(add.map(getEntityUid)).then(function (list) {
    logmid('SYNC_DATA::', {
      list: list
    });
    var stagePm = stage_set(list); // 更新stage数据

    var operationPm = operation_set(add.map(function (item) {
      return _objectSpread2(_objectSpread2({}, item), {}, {
        entity: 0,
        type: 1
      });
    })); // 更新operation数据

    return Promise.all([stagePm, operationPm]);
  });
};

var remoteStageDel = function remoteStageDel(del) {
  var dels = del.map(function (_ref18) {
    var entityUid = _ref18.entityUid,
        updateTime = _ref18.updateTime;
    return {
      uid: entityUid,
      updateTime: updateTime,
      parent: 0
    };
  });
  logmid('SYNC_DATA::', {
    dels: dels
  });
  var stagePm = stage_put(dels, true); // 更新stage数据

  var operationPm = operation_set(del.map(function (item) {
    return _objectSpread2(_objectSpread2({}, item), {}, {
      entity: 0,
      type: 0
    });
  })); // 更新operation数据

  return Promise.all([stagePm, operationPm]);
};

var remoteArticleAdd = function remoteArticleAdd(add) {
  return db_article.fetchIn(add.map(getEntityUid)).then(function (list) {
    logmid('SYNC_DATA::', {
      list: list
    });
    var stagePm = article_set(list); // 更新stage数据

    var operationPm = operation_set(add.map(function (item) {
      return _objectSpread2(_objectSpread2({}, item), {}, {
        entity: 1,
        type: 1
      });
    })); // 更新operation数据

    return Promise.all([stagePm, operationPm]);
  });
};

var remoteArticleUpdate = function remoteArticleUpdate(update) {
  return db_article.fetchIn(update.map(getEntityUid)).then(function (list) {
    logmid('SYNC_DATA::', {
      list: list
    });
    var articlePm = article_set(list);
    var operationPm = operation_put(update.map(function (item) {
      return _objectSpread2(_objectSpread2({}, item), {}, {
        entity: 1,
        type: 2
      });
    })); // 更新operation数据

    return Promise.all([articlePm, operationPm]);
  });
}; // {entityUid: 1, updateTime: 1666769103}


var updateRemote = function updateRemote(remote) {
  var entity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var _convdata2 = convdata(remote),
      add = _convdata2.add,
      update = _convdata2.update,
      del = _convdata2.del;

  logmid('SYNC_DATA::', 'remote::entity:', entity, {
    add: add,
    update: update,
    del: del
  });
  var pms = []; // return

  if (update.length) {
    // 更新
    if (isstage(entity)) {
      pms.push(remoteStageUpdate(update));
    }

    if (isarticle(entity)) {
      remoteArticleUpdate(update);
    }
  }

  if (add.length) {
    // 添加
    if (isstage(entity)) {
      pms.push(remoteStageAdd(add));
    }

    if (isarticle(entity)) {
      pms.push(remoteArticleAdd(add));
    }
  }

  if (del.length) {
    // 删除
    pms.push(remoteStageDel(del));
  }

  if (!pms.length) return [];
  return Promise.all(pms);
};


var createSync = function createSync(isempty) {
  var pubsub = new Event();

  var fetchRemoteOperation = /*#__PURE__*/function () {
    var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(minUpdateTime) {
      var remoteOperation;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (!isUnDef(minUpdateTime)) {
              _context4.next = 4;
              break;
            }

            _context4.next = 3;
            return operation_get();

          case 3:
            return _context4.abrupt("return", _context4.sent);

          case 4:
            _context4.next = 6;
            return operation_synctime_get(minUpdateTime);

          case 6:
            remoteOperation = _context4.sent;

            if (remoteOperation.length) {
              _context4.next = 11;
              break;
            }

            _context4.next = 10;
            return operation_get();

          case 10:
            return _context4.abrupt("return", _context4.sent);

          case 11:
            return _context4.abrupt("return", remoteOperation);

          case 12:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));

    return function fetchRemoteOperation(_x3) {
      return _ref19.apply(this, arguments);
    };
  }();

  var syncOperation = /*#__PURE__*/function () {
    var _ref23 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var maxuid, localOperation, minUpdateTime, remoteOperation, _merge, stageUpdate, articleUpdate, list;

      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            logmid('SYNC_DATA::', '------- sync operation ------');
            _context6.next = 3;
            return db_article.maxuid();

          case 3:
            maxuid = _context6.sent;
            _context6.next = 6;
            return db_operation.fetch();

          case 6:
            localOperation = _context6.sent;
            console.log({
              localOperation: localOperation
            });
            minUpdateTime = min(localOperation.map(function (_ref24) {
              var updateTime = _ref24.updateTime;
              return updateTime;
            }));
            logmid('SYNC_DATA::minUpdateTime:', minUpdateTime);
            _context6.next = 12;
            return fetchRemoteOperation(minUpdateTime)["catch"](function (_) {
              return [];
            });

          case 12:
            remoteOperation = _context6.sent;
            console.log({
              remoteOperation: remoteOperation
            });

            if (remoteOperation.length) {
              _context6.next = 17;
              break;
            }

            if (localOperation.length) {
              _context6.next = 17;
              break;
            }

            return _context6.abrupt("return", pubsub.emit(SYNC_STAGE_NOTATA, {}));

          case 17:
            logmid('SYNC_DATA::', {
              maxuid: maxuid,
              minUpdateTime: minUpdateTime
            });
            logmid('SYNC_DATA::', {
              localOperation: localOperation,
              remoteOperation: remoteOperation
            });
            _merge = merge$1(localOperation, remoteOperation), stageUpdate = _merge.stageUpdate, articleUpdate = _merge.articleUpdate, _merge.deleted; // const deletedStageEntityUidS = remoteOperation.filter(({ type, entity }) => type == 0 && entity == 0)
            // stageUpdate = deleted(stageUpdate, { entity: 0, deletedEntityUidS: deletedStageEntityUidS })

            logmid('SYNC_DATA::', {
              stageUpdate: stageUpdate
            });
            logmid('SYNC_DATA::', {
              articleUpdate: articleUpdate
            }); // return
            // 更新数据, article, stage

            updateRemote(articleUpdate.remote, 1);
            updateLocal(articleUpdate.local, 1); //

            updateRemote(stageUpdate.remote);
            _context6.next = 27;
            return updateLocal(stageUpdate.local);

          case 27:
            list = _context6.sent;

            if (isempty) {
              // 当前舞台是否为空
              pubsub.emit(SYNC_STAGE_INIT, list[0].data); // 取第一个初始
            } else {
              list.forEach(function (_ref25) {
                var data = _ref25.data,
                    isupdate = _ref25.isupdate;
                if (!isupdate) return;
                pubsub.emit(SYNC_STAGE_UPDTE, data); // 全量发更新舞台, 在订阅中判定是否是当前舞台
              });
            }

            logmid('SYNC_DATA::', '-----  stage ok ------- ', {
              list: list
            });

          case 30:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));

    return function syncOperation() {
      return _ref23.apply(this, arguments);
    };
  }();

  return {
    pubsub: pubsub,
    syncOperation: syncOperation
  };
};

var node = function node(g, type) {
  // const removedom = g.remove.bind(g)
  console.log({
    g: g,
    type: type
  }); // remove() {
  //   console.log('---- remove ----')
  //   // this.removes.forEach(remove => remove())
  //   removedom()
  // }

  var vnodes = ['rect', 'circle', 'end', 'dot', 'group', 'normal'];

  if (vnodes.indexOf(type) != -1) {
    return Object.assign({
      removes: [],
      GC: new GC(),
      bg: noop,
      front: noop,
      txt: noop,
      editicon: noop,
      border: noop,
      autosize: noop,
      zoom: noop
    }, g);
  }

  var newg = Object.assign(g, {
    removes: [],
    move: function move(x, y) {
      var isrelative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      return g.transform({
        translateX: x,
        translateY: y
      }, isrelative);
    },
    color: function color(_color) {
      this.font && this.font.color(_color);
    }
  });
  newg.font = newg.init && newg.init();
  if (isUnDef(newg.border)) newg.border = noop; // if (isUnDef(newg.move)) newg.move = noop

  return newg;
};

function createElement(tagName, options) {
    return document.createElement(tagName, options);
}
function createElementNS(namespaceURI, qualifiedName, options) {
    return document.createElementNS(namespaceURI, qualifiedName, options);
}
function createDocumentFragment() {
    return parseFragment(document.createDocumentFragment());
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    if (isDocumentFragment$1(parentNode)) {
        let node = parentNode;
        while (node && isDocumentFragment$1(node)) {
            const fragment = parseFragment(node);
            node = fragment.parent;
        }
        parentNode = node !== null && node !== void 0 ? node : parentNode;
    }
    if (isDocumentFragment$1(newNode)) {
        newNode = parseFragment(newNode, parentNode);
    }
    if (referenceNode && isDocumentFragment$1(referenceNode)) {
        referenceNode = parseFragment(referenceNode).firstChildNode;
    }
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    if (isDocumentFragment$1(child)) {
        child = parseFragment(child, node);
    }
    node.appendChild(child);
}
function parentNode(node) {
    if (isDocumentFragment$1(node)) {
        while (node && isDocumentFragment$1(node)) {
            const fragment = parseFragment(node);
            node = fragment.parent;
        }
        return node !== null && node !== void 0 ? node : null;
    }
    return node.parentNode;
}
function nextSibling(node) {
    var _a;
    if (isDocumentFragment$1(node)) {
        const fragment = parseFragment(node);
        const parent = parentNode(fragment);
        if (parent && fragment.lastChildNode) {
            const children = Array.from(parent.childNodes);
            const index = children.indexOf(fragment.lastChildNode);
            return (_a = children[index + 1]) !== null && _a !== void 0 ? _a : null;
        }
        return null;
    }
    return node.nextSibling;
}
function tagName(elm) {
    return elm.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement$1(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
function isDocumentFragment$1(node) {
    return node.nodeType === 11;
}
function parseFragment(fragmentNode, parentNode) {
    var _a, _b, _c;
    const fragment = fragmentNode;
    (_a = fragment.parent) !== null && _a !== void 0 ? _a : (fragment.parent = parentNode !== null && parentNode !== void 0 ? parentNode : null);
    (_b = fragment.firstChildNode) !== null && _b !== void 0 ? _b : (fragment.firstChildNode = fragmentNode.firstChild);
    (_c = fragment.lastChildNode) !== null && _c !== void 0 ? _c : (fragment.lastChildNode = fragmentNode.lastChild);
    return fragment;
}
const htmlDomApi = {
    createElement,
    createElementNS,
    createTextNode,
    createDocumentFragment,
    createComment,
    insertBefore,
    removeChild,
    appendChild,
    parentNode,
    nextSibling,
    tagName,
    setTextContent,
    getTextContent,
    isElement: isElement$1,
    isText,
    isComment,
    isDocumentFragment: isDocumentFragment$1,
};

function vnode(sel, data, children, text, elm) {
    const key = data === undefined ? undefined : data.key;
    return { sel, data, children, text, elm, key };
}

const array = Array.isArray;
function primitive(s) {
    return (typeof s === "string" ||
        typeof s === "number" ||
        s instanceof String ||
        s instanceof Number);
}

function isUndef(s) {
    return s === undefined;
}
function isDef(s) {
    return s !== undefined;
}
const emptyNode = vnode("", {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
    var _a, _b;
    const isSameKey = vnode1.key === vnode2.key;
    const isSameIs = ((_a = vnode1.data) === null || _a === void 0 ? void 0 : _a.is) === ((_b = vnode2.data) === null || _b === void 0 ? void 0 : _b.is);
    const isSameSel = vnode1.sel === vnode2.sel;
    const isSameTextOrFragment = !vnode1.sel && vnode1.sel === vnode2.sel
        ? typeof vnode1.text === typeof vnode2.text
        : true;
    return isSameSel && isSameKey && isSameIs && isSameTextOrFragment;
}
/**
 * @todo Remove this function when the document fragment is considered stable.
 */
function documentFragmentIsNotSupported() {
    throw new Error("The document fragment is not supported on this platform.");
}
function isElement(api, vnode) {
    return api.isElement(vnode);
}
function isDocumentFragment(api, vnode) {
    return api.isDocumentFragment(vnode);
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var _a;
    const map = {};
    for (let i = beginIdx; i <= endIdx; ++i) {
        const key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;
        if (key !== undefined) {
            map[key] = i;
        }
    }
    return map;
}
const hooks = [
    "create",
    "update",
    "remove",
    "destroy",
    "pre",
    "post",
];
function init(modules, domApi, options) {
    const cbs = {
        create: [],
        update: [],
        remove: [],
        destroy: [],
        pre: [],
        post: [],
    };
    const api = domApi !== undefined ? domApi : htmlDomApi;
    for (const hook of hooks) {
        for (const module of modules) {
            const currentHook = module[hook];
            if (currentHook !== undefined) {
                cbs[hook].push(currentHook);
            }
        }
    }
    function emptyNodeAt(elm) {
        const id = elm.id ? "#" + elm.id : "";
        // elm.className doesn't return a string when elm is an SVG element inside a shadowRoot.
        // https://stackoverflow.com/questions/29454340/detecting-classname-of-svganimatedstring
        const classes = elm.getAttribute("class");
        const c = classes ? "." + classes.split(" ").join(".") : "";
        return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
    }
    function emptyDocumentFragmentAt(frag) {
        return vnode(undefined, {}, [], undefined, frag);
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                const parent = api.parentNode(childElm);
                api.removeChild(parent, childElm);
            }
        };
    }
    function createElm(vnode, insertedVnodeQueue) {
        var _a, _b, _c, _d;
        let i;
        let data = vnode.data;
        if (data !== undefined) {
            const init = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;
            if (isDef(init)) {
                init(vnode);
                data = vnode.data;
            }
        }
        const children = vnode.children;
        const sel = vnode.sel;
        if (sel === "!") {
            if (isUndef(vnode.text)) {
                vnode.text = "";
            }
            vnode.elm = api.createComment(vnode.text);
        }
        else if (sel !== undefined) {
            // Parse selector
            const hashIdx = sel.indexOf("#");
            const dotIdx = sel.indexOf(".", hashIdx);
            const hash = hashIdx > 0 ? hashIdx : sel.length;
            const dot = dotIdx > 0 ? dotIdx : sel.length;
            const tag = hashIdx !== -1 || dotIdx !== -1
                ? sel.slice(0, Math.min(hash, dot))
                : sel;
            const elm = (vnode.elm =
                isDef(data) && isDef((i = data.ns))
                    ? api.createElementNS(i, tag, data)
                    : api.createElement(tag, data));
            if (hash < dot)
                elm.setAttribute("id", sel.slice(hash + 1, dot));
            if (dotIdx > 0)
                elm.setAttribute("class", sel.slice(dot + 1).replace(/\./g, " "));
            for (i = 0; i < cbs.create.length; ++i)
                cbs.create[i](emptyNode, vnode);
            if (array(children)) {
                for (i = 0; i < children.length; ++i) {
                    const ch = children[i];
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            else if (primitive(vnode.text)) {
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
            const hook = vnode.data.hook;
            if (isDef(hook)) {
                (_b = hook.create) === null || _b === void 0 ? void 0 : _b.call(hook, emptyNode, vnode);
                if (hook.insert) {
                    insertedVnodeQueue.push(vnode);
                }
            }
        }
        else if (((_c = options === null || options === void 0 ? void 0 : options.experimental) === null || _c === void 0 ? void 0 : _c.fragments) && vnode.children) {
            vnode.elm = ((_d = api.createDocumentFragment) !== null && _d !== void 0 ? _d : documentFragmentIsNotSupported)();
            for (i = 0; i < cbs.create.length; ++i)
                cbs.create[i](emptyNode, vnode);
            for (i = 0; i < vnode.children.length; ++i) {
                const ch = vnode.children[i];
                if (ch != null) {
                    api.appendChild(vnode.elm, createElm(ch, insertedVnodeQueue));
                }
            }
        }
        else {
            vnode.elm = api.createTextNode(vnode.text);
        }
        return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if (ch != null) {
                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    function invokeDestroyHook(vnode) {
        var _a, _b;
        const data = vnode.data;
        if (data !== undefined) {
            (_b = (_a = data === null || data === void 0 ? void 0 : data.hook) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, vnode);
            for (let i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode);
            if (vnode.children !== undefined) {
                for (let j = 0; j < vnode.children.length; ++j) {
                    const child = vnode.children[j];
                    if (child != null && typeof child !== "string") {
                        invokeDestroyHook(child);
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        var _a, _b;
        for (; startIdx <= endIdx; ++startIdx) {
            let listeners;
            let rm;
            const ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (let i = 0; i < cbs.remove.length; ++i)
                        cbs.remove[i](ch, rm);
                    const removeHook = (_b = (_a = ch === null || ch === void 0 ? void 0 : ch.data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : _b.remove;
                    if (isDef(removeHook)) {
                        removeHook(ch, rm);
                    }
                    else {
                        rm();
                    }
                }
                else if (ch.children) {
                    // Fragment node
                    invokeDestroyHook(ch);
                    removeVnodes(parentElm, ch.children, 0, ch.children.length - 1);
                }
                else {
                    // Text node
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        let oldStartIdx = 0;
        let newStartIdx = 0;
        let oldEndIdx = oldCh.length - 1;
        let oldStartVnode = oldCh[0];
        let oldEndVnode = oldCh[oldEndIdx];
        let newEndIdx = newCh.length - 1;
        let newStartVnode = newCh[0];
        let newEndVnode = newCh[newEndIdx];
        let oldKeyToIdx;
        let idxInOld;
        let elmToMove;
        let before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                // Vnode moved right
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                // Vnode moved left
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) {
                    // New element
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }
        if (newStartIdx <= newEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        }
        if (oldStartIdx <= oldEndIdx) {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const hook = (_a = vnode.data) === null || _a === void 0 ? void 0 : _a.hook;
        (_b = hook === null || hook === void 0 ? void 0 : hook.prepatch) === null || _b === void 0 ? void 0 : _b.call(hook, oldVnode, vnode);
        const elm = (vnode.elm = oldVnode.elm);
        if (oldVnode === vnode)
            return;
        if (vnode.data !== undefined ||
            (isDef(vnode.text) && vnode.text !== oldVnode.text)) {
            (_c = vnode.data) !== null && _c !== void 0 ? _c : (vnode.data = {});
            (_d = oldVnode.data) !== null && _d !== void 0 ? _d : (oldVnode.data = {});
            for (let i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode);
            (_g = (_f = (_e = vnode.data) === null || _e === void 0 ? void 0 : _e.hook) === null || _f === void 0 ? void 0 : _f.update) === null || _g === void 0 ? void 0 : _g.call(_f, oldVnode, vnode);
        }
        const oldCh = oldVnode.children;
        const ch = vnode.children;
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            }
            else if (isDef(ch)) {
                if (isDef(oldVnode.text))
                    api.setTextContent(elm, "");
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
            else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, "");
            }
        }
        else if (oldVnode.text !== vnode.text) {
            if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            api.setTextContent(elm, vnode.text);
        }
        (_h = hook === null || hook === void 0 ? void 0 : hook.postpatch) === null || _h === void 0 ? void 0 : _h.call(hook, oldVnode, vnode);
    }
    return function patch(oldVnode, vnode) {
        let i, elm, parent;
        const insertedVnodeQueue = [];
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]();
        if (isElement(api, oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        else if (isDocumentFragment(api, oldVnode)) {
            oldVnode = emptyDocumentFragmentAt(oldVnode);
        }
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        }
        else {
            elm = oldVnode.elm;
            parent = api.parentNode(elm);
            createElm(vnode, insertedVnodeQueue);
            if (parent !== null) {
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0; i < cbs.post.length; ++i)
            cbs.post[i]();
        return vnode;
    };
}

function addNS(data, children, sel) {
    data.ns = "http://www.w3.org/2000/svg";
    if (sel !== "foreignObject" && children !== undefined) {
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            if (typeof child === "string")
                continue;
            const childData = child.data;
            if (childData !== undefined) {
                addNS(childData, child.children, child.sel);
            }
        }
    }
}
function h(sel, b, c) {
    let data = {};
    let children;
    let text;
    let i;
    if (c !== undefined) {
        if (b !== null) {
            data = b;
        }
        if (array(c)) {
            children = c;
        }
        else if (primitive(c)) {
            text = c.toString();
        }
        else if (c && c.sel) {
            children = [c];
        }
    }
    else if (b !== undefined && b !== null) {
        if (array(b)) {
            children = b;
        }
        else if (primitive(b)) {
            text = b.toString();
        }
        else if (b && b.sel) {
            children = [b];
        }
        else {
            data = b;
        }
    }
    if (children !== undefined) {
        for (i = 0; i < children.length; ++i) {
            if (primitive(children[i]))
                children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
        }
    }
    if (sel[0] === "s" &&
        sel[1] === "v" &&
        sel[2] === "g" &&
        (sel.length === 3 || sel[3] === "." || sel[3] === "#")) {
        addNS(data, children, sel);
    }
    return vnode(sel, data, children, text, undefined);
}

const xlinkNS = "http://www.w3.org/1999/xlink";
const xmlNS = "http://www.w3.org/XML/1998/namespace";
const colonChar = 58;
const xChar = 120;
function updateAttrs(oldVnode, vnode) {
    let key;
    const elm = vnode.elm;
    let oldAttrs = oldVnode.data.attrs;
    let attrs = vnode.data.attrs;
    if (!oldAttrs && !attrs)
        return;
    if (oldAttrs === attrs)
        return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    // update modified attributes, add new attributes
    for (key in attrs) {
        const cur = attrs[key];
        const old = oldAttrs[key];
        if (old !== cur) {
            if (cur === true) {
                elm.setAttribute(key, "");
            }
            else if (cur === false) {
                elm.removeAttribute(key);
            }
            else {
                if (key.charCodeAt(0) !== xChar) {
                    elm.setAttribute(key, cur);
                }
                else if (key.charCodeAt(3) === colonChar) {
                    // Assume xml namespace
                    elm.setAttributeNS(xmlNS, key, cur);
                }
                else if (key.charCodeAt(5) === colonChar) {
                    // Assume xlink namespace
                    elm.setAttributeNS(xlinkNS, key, cur);
                }
                else {
                    elm.setAttribute(key, cur);
                }
            }
        }
    }
    // remove removed attributes
    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
    // the other option is to remove all attributes with value == undefined
    for (key in oldAttrs) {
        if (!(key in attrs)) {
            elm.removeAttribute(key);
        }
    }
}
const attributesModule = {
    create: updateAttrs,
    update: updateAttrs,
};

const CAPS_REGEX = /[A-Z]/g;
function updateDataset(oldVnode, vnode) {
    const elm = vnode.elm;
    let oldDataset = oldVnode.data.dataset;
    let dataset = vnode.data.dataset;
    let key;
    if (!oldDataset && !dataset)
        return;
    if (oldDataset === dataset)
        return;
    oldDataset = oldDataset || {};
    dataset = dataset || {};
    const d = elm.dataset;
    for (key in oldDataset) {
        if (!dataset[key]) {
            if (d) {
                if (key in d) {
                    delete d[key];
                }
            }
            else {
                elm.removeAttribute("data-" + key.replace(CAPS_REGEX, "-$&").toLowerCase());
            }
        }
    }
    for (key in dataset) {
        if (oldDataset[key] !== dataset[key]) {
            if (d) {
                d[key] = dataset[key];
            }
            else {
                elm.setAttribute("data-" + key.replace(CAPS_REGEX, "-$&").toLowerCase(), dataset[key]);
            }
        }
    }
}
const datasetModule = {
    create: updateDataset,
    update: updateDataset,
};

function updateProps(oldVnode, vnode) {
    let key;
    let cur;
    let old;
    const elm = vnode.elm;
    let oldProps = oldVnode.data.props;
    let props = vnode.data.props;
    if (!oldProps && !props)
        return;
    if (oldProps === props)
        return;
    oldProps = oldProps || {};
    props = props || {};
    for (key in props) {
        cur = props[key];
        old = oldProps[key];
        if (old !== cur && (key !== "value" || elm[key] !== cur)) {
            elm[key] = cur;
        }
    }
}
const propsModule = { create: updateProps, update: updateProps };

// Bindig `requestAnimationFrame` like this fixes a bug in IE/Edge. See #360 and #409.
const raf = (typeof window !== "undefined" &&
    window.requestAnimationFrame.bind(window)) ||
    setTimeout;
const nextFrame = function (fn) {
    raf(function () {
        raf(fn);
    });
};
let reflowForced = false;
function setNextFrame(obj, prop, val) {
    nextFrame(function () {
        obj[prop] = val;
    });
}
function updateStyle(oldVnode, vnode) {
    let cur;
    let name;
    const elm = vnode.elm;
    let oldStyle = oldVnode.data.style;
    let style = vnode.data.style;
    if (!oldStyle && !style)
        return;
    if (oldStyle === style)
        return;
    oldStyle = oldStyle || {};
    style = style || {};
    const oldHasDel = "delayed" in oldStyle;
    for (name in oldStyle) {
        if (!style[name]) {
            if (name[0] === "-" && name[1] === "-") {
                elm.style.removeProperty(name);
            }
            else {
                elm.style[name] = "";
            }
        }
    }
    for (name in style) {
        cur = style[name];
        if (name === "delayed" && style.delayed) {
            for (const name2 in style.delayed) {
                cur = style.delayed[name2];
                if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                    setNextFrame(elm.style, name2, cur);
                }
            }
        }
        else if (name !== "remove" && cur !== oldStyle[name]) {
            if (name[0] === "-" && name[1] === "-") {
                elm.style.setProperty(name, cur);
            }
            else {
                elm.style[name] = cur;
            }
        }
    }
}
function applyDestroyStyle(vnode) {
    let style;
    let name;
    const elm = vnode.elm;
    const s = vnode.data.style;
    if (!s || !(style = s.destroy))
        return;
    for (name in style) {
        elm.style[name] = style[name];
    }
}
function applyRemoveStyle(vnode, rm) {
    const s = vnode.data.style;
    if (!s || !s.remove) {
        rm();
        return;
    }
    if (!reflowForced) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        vnode.elm.offsetLeft;
        reflowForced = true;
    }
    let name;
    const elm = vnode.elm;
    let i = 0;
    const style = s.remove;
    let amount = 0;
    const applied = [];
    for (name in style) {
        applied.push(name);
        elm.style[name] = style[name];
    }
    const compStyle = getComputedStyle(elm);
    const props = compStyle["transition-property"].split(", ");
    for (; i < props.length; ++i) {
        if (applied.indexOf(props[i]) !== -1)
            amount++;
    }
    elm.addEventListener("transitionend", function (ev) {
        if (ev.target === elm)
            --amount;
        if (amount === 0)
            rm();
    });
}
function forceReflow() {
    reflowForced = false;
}
const styleModule = {
    pre: forceReflow,
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle,
};

var patch = init([attributesModule, propsModule, datasetModule, styleModule]);

var color = function color(_color) {
  return _color.indexOf('#') != -1 ? _color : "#".concat(_color);
};
var strokeAttr = function strokeAttr(_ref) {
  var width = _ref.width,
      type = _ref.type,
      color = _ref.color;
  // 边框属性
  var attr = {
    color: color,
    width: width
  };
  var dasharray = {
    solid: false,
    dashed: [4, 4].join(' ')
  };
  attr.dasharray = dasharray[type]; // console.log({ attr, type })

  return attr;
};
var multiScale = function multiScale(d, ratios) {
  var p = createPadding(d);
  return ratios.map(function (ratio) {
    return p.scale(ratio);
  });
};
var createPadding = function createPadding(min) {
  var _scale = function scale(ratio) {
    var dv = min * ratio; // if (dv > 10) dv = 5

    return {
      dv: dv,
      dx: dv / 2,
      dy: dv / 2
    };
  };

  var limit = function limit(dv) {
    var absdv = Math.abs(dv);
    if (absdv > 8) dv = 8 * dv / absdv;
    if (dv != 0 && absdv < 4) dv = 4 * dv / absdv;
    return dv;
  };

  return {
    scale: function scale(ratio) {
      var _scale2 = _scale(ratio),
          dv = _scale2.dv,
          dx = _scale2.dx,
          dy = _scale2.dy;

      dv = limit(dv);
      return {
        d: min - dv,
        dx: dx,
        dy: dy,
        dv: dv,
        padding: dv / 2
      };
    }
  };
};

var editIconPath = function editIconPath(_ref3) {
  var x = _ref3.x,
      y = _ref3.y;
  return "M".concat(x, " ").concat(y, "h4 l8 -10 v4 l-7 6 h8 v0.6 L").concat(x, " ").concat(y + 0.6, "z");
};
var moreIconPath = function moreIconPath(_ref4) {
  var x = _ref4.x,
      y = _ref4.y;
  return "M".concat(x, " ").concat(y, "h9 v-1 h1 v-10z");
};
var moreIconCirclePath = function moreIconCirclePath(_ref5) {
  var x = _ref5.x,
      y = _ref5.y,
      r = _ref5.r,
      tx = _ref5.tx;
  return "M".concat(x, " ").concat(y, " A ").concat(r, " ").concat(r, " 0 0 0 ").concat(tx + x, " ").concat(y);
};

var ty = function ty(size, height) {
  var d = height * height / 2000;
  d = d > size / 8 && size / 8;
  return size / 2 - d; // return size / 2 - size/8
};

var createAlign = function createAlign(options) {
  var is = function is(reg) {
    return function (txt) {
      return txt.match(reg);
    };
  };

  var clear = function clear(reg) {
    return function (txt) {
      return txt.replace(reg, '');
    };
  };

  return Object.keys(options).reduce(function (memo, key) {
    var reg = options[key];
    memo[key] = {
      is: is(reg),
      clear: clear(reg)
    };
    return memo;
  }, {});
};

var aligns = createAlign({
  left: /^.*@left.*\n/,
  right: /^.*@right.*\n/,
  top: /^.*@top.*\n/,
  bottom: /^.*@bottom.*\n/,
  start: /^.*@start.*\n/,
  middle: /^.*@middle.*\n/,
  end: /^.*@end.*\n/,
  min: /^.*@min.*\n/,
  max: /^.*@max.*\n/
});

var alignMiddleware = function alignMiddleware(val) {
  var _aligns;

  // console.log({ val })
  var matchs = Object.keys(aligns).filter(function (key) {
    return aligns[key].is(val);
  }); // console.log({ matchs })

  return matchs.reduce(function (memo, key) {
    memo.val = aligns[key].clear(val);
    console.log(memo.val);
    memo.aligns[key] = true;
    return memo;
  }, {
    val: val,
    aligns: (_aligns = {
      left: false,
      right: false,
      top: false
    }, _defineProperty(_aligns, "right", false), _defineProperty(_aligns, "start", false), _defineProperty(_aligns, "end", false), _defineProperty(_aligns, "min", false), _defineProperty(_aligns, "max", false), _aligns)
  }); // 默认 val
};

var lineHeight = function lineHeight(size) {
  return size + 8;
}; // 定位


var position = function position(_ref) {
  var aligns = _ref.aligns,
      width = _ref.width,
      height = _ref.height,
      size = _ref.size,
      txts = _ref.txts;
  // 高度, 默认 || 有标识
  var top = (height - lineHeight(size) * (txts.length - 1)) / 2;
  var left = +width / 2; // console.log({ aligns })

  var ratio = 1 / 20;
  if (aligns.min) ratio = 1 / 40;
  if (aligns.max) ratio = 1 / 10;
  if (aligns.left) left = round(width * ratio);
  if (aligns.right) left = width - round(width * ratio);
  if (aligns.top) top = lineHeight(size) / 2;
  if (aligns.bottom) top = height - lineHeight(size) * txts.length; // 默认值设置

  if (aligns.left && !aligns.middle) aligns.start = true;
  if (aligns.right && !aligns.middle) aligns.end = true;
  return {
    top: top,
    left: left,
    anchor: aligns.start && 'start' || aligns.end && 'end' || 'middle'
  };
};

var multiText = function multiText(txt, _ref2) {
  var width = _ref2.width,
      height = _ref2.height,
      _ref2$color = _ref2.color,
      color = _ref2$color === void 0 ? '#000' : _ref2$color,
      _ref2$size = _ref2.size,
      size = _ref2$size === void 0 ? 16 : _ref2$size;
  return function (start, sink) {
    if (txt.trim() == '') return '';
    if (start !== 0) return '';

    var _alignMiddleware = alignMiddleware(txt),
        aligns = _alignMiddleware.aligns,
        val = _alignMiddleware.val;

    var txts = val.split('\n');

    var _position = position({
      aligns: aligns,
      width: width,
      height: height,
      size: size,
      txts: txts
    }),
        left = _position.left,
        top = _position.top,
        anchor = _position.anchor; // console.log({ val })


    var tspans = txts.map(function (t, i) {
      var dy = lineHeight(size);
      var x = 0;
      if (i == 0) dy = top;

      if (t == '') {
        t = ' ';
        dy = size;
      }

      if (t.indexOf('\t') != -1) {
        x = 16;
      }

      return jsx("tspan", {
        x: x,
        dy: dy
      }, t);
    });

    var setbox = function setbox(vnode) {
      sink(new Promise(function (resolve) {
        setTimeout(function () {
          // console.log('-----insert----', { vnode }, vnode.elm.getBBox())
          var _vnode$elm$getBBox = vnode.elm.getBBox(),
              width = _vnode$elm$getBBox.width,
              height = _vnode$elm$getBBox.height;

          resolve({
            width: width,
            height: height
          });
        });
      }));
    };

    var insert = function insert(vnode) {
      return setbox(vnode);
    };

    var update = function update(ovnode, vnode) {
      // 对比文字是否变更
      var txts = function txts() {
        var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return children.map(function (_ref3) {
          var text = _ref3.text;
          return text;
        }).join();
      };

      if (txts(ovnode.children) == txts(vnode.children)) return; // console.log('------------updte ----------')

      setbox(vnode);
    };

    console.log({
      height: height
    });
    return jsx("text", {
      hook: {
        insert: insert,
        update: update
      },
      "font-size": size,
      "text-anchor": anchor,
      "font-family": "none",
      fill: color,
      transform: "translate(".concat(left, ", ").concat(ty(size, height), ")")
    }, tspans);
  };
};
var text = function text(_ref4) {
  var x = _ref4.x,
      y = _ref4.y,
      fontsize = _ref4.fontsize,
      txt = _ref4.txt,
      fill = _ref4.fill;
  return jsx("text", {
    "font-size": fontsize,
    "text-anchor": "middle",
    "font-family": "sans-serif",
    fill: fill,
    transform: "translate(".concat(x, ", ").concat(y, ")")
  }, txt);
};

var rectVNode = function rectVNode(_ref) {
  var x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      _ref$rx = _ref.rx,
      rx = _ref$rx === void 0 ? 4 : _ref$rx,
      _ref$ry = _ref.ry,
      ry = _ref$ry === void 0 ? 4 : _ref$ry,
      txt = _ref.txt,
      fontsize = _ref.fontsize,
      fontcolor = _ref.fontcolor,
      _ref$bg = _ref.bg,
      fill = _ref$bg === void 0 ? '#fff' : _ref$bg,
      stroke = _ref.stroke,
      isarticle = _ref.isarticle,
      isstage = _ref.isstage,
      _ref$ismore = _ref.ismore,
      ismore = _ref$ismore === void 0 ? false : _ref$ismore;
  return function (sink) {
    var icon = {
      width: 16,
      height: 14
    };
    var ratios = [0, -2 / 20];

    var _multiScale = multiScale(min([width, height]), ratios),
        _multiScale2 = _slicedToArray(_multiScale, 2),
        inner = _multiScale2[0],
        wrap = _multiScale2[1];

    var editiconArg = function editiconArg(width, s) {
      return {
        x: width - s.padding - icon.width,
        y: s.padding + icon.height
      };
    };

    var moreiconArg = function moreiconArg(width, height, s) {
      return {
        x: width - s.dv + s.padding - 10,
        y: height - s.dv + s.padding
      };
    };

    var textSource = multiText(txt, {
      width: width,
      height: height,
      color: fontcolor,
      size: fontsize
    });

    var stageFlag = function stageFlag(isstage) {
      if (!isstage) return '';
      return rect$1({
        x: wrap.padding,
        y: wrap.padding,
        width: width - wrap.dv,
        height: height - wrap.dv,
        fill: 'transparent',
        rx: rx,
        ry: ry,
        stroke: _objectSpread2(_objectSpread2({}, stroke), {}, {
          opacity: 0.3
        })
      });
    };

    var articleFlag = function articleFlag(isarticle) {
      if (!isarticle) return '';
      return jsx("path", {
        d: editIconPath(editiconArg(width, inner)),
        fill: "#000000"
      });
    };

    var moreFlag = function moreFlag(ismore) {
      if (!ismore) return '';
      return jsx("path", {
        d: moreIconPath(moreiconArg(width, height, inner)),
        fill: "#000000"
      });
    };

    return jsx("g", {
      transform: "translate(".concat(x, ",").concat(y, ")")
    }, stageFlag(isstage), rect$1({
      x: inner.padding,
      y: inner.padding,
      width: width - inner.dv,
      height: height - inner.dv,
      fill: fill,
      rx: rx / 2,
      ry: ry / 2,
      stroke: stroke
    }), textSource(0, sink), articleFlag(isarticle), moreFlag(ismore));
  };
};
var rect$1 = function rect(_ref2) {
  var _ref2$x = _ref2.x,
      x = _ref2$x === void 0 ? false : _ref2$x,
      _ref2$y = _ref2.y,
      y = _ref2$y === void 0 ? false : _ref2$y,
      width = _ref2.width,
      height = _ref2.height,
      fill = _ref2.fill,
      rx = _ref2.rx,
      ry = _ref2.ry,
      stroke = _ref2.stroke,
      _ref2$className = _ref2.className,
      className = _ref2$className === void 0 ? false : _ref2$className;
  var _stroke$width = stroke.width,
      strokewidth = _stroke$width === void 0 ? false : _stroke$width,
      _stroke$dasharray = stroke.dasharray,
      dasharray = _stroke$dasharray === void 0 ? false : _stroke$dasharray,
      _stroke$opacity = stroke.opacity,
      strokeopacity = _stroke$opacity === void 0 ? false : _stroke$opacity,
      _stroke$color = stroke.color,
      color = _stroke$color === void 0 ? false : _stroke$color;
  return jsx("rect", {
    className: className,
    x: x,
    y: y,
    width: width,
    height: height,
    fill: fill,
    rx: rx,
    ry: ry,
    "stroke-width": strokewidth,
    "stroke-opacity": strokeopacity,
    "stroke-dasharray": dasharray,
    stroke: color
  });
};

var dark = {
  bg: '#fff',
  font: '#000',
  color: '#333',
  // 主色调, 1
  stroke: '#777',
  // 边缘色调, 3
  tag: {
    stroke: '#999',
    // 4
    font: '#fff'
  },
  path: {
    marker: '#555' // 2

  },
  typescene: {
    box: {
      stroke: '#7779'
    }
  }
};

var rectNode = function rectNode(createVNode) {
  return function (_ref) {
    var layer = _ref.layer,
        x = _ref.x,
        y = _ref.y,
        rx = _ref.rx,
        ry = _ref.ry,
        width = _ref.width,
        height = _ref.height,
        _ref$bg = _ref.bg,
        bg = _ref$bg === void 0 ? '#fff' : _ref$bg,
        fontcolor = _ref.fontcolor,
        _ref$fontsize = _ref.fontsize,
        fontsize = _ref$fontsize === void 0 ? 16 : _ref$fontsize,
        _ref$border = _ref.border,
        border = _ref$border === void 0 ? {
      width: 1,
      type: 'solid',
      color: dark.stroke
    } : _ref$border,
        _ref$txt = _ref.txt,
        txt = _ref$txt === void 0 ? '' : _ref$txt,
        _ref$isstage = _ref.isstage,
        isstage = _ref$isstage === void 0 ? false : _ref$isstage,
        _ref$isarticle = _ref.isarticle,
        isarticle = _ref$isarticle === void 0 ? false : _ref$isarticle;

    // console.log({ createVNode })
    var userSinkPms = function userSinkPms(o) {
      return function (pms) {
        return o = undef(o, pms);
      };
    };

    var txtsink = userSinkPms(null);
    var def = {
      x: x,
      y: y,
      rx: rx,
      ry: ry,
      width: width,
      height: height,
      fontcolor: fontcolor,
      fontsize: fontsize,
      txt: txt,
      bg: bg,
      stroke: strokeAttr(border),
      isarticle: isarticle,
      isstage: isstage
    };

    var usePatch = function usePatch(vnode, attrs) {
      if (attrs.stroke) attrs.stroke = Object.assign(def.stroke, attrs.stroke);
      return patch(vnode, createVNode(Object.assign(def, attrs))(txtsink));
    };

    var vnode = usePatch(layer.group().node, {}); // console.log({ vnode })

    var focus = function focus() {
      vnode = usePatch(vnode, {
        stroke: {
          width: 3
        }
      });
    };

    var defocus = function defocus() {
      vnode = usePatch(vnode, {
        stroke: {
          width: 1
        }
      });
    };

    var move = function move(dx, dy) {
      vnode = usePatch(vnode, {
        x: def.x + dx,
        y: def.y + dy
      });
    };

    var remove = function remove() {
      vnode = patch(vnode, h('!'));
    };

    var resize = function resize(_ref2) {
      var width = _ref2.width,
          height = _ref2.height,
          x = _ref2.x,
          y = _ref2.y;
      vnode = usePatch(vnode, {
        width: width,
        height: height,
        x: x,
        y: y
      });
      return true;
    };

    var zoom = function zoom(_ref3) {
      var width = _ref3.width,
          height = _ref3.height,
          x = _ref3.x,
          y = _ref3.y;
      return resize({
        width: width,
        height: height,
        x: x,
        y: y
      });
    };

    var useTxt = function useTxt(txt, _ref4) {
      var width = _ref4.width,
          height = _ref4.height;
      vnode = usePatch(vnode, {
        txt: txt,
        width: width,
        height: height
      });
      return def.txt;
    };

    var useFontsize = function useFontsize(fontsize) {
      if (isUnDef(fontsize)) return def.fontsize;
      vnode = usePatch(vnode, {
        fontsize: fontsize
      });
    };

    var useColor = function useColor(fontcolor) {
      if (fontcolor == def.fontsize) return;
      vnode = usePatch(vnode, {
        fontcolor: fontcolor
      });
    };

    var textsize = function textsize() {
      return txtsink().then(function (_ref5) {
        var width = _ref5.width,
            height = _ref5.height;
        console.log('pms', {
          width: width,
          height: height
        });
        return {
          width: width,
          height: height
        };
      });
    };

    var useBg = function useBg(val) {
      vnode = usePatch(vnode, {
        bg: color(val)
      });
      return def.bg;
    };

    var useBorder = function useBorder(border) {
      vnode = usePatch(vnode, {
        stroke: strokeAttr(border)
      });
    }; // 是否有文章


    var article = function article(isarticle) {
      if (isarticle == def.isarticle) return;
      vnode = usePatch(vnode, {
        isarticle: isarticle
      });
    }; // 是否为舞台


    var stage = function stage(isstage) {
      if (isstage == def.isstage) return;
      vnode = usePatch(vnode, {
        isstage: isstage
      });
    }; // 坐标


    var box = function box(_ref6) {
      var x = _ref6.x,
          y = _ref6.y,
          width = _ref6.width,
          height = _ref6.height,
          _ref6$top = _ref6.top,
          top = _ref6$top === void 0 ? 10 : _ref6$top,
          _ref6$left = _ref6.left,
          left = _ref6$left === void 0 ? 40 : _ref6$left;
      width = width * (1 + left / 100);
      height = height * (1 + top / 100);
      if (width < 150) width += 20; // 最小约束

      if (height < 150) height += 20;
      x -= (width - def.width) / 2;
      y -= (height - def.height) / 2;
      return {
        width: width,
        height: height,
        x: x,
        y: y
      };
    }; // 组成线段的关键点坐标


    var linkpoints = function linkpoints() {
      var halfW = def.width / 2;
      var halfH = def.height / 2;
      return [{
        x: def.x - halfW,
        y: y
      }, {
        x: def.x + halfW,
        y: y
      }, {
        x: def.x,
        y: def.y - halfH
      }, {
        x: def.x,
        y: def.y + halfH
      }];
    };

    var front = function front() {
      console.log('==== front ===');
    };

    var init = function init() {// g.move(x, y)
    };

    return {
      focus: focus,
      defocus: defocus,
      move: move,
      remove: remove,
      resize: resize,
      zoom: zoom,
      txt: useTxt,
      fontsize: useFontsize,
      textsize: textsize,
      color: useColor,
      bg: useBg,
      article: article,
      stage: stage,
      border: useBorder,
      box: box,
      linkpoints: linkpoints,
      front: front,
      init: init
    };
  };
};
var rect = function rect(layer) {
  return function (argv) {
    return rectNode(rectVNode)(_objectSpread2({
      layer: layer
    }, argv));
  };
};

var circleVNode = function circleVNode(_ref) {
  var x = _ref.x,
      y = _ref.y,
      d = _ref.d,
      txt = _ref.txt,
      fontsize = _ref.fontsize,
      fontcolor = _ref.fontcolor,
      _ref$bg = _ref.bg,
      bg = _ref$bg === void 0 ? '#fff' : _ref$bg,
      stroke = _ref.stroke,
      isarticle = _ref.isarticle,
      isstage = _ref.isstage,
      _ref$ismore = _ref.ismore,
      ismore = _ref$ismore === void 0 ? false : _ref$ismore;
  return function (sink) {
    var ratios = [0, -2 / 20];

    var _multiScale = multiScale(d, ratios),
        _multiScale2 = _slicedToArray(_multiScale, 2),
        inner = _multiScale2[0],
        wrap = _multiScale2[1];

    var defr = r(d); // 外层圆 cx,cy 未变化

    var editiconArg = function editiconArg(s) {
      return {
        x: defr - r(12),
        y: -r(s.d) + defr + 12
      };
    };

    var moreiconArg = function moreiconArg(d, s) {
      return {
        x: r(d) - cos(r(s.d)),
        // 三角函数对边
        y: r(d) + sin(r(s.d)),
        // 三角函数临边
        tx: cos(r(s.d)) * 2,
        // 三角函数对边*2, 圆弧的直线长度
        r: r(s.d) // 半径

      };
    }; // stroke.dasharray = (stroke.dasharray || []).join(' ')
    // if (!stroke.dasharray) {
    //   stroke.dasharray = false
    // }


    var textSource = multiText(txt, {
      width: d,
      height: d,
      color: fontcolor,
      size: fontsize
    });

    var stageFlag = function stageFlag(isstage) {
      if (!isstage) return '';
      return circle$1({
        cx: wrap.padding + wrap.d / 2,
        cy: wrap.padding + wrap.d / 2,
        r: wrap.d / 2,
        fill: 'transparent',
        stroke: _objectSpread2(_objectSpread2({}, stroke), {}, {
          width: 1,
          opacity: 0.25
        })
      });
    };

    var articleFlag = function articleFlag(isarticle) {
      if (!isarticle) return '';
      return jsx("path", {
        d: editIconPath(editiconArg(inner)),
        fill: "#000000"
      });
    };

    var moreFlag = function moreFlag(ismore) {
      if (!ismore) return '';
      return jsx("path", {
        d: moreIconCirclePath(moreiconArg(d, inner)),
        fill: "#000000"
      });
    };

    console.log(inner.d);
    return jsx("g", {
      transform: "translate(".concat(x, ",").concat(y, ")")
    }, stageFlag(isstage), circle$1({
      cx: inner.padding + inner.d / 2,
      cy: inner.padding + inner.d / 2,
      r: inner.d / 2,
      fill: bg,
      stroke: stroke
    }), textSource(0, sink), articleFlag(isarticle), moreFlag(ismore));
  };
};
var circle$1 = function circle(_ref2) {
  var cx = _ref2.cx,
      cy = _ref2.cy,
      r = _ref2.r,
      fill = _ref2.fill,
      stroke = _ref2.stroke,
      _ref2$className = _ref2.className,
      className = _ref2$className === void 0 ? false : _ref2$className;

  var _ref3 = stroke || {},
      _ref3$width = _ref3.width,
      strokewidth = _ref3$width === void 0 ? false : _ref3$width,
      _ref3$dasharray = _ref3.dasharray,
      dasharray = _ref3$dasharray === void 0 ? false : _ref3$dasharray,
      _ref3$opacity = _ref3.opacity,
      strokeopacity = _ref3$opacity === void 0 ? false : _ref3$opacity,
      _ref3$color = _ref3.color,
      color = _ref3$color === void 0 ? false : _ref3$color;

  return jsx("circle", {
    className: className,
    cx: cx,
    cy: cy,
    r: r,
    fill: fill,
    "stroke-width": strokewidth,
    "stroke-dasharray": dasharray,
    "stroke-opacity": strokeopacity,
    stroke: color
  });
};

var circle = function circle(layer) {
  return function (_ref) {
    var x = _ref.x,
        y = _ref.y,
        d = _ref.d,
        _ref$bg = _ref.bg,
        bg = _ref$bg === void 0 ? '#fff' : _ref$bg,
        fontcolor = _ref.fontcolor,
        _ref$fontsize = _ref.fontsize,
        fontsize = _ref$fontsize === void 0 ? 16 : _ref$fontsize,
        _ref$border = _ref.border,
        border = _ref$border === void 0 ? {
      width: 1,
      type: 'solid',
      color: '#000'
    } : _ref$border,
        _ref$txt = _ref.txt,
        txt = _ref$txt === void 0 ? '' : _ref$txt,
        _ref$isstage = _ref.isstage,
        isstage = _ref$isstage === void 0 ? false : _ref$isstage,
        _ref$isarticle = _ref.isarticle,
        isarticle = _ref$isarticle === void 0 ? false : _ref$isarticle;

    var userSinkPms = function userSinkPms(o) {
      return function (pms) {
        return o = undef(o, pms);
      };
    };

    var txtsink = userSinkPms(null);
    var def = {
      x: x,
      y: y,
      d: d,
      fontcolor: fontcolor,
      fontsize: fontsize,
      txt: txt,
      bg: bg,
      stroke: strokeAttr(border),
      isarticle: isarticle,
      isstage: isstage
    };

    var usePatch = function usePatch(vnode, attrs) {
      if (attrs.stroke) attrs.stroke = Object.assign(def.stroke, attrs.stroke);
      return patch(vnode, circleVNode(Object.assign(def, attrs))(txtsink));
    };

    var vnode = usePatch(layer.group().node, {}); // console.log({ vnode })

    var focus = function focus() {
      vnode = usePatch(vnode, {
        stroke: {
          width: 3
        }
      });
    };

    var defocus = function defocus() {
      vnode = usePatch(vnode, {
        stroke: {
          width: 1
        }
      });
    };

    var move = function move(dx, dy) {
      vnode = usePatch(vnode, {
        x: def.x + dx,
        y: def.y + dy
      });
    };

    var remove = function remove() {
      vnode = patch(vnode, h('!'));
    };

    var resize = function resize(_ref2) {
      var d = _ref2.d,
          x = _ref2.x,
          y = _ref2.y;
      // console.log({ d, x, y })
      if (d == def.d) return false;
      if (d < 10) d = 10;
      vnode = usePatch(vnode, {
        d: d,
        x: x,
        y: y
      });
      return true;
    };

    var zoom = function zoom(_ref3) {
      var d = _ref3.d,
          x = _ref3.x,
          y = _ref3.y;
      return resize({
        d: d,
        x: x,
        y: y
      });
    };

    var useTxt = function useTxt(txt, _ref4) {
      var d = _ref4.d;
      vnode = usePatch(vnode, {
        txt: txt,
        d: d
      });
      return def.txt;
    };

    var useFontsize = function useFontsize(fontsize) {
      if (isUnDef(fontsize)) return def.fontsize;
      vnode = usePatch(vnode, {
        fontsize: fontsize
      });
    };

    var useColor = function useColor(fontcolor) {
      if (fontcolor == def.fontsize) return;
      vnode = usePatch(vnode, {
        fontcolor: fontcolor
      });
    };

    var textsize = function textsize() {
      return txtsink().then(function (_ref5) {
        var width = _ref5.width,
            height = _ref5.height;
        console.log('pms', {
          width: width,
          height: height
        });
        return {
          width: width,
          height: height
        };
      });
    };

    var useBg = function useBg(val) {
      vnode = usePatch(vnode, {
        bg: color(val)
      });
      return def.bg;
    };

    var useBorder = function useBorder(border) {
      vnode = usePatch(vnode, {
        stroke: strokeAttr(border)
      });
    }; // 是否有文章


    var article = function article(isarticle) {
      if (isarticle == def.isarticle) return;
      vnode = usePatch(vnode, {
        isarticle: isarticle
      });
    }; // 是否为舞台


    var stage = function stage(isstage) {
      if (isstage == def.isstage) return;
      vnode = usePatch(vnode, {
        isstage: isstage
      });
    };

    var box = function box() {
      return {
        width: d,
        height: d
      };
    };

    var linkpoints = function linkpoints(_ref6) {
      var x = _ref6.x,
          y = _ref6.y;
      var halfW = width / 2,
          halfH = height / 2;
      return [{
        x: x - halfW,
        y: y
      }, {
        x: x + halfW,
        y: y
      }, {
        x: x,
        y: y - halfH
      }, {
        x: x,
        y: y + halfH
      }];
    };

    var front = function front() {
      console.log('==== front ===');
    };

    var init = function init() {// g.move(x, y)
    };

    return {
      focus: focus,
      defocus: defocus,
      move: move,
      remove: remove,
      resize: resize,
      zoom: zoom,
      txt: useTxt,
      fontsize: useFontsize,
      textsize: textsize,
      color: useColor,
      bg: useBg,
      article: article,
      stage: stage,
      border: useBorder,
      box: box,
      linkpoints: linkpoints,
      front: front,
      init: init
    };
  };
};

var normalVNode = function normalVNode(_ref) {
  var txt = _ref.txt,
      x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      fontcolor = _ref.fontcolor,
      fontsize = _ref.fontsize,
      stroke = _ref.stroke,
      _ref$rx = _ref.rx,
      rx = _ref$rx === void 0 ? 4 : _ref$rx,
      _ref$ry = _ref.ry,
      ry = _ref$ry === void 0 ? 4 : _ref$ry,
      _ref$bg = _ref.bg,
      bg = _ref$bg === void 0 ? '#fff' : _ref$bg;
  return function (sink) {
    var textSource = multiText(txt, {
      width: width,
      height: height,
      color: fontcolor,
      size: fontsize
    });
    return jsx("g", {
      transform: "translate(".concat(x, ",").concat(y, ")")
    }, rect$1({
      x: 0,
      y: 8,
      width: width,
      height: height - 12,
      fill: bg,
      rx: rx / 2,
      ry: ry / 2,
      stroke: stroke
    }), textSource(0, sink));
  };
};

var normal = function normal(layer) {
  return function (argv) {
    return rectNode(normalVNode)(_objectSpread2(_objectSpread2({
      layer: layer
    }, argv), {}, {
      bg: '#444',
      fontcolor: '#fff',
      rx: 8,
      ry: 8
    }));
  };
};

var endVNode = function endVNode(_ref) {
  var x = _ref.x,
      y = _ref.y,
      d = _ref.d,
      _ref$bg = _ref.bg,
      fill = _ref$bg === void 0 ? '#000' : _ref$bg;
  var innerR = 6;

  var circle = function circle(_ref2) {
    var _ref2$cx = _ref2.cx,
        cx = _ref2$cx === void 0 ? 0 : _ref2$cx,
        _ref2$cy = _ref2.cy,
        cy = _ref2$cy === void 0 ? 0 : _ref2$cy,
        r = _ref2.r,
        fill = _ref2.fill,
        opacity = _ref2.opacity;
    return jsx("circle", {
      cx: cx,
      cy: cy,
      r: r,
      fill: fill,
      opacity: opacity
    });
  };

  return jsx("g", {
    transform: "translate(".concat(x, ",").concat(y, ")")
  }, circle({
    r: d / 2,
    fill: fill,
    opacity: 0.3
  }), circle({
    r: innerR / 2,
    fill: fill,
    opacity: 1
  }));
};

var END_D = 24;
var end = function end(layer) {
  return function (_ref) {
    var x = _ref.x,
        y = _ref.y,
        d = _ref.d,
        _ref$bg = _ref.bg,
        bg = _ref$bg === void 0 ? 'transparent' : _ref$bg;
    var def = {
      x: x,
      y: y,
      d: END_D,
      bg: bg
    };

    var usePatch = function usePatch(vnode, attrs) {
      return patch(vnode, endVNode(Object.assign(def, attrs)));
    };

    var vnode = usePatch(layer.group().node, {});

    var focus = function focus() {
      vnode = usePatch(vnode, {
        bg: '#000'
      });
    };

    var defocus = function defocus() {
      vnode = usePatch(vnode, {
        bg: 'transparent'
      });
    };

    var move = function move(dx, dy) {
      vnode = usePatch(vnode, {
        x: def.x + dx,
        y: def.y + dy
      });
    };

    var remove = function remove() {
      vnode = patch(vnode, h('!'));
    };

    var box = function box() {
      return {
        width: d,
        height: d
      };
    }; // const useBg = (val) => {
    //   vnode = usePatch(vnode, { bg: color(val) })
    //   return def.bg
    // }
    // const useBorder = (border) => {
    //   vnode = usePatch(vnode, { stroke: strokeAttr(border) })
    // }


    return {
      focus: focus,
      defocus: defocus,
      move: move,
      remove: remove,
      box: box
    };
  };
};

var groupVNode = function groupVNode(_ref) {
  var x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      stroke = _ref.stroke,
      isarticle = _ref.isarticle,
      _ref$rx = _ref.rx,
      rx = _ref$rx === void 0 ? 4 : _ref$rx,
      _ref$ry = _ref.ry,
      ry = _ref$ry === void 0 ? 4 : _ref$ry,
      _ref$bg = _ref.bg,
      bg = _ref$bg === void 0 ? '#fff' : _ref$bg,
      _ref$ismore = _ref.ismore,
      ismore = _ref$ismore === void 0 ? false : _ref$ismore;
  var ratios = [0, -2 / 20];

  var _multiScale = multiScale(min([width, height]), ratios),
      _multiScale2 = _slicedToArray(_multiScale, 2),
      inner = _multiScale2[0];
      _multiScale2[1];

  var icon = {
    width: 16,
    height: 14
  };

  var editiconArg = function editiconArg(width, s) {
    return {
      x: width - s.padding - icon.width,
      y: s.padding + icon.height
    };
  };

  var articleFlag = function articleFlag(isarticle) {
    if (!isarticle) return '';
    return jsx("path", {
      d: editIconPath(editiconArg(width, inner)),
      fill: "#000000"
    });
  };

  var moreFlag = function moreFlag(ismore) {
    if (!ismore) return '';
    return jsx("path", {
      d: moreIconPath(moreiconArg(width, height, inner)),
      fill: "#000000"
    });
  };

  return jsx("g", {
    transform: "translate(".concat(x, ",").concat(y, ")")
  }, rect$1({
    x: 0,
    y: 0,
    width: width,
    height: height,
    fill: bg,
    rx: rx / 2,
    ry: ry / 2,
    stroke: stroke
  }), articleFlag(isarticle), moreFlag(ismore));
};

var group = function group(layer) {
  return function (_ref) {
    var x = _ref.x,
        y = _ref.y,
        width = _ref.width,
        height = _ref.height,
        _ref$bg = _ref.bg,
        bg = _ref$bg === void 0 ? 'transparent' : _ref$bg,
        _ref$show = _ref.show,
        isshow = _ref$show === void 0 ? false : _ref$show,
        _ref$isarticle = _ref.isarticle,
        isarticle = _ref$isarticle === void 0 ? false : _ref$isarticle;
    // console.log({ isarticle, isshow })
    var strokeAttr = {
      width: 1,
      dasharray: [3, 6]
    };

    var defocusstroke = function defocusstroke(isshow) {
      return _objectSpread2(_objectSpread2({}, strokeAttr), isshow ? {
        color: '#888'
      } : {
        color: 'transparent'
      });
    };

    var focusstroke = function focusstroke(isshow) {
      return _objectSpread2(_objectSpread2({}, strokeAttr), isshow ? {
        color: '#000',
        width: 1.5
      } : {
        color: '#888'
      });
    }; // dasharray: [1, 2]


    var def = {
      x: x,
      y: y,
      width: width,
      height: height,
      stroke: defocusstroke(isshow),
      isshow: isshow,
      bg: bg,
      isarticle: isarticle
    };

    var usePatch = function usePatch(vnode, attrs) {
      if (attrs.stroke) attrs.stroke = Object.assign(def.stroke, attrs.stroke);
      return patch(vnode, groupVNode(Object.assign(def, attrs)));
    };

    var vnode = usePatch(layer.group().node, {});

    var focus = function focus() {
      vnode = usePatch(vnode, {
        stroke: focusstroke(def.isshow)
      });
    };

    var defocus = function defocus() {
      vnode = usePatch(vnode, {
        stroke: defocusstroke(def.isshow)
      });
    };

    var move = function move(dx, dy) {
      vnode = usePatch(vnode, {
        x: def.x + dx,
        y: def.y + dy
      });
    };

    var show = function show(isshow) {
      vnode = usePatch(vnode, {
        isshow: isshow,
        stroke: defocusstroke(isshow)
      });
    };

    var resize = function resize(_ref2) {
      var width = _ref2.width,
          height = _ref2.height,
          x = _ref2.x,
          y = _ref2.y;
      vnode = usePatch(vnode, {
        width: width,
        height: height,
        x: x,
        y: y
      });
      return true;
    }; // 是否有文章


    var article = function article(isarticle) {
      if (isarticle == def.isarticle) return;
      vnode = usePatch(vnode, {
        isarticle: isarticle
      });
    };

    var remove = function remove() {
      vnode = patch(vnode, h('!'));
    };

    return {
      focus: focus,
      defocus: defocus,
      move: move,
      show: show,
      resize: resize,
      article: article,
      remove: remove
    };
  };
};

var dot = end;

var NodeType_Model = [{
  type: 'circle',
  id: 1,
  x: 200,
  y: 200,
  d: 80,
  txt: ''
}, {
  type: 'rect',
  id: 2,
  x: 400,
  y: 200,
  width: 80,
  height: 80,
  txt: ''
}, {
  type: 'normal',
  id: 3,
  x: 600,
  y: 240 - 28 / 2,
  // 240 = 200 + 80/2
  width: 40,
  height: 28,
  txt: 'text'
}];
var isModel = function isModel(t, w, h) {
  // console.log({ t, w, h })
  var Model = NodeType_Model;
  return Model.filter(function (_ref) {
    var type = _ref.type,
        width = _ref.width,
        height = _ref.height;
    if (type !== t) return;
    return width == w && height == h;
  }).length > 0;
};
var ORIGIN = [{
  type: 'circle',
  id: 1,
  d: 120,
  fz: 24,
  txt: 'start with one'
}]; // just describe

var LOCAL_DATA = 'DATA';
var localremove = function localremove() {
  return localStorage.removeItem(LOCAL_DATA);
};
var localset = function localset(chardata) {
  return localStorage.setItem(LOCAL_DATA, chardata);
};
var localget = function localget() {
  return localStorage.getItem(LOCAL_DATA);
}; // console.log({ mock })

var createLocal = function createLocal() {
  var localStage = {};

  try {
    localStage = undef(localStage, JSON.parse(localget()));
    logmid('STAGE_LIFE::', {
      localStage: localStage
    }); // localStage.data.points = mock
    // localStage.data.view.x = -235
    // localStage.data.view.y = 235
    // console.log({ localStage })
  } catch (err) {
    console.warn(err);
  }

  return {
    get: localget,
    set: localset,
    remove: localremove,
    stage: function stage() {
      return localStage;
    },
    clear: function clear() {
      return localStage = null;
    }
  };
};

var islink = function islink(type) {
  return has(['link', 'solid', 'dotted'], type);
};
var isdot = function isdot(type) {
  return type == 'dot';
};
var isgroup = function isgroup(type) {
  return type == 'group';
};
var iscircle = function iscircle(type) {
  return type == 'circle';
};
var isrect = function isrect(type) {
  return type == 'rect';
};
var isend = function isend(type) {
  return type == 'end';
};
var cidparse = function cidparse(cids) {
  return cids.split(',').map(Number);
};
var cidUnParse = function cidUnParse(cids) {
  return cids.join(',');
};
var unparseDot = function unparseDot(dots) {
  return dots.join('-');
};
var dotids = function dotids(dots) {
  return dots.map(pickv('id'));
};
var dotidstr = function dotidstr(dots) {
  return unparseDot(dotids(dots));
};
var parseDotOp = function parseDotOp(op) {
  return function (dotstr) {
    return dotstr.split('-').map(function (id) {
      return op(+id);
    });
  };
};
var parseDot = function parseDot(dotstr) {
  return parseDotOp(function (v) {
    return v;
  })(dotstr);
};
var box$1 = function box(_ref) {
  var id = _ref.id,
      x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      d = _ref.d,
      _width = _ref._width,
      _height = _ref._height,
      _d = _ref._d;
  return {
    id: id,
    x: x,
    y: y,
    width: d || width,
    height: d || height,
    _width: _d || _width,
    _height: _d || _height
  };
}; // 中心点坐标

var boxcxy = function boxcxy(vnode) {
  var vbox = box$1(vnode); // console.log({ vbox })

  return _objectSpread2(_objectSpread2({}, vbox), {}, {
    cx: vbox.x + vbox.width / 2,
    cy: vbox.y + vbox.height / 2
  });
};
var boxtrbl = function boxtrbl(vnode) {
  var vbox = box$1(vnode);
  var top = vbox.y,
      right = vbox.x + vbox.width,
      bottom = vbox.y + vbox.height,
      left = vbox.x;

  if (isend(vnode.type) || isdot(vnode.type)) {
    left = left - END_D / 2;
    right = right + END_D / 2;
    top = top - END_D / 2;
    bottom = bottom + END_D / 2;
  }

  return _objectSpread2(_objectSpread2({}, vbox), {}, {
    top: top,
    right: right,
    bottom: bottom,
    left: left
  });
};
var boxdesc = function boxdesc(_ref4, _ref5) {
  var w1 = _ref4.width,
      h1 = _ref4.height;
  var w2 = _ref5.width,
      h2 = _ref5.height;
  return w2 * h2 - w1 * h1;
};
var stageUids = [];
var articleUids = [];
var allUidsPm = function allUidsPm() {
  return Promise.all([db_stage.allUids(), db_article.allUids()]).then(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
        suids = _ref7[0],
        auids = _ref7[1];

    stageUids = suids;
    articleUids = auids;
    logmid('VNODE::', {
      stageUids: stageUids,
      articleUids: articleUids
    });
    return {
      stageUids: stageUids,
      articleUids: articleUids
    };
  })["catch"](function (err) {
    return console.error(err);
  });
};
db.datainit().then(function (uid) {// initres(uid)
});
var STAGE = {
  uid: 1,
  title: 'default'
}; // uid:0 浮萍舞台, uid:1 主舞台

var local = createLocal();

var createModel = function createModel(_ref8) {
  var title = _ref8.title,
      width = _ref8.width,
      height = _ref8.height;
  var data = JSON.parse(JSON.stringify(ORIGIN));
  data[0].txt = undef(data[0].txt, title);
  if (Array.isArray(data)) data = {
    points: data,
    view: {
      x: 0,
      y: 0,
      scale: 1,
      width: width,
      height: height
    }
  };

  if (data.points.length == 1) {
    // 初始数据
    data.points[0].x = width / 2;
    data.points[0].y = height / 4;
  }

  return data;
}; // 默认数据


var stageDefData = function stageDefData(_ref9) {
  var title = _ref9.title,
      width = _ref9.width,
      height = _ref9.height;
  logmid('STAGE_LIFE::stageDefData:');
  var data = createModel({
    title: title,
    width: width,
    height: height
  });
  return {
    title: title,
    data: JSON.stringify(data)
  };
}; // 获取资源, local -> remote


var stageExisted = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(uid) {
    var _ref12, id, data, parent, title, dbstages, remoteStages, stage;

    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          logmid('STAGE_LIFE::stageExisted:', {
            uid: uid
          });
          _context.prev = 1;
          _ref12 = local.stage() || {}, id = _ref12.uid, data = _ref12.data, parent = _ref12.parent, title = _ref12.title;
          logmid('STAGE_LIFE::local:', {
            uid: uid,
            id: id
          });

          if (!(uid == id)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", {
            uid: uid,
            parent: parent,
            title: title,
            data: data
          });

        case 6:
          _context.next = 8;
          return db_stage.fetchUid(uid);

        case 8:
          dbstages = _context.sent;
          logmid('STAGE_LIFE::db:', {
            uid: uid,
            dbstages: dbstages
          });

          if (!dbstages.length) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", dbstages[0]);

        case 12:
          _context.next = 14;
          return stage_get({
            stageIDS: [uid],
            manifest: false
          });

        case 14:
          remoteStages = _context.sent;
          // 这里无需拉取, 初始已同步
          logmid('STAGE_LIFE::remote:', {
            remoteStages: remoteStages
          });

          if (!remoteStages.length) {
            _context.next = 20;
            break;
          }

          // 本地无,写回
          stage = remoteStages[0]; // const { uid } = await db_stage.send(stage)

          db_stage.send(stage);
          return _context.abrupt("return", stage);

        case 20:
          _context.next = 24;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](1);

        case 24:
          _context.prev = 24;
          local.clear();
          return _context.finish(24);

        case 27:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 22, 24, 27]]);
  }));

  return function stageExisted(_x) {
    return _ref10.apply(this, arguments);
  };
}(); // existed -> default


var createStageData = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(_ref13) {
    var uid, parent, title, width, height, stage, data;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          uid = _ref13.uid, parent = _ref13.parent, title = _ref13.title, width = _ref13.width, height = _ref13.height;
          _context2.next = 3;
          return stageExisted(uid);

        case 3:
          stage = _context2.sent;
          logmid('STAGE_LIFE::stageExisted:', {
            uid: uid,
            stage: stage,
            parent: parent
          });
          if (isUnDef(stage)) stage = _objectSpread2({
            parent: parent,
            uid: uid
          }, stageDefData({
            title: title,
            width: width,
            height: height
          })); // 创建
          // if (!stage.islocal) { // 从远程拉取, 需要写回本地
          //   const { uid } = await db_stage.send(stage)
          //   logmid('STAGE_LIFE::', { stage, uid })
          //   stage.uid = uid
          // }

          data = isStr(stage.data) ? JSON.parse(stage.data) : stage.data;
          uid = stage.uid, title = stage.title, parent = stage.parent; //logmid('VNODE::','stage from db:', data)

          logmid('VNODE::', {
            stage: stage,
            parent: parent
          });
          return _context2.abrupt("return", {
            uid: uid,
            parent: parent,
            title: title,
            width: width,
            height: height,
            data: data
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));

  return function createStageData(_x2) {
    return _ref14.apply(this, arguments);
  };
}();
var initData = function initData(_ref15) {
  var width = _ref15.width,
      height = _ref15.height,
      data = _ref15.data,
      parent = _ref15.parent,
      title = _ref15.title;
  //logmid('VNODE::','initData::', { data, parent, title })
  // const chardata = JSON.stringify(data)
  logmid('VNODE::', 'points:', data.points);
  var vdata = deserializeData(data.points);
  var view = viewboxBoot(data.view, {
    width: width,
    height: height
  });
  logmid('STAGE_LIFE::', {
    view: view
  }); // view.x = 0
  // TODO::添加缓存关系模板

  var points = vdata.vnodes.concat(vdata.vlinks.map(function (_ref16) {
    var type = _ref16.type,
        pid = _ref16.pid,
        cid = _ref16.cid;
    return {
      type: type,
      pid: pid,
      cid: cid
    };
  }));
  diff.indexddb(diff.serialize(JSON.stringify(points), {
    parent: parent,
    title: title
  })); // 初始存储,记录转换后的vnodes => points

  return {
    vdata: vdata,
    view: view
  };
}; // 输出了相关连的点; TODO::(未)根据tree有序排列

var linecoordToArr = function linecoordToArr(parent, child) {
  var _linecoord = linecoord(parent, child),
      x1 = _linecoord.x1,
      y1 = _linecoord.y1,
      x2 = _linecoord.x2,
      y2 = _linecoord.y2;

  return [{
    x: x1,
    y: y1
  }, {
    x: x2,
    y: y2
  }];
};

var linecoordMulti = function linecoordMulti(dots) {
  // logmid('VNODE::linecoordMulti', { dots })
  var len = dots.length;
  if (len < 2) return [];
  var start = linecoordToArr.apply(void 0, _toConsumableArray(dots.slice(0, 2)));
  var end = linecoordToArr.apply(void 0, _toConsumableArray(dots.slice(-2)));

  var point = function point(_ref18) {
    var x = _ref18.x,
        y = _ref18.y,
        id = _ref18.id;
    return {
      x: x + 6,
      y: y + 6,
      id: id
    };
  }; // TODO::优化这里默认为dot直径6


  var middle = len > 4 ? dots.slice(2, len - 2).map(point) : []; // logmid('VNODE::', { start, middle, end })

  return [].concat(_toConsumableArray(start), _toConsumableArray(middle), _toConsumableArray(end));
}; // 序列化初始数据

var deserializeData = function deserializeData(data) {
  logmid('VNODE::', {
    data: data
  });
  var vlinks = [];
  var vnodes = [];

  var has = function has(id) {
    return function (item) {
      return !isUnDef(item.id) && item.id == id;
    };
  };

  var pcid = function pcid(pid, cid, id) {
    var parent = data.filter(has(pid))[0];
    var child = data.filter(has(cid))[0];
    if (isUnDef(parent) || isUnDef(child)) return;
    var dots = linecoordToArr(parent, child); // logmid('VNODE::',{ parent, child })

    return [_objectSpread2(_objectSpread2({}, dots[0]), {}, {
      id: pid
    }), _objectSpread2(_objectSpread2({}, dots[1]), {}, {
      id: cid
    })];
  };

  logmid('VNODE::', {
    data: data
  });

  var dotid = function dotid(dotstr) {
    var dots = parseDotOp(function (id) {
      // logmid('VNODE::',id, data.filter(has(id)))
      var match = data.filter(has(id));
      return match;
    })(dotstr);
    console.log('flatten::', flatten(dots));
    var pairs = linecoordMulti(flatten(dots).map(vnodePatch)); // map [...{x,y,width,height}]

    logmid('VNODE::', {
      dotstr: dotstr,
      dots: dots,
      pairs: pairs
    }, flatten(dots));
    var dotdatas = parseDot(dotstr).reduce(function (memo, id, i) {
      if (!isUnDef(memo[i])) memo[i].id = id;
      return memo;
    }, uniqWith(pairs, isEqual));
    logmid('VNODE::', {
      dotdatas: dotdatas
    });
    return dotdatas;
  };

  var link = function link(_ref19) {
    var pid = _ref19.pid,
        cid = _ref19.cid,
        type = _ref19.type,
        dots = _ref19.dots;
    dots = !isUnDef(dots) ? dotid(dots) : pcid(pid, cid); // 渲染的点

    var ids = dotids(dots);
    logmid('VNODE::', {
      dots: dots,
      ids: ids
    });
    return {
      type: type,
      dots: dots,
      head: ids[0],
      tail: ids[lastindex(dots)]
    };
  };

  data.forEach(function (item) {
    var type = item.type;

    if (islink(type)) {
      if (type == 'link') item.type = 'solid'; // !!! conv data

      vlinks.push(link(item));
    } else {
      vnodes.push(vnodePatch(item));
    }
  });
  console.log({
    vlinks: vlinks
  }); // logmid('VNODE::',{ vlinks, vnodes }) // 序列化后的舞台数据

  return {
    vlinks: vlinks.filter(function (v) {
      return !!v;
    }),
    vnodes: vnodes
  };
}; // vnode 原始数据补丁

var vnodePatch = function vnodePatch(vnode) {
  var type = vnode.type,
      d = vnode.d,
      width = vnode.width,
      height = vnode.height;
      vnode.id;
      vnode.txt;
  vnode.ratio = 1; // vnode.txt = vnode.txt + id
  // vnode.txt = vnode.txt?.replaceAll(id, '')

  if (isUnDef(vnode.fz)) vnode.fz = 16; // fontsize

  if (isUnDef(vnode.bd)) vnode.bd = '1 solid #000'; // border

  if (isUnDef(vnode.c)) vnode.c = '#000'; // color

  if (isDef$1(d)) vnode._d = d; //  用于节点缩放时的计算

  if (isDef$1(width)) vnode._width = width;
  if (isDef$1(height)) vnode._height = height;
  if (isDef$1(vnode.cids) && isStr(vnode.cids)) vnode.cids = cidparse(vnode.cids);

  if (isdot(type)) {
    vnode.width = 0;
    vnode.height = 0;
  }

  if (isend(type)) vnode.d = 1; // if (vnode.article && articleUids.indexOf(id) == -1) {
  //   if (!isUnDef(vnode.article)) delete vnode.article
  // }
  // if (vnode.stage && stageUids.indexOf(id) == -1) {
  //   if (!isUnDef(vnode.stage)) delete vnode.stage
  // }

  if (!vnode.x) vnode.x = 0;
  if (!vnode.y) vnode.y = 0; // logmid('VNODE::',JSON.stringify(vnode))

  return vnode;
}; // vnode 相关的操作

var withVNode = function withVNode(_ref20) {
  _ref20.x;
      _ref20.y;
}; // 从 link 中链接父子节点的id

var connParentChildOfLink = function connParentChildOfLink(linkdatas) {
  return function (id) {
    return linkdatas.filter(function (_ref21) {
      var dots = _ref21.vlink.dots;
      return has(dotids(dots), id);
    }).reduce(function (memo, link) {
      var dots = link.vlink.dots;
      var ids = dotids(dots);
      var index = ids.indexOf(id); // logmid('VNODE::',{ dots, ids }, ids.indexOf(id), index)

      var prev = ids[index - 1];
      var next = ids[index + 1]; // logmid('VNODE::',{ id, parent, child })

      if (!isUnDef(prev)) {
        memo.prevs.push(prev);
      }

      if (!isUnDef(next)) {
        memo.nexts.push(next);
      }

      return memo;
    }, {
      prevs: [],
      nexts: []
    });
  };
}; // 合并vdata数据

var vdataMerge = function vdataMerge(vdatas) {
  var _vdatas$reduce = vdatas.reduce(function (memo, _ref22) {
    var vlinks = _ref22.vlinks,
        vnodes = _ref22.vnodes;
    vlinks.forEach(function (vlink) {
      var dots = vlink.dots;
      var id = dotidstr(dots);
      if (has(memo.ids, id)) return;
      memo.vlinks.push(vlink); // const { pid, cid } = vlink
      // const id = `${pid}-${cid}`
      // if (has(memo.ids, id)) return
      // memo.vlinks.push(vlink)
      // memo.ids.push(id)
    });
    vnodes.forEach(function (vnode) {
      var id = vnode.id;
      if (has(memo.ids, id)) return;
      memo.vnodes.push(vnode);
      memo.ids.push(id);
    });
    return memo;
  }, {
    vlinks: [],
    vnodes: [],
    ids: []
  }),
      vlinks = _vdatas$reduce.vlinks,
      vnodes = _vdatas$reduce.vnodes; //logmid('VNODE::',{ vlinks, vnodes })


  return {
    vlinks: vlinks,
    vnodes: vnodes
  };
}; // 添加节点

var linkOfParent = function linkOfParent(parent, child, id) {
  child.vnode.id = id;
  child.vnode.x = parent.vnode.x;
  child.vnode.y = parent.vnode.y + 160;
  return [parent.vnode, child.vnode, {
    type: 'solid',
    pid: parent.vnode.id,
    cid: child.vnode.id
  }];
};

var groupOfParent = function groupOfParent(parent, child, id) {
  parent.vnode.cids.push(id);
  child.vnode.id = id;
  child.vnode.x = parent.vnode.x + 10;
  child.vnode.y = parent.vnode.y + 10;
  child.vnode.gid = parent.vnode.id;
  return [child.vnode];
};

var addVnodesOfParent = function addVnodesOfParent(parent, child, id) {
  var models = isgroup(parent.vnode.type) ? groupOfParent(parent, child, id) : linkOfParent(parent, child, id);
  return deserializeData(models);
};

var isscaled = function isscaled(ratio) {
  return ratio != 1;
}; // 保存数据


var debounceStoreData = debounce(function (fn) {
  storeData(fn());
}, 500);
var debounceRemoteSave = debounce(function (uid) {
  remoteStageUpdate([{
    entityUid: uid
  }]);
}, 60000);
var storeData = function storeData(_ref23) {
  var uid = _ref23.uid,
      parent = _ref23.parent,
      title = _ref23.title,
      data = _ref23.data,
      view = _ref23.view;
  var isforce = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // Map
  // logmid('VNODE::','------- store data -------')
  // logmid('VNODE::',{ data ,view})
  if (data.size == 0) return;
  var blocks = [],
      links = [];
  data.forEach(function (item) {
    var vnode = item.vnode,
        vlink = item.vlink;

    var block = _objectSpread2({}, vnode); // logmid('VNODE::',JSON.stringify(block))


    if (vnode) {
      var _d = vnode._d,
          _width = vnode._width,
          _height = vnode._height,
          ratio = vnode.ratio,
          cids = vnode.cids; // logmid('VNODE::',isUnDef(width), { width })

      {
        // 同步真实数据
        if (isDef$1(_d) && isscaled(ratio)) block.d = round(_d * ratio);
        if (isDef$1(_width) && isscaled(ratio)) block.width = round(_width * ratio);
        if (isDef$1(_width) && isscaled(ratio)) block.height = round(_height * ratio);
        if (isDef$1(cids)) block.cids = cidUnParse(cids);
      }
      {
        // 清除无效属性
        delete block.isview;
        delete block.ratio;

        if (isDef$1(block.d)) {
          delete block.width;
          delete block.height;
          delete block._d;
        }

        if (isDef$1(block.width)) {
          block.width = +block.width;
          block.height = +block.height;
          delete block.d;
          delete block._width;
          delete block._height;
        }

        if (isDef$1(block.g)) {
          delete block.g;
        }

        if (isDef$1(block.show) && block.show == 0) {
          delete block.show;
        }

        if (isend(block.type)) {
          delete block.bd;
          delete block.fz;
          delete block.d;
        }
      }
      blocks.push(block);
    }

    if (vlink) {
      var type = vlink.type;
          vlink.pid;
          vlink.cid;
          var dots = vlink.dots;
      links.push({
        type: type,
        dots: dotidstr(dots)
      }); // links.push({ type, pid, cid })
    }
  }); // logmid('VNODE::',{ blocks, links }, blocks.concat(links))

  var points = blocks.concat(links);

  var _view$get = view.get(),
      x = _view$get.x,
      y = _view$get.y,
      width = _view$get.width,
      height = _view$get.height,
      _view$get$window = _view$get.window,
      scale = _view$get$window.scale,
      isshowside = _view$get$window.isshowside;

  var storedata = {
    view: {
      x: x,
      y: y,
      width: width,
      height: height,
      scale: scale(1)[0],
      isshowside: isshowside
    },
    points: points
  };
  var chardata = JSON.stringify(storedata); // 接口结束，临时存储
  // logmid('VNODE::', 'diff all:', diff.local(diff.serialize(chardata, { parent, title })))

  if (diff.local(diff.serialize(chardata, {
    parent: parent,
    title: title
  }))) {
    // 本地存储
    logmid('VNODE::', '---------- local store --------');
    local.set(JSON.stringify({
      uid: uid,
      parent: parent,
      title: title,
      data: storedata
    }));
  }

  if (isforce || diff.indexddb(diff.serialize(JSON.stringify(points), {
    parent: parent,
    title: title
  }))) {
    //logmid('VNODE::','---------- indexddb store --------')
    logmid('STAGE_LIFE::save:', {
      uid: uid,
      parent: parent,
      title: title
    });
    db_node.send({
      uid: uid,
      parent: parent,
      title: title,
      data: chardata
    });
    db_stage.send({
      uid: uid,
      parent: parent,
      title: title,
      data: chardata
    });
    debounceRemoteSave(uid);
  }

  return points;
}; // TODO:: 简单比较, 要存储数据的差异

var diffGen = function diffGen(_local, _all, _indexddb) {
  return {
    local: function local(val) {
      if (_local == val) return;
      return _local = undef(_local, val);
    },
    indexddb: function indexddb(val) {
      //logmid('VNODE::',{ indexddb, val })
      if (_indexddb == val) return;
      return _indexddb = undef(_indexddb, val);
    },
    all: function all(val) {
      if (_all == val) return;
      return _all = undef(_all, val);
    },
    serialize: function serialize(data, values) {
      values = values ? Object.values(values).join('-') : '';
      return "".concat(data).concat(values).replace(/\s*/g, ''); // return data.map((b) => Object.values(b).join('-')).join(',')
    }
  };
};

var diff = diffGen();

var createMData = function createMData() {
  var mdata = new Map(),
      uid = 0;
  mdata.GC = new GC();

  var accuid = function accuid() {
    // console.log({ uid })
    return ++uid;
  };

  var mdatahas = function mdatahas(id) {
    return mdata.has(id);
  };

  var mdataval = function mdataval(id) {
    return mdata.get(id);
  };

  var mdatavals = function mdatavals() {
    return _toConsumableArray(mdata.values());
  };

  var mdatafilter = function mdatafilter(ids) {
    return [].concat(ids).filter(function (id) {
      return mdatahas(id);
    });
  }; // FP 可合并


  var mdataFilterVal = function mdataFilterVal(ids) {
    return mdatafilter(ids).map(function (id) {
      return mdataval(id);
    });
  };

  var mdataFilterNode = function mdataFilterNode(ids) {
    return mdatafilter(ids).map(function (id) {
      return mdataval(id).node;
    });
  };

  var mdataFilterVNode = function mdataFilterVNode(ids) {
    return mdatafilter(ids).map(function (id) {
      return mdataval(id).vnode;
    });
  }; // const mdataFilterHasKey = (ids) => mdatakeys().filter(isString).filter((keyid) => { [].concat(ids).filter((id) => mdatakeyhas(keyid, id)).length })


  var mdataNodeDatas = function mdataNodeDatas() {
    return mdatavals().filter(function (_ref) {
      var vnode = _ref.vnode;
      return !isUnDef(vnode);
    });
  };

  var mdataLinkDatas = function mdataLinkDatas() {
    return mdatavals().filter(function (_ref2) {
      var vlink = _ref2.vlink;
      return !isUnDef(vlink);
    });
  };

  var mdataVNodes = function mdataVNodes() {
    return mdataNodeDatas().map(function (_ref3) {
      var vnode = _ref3.vnode;
      return vnode;
    });
  };

  var mdataNodeDataParents = function mdataNodeDataParents(id) {
    return mdataNodeDatas().filter(function (_ref4) {
      var nexts = _ref4.nexts;
      return has(nexts, id);
    });
  };

  var filterLinkVNodes = function filterLinkVNodes() {
    for (var _len = arguments.length, ids = new Array(_len), _key = 0; _key < _len; _key++) {
      ids[_key] = arguments[_key];
    }

    return mdataLinkDatas().filter(function (_ref5) {
      var dots = _ref5.vlink.dots;
      return has(dotids(dots), ids);
    });
  };

  var ishoverNode = function ishoverNode(ishover) {
    return function (_ref6) {
      var vnode = _ref6.vnode;
      return !ishover || isend(vnode.type) || isdot(vnode.type);
    };
  }; // 目标点是否在节点元素内


  var mdataFilterVNodeWithBox = function mdataFilterVNodeWithBox(ishover) {
    return function (tx, ty) {
      var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      // console.log({ tx, ty })
      return mdataNodeDatas().filter(ishoverNode(ishover)).filter(function (_ref7) {
        var vnode = _ref7.vnode;

        var _boxtrbl = boxtrbl(vnode),
            id = _boxtrbl.id,
            top = _boxtrbl.top,
            right = _boxtrbl.right,
            bottom = _boxtrbl.bottom,
            left = _boxtrbl.left; // logmid('NODE_SELECT::type:', vnode.type)


        if (tx < left / scale) return false;
        if (tx > right / scale) return false;
        if (ty < top / scale) return false;
        if (ty > bottom / scale) return false;
        logmid('NODE_SELECT::mdataFilterVNodeWithBox:', {
          id: id
        });
        return true;
      }).map(function (_ref8) {
        var vnode = _ref8.vnode;
        return vnode;
      }).sort(boxdesc);
    };
  };

  var endadd = function endadd(vnode, endid) {
    vnode.ends = vnode.ends || [];
    if (has(vnode.ends, endid)) return;
    vnode.ends.push(endid);
  };

  var endpatch = function endpatch(vnode) {
    var id = vnode.id,
        attach = vnode.attach;
    if (isUnDef(mdata.get(attach))) return true; // console.log({ vnode }, mdata.get(attach))

    if (isUnDef(mdata.get(attach).ends)) {
      mdata.get(attach).ends = [id];
    } else if (!has(mdata.get(attach).ends, id)) {
      mdata.get(attach).ends.push(id);
    } // console.log(mdata.get(attach).ends)

  }; // 配对数据


  var mdataset = function mdataset(nodedatas, linkdatas) {
    nodedatas.forEach(function (block) {
      var vnode = block.vnode,
          node = block.node;
      var id = vnode.id,
          type = vnode.type;
      if (isend(type) && endpatch(vnode)) return;
      if (uid < id) uid = id; // 设置最小值

      node.id = id; // 转移部分属性到node

      node.type = type;
      withVNode(vnode);
      mdata.set(id, _objectSpread2(_objectSpread2({}, connParentChildOfLink(linkdatas)(vnode.id)), {}, {
        vnode: vnode,
        node: node
      }));
    }); // console.log({ linkdatas })

    linkdatas.forEach(function (link) {
      var vlink = link.vlink,
          node = link.node;
      var dots = vlink.dots,
          head = vlink.head,
          tail = vlink.tail;
      if (!dots.length) return; // console.log({ dots, head, tail })

      mdata.set("".concat(head, "-").concat(tail), {
        vlink: vlink,
        node: node
      });
    }); // console.log({ mdata })

    return mdata;
  }; // 更新链表中的prev next


  var updateLinkPrev = function updateLinkPrev(id) {
    return function (_ref9) {
      var prevs = _ref9.prevs,
          nexts = _ref9.nexts;
      mdataFilterVal(prevs).forEach(function (prev) {
        var _prev$nexts$filter;

        prev.nexts = (_prev$nexts$filter = prev.nexts.filter(function (nextid) {
          return nextid != id;
        })).concat.apply(_prev$nexts$filter, _toConsumableArray(nexts)); // 链表
      });
    };
  };

  var updateLinkNext = function updateLinkNext(id) {
    return function (_ref10) {
      var nexts = _ref10.nexts,
          prevs = _ref10.prevs;
      mdataFilterVal(nexts).forEach(function (next) {
        var _next$prevs$filter;

        next.prevs = (_next$prevs$filter = next.prevs.filter(function (previd) {
          return previd != id;
        })).concat.apply(_next$prevs$filter, _toConsumableArray(prevs)); // 链表
      });
    };
  };

  var linkDel = function linkDel(links) {
    links.forEach(function (_ref11) {
      var _ref11$vlink = _ref11.vlink,
          head = _ref11$vlink.head,
          tail = _ref11$vlink.tail,
          dots = _ref11$vlink.dots,
          node = _ref11.node;
      // console.log({ dots })
      dotids(dots).forEach(function (dotid) {
        // console.log({ dotid })
        var _mdata$get = mdata.get(dotid),
            vnode = _mdata$get.vnode,
            node = _mdata$get.node;

        if (isdot(vnode.type)) {
          node.remove();
          mdata["delete"](dotid);
        }
      });
      node.remove();
      mdata["delete"]("".concat(head, "-").concat(tail));
    });
  };

  var mdatadelOfDot = function mdatadelOfDot(_ref12) {
    var type = _ref12.type,
        id = _ref12.id,
        prevs = _ref12.prevs,
        nexts = _ref12.nexts;

    // 删除的点非dot
    if (!isdot(type)) {
      // 非端点 not head and not tail
      console.log({
        prevs: prevs,
        nexts: nexts
      });
      updateLinkPrev(id)({
        prevs: prevs,
        nexts: []
      });
      updateLinkNext(id)({
        nexts: nexts,
        prevs: []
      });
      linkDel(filterLinkVNodes(id));
      console.log({
        mdata: mdata
      });
      return;
    } // 删除的点是dot


    updateLinkPrev(id)({
      prevs: prevs,
      nexts: nexts
    });
    updateLinkNext(id)({
      prevs: prevs,
      nexts: nexts
    }); // 删除 link 节点

    filterLinkVNodes(id).forEach(function (_ref13) {
      var vlink = _ref13.vlink,
          node = _ref13.node;
      vlink.dots = vlink.dots.filter(function (_ref14) {
        var i = _ref14.id;
        return i != id;
      }); // console.log('vlink.dots::', dotids(vlink.dots), mdataFilterVNode(dotids(vlink.dots)))

      node.move(linecoordMulti(mdataFilterVNode(dotids(vlink.dots))));
    });
    console.log({
      mdata: mdata
    });
  };

  var mdatadel = function mdatadel(nodedata) {
    var parents = nodedata.parents,
        children = nodedata.children,
        ends = nodedata.ends,
        prevs = nodedata.prevs,
        nexts = nodedata.nexts,
        _nodedata$vnode = nodedata.vnode,
        type = _nodedata$vnode.type,
        id = _nodedata$vnode.id,
        gid = _nodedata$vnode.gid,
        cids = _nodedata$vnode.cids,
        attach = _nodedata$vnode.attach,
        node = nodedata.node; // console.log({ parents, children, vnode, node })

    mdatadelOfDot({
      type: type,
      id: id,
      prevs: prevs,
      nexts: nexts,
      parents: parents,
      children: children
    });
    mdatadelOfGroup({
      id: id,
      gid: gid,
      cids: cids
    }); // 删除 node 节点

    node.remove(); // mdataFilterNode(mdataFilterHasKey(vnode.id)).forEach((node) => node.remove())
    // 删除 map 中的数据

    if (mdata.has(id)) mdata["delete"](id); // 清除ends

    if (!isUnDef(ends)) {
      ends.forEach(function (id) {
        return mdata["delete"](id);
      });
      mdataFilterNode(ends).forEach(function (node) {
        return node.remove();
      });
    } // 删除 attach end


    {
      if (isUnDef(attach)) return; // console.log(mdataval(attach))

      if (mdataval(attach)) {
        var _mdataval2 = mdataval(attach),
            _ends = _mdataval2.ends;

        mdataval(attach).ends.splice(_ends.indexOf(id), 1);
      } // console.log({ mdata })

    }
  }; // mdata 添加节点时修补 ,划线时传入的节点个数比新画的节点少


  var mdataPatch = function mdataPatch(vnodes, _ref15) {
    var nodedatas = _ref15.nodedatas,
        linkdatas = _ref15.linkdatas;
    updateGroupVNode(vnodes); // console.log({ vnodes, nodedatas, linkdatas })
    // 编辑icon映射

    if (vnodes.length == nodedatas.length) return [nodedatas, linkdatas]; // 非新增

    var newids = nodedatas.map(function (_ref16) {
      var id = _ref16.vnode.id;
      return id;
    }); // 新增的(刚画的)block id

    var oldids = vnodes.filter(function (_ref17) {
      var id = _ref17.id;
      return newids.indexOf(id) == -1;
    }).map(function (_ref18) {
      var id = _ref18.id;
      return id;
    }); // 已存在block id

    var oldNodeDatas = mdataFilterVal(oldids);
    oldNodeDatas.forEach(function (nodedata) {
      // 添加时有一个父节点, 更新父节点的关联
      var _connParentChildOfLin = connParentChildOfLink(linkdatas)(nodedata.vnode.id),
          prevs = _connParentChildOfLin.prevs,
          nexts = _connParentChildOfLin.nexts;

      nodedata.nexts = nodedata.nexts.concat(nexts);
      nodedata.prevs = nodedata.prevs.concat(prevs);
    }); // console.log({ nodedatas, linkdatas })

    return [nodedatas, linkdatas];
  };

  var stepXY = function stepXY(_ref19) {
    var headVNode = _ref19.headVNode,
        tailVNode = _ref19.tailVNode,
        len = _ref19.len;

    var _boxcxy = boxcxy(headVNode),
        startX = _boxcxy.cx,
        startY = _boxcxy.cy;

    var _boxcxy2 = boxcxy(tailVNode),
        endX = _boxcxy2.cx,
        endY = _boxcxy2.cy;

    console.log({
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY
    });
    var stepX = stepval(endX - startX, len - 1);
    var stepY = stepval(endY - startY, len - 1);
    console.log({
      stepX: stepX,
      stepY: stepY
    });
    return {
      baseX: startX,
      baseY: startY,
      stepX: stepX,
      stepY: stepY
    };
  };

  var toLink = function toLink(_ref20) {
    var idgroup = _ref20.idgroup,
        type = _ref20.type;
    var vdata = idgroup.map(function (ids) {
      // dotids
      var _ref21 = [head(ids), tail(ids)],
          h = _ref21[0],
          t = _ref21[1];
      console.log({
        h: h,
        t: t
      });
      if (isUnDef(h) || isUnDef(t)) return;
      var len = ids.length;

      var _mdataFilterVNode = mdataFilterVNode([h, t]),
          _mdataFilterVNode2 = _slicedToArray(_mdataFilterVNode, 2),
          headVNode = _mdataFilterVNode2[0],
          tailVNode = _mdataFilterVNode2[1];

      console.log({
        headVNode: headVNode,
        tailVNode: tailVNode
      }); // const { cx: baseX, cy: baseY } = boxcxy(headVNode)
      // const stepX = stepval(tailVNode.x - baseX, len - 1)
      // const stepY = stepval(tailVNode.y - baseY, len - 1)

      var _stepXY = stepXY({
        headVNode: headVNode,
        tailVNode: tailVNode,
        len: len
      }),
          baseX = _stepXY.baseX,
          baseY = _stepXY.baseY,
          stepX = _stepXY.stepX,
          stepY = _stepXY.stepY;

      var dotVNodes = Array(len - 2).fill(null).map(function (_, i) {
        return {
          type: 'dot',
          x: baseX + (i + 1) * stepX - 6,
          y: baseY + (i + 1) * stepY - 3,
          id: accuid(),
          gid: headVNode.gid
        };
      }); // console.log({ dotVNodes })
      // updateGroupVNode()

      var dots = [headVNode.id].concat(_toConsumableArray(dotVNodes.map(pickv('id'))), [tailVNode.id]).join('-');
      console.log({
        dots: dots,
        dotVNodes: dotVNodes
      });
      return deserializeData([headVNode, tailVNode].concat(_toConsumableArray(dotVNodes), [{
        type: type,
        dots: dots
      }]));
    }); // console.log({ vdata }, vdataMerge([...vdata]))

    return vdataMerge(_toConsumableArray(vdata));
  }; // 断开


  var unlink = function unlink(_ref22) {
    var idgroup = _ref22.idgroup;
        _ref22.type;
    // console.log({ idgroup })
    idgroup.forEach(function (ids) {
      var _ref23 = [head(ids), tail(ids)],
          h = _ref23[0],
          t = _ref23[1];
      var links = filterLinkVNodes(h, t); // console.log({ links })

      if (links.length == 0) return;
      links.forEach(function (link) {
        var headNext = next(dotids(link.vlink.dots), h);
        var tailPrev = prev(dotids(link.vlink.dots), t); // console.log({ headNext, tailPrev })

        if (headNext) updateLinkPrev(headNext)({
          prevs: mdataval(headNext).prevs,
          nexts: []
        });
        if (tailPrev) updateLinkNext(tailPrev)({
          nexts: mdataval(tailPrev).nexts,
          prevs: []
        });
      });
      linkDel(links);
    }); // console.log({ mdata })
  }; // 连接, 断开 link and unlink demo is [[id1,id2],[id5,id9]]


  var updateLinkNodes = function updateLinkNodes(_ref24) {
    var idgroup = _ref24.idgroup,
        type = _ref24.type;
    // console.log({type, idgroup })
    unlink({
      idgroup: idgroup
    }); // 先清除

    if (islink(type)) return toLink({
      idgroup: idgroup,
      type: type
    }); // if (!islink(type)) {}
  };

  var boxOfVNodes = function boxOfVNodes(vnodes) {
    var _vnodes$map$reduce = vnodes.map(boxtrbl).reduce(function (memo, _ref25) {
      var left = _ref25.left,
          right = _ref25.right,
          top = _ref25.top,
          bottom = _ref25.bottom;
      memo.ls.push(left);
      memo.rs.push(right);
      memo.ts.push(top);
      memo.bs.push(bottom);
      return memo;
    }, {
      ls: [],
      rs: [],
      ts: [],
      bs: []
    }),
        ls = _vnodes$map$reduce.ls,
        rs = _vnodes$map$reduce.rs,
        ts = _vnodes$map$reduce.ts,
        bs = _vnodes$map$reduce.bs;

    return {
      left: min(ls),
      top: min(ts),
      right: max(rs),
      bottom: max(bs)
    };
  }; // 拷贝节点数据


  var copyVNode = function copyVNode(id) {
    return function (vnode) {
      var y = vnode.y;
      return _objectSpread2(_objectSpread2({}, vnode), {}, {
        id: id,
        y: y + 20
      });
    };
  };

  var copyVNodes = function copyVNodes(nodedatas) {
    return nodedatas.map(function (_ref26) {
      var vnode = _ref26.vnode;
      return copyVNode(accuid())(vnode);
    });
  };

  var copyGVNodesByID = function copyGVNodesByID(ids) {
    // 一组,  非多组
    var vnodes = mdataFilterVNode(ids).map(function (vnode) {
      return copyVNode(accuid())(vnode);
    });
    var gvnode = vnodes.filter(function (_ref27) {
      var cids = _ref27.cids;
      return !isUnDef(cids);
    })[0];
    var nonGvnode = vnodes.filter(function (_ref28) {
      var cids = _ref28.cids;
      return isUnDef(cids);
    });
    gvnode.cids = nonGvnode.map(function (_ref29) {
      var id = _ref29.id;
      return id;
    });
    nonGvnode.forEach(function (vnode) {
      return vnode.gid = gvnode.id;
    });
    return [gvnode].concat(_toConsumableArray(nonGvnode));
  };


  var updateGroupVNode = function updateGroupVNode(vnodes) {
    if (mdata.size == 0) return; // 找到需要更新的gid组, vnodes 里可能存在多个组

    var gcids = vnodes.filter(function (_ref31) {
      var gid = _ref31.gid;
      return !isUnDef(gid);
    }).reduce(function (memo, _ref32) {
      var gid = _ref32.gid,
          id = _ref32.id;
      if (isUnDef(memo[gid])) memo[gid] = [];
      memo[gid].push(id);
      return memo;
    }, {}); // console.log({ gcids })

    Object.keys(gcids).forEach(function (gid) {
      // 节点在组内,更新组
      var cids = gcids[gid];
      if (isUnDef(mdataval(Number(gid)))) return;
      var vnode = mdataval(Number(gid)).vnode;
      vnode.cids = union(vnode.cids, cids);
    });
  }; // 删除group相关


  var mdatadelOfGroup = function mdatadelOfGroup(_ref33) {
    var id = _ref33.id,
        gid = _ref33.gid,
        cids = _ref33.cids;

    if (!isUnDef(gid) && mdatahas(gid)) {
      // 清除group中的当前节点id
      var _cids = mdataval(gid).vnode.cids.filter(function (cid) {
        return cid != id;
      });

      if (_cids.length) {
        mdataval(gid).vnode.cids = _cids;
      } else {
        // TODO:: 全部删除, 需要清除group节点
        mdatadel(mdataval(gid));
      }
    }

    if (!isUnDef(cids)) {
      mdataFilterVNode(cids).forEach(function (vnode) {
        delete vnode.gid;
      });
    }
  };

  return {
    uid: accuid,
    mdatahas: mdatahas,
    mdataNodeDatas: mdataNodeDatas,
    mdataVNodes: mdataVNodes,
    mdatavals: mdatavals,
    mdataval: mdataval,
    mdataFilterVal: mdataFilterVal,
    mdataFilterNode: mdataFilterNode,
    mdataFilterVNode: mdataFilterVNode,
    mdataset: mdataset,
    mdatadel: mdatadel,
    mdataNodeDataParents: mdataNodeDataParents,
    endadd: endadd,
    boxOfVNodes: boxOfVNodes,
    copyVNodes: copyVNodes,
    copyGVNodesByID: copyGVNodesByID,
    updateGroupVNode: updateGroupVNode,
    mdatadelOfGroup: mdatadelOfGroup,
    mdataPatch: mdataPatch,
    dotids: dotids,
    filterLinkVNodes: filterLinkVNodes,
    updateLinkNodes: updateLinkNodes,
    mdataFilterVNodeWithBox: mdataFilterVNodeWithBox,
    clear: function clear() {
      mdatavals().forEach(function (_ref34) {
        var node = _ref34.node;
        // console.log('node remove:', node)
        node.remove();
      });
      mdata.clear(); // mdata = null
    }
  };
};

var _UPDATE;
var UPDATE = (_UPDATE = {
  ARTICLE: 1,
  ARTICLE_RENDER: 2,
  BACKGROUND: 3,
  TEXT: 4,
  LINK: 5,
  SIZE: 6,
  FONT_SIZE: 7,
  ALIGN_H: 8,
  ALIGN_V: 9,
  BORDER: 10,
  COLOR: 11,
  STAGE: 12
}, _defineProperty(_UPDATE, "ARTICLE", 13), _defineProperty(_UPDATE, "SHOW", 14), _UPDATE);
var createUpdate = function createUpdate(_ref) {
  var mdata = _ref.mdata,
      focusids = _ref.focusids,
      viewboxScale = _ref.viewboxScale,
      defleft = _ref.defleft,
      deftop = _ref.deftop;
  var mdatadel = mdata.mdatadel,
      mdatahas = mdata.mdatahas,
      mdataval = mdata.mdataval,
      mdataFilterVal = mdata.mdataFilterVal,
      mdataFilterNode = mdata.mdataFilterNode,
      mdataFilterVNode = mdata.mdataFilterVNode,
      boxOfVNodes = mdata.boxOfVNodes,
      dotids = mdata.dotids,
      filterLinkVNodes = mdata.filterLinkVNodes,
      updateLinkNodes = mdata.updateLinkNodes,
      mdataFilterVNodeWithBox = mdata.mdataFilterVNodeWithBox;

  var sortLayerOfID = function sortLayerOfID(ids) {
    return sortLayerOfVNodes(mdataFilterVNode(ids));
  };

  var sortLayerOfVNodes = function sortLayerOfVNodes(vnodes) {
    // console.log({ vnodes })
    return vnodes.map(box$1).sort(boxdesc) //.map(logmap) // 倒叙
    .map(function (_ref2) {
      var id = _ref2.id;
      return id;
    });
  }; // ishover 当前 ends 点的移入移出状态


  var boxOfNode = function boxOfNode(_ref3, _ref4) {
    var x = _ref3.x,
        y = _ref3.y;
    var left = _ref4.left,
        top = _ref4.top,
        scale = _ref4.scale,
        ishover = _ref4.ishover;
    logmid('NODE_SELECT::boxOfNode:', {
      x: x,
      y: y
    }, {
      left: left,
      top: top
    });
    var vnodes = mdataFilterVNodeWithBox(ishover)(x + left / scale, y + top / scale, scale);
    if (!vnodes.length) return; // 优先操作ends节点

    var vends = vnodes.filter(function (_ref5) {
      var type = _ref5.type;
      return isend(type);
    });

    if (vends.length) {
      return vends[0].id;
    }

    return vnodes[0].id;
  }; // 获取节点缩放后的坐标和宽高


  var boxscale = function boxscale(vnode, ratio) {
    var _box = box$1(vnode),
        x = _box.x,
        y = _box.y,
        width = _box.width,
        height = _box.height,
        _width = _box._width,
        _height = _box._height;

    var nw = _width * ratio,
        nh = _height * ratio;
    x -= (nw - width) / 2;
    y -= (nh - height) / 2;
    return {
      x: x,
      y: y,
      width: nw,
      height: nh,
      d: nw
    };
  };

  var focusNodeEach = function focusNodeEach(fn) {
    return mdataFilterNode(focusids).forEach(fn);
  };

  var mouseXYFn = function mouseXYFn() {
    var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    // 鼠标坐标相关, 按下坐标点
    var x = 0,
        y = 0;
    return {
      cache: function cache(x1, y1) {
        x = undef(x, x1);
        y = undef(y, y1);
        return {
          x: x,
          y: y
        };
      },
      scale: function scale(_ref6) {
        var x = _ref6.x,
            y = _ref6.y;

        var _viewboxScale = viewboxScale(x, y),
            _viewboxScale2 = _slicedToArray(_viewboxScale, 2),
            X = _viewboxScale2[0],
            Y = _viewboxScale2[1];

        return [X - left, Y - top];
      }
    };
  };

  var mouseXY = mouseXYFn(defleft, deftop); // 移动节点相关 ====================

  var mousemove = function mousemove(_ref7, _ref8) {
    var x = _ref7.x,
        y = _ref7.y;
    var node = _ref8.node;

    // 节点移动
    var _mouseXY$cache = mouseXY.cache(),
        prex = _mouseXY$cache.x,
        prey = _mouseXY$cache.y; // old


    var _mouseXY$cache2 = mouseXY.cache.apply(mouseXY, _toConsumableArray(mouseXY.scale({
      x: x,
      y: y
    }))),
        curx = _mouseXY$cache2.x,
        cury = _mouseXY$cache2.y; // new


    var dx = curx - prex,
        dy = cury - prey; // diff
    // console.log({ prex, prey, curx, cury ,dx, dy})
    // move({ node, dx, dy })

    moveLimit({
      node: node,
      dx: dx,
      dy: dy
    });
    moveLimit.end(); // console.log({ dx, dy })
  };

  var moveFn = function moveFn() {
    var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var moveLimit = function moveLimit(_ref9) {
      var node = _ref9.node,
          dx = _ref9.dx,
          dy = _ref9.dy;
      // if (has(ids, node.id)) return
      ids.push(node.id); // console.log('-------------', ids)
      // dxs += dx, dys += dy
      // throttleFn({ node, dx, dy }, val)
      // console.log('-------------')

      move({
        node: node,
        dx: dx,
        dy: dy
      });
    };

    moveLimit.end = function () {
      ids.length = 0;
    };

    moveLimit.GC = new GC();
    return moveLimit;
  };

  var moveLimit = moveFn();
  throttle(function (_ref10, val) {
    var node = _ref10.node;
        _ref10.dx;
        _ref10.dy;

    var _val = val(),
        dxs = _val.dxs,
        dys = _val.dys; // console.log({ dx, dy }, val())


    move({
      node: node,
      dx: dxs,
      dy: dys
    });
  }, 1000); // let vids = []
  // const moveLimit = moveObservable((start, id) => {
  // console.log({ start, id })
  // vids.push(id)
  // throttleFn(vids)
  // })
  // let ids = []

  var move = function move(_ref11) {
    var node = _ref11.node,
        dx = _ref11.dx,
        dy = _ref11.dy;

    // console.log({ ids })
    // if (has(ids, node.id)) return
    // ids.push(node.id)
    var _ref12 = mdataval(node.id) || {},
        vnode = _ref12.vnode,
        prevs = _ref12.prevs,
        nexts = _ref12.nexts,
        ends = _ref12.ends;

    if (!isUnDef(vnode.attach)) {
      // 目标为end移动点
      var _attachVNode2 = attachVNode(vnode.attach, {
        x: dx + vnode.x,
        y: dy + vnode.y
      }),
          x = _attachVNode2.x,
          y = _attachVNode2.y;

      dx = x - vnode.x, dy = y - vnode.y;
    } // console.log('相对距离::', { dx, dy })


    node.move(dx, dy); // 相对距离

    vnode.x = dx + vnode.x;
    vnode.y = dy + vnode.y; // 连线移动

    updatePathPosition({
      vnode: vnode,
      prevs: prevs,
      nexts: nexts
    });
    updateGroupPosition(vnode, {
      dx: dx,
      dy: dy
    });
    updateEndsPosition(ends, dx, dy);
    return vnode;
  }; // 缩放节点相关 ====================


  var zoomNode = function zoomNode(node, dir) {
    // 节点缩放
    var _mdataval = mdataval(node.id),
        vnode = _mdataval.vnode,
        prevs = _mdataval.prevs,
        nexts = _mdataval.nexts,
        ends = _mdataval.ends;

    var ox = vnode.x,
        oy = vnode.y;
    var ratio = vnode.ratio;
    if (dir == 'IN') ratio -= 0.1;
    if (dir == 'OUT') ratio += 0.1;
    if (ratio <= 0) return;
    ratio = round(ratio * 10) / 10;

    var _boxscale = boxscale(vnode, ratio),
        x = _boxscale.x,
        y = _boxscale.y,
        width = _boxscale.width,
        height = _boxscale.height,
        d = _boxscale.d; // console.log(JSON.stringify(vnode))


    if (!node.zoom({
      x: x,
      y: y,
      width: width,
      height: height,
      d: d
    })) return;
    vnode.ratio = ratio;
    vnode.x = x;
    vnode.y = y;
    if (iscircle(vnode.type)) vnode.d = d;

    if (isrect(vnode.type)) {
      vnode.width = width;
      vnode.height = height;
    }

    var dx = x - ox;
    var dy = y - oy;
    updatePathPosition({
      vnode: vnode,
      prevs: prevs,
      nexts: nexts
    });
    updateGroupPosition(vnode, {
      dx: dx,
      dy: dy
    });
    updateEndsPosition(ends, dx, dy);
  };

  var updateEndsPosition = function updateEndsPosition() {
    var ends = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var dx = arguments.length > 1 ? arguments[1] : undefined;
    var dy = arguments.length > 2 ? arguments[2] : undefined;
    ends.forEach(function (endid) {
      var _mdataval2 = mdataval(endid),
          node = _mdataval2.node;

      moveLimit({
        node: node,
        dx: dx,
        dy: dy
      });
    });
  }; // 更新组中节点存储的坐标信息


  var cacheIds = new Map();

  var updateGroupPosition = function updateGroupPosition(_ref13) {
    var id = _ref13.id,
        cids = _ref13.cids,
        gid = _ref13.gid;

    var _ref14 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        dx = _ref14.dx,
        dy = _ref14.dy;

    if (!isUnDef(cids) && (dx != 0 || dy != 0)) {
      // group 子数据更新
      cacheIds.set(id, true);
      mdataFilterVal(cids).forEach(function (_ref15) {
        var node = _ref15.node;
            _ref15.vnode;
        moveLimit({
          node: node,
          dx: dx,
          dy: dy
        });
      });
      cacheIds.clear();
    } // if (!isUnDef(gid) && mdatahas(gid)) { // group 数据更新 // TODO::会出现重复调用情况move的循环,可以通过队列解决


    if (!isUnDef(gid) && mdatahas(gid) && !cacheIds.has(gid)) {
      // group 数据更新 // TODO::会出现重复调用情况move的循环,可以通过队列解决
      var gnodedata = mdataval(gid);
      var vnodes = mdataFilterVNode(gnodedata.vnode.cids); // console.log('updateGroupPosition::', { vnodes })

      if (vnodes.length == 0) {
        console.log('gnodedata.node::', gnodedata.node); // 未销毁, tag 还存在, node.focus 时重新建立

        return mdatadel(gnodedata); // return gnodedata.node.remove()
      }

      var _subToGvnode2 = subToGvnode(vnodes),
          x = _subToGvnode2.x,
          y = _subToGvnode2.y,
          width = _subToGvnode2.width,
          height = _subToGvnode2.height; // console.log('000000000000')


      gnodedata.vnode.x = x;
      gnodedata.vnode.y = y;
      gnodedata.vnode.width = width;
      gnodedata.vnode.height = height;
      gnodedata.node.resize({
        width: width,
        height: height,
        x: x,
        y: y
      }); // console.log({ x, y, width, height, cids })
    }
  };

  var subToGvnode = function subToGvnode(vnodes) {
    var cids = vnodes.filter(function (_ref16) {
      var type = _ref16.type;
      return !isend(type);
    }).map(function (_ref17) {
      var id = _ref17.id;
      return id;
    }).join(',');

    var _boxOfVNodes = boxOfVNodes(vnodes),
        left = _boxOfVNodes.left,
        right = _boxOfVNodes.right,
        top = _boxOfVNodes.top,
        bottom = _boxOfVNodes.bottom;

    return _objectSpread2({
      cids: cids
    }, padding({
      x: left,
      y: top,
      width: right - left,
      height: bottom - top
    }, 20));
  }; // 更新path链接位置


  var updatePathPosition = function updatePathPosition(_ref18) {
    var vnode = _ref18.vnode,
        prevs = _ref18.prevs,
        nexts = _ref18.nexts;
    logmid('DOT::', {
      vnode: vnode,
      prevs: prevs,
      nexts: nexts
    }); // 移动了线段上的点, 寻找出移动的两段(可以复用之前的点)

    if (isdot(vnode.type)) {
      // !=head && !=tail
      filterLinkVNodes(vnode.id).forEach(function (linkdata) {
        logmid('DOT::dots::', {
          linkdata: linkdata
        });
        var _linkdata$vlink = linkdata.vlink,
            dots = _linkdata$vlink.dots,
            head = _linkdata$vlink.head,
            tail = _linkdata$vlink.tail;
        var vnodedots = mdataFilterVNode(dotids(dots)); // console.log({ vnodedots })

        mdataval("".concat(head, "-").concat(tail)).node.move(linecoordMulti(vnodedots));
      });
      return;
    } // parents and children 存在dot, 寻找出这一段


    flatten(prevs.concat(nexts).map(function (id) {
      return filterLinkVNodes(id);
    })).forEach(function (linkdata) {
      var _linkdata$vlink2 = linkdata.vlink,
          dots = _linkdata$vlink2.dots,
          head = _linkdata$vlink2.head,
          tail = _linkdata$vlink2.tail;
      var vnodedots = mdataFilterVNode(dotids(dots)); // console.log({ head, tail })

      mdataval("".concat(head, "-").concat(tail)).node.move(linecoordMulti(vnodedots));
    }); // flatten(prevs.map((id) => filterLinkVNodes(id))).forEach((linkdata) => {
    //   const { dots, head, tail } = linkdata.vlink
    //   const vnodedots = mdataFilterVNode(dotids(dots))
    //   mdataval(`${head}-${tail}`).node.move(linecoordMulti(vnodedots))
    // })
    // flatten(nexts.map((id) => filterLinkVNodes(id))).forEach((linkdata) => {
    //   const { dots, head, tail } = linkdata.vlink
    //   const vnodedots = mdataFilterVNode(dotids(dots))
    //   mdataval(`${head}-${tail}`).node.move(linecoordMulti(vnodedots))
    // })
  }; // 依附在Node上的end坐标体系


  var attachVNode = function attachVNode(id, _ref19) {
    var x = _ref19.x,
        y = _ref19.y;

    // px,py 父级的x,y
    var _mdataval3 = mdataval(id),
        _mdataval3$vnode = _mdataval3.vnode,
        px = _mdataval3$vnode.x,
        py = _mdataval3$vnode.y,
        width = _mdataval3$vnode.width,
        height = _mdataval3$vnode.height;

    var top = py,
        right = px + width,
        bottom = py + height,
        left = px; // outside

    if (x < left) x = left;
    if (x > right) x = right;
    if (y < top) y = top;
    if (y > bottom) y = bottom; // inside

    var vs = {
      top: top,
      right: right,
      bottom: bottom,
      left: left
    };
    var ds = {
      top: Math.abs(y - top),
      right: Math.abs(x - right),
      bottom: Math.abs(y - bottom),
      left: Math.abs(x - left)
    }; // min

    var _Object$keys$reduce = Object.keys(ds).reduce(function (memo, key) {
      var val = ds[key];

      if (memo.v > val) {
        memo.v = val;
        memo.key = key;
      }

      return memo;
    }, {
      v: Infinity,
      key: ''
    }),
        key = _Object$keys$reduce.key; // console.log({ key }, vs[key])
    // fixed


    if (has(['top', 'bottom'], key)) y = vs[key];
    if (has(['left', 'right'], key)) x = vs[key];
    return {
      x: x,
      y: y
    };
  }; // t 目标, d 变化


  var nodeMoveProcess = function nodeMoveProcess(id, i, _ref20) {
    var _ref20$dx = _ref20.dx,
        dx = _ref20$dx === void 0 ? 0 : _ref20$dx,
        _ref20$dy = _ref20.dy,
        dy = _ref20$dy === void 0 ? 0 : _ref20$dy,
        tx = _ref20.tx,
        ty = _ref20.ty;
    // console.log({ tx, ty })
    var _mdataval$vnode = mdataval(id).vnode,
        x = _mdataval$vnode.x,
        y = _mdataval$vnode.y;
    if (!isUnDef(tx)) dx = tx - x;
    if (!isUnDef(ty)) dy = ty - y;
    if (dx == 0 && dy == 0) return console.log('dx,dy 无变化'); // 无变化
    // moveto({ node, dx, dy, i })

    return {
      dx: dx,
      dy: dy,
      i: i
    };
  }; // const keyMoveEnds = ({ node, dx, dy }) => ({ node, dx, dy })


  var nodeMove = function nodeMove(_ref21) {
    var dx = _ref21.dx,
        dy = _ref21.dy,
        _ref21$txyGen = _ref21.txyGen,
        txyGen = _ref21$txyGen === void 0 ? noop : _ref21$txyGen;
    // Promise.resolve().then(() => {
    focusNodeEach(function (node, i) {
      var diff = nodeMoveProcess(node.id, i, _objectSpread2({
        dx: dx,
        dy: dy
      }, txyGen(i) || {}));
      if (!isUnDef(diff)) moveLimit(_objectSpread2(_objectSpread2({}, diff), {}, {
        node: node
      }));
    });
    moveLimit.end(); // })
    // mdataFilterNode(ids).forEach((node) => { node.move(dx, dy) })// 相对距离
  }; // 节点移动


  var nodeLeft = function nodeLeft(val) {
    return nodeMove({
      dx: val
    });
  };

  var nodeTop = function nodeTop(val) {
    return nodeMove({
      dy: val
    });
  };

  var nodeRight = function nodeRight(val) {
    return nodeMove({
      dx: val
    });
  };

  var nodeBottom = function nodeBottom(val) {
    return nodeMove({
      dy: val
    });
  }; // 更新对齐


  var updateAlignNodes = function updateAlignNodes(nodes, cmdval) {
    var H = cmdval.H,
        V = cmdval.V,
        defval = cmdval.val;
    var xy = nodes.map(function (_ref22) {
      var vnode = _ref22.vnode;
      return boxcxy(vnode);
    });

    var cx = function cx(_ref23) {
      var cx = _ref23.cx;
      return cx;
    },
        cy = function cy(_ref24) {
      var cy = _ref24.cy;
      return cy;
    };

    var x = function x(_ref25) {
      var x = _ref25.x;
      return x;
    },
        y = function y(_ref26) {
      var y = _ref26.y;
      return y;
    };

    var w = function w(_ref27) {
      var width = _ref27.width;
      return width;
    },
        h = function h(_ref28) {
      var height = _ref28.height;
      return height;
    };

    var val = defval || 'def';

    if (V) {
      // 垂直分布
      var vlayout = {
        def: function def() {
          var hs = xy.map(h);
          var avgy = mean(xy.map(cy));
          return function (i) {
            return {
              ty: avgy - hs[i] / 2
            };
          };
        },
        avg: function avg() {
          var hs = xy.map(h);
          var cys = avginc(xy.map(cy));
          return function (i) {
            return {
              ty: cys[i] - hs[i] / 2
            };
          };
        },
        top: function top() {
          var miny = min(xy.map(y));
          return function () {
            return {
              ty: miny
            };
          };
        },
        'top-center': function topCenter() {
          var mincy = min(xy.map(cy));
          var ys = xy.map(function (_ref29) {
            var height = _ref29.height;
            return mincy - height / 2;
          });
          return function (i) {
            return {
              ty: ys[i]
            };
          };
        },
        bottom: function bottom() {
          var maxbottom = max(xy.map(function (_ref30) {
            var y = _ref30.y,
                height = _ref30.height;
            return y + height;
          }));
          var ys = xy.map(function (_ref31) {
            var height = _ref31.height;
            return maxbottom - height;
          });
          return function (i) {
            return {
              ty: ys[i]
            };
          };
        },
        'bottom-center': function bottomCenter() {
          var maxcy = max(xy.map(cy));
          var ys = xy.map(function (_ref32) {
            var height = _ref32.height;
            return maxcy - height / 2;
          });
          return function (i) {
            return {
              ty: ys[i]
            };
          };
        }
      };
      nodeMove({
        txyGen: vlayout[val] && vlayout[val]()
      });
    }

    if (H) {
      // 水平分布,  中心点 +- 宽度
      var hlayout = {
        def: function def() {
          // 默认元素居中
          var ws = xy.map(w);
          var avgx = mean(xy.map(cx));
          return function (i) {
            return {
              tx: avgx - ws[i] / 2
            };
          };
        },
        avg: function avg() {
          var ws = xy.map(w);
          var cxs = avginc(xy.map(cx));
          return function (i) {
            return {
              tx: cxs[i] - ws[i] / 2
            };
          };
        },
        left: function left() {
          var minx = min(xy.map(x));
          return function () {
            return {
              tx: minx
            };
          };
        },
        'left-center': function leftCenter() {
          var mincx = min(xy.map(cx));
          var xs = xy.map(function (_ref33) {
            var width = _ref33.width;
            return mincx - width / 2;
          });
          return function (i) {
            return {
              tx: xs[i]
            };
          };
        },
        right: function right() {
          logmid('NODE_UPDATE::', xy.map(function (_ref34) {
            var x = _ref34.x,
                width = _ref34.width;
            return x + width;
          }));
          var maxright = max(xy.map(function (_ref35) {
            var x = _ref35.x,
                width = _ref35.width;
            return x + width;
          }));
          var xs = xy.map(function (_ref36) {
            var width = _ref36.width;
            return maxright - width;
          });
          return function (i) {
            return {
              tx: xs[i]
            };
          };
        },
        'right-center': function rightCenter() {
          var maxcx = max(xy.map(cx));
          var xs = xy.map(function (_ref37) {
            var width = _ref37.width;
            return maxcx - width / 2;
          });
          return function (i) {
            return {
              tx: xs[i]
            };
          };
        }
      };
      nodeMove({
        txyGen: hlayout[val] && hlayout[val]()
      });
    }
  }; // 通过指令::更新节点 ====================


  var updateNode = function updateNode(_ref38, _ref39) {
    var node = _ref38.node,
        vnode = _ref38.vnode,
        prevs = _ref38.prevs,
        nexts = _ref38.nexts;
    var cmdtype = _ref39.type,
        cmdval = _ref39.val;
    var type = vnode.type,
        width = vnode.width,
        height = vnode.height,
        d = vnode.d;
        vnode.x;
        vnode.y;
    var actions = {
      txt: function txt(_txt) {
        return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          var _node$box2, _x, _y, _width2, _height2;

          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                if (!(_txt == vnode.txt)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                vnode.txt = node.txt(_txt, {
                  width: width,
                  height: height,
                  d: d
                });

                if (!(vnode.type == 'normal')) {
                  _context.next = 22;
                  break;
                }

                _context.t0 = node;
                _context.t1 = _objectSpread2;
                _context.t2 = {
                  x: vnode.x,
                  y: vnode.y
                };
                _context.next = 9;
                return node.textsize();

              case 9:
                _context.t3 = _context.sent;
                _context.t4 = (0, _context.t1)(_context.t2, _context.t3);
                _node$box2 = _context.t0.box.call(_context.t0, _context.t4);
                _x = _node$box2.x;
                _y = _node$box2.y;
                _width2 = _node$box2.width;
                _height2 = _node$box2.height;

                if (node.resize({
                  x: _x,
                  y: _y,
                  width: _width2,
                  height: _height2
                })) {
                  _context.next = 18;
                  break;
                }

                return _context.abrupt("return");

              case 18:
                vnode.x = _x;
                vnode.y = _y;
                vnode.width = vnode._width = _width2;
                vnode.height = vnode._height = _height2;

              case 22:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }))();
      },
      bg: function bg(color) {
        vnode.bg = node.bg(color);
      },
      size: function size(sizeFn) {
        return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
          var parseval, auto, scale, v;
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                parseval = sizeFn(type); // console.log({ parseval })

                if (parseval) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                auto = /*#__PURE__*/function () {
                  var _ref40 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(vnode, node, parseval) {
                    var width, height, nodebox;
                    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                      while (1) switch (_context2.prev = _context2.next) {
                        case 0:
                          // 自动宽高
                          width = undef(vnode.width, parseFloat(parseval.width));
                          height = undef(vnode.height, parseFloat(parseval.height));

                          if (!(parseval !== 'auto' || !isFunc(node.textsize))) {
                            _context2.next = 4;
                            break;
                          }

                          return _context2.abrupt("return", _objectSpread2(_objectSpread2({}, vnode), {}, {
                            width: width,
                            height: height
                          }));

                        case 4:
                          _context2.t0 = node;
                          _context2.t1 = _objectSpread2;
                          _context2.t2 = {
                            x: vnode.x,
                            y: vnode.y
                          };
                          _context2.next = 9;
                          return node.textsize();

                        case 9:
                          _context2.t3 = _context2.sent;
                          _context2.t4 = (0, _context2.t1)(_context2.t2, _context2.t3);
                          nodebox = _context2.t0.box.call(_context2.t0, _context2.t4);
                          return _context2.abrupt("return", _objectSpread2(_objectSpread2({}, vnode), nodebox));

                        case 13:
                        case "end":
                          return _context2.stop();
                      }
                    }, _callee2);
                  }));

                  return function auto(_x2, _x3, _x4) {
                    return _ref40.apply(this, arguments);
                  };
                }();

                scale = function scale(vnode, parseval) {
                  var d = undef(vnode.d, parseFloat(parseval.d));

                  if (iscircle(vnode.type)) {
                    var ratio = d == vnode._d ? 1 : d / vnode._d;
                    return boxscale(vnode, ratio);
                  }

                  return vnode;
                };

                _context3.t0 = scale;
                _context3.next = 8;
                return auto(vnode, node, parseval);

              case 8:
                _context3.t1 = _context3.sent;
                _context3.t2 = parseval;
                v = (0, _context3.t0)(_context3.t1, _context3.t2);

                if (node.resize(v)) {
                  _context3.next = 13;
                  break;
                }

                return _context3.abrupt("return");

              case 13:
                vnode._width = vnode.width = v.width;
                vnode._height = vnode.height = v.height;
                vnode._d = vnode.d = v.d;
                vnode.x = v.x;
                vnode.y = v.y;
                vnode.ratio = 1; // console.log({ vnode })

                updatePathPosition({
                  vnode: vnode,
                  prevs: prevs,
                  nexts: nexts
                });

              case 20:
              case "end":
                return _context3.stop();
            }
          }, _callee3);
        }))();
      },
      fontsize: function fontsize(_ref41) {
        var fontsize = _ref41.fontsize;
        // console.log({ fontsize })
        node.fontsize(+fontsize);
        vnode.fz = +fontsize;
      },
      border: function border(_ref42) {
        var width = _ref42.width,
            type = _ref42.type,
            color = _ref42.color;
        // console.log({ width, type, color })
        node.border({
          width: width,
          type: type,
          color: color
        });
        vnode.bd = "".concat(width, " ").concat(type, " ").concat(color);
      },
      color: function color(_ref43) {
        var color = _ref43.color;
        node.color(color);
        vnode.c = color;
      },
      stage: function stage() {
        var stage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        stage = Number(stage);

        if (stage === 0) {
          delete vnode.stage;
          node.stage(false);
        } else {
          vnode.stage = stage;
          node.stage(true);
        }
      },
      article: function article() {
        var article = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        article = Number(article);

        if (article === 0) {
          delete vnode.article;
          node.article(false);
        } else {
          vnode.article = article;
          node.article(true);
        }
      },
      show: function show(_ref44) {
        var show = _ref44.show;

        var isshow = function isshow(show) {
          return show == 'true' ? true : false;
        };

        node.show(isshow(show));
        vnode.show = Number(isshow(show));
      }
    }; // console.log({ cmdtype, cmdval })

    actions[cmdtype](cmdval);
  };

  var update = function update(nodes, _ref45, render) {
    var type = _ref45.type,
        val = _ref45.val;

    // console.log({ type, val })
    if (type == 'align') {
      // H:avg|top|bottom, V:avg|left|right
      updateAlignNodes(nodes, val);
    } else if (type == 'link') {
      var solidlink = val.solidlink,
          dottedlink = val.dottedlink,
          unlink = val.unlink;
          val.addlink; // link group and unlink group
      // console.log({ solidlink, dottedlink, unlink, addlink })
      // !!优先删除

      if (unlink.length) updateLinkNodes({
        idgroup: unlink,
        type: 'unlink'
      });
      if (solidlink.length) render(updateLinkNodes({
        idgroup: solidlink,
        type: 'solid'
      }));
      if (dottedlink.length) render(updateLinkNodes({
        idgroup: dottedlink,
        type: 'dotted'
      })); // console.log(mdata)
    } else if (type == UPDATE.ARTICLE_RENDER) {
      // val: int || undefine
      nodes.forEach(function (_ref46) {
        var node = _ref46.node,
            vnode = _ref46.vnode;
        node.article(!isUnDef(val));
        vnode.article = val;
      }); // console.log('------ update view ------', nodes)
    } else {
      nodes.forEach(function (node) {
        return updateNode(node, {
          type: type,
          val: val
        });
      });
    }
  };

  return {
    sortLayerOfID: sortLayerOfID,
    boxOfNode: boxOfNode,
    focusNodeEach: focusNodeEach,
    subToGvnode: subToGvnode,
    mouseXY: mouseXY,
    mousemove: mousemove,
    zoomNode: zoomNode,
    nodeLeft: nodeLeft,
    nodeTop: nodeTop,
    nodeRight: nodeRight,
    nodeBottom: nodeBottom,
    updateNode: updateNode,
    updateAlignNodes: updateAlignNodes,
    update: update,
    updateGroupPosition: updateGroupPosition
  };
};

var createNode = function createNode(_ref) {
  var viewboxScale = _ref.viewboxScale,
      viewboxInfo = _ref.viewboxInfo,
      defleft = _ref.left,
      deftop = _ref.top;
  // console.log({ defleft, deftop })
  var target = null,
      hoverids = [],
      _focusids = []; // pretarget 数组, 多个节点

  var mdata = createMData();

  var _createUpdate = createUpdate({
    mdata: mdata,
    focusids: _focusids,
    viewboxScale: viewboxScale,
    defleft: defleft,
    deftop: deftop
  }),
      _update = _createUpdate.update,
      boxOfNode = _createUpdate.boxOfNode,
      focusNodeEach = _createUpdate.focusNodeEach,
      subToGvnode = _createUpdate.subToGvnode,
      mouseXY = _createUpdate.mouseXY,
      _mousemove = _createUpdate.mousemove,
      zoomNode = _createUpdate.zoomNode,
      nodeLeft = _createUpdate.nodeLeft,
      nodeTop = _createUpdate.nodeTop,
      nodeRight = _createUpdate.nodeRight,
      nodeBottom = _createUpdate.nodeBottom,
      sortLayerOfID = _createUpdate.sortLayerOfID,
      updateGroupPosition = _createUpdate.updateGroupPosition;

  var uid = mdata.uid,
      mdatahas = mdata.mdatahas,
      mdataval = mdata.mdataval;
      mdata.mdataNodeDatas;
      var mdataFilterNode = mdata.mdataFilterNode,
      mdataNodeDataParents = mdata.mdataNodeDataParents,
      mdataVNodes = mdata.mdataVNodes,
      mdatavals = mdata.mdatavals,
      mdataset = mdata.mdataset,
      mdatadel = mdata.mdatadel,
      mdataFilterVal = mdata.mdataFilterVal;
      mdata.mdataFilterVNode;
      var mdataPatch = mdata.mdataPatch;
      mdata.endadd;
      var copyVNodes = mdata.copyVNodes,
      copyGVNodesByID = mdata.copyGVNodesByID;
      mdata.updateGroupVNode;
      var boxOfVNodes = mdata.boxOfVNodes; // 选中节点

  var selectedNode = function selectedNode(node) {
    if (!node) return;
    node.focus(); // 排在最前面

    _focusids.push(node.id);
  }; // 画图 ====================


  var draw = function draw(vdata, shapeFactory) {
    // console.log({ vdata })
    var _vdata$vnodes = vdata.vnodes,
        vnodes = _vdata$vnodes === void 0 ? [] : _vdata$vnodes,
        _vdata$vlinks = vdata.vlinks,
        vlinks = _vdata$vlinks === void 0 ? [] : _vdata$vlinks;
    var linkdatas = vlinks.map(function (vlink) {
      // 画线
      // console.log({ vlink })
      var link = shapeFactory.create(vlink.type, _objectSpread2({}, vlink));
      return {
        node: link,
        vlink: vlink
      };
    }); // 点 end

    var evnodes = vnodes.filter(function (_ref2) {
      var type = _ref2.type;
      return isend(type);
    }).filter(function (_ref3) {
      var id = _ref3.id;
      return !mdatahas(id);
    }); // 组 group, 画在后面

    var filter = function filter(tid) {
      return vnodes.filter(function (_ref4) {
        var id = _ref4.id;
        return tid == id;
      })[0];
    };

    var gvnodes = vnodes.filter(function (_ref5) {
      var type = _ref5.type;
      return isgroup(type);
    }).reduce(function (memo, gvnode) {
      return memo.concat([gvnode.id].concat(gvnode.cids).map(function (id) {
        return filter(id);
      }).filter(isDef$1));
    }, []).filter(function (_ref6) {
      var id = _ref6.id;
      return !mdatahas(id);
    });
    var gcids = gvnodes.map(function (_ref7) {
      var id = _ref7.id;
      return id;
    }); // console.log({ gvnodes, gcids })
    // 非组 normal

    var nvnodes = vnodes.filter(function (_ref8) {
      var type = _ref8.type,
          id = _ref8.id,
          gid = _ref8.gid;
      if (isgroup(type)) return false;
      if (has(gcids, id)) return false; // fix bug group exist cids, cid no gid

      if (isend(type)) return false;
      if (isDef$1(gid) && !mdatahas(gid)) return false; // 初始化时 gid 还没绘制; 新增时gid已经绘制

      if (mdatahas(id)) return false; // 已绘制

      if (!shapeFactory.has(type)) return false;
      return true;
    }); // 排序,画节点, 最后画在最上面

    var nodedatas = nvnodes.concat(gvnodes, evnodes).map(function (vnode) {
      return {
        node: shapeFactory.create(vnode.type, vnode),
        vnode: vnode
      };
    });
    console.log({
      nodedatas: nodedatas,
      linkdatas: linkdatas
    });
    return {
      nodedatas: nodedatas,
      linkdatas: linkdatas
    };
  };

  var boundaryPoint = function boundaryPoint(vnodes, vnode, viewbox) {
    // 获取边界点
    // const { width: nw, height: nh } = vnode
    var _viewbox$get = viewbox.get(),
        x = _viewbox$get.x,
        y = _viewbox$get.y,
        _viewbox$get$window = _viewbox$get.window,
        width = _viewbox$get$window.width,
        height = _viewbox$get$window.height,
        scale = _viewbox$get$window.scale;

    var _scale = scale(width, height),
        _scale2 = _slicedToArray(_scale, 2),
        sw = _scale2[0],
        sh = _scale2[1]; // console.log({ width, height, w, h })


    return {
      x: x + sw / 2,
      y: y + sh / 2
    }; // const { left, top, right, bottom } = boundary(vnodes)
    // return { x: right + 200, y: top }
  };

  var ismousedown = false;
  return {
    boxOfVNodes: boxOfVNodes,
    mousedown: function mousedown() {
      ismousedown = true;
    },
    mouseup: function mouseup() {
      target = null;
      ismousedown = false;
      if (this.getfocus().some(function (_ref9) {
        var type = _ref9.vnode.type;
        return type == 'end';
      })) this.defocus();
    },
    render: function render(vdata, shape, viewbox) {
      // 画图形 修补mdata, 划线时传入的节点个数比新画的节点少
      var _mdataPatch = mdataPatch(vdata.vnodes, _objectSpread2({}, draw(vdata, shape))),
          _mdataPatch2 = _slicedToArray(_mdataPatch, 2),
          nodedatas = _mdataPatch2[0],
          linkdatas = _mdataPatch2[1]; // console.log({ nodedatas, linkdatas })


      mdataset(nodedatas, linkdatas); // console.log('mdatavals::', mdatavals())
    },
    vnodes: function vnodes(isonlyvnode) {
      // console.log(mdatavals())
      return isonlyvnode ? mdataVNodes() : mdatavals();
    },
    hover: function hover(_ref10) {
      var x = _ref10.x,
          y = _ref10.y;

      // return
      var _viewboxInfo = viewboxInfo(),
          left = _viewboxInfo.x,
          top = _viewboxInfo.y,
          scale = _viewboxInfo.window.scale; // logmid('NODE_SELECT::select:', { defleft, deftop, scale }, scale(1))


      var id = boxOfNode({
        x: x,
        y: y
      }, {
        left: left + defleft,
        top: top + deftop,
        scale: scale(1)[0],
        ishover: true
      });

      if (isUnDef(id)) {
        if (!hoverids.length || ismousedown) return;

        var _nodedata = mdataval(hoverids.pop());

        _nodedata.node.defocus();

        return;
      }

      if (hoverids.length) return;
      var nodedata = mdataval(id);
      nodedata.node.focus();
      hoverids.push(id);
    },
    select: function select(_ref11) {
      var x = _ref11.x,
          y = _ref11.y;

      var _viewboxInfo2 = viewboxInfo(),
          left = _viewboxInfo2.x,
          top = _viewboxInfo2.y,
          scale = _viewboxInfo2.window.scale;

      logmid('NODE_SELECT::select:', {
        defleft: defleft,
        deftop: deftop,
        scale: scale
      }, scale(1));
      var id = boxOfNode({
        x: x,
        y: y
      }, {
        left: left + defleft,
        top: top + deftop,
        scale: scale(1)[0],
        ishover: false
      });
      if (isUnDef(id)) return;
      this.defocus();
      var nodedata = mdataval(id);
      selectedNode(nodedata.node);
      target = nodedata.node;
      mouseXY.cache.apply(mouseXY, _toConsumableArray(mouseXY.scale({
        x: x,
        y: y
      })));
    },
    addOfParent: function addOfParent(nodes, shape, viewbox) {
      // 添加一个节点,通过parent来判定是否需要移动视图
      var parent = this.getfocus()[0];
      var child = nodes[0];
      var id = uid();
      console.log({
        nodes: nodes,
        parent: parent
      });
      var vnodes = parent ? addVnodesOfParent(parent, child, id) : {
        vnodes: [_objectSpread2(_objectSpread2({}, child.vnode), {}, {
          id: id
        }, boundaryPoint(this.vnodes(true), child.vnode, viewbox))]
      };
      console.log({
        vnodes: vnodes,
        id: id
      });
      this.render(vnodes, shape);
      this.focus([id]);
      target = null;
      return !!parent;
    },
    addEnd: function addEnd(shape) {
      var parent = this.getfocus()[0];
      if (isUnDef(parent) || parent.vnode.type != 'rect') return;
      var id = uid();
      var _parent$vnode = parent.vnode,
          x = _parent$vnode.x,
          y = _parent$vnode.y,
          height = _parent$vnode.height; // endadd(parent.vnode, id)

      var vnodes = {
        vnodes: [vnodePatch({
          type: 'end',
          id: id,
          attach: parent.vnode.id,
          x: x,
          y: y + height / 2
        })]
      }; // console.log({ vnodes })

      this.render(vnodes, shape);
      this.focus([id]);
    },
    unBindGroup: function unBindGroup(nodedatas) {
      // 解绑组
      // TODO:: 这里只实现解绑一个组内元素
      if (isUnDef(nodedatas[0])) return;
      var _nodedatas$0$vnode = nodedatas[0].vnode,
          gid = _nodedatas$0$vnode.gid,
          id = _nodedatas$0$vnode.id; // console.log({ gid, id })

      if (isUnDef(gid)) return;
      delete nodedatas[0].vnode.gid;
      var gvnode = mdataval(gid).vnode;
      gvnode.cids = gvnode.cids.filter(function (cid) {
        return cid != id;
      }); // 如果cids为空删除gvnode

      updateGroupPosition({
        gid: gid
      });
    },
    bindGroup: function bindGroup(nodedatas, shape) {
      // 并组, 创建组, 绑定组(已有组)
      // console.log({ nodedatas })
      if (nodedatas.length <= 1) return; // 当前只做单组,不出组嵌套

      var gnodedatas = nodedatas.filter(function (_ref12) {
        var cids = _ref12.vnode.cids;
        return !isUnDef(cids);
      }); // 组节点

      if (gnodedatas.length == 0) {
        // 只选中有子节点
        gnodedatas = mdataFilterVal(uniq(nodedatas.filter(function (_ref13) {
          var gid = _ref13.vnode.gid;
          return !isUnDef(gid);
        }).map(function (_ref14) {
          var gid = _ref14.vnode.gid;
          return gid;
        })));
      } // console.log({ gnodedatas })


      if (gnodedatas.length > 0) {
        var _ref16;

        // 有组
        var nonGNodedatas = nodedatas.filter(function (_ref15) {
          var cids = _ref15.vnode.cids;
          return isUnDef(cids);
        }); // 非组节点, 只选中组和选中组也选中了组内节点

        var gcids = (_ref16 = []).concat.apply(_ref16, _toConsumableArray(gnodedatas.map(function (_ref17) {
          var cids = _ref17.vnode.cids;
          return cids;
        }))); // 非组节点id


        var gnodedata = gnodedatas.pop(); // 保留一个组

        gnodedatas.forEach(mdatadel);
        var _gid = gnodedata.vnode.id;
        nonGNodedatas.forEach(function (_ref18) {
          var vnode = _ref18.vnode;
          vnode.gid = _gid;
        }); //  绑定gid

        var _cids = gnodedata.vnode.cids = uniq(gcids.concat(nonGNodedatas.map(function (_ref19) {
          var vnode = _ref19.vnode;
          return vnode.id;
        }))); // 去重
        // console.log({ gnodedata, gcids, nonGNodedatas })


        updateGroupPosition({
          gid: _gid
        }); // console.log({ cids })

        mdataFilterNode(sortLayerOfID(_cids)).forEach(function (node) {
          return node.front();
        }); // 排序

        this.focus([_gid]);
        return;
      } // createGroup


      var gid = uid(); // 新建组

      var vnodes = nodedatas.map(function (nodedata) {
        // TODO:: 已在组内的节点再次组合其它节点, 删除之前组节点的cids
        if (!isend(nodedata.vnode.type)) {
          nodedata.vnode.gid = gid;
        }

        return _objectSpread2(_objectSpread2({}, nodedata.vnode), {}, {
          gid: gid
        });
      });

      var _subToGvnode = subToGvnode(vnodes),
          x = _subToGvnode.x,
          y = _subToGvnode.y,
          width = _subToGvnode.width,
          height = _subToGvnode.height,
          cids = _subToGvnode.cids;

      var sortcids = sortLayerOfID(cidparse(cids));
      mdataFilterNode(sortcids).forEach(function (node) {
        return node.front();
      }); // 排序

      var gvnode = vnodePatch({
        type: 'group',
        show: true,
        id: gid,
        cids: cidUnParse(sortcids),
        x: x,
        y: y,
        width: width,
        height: height
      });
      this.render({
        vnodes: [gvnode]
      }, shape);
      this.focus([gid]);
    },
    addMultiNode: function addMultiNode(nodedatas, shape) {
      // 添加一组节点
      // console.log({ nodedatas })
      // return
      var gnodedatas = nodedatas.filter(function (_ref20) {
        var cids = _ref20.vnode.cids;
        return !isUnDef(cids);
      });
      var gvnodes = gnodedatas.reduce(function (memo, gnodedata) {
        var _gnodedata$vnode = gnodedata.vnode,
            cids = _gnodedata$vnode.cids,
            id = _gnodedata$vnode.id;
        return memo.concat(copyGVNodesByID(cids.concat(id)));
      }, []); // console.log({ gvnodes })

      var nonGNodedatas = nodedatas.filter(function (_ref21) {
        var cids = _ref21.vnode.cids;
        return isUnDef(cids);
      });
      var vnodes = copyVNodes(nonGNodedatas).concat(gvnodes); // console.log({ vnodes })
      // return

      this.render({
        vnodes: vnodes
      }, shape);
      var focusids = vnodes.map(function (_ref22) {
        var id = _ref22.id;
        return id;
      });
      console.log({
        focusids: focusids
      });
      this.focus(focusids);
    },
    parent: function parent(id) {
      return mdataNodeDataParents(id)[0];
    },
    update: function update(_ref23, shape) {
      var _this = this;

      var type = _ref23.type,
          val = _ref23.val;

      _update(this.getfocus(), {
        type: type,
        val: val
      }, function (vdata) {
        return _this.render(vdata, shape);
      });
    },
    remove: function remove() {
      // TODO::整合删除
      var nodedatas = this.getfocus();
      if (!nodedatas.length) return;
      nodedatas.forEach(mdatadel);
      console.log({
        nodedatas: nodedatas
      }); // 删除更新组

      var _nodedatas$reduce = nodedatas.reduce(function (memo, _ref24) {
        var _ref24$vnode = _ref24.vnode,
            gid = _ref24$vnode.gid,
            cids = _ref24$vnode.cids;
        if (isUnDef(gid) && isUnDef(cids)) return memo; // 非组

        if (!isUnDef(gid)) memo.upgids.add(gid); // 要更新的

        if (!isUnDef(cids)) memo.delgids.add(gid); // 要删除的

        return memo;
      }, {
        upgids: new Set(),
        delgids: new Set()
      }),
          upgids = _nodedatas$reduce.upgids,
          delgids = _nodedatas$reduce.delgids;

      delgids.forEach(function (gid) {
        return upgids["delete"](gid);
      });
      upgids.forEach(function (gid) {
        updateGroupPosition({
          gid: gid
        });
      });
      _focusids.length = 0;
      target = null; // console.log(mdata)
    },
    move: function move(_ref25) {
      var keyCode = _ref25.keyCode,
          shiftKey = _ref25.shiftKey;
      if (!_focusids.length) return;
      var dirval = [-10, 10, 10, -10]; // [top, right, bottom, left]

      var space = function space(v) {
        return v / 5;
      };

      var shift = function shift(v) {
        return v * 10;
      };

      if (isSpaceKeyDown) dirval = dirval.map(space);
      if (shiftKey) dirval = dirval.map(shift);
      if (isTop({
        keyCode: keyCode
      })) nodeTop(dirval[0]);
      if (isRight({
        keyCode: keyCode
      })) nodeRight(dirval[1]);
      if (isBottom({
        keyCode: keyCode
      })) nodeBottom(dirval[2]);
      if (isLeft({
        keyCode: keyCode
      })) nodeLeft(dirval[3]);
      return true;
    },
    zoom: function zoom(dir) {
      if (!_focusids.length) return;
      focusNodeEach(function (node) {
        return zoomNode(node, dir);
      });
    },
    focus: function focus(ids) {
      // 选择一个或多个
      // if (!ids.length) return
      this.defocus(); // sortLayerOfID(ids)

      ids.forEach(function (id) {
        var _mdataval = mdataval(id),
            node = _mdataval.node,
            vnode = _mdataval.vnode;

        if (isUnDef(vnode.gid)) node.front();
        selectedNode(node);
      });
      return _focusids.length;
    },
    defocus: function defocus() {
      if (!_focusids.length) return;
      focusNodeEach(function (node) {
        return node.defocus();
      });
      _focusids.length = 0;
    },
    hasfocus: function hasfocus() {
      return !!_focusids.length;
    },
    focusid: function focusid() {
      return _focusids[0];
    },
    focusids: function focusids() {
      var id = _focusids[0];
      var _mdataval$vnode = mdataval(id).vnode,
          stage = _mdataval$vnode.stage,
          article = _mdataval$vnode.article;
      return {
        id: id,
        stage: stage,
        article: article
      };
    },
    getfocus: function getfocus() {
      return mdataFilterVal(_focusids); // return focusids.map((id) => mdataval(id))
    },
    clear: function clear() {
      this.defocus();
      mdata.clear(); // this.removeNodeListener()
    },
    bind: function bind(_ref26) {// node.node.addEventListener('mousedown', mousedown)
      // node.removes = [() => node.node.removeEventListener('mousedown', mousedown)]
      // if (vnode.type != 'end') return // end point
      // const mouseenter = () => !ismousedown && node.focus()
      // const mouseleave = () => !ismousedown && node.defocus()
      // node.node.addEventListener('mouseenter', mouseenter)
      // node.node.addEventListener('mouseleave', mouseleave)
      // node.removes.push(() => node.node.removeEventListener('mouseenter', mouseenter))
      // node.removes.push(() => node.node.removeEventListener('mouseleave', mouseleave))

      _ref26.vnode;
          _ref26.node;
    },
    mousemove: function mousemove(evt) {
      if (!target) return; // console.log({ target })

      _mousemove({
        x: evt.clientX,
        y: evt.clientY
      }, {
        pool: mdata,
        node: target
      }); // console.log(JSON.stringify(vnode))

    }
  };
};

var marking = function marking(marks, nodes) {
  // console.log({ marks, nodes })
  var ismarked = true;
  return {
    marked: function marked(bool) {
      return ismarked = undef(ismarked, bool);
    },
    clear: function clear(isesc) {
      marks.clear(); // 重置标记

      if (isesc) nodes.defocus(); // 清除选中的节点
    },
    render: function render(evt) {
      var isscene = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var keyCode = evt.keyCode,
          shiftKey = evt.shiftKey; // TODO:: marks 和 tagLayer 需要聚合
      // console.log('marked:', marks.marked(), nodes.vnodes(true))

      if (!marks.marked() && isTagSearch(evt)) {
        //  显示标签
        marks.render(nodes.vnodes(true), isscene);
      } else if (marks.marked()) {
        // 根据标签选择节点
        if (isEsc(evt)) return this.clear();
        if (isEnter(evt)) return this.clear(); // console.log('letter:', nodes.focusOfMark([String.fromCharCode(keyCode + (shiftKey ? 0 : 32))]))

        if (nodes.focusOfMark([String.fromCharCode(keyCode + (shiftKey ? 0 : 32))])) this.clear(); // 选中节点

        return true;
      }
    }
  };
};
var createMark = function createMark(_ref) {
  var tag = _ref.tag,
      viewbox = _ref.viewbox;
  var txts = makeTxt();
  var ismarked = false;
  return {
    marked: function marked(bool) {
      return ismarked = undef(ismarked, bool);
    },
    render: function render(vnodes, isscene) {
      if (this.marked()) return; // console.log({ vnodes })

      var boundary = curViewBoundary(viewbox.get());
      var sortvnodes = [].concat(_toConsumableArray(vnodes.filter(function (_ref2) {
        var type = _ref2.type;
        return !isgroup(type);
      })), _toConsumableArray(vnodes.filter(function (_ref3) {
        var type = _ref3.type;
        return isgroup(type);
      }))); // TODO:: 筛选出重叠的元素

      var tagvnodes = sortvnodes.filter(function (_ref4) {
        var x = _ref4.x,
            y = _ref4.y;
        return !boundary.isInViewbox(x, y);
      }); // console.log({ tagvnodes })

      if (!tagvnodes.length) return;
      this.marked(true);
      var ratio = viewbox.get().window.scale([1])[0];
      Promise.resolve().then(function () {
        // requestAnimationFrame(() => {
        tagvnodes.forEach(function (vnode) {
          var type = vnode.type,
              x = vnode.x,
              y = vnode.y,
              d = vnode.d,
              width = vnode.width,
              height = vnode.height,
              id = vnode.id,
              cids = vnode.cids;
              vnode.g; // console.log({ x, y, d, width, height, type })

          if (d) width = d, height = d; // console.log({ width, height, d })

          var letter = txts.set(id);
          tag.set({
            // cx: x + width / 2,
            // x: x,
            x: x + width / 2,
            y: y + height / 2,
            // cy: y,
            txt: letter,
            // txt: `${letter}-${id}`,
            type: type,
            isnormal: !isscene && has(['normal'], type),
            ispoint: has(['end', 'dot'], type),
            isgroup: !isUnDef(cids),
            ratio: isscene ? 1 : ratio
          });
        }); // })
      })["catch"](console.log);
    },
    clear: function clear() {
      if (!ismarked) return;
      txts.reset();
      tag.clear();
      this.marked(false);
    },
    getAllIds: function getAllIds(letters) {
      return txts.get(letters);
    },
    getIds: function getIds(letters) {
      return txts.get(letters).filter(function (id) {
        return !!id;
      });
    },
    getLetters: function getLetters(ids) {
      return txts.getLetters(ids);
    }
  };
};
var progressLetters = function progressLetters(_ref5) {
  var start = _ref5.start,
      end = _ref5.end;
  var s = start.charCodeAt();
  var e = end.charCodeAt();
  var d = e - s;
  if (d <= 1) return [start, end];
  return Array(d + 1).fill(0).map(function (_, i) {
    return String.fromCharCode(s + i);
  });
};

var makeTxt = function makeTxt() {
  var i = -1;
  var marks = new Map(); // letter, node_id

  var list = function list() {
    var upperLetters = Array(26).fill(0).map(function (_, i) {
      return String.fromCharCode(65 + i);
    });
    var lowerLetters = Array(26).fill(0).map(function (_, i) {
      return String.fromCharCode(97 + i);
    });
    var letters = lowerLetters.concat(upperLetters);
    return letters; // return letters.concat(letters.map((letter) => `${letter}0`))
  };

  var letters = list();
  letters = letters.concat(letters.map(function (l) {
    return "".concat(l, "1");
  })); // console.log({ letters })

  return {
    reset: function reset() {
      marks.clear();
      i = -1;
    },
    set: function set(id) {
      var letter = letters[++i]; // console.log({ id, i, letter })

      marks.set(letter, id);
      return letter;
    },
    get: function get(letters) {
      // this.reset()
      return [].concat(letters).map(function (letter) {
        return marks.get(letter);
      });
    },
    getLetters: function getLetters(ids) {
      var keys = _toConsumableArray(marks.keys());

      var values = _toConsumableArray(marks.values());

      return [].concat(ids).map(function (id) {
        return keys[values.indexOf(id)];
      }).filter(function (letter) {
        return !!letter;
      });
    }
  };
};

var tagVNode = function tagVNode(_ref) {
  var txt = _ref.txt,
      width = _ref.width,
      height = _ref.height,
      fontsize = _ref.fontsize,
      fontcolor = _ref.fontcolor,
      transform = _ref.transform,
      board = _ref.board;
  return jsx("g", {
    transform: transform
  }, board, text({
    txt: txt,
    fontsize: fontsize,
    x: width / 2,
    y: height,
    fill: fontcolor
  }));
};
var tagDefVNode = function tagDefVNode(_ref2) {
  var txt = _ref2.txt,
      x = _ref2.x,
      y = _ref2.y,
      width = _ref2.width,
      height = _ref2.height,
      _ref2$bg = _ref2.bg,
      fill = _ref2$bg === void 0 ? '#000' : _ref2$bg,
      fontsize = _ref2.fontsize,
      fontcolor = _ref2.fontcolor,
      className = _ref2.className,
      scale = _ref2.scale,
      stroke = _ref2.stroke;
  return tagVNode({
    txt: txt,
    width: width,
    height: fontsize,
    fontsize: fontsize,
    fontcolor: fontcolor,
    transform: "translate(".concat(x - width * scale, ",").concat(y - height * scale / 2, ") scale(").concat(scale, ",").concat(scale, ")"),
    board: rect$1({
      x: 0,
      y: 0,
      fill: fill,
      width: width,
      height: height,
      rx: 4,
      ry: 4,
      stroke: stroke,
      className: className
    })
  });
};
var tagNormalVNode = function tagNormalVNode(_ref3) {
  var txt = _ref3.txt,
      x = _ref3.x,
      y = _ref3.y,
      width = _ref3.width,
      height = _ref3.height,
      _ref3$bg = _ref3.bg,
      fill = _ref3$bg === void 0 ? '#000' : _ref3$bg,
      fontsize = _ref3.fontsize,
      fontcolor = _ref3.fontcolor,
      className = _ref3.className,
      scale = _ref3.scale,
      stroke = _ref3.stroke;
  return tagDefVNode({
    txt: txt,
    x: x,
    y: y,
    width: width,
    height: height,
    bg: fill,
    fontsize: fontsize + 4,
    fontcolor: fontcolor,
    className: className,
    scale: scale,
    stroke: stroke
  });
};
var tagGroupVNode = function tagGroupVNode(_ref4) {
  var txt = _ref4.txt,
      x = _ref4.x,
      y = _ref4.y,
      width = _ref4.width,
      height = _ref4.height,
      fontsize = _ref4.fontsize,
      scale = _ref4.scale,
      stroke = _ref4.stroke;
  scale = scale * 1.6;
  stroke.dasharray = '2, 4'; // console.log({ stroke })

  return tagDefVNode({
    txt: txt,
    x: x,
    y: y,
    width: width,
    height: height,
    bg: '#fff8',
    fontsize: fontsize,
    fontcolor: '#777',
    scale: scale,
    stroke: stroke
  });
};
var tagPointVNode = function tagPointVNode(_ref5) {
  var txt = _ref5.txt,
      x = _ref5.x,
      y = _ref5.y,
      width = _ref5.width,
      _ref5$bg = _ref5.bg,
      fill = _ref5$bg === void 0 ? '#000' : _ref5$bg,
      fontsize = _ref5.fontsize,
      fontcolor = _ref5.fontcolor,
      className = _ref5.className,
      scale = _ref5.scale;
  scale = scale / 1.5;
  return tagVNode({
    txt: txt,
    width: 0,
    height: fontsize / 3,
    fontsize: fontsize,
    fontcolor: fontcolor,
    transform: "translate(".concat(x, ",").concat(y, ") scale(").concat(scale, ",").concat(scale, ")"),
    board: circle$1({
      cx: 0,
      cy: 0,
      fill: fill,
      r: width / 2,
      className: className
    })
  });
};

var tagGrayColor = function tagGrayColor() {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 155;
  // 颜色
  var base = 'A'.charCodeAt();

  var saturate = function saturate(_char) {
    var code = _char.charCodeAt();

    return limit - round(limit * (code - base) / code);
  };

  return function (txt, isopcity) {
    var saturation = saturate(txt).toString(16);
    var bg = "#".concat(saturation).concat(saturation).concat(saturation);
    if (!isopcity) return {
      bg: bg,
      fontcolor: '#fff'
    };
    return {
      bg: '#ffffffcc',
      fontcolor: '#000'
    };
  };
};

var tagSizeGen = function tagSizeGen(size, len) {
  // 大小
  // size::大小和缩放有关
  var val = function val(size) {
    var width = size * len;
    return {
      size: size,
      dy: 3,
      width: width,
      dx: width / 2,
      height: size + 8
    };
  };

  return {
    value: function value(isnormal) {
      if (!isnormal) return val(size);
      return _objectSpread2(_objectSpread2({}, val(size - 8)), {}, {
        dy: 0
      });
    }
  };
};

var tag = function tag(layer) {
  var color = tagGrayColor();
  return function (_ref) {
    var x = _ref.x,
        y = _ref.y,
        txt = _ref.txt,
        isnormal = _ref.isnormal,
        ispoint = _ref.ispoint,
        _ref$ratio = _ref.ratio,
        ratio = _ref$ratio === void 0 ? 1 : _ref$ratio,
        _ref$isgroup = _ref.isgroup,
        isgroup = _ref$isgroup === void 0 ? false : _ref$isgroup;
    var tagSize = tagSizeGen(22, txt.length);
    var stroke = {
      color: dark.tag.stroke,
      width: 1
    };

    var _tagSize$value = tagSize.value(isnormal),
        size = _tagSize$value.size,
        width = _tagSize$value.width,
        height = _tagSize$value.height;

    var _color = color(txt, ispoint || isnormal),
        fontcolor = _color.fontcolor,
        bg = _color.bg;

    var scale = ratio;
    var className = 'u-tag';
    var def = {
      txt: txt,
      x: x,
      y: y,
      width: width,
      height: height,
      fontsize: size,
      fontcolor: fontcolor,
      bg: bg,
      className: className,
      scale: scale,
      ispoint: ispoint,
      stroke: stroke
    };

    var usePatch = function usePatch(vnode, attrs) {
      if (isnormal) return patch(vnode, tagNormalVNode(Object.assign(def, attrs)));
      if (ispoint) return patch(vnode, tagPointVNode(Object.assign(_objectSpread2(_objectSpread2({}, def), {
        width: END_D,
        height: END_D
      }), attrs)));
      if (isgroup) return patch(vnode, tagGroupVNode(Object.assign(def, attrs)));
      return patch(vnode, tagDefVNode(Object.assign(def, attrs)));
    };

    usePatch(layer.group().node, {}); // return g
  };
};

var patchProperty = function patchProperty(options) {
  // console.log({ options })
  options.pid;
      options.cid;
      var type = options.type; // if (!isUnDef(cid) || !isUnDef(pid)) return options

  if (islink(type)) return options;
  return patchNodeProperty(options);
};

var patchNodeProperty = function patchNodeProperty(options) {
  logmid('patchNodeProperty::', options);
  options = _objectSpread2(_objectSpread2({}, options), {}, {
    cx: options.x,
    cy: options.y,
    fontsize: options.fz,
    border: parseBorder(options.bd),
    fontcolor: options.c,
    isarticle: !isUnDef(options.article),
    isstage: !isUnDef(options.stage)
  });

  if (isgroup(options.type)) {
    options.show = !!options.show; // 1,0
  }

  return options;
};

var parseBorder = function parseBorder(val) {
  return (val.match( /*#__PURE__*/_wrapRegExp(/\s*(.+)\s+(.+)\s+(.+)\s*/, {
    width: 1,
    type: 2,
    color: 3
  })) || {}).groups;
};
var parseColor = function parseColor(val) {
  // return (val.match(/\s*color\s*:\s*(?<color>.+)\s*/) || {}).groups
  return (val.match( /*#__PURE__*/_wrapRegExp(/\s*(.+)\s*/, {
    color: 1
  })) || {}).groups;
};
var parseNumber = function parseNumber(val) {
  return (val.match(/\s*(\d+)\s*/) || [])[1];
};
var parseGroupShow = function parseGroupShow(val) {
  return (val.match( /*#__PURE__*/_wrapRegExp(/\s*(\w+)\s*/, {
    show: 1
  })) || {}).groups;
};
var parseFontsizeEditVal = function parseFontsizeEditVal(val) {
  // return (val.match(/\s*fontsize\s*:\s*(?<fontsize>[\d\.]+)\s*/) || {}).groups
  return (val.match( /*#__PURE__*/_wrapRegExp(/\s*([\d\.]+)\s*/, {
    fontsize: 1
  })) || {}).groups;
};

var encodeBr = function encodeBr(v) {
  return logmid('COMMAND::encodeBr:', v) && v.replaceAll('\\n', '\\\n').replaceAll('\n', '\\n');
};
var decodeBr = function decodeBr(v) {
  return logmid('COMMAND::decodeBr:', v) && v.replaceAll('\\n', '\n').replaceAll('\\\n', '\\n');
};

var replace = function replace(jsonstr) {
  return jsonstr.replaceAll('"', '\\"').replaceAll('"', '\\"').replaceAll('\\"', '"').replaceAll('\\"', '"').replaceAll('\\\\"', '\\"').replaceAll('\\\\"', '\\"').replaceAll('\\\\\\"', '\\\\"').replaceAll('\\\\\\"', '\\\\"').replace(/\\+\n/g, '\\n') // 奇数\
  .replace(/\\+\\n/g, '\\n') // 偶数\
  .replace(/\\+\t/g, '\\t') // 奇数\
  .replace(/\\+\\t/g, '\\t') // 偶数\
  .replace(/\t/g, '');
}; // .replace(/\n/g, '')
// .replaceAll('\\\n', '\\n')
// .replaceAll('\\\\n', '\\n')
// .replaceAll('\\\\\n', '\\n')


var jsonparse = function jsonparse(jsonstr) {
  // console.log("JSON_PARSE::", fallback(replace(jsonstr)))
  var v = JSON.parse(replace(jsonstr));
  return isStr(v) ? jsonparse(v) : v;
};

var _this$1 = undefined;
// 外壳

var createContainer = function createContainer() {
  var commandDom = elmt_byid('GCommand');

  var unmarkdown = function unmarkdown(val) {
    return val != 'markdown';
  };

  var _showGen = showGen(commandDom),
      show = _showGen.show;

  return {
    show: show,
    markdown: function markdown(bool) {
      // markdown  读取, 设置, 清除
      var classname = commandDom.className.split(' ');
      var filterClassname = classname.filter(unmarkdown);

      if (isUnDef(bool)) {
        return classname.length > filterClassname.length;
      }

      if (!bool) {
        elmt_classname(commandDom, filterClassname.join(' '));
      } else {
        elmt_classname(commandDom, [].concat(_toConsumableArray(filterClassname), ['markdown']).join(' '));
      }
    }
  };
};

var CMD = Object.freeze({
  Title: Symbol('Title'),
  Size: Symbol('Size'),
  FSize: Symbol('FontSize'),
  BGround: Symbol('Background'),
  Border: Symbol('Border'),
  Color: Symbol('Color'),
  MultiTag: Symbol('MultiTag'),
  HAlign: Symbol('HAlign'),
  VAlign: Symbol('VAlign'),
  Link: Symbol('Link'),
  Search: Symbol('Search'),
  Stage: Symbol('Stage'),
  StageParent: Symbol('StageParent'),
  BindStage: Symbol('BindStage'),
  BindArticle: Symbol('BindArticle'),
  GroupShow: Symbol('Show')
}); // 左侧标题, 操作分类

var createTitle = function createTitle(commandContainer) {
  var _T;

  var titleDom = elmt_byid('GCommandTitle');
  var T = (_T = {}, _defineProperty(_T, CMD.Title, ['t']), _defineProperty(_T, CMD.Size, ['sz']), _defineProperty(_T, CMD.FSize, ['fz']), _defineProperty(_T, CMD.BGround, ['bg', 'background']), _defineProperty(_T, CMD.Border, ['border']), _defineProperty(_T, CMD.Color, ['color']), _defineProperty(_T, CMD.MultiTag, ['m']), _defineProperty(_T, CMD.HAlign, ['h']), _defineProperty(_T, CMD.VAlign, ['v']), _defineProperty(_T, CMD.Link, ['l']), _defineProperty(_T, CMD.Search, ['se']), _defineProperty(_T, CMD.Stage, ['st']), _defineProperty(_T, CMD.StageParent, ['sp']), _defineProperty(_T, CMD.BindStage, ['bs']), _defineProperty(_T, CMD.BindArticle, ['ba']), _defineProperty(_T, CMD.GroupShow, ['gs']), _T);

  var ALIAS_PRE = function ALIAS_PRE(a) {
    return ":".concat(a);
  };

  var TAlias = Object.keys(CMD).reduce(function (memo, key) {
    var Sym = CMD[key];
    var alias = T[Sym];
    alias.forEach(function (a) {
      memo[ALIAS_PRE(a)] = Sym;
    });
    return memo;
  }, {});
  console.log({
    TAlias: TAlias
  });

  var TVal = function TVal(symbol) {
    return symbol.toString().match( /*#__PURE__*/_wrapRegExp(/Symbol\((.+)\)/, {
      val: 1
    })).groups.val;
  };

  var TSyms = function TSyms(_ref) {
    var ismarked = _ref.ismarked,
        isnode = _ref.isnode,
        isgroup = _ref.isgroup;
    return filterTKeys({
      ismarked: ismarked,
      isnode: isnode,
      isgroup: isgroup
    });
  };

  var markT = [CMD.MultiTag, CMD.HAlign, CMD.VAlign, CMD.Link];
  var markNodeT = [CMD.Size, CMD.FSize, CMD.Color, CMD.BGround, CMD.Border];
  var nodeT = [CMD.Title];
  var commonT = [CMD.Search, CMD.Stage, CMD.StageParent];
  var currentT = CMD.Title;

  var filterTKeys = function filterTKeys(_ref2) {
    var ismarked = _ref2.ismarked,
        isnode = _ref2.isnode,
        isgroup = _ref2.isgroup;
    // console.log({ ismarked, isnode, isgroup })
    if (ismarked && isgroup) return [].concat(markT, [CMD.GroupShow], commonT);
    if (isgroup) return [CMD.GroupShow, CMD.BindArticle].concat(commonT);
    if (ismarked && isnode) return [].concat(markT, markNodeT, commonT);
    if (isnode) return [].concat(nodeT, markNodeT, commonT, [CMD.BindStage, CMD.BindArticle]);
    if (ismarked) return [].concat(markT, commonT);
    return [].concat(commonT);
  };

  var show = function show(_show) {
    return function (val) {
      if (isUnDef(val)) return _show;
      commandContainer.markdown(!val);
      return _show = val;
    };
  };

  return Object.create({
    show: show(false),
    txt: function txt(val) {
      // 读取 || 设置
      if (isUnDef(val)) {
        return currentT; // return T[titleDom.innerHTML]
      }

      return titleDom.innerHTML = TVal(currentT = val);
    },
    alias: function alias(type) {
      var t = TAlias[type];
      if (isUnDef(t)) return;
      this.txt(t);
      return this.show(true);
    },
    switchAction: function switchAction(_ref3) {
      var ismarked = _ref3.ismarked,
          isnode = _ref3.isnode,
          isgroup = _ref3.isgroup;
      var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      // 切换 action
      var keys = TSyms({
        ismarked: ismarked,
        isnode: isnode,
        isgroup: isgroup
      });
      var i = keys.indexOf(this.txt()) + dir;
      if (i > keys.length - 1) i = 0;
      if (i < 0) i = keys.length - 1;
      if (!this.show()) return;
      return this.txt(keys[i]);
    },
    reset: function reset(_ref4) {
      var title = _ref4.title,
          ismarked = _ref4.ismarked,
          isnode = _ref4.isnode,
          isgroup = _ref4.isgroup,
          isedit = _ref4.isedit;
      // isedit ctrl+e
      this.txt(title || TSyms({
        ismarked: ismarked,
        isnode: isnode,
        isgroup: isgroup
      })[0]);
      this.show(!isedit);
    }
  }, {
    T: {
      get: function get() {
        return CMD;
      }
    },
    type: {
      get: function get() {
        return currentT || CMD.Title;
      }
    },
    isBGround: {
      get: function get() {
        return this.type == CMD.BGround;
      }
    },
    isBorder: {
      get: function get() {
        return this.type == CMD.Border;
      }
    },
    isColor: {
      get: function get() {
        return this.type == CMD.Color;
      }
    },
    isTitle: {
      get: function get() {
        return this.type == CMD.Title;
      }
    },
    isMTag: {
      get: function get() {
        return this.type == CMD.MultiTag;
      }
    },
    isSize: {
      get: function get() {
        return this.type == CMD.Size;
      }
    },
    isFontSize: {
      get: function get() {
        return this.type == CMD.FSize;
      }
    },
    isVAlign: {
      get: function get() {
        return this.type == CMD.VAlign;
      }
    },
    isHAlign: {
      get: function get() {
        return this.type == CMD.HAlign;
      }
    },
    isLink: {
      get: function get() {
        return this.type == CMD.Link;
      }
    },
    isStage: {
      get: function get() {
        return this.type == CMD.Stage;
      }
    },
    isStageParent: {
      get: function get() {
        return this.type == CMD.StageParent;
      }
    },
    isBindStage: {
      get: function get() {
        return this.type == CMD.BindStage;
      }
    },
    isBindArticle: {
      get: function get() {
        return this.type == CMD.BindArticle;
      }
    },
    isGroupShow: {
      get: function get() {
        return this.type == CMD.GroupShow;
      }
    }
  });
}; // 编辑框


var createEdit = function createEdit(commandTitle, pubsub) {
  var editDom = elmt_byid('GCommandEdit'); // 清除title

  editDom.addEventListener('keydown', function (evt) {
    if (isTab(evt)) {
      evt.preventDefault();
      textareaTab(editDom);
    }

    if (isToggleCommandEdit(evt)) {
      evt.preventDefault();
      editer.toggleEdit();
    }

    if (!isBackspace(evt)) return;

    if (editer.txt() == '') {
      commandTitle.show(false);
    }
  }); // 更改

  editDom.addEventListener('input', function (evt) {
    var _evt$value = evt.value,
        value = _evt$value === void 0 ? evt.target.value : _evt$value; // 显示 title

    if (commandTitle.show()) return;

    if (commandTitle.alias(value)) {
      // 输入指令如  :t
      editer.txt('');
    }
  }); // 换行转义

  var editValWhthBrFn = function editValWhthBrFn() {
    // 1. 初始类型 inittype , 决定编码类型
    // 2. 编码状态 encode
    // 初始类型 == 编码状态 ? 返回原始数据 : 返回编码数据
    var isEmptyStr = function isEmptyStr(val) {
      return val.trim() == '';
    };

    var stateFn = function stateFn(encodeOnLock, isencode) {
      var lock = createLock(); // 当前无意义

      return {
        isinit: lock.islocked,
        encode: function encode(bool) {
          return isencode = undef(isencode, bool);
        },
        inittype: function inittype(bool) {
          // 初始类型, 决定最终处理效果 encode:true || decode:false
          if (lock.islocked()) return encodeOnLock;
          lock.islocked(true);
          encodeOnLock = bool;
        },
        reset: function reset() {
          encodeOnLock = false;
          isencode = false;
          lock.unlock();
        }
      };
    };

    var state = stateFn(false, false);
    return {
      normal: function normal(val) {
        // 被多次调用, keydown backspace 退格中被调用
        if (isEmptyStr(val)) return val; // const codeBr = state.encode() ? decodeBr : encodeBr

        var codeBr = state.encode() ? decodeBr : function () {
          return val;
        }; // const retFn = (isreset) => () => isreset ? val : codeBr(val)
        // const ret = retFn(state.encode() == state.inittype())
        // logmid("JSON_PARSE::isreset:", state.encode() == state.inittype())

        return codeBr(val);
      },
      parse: function parse(val) {
        // 切换过程中调用, 第一次切换获取状态
        if (isEmptyStr(val)) return val;
        var isencode = commandTitle.show();
        val = isencode ? encodeBr(val) : decodeBr(val); // state.reset()
        // state.inittype(isencode)

        state.encode(isencode);
        return val;
      }
    };
  };

  var editValWhthBr = editValWhthBrFn();
  var editer = {
    focus: function focus() {
      editDom.focus();
    },
    blur: function blur() {
      editDom.blur();
    },
    toggleEdit: function toggleEdit() {
      var istitle = commandTitle.show(!commandTitle.show());
      if (!commandTitle.isStage) return editer.txt(editDom.value);
      if (istitle) return pubsub.emit('STAGE_TITLE_GET', function (val) {
        editer.txt(val);
      });
      pubsub.emit('STAGE_CONTENT_GET', function (val) {
        return editer.txt(val);
      });
    },
    txt: function txt(val) {
      if (isUnDef(val)) {
        logmid('JSON_PARSE::', commandTitle.isStage);
        return commandTitle.isStage ? editDom.value : editValWhthBr.normal(editDom.value);
      }

      editDom.value = commandTitle.isStage ? val : editValWhthBr.parse(val.toString());
    }
  };
  return editer;
};

var switchActionCache = function switchActionCache(commandTitle) {
  // 多个命令一次确认,缓存切换action的输入内容
  var cache = new Map();
  var nonempty = [commandTitle.T.Title, commandTitle.T.Size, commandTitle.T.FSize, commandTitle.T.BGround, commandTitle.T.Border];
  var lastempty = [commandTitle.T.HAlign, commandTitle.T.VAlign];

  var addAutoFontSize = function addAutoFontSize(cache) {
    if (cache.size == 1 && !isUnDef(cache.get(commandTitle.T.Title))) {
      cache.set(commandTitle.T.Size, 'auto');
    }
  };

  return {
    add: function add(_ref5) {
      var type = _ref5.type,
          val = _ref5.val;
      if (nonempty.some(function (t) {
        return t == type;
      }) && isUnDef(val)) return; // 不为空

      cache.forEach(function (v, k) {
        if (isEmptyStr(v) && has(lastempty, k)) cache["delete"](k);
      }); // 所有空值中保留最后一位(当前状态值为空)

      cache.set(type, val); //console.log({ cache })
    },
    use: function use() {
      // 插件
      addAutoFontSize(cache);
    },
    forEach: function forEach(fn) {
      cache.forEach(function (v, k) {
        return fn({
          type: k,
          val: v
        });
      });
      cache.clear();
    },
    clear: function clear() {
      cache.clear();
    }
  };
}; // 选中了元素，调起输入


var createCommand = function createCommand() {
  var pubsub = new Event();
  var commandContainer = createContainer();
  var commandTitle = createTitle(commandContainer);
  var commandEdit = createEdit(commandTitle, pubsub);
  var cacheAction = switchActionCache(commandTitle);

  var stateGen = function stateGen() {
    var isshow = false;
    return {
      show: function show(bool, vnode, isedit) {
        if (isUnDef(bool)) return isshow; // 读取

        if (isshow == bool) return; // 无效更新

        if (bool) {
          var ismarked = vnode.ismarked,
              isnode = vnode.isnode,
              isgroup = vnode.isgroup;
              vnode.letters;
              vnode.txt;
          commandContainer.show(true);
          commandTitle.reset({
            ismarked: ismarked,
            isnode: isnode,
            isgroup: isgroup,
            isedit: isedit
          }); // 多状态

          this["switch"](ismarked, vnode, 0);
          setTimeout(commandEdit.focus);
        } else {
          commandContainer.show(false);
          commandTitle.reset({
            title: commandTitle.T.Title
          });
          commandEdit.blur();
          commandEdit.txt('');
          cacheAction.clear();
        }

        return isshow = bool;
      },
      "switch": function _switch(ismarked, vnode, dir) {
        //console.log(commandTitle.type, commandEdit.txt())
        commandTitle.switchAction({
          ismarked: ismarked,
          isnode: vnode.isnode,
          isgroup: vnode.isgroup
        }, dir); // 不同状态,执行的action不同
        //console.log({ actionType })

        if (commandTitle.isStage) return pubsub.emit('STAGE_TITLE_GET', function (val) {
          commandEdit.txt(val);
        });
        if (commandTitle.isStageParent) return pubsub.emit('STAGE_PARENT_ID_GET', function (id) {
          commandEdit.txt(id);
        });
        commandEdit.txt(unparseVNode(vnode));
      }
    };
  };

  var state = stateGen(); //  序列化属性到输入框

  var unparseVNode = function unparseVNode(_ref6) {
    var type = _ref6.type,
        width = _ref6.width,
        height = _ref6.height,
        txt = _ref6.txt,
        d = _ref6.d,
        bg = _ref6.bg,
        show = _ref6.show,
        fontsize = _ref6.fz,
        border = _ref6.bd,
        color = _ref6.c,
        stage = _ref6.stage,
        article = _ref6.article,
        ismarked = _ref6.ismarked;
        _ref6.isnode;
        var letters = _ref6.letters;
    // console.log({ type, width, height, txt, d, ismarked, isnode,  fontsize, border })
    var actions = {
      circle: "d:".concat(d),
      rect: "width:".concat(round(width, 2), ",height:").concat(round(height, 2))
    };
    actions['normal'] = actions.rect;
    if (commandTitle.isMTag && ismarked) return letters.join(',');
    if (commandTitle.isSize) return actions[type];
    if (commandTitle.isTitle) return txt;
    if (commandTitle.isBGround) return bg;
    if (commandTitle.isFontSize) return "".concat(fontsize);
    if (commandTitle.isBorder) return "".concat(border);
    if (commandTitle.isColor) return "".concat(color);
    if (commandTitle.isBindStage) return "".concat(stage);
    if (commandTitle.isBindArticle) return "".concat(article);
    if (commandTitle.isGroupShow) return "".concat(show);
    return '';
  }; // 选择节点,范围加忽略 a-h|e,f


  var parseMtagEditVal = function parseMtagEditVal(editVal) {
    var _groups = (editVal.match( /*#__PURE__*/_wrapRegExp(/\s*(\w+)\s*\x2D\s*(\w+)\|*(.*)/, {
      start: 1,
      end: 2,
      ignore: 3
    })) || {
      groups: {}
    }).groups,
        start = _groups.start,
        end = _groups.end,
        _groups$ignore = _groups.ignore,
        ignore = _groups$ignore === void 0 ? '' : _groups$ignore;
    if (start && end) return progressLetters({
      start: start,
      end: end
    }).filter(function (letter) {
      return !has(ignore.split(',').map(function (v) {
        return v.trim();
      }), letter);
    });
    return editVal.split(',').filter(function (item) {
      return !!item;
    });
  }; // 解析输入的有效值, 这里通过curry延迟调用


  var parseSizeEditVal = function parseSizeEditVal(editVal) {
    return function (type) {
      if (editVal == 'auto') return editVal;

      var groupsOfMatch = function groupsOfMatch(val, reg) {
        return (val.match(reg) || {
          groups: {}
        }).groups;
      };

      var actionsMatch = {
        circle: groupsOfMatch(editVal, /*#__PURE__*/_wrapRegExp(/\s*d\s*:\s*([\d\.]+)/, {
          d: 1
        })),
        rect: _objectSpread2(_objectSpread2({}, groupsOfMatch(editVal, /*#__PURE__*/_wrapRegExp(/\s*width\s*:\s*([\d\.]+)\s*/, {
          width: 1
        }))), groupsOfMatch(editVal, /*#__PURE__*/_wrapRegExp(/\s*height\s*:\s*([\d\.]+)\s*/, {
          height: 1
        })))
      };
      actionsMatch['normal'] = actionsMatch.rect;
      return actionsMatch[type];
    };
  }; // 对齐


  var parseAlignEditVal = function parseAlignEditVal(editval) {
    return (editval.match( /*#__PURE__*/_wrapRegExp(/((H):|(V):)(.*)/, {
      H: 2,
      V: 3,
      val: 4
    })) || {}).groups;
  }; // 链接


  var parseLinkEditVal = function parseLinkEditVal(editVal) {
    // { link: [[a,b],[c,d]], unlink: [[a,b],[c,d]] }
    // a.3.b  dotted 中间3个点
    // a-3-b  solid 中间3个点
    console.log({
      editVal: editVal
    });

    var parse = function parse(v, symbol) {
      return v.replace(/\w+/g, function (v) {
        return "".concat(v, ",").concat(v);
      }).split(',').filter(function (v) {
        return has(v, symbol);
      }).map(function (v) {
        console.log({
          v: v
        });
        var num = (v.match( /*#__PURE__*/_wrapRegExp(/(\d+)/, {
          num: 1
        })) || {
          groups: {
            num: 0
          }
        }).groups.num;
        if (num == 0) return v.split(symbol);
        var arr = v.split(symbol);
        console.log(Array(num).fill(''));
        return [arr[0]].concat(Array(num).fill(''), arr[arr.length - 1]);
      });
    };

    return editVal.split(',').reduce(function (memo, cmdunit) {
      // console.log(parse(cmdunit, '-'))
      if (has(cmdunit, '-')) memo.solidlink = memo.solidlink.concat(parse(cmdunit, '-'));
      if (has(cmdunit, '.')) memo.dottedlink = memo.dottedlink.concat(parse(cmdunit, '.'));
      if (has(cmdunit, '|')) memo.unlink = memo.unlink.concat(parse(cmdunit, '|'));
      if (has(cmdunit, '+')) memo.addlink = memo.addlink.concat(parse(cmdunit, '+'));
      console.log({
        memo: memo
      });
      return memo;
    }, {
      solidlink: [],
      unlink: [],
      dottedlink: [],
      addlink: []
    });
  }; // 选中单个节点


  var updateNode = function updateNode(update, _ref7) {
    var _updates;

    var type = _ref7.type,
        editVal = _ref7.val;

    // 针对node
    //console.log({ type, editVal })
    if (commandTitle.T.Stage == type) {
      var EVENT_NAME = commandTitle.show() ? 'STAGE_TITLE_SET' : 'STAGE_CONTENT_SET';
      pubsub.emit(EVENT_NAME, editVal);
      return;
    }

    if (commandTitle.T.Search == type) {
      pubsub.emit('SEARCH', editVal);
      return;
    }

    if (commandTitle.T.StageParent == type) {
      pubsub.emit('STAGE_PARENT_ID_SET', +editVal);
      return;
    }

    var updates = (_updates = {}, _defineProperty(_updates, commandTitle.T.BGround, function () {
      return update({
        type: 'bg',
        val: editVal
      });
    }), _defineProperty(_updates, commandTitle.T.Title, function () {
      return update({
        type: 'txt',
        val: editVal
      });
    }), _defineProperty(_updates, commandTitle.T.Link, function () {
      return update({
        type: 'link',
        val: parseLinkEditVal(editVal)
      });
    }), _defineProperty(_updates, commandTitle.T.Size, function () {
      return update({
        type: 'size',
        val: parseSizeEditVal(editVal)
      });
    }), _defineProperty(_updates, commandTitle.T.FSize, function () {
      return update({
        type: 'fontsize',
        val: parseFontsizeEditVal(editVal)
      });
    }), _defineProperty(_updates, commandTitle.T.HAlign, function () {
      return update({
        type: 'align',
        val: parseAlignEditVal("H:".concat(editVal))
      });
    }), _defineProperty(_updates, commandTitle.T.VAlign, function () {
      return update({
        type: 'align',
        val: parseAlignEditVal("V:".concat(editVal))
      });
    }), _defineProperty(_updates, commandTitle.T.Border, function () {
      return update({
        type: 'border',
        val: parseBorder(editVal)
      });
    }), _defineProperty(_updates, commandTitle.T.Color, function () {
      return update({
        type: 'color',
        val: parseColor(editVal)
      });
    }), _defineProperty(_updates, commandTitle.T.BindStage, function () {
      return update({
        type: 'stage',
        val: parseNumber(editVal)
      });
    }), _defineProperty(_updates, commandTitle.T.BindArticle, function () {
      return update({
        type: 'article',
        val: parseNumber(editVal)
      });
    }), _defineProperty(_updates, commandTitle.T.GroupShow, function () {
      return update({
        type: 'show',
        val: parseGroupShow(editVal)
      });
    }), _updates);
    updates[type] && updates[type]();
  };

  var exec = function exec(evt, nodes, update, focusMarkLetters, ismarked, selecteNodesOfMark) {
    // nodes 选中节点
    if (!(nodes || ismarked)) return; // 开启前置条件
    // multi tag

    setTimeout(function () {
      if (ismarked && commandTitle.isMTag) {
        //console.log(parseMtagEditVal(commandEdit.txt()))
        selecteNodesOfMark(uniq$1(parseMtagEditVal(commandEdit.txt())));
      }
    }.bind(_this$1)); //console.log({ keyCode, isShiftKeyDown })

    if (isEsc(evt) && state.show()) {
      // esc+以唤醒=> 睡眠
      return state.show(false);
    }

    var fnodes = nodes.getfocus() || [];
    if (state.show() && isToggleCommandEdit(evt)) return;
    if (!isCommandEnter(evt) && !isToggleCommandEdit(evt)) return; // enter key 键盘开关
    //console.log({ nodes, ismarked })

    {
      var _fnodes$;

      //console.log(JSON.stringify(fnodes[0]?.vnode))
      var _ref9 = ((_fnodes$ = fnodes[0]) === null || _fnodes$ === void 0 ? void 0 : _fnodes$.vnode) || {},
          txt = _ref9.txt,
          type = _ref9.type,
          width = _ref9.width,
          height = _ref9.height,
          cids = _ref9.cids,
          _ref8$stage2 = _ref9.stage,
          stage = _ref8$stage2 === void 0 ? '' : _ref8$stage2,
          _ref8$article2 = _ref9.article,
          article = _ref8$article2 === void 0 ? '' : _ref8$article2,
          _ref8$show2 = _ref9.show,
          show = _ref8$show2 === void 0 ? false : _ref8$show2,
          d = _ref9.d,
          _ref8$bg2 = _ref9.bg,
          bg = _ref8$bg2 === void 0 ? '#fff' : _ref8$bg2,
          fz = _ref9.fz,
          bd = _ref9.bd,
          c = _ref9.c;

      var vnode = {
        bg: bg,
        type: type,
        width: width,
        height: height,
        stage: stage,
        article: article,
        d: d,
        show: !!show,
        ismarked: ismarked,
        isnode: !!fnodes.length,
        isgroup: !!cids,
        letters: focusMarkLetters,
        txt: txt,
        fz: fz,
        bd: bd,
        c: c
      }; //console.log({ width, height, d })

      if (!state.show()) {
        // 唤醒并设置内容
        state.show(true, vnode, isToggleCommandEdit(evt));
      } else {
        cacheAction.add({
          type: commandTitle.type,
          val: commandEdit.txt()
        });

        if (isSwitchNextCommand(evt)) {
          // shift+enter+已唤醒
          if (commandTitle.show()) {
            evt.preventDefault();
            state["switch"](ismarked, vnode, isSwitchPrevCommand(evt) ? -1 : 1);
          }

          return;
        }

        if (fnodes) {
          // console.log({ cacheAction })
          if (isModel(type, width, height)) cacheAction.use();
          cacheAction.forEach(function (_ref10) {
            var type = _ref10.type,
                val = _ref10.val;
            return logmid('cacheAction::', {
              type: type,
              val: val
            }) && updateNode(update, {
              type: type,
              val: val
            });
          });
        }

        state.show(false);
      }
    }
  };

  return {
    exec: exec,
    state: state,
    pubsub: pubsub
  };
};

var linkType = function linkType(type) {
  var style = {
    dotted: {
      dasharray: [2, 4]
    }
  };
  return _objectSpread2({}, style[type] || {});
};
var linkFactory = function linkFactory(layer) {
  return function (_ref) {
    var dots = _ref.dots,
        type = _ref.type;
    console.log({
      dots: dots,
      type: type
    });

    var lineTo = function lineTo(dots) {
      return dots.map(function (_ref2) {
        var x = _ref2.x,
            y = _ref2.y;
        return "".concat(x, " ").concat(y);
      }).join(' L');
    };

    console.log('line to::', {
      layer: layer
    }, lineTo(dots));
    var path = layer.path("M".concat(lineTo(dots))).fill('transparent').stroke(_objectSpread2({
      color: dark.color,
      width: 1
    }, linkType(type))); // const path = layer.path(`M${x1} ${y1} L400 450 L${x2} ${y2}`).fill('transparent').stroke({ color: theme.color, width: 1, ...linkType(type) })

    var markers = []; // end arrow icon

    path.marker('end', 20, 6, function (add) {
      add.path('M 0 0 L 10 3 L 0 6 z').fill(dark.path.marker);
      markers.push(add);
    }); // start circle icon

    if (type != 'circle') {
      var endpoint = 6;
      path.marker('start', endpoint, endpoint, function (add) {
        add.circle(endpoint).fill(dark.path.marker);
        add.circle(endpoint - 2).dx(1).dy(1).fill('#ccc');
        markers.push(add);
      });
    }

    path.move = function (dots) {
      // console.log({ dots })
      path.attr({
        d: "M".concat(lineTo(dots))
      }); // path.attr({ d: [`M${x1}`, y1, `L${x2}`, y2].join(' ') })
    };

    var remove = path.remove.bind(path);

    path.remove = function () {
      markers.forEach(function (marker) {
        return marker.remove();
      });
      remove();
    };

    return path;
  };
};
var solid = function solid(layer) {
  return function (_ref3) {
    var dots = _ref3.dots;
    return linkFactory(layer)({
      dots: dots,
      type: 'solid'
    });
  };
};
var dotted = function dotted(layer) {
  return function (_ref4) {
    var dots = _ref4.dots;
    return linkFactory(layer)({
      dots: dots,
      type: 'dotted'
    });
  };
}; // export const solid = (layer) => ({ x1, y1, x2, y2 }) => linkFactory(layer)({ x1, y1, x2, y2, type: 'solid' })
// export const dotted = (layer) => ({ x1, y1, x2, y2 }) => linkFactory(layer)({ x1, y1, x2, y2, type: 'dotted' })

var registe = function registe() {
  var _groups = {
    link: {},
    group: {},
    node: {},
    end: {}
  };

  var check = function check(group, name) {
    if (group[name]) throw TypeError("".concat(name, " node already registered, or rename"));
  };

  return {
    groups: function groups() {
      return _groups;
    },
    link: function link(name, nodeGen) {
      check(_groups.link, name);
      _groups.link[name] = nodeGen;
    },
    group: function group(name, nodeGen) {
      check(_groups.group, name);
      _groups.group[name] = nodeGen;
    },
    node: function node(name, nodeGen) {
      check(_groups.node, name);
      _groups.node[name] = nodeGen;
    },
    end: function end(name, nodeGen) {
      check(_groups.end, name);
      _groups.end[name] = nodeGen;
    }
  };
};
var register = registe();
var Title = CMD.Title,
    Size = CMD.Size,
    FSize = CMD.FSize,
    BGround = CMD.BGround,
    Border = CMD.Border,
    Color = CMD.Color,
    BindStage = CMD.BindStage,
    BindArticle = CMD.BindArticle,
    GroupShow = CMD.GroupShow;
register.node('circle', circle, [Title, Size, FSize, BGround, Border, Color, BindStage, BindArticle]);
register.node('rect', rect, [Title, Size, FSize, BGround, Border, Color, BindStage, BindArticle]);
register.node('normal', normal, [Title, FSize, BGround, Color]);
register.group('group', group, [GroupShow, BindArticle]);
register.end('dot', dot);
register.end('end', end);
register.link('dotted', dotted);
register.link('solid', solid);

var box = function box(_ref) {
  var left = _ref.left,
      top = _ref.top,
      width = _ref.width,
      height = _ref.height,
      _ref$attr = _ref.attr,
      attr = _ref$attr === void 0 ? {} : _ref$attr,
      svgDecor = _ref.svgDecor;
  // console.log({ left, top, width, height, attr, svgDecor })
  var svg = SVG().viewbox(left, top, width, height).size(width, height).attr(_objectSpread2({
    preserveAspectRatio: 'xMinYMax meet'
  }, attr));
  if (isFunc(svgDecor)) return svgDecor(svg);
  return {
    mnt: svg,
    box: svg,
    svg: svg
  };
};
var layout = function layout(_ref2) {
  var left = _ref2.left,
      top = _ref2.top,
      width = _ref2.width,
      height = _ref2.height,
      attr = _ref2.attr,
      border = _ref2.border;
  var ratio = 8 / 10;
  var borwidth = border / 4;

  var _scaled = scaled(width, ratio),
      _scaled2 = _slicedToArray(_scaled, 2),
      nw = _scaled2[0],
      dw = _scaled2[1],
      _scaled3 = scaled(height, ratio),
      _scaled4 = _slicedToArray(_scaled3, 2),
      nh = _scaled4[0],
      dh = _scaled4[1];

  var offset = {
    left: dw / 2 - borwidth,
    top: dh / 2 - borwidth
  };
  attr = {
    x: borwidth,
    y: borwidth
  };
  return {
    left: left,
    top: top,
    width: nw,
    height: nh,
    attr: attr,
    border: border,
    offset: offset
  };
}; // 边框盒子

var borderBox = function borderBox(options) {
  var left = options.left,
      top = options.top,
      width = options.width,
      height = options.height,
      attr = options.attr,
      border = options.border,
      offset = options.offset; // console.log({ left, top, width, height, attr, offset })

  var svgDecor = function svgDecor(svg) {
    // 出现detached SVG, DOM中会有一个SVG的创建节点
    var g = SVG().group().attr({
      transform: "translate(".concat(offset.left, ",").concat(offset.top, ")")
    });
    g.rect().attr({
      "class": 'g-scene-nodetype',
      width: width + border / 2,
      height: height + border / 2,
      fill: dark.bg
    }).stroke({
      color: dark.typescene.box.stroke,
      width: 1
    }).radius(0).fill('#fffd');
    return {
      mnt: g,
      box: svg,
      svg: svg
    };
  };

  return box({
    left: left,
    top: top,
    width: width,
    height: height,
    attr: attr,
    svgDecor: svgDecor
  });
};

var shape = (function (_ref) {
  var box = _ref.box,
      mnt = _ref.mnt,
      _svg = _ref.svg;
  // console.log({ box })
  var groupLayer = box.group();
  var linkLayer = box.group();
  var nodeLayer = box.group();
  var endLayer = box.group();
  var tagLayer = box.group();

  var tagDecor = function tagDecor() {
    return {
      set: tag(tagLayer),
      clear: function clear() {
        tagLayer && (tagLayer.node.innerHTML = '');
      }
    };
  };

  var shapes = {};
  var shape = {
    has: function has(type) {
      var isdefed = !isUnDef(shapes[type]);

      if (!isdefed) {
        console.warn(TypeError("".concat(type, " node is not register")));
      }

      return isdefed;
    },
    create: function create(type, options, newlayer) {
      var shape = shapes[type](options, newlayer);
      if (islink(type)) return shape;
      return node(shape, type);
    },
    tag: tagDecor(),
    attach: function attach(container) {
      if (_svg != mnt) {
        _svg.addTo(mnt);
      }

      mnt.addTo(container);
    },
    register: function register$1(type, name, nodeGen) {
      // 注册节点生成器
      if (!isUnDef(name) && !isUnDef(nodeGen)) register[type](name, nodeGen);

      var groups = register.groups();

      var attach = function attach(group, layer) {
        Object.keys(group).forEach(function (key) {
          if (!isUnDef(shapes[key])) return;

          shapes[key] = function (options, newlayer) {
            return group[key](newlayer || layer)(patchProperty(options));
          };
        });
      };

      attach(groups.link, linkLayer);
      attach(groups.group, groupLayer);
      attach(groups.node, nodeLayer);
      attach(groups.end, endLayer);
    },
    clear: function clear() {
      // mnt.clear()
      mnt.remove();
      tagLayer = null;
      endLayer = null;
      nodeLayer = null;
      groupLayer = null;
      linkLayer = null;
      _svg = null;
    },
    svg: function svg() {
      return _svg;
    }
  };
  shape.register();
  return shape;
});

var STAGE_EVENT = {
  MOUSEMOVE: 'mousemove',
  MOUSEDOWN: 'mousedown',
  MOUSEUP: 'mouseup',
  KEYDOWN: 'keydown',
  KEYDOWN_SEARCH: 'keydown-search',
  ADD: 'add',
  DEL: 'del',
  ESC: 'esc',
  ZOOM: 'zoom',
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
  SEARCH: 'search',
  SEARCH_PREV: 'search-prev',
  SEARCH_NEXT: 'search-next',
  SEARCH_TAG: 'search-tag',
  SEARCH_ONE: 'search-one',
  NODE_SELECTED: 'node-selected',
  MARKING: 'marking'
};
var STAGE_STATE = {
  NORMAL: 0,
  MARKED: 1,
  // 标记
  isnormal: function isnormal(val) {
    return val == STAGE_STATE.NORMAL;
  },
  ismarked: function ismarked(val) {
    return val == STAGE_STATE.MARKED;
  }
};
var createStage = function createStage(options) {
  var stage = new Stage(options);
  return stage;
};
var Stage = /*#__PURE__*/function (_Event) {
  _inherits(Stage, _Event);

  var _super = _createSuper(Stage);

  // container = null
  // uid = 0  // 元素ID数量
  // 视口, 缩放
  // 舞台上的图形节点
  // 标记
  // options = null
  // shapeGen = null // 图形生成器
  function Stage(_ref) {
    var _this;

    var left = _ref.left,
        top = _ref.top,
        width = _ref.width,
        height = _ref.height,
        zoomsize = _ref.zoomsize;

    _classCallCheck(this, Stage);

    _this = _super.call(this); // this.options = { left, top, width, height, zoomsize }

    _defineProperty(_assertThisInitialized(_this), "state", STAGE_STATE.NORMAL);

    _defineProperty(_assertThisInitialized(_this), "viewbox", null);

    _defineProperty(_assertThisInitialized(_this), "nodes", null);

    _defineProperty(_assertThisInitialized(_this), "marks", null);

    _defineProperty(_assertThisInitialized(_this), "shape", null);

    _this.shape = shape(box({
      left: left,
      top: top,
      width: width,
      height: height,
      zoomsize: zoomsize
    }));
    _this.viewbox = createViewbox({
      width: width,
      height: height,
      zoomsize: zoomsize,
      svg: _this.shape.svg()
    });
    _this.nodes = createNode({
      left: left,
      top: top,
      viewboxScale: _this.viewbox.scale,
      viewboxInfo: _this.viewbox.get
    });
    _this.marks = createMark({
      tag: _this.shape.tag,
      viewbox: _this.viewbox
    });

    _this.listen();

    return _this;
  }

  _createClass(Stage, [{
    key: "listen",
    value: function listen() {
      var _this2 = this;

      var mark = marking(this.marks, _objectSpread2(_objectSpread2({}, this.nodes), {}, {
        focusOfMark: this.selecteNodesOfMark.bind(this)
      }));
      this.on(STAGE_EVENT.MARKING, function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            evt = _ref3[0],
            callback = _ref3[1];

        callback(mark.marked(!!mark.render(evt)));
      }); // 选择节点, 屏蔽其它操作

      this.on(STAGE_EVENT.MOUSEDOWN, function () {
        _this2.nodes.mousedown();

        mark.clear();
      });
      this.on(STAGE_EVENT.MOUSEUP, function () {
        _this2.nodes.mouseup();
      });
      this.on(STAGE_EVENT.MOUSEMOVE, function (evt) {
        _this2.nodes.mousemove(evt);
      });
      this.on(STAGE_EVENT.KEYDOWN, function (evt) {
        _this2.GC = new GC();
        if (isEsc(evt)) ESC();
        if (isDel(evt)) DEL();
        if (isShapeZoomIn(evt)) _this2.nodes.zoom('IN');
        if (isShapeZoomOut(evt)) _this2.nodes.zoom('OUT');
        if (isCopy(evt)) return COPY();
        if (isClose(evt)) CLOSE();
        if (isGroup(evt)) return GROUP(true);
        if (isUnGroup(evt)) return GROUP(false);
        if (_this2.viewbox.zoom(evt, VIEW_CENTER)) _this2.nodes.defocus(); //  缩放

        if (mark.marked()) return;
        if (isAddEnd(evt)) return ADD_END();
        if (isViewCenter(evt)) return VIEW_CENTER(); // if (isNextSearch(keyCode, shiftKey)) stage.fire('search:next')
        // if (isPrevSearch(keyCode, shiftKey)) stage.fire('search:prev')

        if (isParent(evt)) return PARENT_NODE(); // if (isEditView(keyCode)) return EDIT_VIEW()

        if (EDIT_VIEW_ISSHOW || !_this2.nodes.move(evt)) {
          // 节点移动?
          _this2.viewbox.move(evt); // 视图移动

        }
      });

      var VIEW_CENTER = function VIEW_CENTER() {
        var vnodes = _this2.nodes.getfocus().map(function (_ref4) {
          var vnode = _ref4.vnode;
          return vnode;
        });

        if (!vnodes.length) return;

        var _this2$nodes$boxOfVNo = _this2.nodes.boxOfVNodes(vnodes),
            left = _this2$nodes$boxOfVNo.left,
            right = _this2$nodes$boxOfVNo.right,
            top = _this2$nodes$boxOfVNo.top,
            bottom = _this2$nodes$boxOfVNo.bottom;

        var _centerDiffPoint = centerDiffPoint(_this2.viewbox.get(), {
          x: accHF(left, right),
          y: accHF(top, bottom)
        }),
            _centerDiffPoint2 = _slicedToArray(_centerDiffPoint, 3),
            dx = _centerDiffPoint2[0],
            dy = _centerDiffPoint2[1],
            _centerDiffPoint2$ = _centerDiffPoint2[2],
            x = _centerDiffPoint2$.x,
            y = _centerDiffPoint2$.y,
            width = _centerDiffPoint2$.width,
            height = _centerDiffPoint2$.height;

        _this2.viewbox.set({
          x: x + dx,
          y: y + dy,
          width: width,
          height: height
        });
      };

      this.on('VIEW_CENTER', VIEW_CENTER);

      var GROUP = function GROUP(isbind) {
        console.log('----GROUP', _this2.focusedNodes());

        if (isbind) {
          _this2.nodes.bindGroup(_this2.focusedNodes(), _this2.shape);
        } else {
          _this2.nodes.unBindGroup(_this2.focusedNodes());
        }
      };

      var DEL = function DEL() {
        return _this2.nodes.remove();
      };

      var CLOSE = function CLOSE() {
        var node = _this2.focusedNodes()[0];

        if (!node) return;
        console.log({
          node: node
        });
      };

      var PARENT_NODE = function PARENT_NODE() {
        // 选中父节点
        var nodedata = _this2.nodes.getfocus()[0];

        if (!nodedata) return;
        var id = nodedata.vnode.id;

        var parent = _this2.nodes.parent(id);

        if (!parent) return;

        _this2.nodes.focus([parent.vnode.id]);
      };

      var COPY = function COPY() {
        var nodedatas = _this2.nodes.getfocus();

        _this2.nodes.addMultiNode(nodedatas, _this2.shape);
      }; // this.on(STAGE_EVENT.SEARCH_TAG, () => searchTag())


      var ADD_END = function ADD_END() {
        console.log('------ add end --------');

        _this2.nodes.addEnd(_this2.shape);
      };

      var ESC = function ESC() {
        // console.log('----------')
        mark.clear(true); // 清除标签和选中节点
      }; // this.all.clear()

    }
  }, {
    key: "rerender",
    value: function rerender(vdata, view) {
      this.nodes.clear();
      this.viewbox.set(view);
      this.render(vdata);
    }
  }, {
    key: "render",
    value: function render(vdata) {

      this.nodes.render(vdata, this.shape, this.viewbox);
    }
  }, {
    key: "focusedNodes",
    value: function focusedNodes() {
      var _this3 = this;

      var nodes = this.nodes.getfocus();
      return nodes.map(function (_ref5) {
        var node = _ref5.node,
            vnode = _ref5.vnode;
        return {
          node: node,
          vnode: vnode,
          letter: _this3.marks.getLetters(vnode.id)[0]
        };
      });
    }
  }, {
    key: "focusedNodeMarks",
    value: function focusedNodeMarks() {
      var _this4 = this;

      var nodes = this.nodes.getfocus();
      return nodes.map(function (_ref6) {
        var vnode = _ref6.vnode;
        return _this4.marks.getLetters(vnode.id)[0];
      });
    }
  }, {
    key: "selecteNodesOfMark",
    value: function selecteNodesOfMark(chars) {
      if (chars.length < 0) return; // console.log('mark id:', this.marks.getIds(chars))

      var len = this.nodes.focus(this.marks.getIds(chars)); // console.log({ len })

      this.emit('node', this.focusedNodes());
      return len;
    }
  }, {
    key: "update",
    value: function update(_ref7) {
      var type = _ref7.type,
          val = _ref7.val;

      if (type == 'link') {
        val = {
          solidlink: val.solidlink.map(this.marks.getAllIds),
          unlink: val.unlink.map(this.marks.getIds),
          dottedlink: val.dottedlink.map(this.marks.getAllIds)
        };
      }

      this.nodes.update({
        type: type,
        val: val
      }, this.shape);
    }
  }, {
    key: "attach",
    value: function attach(container) {
      this.shape.attach(container);
    }
  }, {
    key: "reset",
    value: function reset(isshowside, _ref8) {
      var width = _ref8.width,
          height = _ref8.height;
      this.viewbox.set({
        width: width,
        height: height
      }, true, isshowside); // if (isshowside) this.emit('VIEW_CENTER')
    }
  }, {
    key: "clear",
    value: function clear() {
      this.all.clear(); // event clear

      this.nodes.clear();
      this.shape.clear(); // this.viewbox.clear()
    } // append(shape) {
    //   this.shapeGen = shape(this.svg)
    // }

  }]);

  return Stage;
}(Event);

var css_base = "::-webkit-scrollbar {\n  width: 5px;\n  height: 2px;\n} /* 滑块宽度 */\n::-webkit-scrollbar-track {\n  background-color: #efefef;\n} /* 滚动条的滑轨背景颜色 */\n::-webkit-scrollbar-thumb {\n  background-color: rgba(0, 0, 0, 0.2);\n} /* 滑块颜色 */\n\nhtml,\nbody {\n  padding: 0;\n  margin: 0;\n  height: 100%;\n  width: 100%;\n  font-family: sans-serif;\n}\n\ntext {\n  user-select: none;\n  cursor: pointer;\n  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,\n    sans-serif;\n}\n\n.w100 {\n  width: 100%;\n}\n\n.w80 {\n  width: 80%;\n}\n\n.w90 {\n  width: 90%;\n}\n\n.tac {\n  text-align: center;\n}\n\n.boxr {\n  box-sizing: border-box;\n}\n\n.input {\n  background: #0000004f;\n  border: 1px solid;\n}\n\n.hb {\n  border: 2px solid red;\n}\n\n.hb::hover {\n  border: 2px solid red;\n}\n\n.hide {\n  display: none;\n}\n\n.g-content {\n  overflow: hidden;\n  display: flex;\n  height: 100%;\n}\n.g-content-svg {\n  flex: 1;\n}\n.g-content-edit-view {\n  width: 40%;\n  display: none;\n  background: #fafafa;\n  height: 100%;\n  border-left: 10px solid #efefef;\n  overflow: hidden;\n}\n.g-content-edit {\n  display: none;\n  font-size: 16px;\n\n  width: 100%;\n  height: 100%;\n  padding: 5% 2%;\n  box-sizing: border-box;\n  border: 0;\n  border-left: 1px solid #ccc;\n  overflow: auto;\n\n  outline: none;\n  resize: none;\n  white-space: normal;\n  tab-size: 2;\n}\n\n.g-content-view {\n  display: none;\n  width: 100%;\n  height: 100%;\n  padding: 5% 2%;\n  box-sizing: border-box;\n  border: 0;\n  border-left: 1px solid #ccc;\n  overflow: auto;\n}\n\n.g-command {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: -60%;\n  margin: auto;\n  width: 40%;\n  min-width: 600px;\n  height: 60px;\n  padding: 10px;\n  opacity: 0.8;\n  background: #f3f3f3;\n  border-radius: 8px;\n  box-shadow: 0 0 3px #bfbfbf;\n  text-align: center;\n}\n\n/* markdown 状态 */\n.g-command.markdown {\n  height: 60%;\n  top: -10%;\n  width: 90%;\n}\n.g-command.markdown .g-command-edit {\n  line-height: 24px;\n  padding: 12px;\n  width: 100%;\n  white-space: normal;\n  overflow: hidden auto;\n}\n.g-command.markdown .g-command-title {\n  display: none;\n}\n\n/* markdown 状态 end */\n\n.g-command.markdown .g-command-edit-wrap {\n  flex: 1;\n  padding: 0;\n}\n.g-command-edit-wrap {\n  flex: 1;\n  padding: 0 14px;\n}\n.g-command-edit {\n  font-size: 24px;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n  border: 0;\n  outline: none;\n  line-height: 60px;\n  resize: none;\n  overflow: auto hidden;\n  white-space: nowrap;\n  tab-size: 2;\n}\n\n.g-command-edit::focus {\n  border: 0;\n  outline: none;\n}\n\n.g-command-ctx {\n  display: flex;\n  font-size: 0;\n  width: 100%;\n  height: 100%;\n  padding: 0;\n  border: 0;\n  border-radius: 8px;\n  outline: none;\n  background: #fff;\n  text-align: left;\n}\n\n.g-command-title {\n  padding: 0 16px;\n  border-radius: 8px 0 0 8px;\n  background: #464646;\n  color: #fff;\n  /* font-size: 38px; */\n  font-size: 30px;\n  display: inline-block;\n  height: 100%;\n  vertical-align: top;\n  line-height: 58px;\n  text-align: center;\n  /* width: 20%; */\n}\n\n.g-theme-stage-title {\n  position: fixed;\n  left: 0;\n  top: 0;\n  z-index: 10;\n  padding: 10px;\n  display: inline-block;\n  background: #f5f5f5;\n}\n\n.u-tag {\n  box-shadow: 0 0 3px #bfbfbf;\n  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));\n}\n\n.g-scene-nodetype {\n  box-shadow: 0 0 9px #bfbfbf;\n  filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.1));\n}\n\n.clear-slot {\n  font-size: 0;\n}\n\nbody pre.flow {\n  background-color: #1e2a3a;\n  color: #fff;\n  font-size: 14px;\n}\nbody pre code {\n  white-space: pre;\n}\n.font-zh {\n  font-size: 1.2em;\n}\n";

var css_textarea = "/* * { */\n/*   -webkit-box-sizing: border-box; */\n/*   -moz-box-sizing: border-box; */\n/*   box-sizing: border-box; */\n/* } */\n.g-content-view {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.g-content-view {\n  background: #fff;\n  word-wrap: break-word;\n  overflow: auto;\n  /* font-family: \"Helvetica Neue\", Helvetica, \"Segoe UI\", Arial, freesans, sans-serif; */\n  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,\n    sans-serif;\n  font-size: 15px;\n  line-height: 1.4em;\n}\n\n.g-content-view pre {\n  background-color: #1e2a3a !important;\n  color: #fff;\n}\n.g-content-view pre code.language-flow {\n  font-size: 13px;\n}\n.g-content-view pre code.language-flow .font-zh {\n  padding-right: 0.3em;\n  font-size: 12px;\n}\n.g-content-view pre .font-zh {\n  font-size: 0.9em;\n}\n\n.g-content-view > *:first-child {\n  margin-top: 0 !important;\n}\n.g-content-view strong {\n  font-weight: bold;\n}\n.g-content-view em {\n  font-style: italic;\n}\n.g-content-view h1,\n.g-content-view h2,\n.g-content-view h3,\n.g-content-view h4,\n.g-content-view h5,\n.g-content-view h6 {\n  position: relative;\n  margin-top: 1em;\n  margin-bottom: 16px;\n  font-weight: bold;\n  line-height: 1.4;\n}\n.g-content-view h1,\n.g-content-view h2 {\n  border-bottom: 1px solid #eee;\n}\n.g-content-view h1 {\n  font-size: 2.25em;\n  line-height: 1.2;\n  padding-bottom: 0.3em;\n}\n.g-content-view h2 {\n  padding-bottom: 0.3em;\n  font-size: 1.75em;\n  line-height: 1.225;\n  border-bottom: 1px dashed #eee;\n}\n.g-content-view blockquote {\n  padding: 0 15px;\n  color: #777;\n  border-left: 4px solid #ddd;\n  margin: 0;\n}\n\n.g-content-view ul blockquote,\n.g-content-view ol blockquote {\n  padding: 0;\n  border-width: 0;\n}\n.g-content-view blockquote > :last-child {\n  margin-bottom: 0;\n}\n.g-content-view blockquote > :first-child {\n  margin-top: 0;\n}\n.g-content-view p,\n.g-content-view blockquote,\n.g-content-view ul,\n.g-content-view ol,\n.g-content-view dl,\n.g-content-view table,\n.g-content-view pre {\n  margin-top: 0;\n  margin-bottom: 16px;\n}\n.g-content-view ul,\n.g-content-view ol {\n  padding-left: 1.4em;\n  list-style: initial;\n}\n.g-content-view ol {\n  list-style-type: decimal;\n}\n.g-content-view ol ol,\n.g-content-view ul ol {\n  list-style-type: lower-roman;\n}\n.g-content-view ul ul ol,\n.g-content-view ul ol ol,\n.g-content-view ol ul ol,\n.g-content-view ol ol ol {\n  list-style-type: lower-alpha;\n}\n.g-content-view pre {\n  padding: 16px;\n  overflow: auto;\n  font-size: 100%;\n  line-height: 1.2;\n  background-color: #eee;\n  border-radius: 3px;\n}\n.g-content-view pre code {\n  background-color: transparent;\n  color: inherit;\n}\n.g-content-view pre code:before,\n.g-content-view pre code:after,\n.g-content-view pre tt:before,\n.g-content-view pre tt:after {\n  letter-spacing: 0;\n  content: '';\n}\n.g-content-view code,\n.g-content-view tt {\n  padding: 0;\n  padding-top: 0.2em;\n  padding-bottom: 0.2em;\n  margin: 0;\n  font-size: 95%;\n  background-color: rgba(0, 0, 0, 0.04);\n  border-radius: 3px;\n  color: #c7254e;\n}\n.g-content-view code:before,\n.g-content-view code:after,\n.g-content-view tt:before,\n.g-content-view tt:after {\n  letter-spacing: -0.2em;\n  content: '\\00a0';\n}\n.g-content-view table {\n  width: 100%;\n  border-collapse: collapse;\n  border-spacing: 0;\n  max-width: 100%;\n  display: block;\n  background-color: transparent;\n}\n.g-content-view table th,\n.g-content-view table td {\n  border: 1px solid #ddd;\n  padding: 4px 10px;\n}\n.g-content-view table th {\n  font-weight: bold;\n  background: #f3f3f3;\n}\n.g-content-view table tr:nth-child(2n) {\n  background-color: #f8f8f8;\n}\n";

var createTheme = function createTheme() {
  var createStageTitle = function createStageTitle() {
    var stageTitleDom = elmt_byid('GStageTitle'); // console.log({ stageTitleDom })

    return {
      txt: function txt(val) {
        // 读取 || 设置
        if (isUnDef(val)) {
          return stageTitleDom.innerHTML;
        }

        return stageTitleDom.innerHTML = val;
      }
    };
  };

  var stageTitle = createStageTitle();
  return {
    stageTitle: stageTitle
  };
};

var createScene = function createScene(options) {
  var scene = new Scene(options);
  return scene;
};
var Scene = /*#__PURE__*/function (_Event) {
  _inherits(Scene, _Event);

  var _super = _createSuper(Scene);

  // 视口, 缩放
  // 舞台上的图形节点
  // 标记
  // shapeGen = null // 图形生成器
  function Scene(options) {
    var _this;

    _classCallCheck(this, Scene);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "viewbox", null);

    _defineProperty(_assertThisInitialized(_this), "nodes", null);

    _defineProperty(_assertThisInitialized(_this), "marks", null);

    _defineProperty(_assertThisInitialized(_this), "shape", null);

    _defineProperty(_assertThisInitialized(_this), "options", null);

    _this.options = options;
    return _this;
  }

  _createClass(Scene, [{
    key: "listen",
    value: function listen() {
      var _this2 = this;

      var mark = marking(this.marks, _objectSpread2(_objectSpread2({}, this.nodes), {}, {
        focusOfMark: this.selecteNodesOfMark.bind(this)
      }));

      var ESC = function ESC() {
        return mark.clear(true);
      }; // 清除标签和选中节点


      this.on(STAGE_EVENT.MOUSEDOWN, function () {
        console.log('---- STAGE_EVENT.MOUSEDOWN -----');

        _this2.emit('ADD_NODE', _this2.focusedNodes());

        return mark.clear();
      });
      this.on(STAGE_EVENT.MOUSEUP, function () {
        _this2.nodes.mouseup();
      });
      this.on(STAGE_EVENT.KEYDOWN, function (evt) {
        if (isEsc(evt)) ESC();
        if (mark.render(evt, true)) return; // 选择节点
      });
    }
  }, {
    key: "render",
    value: function render() {
      // 节点渲染
      var _this$options = this.options,
          left = _this$options.left,
          top = _this$options.top,
          width = _this$options.width,
          height = _this$options.height,
          zoomsize = _this$options.zoomsize,
          attr = _this$options.attr,
          offset = _this$options.offset,
          _this$options$border = _this$options.border,
          border = _this$options$border === void 0 ? 6 : _this$options$border;
      var options = layout({
        left: left,
        top: top,
        width: width,
        height: height,
        zoomsize: zoomsize,
        attr: attr,
        offset: offset,
        border: border
      });
      console.log({
        left: left,
        top: top,
        width: width,
        height: height,
        zoomsize: zoomsize,
        attr: attr,
        offset: offset,
        border: border
      });
      this.shape = shape(borderBox(options));
      this.viewbox = createViewbox({
        width: width,
        height: height,
        zoomsize: zoomsize,
        svg: this.shape.svg()
      });
      this.nodes = createNode({
        left: left - options.offset.left,
        top: top - options.offset.top,
        viewboxScale: function viewboxScale(x, y) {
          return [x, y];
        },
        viewboxInfo: function viewboxInfo() {
          return {
            x: 0,
            y: 0
          };
        }
      });
      this.marks = createMark({
        tag: this.shape.tag,
        viewbox: this.viewbox
      });
      this.listen();
      this.nodes.render(deserializeData(JSON.parse(JSON.stringify(NodeType_Model))), this.shape);
    }
  }, {
    key: "focusedNodes",
    value: function focusedNodes() {
      var _this3 = this;

      var nodes = this.nodes.getfocus();
      return nodes.map(function (_ref) {
        var node = _ref.node,
            vnode = _ref.vnode;
        return {
          node: node,
          vnode: vnode,
          letter: _this3.marks.getLetters(vnode.id)[0]
        };
      });
    }
  }, {
    key: "focusedNodeMarks",
    value: function focusedNodeMarks() {
      var _this4 = this;

      var nodes = this.nodes.getfocus();
      return nodes.map(function (_ref2) {
        var vnode = _ref2.vnode;
        return _this4.marks.getLetters(vnode.id)[0];
      });
    }
  }, {
    key: "selecteNodesOfMark",
    value: function selecteNodesOfMark(chars) {
      if (chars.length == 0) return; // console.log(chars, this.marks.getIds(chars))

      var len = this.nodes.focus(this.marks.getIds(chars));
      this.emit('ADD_NODE', this.focusedNodes());
      return len;
    }
  }, {
    key: "attach",
    value: function attach(container) {
      this.shape.attach(container);
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this$nodes, _this$shape;

      (_this$nodes = this.nodes) === null || _this$nodes === void 0 ? void 0 : _this$nodes.clear();
      (_this$shape = this.shape) === null || _this$shape === void 0 ? void 0 : _this$shape.clear();
      this.shape = null;
      this.viewbox = null; // this.nodes = null
      // this.marks = null
    }
  }]);

  return Scene;
}(Event);

console.log({
  UPDATE: UPDATE
}); //logmid('MAIN::',{ stage_maxuid })

function createStager(_x, _x2, _x3) {
  return _createStager.apply(this, arguments);
}

function _createStager() {
  _createStager = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(board, _ref, _ref2) {
    var width, height, left, top, commander, editview, theme, content, store, stageStack, _local$stage, curuid, minuid, maxuid, stages, initStage, createMounteStage, mounteStage, stageLife, curstage, sync, mounteNodeManageScene, sceneManageFn, sceneManager, _keydown, markFn, mark, _stagechar, articleid, nodeArticleID, saveArticle, viewchange, _mousedown, HISTORY, HISTORY_PREV, HISTORY_NEXT;

    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          width = _ref.width, height = _ref.height, left = _ref.left, top = _ref.top;
          commander = _ref2.commander, editview = _ref2.editview, theme = _ref2.theme;
          content = board.group().attr({
            transform: "translate(".concat(left, ",").concat(top, ")")
          });

          store = function store(isforce) {
            return storeData(_objectSpread2(_objectSpread2({}, stages.info()), {}, {
              data: curstage.nodes.vnodes(),
              view: curstage.viewbox
            }), isforce);
          };

          stageStack = function stageStack(minuid, maxuid) {
            logmid('MAIN::', {
              maxuid: maxuid
            });
            var _stack = [];
            var stage = {};
            return {
              curuid: function curuid() {
                return stage.uid;
              },
              parent: function parent() {
                return stage.parent;
              },
              isroot: function isroot(uid) {
                return uid == 0 || isUnDef(uid);
              },
              stack: function stack(uid) {
                if (isUnDef(uid)) {
                  _stack.pop();
                } else {
                  _stack.push(uid);
                }

                logmid('STAGE_LIFE::', {
                  stack: _stack
                });
                return _stack[_stack.length - 1];
              },
              info: function info(val) {
                return stage = undef(stage, val);
              },
              update: function update(_ref3) {
                var title = _ref3.title,
                    parent = _ref3.parent;
                // logmid('MAIN::',{ title, parent })
                stage.title = undef(stage.title, title);
                stage.parent = undef(stage.parent, parent);
                logmid('STAGE_LIFE::update:stage.uid:', stage.uid);
                return db_stage.send({
                  uid: stage.uid,
                  title: stage.title,
                  parent: stage.parent
                });
              }
            };
          };

          _local$stage = local.stage(), curuid = _local$stage.uid;
          _context8.t0 = curuid;

          if (_context8.t0) {
            _context8.next = 11;
            break;
          }

          _context8.next = 10;
          return db_stage.minuid();

        case 10:
          _context8.t0 = _context8.sent;

        case 11:
          minuid = _context8.t0;
          _context8.next = 14;
          return db_stage.maxuid();

        case 14:
          maxuid = _context8.sent;
          logmid('STAGE_LIFE::', {
            minuid: minuid,
            maxuid: maxuid,
            curuid: curuid
          });
          stages = stageStack(minuid, maxuid);

          initStage = function initStage(_ref4) {
            var vdata = _ref4.vdata,
                view = _ref4.view;
            //logmid('MAIN::',{ vdata, view })
            var stage = createStage({
              width: width,
              height: height,
              left: left,
              top: top,
              zoomsize: view.scale
            });
            stage.viewbox.set(view);
            logmid('MAIN::', {
              vdata: vdata
            });
            stage.render(vdata);
            stage.attach(content);
            return stage;
          }; // 挂载舞台


          createMounteStage = function createMounteStage() {
            var _ismounting = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var _stageData = function stageData(_ref5) {
              var uid = _ref5.uid,
                  title = _ref5.title;
              return createStageData({
                uid: uid,
                parent: stages.info().uid,
                title: title,
                width: width,
                height: height
              });
            };

            return {
              ismounting: function ismounting() {
                return _ismounting;
              },
              stageData: function stageData(_ref6) {
                var uid = _ref6.uid,
                    title = _ref6.title;
                _ismounting = true;
                return _stageData({
                  uid: uid,
                  title: title
                });
              },
              stageParse: function stageParse(_ref7) {
                var uid = _ref7.uid,
                    width = _ref7.width,
                    height = _ref7.height,
                    data = _ref7.data,
                    parent = _ref7.parent,
                    title = _ref7.title;
                return _objectSpread2({
                  uid: uid,
                  parent: parent,
                  title: title
                }, initData({
                  width: width,
                  height: height,
                  data: data,
                  parent: parent,
                  title: title
                }));
              },
              stageRender: function stageRender(_ref8) {
                var uid = _ref8.uid,
                    parent = _ref8.parent,
                    title = _ref8.title,
                    vdata = _ref8.vdata,
                    view = _ref8.view;
                var stage = initStage({
                  vdata: vdata,
                  view: view
                });
                logmid('MAIN::', {
                  uid: uid
                });
                stages.info({
                  uid: uid,
                  parent: parent,
                  title: title
                });
                theme.stageTitle.txt(title);
                _ismounting = false;
                return stage;
              }
            };
          };

          mounteStage = createMounteStage();

          stageLife = /*#__PURE__*/function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(evt) {
              var nodedatas, _nodedatas$0$vnode2, stageid, txt, stage, _stages$info2, parent;

              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    if (!mounteStage.ismounting()) {
                      _context.next = 2;
                      break;
                    }

                    return _context.abrupt("return");

                  case 2:
                    if (!isOpenStage(evt)) {
                      _context.next = 23;
                      break;
                    }

                    // 打开子级舞台
                    //logmid('MAIN::','--- open stage ---',)
                    nodedatas = curstage.focusedNodes();

                    if (nodedatas.length) {
                      _context.next = 6;
                      break;
                    }

                    return _context.abrupt("return");

                  case 6:
                    _nodedatas$0$vnode2 = nodedatas[0].vnode, stageid = _nodedatas$0$vnode2.stage, txt = _nodedatas$0$vnode2.txt;
                    logmid('STAGE_LIFE::stageLife::go:', {
                      stageid: stageid
                    });

                    if (!isUnDef(stageid)) {
                      _context.next = 13;
                      break;
                    }

                    _context.next = 11;
                    return db_stage.maxuid();

                  case 11:
                    _context.t0 = _context.sent;
                    stageid = _context.t0 + 1;

                  case 13:
                    logmid('STAGE_LIFE::stageLife::go:', {
                      stageid: stageid
                    });
                    _context.next = 16;
                    return mounteStage.stageData({
                      uid: stageid,
                      title: txt
                    });

                  case 16:
                    stage = _context.sent;
                    stages.stack(stage.uid);
                    nodedatas[0].vnode.stage = stage.uid;
                    store(true); // 先保存, 放置缓存失效 DOTO:: 需要stageManager管理器模板

                    curstage.clear(); // curstage = await mounteStage({ uid, title: txt })

                    curstage = mounteStage.stageRender(mounteStage.stageParse(stage));
                    return _context.abrupt("return");

                  case 23:
                    if (!isBackStage(evt)) {
                      _context.next = 39;
                      break;
                    }

                    // 返回上级舞台
                    // localmock()
                    store(true);
                    _stages$info2 = stages.info(), parent = _stages$info2.parent;
                    logmid('STAGE_LIFE::', {
                      parent: parent
                    });

                    if (!stages.isroot(parent)) {
                      _context.next = 29;
                      break;
                    }

                    return _context.abrupt("return");

                  case 29:
                    parent = undef(parent, stages.stack());
                    logmid('STAGE_LIFE::', {
                      parent: parent
                    });
                    curstage.clear();
                    _context.t1 = mounteStage;
                    _context.t2 = mounteStage;
                    _context.next = 36;
                    return mounteStage.stageData({
                      uid: parent
                    });

                  case 36:
                    _context.t3 = _context.sent;
                    _context.t4 = _context.t2.stageParse.call(_context.t2, _context.t3);
                    curstage = _context.t1.stageRender.call(_context.t1, _context.t4, true);

                  case 39:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));

            return function stageLife(_x4) {
              return _ref9.apply(this, arguments);
            };
          }();

          curstage = null;

          if (!isDef$1(minuid)) {
            _context8.next = 32;
            break;
          }

          // db有数据 minuid:0 无法进入
          logmid('STAGE_LIFE::', 'LOCAL_STATE_INIT::');
          stages.stack(minuid);
          _context8.t1 = mounteStage;
          _context8.t2 = mounteStage;
          _context8.next = 29;
          return mounteStage.stageData(_objectSpread2(_objectSpread2({}, STAGE), {}, {
            uid: minuid
          }));

        case 29:
          _context8.t3 = _context8.sent;
          _context8.t4 = _context8.t2.stageParse.call(_context8.t2, _context8.t3);
          curstage = _context8.t1.stageRender.call(_context8.t1, _context8.t4);

        case 32:
          sync = createSync(!isDef$1(minuid));
          sync.pubsub.on(SYNC_STAGE_UPDTE, function (_ref10) {
            var uid = _ref10.uid,
                title = _ref10.title,
                data = _ref10.data,
                parent = _ref10.parent,
                updateTime = _ref10.updateTime;
            // 从服务端更新数据
            logmid('STAGE_LIFE::', 'SYNC_STAGE_UPDTE::', stages.curuid(), uid);
            if (stages.curuid() != uid) return;
            data = JSON.parse(data);
            curstage.clear();
            curstage = mounteStage.stageRender(mounteStage.stageParse({
              width: width,
              height: height,
              uid: uid,
              parent: parent,
              title: title,
              data: data,
              updateTime: updateTime
            }));
            store(true);
          });
          sync.pubsub.on(SYNC_STAGE_INIT, function (_ref11) {
            var uid = _ref11.uid,
                title = _ref11.title,
                data = _ref11.data,
                parent = _ref11.parent,
                updateTime = _ref11.updateTime;
            // 从服务端初始数据
            logmid('STAGE_LIFE::', 'SYNC_STAGE_INIT::', {
              uid: uid,
              title: title,
              data: data,
              parent: parent,
              updateTime: updateTime
            });
            data = JSON.parse(data);
            curstage = mounteStage.stageRender(mounteStage.stageParse({
              width: width,
              height: height,
              uid: uid,
              parent: parent,
              title: title,
              data: data,
              updateTime: updateTime
            }));
            store(true);
          });
          sync.pubsub.on(SYNC_STAGE_NOTATA, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  // 没有数据
                  logmid('STAGE_LIFE::', 'SYNC_STAGE_NOTATA::', {
                    minuid: minuid
                  });
                  _context2.t0 = mounteStage;
                  _context2.t1 = mounteStage;
                  _context2.next = 5;
                  return mounteStage.stageData(_objectSpread2(_objectSpread2({}, STAGE), {}, {
                    uid: 1
                  }));

                case 5:
                  _context2.t2 = _context2.sent;
                  _context2.t3 = _context2.t1.stageParse.call(_context2.t1, _context2.t2);
                  curstage = _context2.t0.stageRender.call(_context2.t0, _context2.t3);

                case 8:
                case "end":
                  return _context2.stop();
              }
            }, _callee2);
          })));
          sync.syncOperation();

          mounteNodeManageScene = function mounteNodeManageScene() {
            //logmid('MAIN::','STAGE_EVENT.ADD')
            var managerScene = createScene({
              width: width,
              height: height,
              left: left,
              top: top,
              zoomsize: 1
            });
            managerScene.render();
            managerScene.attach(content);
            return managerScene;
          };

          sceneManageFn = function sceneManageFn() {
            var scenes = [];
            return {
              scenes: scenes,
              has: function has() {
                return !!scenes.length;
              },
              add: function add(curstage) {
                var _this = this;

                if (this.has()) return; //logmid('MAIN::','------add -------')

                var managerScene = mounteNodeManageScene(curstage);
                managerScene.on('ADD_NODE', function (nodes) {
                  if (!nodes.length) return;
                  curstage.nodes.addOfParent(nodes, curstage.shape, curstage.viewbox);

                  _this.clear();
                });
                scenes.push(managerScene);
              },
              clear: function clear() {
                var _scenes$pop;

                (_scenes$pop = scenes.pop()) === null || _scenes$pop === void 0 ? void 0 : _scenes$pop.clear(); // managerScene.clear()
              }
            };
          };

          sceneManager = sceneManageFn();

          _keydown = function keydown(evt, scene) {
            var _scene$update;

            // 各模块调度模板
            commander.exec(evt, scene.nodes, (_scene$update = scene.update) === null || _scene$update === void 0 ? void 0 : _scene$update.bind(scene), // 事件
            scene.focusedNodeMarks(), scene.marks.marked(), scene.selecteNodesOfMark.bind(scene));
            if (commander.state.show()) return;

            if (!editview.state.editshow()) {
              // 选中节点 &&  侧边未显示
              if (mark.trigger(scene, evt).ismarked() && !editview.state.show() && !isGlobalKey(evt)) return;
            }

            if (scene.nodes.hasfocus()) {
              editview.exec(evt, scene.nodes.focusid());
            }

            if (editview.state.editshow() && !isGlobalKey(evt)) return;
            if (editview.state.show() && !isGlobalStageKey(evt)) return; // node 绑定舞台
            // node 解绑舞台

            if (isDel(evt) && scene.nodes.hasfocus()) {
              //
              var nodedatas = scene.focusedNodes();
              nodedatas.forEach(function (_ref13) {
                var stage = _ref13.vnode.stage;
                if (isUnDef(stage)) return;
                db_stage.send({
                  uid: stage,
                  parent: 0
                });
              });
              logmid('MAIN::', {
                nodedatas: nodedatas
              });
            }

            stageLife(evt);
            scene.emit(STAGE_EVENT.KEYDOWN, evt);
            if (isHistoryNext(evt)) return HISTORY_NEXT();
            if (isHistoryPrev(evt)) return HISTORY_PREV();
          };

          markFn = function markFn() {
            var _ismarked = false;
            return {
              ismarking: function ismarking(scene) {
                return scene.marks.marked();
              },
              ismarked: function ismarked() {
                return _ismarked;
              },
              trigger: function trigger(scene, evt) {
                scene.emit(STAGE_EVENT.MARKING, [evt, function (val) {
                  return _ismarked = val;
                }]);
                return this;
              }
            };
          };

          mark = markFn();
          logmid('MAIN::', {
            curstage: curstage
          });
          commander.pubsub.on('STAGE_TITLE_GET', function (editStage) {
            logmid('STAGE_TITLE::get:', theme.stageTitle.txt());
            editStage(theme.stageTitle.txt());
          });
          commander.pubsub.on('STAGE_TITLE_SET', function (title) {
            logmid('STAGE_TITLE::', {
              title: title
            });
            theme.stageTitle.txt(title);
            stages.update({
              title: title
            }).then(function (res) {
              logmid('MAIN::', {
                res: res
              });
            });
          });
          commander.pubsub.on('STAGE_PARENT_ID_GET', function (editStage) {
            logmid('STAGE_PARENT_ID_GET::get:', stages.parent());
            editStage(stages.parent());
          });
          commander.pubsub.on('STAGE_PARENT_ID_SET', function (parent) {
            logmid('STAGE_PARENT_ID_SET::set:', {
              parent: parent
            });
            stages.update({
              parent: parent
            }).then(function (res) {
              logmid('PSTAGE_PARENT_ID_SET::', {
                res: res
              });
            });
          });
          _stagechar = '';
          commander.pubsub.on('STAGE_CONTENT_GET', function (editStage) {
            _stagechar = localget(); // return editStage(_stagechar)

            editStage(JSON.stringify(JSON.parse(_stagechar), function (k, v) {
              return v;
            }, '\t'));
          }); // 接收command中的stage数据

          commander.pubsub.on('STAGE_CONTENT_SET', /*#__PURE__*/function () {
            var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(stagechar) {
              var stage;
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!(_stagechar == stagechar)) {
                      _context3.next = 2;
                      break;
                    }

                    return _context3.abrupt("return");

                  case 2:
                    _context3.prev = 2;
                    stage = jsonparse("".concat(stagechar));
                    logmid('MAIN::', {
                      stage: stage
                    });
                    curstage.clear();
                    _context3.t0 = initStage;
                    _context3.next = 9;
                    return initData({
                      width: width,
                      height: height,
                      data: stage.data
                    });

                  case 9:
                    _context3.t1 = _context3.sent;
                    curstage = (0, _context3.t0)(_context3.t1);
                    _context3.next = 16;
                    break;

                  case 13:
                    _context3.prev = 13;
                    _context3.t2 = _context3["catch"](2);
                    logmid('MAIN::', _context3.t2);

                  case 16:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3, null, [[2, 13]]);
            }));

            return function (_x5) {
              return _ref14.apply(this, arguments);
            };
          }());

          articleid = function articleid(uid) {
            return undef(curstage.nodes.focusids().article, uid);
          };

          nodeArticleID = function nodeArticleID(isNonempty, uid) {
            return isNonempty ? articleid(uid) : undefined;
          };

          saveArticle = /*#__PURE__*/function () {
            var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(_ref15) {
              var data, isNonempty, uid, _yield$db_article$sen, newuid;

              return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    data = _ref15.data, isNonempty = _ref15.isNonempty;

                    if (!isUnDef(data)) {
                      _context4.next = 3;
                      break;
                    }

                    return _context4.abrupt("return");

                  case 3:
                    // 无内容变化
                    uid = articleid();
                    logmid('ARTICLE::', {
                      data: data,
                      isNonempty: isNonempty,
                      uid: uid
                    });
                    _context4.next = 7;
                    return db_article.send({
                      uid: uid,
                      data: data
                    });

                  case 7:
                    _yield$db_article$sen = _context4.sent;
                    newuid = _yield$db_article$sen.uid;
                    // 永久存储
                    logmid('ARTICLE::', {
                      uid: uid,
                      newuid: newuid
                    });
                    curstage.nodes.update({
                      type: UPDATE.ARTICLE_RENDER,
                      val: nodeArticleID(isNonempty, newuid)
                    });
                    store();

                  case 12:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            }));

            return function saveArticle(_x6) {
              return _ref16.apply(this, arguments);
            };
          }();

          viewchange = function viewchange(isNonempty) {
            var w = isNonempty ? viewport.detach(width) : width;
            board.size(w, height).viewbox(0, 0, w, height);
            curstage.reset(isNonempty, {
              width: w,
              height: height
            });
          };

          editview.pubsub.on('EDIT_OPEN', /*#__PURE__*/function () {
            var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(nodeid) {
              var _yield$db_article$fet, _yield$db_article$fet2, article;

              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    logmid('ARTICLE::', {
                      nodeid: nodeid
                    }, articleid());
                    viewchange(true);
                    _context5.next = 4;
                    return db_article.fetchUid(articleid());

                  case 4:
                    _yield$db_article$fet = _context5.sent;
                    _yield$db_article$fet2 = _slicedToArray(_yield$db_article$fet, 1);
                    article = _yield$db_article$fet2[0];
                    // editview.pubsub.emit('EDIT_OPEN_END', article?.data)
                    editview.open(article === null || article === void 0 ? void 0 : article.data);

                  case 8:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5);
            }));

            return function (_x7) {
              return _ref17.apply(this, arguments);
            };
          }());
          editview.pubsub.on('EDIT_SAVE_ARTICLE', saveArticle);
          editview.pubsub.on('EDIT_CLOSE', /*#__PURE__*/function () {
            var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(_ref18) {
              var data, isNonempty, uid;
              return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                  case 0:
                    data = _ref18.data, isNonempty = _ref18.isNonempty;

                    if (isNonempty) {
                      _context6.next = 9;
                      break;
                    }

                    uid = articleid();
                    curstage.nodes.update({
                      type: UPDATE.ARTICLE_RENDER,
                      val: nodeArticleID(isNonempty)
                    });

                    if (isUnDef(uid)) {
                      _context6.next = 7;
                      break;
                    }

                    _context6.next = 7;
                    return db_article["delete"](uid);

                  case 7:
                    _context6.next = 11;
                    break;

                  case 9:
                    _context6.next = 11;
                    return saveArticle({
                      data: data,
                      isNonempty: isNonempty
                    });

                  case 11:
                    editview.close();
                    curstage.nodes.defocus();
                    viewchange(false);

                  case 14:
                  case "end":
                    return _context6.stop();
                }
              }, _callee6);
            }));

            return function (_x8) {
              return _ref19.apply(this, arguments);
            };
          }());

          _mousedown = function mousedown(evt) {
            return function (scene) {
              var x = evt.x,
                  y = evt.y;
              scene.nodes.select({
                x: x,
                y: y
              });
              scene.emit(STAGE_EVENT.MOUSEDOWN, evt);
            };
          };

          HISTORY = function HISTORY(fn) {
            fn().then(function (list) {
              if (list.length == 0) return;
              var _list$0$data = list[0].data,
                  uid = _list$0$data.uid,
                  parent = _list$0$data.parent,
                  data = _list$0$data.data;

              var _JSON$parse = JSON.parse(data),
                  points = _JSON$parse.points,
                  view = _JSON$parse.view;

              logmid('HISTORY::', {
                points: points,
                view: view,
                list: list,
                uid: uid,
                parent: parent
              }); // this.rerender(deserializeData(points), view)
            });
          };

          HISTORY_PREV = function HISTORY_PREV() {
            return HISTORY(db.history(NODE).prev);
          };

          HISTORY_NEXT = function HISTORY_NEXT() {
            return HISTORY(db.history(NODE).next);
          };

          return _context8.abrupt("return", {
            "switch": function _switch(id) {
              // stage_id
              curstage.clear();
            },
            mousemove: function mousemove(evt) {
              if (!curstage) return;
              var x = evt.x,
                  y = evt.y;
              curstage.nodes.hover({
                x: x,
                y: y
              });
              curstage.emit(STAGE_EVENT.MOUSEMOVE, evt);
            },
            mousedown: function mousedown(evt) {
              if (!curstage) return; // 拦截, Command, editview

              if (commander.state.show()) return;
              if (editview.state.show()) return; // TODO:: 找到end

              if (sceneManager.scenes.length) {
                sceneManager.scenes.forEach(_mousedown(evt));
              } else {
                _mousedown(evt)(curstage);
              }
            },
            mouseup: function mouseup(evt) {
              if (!curstage) return; // if (!curstage || !curstage.nodes) return

              curstage.emit(STAGE_EVENT.MOUSEUP, evt); // //logmid('MAIN::',curstage.nodes)

              debounceStoreData(function () {
                return _objectSpread2(_objectSpread2({}, stages.info()), {}, {
                  data: curstage.nodes.vnodes(),
                  view: curstage.viewbox
                });
              });
            },
            keydown: function keydown(evt) {
              return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
                return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                  while (1) switch (_context7.prev = _context7.next) {
                    case 0:
                      if (!mounteStage.ismounting()) {
                        _context7.next = 2;
                        break;
                      }

                      return _context7.abrupt("return");

                    case 2:
                      // 主舞台必须存在
                      if (isEsc(evt)) sceneManager.clear(); // 清除子场景

                      if (isAddNodeManager(evt) && // 添加子场景(满足条件)
                      !mark.ismarking(curstage) && !editview.state.show() && !commander.state.show()) sceneManager.add(curstage);

                      if (!sceneManager.has()) {
                        // 是否存在子场景
                        _keydown(evt, curstage);

                        debounceStoreData(function () {
                          return _objectSpread2(_objectSpread2({}, stages.info()), {}, {
                            data: curstage.nodes.vnodes(),
                            view: curstage.viewbox
                          });
                        });
                      } else {
                        sceneManager.scenes.forEach(function (scene) {
                          return scene.emit(STAGE_EVENT.KEYDOWN, evt);
                        });
                      }

                    case 5:
                    case "end":
                      return _context7.stop();
                  }
                }, _callee7);
              }))();
            }
          });

        case 63:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _createStager.apply(this, arguments);
}

var _this = undefined;

var observe = function observe(operation) {
  return function (source) {
    source(0, function (t, d) {
      if (t === 1) operation(d);
    });
  };
};

{
  var source = function source(start, sink) {
    if (start !== 0) return;
    console.log('Greet');
    sink(0, 'inited ok send message'); // 解构出执行逻辑(模板), 剥离业务模块
    // 剥离出数据源

    setTimeout(function () {
      sink(1, 'vvvv');
    }.bind(_this), 100);
  };

  var operation = function operation() {
    for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }

    return console.log('operation:', arg);
  };

  observe(operation)(source);
}

function makeSubject() {
  var sinks = [];
  var done = false;
  return function (type, data) {
    if (done) return;

    if (type === 0) {
      var sink = data;
      sinks.push(sink);
      sink(0, function (t) {
        if (t === 2) {
          var i = sinks.indexOf(sink);
          if (i > -1) sinks.splice(i, 1);
        }
      });
    } else {
      var zinkz = sinks.slice(0);

      for (var i = 0, n = zinkz.length, _sink2; i < n; i++) {
        _sink2 = zinkz[i];
        if (sinks.indexOf(_sink2) > -1) _sink2(type, data);
      }

      if (type === 2) {
        done = true;
        sinks.length = 0;
      }
    }
  };
}

{
  var subject = makeSubject();
  var count = 0;
  setInterval(function () {
    subject(1, ++count);
  }, 1000); // observe(x => console.log(x + 1))(subject)
  // setTimeout(() => {
  //   observe(x => console.log(x + 2))(subject)
  // }, 2500)
}

function insertCss(css) {
  var style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
  var commander, editview, theme, left, top, _elmt_byid, width, height, board, stager;

  return _regeneratorRuntime().wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        insertCss(css_base); // 插入样式

        insertCss(css_textarea); // 插入样式

        commander = createCommand(); // 初始输入框

        editview = createEditView();
        theme = createTheme();
        _context.next = 7;
        return allUidsPm();

      case 7:
        // 读取db中uid
        left = 0, top = 0; // const width = 0 // document.body.clientWidth
        // const height = 0 //document.body.clientHeight

        _elmt_byid = elmt_byid('GSvg'), width = _elmt_byid.clientWidth, height = _elmt_byid.clientHeight;
        board = SVG().addTo('#GSvg').size(width, height).viewbox(left, top, width, height); // const board = SVG().removeNamespace().addTo('#GSvg').size(width, height).viewbox(left, top, width, height)
        // const stage = boot(draw.group().attr({ transform }), { width, height, top, left }) // 初始画布

        _context.next = 12;
        return createStager(board, {
          width: width,
          height: height,
          top: top,
          left: left
        }, {
          commander: commander,
          editview: editview,
          theme: theme
        });

      case 12:
        stager = _context.sent;
        // 初始画布
        // const ruler = rule(draw.group().attr({ transform }), { width, height, left, top }) // 比例尺
        // ruler.hide()
        // stage.scene.on('scale', (ratio) => {
        //   console.log({ ratio })
        //   const { detail } = ratio
        //   ruler.zoom(detail)
        // })
        //
        // stage.scene.on('move', (offset) => {
        //   const { detail } = offset
        //   console.log(detail)
        //   ruler.move(detail)
        // })
        // window.addEventListener('dbkeydown', (evt) => {})
        window.addEventListener('mousemove', function (evt) {
          stager.mousemove(evt); // requestIdleCallback((deadline) => {
          //   if (deadline.timeRemaining() < 4) return
          //   stager.mousemove(evt)
          // })
        }, {
          passive: false
        });
        window.addEventListener('mouseup', stager.mouseup.bind(stager));
        window.addEventListener('mousedown', stager.mousedown.bind(stager));
        window.addEventListener('keydown', function (evt) {
          // 键盘事件
          // evt.preventDefault()
          evt.keyCode;
              evt.altKey;
              evt.ctrlKey;
              evt.shiftKey; // console.log({ keyCode, altKey, ctrlKey, shiftKey, evt })

          if (isKeyAbort(evt)) return;
          GlobalPreventDefault(evt);
          stager.keydown(evt); // requestIdleCallback((deadline) => {
          //   if (deadline.timeRemaining() < 4) return
          //   stager.keydown(evt)
          // })
        });

      case 17:
      case "end":
        return _context.stop();
    }
  }, _callee);
})));
//# sourceMappingURL=bundle.js.map
