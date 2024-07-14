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
const svg$1 = 'http://www.w3.org/2000/svg';
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
function create (name, ns = svg$1) {
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
function extend$2 (modules, methods) {
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

extend$2([ List ], {
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

  extend$2([ List ], methods);
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
    return this.xml(svgOrFn, outerSVG, svg$1)
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

extend$2(Dom, { attr, find, findOne });
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

extend$2(Element, {
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

extend$2(Ellipse, circled);

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

extend$2(Gradient, gradiented);

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

extend$2(Line, pointed);

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

extend$2(Spring, {
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

extend$2(PID, {
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
  extend$2(morphableTypes, {
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
function array$2 () {
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
  array: array$2,
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

extend$2(Polygon, pointed);
extend$2(Polygon, poly);
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

extend$2(Polyline, pointed);
extend$2(Polyline, poly);
register$1(Polyline, 'Polyline');

class Rect extends Shape {
  // Initialize node
  constructor (node, attrs = node) {
    super(nodeOrNew('rect', node), attrs);
  }
}

extend$2(Rect, { rx, ry });

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

extend$2([ Runner, FakeRunner ], {
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

extend$2(Runner, {
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

extend$2(Runner, { rx, ry, from, to });
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
      .attr({ xmlns: svg$1, version: '1.1' })
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

extend$2(Text, textable);

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

extend$2(Tspan, textable);

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

extend$2(Circle, { x: x$3, y: y$3, cx: cx$1, cy: cy$1, width: width$3, height: height$3 });

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

extend$2(G, containerGeometry);

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

extend$2(A, containerGeometry);

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

extend$2([
  Svg,
  Symbol$3,
  Image,
  Pattern,
  Marker
], getMethodsFor('viewbox'));

extend$2([
  Line,
  Polyline,
  Polygon,
  Path
], getMethodsFor('marker'));

extend$2(Text, getMethodsFor('Text'));
extend$2(Path, getMethodsFor('Path'));

extend$2(Defs, getMethodsFor('Defs'));

extend$2([
  Text,
  Tspan
], getMethodsFor('Tspan'));

extend$2([
  Rect,
  Ellipse,
  Gradient,
  Runner
], getMethodsFor('radius'));

extend$2(EventTarget, getMethodsFor('EventTarget'));
extend$2(Dom, getMethodsFor('Dom'));
extend$2(Element, getMethodsFor('Element'));
extend$2(Shape, getMethodsFor('Shape'));
extend$2([ Container, Fragment ], getMethodsFor('Container'));
extend$2(Gradient, getMethodsFor('Gradient'));

extend$2(Runner, getMethodsFor('Runner'));

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
  isArray: isArray$3
} = Array;

class ReduceStopper {
  constructor(value) {
    this.value = value;
  }

}

function reduceFn(reducer, acc, list) {
  if (!isArray$3(list)) {
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
  if (!isArray$3(list)) {
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

  if (!isArray$3(iterable)) return false;
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

const GlobalPreventDefault = (evt) => {
  const { ctrl, shift, code } = evtmap(evt);
  // console.log('enter:', ctrl, code, enter({ ctrl, code }))
  if (evt.preventDefault && (keyMCtrl({ ctrl, code }) || toggleEdit({ code, ctrl }))) {
    // console.log('---- global prevent')
    evt.preventDefault();
  }
};

const evtmap = (evt) => {
  const { keyCode: code, key, altKey, ctrlKey, shiftKey: shift } = evt;
  const ctrl = altKey || ctrlKey;
  return { key, altKey, ctrl, shift, code }
};

const keyAbort = ({ code, ctrl = false, shift = false }) => (shift && code == 16) || (ctrl && code == 17);
const isKeyAbort = compose(keyAbort, evtmap);
const esc = ({ code, ctrl = false }) => code == 27 || (ctrl && code == 219);
const isEsc = compose(esc, evtmap);

const left = ({ code }) => code == 37 || code == 72; // h
const isLeft = compose(left, evtmap);
const right = ({ code }) => code == 39 || code == 76; // l
const isRight = compose(right, evtmap);
const top = ({ code }) => code == 38 || code == 75; // k
const isTop = compose(top, evtmap);
const bottom = ({ code }) => code == 40 || code == 74; // j
const isBottom = compose(bottom, evtmap);

const zoomIn = ({ code, ctrl = true }) => ctrl && code == 189;
const isZoomIn = compose(zoomIn, evtmap);
const zoomOut = ({ code, ctrl = true }) => ctrl && code == 187;
const isZoomOut = compose(zoomOut, evtmap);
const zoomRest = ({ code, ctrl = true, shift = false }) => ctrl && !shift && code == 48;
const isZoomRest = compose(zoomRest, evtmap);
const zoomMin = ({ code, ctrl = true, shift = false }) => ctrl && shift && code == 48;
const isZoomMin = compose(zoomMin, evtmap);

const copy = ({ code, ctrl = true, shift = false }) => !shift && ctrl && code == 67; // ctrl + c
const isCopy = compose(copy, evtmap);
const close = ({ code }) => code == 67; // C
const isClose = compose(close, evtmap);
const viewCenter = ({ code }) => code == 90; // z
const isViewCenter = compose(viewCenter, evtmap);

const historyPrev = ({ code, ctrl = false }) => ctrl && code == 90; // ctrl + z
const isHistoryPrev = compose(historyPrev, evtmap);
const historyNext = ({ code, ctrl = false, shift = false }) => ctrl && shift && code == 90;
const isHistoryNext = compose(historyNext, evtmap);

const keyMCtrl = ({ code, ctrl = false }) => ctrl && code == 77;
const enter = ({ code, ctrl = false }) => keyMCtrl({ code, ctrl }) || code == 13;
const isEnter = compose(enter, evtmap);

const nextSearch = ({ code, shift = false }) => !shift && code == 78;
compose(nextSearch, evtmap);
const prevSearch = ({ code, shift = false }) => shift && code == 78; // sheft + n
compose(prevSearch, evtmap);
const tagSearch = ({ code, ctrl = false, shift = false }) => !ctrl && !shift && code == 70; // f
const isTagSearch = compose(tagSearch, evtmap);
const parent = ({ code, shift = false }) => code == 80; // sheft + p
const isParent = compose(parent, evtmap);
const editViewKey = ({ code, shift = false }) => !shift && code == 73; //  i
const isEditViewKey = compose(editViewKey, evtmap);

const addNodeManager = ({ code }) => code == 65;
const isAddNodeManager = compose(addNodeManager, evtmap);
// const showAdd = ({ code, shift = false }) => shift && code == 65
// export const isShowAdd = compose(showAdd, evtmap)

const addEnd = ({ code, ctrl = false }) => !ctrl && code == 84;
const isAddEnd = compose(addEnd, evtmap);

const del = ({ code, shift = false }) => shift && code == 68;
const isDel = compose(del, evtmap);
// export const isDel = (code, shift = false) => shift && code == 83
const def = ({ code }) => code == 68; // 设置默认值
compose(def, evtmap);

const space = ({ code }) => code == 32;
const isSpace = compose(space, evtmap);
const tab = ({ code }) => code == 9;
const isTab = compose(tab, evtmap);

const shapeZoomIn = ({ code, shift = false }) => shift && code == 189; // shift + -
const isShapeZoomIn = compose(shapeZoomIn, evtmap);
const shapeZoomOut = ({ code, shift = false }) => shift && code == 187; // shift + +
const isShapeZoomOut = compose(shapeZoomOut, evtmap);

const backspace = ({ code }) => code == 8;
const isBackspace = compose(backspace, evtmap);
const mockBackspace = ({ code, ctrl = false }) => ctrl && code == 89; // ctrl+h
compose(mockBackspace, evtmap);
const shift = ({ code }) => code == 16;
const isShift = compose(shift, evtmap);
const ctrl = ({ code }) => code == 17;
const isCtrl = compose(ctrl, evtmap);

// command
const toggleEdit = ({ code, ctrl = false }) => ctrl && code == 69; // ctrl + e
const isToggleEdit = compose(toggleEdit, evtmap);
const switchPrevCommand = ({ code, ctrl = false, shift = false }) => ctrl && shift && enter({ code });
const isSwitchPrevCommand = compose(switchPrevCommand, evtmap);
const switchNextCommand = ({ code, ctrl, shift = false }) => shift && enter({ ctrl, code });
const isSwitchNextCommand = compose(switchNextCommand, evtmap);

// editview
const isToggleEditView = isToggleEdit;

//  scroll
const scrollUp = ({ code, shift = false }) => shift && space({ code });
const isScrollUp = compose(scrollUp, evtmap);
const scrollDown = ({ code, shift = false }) => !shift && space({ code });
const isScrollDown = compose(scrollDown, evtmap);

// 新舞台
const openStage = ({ code, ctrl = false, shift = true }) => !ctrl && shift && code == 79; // o
const isOpenStage = compose(openStage, evtmap);
const backStage = ({ code, ctrl = false, shift = true }) => !ctrl && shift && code == 66; // B
const isBackStage = compose(backStage, evtmap);

// 新建组
const group$1 = ({ code, ctrl = false, shift = true }) => shift && code == 71; // shift + g
const isGroup = compose(group$1, evtmap);

const ungroup = ({ code, ctrl = false, shift = false }) => !shift && code == 71; // g
const isUnGroup = compose(ungroup, evtmap);

let isSpaceKeyDown = false;

window.addEventListener(
  'keydown',
  (evt) => {
    if (isSpace(evt)) isSpaceKeyDown = true;
    if (isShift(evt)) ;
    if (isCtrl(evt)) ;
  },
  true
);
window.addEventListener(
  'keyup',
  (evt) => {
    if (isSpace(evt)) isSpaceKeyDown = false;
    if (isShift(evt)) ;
    if (isCtrl(evt)) ;
  },
  true
);

// export const isEditView = (...arg) => isCtrlKeyDown && isEditViewKey(...arg)
const isEditView = (evt) => isEditViewKey(evt);
const isCommandEnter = (evt) => !EDIT_VIEW_ISSHOW && isEnter(evt);

const isToggleCommandEdit = (evt) => !EDIT_VIEW_ISSHOW && isToggleEdit(evt);

const isGlobalKey = ({ keyCode, ctrlKey, shiftKey }) => isZoomIn({ keyCode, ctrlKey, shiftKey }) || isZoomOut({ keyCode, ctrlKey, shiftKey });

const isGlobalStageKey = ({ keyCode, ctrlKey, shiftKey }) =>
  isZoomIn({ keyCode, ctrlKey }) ||
  isZoomOut({ keyCode, ctrlKey }) ||
  isLeft({ keyCode }) ||
  isRight({ keyCode }) ||
  isTop({ keyCode }) ||
  isBottom({ keyCode }) ||
  isViewCenter({ keyCode }) ||
  isTagSearch({ keyCode, ctrlKey, shiftKey });

// 上 k,  shift+k,  space+k
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
var isArray$1 = Array.isArray;

var isArray$2 = isArray$1;

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
  if (isArray$2(value)) {
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
var WeakMap = getNative(root$1, 'WeakMap');

var WeakMap$1 = WeakMap;

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

var defineProperty$1 = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var defineProperty$2 = defineProperty$1;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty$2 ? identity : function(func, string) {
  return defineProperty$2(func, 'toString', {
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
  var isArr = isArray$2(value),
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
  if (isArray$2(value)) {
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
  if (isArray$2(value)) {
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
  return isArray$2(value) || isArguments$1(value) ||
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
  return isArray$2(object) ? result : arrayPush(result, symbolsFunc(object));
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
    weakMapCtorString = toSource(WeakMap$1);

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
    (WeakMap$1 && getTag(new WeakMap$1) != weakMapTag)) {
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
  var objIsArr = isArray$2(object),
      othIsArr = isArray$2(other),
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
    (isArray$2(object) || isArguments$1(object));
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
    return isArray$2(value)
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
  quadIn: function (pos) {
    return Math.pow(pos, 2)
  },

  quadOut: function (pos) {
    return -(Math.pow(pos - 1, 2) - 1)
  },

  quadInOut: function (pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 2)
    return -0.5 * ((pos -= 2) * pos - 2)
  },

  cubicIn: function (pos) {
    return Math.pow(pos, 3)
  },

  cubicOut: function (pos) {
    return Math.pow(pos - 1, 3) + 1
  },

  cubicInOut: function (pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 3)
    return 0.5 * (Math.pow(pos - 2, 3) + 2)
  },

  quartIn: function (pos) {
    return Math.pow(pos, 4)
  },

  quartOut: function (pos) {
    return -(Math.pow(pos - 1, 4) - 1)
  },

  quartInOut: function (pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 4)
    return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2)
  },

  quintIn: function (pos) {
    return Math.pow(pos, 5)
  },

  quintOut: function (pos) {
    return Math.pow(pos - 1, 5) + 1
  },

  quintInOut: function (pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 5)
    return 0.5 * (Math.pow(pos - 2, 5) + 2)
  },

  sineIn: function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1
  },

  sineOut: function (pos) {
    return Math.sin(pos * (Math.PI / 2))
  },

  sineInOut: function (pos) {
    return -0.5 * (Math.cos(Math.PI * pos) - 1)
  },

  expoIn: function (pos) {
    return pos == 0 ? 0 : Math.pow(2, 10 * (pos - 1))
  },

  expoOut: function (pos) {
    return pos == 1 ? 1 : -Math.pow(2, -10 * pos) + 1
  },

  expoInOut: function (pos) {
    if (pos == 0) return 0
    if (pos == 1) return 1
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (pos - 1))
    return 0.5 * (-Math.pow(2, -10 * --pos) + 2)
  },

  circIn: function (pos) {
    return -(Math.sqrt(1 - pos * pos) - 1)
  },

  circOut: function (pos) {
    return Math.sqrt(1 - Math.pow(pos - 1, 2))
  },

  circInOut: function (pos) {
    if ((pos /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - pos * pos) - 1)
    return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1)
  },

  backIn: function (pos) {
    var s = 1.70158;
    return pos * pos * ((s + 1) * pos - s)
  },

  backOut: function (pos) {
    pos = pos - 1;
    var s = 1.70158;
    return pos * pos * ((s + 1) * pos + s) + 1
  },

  backInOut: function (pos) {
    var s = 1.70158;
    if ((pos /= 0.5) < 1) return 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s))
    return 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2)
  },

  swingFromTo: function (pos) {
    var s = 1.70158;
    return (pos /= 0.5) < 1 ? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2)
  },

  swingFrom: function (pos) {
    var s = 1.70158;
    return pos * pos * ((s + 1) * pos - s)
  },

  swingTo: function (pos) {
    var s = 1.70158;
    return (pos -= 1) * pos * ((s + 1) * pos + s) + 1
  },

  bounce: function (pos) {
    console.log({ pos });
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
    return l
  },

  bounceOut: function (pos) {
    if (pos < 1 / 2.75) {
      return 7.5625 * pos * pos
    } else if (pos < 2 / 2.75) {
      return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75
    } else if (pos < 2.5 / 2.75) {
      return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375
    } else {
      return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375
    }
  },

  elastic: function (pos) {
    if (pos == !!pos) return pos
    return Math.pow(2, -10 * pos) * Math.sin(((pos - 0.075) * (2 * Math.PI)) / 0.3) + 1
  }
};

const noop = () => {};
const isUnDef = (v) => typeof v == 'undefined' || (typeof v == 'number' && isNaN(v)) || v === null;
// export const isUnDef = (v) => typeof (v) == 'undefined'
const isDef$1 = (v) => !!v;
// export const isDef = (v) => !!v && (typeof (v) != 'string' || typeof (v) != 'number')
const isFunc = (v) => typeof v == 'function';
const isObj = (v) => v != null && typeof v == 'object';
const isStr = (v) => typeof v == 'string';
const undef = (old, now) => (isUnDef(now) ? old : now);
const isDefEqual = (old, now) => (isUnDef(old) ? true : old == now);
const isEmptyStr = (str) => str.trim() == '';
// const issafe = ()=>{}
// export const undefSafe = (old, now) => isUnDef(now) ? old : now
const pickv = (key) => (kv) => kv[key];

const nowsec = () => parseInt(Date.now() / 1000);

const accHF = (base, curval) => base + (curval - base) / 2;

const lastindex = (list) => list.length - 1;
const head = (list) => list[0];
const tail = (list) => list[lastindex(list)];

const stepval = (v, len) => v / len;

const createLock = () => {
  let bool = false;
  return {
    islocked(val) {
      if (val) bool = true;
      return bool
    },
    unlock() {
      bool = false;
    }
  }
};

const prev = (arr, id) => {
  console.log({ arr });
  return arr[arr.indexOf(id) - 1]
};
const next = (arr, id) => {
  return arr[arr.indexOf(id) + 1]
};

// 添加padding
const padding = ({ x, y, width, height }, padval) => {
  if (!isObj(padval)) {
    padval = { top: padval, right: padval, bottom: padval, left: padval };
  }
  const { top, right, bottom, left } = padval;
  return {
    x: x - left,
    y: y - top,
    width: width + left + right,
    height: height + top + bottom
  }
};

const round = (v, offset) => {
  if (isDef$1(offset)) {
    offset = Math.pow(10, offset);
    return Math.round(v * offset) / offset
  }
  return Math.round(v)
};

// lodash as pick
// export const pick = (keys) => (arg) => keys.reduce((memo, k) => { memo[k] = arg[k]; return memo }, {})
// var a = [{ name: 2, v: 4 }, { name: 1, v: 6 }]
// console.log(a.map(pick(['name'])))

const indexOf = (v, k) => v.indexOf(k) != -1;
const include = (parr, carr) => carr.length == intersection$1(parr, carr).length;
const has = (v, k) => {
  if (isArray$2(k)) return include(v, k)
  return indexOf(v, k)
};
const logmid = (...arg) => {
  const theme = [
    // 'patchNodeProperty',
    // 'JSON_PARSE',
    // 'COMMAND',
    // 'cacheAction',
    // 'HISTORY',
    // 'NODE_UPDATE',
    'VNODE',
    // 'DB_CLIENT',
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
    console.log(...arg);
  } else {
    theme.forEach((t) => {
      if (arg[0].indexOf(t) != -1) {
        console.log(...arg);
      }
    });
  }
  return true
};
class GC {}

// import gsap from 'gsap'

// 中心点的差值坐标
const centerDiffPoint = (viewbox, { x, y }) => {
  const {
    x: vx,
    y: vy,
    window: { width, height, scale, isshowside = false }
  } = viewbox;
  // console.log({ width, height }, viewport.sizeTach(isshowside, viewport.detach, width))
  const [sw, sh] = scale(viewport.sizeTach(isshowside, viewport.detach, width), height);
  const [dx, dy] = [x - (vx + sw / 2), y - (vy + sh / 2)];
  return [dx, dy, viewbox]
};

// 真实视口边界范围 [top,right,bottom,left]
const curViewBoundary = (viewbox) => {
  const {
    x: vx,
    y: vy,
    window: { width, height, scale }
  } = viewbox;
  // console.log({ vx, vy, width, height, zoom: scale(1) })
  const [sw, sh] = scale(width, height);
  const [top, right, bottom, left] = [vy, vx + sw, vy + sh, vx];
  return {
    source: [top, right, bottom, left],
    isInViewbox(x, y) {
      return x < left || x > right || y < top || y > bottom
    }
  }
};
const clearzero = (o) =>
  Object.keys(o)
    .filter((k) => !!o[k])
    .reduce((memo, k) => {
      memo[k] = o[k];
      return memo
    }, {});

// 启动程序, 读取存储 初始
const viewboxBoot = (view, { width, height }) => {
  const { width: vw, height: vh, scale, isshowside } = view;
  // console.log({ vw, width, vh, height, scale })
  round(vw / width, 2);
  round(vh / height, 2);
  round(scale, 2);

  view.vw = view.scale * width;
  view.vh = view.scale * height;
  view.width = width;
  view.height = height;
  // console.log({ view })
  return view
};

const viewportGen = (percent) => {
  // 视口变化引发的缩放和恢复
  const ratio = 0.6;
  const scaleratio = 100 / (100 - percent); // 40%: 100/60
  const attach = (scale) => (scale * percent) / 100; // 正向比例, 针对新增窗口
  const detach = (scale) => scale / scaleratio; // 针对老窗口
  const diffscale = (scale) => scale - detach(scale); // 差值
  const sizeTach = (isshowside, fn, val) => (isshowside ? fn(val) : val);
  return { scaleratio, attach, detach, sizeTach, diffscale, ratio }
};
// export const viewport = viewportGen(40)
const viewport = viewportGen(60);
// export const viewport = viewportGen(60)
const createViewbox = ({ width, height, svg, zoomsize = 1 }) => {
  // zoomsize 越大 视图越大(图形缩小了)
  let move = viewboxMove({ width, height, svg });
  const { scale, zoomTo, zoom } = viewboxZoom({ width, height, svg, zoomsize });
  let isshowside = false;
  // 1. 居中, 不回去(恢复窗口大小)
  // 2. 和窗口缩放成正比, 回去(恢复窗口大小)
  // 3. 自定义缩放比例(和窗口大小无关), 居中, 回去(恢复窗口大小)

  return {
    move: move.keydown,
    scale,
    zoom,
    get: () => ({ ...rounds(svg.viewbox()), window: { width, height, scale, isshowside } }),
    set: (vnew, isreset = false, showside = false) => {
      if (!isreset) {
        // 初始
        const { x, y, width, height, vw = width, vh = height } = { ...rounds(svg.viewbox()), ...clearzero(vnew) };
        return svg.viewbox(x, y, vw, vh)
      }

      if (showside) {
        ({ ...rounds(svg.viewbox()) });
        // let [_x, _y, _width, _height, dw, dh] = zoomTo(showside, viewport.scaleratio)
        // console.log({ _x, _y, _width, _height, dw, dh })
        // svg.viewbox(_x + (dw / 2), _y, _width, _height)
      }
      isshowside = showside;

      // 视口变化
      // let [_x, _y, _width, _height, dw] = zoomTo(showside, viewport.scaleratio * viewport.ratio)
      // const dx = (showside ? 1 : -1) * width / 2 / (viewport.scaleratio * viewport.ratio)
      // console.log({ width, height, dw }, viewport.scaleratio, viewport.ratio, dx)
      // svg.viewbox(_x + dx, _y, _width, _height)
      // svg.viewbox(_x + (dw / 2), _y, _width, _height)
      // svg.viewbox(_x + dw / 2, _y, _width, _height).size(width, height)
      // let [_x, _y, _width, _height, dw] = zoomTo(showside, viewport.scaleratio * ratio)
      // svg.viewbox(_x + dw / (2 * (1 - ratio)), _y, _width, _height)
    }
  }
};

const viewboxZoom = ({ width, height, svg, zoomsize }) => {
  // console.log('viewboxZoom::', svg.viewbox(), { width, height })
  const delay = 40;
  let isscaleing = false;
  const easingZoom = easing.sineIn;
  throttle((arg) => {
  }, 100);

  const scaleGen = () => {
    const [defratio, max, min] = [1.1, 5, 0.2];
    return {
      in(val, ratio) {
        ratio = ratio || defratio;
        if (round(zoomsize * ratio, 2) > max) return val
        return round(val * ratio, 2)
      },
      out(val, ratio) {
        ratio = ratio || defratio;
        if (round(zoomsize / ratio, 2) < min) return val
        return round(val / ratio, 2)
      }
    }
  };
  const scale = scaleGen();

  const easeAfter = (state, ratio) => {
    isscaleing = true;
    let size = zoomsize;
    if (state == 'in') size = scale.in(size, ratio);
    if (state == 'out') size = scale.out(size, ratio);
    if (state == 'reset') size = 1;
    return () => {
      // stage.fire('scale', size)
      isscaleing = false;
      zoomsize = size;
    }
  };

  const zoomAnimateIn = (ratio) =>
    svg
      .animate(delay)
      .ease(easingZoom)
      .after(easeAfter('in', ratio))
      .viewbox(...zoomIn(ratio));
  const zoomIn = (ratio) => {
    const { x, y, width, height } = svg.viewbox();
    const [w, h] = [scale.in(width, ratio), scale.in(height, ratio)];
    const [dw, dh] = [w - width, h - height];
    return [x - dw / 2, y - dh / 2, w, h, dw, dh].map((v) => round(v, 2))
  };

  const zoomAnimateOut = (ratio) =>
    svg
      .animate(delay)
      .ease(easingZoom)
      .after(easeAfter('out', ratio))
      .viewbox(...zoomOut(ratio));
  const zoomOut = (ratio) => {
    const { x, y, width, height } = svg.viewbox();
    const [w, h] = [scale.out(width, ratio), scale.out(height, ratio)];
    const [dw, dh] = [w - width, h - height];
    return [x - dw / 2, y - dh / 2, w, h, dw, dh].map((v) => round(v, 2))
  };

  const zoomRest = () => {
    // 中心坐标
    const { x, y } = svg.viewbox();
    const [dx, dy] = centerDiffPoint({ x, y, window: { width, height, scale: scaleMap } }, { x: 0, y: 0 });
    const cx = 0 - dx - width / 2;
    const cy = 0 - dy - height / 2;
    // console.log({ cx, cy, dx: -dx, dy: -dy, width, height })
    return svg.animate(delay).ease(easingZoom).after(easeAfter('reset')).viewbox(cx, cy, width, height)
  };

  const zoomMin = () => {
    // if (zoomsize >= 5) return
    zoomAnimateIn(5 / zoomsize);
  };
  const zoomTo = (isin, ratio) => {
    const ret = isin ? zoomIn(ratio) : zoomOut(ratio);
    easeAfter(isin ? 'in' : 'out', ratio)();
    return ret
  };

  const scaleMap = (...args) => args.map((v) => v * zoomsize);
  return {
    scale: scaleMap,
    zoomTo,
    zoom(evt, prevFn) {
      // console.log(evt)
      const { ctrlKey } = evt;
      if (!ctrlKey) return
      if (!(isZoomIn(evt) || isZoomOut(evt) || isZoomRest(evt) || isZoomMin(evt))) return

      // console.log(vBoundray.boundray())
      evt.preventDefault();
      if (isscaleing) return
      if (isZoomIn(evt)) zoomAnimateIn();
      if (isZoomOut(evt)) zoomAnimateOut();
      if (isZoomRest(evt)) {
        prevFn(); // 前置工作: 选中节点居中
        zoomRest();
      }
      if (isZoomMin(evt)) zoomMin();
      return true // 命中快捷键
    }
  }
};

const viewboxMove = ({ width, height, svg }) => {
  const easingMove = easing.sineIn;
  const delay = 10;
  let ismoveing = false;

  const easeAfter = (state) => {
    ismoveing = true;
    return () => {
      ismoveing = false;
    }
  };

  const dd = (val) => {
    if (isSpaceKeyDown) return 1 * 5
    return round(val / 16)
  };
  const scaleUp = (val, rate = 4) => val * rate;
  const distance = (val) => {
    const v = dd(val);
    return (shiftKey) => (shiftKey ? scaleUp(v) : v)
  };

  const left = (shiftKey) => {
    let { x, y, width, height } = rounds(svg.viewbox());
    x = x - distance(width)(shiftKey);
    svg.animate(delay).ease(easingMove).after(easeAfter()).viewbox(x, y, width, height);
  };
  const right = (shiftKey) => {
    let { x, y, width, height } = rounds(svg.viewbox());
    x = x + distance(width)(shiftKey);
    svg.animate(delay).ease(easingMove).after(easeAfter()).viewbox(x, y, width, height);
  };
  const top = (shiftKey) => {
    let { x, y, width, height } = rounds(svg.viewbox());
    y = y - distance(height)(shiftKey);
    svg.animate(delay).ease(easingMove).after(easeAfter()).viewbox(x, y, width, height);
  };
  const bottom = (shiftKey) => {
    let { x, y, width, height } = rounds(svg.viewbox());
    y = y + distance(height)(shiftKey);
    svg.animate(delay).ease(easingMove).after(easeAfter()).viewbox(x, y, width, height);
  };

  return {
    keydown: (evt) => {
      const { keyCode, shiftKey } = evt;
      if (!(isLeft({ keyCode }) || isRight({ keyCode }) || isTop({ keyCode }) || isBottom({ keyCode }))) return

      evt.preventDefault();
      if (ismoveing) return
      if (isLeft({ keyCode })) left(shiftKey);
      if (isRight({ keyCode })) right(shiftKey);
      if (isTop({ keyCode })) top(shiftKey);
      if (isBottom({ keyCode })) bottom(shiftKey);
    }
  }
};

const rounds = ({ x, y, width, height }) => {
  return {
    x: round(x),
    y: round(y),
    width: round(width),
    height: round(height)
  }
};

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

const DB_TPL = (id) => {
  const common = {
    updateTime: { notNull: true, dataType: jsstore_commonjs2.exports.DATA_TYPE.number },
    syncTime: { notNull: true, dataType: jsstore_commonjs2.exports.DATA_TYPE.number }
  };

  const TPL_OPERATION = {
    name: `OPERATION`,
    columns: {
      uid: { primaryKey: true, unique: true },
      entity: { notNull: true, dataType: jsstore_commonjs2.exports.DATA_TYPE.number }, // 操作实体 0:stage, 1:article
      entityUid: { notNull: true, dataType: jsstore_commonjs2.exports.DATA_TYPE.number }, // 操作的实体对应的用户ID, 示例:删除了用户哪个stage_id
      type: { notNull: true, dataType: jsstore_commonjs2.exports.DATA_TYPE.number }, // 操作类型 0:del,   1:add,     2:update
      ...common
    }
  };
  const TPL_NODE = {
    name: `NODE`,
    columns: {
      uid: { primaryKey: true },
      data: { notNull: true },
      ...common
    }
  };
  const TPL_ARTICLE = {
    name: `ARTICLE`,
    columns: {
      uid: { primaryKey: true, unique: true },
      data: { notNull: true },
      ...common
    }
  };
  const TPL_STAGE = {
    name: `STAGE`,
    columns: {
      uid: { primaryKey: true, unique: true },
      title: { notNull: true },
      parent: { notNull: true, dataType: jsstore_commonjs2.exports.DATA_TYPE.number }, // parent id
      data: { notNull: true }, // {points,view}
      ...common
    }
  };
  const TPL_REMOTE_MAPPING = {
    name: `REMOTE_MAPPING`,
    columns: {
      entity: { notNull: true, dataType: jsstore_commonjs2.exports.DATA_TYPE.number }, // 操作实体 0:stage, 1:article
      entityUid: { notNull: true, dataType: jsstore_commonjs2.exports.DATA_TYPE.number }, // 本地uid
      entityDBUid: { notNull: true, dataType: jsstore_commonjs2.exports.DATA_TYPE.number } // 远程uid
    }
  };
  const DB = {
    name: `DATA_${id}`,
    tables: [TPL_OPERATION, TPL_NODE, TPL_ARTICLE, TPL_STAGE, TPL_REMOTE_MAPPING]
  };
  return {
    DB,
    OPERATION: TPL_OPERATION.name,
    NODE: TPL_NODE.name,
    ARTICLE: TPL_ARTICLE.name,
    STAGE: TPL_STAGE.name,
    REMOTE_MAPPING: TPL_REMOTE_MAPPING.name
  }
};
const { OPERATION, NODE, ARTICLE: ARTICLE$1, STAGE: STAGE$2, REMOTE_MAPPING, DB } = DB_TPL(0);

const connect = (db, id = 0) => db.initDb(DB);

const createDB = ({ middleware }) => {
  // logmid('DB_CLIENT::','import.meta.url', import.meta.url)
  const url = new URL('./jsstore.worker.min.js', import.meta.url);
  const db = new client.Connection(new Worker(url.href));
  // db.addPlugin(plugins)
  db.addMiddleware(middleware);

  const insert = (tpl_name, list, middledata) => db.insert({ into: tpl_name, values: list, middledata });
  const update = (tpl_name, { set, where }, middledata) => db.update({ in: tpl_name, set, where, middledata });
  const remove = (tpl_name, where) => db.remove({ from: tpl_name, where });
  const removeUid = (tpl_name, uid) => db.remove({ from: tpl_name, where: { uid } });
  const select = (tpl_name, where, middledata) => db.select({ from: tpl_name, where, middledata });
  const count = (tpl_name) => db.count({ from: tpl_name });
  const aggregate = (tpl_name, aggregate) => db.select({ from: tpl_name, aggregate });
  const last = (tpl_name) => db.select({ from: tpl_name, order: { by: 'uid', type: 'desc' }, limit: 1 });
  const fetch = (tpl_name, uid) => {
    const options = { from: tpl_name };
    if (!isUnDef(uid)) options.where = { uid };
    return db.select(options)
  };

  // 历史, 独立的uid
  const historycount = 20;
  const historyGen = (tpl_name, uid = 0) => {
    return {
      uid(val) {
        return isUnDef(val) ? uid : (uid = val)
      },
      prev() {
        return fetch(tpl_name, --uid)
      },
      next() {
        return fetch(tpl_name, ++uid)
      }
    }
  };
  // 创建独立的作用域
  const createScope = (uid = 0, i = 0, limit = 1, islock = false) => {
    return {
      probe: () => ++i % limit == 0,
      uid(step) {
        if (isUnDef(step)) return uid
        return (uid += step)
      },
      lock(bool) {
        if (isUnDef(bool)) return islock
        return (islock = bool)
      }
    }
  };
  const TABLES = [OPERATION, NODE, ARTICLE$1, STAGE$2, REMOTE_MAPPING].reduce((memo, tpl_name) => {
    memo[tpl_name] = createScope();
    memo[tpl_name].history = historyGen(tpl_name);
    return memo
  }, {});

  return {
    select,
    update,
    insert,
    remove,
    removeUid,
    aggregate,
    table: (tpl_name) => TABLES[tpl_name],
    history: (tpl_name) => TABLES[tpl_name].history,
    connect() {
      return connect(db).then((isDbCreated) => this.listen(isDbCreated))
    },
    listen(isDbCreated) {
      return this
    },
    send(tpl_name, data, force = false) {
      // force 对比前/后和当前数据差异
      const {
        history: { uid: huid },
        uid,
        probe,
        lock
      } = this.table(tpl_name);
      // logmid('DB_CLIENT::',huid(), uid())
      if (force || (huid() >= uid() && !lock() && probe())) {
        insert(tpl_name, [].concat({ uid: uid(1), data, updateTime: 0, syncTime: 0 }));
        huid(uid());
      }
    },
    fetch(tpl_name, uid) {
      return fetch(tpl_name, uid)
    },
    clear(tpl_name) {
      this.table(tpl_name).lock(false);
      return db.clear(tpl_name)
    },
    stop() {
      TABLES.forEach((tb) => tb.lock(false));
      return db.dropDb().then(() => db.terminate())
    },
    async datainit() {
      await this.connect();
      const lastitem = await last(NODE);
      logmid('DB_CLIENT::', { lastitem });
      if (lastitem.length == 0) return 0
      const uid = lastitem[0].uid;
      this.table(NODE).uid(uid);
      let len = await count(NODE);
      logmid('DB_CLIENT::', 'datainit:', { len, uid });
      if (len > 10) remove(NODE, { uid: { '<': uid - historycount } });
      logmid('DB_CLIENT::', 'uid:', this.history(NODE).uid(uid));

      return uid
    }
  }
};

// 记录uid
const cacheUid =
  (db, TABLE_NAME) =>
  (minid = 0, maxid = 0) => {
    const invalid = (val) => isUnDef(val) || val === 0 || val == Infinity;
    const min = (val) => (minid = undef(minid, val));
    const max = (val) => (maxid = undef(maxid, val));
    // {min:'uid'} => 'min(uid)'
    const merge = (where) => `${Object.keys(where)[0]}(${Object.values(where)[0]})`;
    const fromDB = async (where) => {
      const [item] = await db.aggregate(TABLE_NAME, where);
      const val = undef({}, item)[merge(where)];
      // console.log({ item, val })
      return invalid(val) ? 0 : val
    };
    fromDB({ min: 'uid' }).then(min).catch(console.warn);
    fromDB({ max: 'uid' }).then(max).catch(console.warn);
    return {
      min,
      max,
      async minuid(issync) {
        if (!issync && !invalid(min())) return min()
        return min(await fromDB({ min: 'uid' }))
      },
      async maxuid(issync) {
        if (!issync && !invalid(max())) return max()
        return max(await fromDB({ max: 'uid' }))
      },
      async modify(uids) {
        if (has(uids, min())) await this.minuid(true);
        if (has(uids, max())) await this.maxuid(true);
      }
    }
  };

const createArticle = (db) => {
  const cuid = cacheUid(db, ARTICLE$1)();

  return {
    minuid: cuid.minuid,
    maxuid: cuid.maxuid,
    allUids() {
      return this.fetch().then((list) => list.filter(({ data }) => !!data.trim()).map(({ uid }) => uid))
    },
    fetch(uid) {
      return db.fetch(ARTICLE$1, uid)
    },
    fetchUid(uid, ismapping) {
      if (isUnDef(uid)) return Promise.resolve([])
      // return db.select(ARTICLE, { uid }, { ismapping })
      return this.fetch(uid)
    },
    fetchIn: (uids) => db.select(ARTICLE$1, { uid: { in: uids } }),
    delete(uid) {
      console.log({ uid });
      const ret = db.removeUid(ARTICLE$1, uid);
      cuid.modify([uid]);
      return ret
    },
    async send({ uid, data, updateTime = nowsec(), syncTime = 0 }, ismapping) {
      let isupdate = false,
        isinsert = false;

      const article = await this.fetchUid(uid, ismapping);

      if (article.length > 0) {
        await db.update(ARTICLE$1, { set: { data, updateTime, syncTime }, where: { uid } });
        isupdate = true;
      } else {
        if (db.table(ARTICLE$1).lock()) return
        if (isUnDef(uid)) {
          uid = cuid.max(cuid.max() + 1);
        } else if (uid > cuid.max()) {
          uid = cuid.max(uid);
        } else {
          console.error('uid  小于 maxuid::', { uid }, cuid.max());
        }
        // uid = cuid.max() + 1
        // await db.insert(ARTICLE, [].concat({ uid, updateTime, syncTime, data }), { dbuid: article_id })
        await db.insert(ARTICLE$1, [].concat({ uid, updateTime, syncTime, data }));
        // cuid.max(uid)
        isinsert = true;
      }
      return { uid, isinsert, isupdate }
    }
  }
};

const createNode$1 = (db) => {
  return {
    fetch(uid) {
      return db.fetch(NODE, uid)
    },
    async send(data) {
      // await db.send(NODE, { data, })
      return await db.send(NODE, data)
    }
  }
};

const createStage$1 = (db) => {
  // 记录uid
  const cuid = cacheUid(db, STAGE$2)();
  // logmid('STAGE_LIFE_DB::cuid:', cuid.min(), cuid.max())

  return {
    minuid: () => cuid.minuid(),
    maxuid: () => cuid.maxuid(),
    fetch: (uid) => db.fetch(STAGE$2, uid),
    fetchIn: (uids) => db.select(STAGE$2, { uid: { in: uids } }),
    goasync() {},
    allUids() {
      return this.fetch().then((list) => list.filter(({ data }) => !!data.trim()).map(({ uid }) => uid))
    },
    fetchUid(uid, ismapping) {
      if (isUnDef(uid)) return Promise.resolve([])
      logmid('STAGE_LIFE_DB::', { uid });
      // return db.select(STAGE, { uid }, { ismapping })
      return this.fetch(uid)
    },
    async delete(uids) {
      const ret = await db.remove(STAGE$2, { uid: { in: uids } });
      await cuid.modify(uids);
      return ret
    },
    sendList(list) {
      return db.insert(STAGE$2, list)
    },
    async send({ uid, parent, title, data, updateTime = nowsec(), syncTime }, ismapping) {
      logmid('STAGE_LIFE_DB:send:', { uid });
      let isupdate = false,
        isinsert = false;
      const stage = await this.fetchUid(uid, ismapping);

      // console.log('----------send stage----------', JSON.stringify(data), { stage })
      if (stage.length > 0) {
        const [{ parent: p, title: t, data: d, syncTime: st }] = stage;
        if (isDefEqual(parent, p) && isDefEqual(title, t) && isDefEqual(data, d) && isDefEqual(syncTime, st)) return { uid }
        parent = undef(p, parent);
        title = undef(t, title);
        data = undef(d, data);
        syncTime = undef(st, syncTime);
        // console.log({ parent, title, data, updateTime, syncTime })
        await db.update(STAGE$2, { set: { parent, title, data, updateTime, syncTime }, where: { uid } });
        isupdate = true;
      } else {
        if (db.table(STAGE$2).lock()) return { uid }
        syncTime = undef(0, syncTime);
        parent = undef(0, parent);
        data = undef('{}', data);
        try {
          // 同步存储变异步,记录错误操作, 用于重新发起
          if (isUnDef(uid)) {
            uid = cuid.max(cuid.max() + 1);
          } else if (uid > cuid.max()) {
            uid = cuid.max(uid);
          } else {
            console.error('uid  小于 maxuid::', { uid }, cuid.max());
          }
          //  TODO::如果有重要请求出现存储错误情况, 应在中间件中发起重新操作指令
          // await db.insert(STAGE, [].concat({ uid, parent, title, data, updateTime, syncTime }), { dbuid: stage_id })
          await db.insert(STAGE$2, [].concat({ uid, parent, title, data, updateTime, syncTime }));
        } catch (err) {
          console.log('errr');
          return { uid }
        }
        // cuid.max(uid)
        isinsert = true;
      }
      return { uid, isinsert, isupdate }
    }
  }
};

const createOperation = (db) => {
  const cuid = cacheUid(db, OPERATION)();

  return {
    minuid: cuid.minuid,
    maxuid: cuid.maxuid,
    select(where) {
      return db.select(OPERATION, where)
    },
    allUids() {
      return this.fetch().then((list) => list.filter(({ data }) => !!data.trim()).map(({ uid }) => uid))
    },
    fetch(uid) {
      return db.fetch(OPERATION, uid)
    },
    fetchIn: (entity, entityUids) => db.select(OPERATION, { entity, entityUid: { in: entityUids } }),
    fetchUid(uid) {
      if (isUnDef(uid)) return Promise.resolve([])
      return this.fetch(uid)
    },
    goasync() {},
    sendList(list) {
      return db.insert(OPERATION, list)
    },
    async update({ set, where }) {
      logmid('DB_OPERATION::', '', { set, where });
      await db.update(OPERATION, { set, where });
    },
    async send({ uid, entityUid, entity, type, updateTime = nowsec(), syncTime }) {
      let isupdate = false,
        isinsert = false;
      // console.log('----------send stage----------', JSON.stringify(data))
      const stage = await db.select(OPERATION, { entity, entityUid });
      if (stage.length > 0) {
        const [{ type: t, syncTime: st }] = stage;
        // entityUid = undef(eu, entityUid)
        // entity = undef(e, entity)
        type = undef(t, type);
        syncTime = undef(st, syncTime);
        // console.log({ entity, type, updateTime, syncTime })
        await db.update(OPERATION, { set: { type, updateTime, syncTime }, where: { entity, entityUid } });
        isupdate = true;
      } else {
        if (db.table(OPERATION).lock()) return {}
        syncTime = undef(0, syncTime);
        // uid = cuid.max() + 1
        uid = cuid.max(cuid.max() + 1);
        await db.insert(OPERATION, [].concat({ uid, entityUid, entity, type, updateTime, syncTime }));
        // cuid.max(uid)
        isinsert = true;
      }
      return { uid, isinsert, isupdate }
    }
  }
};

const hasconcat = (arr, item) => [].concat(arr || [], item);

const STAGE$1 = 0,
  ARTICLE = 1;
const isstage = (v) => v == STAGE$1;
const isarticle = (v) => v == ARTICLE;

const DEL = 0,
  ADD = 1,
  UPDATE$1 = 2;
const isdel = (v) => v == DEL;
const isadd = (v) => v == ADD;
const isupdate = (v) => v == UPDATE$1;

// 归并实体
const reduceEntity = (list) => {
  return list.reduce(
    (memo, { entity, entityUid, type, updateTime }) => {
      if (isstage(entity)) {
        memo.stage[entityUid] = hasconcat(memo.stage[entityUid], { type, updateTime });
      }
      if (isarticle(entity)) {
        memo.artical[entityUid] = hasconcat(memo.artical[entityUid], { type, updateTime });
      }
      return memo
    },
    { stage: {}, artical: {} }
  )
};

const operateModel = () => [];
const typeUpdateTime = (local, remote) => {
  // logmid('SYNC_DATA::',{ local, remote })
  const baseLocal = operateModel(),
    baseRemote = operateModel();
  // pre type 唯一值
  // local = reduceType(local)
  // remote = reduceType(remote)
  // const [localType, localUTime] = maxBy(Object.entries(local), ([_, updateTime]) => updateTime)
  // const [remoteType, remoteUTime] = maxBy(Object.entries(remote), ([_, updateTime]) => updateTime)
  // logmid('SYNC_DATA::','oooooooo:', { local, remote })

  const { type: localType, updateTime: localUTime } = maxBy(local, ({ updateTime }) => updateTime);
  const { type: remoteType, updateTime: remoteUTime } = maxBy(remote, ({ updateTime }) => updateTime);
  // logmid('SYNC_DATA::',[localType, localUTime], [remoteType, remoteUTime])
  if (localUTime > remoteUTime) baseRemote.push({ type: localType, updateTime: localUTime });
  if (localUTime < remoteUTime) baseLocal.push({ type: remoteType, updateTime: remoteUTime });
  return { localUpdate: baseLocal, remoteUpdate: baseRemote }
};

// 独有的,丢失的
const lose = (old, now) => {
  return Object.keys(now)
    .filter((entityUid) => isUnDef(old[entityUid]))
    .reduce((memo, key) => {
      memo[key] = now[key];
      return memo
    }, {})
};

// 公共的
const common = (local, remote, commonuids) => {
  logmid('SYNC_DATA::', { commonuids });

  // 本地过滤掉远程没有的, 二者都有的
  return commonuids.reduce(
    (memo, entityUid) => {
      const { localUpdate, remoteUpdate } = typeUpdateTime(local[entityUid], remote[entityUid]);
      memo.local[entityUid] = hasconcat(memo.local[entityUid], localUpdate);
      memo.remote[entityUid] = hasconcat(memo.remote[entityUid], remoteUpdate);
      return memo
    },
    { local: {}, remote: {} }
  )
  // }, { local: loseLocal, remote: loseRemote })
};

// {entity:[{type,updateTime}]}
const margeUpdateTime = (local, remote) => {
  // logmid('SYNC_DATA::',{ local, remote })
  const loseLocal = lose(local, remote); // 本地没有
  const loseRemote = lose(remote, local); // 远程没有
  logmid('SYNC_DATA::', { loseRemote, loseLocal });

  const localUniqueUids = Object.keys(loseRemote);
  const commonuids = Object.keys(local).filter((entityUid) => !has(localUniqueUids, entityUid));
  const { local: commonLocal, remote: commonRemote } = common(local, remote, commonuids);
  return { local: { ...loseLocal, ...commonLocal }, remote: { ...loseRemote, ...commonRemote } }
};

const filterEmpty = (karr) =>
  Object.keys(karr).reduce((memo, k) => {
    if (karr[k].length) memo[k] = karr[k];
    return memo
  }, {});

const update = (local, remote) => {
  const { local: l, remote: r } = margeUpdateTime(local, remote);
  logmid('SYNC_DATA::', { l, r, local, remote });
  return { local: filterEmpty(l), remote: filterEmpty(r) }
};

const merge$1 = (local, remote) => {
  // logmid('SYNC_DATA::',JSON.stringify(local))
  logmid('SYNC_DATA::', { local, remote });
  return {
    stageUpdate: update(reduceEntity(local).stage, reduceEntity(remote).stage),
    articleUpdate: update(reduceEntity(local).artical, reduceEntity(remote).artical),
    deleted: ({ local, remote }, { entity, deletedEntityUidS }) => {
      deletedEntityUidS.forEach(({ entityUid }) => {
        delete remote[entityUid];
        local[entityUid] = [{ entity, type: 0, entityUid, updateTime: nowsec() }];
      });
      return { local, remote }
    }
  }
};

// merge(local, remote)

const tnames = [STAGE$2, ARTICLE$1];
const getEntity = (t) => tnames.indexOf(t);

const middleware = (request) => {
  const { middledata = {}, from, into, in: update, set, where, values } = request.query;
  const entity = getEntity(into || update || from);

  // console.log('request.name:', request.name, request, entity)
  // console.log({ middledata, into, update, set, where, values, entity })
  if (entity == -1) return // 从服务端同步的数据, 无需触发中间件
  // if (entity == -1 || middledata.ignore) return // 从服务端同步的数据, 无需触发中间件

  const action = {
    select() {
      // if (middledata.ismapping && !isUnDef(request.query.where?.uid)) {
      //   console.log(request.query.where.uid)
      //   request.query.where.uid = db_mapping.map.rtl(entity, request.query.where.uid)
      //   console.log(request.query.where.uid)
      // }
      // request.onResult((result) => {
      //   return result
      // })
    },
    insert() {
      request.onResult((result) => {
        // console.log('----middleware::insert-----', { request }, query.where, query.set)
        const data = values[0];
        const updateTime = data.updateTime;
        const entityUid = data.uid;
        // console.log({ data, middledata })
        if (isstage(entity)) {
          db_operation.send({ entity, type: 1, entityUid, updateTime });
          // db_mapping.send({ entity, entityUid, entityDBUid: middledata.dbuid })
          // db_stage.maxuid().then((entityUid) => {
          //   logmid('DB_OPERATION::insert:', 'stage:', entityUid)
          // })
        } else if (isarticle(entity)) {
          db_operation.send({ entity, type: 1, entityUid, updateTime });
          // db_mapping.send({ entity, entityUid, entityDBUid: middledata.dbuid })
          // db_article.maxuid().then((entityUid) => {
          //   logmid('DB_OPERATION::insert:', 'article:', entityUid)
          // })
        }

        return result
      });
    },
    update() {
      request.onResult((result) => {
        const entityUid = where.uid;
        const updateTime = set.updateTime;

        if (set.parent == 0) {
          // 把节点删除, 节点对应的舞台变为游离
          db_stage.minuid().then((rootuid) => {
            // 根节点
            logmid('DB_OPERATION::', '', { entityUid, rootuid });
            if (entityUid == rootuid) {
              // 根节点默认是游离
              db_operation.update({ set: { type: 2, updateTime }, where: { entity, entityUid } });
            } else {
              db_operation.update({ set: { type: 0, updateTime }, where: { entity, entityUid } });
            }
          });
          logmid('DB_OPERATION::', 'unbind');
        } else {
          db_operation.send({ type: 2, updateTime, entity, entityUid });
          logmid('DB_OPERATION::', 'update stage', { entityUid, entity });
        }
        return result
      });
    },
    delete() {
      // console.log('----delete-----', query.where, query.set)
    }
  };
  action[request.name] && action[request.name]();
};

const db = createDB({ middleware });
const db_node = createNode$1(db);
const db_article = createArticle(db);
const db_stage = createStage$1(db);
const db_operation = createOperation(db);

const elmt_byid = (id) => document.getElementById(id);
const elmt_style = (dom, v) => {
  const deserialize = (str) =>
    str
      .split(';')
      .filter((v) => v)
      .map((item) => item.split(':'))
      .reduce((memo, [k, v]) => {
        memo[k] = v;
        return memo
      }, {});
  const mergeVal = { ...deserialize(dom.getAttribute('style') || ''), ...deserialize(v) };
  const serialize = (val) =>
    Object.keys(val)
      .reduce((memo, k) => {
        memo.push(`${k}:${val[k]}`);
        return memo
      }, [])
      .join(';');
  dom.setAttribute('style', serialize(mergeVal));
};
const elmt_display = (dom, v) => elmt_style(dom, `display:${v}`);
const elmt_classname = (dom, v) => dom.setAttribute('class', v);

// textarea tab 快捷键
const textareaTab = (elm) => {
  var start = elm.selectionStart;
  var end = elm.selectionEnd;

  elm.value = elm.value.substring(0, start) + '\t' + elm.value.substring(end);
  elm.selectionStart = elm.selectionEnd = start + 1;
};

const showGen = (dom) => {
  let isshow = false;
  return {
    show(bool) {
      if (isUnDef(bool) || bool == isshow) return isshow
      elmt_display(dom, (isshow = bool) ? 'block' : 'none');
      return isshow
    }
  }
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
	var _self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{},Prism=function(e){var n=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,t=0,r={},a={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(n){return n instanceof i?new i(n.type,e(n.content),n.alias):Array.isArray(n)?n.map(e):n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++t}),e.__id},clone:function e(n,t){var r,i;switch(t=t||{},a.util.type(n)){case"Object":if(i=a.util.objId(n),t[i])return t[i];for(var l in r={},t[i]=r,n)n.hasOwnProperty(l)&&(r[l]=e(n[l],t));return r;case"Array":return i=a.util.objId(n),t[i]?t[i]:(r=[],t[i]=r,n.forEach((function(n,a){r[a]=e(n,t);})),r);default:return n}},getLanguage:function(e){for(;e;){var t=n.exec(e.className);if(t)return t[1].toLowerCase();e=e.parentElement;}return "none"},setLanguage:function(e,t){e.className=e.className.replace(RegExp(n,"gi"),""),e.classList.add("language-"+t);},currentScript:function(){if("undefined"==typeof document)return null;if("currentScript"in document)return document.currentScript;try{throw new Error}catch(r){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack)||[])[1];if(e){var n=document.getElementsByTagName("script");for(var t in n)if(n[t].src==e)return n[t]}return null}},isActive:function(e,n,t){for(var r="no-"+n;e;){var a=e.classList;if(a.contains(n))return !0;if(a.contains(r))return !1;e=e.parentElement;}return !!t}},languages:{plain:r,plaintext:r,text:r,txt:r,extend:function(e,n){var t=a.util.clone(a.languages[e]);for(var r in n)t[r]=n[r];return t},insertBefore:function(e,n,t,r){var i=(r=r||a.languages)[e],l={};for(var o in i)if(i.hasOwnProperty(o)){if(o==n)for(var s in t)t.hasOwnProperty(s)&&(l[s]=t[s]);t.hasOwnProperty(o)||(l[o]=i[o]);}var u=r[e];return r[e]=l,a.languages.DFS(a.languages,(function(n,t){t===u&&n!=e&&(this[n]=l);})),l},DFS:function e(n,t,r,i){i=i||{};var l=a.util.objId;for(var o in n)if(n.hasOwnProperty(o)){t.call(n,o,n[o],r||o);var s=n[o],u=a.util.type(s);"Object"!==u||i[l(s)]?"Array"!==u||i[l(s)]||(i[l(s)]=!0,e(s,t,o,i)):(i[l(s)]=!0,e(s,t,null,i));}}},plugins:{},highlightAll:function(e,n){a.highlightAllUnder(document,e,n);},highlightAllUnder:function(e,n,t){var r={callback:t,container:e,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};a.hooks.run("before-highlightall",r),r.elements=Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)),a.hooks.run("before-all-elements-highlight",r);for(var i,l=0;i=r.elements[l++];)a.highlightElement(i,!0===n,r.callback);},highlightElement:function(n,t,r){var i=a.util.getLanguage(n),l=a.languages[i];a.util.setLanguage(n,i);var o=n.parentElement;o&&"pre"===o.nodeName.toLowerCase()&&a.util.setLanguage(o,i);var s={element:n,language:i,grammar:l,code:n.textContent};function u(e){s.highlightedCode=e,a.hooks.run("before-insert",s),s.element.innerHTML=s.highlightedCode,a.hooks.run("after-highlight",s),a.hooks.run("complete",s),r&&r.call(s.element);}if(a.hooks.run("before-sanity-check",s),(o=s.element.parentElement)&&"pre"===o.nodeName.toLowerCase()&&!o.hasAttribute("tabindex")&&o.setAttribute("tabindex","0"),!s.code)return a.hooks.run("complete",s),void(r&&r.call(s.element));if(a.hooks.run("before-highlight",s),s.grammar)if(t&&e.Worker){var c=new Worker(a.filename);c.onmessage=function(e){u(e.data);},c.postMessage(JSON.stringify({language:s.language,code:s.code,immediateClose:!0}));}else u(a.highlight(s.code,s.grammar,s.language));else u(a.util.encode(s.code));},highlight:function(e,n,t){var r={code:e,grammar:n,language:t};if(a.hooks.run("before-tokenize",r),!r.grammar)throw new Error('The language "'+r.language+'" has no grammar.');return r.tokens=a.tokenize(r.code,r.grammar),a.hooks.run("after-tokenize",r),i.stringify(a.util.encode(r.tokens),r.language)},tokenize:function(e,n){var t=n.rest;if(t){for(var r in t)n[r]=t[r];delete n.rest;}var a=new s;return u(a,a.head,e),o(e,a,n,a.head,0),function(e){for(var n=[],t=e.head.next;t!==e.tail;)n.push(t.value),t=t.next;return n}(a)},hooks:{all:{},add:function(e,n){var t=a.hooks.all;t[e]=t[e]||[],t[e].push(n);},run:function(e,n){var t=a.hooks.all[e];if(t&&t.length)for(var r,i=0;r=t[i++];)r(n);}},Token:i};function i(e,n,t,r){this.type=e,this.content=n,this.alias=t,this.length=0|(r||"").length;}function l(e,n,t,r){e.lastIndex=n;var a=e.exec(t);if(a&&r&&a[1]){var i=a[1].length;a.index+=i,a[0]=a[0].slice(i);}return a}function o(e,n,t,r,s,g){for(var f in t)if(t.hasOwnProperty(f)&&t[f]){var h=t[f];h=Array.isArray(h)?h:[h];for(var d=0;d<h.length;++d){if(g&&g.cause==f+","+d)return;var v=h[d],p=v.inside,m=!!v.lookbehind,y=!!v.greedy,k=v.alias;if(y&&!v.pattern.global){var x=v.pattern.toString().match(/[imsuy]*$/)[0];v.pattern=RegExp(v.pattern.source,x+"g");}for(var b=v.pattern||v,w=r.next,A=s;w!==n.tail&&!(g&&A>=g.reach);A+=w.value.length,w=w.next){var E=w.value;if(n.length>e.length)return;if(!(E instanceof i)){var P,L=1;if(y){if(!(P=l(b,A,e,m))||P.index>=e.length)break;var S=P.index,O=P.index+P[0].length,j=A;for(j+=w.value.length;S>=j;)j+=(w=w.next).value.length;if(A=j-=w.value.length,w.value instanceof i)continue;for(var C=w;C!==n.tail&&(j<O||"string"==typeof C.value);C=C.next)L++,j+=C.value.length;L--,E=e.slice(A,j),P.index-=A;}else if(!(P=l(b,0,E,m)))continue;S=P.index;var N=P[0],_=E.slice(0,S),M=E.slice(S+N.length),W=A+E.length;g&&W>g.reach&&(g.reach=W);var z=w.prev;if(_&&(z=u(n,z,_),A+=_.length),c(n,z,L),w=u(n,z,new i(f,p?a.tokenize(N,p):N,k,N)),M&&u(n,w,M),L>1){var I={cause:f+","+d,reach:W};o(e,n,t,w.prev,A,I),g&&I.reach>g.reach&&(g.reach=I.reach);}}}}}}function s(){var e={value:null,prev:null,next:null},n={value:null,prev:e,next:null};e.next=n,this.head=e,this.tail=n,this.length=0;}function u(e,n,t){var r=n.next,a={value:t,prev:n,next:r};return n.next=a,r.prev=a,e.length++,a}function c(e,n,t){for(var r=n.next,a=0;a<t&&r!==e.tail;a++)r=r.next;n.next=r,r.prev=n,e.length-=a;}if(e.Prism=a,i.stringify=function e(n,t){if("string"==typeof n)return n;if(Array.isArray(n)){var r="";return n.forEach((function(n){r+=e(n,t);})),r}var i={type:n.type,content:e(n.content,t),tag:"span",classes:["token",n.type],attributes:{},language:t},l=n.alias;l&&(Array.isArray(l)?Array.prototype.push.apply(i.classes,l):i.classes.push(l)),a.hooks.run("wrap",i);var o="";for(var s in i.attributes)o+=" "+s+'="'+(i.attributes[s]||"").replace(/"/g,"&quot;")+'"';return "<"+i.tag+' class="'+i.classes.join(" ")+'"'+o+">"+i.content+"</"+i.tag+">"},!e.document)return e.addEventListener?(a.disableWorkerMessageHandler||e.addEventListener("message",(function(n){var t=JSON.parse(n.data),r=t.language,i=t.code,l=t.immediateClose;e.postMessage(a.highlight(i,a.languages[r],r)),l&&e.close();}),!1),a):a;var g=a.util.currentScript();function f(){a.manual||a.highlightAll();}if(g&&(a.filename=g.src,g.hasAttribute("data-manual")&&(a.manual=!0)),!a.manual){var h=document.readyState;"loading"===h||"interactive"===h&&g&&g.defer?document.addEventListener("DOMContentLoaded",f):window.requestAnimationFrame?window.requestAnimationFrame(f):window.setTimeout(f,16);}return a}(_self);module.exports&&(module.exports=Prism),"undefined"!=typeof commonjsGlobal&&(commonjsGlobal.Prism=Prism);
	Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity,Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup,Prism.hooks.add("wrap",(function(a){"entity"===a.type&&(a.attributes.title=a.content.replace(/&amp;/,"&"));})),Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(a,e){var s={};s["language-"+e]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[e]},s.cdata=/^<!\[CDATA\[|\]\]>$/i;var t={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:s}};t["language-"+e]={pattern:/[\s\S]+/,inside:Prism.languages[e]};var n={};n[a]={pattern:RegExp("(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(/__/g,(function(){return a})),"i"),lookbehind:!0,greedy:!0,inside:t},Prism.languages.insertBefore("markup","cdata",n);}}),Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(a,e){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp("(^|[\"'\\s])(?:"+a+")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))","i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[e,"language-"+e],inside:Prism.languages[e]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}});}}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup,Prism.languages.xml=Prism.languages.extend("markup",{}),Prism.languages.ssml=Prism.languages.xml,Prism.languages.atom=Prism.languages.xml,Prism.languages.rss=Prism.languages.xml;
	!function(s){var e=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;s.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:[^;{\\s\"']|\\s+(?!\\s)|"+e.source+")*?(?:;|(?=\\s*\\{))"),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+e.source+"|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+e.source+"$"),alias:"url"}}},selector:{pattern:RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|"+e.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:e,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},s.languages.css.atrule.inside.rest=s.languages.css;var t=s.languages.markup;t&&(t.tag.addInlined("style","css"),t.tag.addAttribute("style","css"));}(Prism);
	Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/};
	Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp("(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])"),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp("((?:^|[^$\\w\\xA0-\\uFFFF.\"'\\])\\s]|\\b(?:return|yield))\\s*)/(?:(?:\\[(?:[^\\]\\\\\r\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|/\\*(?:[^*]|\\*(?!/))*\\*/)*(?:$|[\r\n,.;:})\\]]|//))"),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute("on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)","javascript")),Prism.languages.js=Prism.languages.javascript;
	Prism.languages.c=Prism.languages.extend("clike",{comment:{pattern:/\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},string:{pattern:/"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,greedy:!0},"class-name":{pattern:/(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,lookbehind:!0},keyword:/\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,function:/\b[a-z_]\w*(?=\s*\()/i,number:/(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,operator:/>>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/}),Prism.languages.insertBefore("c","string",{char:{pattern:/'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,greedy:!0}}),Prism.languages.insertBefore("c","string",{macro:{pattern:/(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,lookbehind:!0,greedy:!0,alias:"property",inside:{string:[{pattern:/^(#\s*include\s*)<[^>]+>/,lookbehind:!0},Prism.languages.c.string],char:Prism.languages.c.char,comment:Prism.languages.c.comment,"macro-name":[{pattern:/(^#\s*define\s+)\w+\b(?!\()/i,lookbehind:!0},{pattern:/(^#\s*define\s+)\w+\b(?=\()/i,lookbehind:!0,alias:"function"}],directive:{pattern:/^(#\s*)[a-z]+/,lookbehind:!0,alias:"keyword"},"directive-hash":/^#/,punctuation:/##|\\(?=[\r\n])/,expression:{pattern:/\S[\s\S]*/,inside:Prism.languages.c}}}}),Prism.languages.insertBefore("c","function",{constant:/\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/}),delete Prism.languages.c.boolean;
	!function(e){var t=/\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,n="\\b(?!<keyword>)\\w+(?:\\s*\\.\\s*\\w+)*\\b".replace(/<keyword>/g,(function(){return t.source}));e.languages.cpp=e.languages.extend("c",{"class-name":[{pattern:RegExp("(\\b(?:class|concept|enum|struct|typename)\\s+)(?!<keyword>)\\w+".replace(/<keyword>/g,(function(){return t.source}))),lookbehind:!0},/\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,/\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,/\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/],keyword:t,number:{pattern:/(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,greedy:!0},operator:/>>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,boolean:/\b(?:false|true)\b/}),e.languages.insertBefore("cpp","string",{module:{pattern:RegExp('(\\b(?:import|module)\\s+)(?:"(?:\\\\(?:\r\n|[^])|[^"\\\\\r\n])*"|<[^<>\r\n]*>|'+"<mod-name>(?:\\s*:\\s*<mod-name>)?|:\\s*<mod-name>".replace(/<mod-name>/g,(function(){return n}))+")"),lookbehind:!0,greedy:!0,inside:{string:/^[<"][\s\S]+/,operator:/:/,punctuation:/\./}},"raw-string":{pattern:/R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,alias:"string",greedy:!0}}),e.languages.insertBefore("cpp","keyword",{"generic-function":{pattern:/\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,inside:{function:/^\w+/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:e.languages.cpp}}}}),e.languages.insertBefore("cpp","operator",{"double-colon":{pattern:/::/,alias:"punctuation"}}),e.languages.insertBefore("cpp","class-name",{"base-clause":{pattern:/(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,lookbehind:!0,greedy:!0,inside:e.languages.extend("cpp",{})}}),e.languages.insertBefore("inside","double-colon",{"class-name":/\b[a-z_]\w*\b(?!\s*::)/i},e.languages.cpp["base-clause"]);}(Prism);
} (code$1));

var code = code$1.exports;

// import { marked } from './textarea.js'
console.log({ code });


const render = new Renderer();
const renderer = {
  heading(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return `
            <h${level}>
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${level}>`
  },
  code(code, infostring, escaped) {
    // console.log(render.code(code, infostring, escaped))
    return render.code(code, infostring, escaped).replace(/[\u4e00-\u9fa5]/g, (v) => {
      return `<span class="font-zh">${v}</span>`
    })

    // const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');

  }
};

marked$1.use({ renderer });

var marked = (arg) => {
  // console.log({ arg })
  if (arg == '') return 'Not Found'
  return marked$1(arg)
};

const createScroll = (viewer) => {
  return {
    down: () => viewer.scrollTo(viewer.scrollTo() + 100),
    up: () => viewer.scrollTo(viewer.scrollTo() - 100)
  }
  // let scrollTop = 0
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

let EDIT_VIEW_ISSHOW = false;

const container = (t, d) => {
  const evDom = elmt_byid('GEditAndView');
  elmt_style(evDom, `width:${viewport.attach(100)}%;`);
  const { show } = showGen(evDom);
  return { show: (val) => (EDIT_VIEW_ISSHOW = show(val)) }
};

const edit = () => {
  const editDom = elmt_byid('GEdit');
  const { show } = showGen(editDom);

  editDom.addEventListener('keydown', (evt) => {
    if (!isTab(evt)) return
    evt.preventDefault();
    textareaTab(editDom);
  });
  return {
    show,
    value: (val) => (editDom.value = undef(editDom.value, val)),
    focus() {
      editDom.focus();
      return this
    },
    clear() {
      this.show(false);
      this.value('');
    }
  }
};

const view = () => {
  const viewDom = elmt_byid('GView');
  const { show } = showGen(viewDom);
  return {
    show, // TODO:: 添加遮罩动画
    // focus(){viewDom.click()},
    value: (val) => (viewDom.innerHTML = undef(viewDom.innerHTML, val)),
    scrollTo: (val) => (viewDom.scrollTop = undef(viewDom.scrollTop, val)),
    maxTop: () => viewDom.scrollHeight - viewDom.clientHeight,
    clear() {
      this.show(false);
      this.value('');
    }
  }
};

const createEditView = () => {
  const pubsub = new Event();
  const { show } = container();
  const editer = edit();
  const viewer = view();
  const scroll = createScroll(viewer);

  const cacheGen = () => {
    let uid = 0;
    let article = 'Not Found';
    return {
      uid: (val) => (uid = undef(uid, val)),
      value: (val) => (article = undef(article, val)),
      clear() {
        this.uid(0);
        this.value('');
      }
    }
  };
  const cache = cacheGen();

  const articleData = (prevToggle) => {
    // 永久存储
    const editval = editer.value();
    const isNonempty = !isEmptyStr(editval);
    if (cache.value() == editval) return { isNonempty } // 存储
    prevToggle && prevToggle(editval);

    return { uid: cache.uid(), data: editval, isNonempty } // 永久存储
  };

  // pubsub.on('EDIT_OPEN_END', (data = '') => { // 拉取||新建数据完成hook
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

  const open = (data = '') => {
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
  };

  // pubsub.on('EDIT_CLOSE_END', () => { // 发送完成hook
  //   show(false)
  //   cache.clear()
  //   editer.clear()
  //   viewer.clear()
  // })

  const close = () => {
    show(false);
    cache.clear();
    editer.clear();
    viewer.clear();
  };

  // isnode 是否选中节点, 不选中节点不应该进入
  const exec = (evt, nodeid) => {
    if (isUnDef(nodeid)) return
    // console.log('editview::', { nodeid })
    // 关闭, 清除工作
    if (isEsc(evt) && show()) {
      pubsub.emit('EDIT_CLOSE', articleData()); // 存储数据
      return
    }

    // (没有打开eidtview) || (非快捷键) => 走你
    if (!show() && !isEditView(evt)) return

    // 打开
    // console.log('editview::cache.uid:', cache.uid())
    if (nodeid != cache.uid()) {
      evt.preventDefault(); // 禁止打开devtool
      show(true);
      pubsub.emit('EDIT_OPEN', cache.uid(nodeid));
      return
    }

    // (正在编辑) && (非快捷键) => 走你
    if (editer.show() && !isToggleEditView(evt)) return

    // 快捷键, 切换 Edit and View
    if (isToggleEditView(evt)) {
      evt.preventDefault();

      if (editer.show(!editer.show())) {
        // 设置并返回结果
        editer.focus().value(cache.value());
      }
      // console.log('cache.value:', cache.value(), 'editer.value:', editer.value())
      if (viewer.show(!viewer.show())) {
        const data = articleData((editval) => {
          cache.value(editval); // 缓存
          viewer.value(marked(editval)); // 渲染
        });
        pubsub.emit('EDIT_SAVE_ARTICLE', data); // 存储数据
      }
    }

    // view 上线快捷键
    if (viewer.show()) {
      if (isScrollDown(evt)) scroll.down();
      if (isScrollUp(evt)) scroll.up();
    }
  };

  return {
    pubsub,
    exec,
    open,
    close,
    state: {
      show,
      editshow: () => show() && editer.show()
    }
  }
};

axios.interceptors.response.use(async (response, config) => {
  return response.data
});

// type Stage struct {
// 	ID         int    `json:"id"`
// 	UserID     int    `json:"user_id"`
// 	StageID    int    `json:"stage_id"`
// 	ParentID   int    `json:"parent_id"`
// 	UpdateTime int    `json:"update_time"`
// 	Title      string `json:"title"`
// 	Data       string `json:"data"`
// }

const parseStage = ({ id, parent_id, stage_id, title, update_time, data }) => {
  return { id, uid: stage_id, parent: parent_id, updateTime: update_time, syncTime: update_time, title, data }
};
const unparseStage = ({ id, uid, parent, updateTime, title, data }) => {
  return { id, stage_id: uid, parent_id: parent, update_time: updateTime, title, data }
};

const stage_get = ({ stageIDS, manifest = true }) => {
  return axios.get(`/stage?stage_ids=${stageIDS.join('-')}&manifest=${manifest}`).then(({ data = [] }) => data.map(parseStage))
};
const stage_save = (list) => {
  // return Promise.reject()
  // console.log({ list })
  const data = list.map((item) => unparseStage(item));
  // console.log({ data })
  return axios.post('/stage', { data }).then((data) => {
    // console.log({ data })
  })
};
const stage_set = stage_save;

// '/stage/free' 解绑
const stage_put = (list, isfree) => {
  // return Promise.reject()
  // console.log({ list })
  const data = list.map((item) => unparseStage(item));
  const path = isfree ? '/stage/free' : '/stage';
  return axios.put(path, { data }).then((data) => {
    // console.log({ data })
  })
};

const parseArticle = ({ id, article_id, update_time, data }) => {
  return { id, uid: article_id, updateTime: update_time, syncTime: update_time, data }
};
const unparseArticle = ({ id, uid, updateTime, data }) => {
  // updateTime: 1667027443, syncTime: 0, data: "## aaaaaaa", uid: 2
  return { id, article_id: uid, update_time: updateTime, data }
};
const article_save = (list) => {
  // return Promise.reject()
  // console.log({ list })
  const data = list.map((item) => unparseArticle(item));
  return axios.post('/article', { data }).then((data) => {
    // console.log({ data })
  })
};
const article_set = article_save;
const article_get = ({ articleIDS = [], manifest = true }) => {
  // console.log({ articleIDS })
  return axios.get(`/article?article_ids=${articleIDS.join('-')}&manifest=${manifest}`).then(({ data = [] }) => data.map(parseArticle))
};

const parseOperation = ({ id, action_type, action_entity, action_entity_id, update_time }) => {
  return { id, type: action_type, entity: action_entity, entityUid: action_entity_id, updateTime: update_time }
};
const unparseOperation = ({ id, type, entity, entityUid, updateTime }) => {
  return { id, action_type: type, action_entity: entity, action_entity_id: entityUid, update_time: updateTime }
};
// 获取操作列表
const operation_get = () => {
  return axios.get(`/operation/list`).then(({ data = [] }) => data.map(parseOperation))
};
const operation_set = (list) => {
  // return Promise.reject()
  const data = list.map((item) => unparseOperation(item));
  console.log({ data });
  return axios.post(`/operation/list`, { data })
};
const operation_put = (list) => {
  // return Promise.reject()
  const data = list.map((item) => unparseOperation(item));
  console.log({ data });
  return axios.put(`/operation/list`, { data })
};
const operation_synctime_get = (syncTime) => {
  if (isUnDef(syncTime)) return Promise.resolve([])
  return axios.get(`/operation/synctime/${syncTime}`).then(({ data = [] }) => data.map(parseOperation))
};

const hascircle = (type) => iscircle(type);
const hasrect = (type) => isrect(type) || isgroup(type);
const PI = Math.PI / 2.8;
const r = (d) => d / 2;
const cos = (r) => Math.cos(PI) * r;
const sin = (r) => Math.sin(PI) * r;

const scaled = (v, ratio) => {
  const nv = v * ratio;
  return [nv, v - nv]
};

// 距离
const distance = (x1, y1, x2, y2) => Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
// 最短距离
const compare = (points1, points2) => (distance(...points1) < distance(...points2) ? points1 : points2);

// 最短距离的坐标
const rectcoord = ({ tx, ty }, { top, right, bottom, left }) => {
  const cx = left + (right - left) / 2,
    cy = top + (bottom - top) / 2;
  const x2 = tx > cx ? right : left; // 当前点在目标点的左边或右边
  const y2 = ty > cy ? bottom : top; // 当前点在目标点的上边或下边
  return compare([tx, ty, x2, cy], [tx, ty, cx, y2])
};

const circlecoord = ({ r, tx, ty }, { x, y }) => {
  const a = x - tx; // a 边
  const b = y - ty; // b 边
  const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)); // c 边
  const dx = round((r * a) / c);
  const dy = round((r * b) / c);
  return { dx, dy }
};

// 线段的两点坐标
const linecoord = (head, tail) => {
  let { cx: x1, cy: y1 } = boxcxy(head);
  let { cx: x2, cy: y2 } = boxcxy(tail);
  // console.log({ x1, y1, x2, y2 })
  if (hasrect(head.type)) {
    //  确定起点
    const [_x, _y, newX1, newY1] = rectcoord({ tx: x2, ty: y2 }, boxtrbl(head))
    ;(x1 = newX1), (y1 = newY1);
  }

  if (hasrect(tail.type)) {
    // 确定终点
    // const { cx, cy } = boxcxy(head)
    const [_x, _y, newX2, newY2] = rectcoord({ tx: x1, ty: y1 }, boxtrbl(tail))
    ;(x2 = newX2), (y2 = newY2);
  }

  if (hascircle(head.type)) {
    const r = head.d / 2;
    const { dx, dy } = circlecoord({ r, tx: x1, ty: y1 }, { x: x2, y: y2 });
    x1 += dx;
    y1 += dy;
  }
  // 过两圆心直线和圆相交的点
  if (hascircle(tail.type)) {
    // 使用比例尺得出坐标
    const r = tail.d / 2;
    const { dx, dy } = circlecoord({ r, tx: x2, ty: y2 }, { x: x1, y: y1 });
    x2 += dx;
    y2 += dy;
  }
  // console.log({ x1, y1, x2, y2 })

  return { x1, y1, x2, y2 }
};

// 递增
const avginc = (arr) => {
  // 均分递增
  const len = arr.length;
  if (len <= 2) return

  const minval = min(arr);
  const maxval = max(arr);
  const stepval = (maxval - minval) / (len - 1);
  const inc = (_, i) => minval + stepval * (i + 1);

  return [
    minval,
    ...Array(len - 2)
      .fill(0)
      .map(inc),
    maxval
  ]
};

const nodeid = (data, stageid) => {
  try {
    const { view, points } = JSON.parse(data);
    console.log({ view, points });
    const [{ id }] = points.filter(({ stage }) => stageid == stage);
    console.log({ id });
    return id
  } catch (err) {}
};

const unbindStageOfNode = async (entityUid) => {
  const [stage] = await db_stage.fetchUid(entityUid);
  if (isUnDef(stage)) return
  console.log({ stage });
  const parent = stage.parent;
  const [parentstage] = await db_stage.fetchUid(parent);
  console.log({ parentstage });

  nodeid(parentstage.data, entityUid);
};

const SYNC_STAGE_INIT = 1;
const SYNC_STAGE_UPDTE = 2;
const SYNC_STAGE_NOTATA = 3;
// {1:[{type: 1, updateTime: 1666700169},{type: 2, updateTime: 1666700169}]} => {add:[{entityUid, updateTime}]}
const convdata = (data) => {
  return Object.keys(data).reduce(
    (memo, entityUid) => {
      // logmid('SYNC_DATA::',data[entityUid], maxBy(data[entityUid], ({ updateTime }) => updateTime))
      const { type, updateTime } = maxBy(data[entityUid], ({ updateTime }) => updateTime); // 最大时间
      const item = { entityUid: +entityUid, updateTime };
      if (isadd(type)) memo.add.push(item);
      if (isupdate(type)) memo.update.push(item);
      if (isdel(type)) memo.del.push(item);
      return memo
    },
    { add: [], update: [], del: [] }
  ) // update 中如果当前db数据中不不包含的需要转移到add
};

const getEntityUid = ({ entityUid }) => entityUid;
const localOperationSend =
  (entity, type) =>
  ({ entityUid, updateTime }) =>
    db_operation.send({ entity, entityUid, type, updateTime });

const syncLocalOperation = async () => {
  const localOperation = await db_operation.fetch();
  const localStage = await db_stage.fetch();
  const localArticle = await db_article.fetch();
  if (localOperation.length) return
  console.log({ localStage, localArticle });
  localStage.forEach(({ uid, updateTime }) => localOperationSend(0, 2)({ entityUid: uid, updateTime }));
  localArticle.forEach(({ uid, updateTime }) => localOperationSend(1, 2)({ entityUid: uid, updateTime }));
};
syncLocalOperation();

// 更新本地舞台
const localStageUpdate = (updates) => {
  return stage_get({ stageIDS: updates.map(getEntityUid), manifest: false }).then((list) => {
    logmid('SYNC_DATA::stage_get:', { list });
    const combined =
      (item) =>
      ({ isupdate, isinsert, uid }) => ({ data: item, isupdate, isinsert, uid });
    const send = (item) => db_stage.send(item, true).then(combined(item));
    const sort = (list) => list.sort(({ uid: u1 }, { uid: u2 }) => u1 - u2);
    return sort(list).map(send)
  })
};
// 更新本地文章
const localArticleUpdate = (updates) => {
  return article_get({ articleIDS: updates.map(getEntityUid), manifest: false }).then((list) => {
    logmid('SYNC_DATA::article list:', { list });
    const combined =
      (item) =>
      ({ isupdate, isinsert, uid }) => ({ data: item, isupdate, isinsert, uid });
    const send = (item) => db_article.send(item, true).then(combined(item));
    const sort = (list) => list.sort(({ uid: u1 }, { uid: u2 }) => u1 - u2);
    return sort(list).map((item) => {
      console.log({ item });
      send(item);
    })
  })
};

// 更新本地
const updateLocal = async (local, entity = 0) => {
  const { add, update, del } = convdata(local);
  logmid('SYNC_DATA::', 'local::entity:', entity, { add, update, del });
  const pms = [];
  const pulls = update.concat(add);
  // return

  // console.log({ pulls })
  if (pulls.length) {
    // 更新动作
    if (isstage(entity)) {
      pms.push(localStageUpdate(pulls));
      // pms.push(...pulls.map(localOperationSend(2))) // 更新操作表
    }
    if (isarticle(entity)) {
      localArticleUpdate(pulls);
    }
  }
  if (add.length) {
    // 添加
    logmid('SYNC_DATA::', { add });
  }
  if (del.length) {
    logmid('SYNC_DATA::', { del });
    // 1. 更新视图 node 状态, 解绑vnode中的stage, 根据parent找到stage
    // 2. 更新stage数据
    del.forEach(async ({ entityUid }) => {
      unbindStageOfNode(entityUid);
    });
    // 3. 更新operation数据
    // const operations = del.map(({ entityUid, updateTime }) => db_operation.send({ entity: 0, entityUid, type: 0, updateTime }))
  }
  if (!pms.length) return []
  return Promise.all(pms).then(([stages]) => {
    logmid('SYNC_DATA::updateLocal:', { stages });
    return Promise.all(stages)
  })
};

const remoteStageUpdate = (update) => {
  const stagePm = db_stage.fetchIn(update.map(getEntityUid)).then(stage_set);
  const operationPm = db_operation.fetchIn(0, update.map(getEntityUid)).then(operation_put);
  return Promise.all([stagePm, operationPm])
};
const remoteStageAdd = (add) => {
  return db_stage.fetchIn(add.map(getEntityUid)).then((list) => {
    logmid('SYNC_DATA::', { list });
    const stagePm = stage_set(list); // 更新stage数据
    const operationPm = operation_set(add.map((item) => ({ ...item, entity: 0, type: 1 }))); // 更新operation数据
    return Promise.all([stagePm, operationPm])
  })
};
const remoteStageDel = (del) => {
  const dels = del.map(({ entityUid, updateTime }) => ({ uid: entityUid, updateTime, parent: 0 }));
  logmid('SYNC_DATA::', { dels });
  const stagePm = stage_put(dels, true); // 更新stage数据
  const operationPm = operation_set(del.map((item) => ({ ...item, entity: 0, type: 0 }))); // 更新operation数据
  return Promise.all([stagePm, operationPm])
};
const remoteArticleAdd = (add) => {
  return db_article.fetchIn(add.map(getEntityUid)).then((list) => {
    logmid('SYNC_DATA::', { list });
    const stagePm = article_set(list); // 更新stage数据
    const operationPm = operation_set(add.map((item) => ({ ...item, entity: 1, type: 1 }))); // 更新operation数据
    return Promise.all([stagePm, operationPm])
  })
};
const remoteArticleUpdate = (update) => {
  return db_article.fetchIn(update.map(getEntityUid)).then((list) => {
    logmid('SYNC_DATA::', { list });
    const articlePm = article_set(list);
    const operationPm = operation_put(update.map((item) => ({ ...item, entity: 1, type: 2 }))); // 更新operation数据
    return Promise.all([articlePm, operationPm])
  })
};
// {entityUid: 1, updateTime: 1666769103}
const updateRemote = (remote, entity = 0) => {
  const { add, update, del } = convdata(remote);
  logmid('SYNC_DATA::', 'remote::entity:', entity, { add, update, del });
  const pms = [];

  // return
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
  if (!pms.length) return []
  return Promise.all(pms)
};

// syncOperation()
const createSync = (isempty) => {
  const pubsub = new Event();

  const fetchRemoteOperation = async (minUpdateTime) => {
    if (isUnDef(minUpdateTime)) return await operation_get()
    let remoteOperation = await operation_synctime_get(minUpdateTime);
    if (!remoteOperation.length) {
      // 部分无数据
      return await operation_get()
    }
    return remoteOperation
  };

  const syncOperation = async () => {
    logmid('SYNC_DATA::', '------- sync operation ------');
    const maxuid = await db_article.maxuid();

    // 获取操作记录
    // const localOperation = await db_service.fetchOpWithMap()
    const localOperation = await db_operation.fetch();
    console.log({ localOperation });
    const minUpdateTime = min(localOperation.map(({ updateTime }) => updateTime));
    logmid('SYNC_DATA::minUpdateTime:', minUpdateTime);

    let remoteOperation = await fetchRemoteOperation(minUpdateTime).catch((_) => []);
    console.log({ remoteOperation });
    if (!remoteOperation.length) {
      // 远程无数据
      if (!localOperation.length) return pubsub.emit(SYNC_STAGE_NOTATA, {}) // 无数据
      // sendRemoteData(localOperation)
    }

    logmid('SYNC_DATA::', { maxuid, minUpdateTime });
    logmid('SYNC_DATA::', { localOperation, remoteOperation });

    let { stageUpdate, articleUpdate, deleted } = merge$1(localOperation, remoteOperation);
    // const deletedStageEntityUidS = remoteOperation.filter(({ type, entity }) => type == 0 && entity == 0)
    // stageUpdate = deleted(stageUpdate, { entity: 0, deletedEntityUidS: deletedStageEntityUidS })
    logmid('SYNC_DATA::', { stageUpdate });
    logmid('SYNC_DATA::', { articleUpdate });
    // return

    // 更新数据, article, stage
    updateRemote(articleUpdate.remote, 1);
    updateLocal(articleUpdate.local, 1);
    //
    updateRemote(stageUpdate.remote);
    const list = await updateLocal(stageUpdate.local);
    if (isempty) {
      // 当前舞台是否为空
      pubsub.emit(SYNC_STAGE_INIT, list[0].data); // 取第一个初始
    } else {
      list.forEach(({ data, isupdate }) => {
        if (!isupdate) return
        pubsub.emit(SYNC_STAGE_UPDTE, data); // 全量发更新舞台, 在订阅中判定是否是当前舞台
      });
    }
    logmid('SYNC_DATA::', '-----  stage ok ------- ', { list });
  };

  return {
    pubsub,
    syncOperation
  }
};

const node = (g, type) => {
  // const removedom = g.remove.bind(g)
  console.log({ g, type });

  // remove() {
  //   console.log('---- remove ----')
  //   // this.removes.forEach(remove => remove())
  //   removedom()
  // }
  const vnodes = ['rect', 'circle', 'end', 'dot', 'group', 'normal'];
  if (vnodes.indexOf(type) != -1) {
    return Object.assign(
      {
        removes: [],
        GC: new GC(),
        bg: noop,
        front: noop,
        txt: noop,
        editicon: noop,
        border: noop,
        autosize: noop,
        zoom: noop
      },
      g
    )
  }

  const newg = Object.assign(g, {
    removes: [],
    move(x, y, isrelative = true) {
      return g.transform({ translateX: x, translateY: y }, isrelative)
    },
    color(color) {
      this.font && this.font.color(color);
    }
  });
  newg.font = newg.init && newg.init();
  if (isUnDef(newg.border)) newg.border = noop;
  // if (isUnDef(newg.move)) newg.move = noop

  return newg
};

function createElement$1(tagName, options) {
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
    createElement: createElement$1,
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

function vnode$1(sel, data, children, text, elm) {
    const key = data === undefined ? undefined : data.key;
    return { sel, data, children, text, elm, key };
}

const array$1 = Array.isArray;
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
const emptyNode = vnode$1("", {}, [], undefined, undefined);
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
        return vnode$1(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
    }
    function emptyDocumentFragmentAt(frag) {
        return vnode$1(undefined, {}, [], undefined, frag);
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
            if (array$1(children)) {
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
        if (array$1(c)) {
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
        if (array$1(b)) {
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
                children[i] = vnode$1(undefined, undefined, undefined, children[i], undefined);
        }
    }
    if (sel[0] === "s" &&
        sel[1] === "v" &&
        sel[2] === "g" &&
        (sel.length === 3 || sel[3] === "." || sel[3] === "#")) {
        addNS(data, children, sel);
    }
    return vnode$1(sel, data, children, text, undefined);
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

const patch = init([attributesModule, propsModule, datasetModule, styleModule]);

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

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
	if (defineProperty && options.name === '__proto__') {
		defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
	} else {
		target[options.name] = options.newValue;
	}
};

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
	if (name === '__proto__') {
		if (!hasOwn.call(obj, name)) {
			return void 0;
		} else if (gOPD) {
			// In early versions of node, obj['__proto__'] is buggy when obj has
			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
			return gOPD(obj, name).value;
		}
	}

	return obj[name];
};

var extend$1 = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};

const undefinedv = (v) => v === undefined;
const number = (v) => typeof v === 'number';
const string = (v) => typeof v === 'string';
const text$1 = (v) => string(v) || number(v);
const array = (v) => Array.isArray(v);
const object = (v) => typeof v === 'object' && v !== null;
const fun = (v) => typeof v === 'function';
const vnode = (v) => object(v) && 'sel' in v && 'data' in v && 'children' in v && 'text' in v;

const svgPropsMap = { svg: 1, circle: 1, ellipse: 1, line: 1, polygon: 1, polyline: 1, rect: 1, g: 1, path: 1, text: 1, tspan: 1 };

const svg = (v) => v.sel in svgPropsMap;

// TODO: stop using extend here
const extend = (...args) => {
  var objs = [],
    len = args.length;
  while (len--) objs[len] = args[len];

  return extend$1.apply(void 0, [true].concat(objs))
};

const assign = (...args) => {
  var objs = [],
    len = args.length;
  while (len--) objs[len] = args[len];

  return extend$1.apply(void 0, [false].concat(objs))
};

const reduceDeep = (arr, fn, initial) => {
  var result = initial;
  for (var i = 0; i < arr.length; i++) {
    var value = arr[i];
    if (array(value)) {
      result = reduceDeep(value, fn, result);
    } else {
      result = fn(result, value);
    }
  }
  return result
};

const mapObject = (obj, fn) => {
  return Object.keys(obj)
    .map(function (key) {
      return fn(key, obj[key])
    })
    .reduce(function (acc, curr) {
      return extend(acc, curr)
    }, {})
};

const deepifyKeys = (obj, modules) => {
  return mapObject(obj, function (key, val) {
    var dashIndex = key.indexOf('-');
    if (dashIndex > -1 && modules[key.slice(0, dashIndex)] !== undefined) {
      var moduleData = {};
      moduleData[key.slice(dashIndex + 1)] = val;
      // return (obj = {}), (obj[key.slice(0, dashIndex)] = moduleData), obj
      obj = {};
      obj[key.slice(0, dashIndex)] = moduleData;
      return obj
    }
    var obj$1 = {};
    obj$1[key] = val;
    return obj$1
  })
};

var omit = function (key, obj) {
  return mapObject(obj, function (mod, data) {
    return mod !== key ? ((obj = {}), (obj[mod] = data), obj) : {}
  })
};

// Const fnName = (...params) => guard ? default : ...

var createTextElement = function (text$$1) {
  return !text$1(text$$1)
    ? undefined
    : {
        text: text$$1,
        sel: undefined,
        data: undefined,
        children: undefined,
        elm: undefined,
        key: undefined
      }
};

var considerSvg = function (vnode$$1) {
  return !svg(vnode$$1)
    ? vnode$$1
    : assign(
        vnode$$1,
        {
          data: omit(
            'props',
            extend(vnode$$1.data, {
              ns: 'http://www.w3.org/2000/svg',
              attrs: omit('className', extend(vnode$$1.data.props, { class: vnode$$1.data.props ? vnode$$1.data.props.className : undefined }))
            })
          )
        },
        {
          children: undefinedv(vnode$$1.children)
            ? undefined
            : vnode$$1.children.map(function (child) {
                return considerSvg(child)
              })
        }
      )
};

var rewrites = {
  for: 'attrs',
  role: 'attrs',
  tabindex: 'attrs',
  'aria-*': 'attrs',
  key: null
};

var rewriteModules = function (data, modules) {
  return mapObject(data, function (key, val) {
    var inner = {};
    inner[key] = val;
    if (rewrites[key] && modules[rewrites[key]] !== undefined) {
      var obj = {};
      obj[rewrites[key]] = inner;
      return obj
    }
    if (rewrites[key] === null) {
      return {}
    }
    var keys = Object.keys(rewrites);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (k.charAt(k.length - 1) === '*' && key.indexOf(k.slice(0, -1)) === 0 && modules[rewrites[k]] !== undefined) {
        var obj = {};
        obj[rewrites[k]] = inner;
        return obj
      }
    }
    if (modules[key] !== undefined) {
      var obj = {};
      obj[modules[key] ? modules[key] : key] = val;
      return obj
    }
    if (modules.props !== undefined) {
      return { props: inner }
    }
    return inner
  })
};

var sanitizeData = function (data, modules) {
  return considerSvg(rewriteModules(deepifyKeys(data, modules), modules))
};

var sanitizeText = function (children) {
  return children.length > 1 || !text$1(children[0]) ? undefined : children[0]
};

var sanitizeChildren = function (children) {
  return reduceDeep(
    children,
    function (acc, child) {
      var vnode$$1 = vnode(child) ? child : createTextElement(child);
      acc.push(vnode$$1);
      return acc
    },
    []
  )
};

var defaultModules = {
  attrs: '',
  props: '',
  class: '',
  data: 'dataset',
  style: '',
  hook: '',
  on: ''
};

var createElementWithModules = function (modules) {
  return function (sel, data) {
    var children = [],
      len = arguments.length - 2;
    while (len-- > 0) children[len] = arguments[len + 2];

    if (fun(sel)) {
      return sel(data || {}, children)
    }
    var text$$1 = sanitizeText(children);
    return considerSvg({
      sel: sel,
      data: data ? sanitizeData(data, modules) : {},
      children: text$$1 ? undefined : sanitizeChildren(children),
      text: text$$1,
      elm: undefined,
      key: data ? data.key : undefined
    })
  }
};

var createElement = createElementWithModules(defaultModules);

var index = {
  createElement: createElement,
  createElementWithModules: createElementWithModules
};

const color = (color) => (color.indexOf('#') != -1 ? color : `#${color}`);

const strokeAttr = ({ width, type, color }) => {
  // 边框属性
  const attr = { color, width };
  const dasharray = {
    solid: false,
    dashed: [4, 4].join(' ')
  };
  attr.dasharray = dasharray[type];
  // console.log({ attr, type })
  return attr
};

const multiScale = (d, ratios) => {
  const p = createPadding(d);
  return ratios.map((ratio) => p.scale(ratio))
};

const createPadding = (min) => {
  const scale = (ratio) => {
    let dv = min * ratio;
    // if (dv > 10) dv = 5
    return { dv, dx: dv / 2, dy: dv / 2 }
  };
  const limit = (dv) => {
    const absdv = Math.abs(dv);
    if (absdv > 8) dv = (8 * dv) / absdv;
    if (dv != 0 && absdv < 4) dv = (4 * dv) / absdv;
    return dv
  };
  return {
    scale(ratio) {
      let { dv, dx, dy } = scale(ratio);
      dv = limit(dv);
      return { d: min - dv, dx, dy, dv, padding: dv / 2 }
    }
  }
};

const editIconPath = ({ x, y }) => {
  return `M${x} ${y}h4 l8 -10 v4 l-7 6 h8 v0.6 L${x} ${y + 0.6}z`
};
const moreIconPath = ({ x, y }) => {
  return `M${x} ${y}h9 v-1 h1 v-10z`
};
const moreIconCirclePath = ({ x, y, r, tx }) => {
  return `M${x} ${y} A ${r} ${r} 0 0 0 ${tx + x} ${y}`
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

      return index.createElement("tspan", {
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
    return index.createElement("text", {
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
  return index.createElement("text", {
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
      return index.createElement("path", {
        d: editIconPath(editiconArg(width, inner)),
        fill: "#000000"
      });
    };

    var moreFlag = function moreFlag(ismore) {
      if (!ismore) return '';
      return index.createElement("path", {
        d: moreIconPath(moreiconArg(width, height, inner)),
        fill: "#000000"
      });
    };

    return index.createElement("g", {
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
  return index.createElement("rect", {
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

const dark = {
  bg: '#fff',
  font: '#000',
  color: '#333', // 主色调, 1
  stroke: '#777', // 边缘色调, 3
  tag: {
    stroke: '#999', // 4
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

const rectNode =
  (createVNode) =>
  ({
    layer,
    x,
    y,
    rx,
    ry,
    width,
    height,
    bg = '#fff',
    fontcolor,
    fontsize = 16,
    border = { width: 1, type: 'solid', color: dark.stroke },
    txt = '',
    isstage = false,
    isarticle = false
  }) => {
    // console.log({ createVNode })
    const userSinkPms = (o) => (pms) => (o = undef(o, pms));
    const txtsink = userSinkPms(null);

    const def = { x, y, rx, ry, width, height, fontcolor, fontsize, txt, bg, stroke: strokeAttr(border), isarticle, isstage };
    const usePatch = (vnode, attrs) => {
      if (attrs.stroke) attrs.stroke = Object.assign(def.stroke, attrs.stroke);
      return patch(vnode, createVNode(Object.assign(def, attrs))(txtsink))
    };
    let vnode = usePatch(layer.group().node, {});
    // console.log({ vnode })

    const focus = () => {
      vnode = usePatch(vnode, { stroke: { width: 3 } });
    };
    const defocus = () => {
      vnode = usePatch(vnode, { stroke: { width: 1 } });
    };
    const move = (dx, dy) => {
      vnode = usePatch(vnode, { x: def.x + dx, y: def.y + dy });
    };
    const remove = () => {
      vnode = patch(vnode, h('!'));
    };
    const resize = ({ width, height, x, y }) => {
      vnode = usePatch(vnode, { width, height, x, y });
      return true
    };
    const zoom = ({ width, height, x, y }) => {
      return resize({ width, height, x, y })
    };
    const useTxt = (txt, { width, height }) => {
      vnode = usePatch(vnode, { txt, width, height });
      return def.txt
    };
    const useFontsize = (fontsize) => {
      if (isUnDef(fontsize)) return def.fontsize
      vnode = usePatch(vnode, { fontsize });
    };
    const useColor = (fontcolor) => {
      if (fontcolor == def.fontsize) return
      vnode = usePatch(vnode, { fontcolor });
    };

    const textsize = () => {
      return txtsink().then(({ width, height }) => {
        console.log('pms', { width, height });
        return { width, height }
      })
    };
    const useBg = (val) => {
      vnode = usePatch(vnode, { bg: color(val) });
      return def.bg
    };
    const useBorder = (border) => {
      vnode = usePatch(vnode, { stroke: strokeAttr(border) });
    };

    // 是否有文章
    const article = (isarticle) => {
      if (isarticle == def.isarticle) return
      vnode = usePatch(vnode, { isarticle });
    };

    // 是否为舞台
    const stage = (isstage) => {
      if (isstage == def.isstage) return
      vnode = usePatch(vnode, { isstage });
    };

    // 坐标
    const box = ({ x, y, width, height, top = 10, left = 40 }) => {
      width = width * (1 + left / 100);
      height = height * (1 + top / 100);
      if (width < 150) width += 20; // 最小约束
      if (height < 150) height += 20;
      x -= (width - def.width) / 2;
      y -= (height - def.height) / 2;
      return { width, height, x, y }
    };

    // 组成线段的关键点坐标
    const linkpoints = () => {
      const halfW = def.width / 2;
      const halfH = def.height / 2;
      return [
        { x: def.x - halfW, y },
        { x: def.x + halfW, y },
        { x: def.x, y: def.y - halfH },
        { x: def.x, y: def.y + halfH }
      ]
    };
    const front = () => {
      console.log('==== front ===');
    };
    const init = () => {
      // g.move(x, y)
    };
    return {
      focus,
      defocus,
      move,
      remove,
      resize,
      zoom,
      txt: useTxt,
      fontsize: useFontsize,
      textsize,
      color: useColor,
      bg: useBg,
      article,
      stage,
      border: useBorder,
      box,
      linkpoints,
      front,
      init
    }
  };

const rect = (layer) => (argv) => {
  return rectNode(rectVNode)({ layer, ...argv })
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
      return index.createElement("path", {
        d: editIconPath(editiconArg(inner)),
        fill: "#000000"
      });
    };

    var moreFlag = function moreFlag(ismore) {
      if (!ismore) return '';
      return index.createElement("path", {
        d: moreIconCirclePath(moreiconArg(d, inner)),
        fill: "#000000"
      });
    };

    console.log(inner.d);
    return index.createElement("g", {
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

  return index.createElement("circle", {
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

const circle =
  (layer) =>
  ({ x, y, d, bg = '#fff', fontcolor, fontsize = 16, border = { width: 1, type: 'solid', color: '#000' }, txt = '', isstage = false, isarticle = false }) => {

    const userSinkPms = (o) => (pms) => (o = undef(o, pms));
    const txtsink = userSinkPms(null);

    const def = { x, y, d, fontcolor, fontsize, txt, bg, stroke: strokeAttr(border), isarticle, isstage };
    const usePatch = (vnode, attrs) => {
      if (attrs.stroke) attrs.stroke = Object.assign(def.stroke, attrs.stroke);
      return patch(vnode, circleVNode(Object.assign(def, attrs))(txtsink))
    };
    let vnode = usePatch(layer.group().node, {});
    // console.log({ vnode })

    const focus = () => {
      vnode = usePatch(vnode, { stroke: { width: 3 } });
    };
    const defocus = () => {
      vnode = usePatch(vnode, { stroke: { width: 1 } });
    };
    const move = (dx, dy) => {
      vnode = usePatch(vnode, { x: def.x + dx, y: def.y + dy });
    };
    const remove = () => {
      vnode = patch(vnode, h('!'));
    };
    const resize = ({ d, x, y }) => {
      // console.log({ d, x, y })
      if (d == def.d) return false
      if (d < 10) d = 10;
      vnode = usePatch(vnode, { d, x, y });
      return true
    };

    const zoom = ({ d, x, y }) => {
      return resize({ d, x, y })
    };
    const useTxt = (txt, { d }) => {
      vnode = usePatch(vnode, { txt, d });
      return def.txt
    };
    const useFontsize = (fontsize) => {
      if (isUnDef(fontsize)) return def.fontsize
      vnode = usePatch(vnode, { fontsize });
    };
    const useColor = (fontcolor) => {
      if (fontcolor == def.fontsize) return
      vnode = usePatch(vnode, { fontcolor });
    };

    const textsize = () => {
      return txtsink().then(({ width, height }) => {
        console.log('pms', { width, height });
        return { width, height }
      })
    };
    const useBg = (val) => {
      vnode = usePatch(vnode, { bg: color(val) });
      return def.bg
    };
    const useBorder = (border) => {
      vnode = usePatch(vnode, { stroke: strokeAttr(border) });
    };

    // 是否有文章
    const article = (isarticle) => {
      if (isarticle == def.isarticle) return
      vnode = usePatch(vnode, { isarticle });
    };

    // 是否为舞台
    const stage = (isstage) => {
      if (isstage == def.isstage) return
      vnode = usePatch(vnode, { isstage });
    };
    const box = () => ({ width: d, height: d });

    const linkpoints = ({ x, y }) => {
      const halfW = width / 2,
        halfH = height / 2;
      return [
        { x: x - halfW, y },
        { x: x + halfW, y },
        { x: x, y: y - halfH },
        { x: x, y: y + halfH }
      ]
    };
    const front = () => {
      console.log('==== front ===');
    };
    const init = () => {
      // g.move(x, y)
    };
    return {
      focus,
      defocus,
      move,
      remove,
      resize,
      zoom,
      txt: useTxt,
      fontsize: useFontsize,
      textsize,
      color: useColor,
      bg: useBg,
      article,
      stage,
      border: useBorder,
      box,
      linkpoints,
      front,
      init
    }
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
    return index.createElement("g", {
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

const normal = (layer) => (argv) => {
  return rectNode(normalVNode)({ layer, ...argv, bg: '#444', fontcolor: '#fff', rx: 8, ry: 8 })
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
    return index.createElement("circle", {
      cx: cx,
      cy: cy,
      r: r,
      fill: fill,
      opacity: opacity
    });
  };

  return index.createElement("g", {
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

const END_D = 24;
const end =
  (layer) =>
  ({ x, y, d, bg = 'transparent' }) => {

    const def = { x, y, d: END_D, bg };
    const usePatch = (vnode, attrs) => {
      return patch(vnode, endVNode(Object.assign(def, attrs)))
    };
    let vnode = usePatch(layer.group().node, {});

    const focus = () => {
      vnode = usePatch(vnode, { bg: '#000' });
    };
    const defocus = () => {
      vnode = usePatch(vnode, { bg: 'transparent' });
    };
    const move = (dx, dy) => {
      vnode = usePatch(vnode, { x: def.x + dx, y: def.y + dy });
    };
    const remove = () => {
      vnode = patch(vnode, h('!'));
    };
    const box = () => ({ width: d, height: d });
    // const useBg = (val) => {
    //   vnode = usePatch(vnode, { bg: color(val) })
    //   return def.bg
    // }
    // const useBorder = (border) => {
    //   vnode = usePatch(vnode, { stroke: strokeAttr(border) })
    // }

    return {
      focus,
      defocus,
      move,
      remove,
      box
    }
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
    return index.createElement("path", {
      d: editIconPath(editiconArg(width, inner)),
      fill: "#000000"
    });
  };

  var moreFlag = function moreFlag(ismore) {
    if (!ismore) return '';
    return index.createElement("path", {
      d: moreIconPath(moreiconArg(width, height, inner)),
      fill: "#000000"
    });
  };

  return index.createElement("g", {
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

const group =
  (layer) =>
  ({ x, y, width, height, bg = 'transparent', show: isshow = false, isarticle = false }) => {
    // console.log({ isarticle, isshow })
    const strokeAttr = { width: 1, dasharray: [3, 6] };
    const defocusstroke = (isshow) => ({ ...strokeAttr, ...(isshow ? { color: '#888' } : { color: 'transparent' }) });
    const focusstroke = (isshow) => ({ ...strokeAttr, ...(isshow ? { color: '#000', width: 1.5 } : { color: '#888' }) }); // dasharray: [1, 2]

    const def = { x, y, width, height, stroke: defocusstroke(isshow), isshow, bg, isarticle };
    const usePatch = (vnode, attrs) => {
      if (attrs.stroke) attrs.stroke = Object.assign(def.stroke, attrs.stroke);
      return patch(vnode, groupVNode(Object.assign(def, attrs)))
    };
    let vnode = usePatch(layer.group().node, {});
    const focus = () => {
      vnode = usePatch(vnode, { stroke: focusstroke(def.isshow) });
    };
    const defocus = () => {
      vnode = usePatch(vnode, { stroke: defocusstroke(def.isshow) });
    };
    const move = (dx, dy) => {
      vnode = usePatch(vnode, { x: def.x + dx, y: def.y + dy });
    };
    const show = (isshow) => {
      vnode = usePatch(vnode, { isshow, stroke: defocusstroke(isshow) });
    };
    const resize = ({ width, height, x, y }) => {
      vnode = usePatch(vnode, { width, height, x, y });
      return true
    };
    // 是否有文章
    const article = (isarticle) => {
      if (isarticle == def.isarticle) return
      vnode = usePatch(vnode, { isarticle });
    };

    const remove = () => {
      vnode = patch(vnode, h('!'));
    };
    return { focus, defocus, move, show, resize, article, remove }
  };

const dot = end;

const NodeType_Model = [
  {
    type: 'circle',
    id: 1,
    x: 200,
    y: 200,
    d: 80,
    txt: ''
  },
  {
    type: 'rect',
    id: 2,
    x: 400,
    y: 200,
    width: 80,
    height: 80,
    txt: ''
  },
  {
    type: 'normal',
    id: 3,
    x: 600,
    y: 240 - 28 / 2, // 240 = 200 + 80/2
    width: 40,
    height: 28,
    txt: 'text'
  }
];

const isModel = (t, w, h) => {
  // console.log({ t, w, h })
  const Model = NodeType_Model;
  return (
    Model.filter(({ type, width, height }) => {
      if (type !== t) return
      return width == w && height == h
    }).length > 0
  )
};

const ORIGIN = [
  {
    type: 'circle',
    id: 1,
    d: 120,
    fz: 24,
    txt: 'start with one'
  }
];

const LOCAL_DATA = 'DATA';
const localremove = () => localStorage.removeItem(LOCAL_DATA);
const localset = (chardata) => localStorage.setItem(LOCAL_DATA, chardata);
const localget = () => localStorage.getItem(LOCAL_DATA);

// console.log({ mock })
const createLocal = () => {
  let localStage = {};
  try {
    localStage = undef(localStage, JSON.parse(localget()));
    logmid('STAGE_LIFE::', { localStage });

    // localStage.data.points = mock
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
    stage: () => localStage,
    clear: () => (localStage = null)
  }
};

const islink = (type) => has(['link', 'solid', 'dotted'], type);

const isdot = (type) => type == 'dot';
const isgroup = (type) => type == 'group';
const iscircle = (type) => type == 'circle';
const isrect = (type) => type == 'rect';
const isend = (type) => type == 'end';
const cidparse = (cids) => cids.split(',').map(Number);
const cidUnParse = (cids) => cids.join(',');

const unparseDot = (dots) => dots.join('-');
const dotids = (dots) => dots.map(pickv('id'));
const dotidstr = (dots) => unparseDot(dotids(dots));
const parseDotOp = (op) => (dotstr) => dotstr.split('-').map((id) => op(+id));
const parseDot = (dotstr) => parseDotOp((v) => v)(dotstr);

const box$1 = ({ id, x, y, width, height, d, _width, _height, _d }) => ({
  id,
  x,
  y,
  width: d || width,
  height: d || height,
  _width: _d || _width,
  _height: _d || _height
});
// 中心点坐标
const boxcxy = (vnode) => {
  const vbox = box$1(vnode);
  // console.log({ vbox })
  return { ...vbox, cx: vbox.x + vbox.width / 2, cy: vbox.y + vbox.height / 2 }
};
const boxtrbl = (vnode) => {
  const vbox = box$1(vnode);
  let top = vbox.y,
    right = vbox.x + vbox.width,
    bottom = vbox.y + vbox.height,
    left = vbox.x;
  if (isend(vnode.type) || isdot(vnode.type)) {
    left = left - END_D / 2;
    right = right + END_D / 2;
    top = top - END_D / 2;
    bottom = bottom + END_D / 2;
  }
  return { ...vbox, top, right, bottom, left }
};
const boxdesc = ({ width: w1, height: h1 }, { width: w2, height: h2 }) => w2 * h2 - w1 * h1;

let stageUids = [];
let articleUids = [];
const allUidsPm = () =>
  Promise.all([db_stage.allUids(), db_article.allUids()])
    .then(([suids, auids]) => {
      stageUids = suids;
      articleUids = auids;
      logmid('VNODE::', { stageUids, articleUids });
      return { stageUids, articleUids }
    })
    .catch((err) => console.error(err));

db.datainit().then((uid) => {
  // initres(uid)
});

const STAGE = { uid: 1, title: 'default' }; // uid:0 浮萍舞台, uid:1 主舞台
const local = createLocal();

const createModel = ({ title, width, height }) => {
  let data = JSON.parse(JSON.stringify(ORIGIN));
  data[0].txt = undef(data[0].txt, title);
  if (Array.isArray(data)) data = { points: data, view: { x: 0, y: 0, scale: 1, width, height } };
  if (data.points.length == 1) {
    // 初始数据
    data.points[0].x = width / 2;
    data.points[0].y = height / 4;
  }
  return data
};

// 默认数据
const stageDefData = ({ title, width, height }) => {
  logmid('STAGE_LIFE::stageDefData:');
  const data = createModel({ title, width, height });
  return { title, data: JSON.stringify(data) }
};

// 获取资源, local -> remote
const stageExisted = async (uid) => {
  logmid('STAGE_LIFE::stageExisted:', { uid });
  try {
    const { uid: id, data, parent, title } = local.stage() || {};
    logmid('STAGE_LIFE::local:', { uid, id });
    if (uid == id) return { uid, parent, title, data }

    const dbstages = await db_stage.fetchUid(uid);
    logmid('STAGE_LIFE::db:', { uid, dbstages });
    if (dbstages.length) return dbstages[0]

    const remoteStages = await stage_get({ stageIDS: [uid], manifest: false }); // 这里无需拉取, 初始已同步
    logmid('STAGE_LIFE::remote:', { remoteStages });
    if (remoteStages.length) {
      // 本地无,写回
      const stage = remoteStages[0];
      // const { uid } = await db_stage.send(stage)
      db_stage.send(stage);
      return stage // stage
    }
  } catch (err) {
  } finally {
    local.clear();
  }
};

// existed -> default
const createStageData = async ({ uid, parent, title, width, height }) => {
  let stage = await stageExisted(uid);
  logmid('STAGE_LIFE::stageExisted:', { uid, stage, parent });
  if (isUnDef(stage)) stage = { parent, uid, ...stageDefData({ title, width, height }) }; // 创建
  // if (!stage.islocal) { // 从远程拉取, 需要写回本地
  //   const { uid } = await db_stage.send(stage)
  //   logmid('STAGE_LIFE::', { stage, uid })
  //   stage.uid = uid
  // }
  const data = isStr(stage.data) ? JSON.parse(stage.data) : stage.data
  ;(uid = stage.uid), (title = stage.title), (parent = stage.parent);

  //logmid('VNODE::','stage from db:', data)

  logmid('VNODE::', { stage, parent });
  return { uid, parent, title, width, height, data }
  // return { uid, parent, title, ... await initData({ width, height, data, parent, title }) }
};

const initData = ({ width, height, data, parent, title }) => {
  //logmid('VNODE::','initData::', { data, parent, title })
  // const chardata = JSON.stringify(data)
  logmid('VNODE::', 'points:', data.points);
  const vdata = deserializeData(data.points);
  const view = viewboxBoot(data.view, { width, height });
  logmid('STAGE_LIFE::', { view });
  // view.x = 0
  // TODO::添加缓存关系模板
  const points = vdata.vnodes.concat(vdata.vlinks.map(({ type, pid, cid }) => ({ type, pid, cid })));
  diff.indexddb(diff.serialize(JSON.stringify(points), { parent, title })); // 初始存储,记录转换后的vnodes => points
  return { vdata, view }
};

const linecoordToArr = (parent, child) => {
  const { x1, y1, x2, y2 } = linecoord(parent, child);
  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 }
  ]
};
const linecoordMulti = (dots) => {
  // logmid('VNODE::linecoordMulti', { dots })
  const len = dots.length;
  if (len < 2) return []
  const start = linecoordToArr(...dots.slice(0, 2));
  const end = linecoordToArr(...dots.slice(-2));
  const point = ({ x, y, id }) => ({ x: x + 6, y: y + 6, id }); // TODO::优化这里默认为dot直径6
  const middle = len > 4 ? dots.slice(2, len - 2).map(point) : [];
  // logmid('VNODE::', { start, middle, end })
  return [...start, ...middle, ...end]
};

// 序列化初始数据
const deserializeData = (data) => {
  logmid('VNODE::', { data });
  const vlinks = [];
  const vnodes = [];

  const has = (id) => (item) => !isUnDef(item.id) && item.id == id;
  const pcid = (pid, cid, id) => {
    const parent = data.filter(has(pid))[0];
    const child = data.filter(has(cid))[0];
    if (isUnDef(parent) || isUnDef(child)) return
    const dots = linecoordToArr(parent, child);
    // logmid('VNODE::',{ parent, child })
    return [
      { ...dots[0], id: pid },
      { ...dots[1], id: cid }
    ]
  };
  logmid('VNODE::', { data });
  const dotid = (dotstr) => {
    let dots = parseDotOp((id) => {
      // logmid('VNODE::',id, data.filter(has(id)))
      const match = data.filter(has(id));
      return match
    })(dotstr);
    console.log('flatten::', flatten(dots));
    let pairs = linecoordMulti(flatten(dots).map(vnodePatch)); // map [...{x,y,width,height}]
    logmid('VNODE::', { dotstr, dots, pairs }, flatten(dots));
    const dotdatas = parseDot(dotstr).reduce((memo, id, i) => {
      if (!isUnDef(memo[i])) memo[i].id = id;
      return memo
    }, uniqWith(pairs, isEqual));
    logmid('VNODE::', { dotdatas });
    return dotdatas
  };
  const link = ({ pid, cid, type, dots }) => {
    dots = !isUnDef(dots) ? dotid(dots) : pcid(pid, cid); // 渲染的点
    const ids = dotids(dots);
    logmid('VNODE::', { dots, ids });
    return { type, dots, head: ids[0], tail: ids[lastindex(dots)] }
  };

  data.forEach((item) => {
    const { type } = item;
    if (islink(type)) {
      if (type == 'link') item.type = 'solid'; // !!! conv data
      vlinks.push(link(item));
    } else {
      vnodes.push(vnodePatch(item));
    }
  });
  console.log({ vlinks });
  // logmid('VNODE::',{ vlinks, vnodes }) // 序列化后的舞台数据
  return { vlinks: vlinks.filter((v) => !!v), vnodes }
};

// vnode 原始数据补丁
const vnodePatch = (vnode) => {
  const { type, d, width, height, id, txt } = vnode;
  vnode.ratio = 1;
  // vnode.txt = vnode.txt + id
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
  if (isend(type)) vnode.d = 1;
  // if (vnode.article && articleUids.indexOf(id) == -1) {
  //   if (!isUnDef(vnode.article)) delete vnode.article
  // }
  // if (vnode.stage && stageUids.indexOf(id) == -1) {
  //   if (!isUnDef(vnode.stage)) delete vnode.stage
  // }
  if (!vnode.x) vnode.x = 0;
  if (!vnode.y) vnode.y = 0;
  // logmid('VNODE::',JSON.stringify(vnode))
  return vnode
};

// 从 link 中链接父子节点的id
const connParentChildOfLink = (linkdatas) => (id) => {
  return linkdatas
    .filter(({ vlink: { dots } }) => has(dotids(dots), id))
    .reduce(
      (memo, link) => {
        const {
          vlink: { dots }
        } = link;
        const ids = dotids(dots);
        const index = ids.indexOf(id);
        // logmid('VNODE::',{ dots, ids }, ids.indexOf(id), index)

        const prev = ids[index - 1];
        const next = ids[index + 1];
        // logmid('VNODE::',{ id, parent, child })
        if (!isUnDef(prev)) {
          memo.prevs.push(prev);
        }
        if (!isUnDef(next)) {
          memo.nexts.push(next);
        }
        return memo
      },
      { prevs: [], nexts: [] }
    )
};

// 合并vdata数据
const vdataMerge = (vdatas) => {
  const { vlinks, vnodes } = vdatas.reduce(
    (memo, { vlinks, vnodes }) => {
      vlinks.forEach((vlink) => {
        const { dots } = vlink;
        const id = dotidstr(dots);
        if (has(memo.ids, id)) return
        memo.vlinks.push(vlink);
        // const { pid, cid } = vlink
        // const id = `${pid}-${cid}`
        // if (has(memo.ids, id)) return
        // memo.vlinks.push(vlink)
        // memo.ids.push(id)
      });

      vnodes.forEach((vnode) => {
        const { id } = vnode;
        if (has(memo.ids, id)) return
        memo.vnodes.push(vnode);
        memo.ids.push(id);
      });
      return memo
    },
    { vlinks: [], vnodes: [], ids: [] }
  );
  //logmid('VNODE::',{ vlinks, vnodes })
  return { vlinks, vnodes }
};

// 添加节点
const linkOfParent = (parent, child, id) => {
  child.vnode.id = id;
  child.vnode.x = parent.vnode.x;
  child.vnode.y = parent.vnode.y + 160;
  return [parent.vnode, child.vnode, { type: 'solid', pid: parent.vnode.id, cid: child.vnode.id }]
};
const groupOfParent = (parent, child, id) => {
  parent.vnode.cids.push(id);
  child.vnode.id = id;
  child.vnode.x = parent.vnode.x + 10;
  child.vnode.y = parent.vnode.y + 10;
  child.vnode.gid = parent.vnode.id;
  return [child.vnode]
};
const addVnodesOfParent = (parent, child, id) => {
  const models = isgroup(parent.vnode.type) ? groupOfParent(parent, child, id) : linkOfParent(parent, child, id);
  return deserializeData(models)
};

const isscaled = (ratio) => ratio != 1;
// 保存数据
const debounceStoreData = debounce((fn) => {
  storeData(fn());
}, 500);
const debounceRemoteSave = debounce((uid) => {
  remoteStageUpdate([{ entityUid: uid }]);
}, 60000);
const storeData = ({ uid, parent, title, data, view }, isforce = false) => {
  // Map
  // logmid('VNODE::','------- store data -------')
  // logmid('VNODE::',{ data ,view})
  if (data.size == 0) return
  const blocks = [],
    links = [];

  data.forEach((item) => {
    const { vnode, vlink } = item;
    const block = { ...vnode };
    // logmid('VNODE::',JSON.stringify(block))
    if (vnode) {
      const { _d, _width, _height, ratio, cids } = vnode;
      // logmid('VNODE::',isUnDef(width), { width })
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
      const { type, pid, cid, dots } = vlink;
      links.push({ type, dots: dotidstr(dots) });
      // links.push({ type, pid, cid })
    }
  });
  // logmid('VNODE::',{ blocks, links }, blocks.concat(links))
  const points = blocks.concat(links);
  const {
    x,
    y,
    width,
    height,
    window: { scale, isshowside }
  } = view.get();
  const storedata = { view: { x, y, width, height, scale: scale(1)[0], isshowside }, points };
  const chardata = JSON.stringify(storedata);
  // 接口结束，临时存储

  // logmid('VNODE::', 'diff all:', diff.local(diff.serialize(chardata, { parent, title })))
  if (diff.local(diff.serialize(chardata, { parent, title }))) {
    // 本地存储
    logmid('VNODE::', '---------- local store --------');
    local.set(JSON.stringify({ uid, parent, title, data: storedata }));
  }
  if (isforce || diff.indexddb(diff.serialize(JSON.stringify(points), { parent, title }))) {
    //logmid('VNODE::','---------- indexddb store --------')
    logmid('STAGE_LIFE::save:', { uid, parent, title });
    db_node.send({ uid, parent, title, data: chardata });
    db_stage.send({ uid, parent, title, data: chardata });
    debounceRemoteSave(uid);
  }
  return points
};

// TODO:: 简单比较, 要存储数据的差异
const diffGen = (local, all, indexddb) => {
  return {
    local(val) {
      if (local == val) return
      return (local = undef(local, val))
    },
    indexddb(val) {
      //logmid('VNODE::',{ indexddb, val })
      if (indexddb == val) return
      return (indexddb = undef(indexddb, val))
    },
    all(val) {
      if (all == val) return
      return (all = undef(all, val))
    },
    serialize(data, values) {
      values = values ? Object.values(values).join('-') : '';
      return `${data}${values}`.replace(/\s*/g, '')
      // return data.map((b) => Object.values(b).join('-')).join(',')
    }
  }
};
const diff = diffGen();

const createMData = () => {
  let mdata = new Map(),
    uid = 0;
  mdata.GC = new GC();

  const accuid = () => {
    // console.log({ uid })
    return ++uid
  };
  const mdatahas = (id) => mdata.has(id);
  const mdataval = (id) => mdata.get(id);
  const mdatavals = () => [...mdata.values()];
  const mdatafilter = (ids) => [].concat(ids).filter((id) => mdatahas(id)); // FP 可合并
  const mdataFilterVal = (ids) => mdatafilter(ids).map((id) => mdataval(id));
  const mdataFilterNode = (ids) => mdatafilter(ids).map((id) => mdataval(id).node);
  const mdataFilterVNode = (ids) => mdatafilter(ids).map((id) => mdataval(id).vnode);
  // const mdataFilterHasKey = (ids) => mdatakeys().filter(isString).filter((keyid) => { [].concat(ids).filter((id) => mdatakeyhas(keyid, id)).length })
  const mdataNodeDatas = () => mdatavals().filter(({ vnode }) => !isUnDef(vnode));
  const mdataLinkDatas = () => mdatavals().filter(({ vlink }) => !isUnDef(vlink));
  const mdataVNodes = () => mdataNodeDatas().map(({ vnode }) => vnode);
  const mdataNodeDataParents = (id) => mdataNodeDatas().filter(({ nexts }) => has(nexts, id));
  const filterLinkVNodes = (...ids) => mdataLinkDatas().filter(({ vlink: { dots } }) => has(dotids(dots), ids));

  const ishoverNode =
    (ishover) =>
    ({ vnode }) =>
      !ishover || isend(vnode.type) || isdot(vnode.type);
  // 目标点是否在节点元素内
  const mdataFilterVNodeWithBox =
    (ishover) =>
    (tx, ty, scale = 1) => {
      // console.log({ tx, ty })
      return mdataNodeDatas()
        .filter(ishoverNode(ishover))
        .filter(({ vnode }) => {
          let { id, top, right, bottom, left } = boxtrbl(vnode);
          // logmid('NODE_SELECT::type:', vnode.type)
          if (tx < left / scale) return false
          if (tx > right / scale) return false
          if (ty < top / scale) return false
          if (ty > bottom / scale) return false

          logmid('NODE_SELECT::mdataFilterVNodeWithBox:', { id });
          return true
        })
        .map(({ vnode }) => vnode)
        .sort(boxdesc)
    };

  const endadd = (vnode, endid) => {
    vnode.ends = vnode.ends || [];
    if (has(vnode.ends, endid)) return
    vnode.ends.push(endid);
  };

  const endpatch = (vnode) => {
    const { id, attach } = vnode;
    if (isUnDef(mdata.get(attach))) return true
    // console.log({ vnode }, mdata.get(attach))
    if (isUnDef(mdata.get(attach).ends)) {
      mdata.get(attach).ends = [id];
    } else if (!has(mdata.get(attach).ends, id)) {
      mdata.get(attach).ends.push(id);
    }
    // console.log(mdata.get(attach).ends)
  };
  // 配对数据
  const mdataset = (nodedatas, linkdatas) => {
    nodedatas.forEach((block) => {
      const { vnode, node } = block;
      const { id, type } = vnode;

      if (isend(type) && endpatch(vnode)) return
      if (uid < id) uid = id; // 设置最小值

      node.id = id; // 转移部分属性到node
      node.type = type;
      mdata.set(id, { ...connParentChildOfLink(linkdatas)(vnode.id), vnode, node });
    });
    // console.log({ linkdatas })
    linkdatas.forEach((link) => {
      const { vlink, node } = link;
      const { dots, head, tail } = vlink;
      if (!dots.length) return
      // console.log({ dots, head, tail })
      mdata.set(`${head}-${tail}`, { vlink, node });
    });
    // console.log({ mdata })
    return mdata
  };

  // 更新链表中的prev next
  const updateLinkPrev =
    (id) =>
    ({ prevs, nexts }) => {
      mdataFilterVal(prevs).forEach((prev) => {
        prev.nexts = prev.nexts.filter((nextid) => nextid != id).concat(...nexts); // 链表
      });
    };
  const updateLinkNext =
    (id) =>
    ({ nexts, prevs }) => {
      mdataFilterVal(nexts).forEach((next) => {
        next.prevs = next.prevs.filter((previd) => previd != id).concat(...prevs); // 链表
      });
    };

  const linkDel = (links) => {
    links.forEach(({ vlink: { head, tail, dots }, node }) => {
      // console.log({ dots })
      dotids(dots).forEach((dotid) => {
        // console.log({ dotid })
        const { vnode, node } = mdata.get(dotid);
        if (isdot(vnode.type)) {
          node.remove();
          mdata.delete(dotid);
        }
      });
      node.remove();
      mdata.delete(`${head}-${tail}`);
    });
  };

  const mdatadelOfDot = ({ type, id, prevs, nexts }) => {
    // 删除的点非dot
    if (!isdot(type)) {
      // 非端点 not head and not tail
      console.log({ prevs, nexts });
      updateLinkPrev(id)({ prevs, nexts: [] });
      updateLinkNext(id)({ nexts, prevs: [] });
      linkDel(filterLinkVNodes(id));
      console.log({ mdata });
      return
    }

    // 删除的点是dot
    updateLinkPrev(id)({ prevs, nexts });
    updateLinkNext(id)({ prevs, nexts });

    // 删除 link 节点
    filterLinkVNodes(id).forEach(({ vlink, node }) => {
      vlink.dots = vlink.dots.filter(({ id: i }) => i != id);
      // console.log('vlink.dots::', dotids(vlink.dots), mdataFilterVNode(dotids(vlink.dots)))
      node.move(linecoordMulti(mdataFilterVNode(dotids(vlink.dots))));
    });
    console.log({ mdata });
  };

  const mdatadel = (nodedata) => {
    const {
      parents,
      children,
      ends,
      prevs,
      nexts,
      vnode: { type, id, gid, cids, attach },
      node
    } = nodedata;
    // console.log({ parents, children, vnode, node })

    mdatadelOfDot({ type, id, prevs, nexts, parents, children });
    mdatadelOfGroup({ id, gid, cids });
    // 删除 node 节点
    node.remove();
    // mdataFilterNode(mdataFilterHasKey(vnode.id)).forEach((node) => node.remove())

    // 删除 map 中的数据
    if (mdata.has(id)) mdata.delete(id);

    // 清除ends
    if (!isUnDef(ends)) {
      ends.forEach((id) => mdata.delete(id));
      mdataFilterNode(ends).forEach((node) => node.remove());
    }

    // 删除 attach end
    {
      if (isUnDef(attach)) return
      // console.log(mdataval(attach))
      if (mdataval(attach)) {
        const { ends } = mdataval(attach);
        mdataval(attach).ends.splice(ends.indexOf(id), 1);
      }
      // console.log({ mdata })
    }
  };

  // mdata 添加节点时修补 ,划线时传入的节点个数比新画的节点少
  const mdataPatch = (vnodes, { nodedatas, linkdatas }) => {
    updateGroupVNode(vnodes);
    // console.log({ vnodes, nodedatas, linkdatas })
    // 编辑icon映射
    if (vnodes.length == nodedatas.length) return [nodedatas, linkdatas] // 非新增

    const newids = nodedatas.map(({ vnode: { id } }) => id); // 新增的(刚画的)block id
    const oldids = vnodes.filter(({ id }) => newids.indexOf(id) == -1).map(({ id }) => id); // 已存在block id
    const oldNodeDatas = mdataFilterVal(oldids);
    oldNodeDatas.forEach((nodedata) => {
      // 添加时有一个父节点, 更新父节点的关联
      const { prevs, nexts } = connParentChildOfLink(linkdatas)(nodedata.vnode.id);
      nodedata.nexts = nodedata.nexts.concat(nexts);
      nodedata.prevs = nodedata.prevs.concat(prevs);
    });
    // console.log({ nodedatas, linkdatas })
    return [nodedatas, linkdatas]
  };

  const stepXY = ({ headVNode, tailVNode, len }) => {
    const { cx: startX, cy: startY } = boxcxy(headVNode);
    const { cx: endX, cy: endY } = boxcxy(tailVNode);

    console.log({ startX, startY, endX, endY });
    const stepX = stepval(endX - startX, len - 1);
    const stepY = stepval(endY - startY, len - 1);
    console.log({ stepX, stepY });
    return { baseX: startX, baseY: startY, stepX, stepY }
  };

  const toLink = ({ idgroup, type }) => {
    const vdata = idgroup.map((ids) => {
      // dotids
      const [h, t] = [head(ids), tail(ids)];
      console.log({ h, t });
      if (isUnDef(h) || isUnDef(t)) return
      const len = ids.length;

      const [headVNode, tailVNode] = mdataFilterVNode([h, t]);
      console.log({ headVNode, tailVNode });
      // const { cx: baseX, cy: baseY } = boxcxy(headVNode)
      // const stepX = stepval(tailVNode.x - baseX, len - 1)
      // const stepY = stepval(tailVNode.y - baseY, len - 1)
      const { baseX, baseY, stepX, stepY } = stepXY({ headVNode, tailVNode, len });
      const dotVNodes = Array(len - 2)
        .fill(null)
        .map((_, i) => {
          return {
            type: 'dot',
            x: baseX + (i + 1) * stepX - 6,
            y: baseY + (i + 1) * stepY - 3,
            id: accuid(),
            gid: headVNode.gid
          }
        });
      // console.log({ dotVNodes })
      // updateGroupVNode()
      const dots = [headVNode.id, ...dotVNodes.map(pickv('id')), tailVNode.id].join('-');
      console.log({ dots, dotVNodes });
      return deserializeData([headVNode, tailVNode, ...dotVNodes, { type, dots }])
    });
    // console.log({ vdata }, vdataMerge([...vdata]))
    return vdataMerge([...vdata])
  };
  // 断开
  const unlink = ({ idgroup, type }) => {
    // console.log({ idgroup })
    idgroup.forEach((ids) => {
      const [h, t] = [head(ids), tail(ids)];

      const links = filterLinkVNodes(h, t);
      // console.log({ links })
      if (links.length == 0) return
      links.forEach((link) => {
        const headNext = next(dotids(link.vlink.dots), h);
        const tailPrev = prev(dotids(link.vlink.dots), t);
        // console.log({ headNext, tailPrev })
        if (headNext)
          updateLinkPrev(headNext)({
            prevs: mdataval(headNext).prevs,
            nexts: []
          });
        if (tailPrev)
          updateLinkNext(tailPrev)({
            nexts: mdataval(tailPrev).nexts,
            prevs: []
          });
      });
      linkDel(links);
    });
    // console.log({ mdata })
  };

  // 连接, 断开 link and unlink demo is [[id1,id2],[id5,id9]]
  const updateLinkNodes = ({ idgroup, type }) => {
    // console.log({type, idgroup })
    unlink({ idgroup }); // 先清除
    if (islink(type)) return toLink({ idgroup, type })
    // if (!islink(type)) {}
  };

  const boxOfVNodes = (vnodes) => {
    const { ls, rs, ts, bs } = vnodes.map(boxtrbl).reduce(
      (memo, { left, right, top, bottom }) => {
        memo.ls.push(left);
        memo.rs.push(right);
        memo.ts.push(top);
        memo.bs.push(bottom);
        return memo
      },
      { ls: [], rs: [], ts: [], bs: [] }
    );
    return { left: min(ls), top: min(ts), right: max(rs), bottom: max(bs) }
  };

  // 拷贝节点数据
  const copyVNode = (id) => (vnode) => {
    const { y } = vnode;
    return { ...vnode, id, y: y + 20 }
  };

  const copyVNodes = (nodedatas) => nodedatas.map(({ vnode }) => copyVNode(accuid())(vnode));
  const copyGVNodesByID = (ids) => {
    // 一组,  非多组
    const vnodes = mdataFilterVNode(ids).map((vnode) => copyVNode(accuid())(vnode));
    const gvnode = vnodes.filter(({ cids }) => !isUnDef(cids))[0];
    const nonGvnode = vnodes.filter(({ cids }) => isUnDef(cids));
    gvnode.cids = nonGvnode.map(({ id }) => id);
    nonGvnode.forEach((vnode) => (vnode.gid = gvnode.id));
    return [gvnode, ...nonGvnode]
  };
  // 更新组的vnode
  const updateGroupVNode = (vnodes) => {
    if (mdata.size == 0) return
    // 找到需要更新的gid组, vnodes 里可能存在多个组
    const gcids = vnodes
      .filter(({ gid }) => !isUnDef(gid))
      .reduce((memo, { gid, id }) => {
        if (isUnDef(memo[gid])) memo[gid] = [];
        memo[gid].push(id);
        return memo
      }, {});

    // console.log({ gcids })
    Object.keys(gcids).forEach((gid) => {
      // 节点在组内,更新组
      const cids = gcids[gid];
      if (isUnDef(mdataval(Number(gid)))) return
      const vnode = mdataval(Number(gid)).vnode;
      vnode.cids = union(vnode.cids, cids);
    });
  };

  // 删除group相关
  const mdatadelOfGroup = ({ id, gid, cids }) => {
    if (!isUnDef(gid) && mdatahas(gid)) {
      // 清除group中的当前节点id
      const cids = mdataval(gid).vnode.cids.filter((cid) => cid != id);
      if (cids.length) {
        mdataval(gid).vnode.cids = cids;
      } else {
        // TODO:: 全部删除, 需要清除group节点
        mdatadel(mdataval(gid));
      }
    }
    if (!isUnDef(cids)) {
      mdataFilterVNode(cids).forEach((vnode) => {
        delete vnode.gid;
      });
    }
  };

  return {
    uid: accuid,
    mdatahas,
    mdataNodeDatas,
    mdataVNodes,
    mdatavals,
    mdataval,
    mdataFilterVal,
    mdataFilterNode,
    mdataFilterVNode,
    mdataset,
    mdatadel,
    mdataNodeDataParents,
    endadd,
    boxOfVNodes,
    copyVNodes,
    copyGVNodesByID,
    updateGroupVNode,
    mdatadelOfGroup,
    mdataPatch,
    dotids,
    filterLinkVNodes,
    updateLinkNodes,
    mdataFilterVNodeWithBox,
    clear() {
      mdatavals().forEach(({ node }) => {
        // console.log('node remove:', node)
        node.remove();
      });
      mdata.clear();
      // mdata = null
    }
  }
};

const UPDATE = {
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
  STAGE: 12,
  ARTICLE: 13,
  SHOW: 14
};

const createUpdate = ({ mdata, focusids, viewboxScale, defleft, deftop }) => {
  let {
    mdatadel,
    mdatahas,
    mdataval,
    mdataFilterVal,
    mdataFilterNode,
    mdataFilterVNode,
    boxOfVNodes,
    dotids,
    filterLinkVNodes,
    updateLinkNodes,
    mdataFilterVNodeWithBox
  } = mdata;

  const sortLayerOfID = (ids) => sortLayerOfVNodes(mdataFilterVNode(ids));
  const sortLayerOfVNodes = (vnodes) => {
    // console.log({ vnodes })
    return vnodes
      .map(box$1)
      .sort(boxdesc) //.map(logmap) // 倒叙
      .map(({ id }) => id)
  };

  // ishover 当前 ends 点的移入移出状态
  const boxOfNode = ({ x, y }, { left, top, scale, ishover }) => {
    logmid('NODE_SELECT::boxOfNode:', { x, y }, { left, top });
    const vnodes = mdataFilterVNodeWithBox(ishover)(x + left / scale, y + top / scale, scale);
    if (!vnodes.length) return
    // 优先操作ends节点
    const vends = vnodes.filter(({ type }) => isend(type));
    if (vends.length) {
      return vends[0].id
    }
    return vnodes[0].id
  };

  // 获取节点缩放后的坐标和宽高
  const boxscale = (vnode, ratio) => {
    let { x, y, width, height, _width, _height } = box$1(vnode);
    const nw = _width * ratio,
      nh = _height * ratio;
    x -= (nw - width) / 2;
    y -= (nh - height) / 2;
    return { x, y, width: nw, height: nh, d: nw }
  };

  const focusNodeEach = (fn) => mdataFilterNode(focusids).forEach(fn);
  const mouseXYFn = (left = 0, top = 0) => {
    // 鼠标坐标相关, 按下坐标点
    let x = 0,
      y = 0;
    return {
      cache(x1, y1) {
        x = undef(x, x1);
        y = undef(y, y1);
        return { x, y }
      },
      scale({ x, y }) {
        const [X, Y] = viewboxScale(x, y);
        return [X - left, Y - top]
      }
    }
  };
  const mouseXY = mouseXYFn(defleft, deftop);

  // 移动节点相关 ====================
  const mousemove = ({ x, y }, { node }) => {
    // 节点移动
    const { x: prex, y: prey } = mouseXY.cache(); // old
    const { x: curx, y: cury } = mouseXY.cache(...mouseXY.scale({ x, y })); // new
    const dx = curx - prex,
      dy = cury - prey; // diff
    // console.log({ prex, prey, curx, cury ,dx, dy})
    // move({ node, dx, dy })
    moveLimit({ node, dx, dy });
    moveLimit.end();
    // console.log({ dx, dy })
  };
  const moveFn = (ids = []) => {
    const moveLimit = ({ node, dx, dy }) => {
      // if (has(ids, node.id)) return
      ids.push(node.id);
      // console.log('-------------', ids)
      // dxs += dx, dys += dy
      // throttleFn({ node, dx, dy }, val)
      // console.log('-------------')
      move({ node, dx, dy });
    };
    moveLimit.end = () => {
      ids.length = 0;
    };
    moveLimit.GC = new GC();
    return moveLimit
  };
  const moveLimit = moveFn();

  throttle(({ node, dx, dy }, val) => {
    const { dxs, dys } = val();
    // console.log({ dx, dy }, val())
    move({ node, dx: dxs, dy: dys });
  }, 1000);
  // let vids = []
  // const moveLimit = moveObservable((start, id) => {
  // console.log({ start, id })
  // vids.push(id)
  // throttleFn(vids)
  // })

  // let ids = []
  const move = ({ node, dx, dy }) => {
    // console.log({ ids })
    // if (has(ids, node.id)) return
    // ids.push(node.id)
    const { vnode, prevs, nexts, ends } = mdataval(node.id) || {};
    if (!isUnDef(vnode.attach)) {
      // 目标为end移动点
      const { x, y } = attachVNode(vnode.attach, { x: dx + vnode.x, y: dy + vnode.y })
      ;(dx = x - vnode.x), (dy = y - vnode.y);
    }

    // console.log('相对距离::', { dx, dy })
    node.move(dx, dy); // 相对距离
    vnode.x = dx + vnode.x;
    vnode.y = dy + vnode.y;

    // 连线移动
    updatePathPosition({ vnode, prevs, nexts });
    updateGroupPosition(vnode, { dx, dy });
    updateEndsPosition(ends, dx, dy);

    return vnode
  };

  // 缩放节点相关 ====================
  const zoomNode = (node, dir) => {
    // 节点缩放
    const { vnode, prevs, nexts, ends } = mdataval(node.id);
    const { x: ox, y: oy } = vnode;

    let { ratio } = vnode;
    if (dir == 'IN') ratio -= 0.1;
    if (dir == 'OUT') ratio += 0.1;
    if (ratio <= 0) return
    ratio = round(ratio * 10) / 10;

    const { x, y, width, height, d } = boxscale(vnode, ratio);
    // console.log(JSON.stringify(vnode))

    if (!node.zoom({ x, y, width, height, d })) return
    vnode.ratio = ratio;
    vnode.x = x;
    vnode.y = y;
    if (iscircle(vnode.type)) vnode.d = d;
    if (isrect(vnode.type)) {
      vnode.width = width;
      vnode.height = height;
    }

    const dx = x - ox;
    const dy = y - oy;
    updatePathPosition({ vnode, prevs, nexts });
    updateGroupPosition(vnode, { dx, dy });
    updateEndsPosition(ends, dx, dy);
  };

  const updateEndsPosition = (ends = [], dx, dy) => {
    ends.forEach((endid) => {
      const { node } = mdataval(endid);
      moveLimit({ node, dx, dy });
    });
  };

  // 更新组中节点存储的坐标信息
  const cacheIds = new Map();
  const updateGroupPosition = ({ id, cids, gid }, { dx, dy } = {}) => {
    if (!isUnDef(cids) && (dx != 0 || dy != 0)) {
      // group 子数据更新
      cacheIds.set(id, true);

      mdataFilterVal(cids).forEach(({ node, vnode }) => {
        moveLimit({ node, dx, dy });
      });

      cacheIds.clear();
    }
    // if (!isUnDef(gid) && mdatahas(gid)) { // group 数据更新 // TODO::会出现重复调用情况move的循环,可以通过队列解决
    if (!isUnDef(gid) && mdatahas(gid) && !cacheIds.has(gid)) {
      // group 数据更新 // TODO::会出现重复调用情况move的循环,可以通过队列解决
      const gnodedata = mdataval(gid);
      const vnodes = mdataFilterVNode(gnodedata.vnode.cids);
      // console.log('updateGroupPosition::', { vnodes })
      if (vnodes.length == 0) {
        console.log('gnodedata.node::', gnodedata.node);
        // 未销毁, tag 还存在, node.focus 时重新建立
        return mdatadel(gnodedata)
        // return gnodedata.node.remove()
      }
      const { x, y, width, height } = subToGvnode(vnodes);
      // console.log('000000000000')
      gnodedata.vnode.x = x;
      gnodedata.vnode.y = y;
      gnodedata.vnode.width = width;
      gnodedata.vnode.height = height;
      gnodedata.node.resize({ width, height, x, y });
      // console.log({ x, y, width, height, cids })
    }
  };
  const subToGvnode = (vnodes) => {
    const cids = vnodes
      .filter(({ type }) => !isend(type))
      .map(({ id }) => id)
      .join(',');
    const { left, right, top, bottom } = boxOfVNodes(vnodes);
    return { cids, ...padding({ x: left, y: top, width: right - left, height: bottom - top }, 20) }
  };

  // 更新path链接位置
  const updatePathPosition = ({ vnode, prevs, nexts }) => {
    logmid('DOT::', { vnode, prevs, nexts });
    // 移动了线段上的点, 寻找出移动的两段(可以复用之前的点)
    if (isdot(vnode.type)) {
      // !=head && !=tail
      filterLinkVNodes(vnode.id).forEach((linkdata) => {
        logmid('DOT::dots::', { linkdata });
        const { dots, head, tail } = linkdata.vlink;
        const vnodedots = mdataFilterVNode(dotids(dots));
        // console.log({ vnodedots })
        mdataval(`${head}-${tail}`).node.move(linecoordMulti(vnodedots));
      });
      return
    }

    // parents and children 存在dot, 寻找出这一段
    flatten(prevs.concat(nexts).map((id) => filterLinkVNodes(id))).forEach((linkdata) => {
      const { dots, head, tail } = linkdata.vlink;
      const vnodedots = mdataFilterVNode(dotids(dots));
      // console.log({ head, tail })
      mdataval(`${head}-${tail}`).node.move(linecoordMulti(vnodedots));
    });
    // flatten(prevs.map((id) => filterLinkVNodes(id))).forEach((linkdata) => {
    //   const { dots, head, tail } = linkdata.vlink
    //   const vnodedots = mdataFilterVNode(dotids(dots))
    //   mdataval(`${head}-${tail}`).node.move(linecoordMulti(vnodedots))
    // })
    // flatten(nexts.map((id) => filterLinkVNodes(id))).forEach((linkdata) => {
    //   const { dots, head, tail } = linkdata.vlink
    //   const vnodedots = mdataFilterVNode(dotids(dots))
    //   mdataval(`${head}-${tail}`).node.move(linecoordMulti(vnodedots))
    // })
  };

  // 依附在Node上的end坐标体系
  const attachVNode = (id, { x, y }) => {
    // px,py 父级的x,y
    const {
      vnode: { x: px, y: py, width, height }
    } = mdataval(id);
    const [top, right, bottom, left] = [py, px + width, py + height, px];

    // outside
    if (x < left) x = left;
    if (x > right) x = right;
    if (y < top) y = top;
    if (y > bottom) y = bottom;
    // inside
    const vs = { top, right, bottom, left };
    const ds = {
      top: Math.abs(y - top),
      right: Math.abs(x - right),
      bottom: Math.abs(y - bottom),
      left: Math.abs(x - left)
    };
    // min
    const { key } = Object.keys(ds).reduce(
      (memo, key) => {
        const val = ds[key];
        if (memo.v > val) {
          memo.v = val;
          memo.key = key;
        }
        return memo
      },
      { v: Infinity, key: '' }
    );
    // console.log({ key }, vs[key])
    // fixed
    if (has(['top', 'bottom'], key)) y = vs[key];
    if (has(['left', 'right'], key)) x = vs[key];
    return { x, y }
  };

  // t 目标, d 变化
  const nodeMoveProcess = (id, i, { dx = 0, dy = 0, tx, ty }) => {
    // console.log({ tx, ty })
    const { x, y } = mdataval(id).vnode;
    if (!isUnDef(tx)) dx = tx - x;
    if (!isUnDef(ty)) dy = ty - y;
    if (dx == 0 && dy == 0) return console.log('dx,dy 无变化') // 无变化
    // moveto({ node, dx, dy, i })
    return { dx, dy, i }
  };
  // const keyMoveEnds = ({ node, dx, dy }) => ({ node, dx, dy })

  const nodeMove = ({ dx, dy, txyGen = noop }) => {
    // Promise.resolve().then(() => {
    focusNodeEach((node, i) => {
      const diff = nodeMoveProcess(node.id, i, { dx, dy, ...(txyGen(i) || {}) });
      if (!isUnDef(diff)) moveLimit({ ...diff, node });
    });
    moveLimit.end();
    // })
    // mdataFilterNode(ids).forEach((node) => { node.move(dx, dy) })// 相对距离
  };
  // 节点移动
  const nodeLeft = (val) => nodeMove({ dx: val });
  const nodeTop = (val) => nodeMove({ dy: val });
  const nodeRight = (val) => nodeMove({ dx: val });
  const nodeBottom = (val) => nodeMove({ dy: val });

  // 更新对齐
  const updateAlignNodes = (nodes, cmdval) => {
    const { H, V, val: defval } = cmdval;
    const xy = nodes.map(({ vnode }) => boxcxy(vnode));
    const cx = ({ cx }) => cx,
      cy = ({ cy }) => cy;
    const x = ({ x }) => x,
      y = ({ y }) => y;
    const w = ({ width }) => width,
      h = ({ height }) => height;

    const val = defval || 'def';
    if (V) {
      // 垂直分布
      const vlayout = {
        def: () => {
          const hs = xy.map(h);
          const avgy = mean(xy.map(cy));
          return (i) => ({ ty: avgy - hs[i] / 2 })
        },
        avg: () => {
          const hs = xy.map(h);
          const cys = avginc(xy.map(cy));
          return (i) => ({ ty: cys[i] - hs[i] / 2 })
        },
        top: () => {
          const miny = min(xy.map(y));
          return () => ({ ty: miny })
        },
        'top-center': () => {
          const mincy = min(xy.map(cy));
          const ys = xy.map(({ height }) => mincy - height / 2);
          return (i) => ({ ty: ys[i] })
        },
        bottom: () => {
          const maxbottom = max(xy.map(({ y, height }) => y + height));
          const ys = xy.map(({ height }) => maxbottom - height);
          return (i) => ({ ty: ys[i] })
        },
        'bottom-center': () => {
          const maxcy = max(xy.map(cy));
          const ys = xy.map(({ height }) => maxcy - height / 2);
          return (i) => ({ ty: ys[i] })
        }
      };
      nodeMove({ txyGen: vlayout[val] && vlayout[val]() });
    }
    if (H) {
      // 水平分布,  中心点 +- 宽度
      const hlayout = {
        def: () => {
          // 默认元素居中
          const ws = xy.map(w);
          const avgx = mean(xy.map(cx));
          return (i) => ({ tx: avgx - ws[i] / 2 })
        },
        avg: () => {
          const ws = xy.map(w);
          const cxs = avginc(xy.map(cx));
          return (i) => ({ tx: cxs[i] - ws[i] / 2 })
        },
        left: () => {
          const minx = min(xy.map(x));
          return () => ({ tx: minx })
        },
        'left-center': () => {
          const mincx = min(xy.map(cx));
          const xs = xy.map(({ width }) => mincx - width / 2);
          return (i) => ({ tx: xs[i] })
        },
        right: () => {
          logmid(
            'NODE_UPDATE::',
            xy.map(({ x, width }) => x + width)
          );
          const maxright = max(xy.map(({ x, width }) => x + width));
          const xs = xy.map(({ width }) => maxright - width);
          return (i) => ({ tx: xs[i] })
        },
        'right-center': () => {
          const maxcx = max(xy.map(cx));
          const xs = xy.map(({ width }) => maxcx - width / 2);
          return (i) => ({ tx: xs[i] })
        }
      };
      nodeMove({ txyGen: hlayout[val] && hlayout[val]() });
    }
  };

  // 通过指令::更新节点 ====================
  const updateNode = ({ node, vnode, prevs, nexts }, { type: cmdtype, val: cmdval }) => {
    const { type, width, height, d, x, y } = vnode;
    const actions = {
      async txt(txt) {
        if (txt == vnode.txt) return
        vnode.txt = node.txt(txt, { width, height, d });

        if (vnode.type == 'normal') {
          const { x, y, width, height } = node.box({ x: vnode.x, y: vnode.y, ...(await node.textsize()) });
          if (!node.resize({ x, y, width, height })) return
          vnode.x = x;
          vnode.y = y;
          vnode.width = vnode._width = width;
          vnode.height = vnode._height = height;
        }
      },
      bg(color) {
        vnode.bg = node.bg(color);
      },
      async size(sizeFn) {
        const parseval = sizeFn(type);
        // console.log({ parseval })
        if (!parseval) return

        const auto = async (vnode, node, parseval) => {
          // 自动宽高
          let width = undef(vnode.width, parseFloat(parseval.width));
          let height = undef(vnode.height, parseFloat(parseval.height));
          if (parseval !== 'auto' || !isFunc(node.textsize)) return { ...vnode, width, height }
          const nodebox = node.box({ x: vnode.x, y: vnode.y, ...(await node.textsize()) });
          // console.log({ nodebox })
          return { ...vnode, ...nodebox }
        };
        const scale = (vnode, parseval) => {
          let d = undef(vnode.d, parseFloat(parseval.d));
          if (iscircle(vnode.type)) {
            const ratio = d == vnode._d ? 1 : d / vnode._d;
            return boxscale(vnode, ratio)
          }
          return vnode
        };

        const v = scale(await auto(vnode, node, parseval), parseval);
        // console.log({ v })
        if (!node.resize(v)) return
        vnode._width = vnode.width = v.width;
        vnode._height = vnode.height = v.height;
        vnode._d = vnode.d = v.d;
        vnode.x = v.x;
        vnode.y = v.y;
        vnode.ratio = 1;
        // console.log({ vnode })
        updatePathPosition({ vnode, prevs, nexts });
      },
      fontsize({ fontsize }) {
        // console.log({ fontsize })
        node.fontsize(+fontsize);
        vnode.fz = +fontsize;
      },
      border({ width, type, color }) {
        // console.log({ width, type, color })
        node.border({ width, type, color });
        vnode.bd = `${width} ${type} ${color}`;
      },
      color({ color }) {
        node.color(color);
        vnode.c = color;
      },
      stage(stage = 0) {
        stage = Number(stage);
        if (stage === 0) {
          delete vnode.stage;
          node.stage(false);
        } else {
          vnode.stage = stage;
          node.stage(true);
        }
      },
      article(article = 0) {
        article = Number(article);
        if (article === 0) {
          delete vnode.article;
          node.article(false);
        } else {
          vnode.article = article;
          node.article(true);
        }
      },
      show({ show }) {
        const isshow = (show) => (show == 'true' ? true : false);
        node.show(isshow(show));
        vnode.show = Number(isshow(show));
      }
    };
    // console.log({ cmdtype, cmdval })
    actions[cmdtype](cmdval);
  };

  const update = (nodes, { type, val }, render) => {
    // console.log({ type, val })
    if (type == 'align') {
      // H:avg|top|bottom, V:avg|left|right
      updateAlignNodes(nodes, val);
    } else if (type == 'link') {
      const { solidlink, dottedlink, unlink, addlink } = val; // link group and unlink group
      // console.log({ solidlink, dottedlink, unlink, addlink })
      // !!优先删除
      if (unlink.length) updateLinkNodes({ idgroup: unlink, type: 'unlink' });
      if (solidlink.length) render(updateLinkNodes({ idgroup: solidlink, type: 'solid' }));
      if (dottedlink.length) render(updateLinkNodes({ idgroup: dottedlink, type: 'dotted' }));
      // console.log(mdata)
    } else if (type == UPDATE.ARTICLE_RENDER) {
      // val: int || undefine
      nodes.forEach(({ node, vnode }) => {
        node.article(!isUnDef(val));
        vnode.article = val;
      });
      // console.log('------ update view ------', nodes)
    } else {
      nodes.forEach((node) => updateNode(node, { type, val }));
    }
  };

  return {
    sortLayerOfID,
    boxOfNode,
    focusNodeEach,
    subToGvnode,
    mouseXY,
    mousemove,
    zoomNode,
    nodeLeft,
    nodeTop,
    nodeRight,
    nodeBottom,
    updateNode,
    updateAlignNodes,
    update,
    updateGroupPosition
  }
};

// 创建节点
const createNode = ({ viewboxScale, viewboxInfo, left: defleft, top: deftop }) => {
  // console.log({ defleft, deftop })
  let target = null,
    hoverids = [],
    focusids = []; // pretarget 数组, 多个节点

  const mdata = createMData();
  const {
    update,
    boxOfNode,
    focusNodeEach,
    subToGvnode,
    mouseXY,
    mousemove,
    zoomNode,
    nodeLeft,
    nodeTop,
    nodeRight,
    nodeBottom,
    sortLayerOfID,
    updateGroupPosition
  } = createUpdate({ mdata, focusids, viewboxScale, defleft, deftop });
  let {
    uid,
    mdatahas,
    mdataval,
    mdataNodeDatas,
    mdataFilterNode,
    mdataNodeDataParents,
    mdataVNodes,
    mdatavals,
    mdataset,
    mdatadel,
    mdataFilterVal,
    mdataFilterVNode,
    mdataPatch,
    endadd,
    copyVNodes,
    copyGVNodesByID,
    updateGroupVNode,
    boxOfVNodes
  } = mdata;
  const selectedNode = (node) => {
    if (!node) return
    node.focus();
    // 排在最前面
    focusids.push(node.id);
  };

  // 画图 ====================
  const draw = (vdata, shapeFactory) => {
    // console.log({ vdata })
    const { vnodes = [], vlinks = [] } = vdata;
    let linkdatas = vlinks.map((vlink) => {
      // 画线
      // console.log({ vlink })
      const link = shapeFactory.create(vlink.type, { ...vlink });
      return { node: link, vlink }
    });

    // 点 end
    const evnodes = vnodes.filter(({ type }) => isend(type)).filter(({ id }) => !mdatahas(id));

    // 组 group, 画在后面
    const filter = (tid) => vnodes.filter(({ id }) => tid == id)[0];
    const gvnodes = vnodes
      .filter(({ type }) => isgroup(type))
      .reduce((memo, gvnode) => {
        return memo.concat(
          [gvnode.id]
            .concat(gvnode.cids)
            .map((id) => filter(id))
            .filter(isDef$1)
        )
      }, [])
      .filter(({ id }) => !mdatahas(id));
    const gcids = gvnodes.map(({ id }) => id);
    // console.log({ gvnodes, gcids })

    // 非组 normal
    let nvnodes = vnodes.filter(({ type, id, gid }) => {
      if (isgroup(type)) return false
      if (has(gcids, id)) return false // fix bug group exist cids, cid no gid
      if (isend(type)) return false
      if (isDef$1(gid) && !mdatahas(gid)) return false // 初始化时 gid 还没绘制; 新增时gid已经绘制
      if (mdatahas(id)) return false // 已绘制
      if (!shapeFactory.has(type)) return false
      return true
    });
    // 排序,画节点, 最后画在最上面
    const nodedatas = nvnodes.concat(gvnodes, evnodes).map((vnode) => ({ node: shapeFactory.create(vnode.type, vnode), vnode }));
    console.log({ nodedatas, linkdatas });
    return { nodedatas, linkdatas }
  };

  const boundaryPoint = (vnodes, vnode, viewbox) => {
    // 获取边界点
    // const { width: nw, height: nh } = vnode
    const {
      x,
      y,
      window: { width, height, scale }
    } = viewbox.get();
    const [sw, sh] = scale(width, height);
    // console.log({ width, height, w, h })
    return { x: x + sw / 2, y: y + sh / 2 }
    // const { left, top, right, bottom } = boundary(vnodes)
    // return { x: right + 200, y: top }
  };

  let ismousedown = false;
  return {
    boxOfVNodes,
    mousedown() {
      ismousedown = true;
    },
    mouseup() {
      target = null;
      ismousedown = false;
      if (this.getfocus().some(({ vnode: { type } }) => type == 'end')) this.defocus();
    },
    render(vdata, shape, viewbox) {
      // 画图形 修补mdata, 划线时传入的节点个数比新画的节点少
      const [nodedatas, linkdatas] = mdataPatch(vdata.vnodes, { ...draw(vdata, shape) });
      // console.log({ nodedatas, linkdatas })
      mdataset(nodedatas, linkdatas);
      // console.log('mdatavals::', mdatavals())
    },
    vnodes(isonlyvnode) {
      // console.log(mdatavals())
      return isonlyvnode ? mdataVNodes() : mdatavals()
    },
    hover({ x, y }) {
      // return
      const {
        x: left,
        y: top,
        window: { scale }
      } = viewboxInfo();
      // logmid('NODE_SELECT::select:', { defleft, deftop, scale }, scale(1))

      const id = boxOfNode({ x, y }, { left: left + defleft, top: top + deftop, scale: scale(1)[0], ishover: true });
      if (isUnDef(id)) {
        if (!hoverids.length || ismousedown) return
        const nodedata = mdataval(hoverids.pop());
        nodedata.node.defocus();
        return
      }
      if (hoverids.length) return
      const nodedata = mdataval(id);
      nodedata.node.focus();
      hoverids.push(id);
    },
    select({ x, y }) {
      const {
        x: left,
        y: top,
        window: { scale }
      } = viewboxInfo();
      logmid('NODE_SELECT::select:', { defleft, deftop, scale }, scale(1));

      const id = boxOfNode({ x, y }, { left: left + defleft, top: top + deftop, scale: scale(1)[0], ishover: false });
      if (isUnDef(id)) return
      this.defocus();
      const nodedata = mdataval(id);
      selectedNode(nodedata.node);
      target = nodedata.node;
      mouseXY.cache(...mouseXY.scale({ x, y }));
    },
    addOfParent(nodes, shape, viewbox) {
      // 添加一个节点,通过parent来判定是否需要移动视图
      const parent = this.getfocus()[0];
      const child = nodes[0];
      const id = uid();
      console.log({ nodes, parent });
      const vnodes = parent
        ? addVnodesOfParent(parent, child, id)
        : { vnodes: [{ ...child.vnode, id, ...boundaryPoint(this.vnodes(true), child.vnode, viewbox) }] };
      console.log({ vnodes, id });
      this.render(vnodes, shape);
      this.focus([id]);
      target = null;
      return !!parent
    },
    addEnd(shape) {
      const parent = this.getfocus()[0];
      if (isUnDef(parent) || parent.vnode.type != 'rect') return
      const id = uid();
      const {
        vnode: { x, y, height }
      } = parent;
      // endadd(parent.vnode, id)

      const vnodes = { vnodes: [vnodePatch({ type: 'end', id, attach: parent.vnode.id, x: x, y: y + height / 2 })] };
      // console.log({ vnodes })
      this.render(vnodes, shape);
      this.focus([id]);
    },
    unBindGroup(nodedatas) {
      // 解绑组
      // TODO:: 这里只实现解绑一个组内元素
      if (isUnDef(nodedatas[0])) return
      const { gid, id } = nodedatas[0].vnode;
      // console.log({ gid, id })
      if (isUnDef(gid)) return
      delete nodedatas[0].vnode.gid;
      const gvnode = mdataval(gid).vnode;
      gvnode.cids = gvnode.cids.filter((cid) => cid != id);
      // 如果cids为空删除gvnode
      updateGroupPosition({ gid });
    },
    bindGroup(nodedatas, shape) {
      // 并组, 创建组, 绑定组(已有组)
      // console.log({ nodedatas })
      if (nodedatas.length <= 1) return

      // 当前只做单组,不出组嵌套
      let gnodedatas = nodedatas.filter(({ vnode: { cids } }) => !isUnDef(cids)); // 组节点
      if (gnodedatas.length == 0) {
        // 只选中有子节点
        gnodedatas = mdataFilterVal(uniq(nodedatas.filter(({ vnode: { gid } }) => !isUnDef(gid)).map(({ vnode: { gid } }) => gid)));
      }
      // console.log({ gnodedatas })

      if (gnodedatas.length > 0) {
        // 有组
        const nonGNodedatas = nodedatas.filter(({ vnode: { cids } }) => isUnDef(cids)); // 非组节点, 只选中组和选中组也选中了组内节点
        const gcids = [].concat(...gnodedatas.map(({ vnode: { cids } }) => cids)); // 非组节点id
        const gnodedata = gnodedatas.pop(); // 保留一个组
        gnodedatas.forEach(mdatadel);
        const gid = gnodedata.vnode.id;
        nonGNodedatas.forEach(({ vnode }) => {
          vnode.gid = gid;
        }); //  绑定gid
        const cids = (gnodedata.vnode.cids = uniq(gcids.concat(nonGNodedatas.map(({ vnode }) => vnode.id)))); // 去重
        // console.log({ gnodedata, gcids, nonGNodedatas })
        updateGroupPosition({ gid });
        // console.log({ cids })
        mdataFilterNode(sortLayerOfID(cids)).forEach((node) => node.front()); // 排序
        this.focus([gid]);
        return
      }

      // createGroup
      const gid = uid(); // 新建组
      const vnodes = nodedatas.map((nodedata) => {
        // TODO:: 已在组内的节点再次组合其它节点, 删除之前组节点的cids
        if (!isend(nodedata.vnode.type)) {
          nodedata.vnode.gid = gid;
        }
        return { ...nodedata.vnode, gid }
      });
      const { x, y, width, height, cids } = subToGvnode(vnodes);
      const sortcids = sortLayerOfID(cidparse(cids));
      mdataFilterNode(sortcids).forEach((node) => node.front()); // 排序
      const gvnode = vnodePatch({ type: 'group', show: true, id: gid, cids: cidUnParse(sortcids), x, y, width, height });
      this.render({ vnodes: [gvnode] }, shape);
      this.focus([gid]);
    },
    addMultiNode(nodedatas, shape) {
      // 添加一组节点
      // console.log({ nodedatas })
      // return
      const gnodedatas = nodedatas.filter(({ vnode: { cids } }) => !isUnDef(cids));
      const gvnodes = gnodedatas.reduce((memo, gnodedata) => {
        const { cids, id } = gnodedata.vnode;
        return memo.concat(copyGVNodesByID(cids.concat(id)))
      }, []);
      // console.log({ gvnodes })

      const nonGNodedatas = nodedatas.filter(({ vnode: { cids } }) => isUnDef(cids));
      const vnodes = copyVNodes(nonGNodedatas).concat(gvnodes);

      // console.log({ vnodes })
      // return
      this.render({ vnodes }, shape);
      const focusids = vnodes.map(({ id }) => id);
      console.log({ focusids });
      this.focus(focusids);
    },
    parent(id) {
      return mdataNodeDataParents(id)[0]
    },
    update({ type, val }, shape) {
      update(this.getfocus(), { type, val }, (vdata) => this.render(vdata, shape));
    },
    remove() {
      // TODO::整合删除
      const nodedatas = this.getfocus();
      if (!nodedatas.length) return

      nodedatas.forEach(mdatadel);
      console.log({ nodedatas });

      // 删除更新组
      const { upgids, delgids } = nodedatas.reduce(
        (memo, { vnode: { gid, cids } }) => {
          if (isUnDef(gid) && isUnDef(cids)) return memo // 非组
          if (!isUnDef(gid)) memo.upgids.add(gid); // 要更新的
          if (!isUnDef(cids)) memo.delgids.add(gid); // 要删除的
          return memo
        },
        { upgids: new Set(), delgids: new Set() }
      );

      delgids.forEach((gid) => upgids.delete(gid));
      upgids.forEach((gid) => {
        updateGroupPosition({ gid });
      });

      focusids.length = 0;
      target = null;
      // console.log(mdata)
    },
    move({ keyCode, shiftKey }) {
      if (!focusids.length) return

      let dirval = [-10, 10, 10, -10]; // [top, right, bottom, left]
      const space = (v) => v / 5;
      const shift = (v) => v * 10;

      if (isSpaceKeyDown) dirval = dirval.map(space);
      if (shiftKey) dirval = dirval.map(shift);

      if (isTop({ keyCode })) nodeTop(dirval[0]);
      if (isRight({ keyCode })) nodeRight(dirval[1]);
      if (isBottom({ keyCode })) nodeBottom(dirval[2]);
      if (isLeft({ keyCode })) nodeLeft(dirval[3]);
      return true
    },
    zoom(dir) {
      if (!focusids.length) return
      focusNodeEach((node) => zoomNode(node, dir));
    },
    focus(ids) {
      // 选择一个或多个
      // if (!ids.length) return
      this.defocus();
      // sortLayerOfID(ids)
      ids.forEach((id) => {
        const { node, vnode } = mdataval(id);
        if (isUnDef(vnode.gid)) node.front();
        selectedNode(node);
      });
      return focusids.length
    },
    defocus() {
      if (!focusids.length) return
      focusNodeEach((node) => node.defocus());
      focusids.length = 0;
    },
    hasfocus: () => !!focusids.length,
    focusid: () => focusids[0],
    focusids: () => {
      const id = focusids[0];
      const { stage, article } = mdataval(id).vnode;
      return { id, stage, article }
    },
    getfocus: () => {
      return mdataFilterVal(focusids)
      // return focusids.map((id) => mdataval(id))
    },
    clear() {
      this.defocus();
      mdata.clear();
      // this.removeNodeListener()
    },
    bind({ vnode, node }) {
      // node.node.addEventListener('mousedown', mousedown)
      // node.removes = [() => node.node.removeEventListener('mousedown', mousedown)]
      // if (vnode.type != 'end') return // end point
      // const mouseenter = () => !ismousedown && node.focus()
      // const mouseleave = () => !ismousedown && node.defocus()
      // node.node.addEventListener('mouseenter', mouseenter)
      // node.node.addEventListener('mouseleave', mouseleave)
      // node.removes.push(() => node.node.removeEventListener('mouseenter', mouseenter))
      // node.removes.push(() => node.node.removeEventListener('mouseleave', mouseleave))
    },
    mousemove(evt) {
      if (!target) return
      // console.log({ target })
      mousemove({ x: evt.clientX, y: evt.clientY }, { pool: mdata, node: target });
      // console.log(JSON.stringify(vnode))
    }
  }
};

// 打标记, 实现需要标记对象接口{vnodes, focus, defocus}
const marking = (marks, nodes) => {
  // console.log({ marks, nodes })
  let ismarked = true;
  return {
    marked: (bool) => (ismarked = undef(ismarked, bool)),
    clear(isesc) {
      marks.clear(); // 重置标记
      if (isesc) nodes.defocus(); // 清除选中的节点
    },
    render(evt, isscene = false) {
      const { keyCode, shiftKey } = evt;
      // TODO:: marks 和 tagLayer 需要聚合
      // console.log('marked:', marks.marked(), nodes.vnodes(true))
      if (!marks.marked() && isTagSearch(evt)) {
        //  显示标签
        marks.render(nodes.vnodes(true), isscene);
      } else if (marks.marked()) {
        // 根据标签选择节点
        if (isEsc(evt)) return this.clear()
        if (isEnter(evt)) return this.clear()
        // console.log('letter:', nodes.focusOfMark([String.fromCharCode(keyCode + (shiftKey ? 0 : 32))]))
        if (nodes.focusOfMark([String.fromCharCode(keyCode + (shiftKey ? 0 : 32))])) this.clear(); // 选中节点
        return true
      }
    }
  }
};

const createMark = ({ tag, viewbox }) => {
  const txts = makeTxt();
  let ismarked = false;

  return {
    marked: (bool) => (ismarked = undef(ismarked, bool)),
    render(vnodes, isscene) {
      if (this.marked()) return
      // console.log({ vnodes })
      const boundary = curViewBoundary(viewbox.get());
      const sortvnodes = [...vnodes.filter(({ type }) => !isgroup(type)), ...vnodes.filter(({ type }) => isgroup(type))];
      // TODO:: 筛选出重叠的元素
      const tagvnodes = sortvnodes.filter(({ x, y }) => !boundary.isInViewbox(x, y));
      // console.log({ tagvnodes })
      if (!tagvnodes.length) return
      this.marked(true);
      const ratio = viewbox.get().window.scale([1])[0];
      Promise.resolve()
        .then(() => {
          // requestAnimationFrame(() => {
          tagvnodes.forEach((vnode) => {
            let { type, x, y, d, width, height, id, cids, g } = vnode;
            // console.log({ x, y, d, width, height, type })

            if (d) (width = d), (height = d);
            // console.log({ width, height, d })
            const letter = txts.set(id);
            tag.set({
              // cx: x + width / 2,
              // x: x,
              x: x + width / 2,
              y: y + height / 2,
              // cy: y,
              txt: letter,
              // txt: `${letter}-${id}`,
              type,
              isnormal: !isscene && has(['normal'], type),
              ispoint: has(['end', 'dot'], type),
              isgroup: !isUnDef(cids),
              ratio: isscene ? 1 : ratio
            });
          });
          // })
        })
        .catch(console.log);
    },
    clear() {
      if (!ismarked) return
      txts.reset();
      tag.clear();
      this.marked(false);
    },
    getAllIds: (letters) => txts.get(letters),
    getIds: (letters) => txts.get(letters).filter((id) => !!id),
    getLetters: (ids) => txts.getLetters(ids)
  }
};

const progressLetters = ({ start, end }) => {
  const s = start.charCodeAt();
  const e = end.charCodeAt();
  const d = e - s;
  if (d <= 1) return [start, end]
  return Array(d + 1)
    .fill(0)
    .map((_, i) => String.fromCharCode(s + i))
};

// 创建标记
const makeTxt = () => {
  let i = -1;
  const marks = new Map(); // letter, node_id
  const list = () => {
    const upperLetters = Array(26)
      .fill(0)
      .map((_, i) => String.fromCharCode(65 + i));
    const lowerLetters = Array(26)
      .fill(0)
      .map((_, i) => String.fromCharCode(97 + i));
    const letters = lowerLetters.concat(upperLetters);
    return letters
    // return letters.concat(letters.map((letter) => `${letter}0`))
  };
  let letters = list();
  letters = letters.concat(letters.map((l) => `${l}1`));
  // console.log({ letters })

  return {
    reset() {
      marks.clear();
      i = -1;
    },
    set(id) {
      const letter = letters[++i];
      // console.log({ id, i, letter })
      marks.set(letter, id);
      return letter
    },
    get(letters) {
      // this.reset()
      return [].concat(letters).map((letter) => marks.get(letter))
    },
    getLetters(ids) {
      const keys = [...marks.keys()];
      const values = [...marks.values()];
      return []
        .concat(ids)
        .map((id) => keys[values.indexOf(id)])
        .filter((letter) => !!letter)
    }
  }
};

var tagVNode = function tagVNode(_ref) {
  var txt = _ref.txt,
      width = _ref.width,
      height = _ref.height,
      fontsize = _ref.fontsize,
      fontcolor = _ref.fontcolor,
      transform = _ref.transform,
      board = _ref.board;
  return index.createElement("g", {
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

const tagGrayColor = (limit = 155) => {
  // 颜色
  const base = 'A'.charCodeAt();
  const saturate = (char) => {
    const code = char.charCodeAt();
    return limit - round((limit * (code - base)) / code)
  };
  return (txt, isopcity) => {
    const saturation = saturate(txt).toString(16);
    let bg = `#${saturation}${saturation}${saturation}`;
    if (!isopcity) return { bg, fontcolor: '#fff' }
    return { bg: '#ffffffcc', fontcolor: '#000' }
  }
};
const tagSizeGen = (size, len) => {
  // 大小
  // size::大小和缩放有关
  const val = (size) => {
    const width = size * len;
    return { size, dy: 3, width, dx: width / 2, height: size + 8 }
  };
  return {
    value(isnormal) {
      if (!isnormal) return val(size)
      return { ...val(size - 8), dy: 0 }
    }
  }
};

const tag = (layer) => {
  const color = tagGrayColor();
  return ({ x, y, txt, isnormal, ispoint, ratio = 1, isgroup = false }) => {
    const tagSize = tagSizeGen(22, txt.length);
    const stroke = { color: dark.tag.stroke, width: 1 };

    let { size, width, height } = tagSize.value(isnormal);
    let { fontcolor, bg } = color(txt, ispoint || isnormal);
    let scale = ratio;
    let className = 'u-tag';

    const def = { txt, x, y, width, height, fontsize: size, fontcolor, bg, className, scale, ispoint, stroke };
    const usePatch = (vnode, attrs) => {
      if (isnormal) return patch(vnode, tagNormalVNode(Object.assign(def, attrs)))
      if (ispoint) return patch(vnode, tagPointVNode(Object.assign({ ...def, ...{ width: END_D, height: END_D } }, attrs)))
      if (isgroup) return patch(vnode, tagGroupVNode(Object.assign(def, attrs)))
      return patch(vnode, tagDefVNode(Object.assign(def, attrs)))
    };
    usePatch(layer.group().node, {});

    // return g
  }
};

const patchProperty = (options) => {
  // console.log({ options })
  const { pid, cid, type } = options;
  // if (!isUnDef(cid) || !isUnDef(pid)) return options
  if (islink(type)) return options

  return patchNodeProperty(options)
};
const patchNodeProperty = (options) => {
  logmid('patchNodeProperty::', options);
  options = {
    ...options,
    cx: options.x,
    cy: options.y,
    fontsize: options.fz,
    border: parseBorder(options.bd),
    fontcolor: options.c,
    isarticle: !isUnDef(options.article),
    isstage: !isUnDef(options.stage)
  };
  if (isgroup(options.type)) {
    options.show = !!options.show; // 1,0
  }
  return options
};

const parseBorder = (val) => {
  return (val.match(/\s*(?<width>.+)\s+(?<type>.+)\s+(?<color>.+)\s*/) || {}).groups
};

const parseColor = (val) => {
  // return (val.match(/\s*color\s*:\s*(?<color>.+)\s*/) || {}).groups
  return (val.match(/\s*(?<color>.+)\s*/) || {}).groups
};

const parseNumber = (val) => {
  return (val.match(/\s*(\d+)\s*/) || [])[1]
};

const parseGroupShow = (val) => {
  return (val.match(/\s*(?<show>\w+)\s*/) || {}).groups
};
const parseFontsizeEditVal = (val) => {
  // return (val.match(/\s*fontsize\s*:\s*(?<fontsize>[\d\.]+)\s*/) || {}).groups
  return (val.match(/\s*(?<fontsize>[\d\.]+)\s*/) || {}).groups
};

const encodeBr = (v) => logmid('COMMAND::encodeBr:', v) && v.replaceAll('\\n', '\\\n').replaceAll('\n', '\\n');
const decodeBr = (v) => logmid('COMMAND::decodeBr:', v) && v.replaceAll('\\n', '\n').replaceAll('\\\n', '\\n');
const replace = (jsonstr) =>
  jsonstr
    .replaceAll('"', '\\"')
    .replaceAll('"', '\\"')
    .replaceAll('\\"', '"')
    .replaceAll('\\"', '"')
    .replaceAll('\\\\"', '\\"')
    .replaceAll('\\\\"', '\\"')
    .replaceAll('\\\\\\"', '\\\\"')
    .replaceAll('\\\\\\"', '\\\\"')
    .replace(/\\+\n/g, '\\n') // 奇数\
    .replace(/\\+\\n/g, '\\n') // 偶数\
    .replace(/\\+\t/g, '\\t') // 奇数\
    .replace(/\\+\\t/g, '\\t') // 偶数\
    .replace(/\t/g, '');
// .replace(/\n/g, '')
// .replaceAll('\\\n', '\\n')
// .replaceAll('\\\\n', '\\n')
// .replaceAll('\\\\\n', '\\n')

const jsonparse = (jsonstr) => {
  // console.log("JSON_PARSE::", fallback(replace(jsonstr)))
  const v = JSON.parse(replace(jsonstr));
  return isStr(v) ? jsonparse(v) : v
};

//console.log({ Event }, new Event())

// 外壳
const createContainer = () => {
  const commandDom = elmt_byid('GCommand');
  const unmarkdown = (val) => val != 'markdown';
  const { show } = showGen(commandDom);
  return {
    show,
    markdown(bool) {
      // markdown  读取, 设置, 清除
      const classname = commandDom.className.split(' ');
      const filterClassname = classname.filter(unmarkdown);
      if (isUnDef(bool)) {
        return classname.length > filterClassname.length
      }
      if (!bool) {
        elmt_classname(commandDom, filterClassname.join(' '));
      } else {
        elmt_classname(commandDom, [...filterClassname, 'markdown'].join(' '));
      }
    }
  }
};

const CMD = Object.freeze({
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
});

// 左侧标题, 操作分类
const createTitle = (commandContainer) => {
  const titleDom = elmt_byid('GCommandTitle');
  const T = {
    // TODO::插件式管理, 输出相应接口, 注册进来
    [CMD.Title]: ['t'], // title
    [CMD.Size]: ['sz'], // size
    [CMD.FSize]: ['fz'], // fontsize
    [CMD.BGround]: ['bg', 'background'], // background
    [CMD.Border]: ['border'], // border
    [CMD.Color]: ['color'], // color
    [CMD.MultiTag]: ['m'], // multi tag
    [CMD.HAlign]: ['h'], // horizontal aligin
    [CMD.VAlign]: ['v'], // vertical aligin
    [CMD.Link]: ['l'], //
    [CMD.Search]: ['se'], //
    [CMD.Stage]: ['st'], //
    [CMD.StageParent]: ['sp'], //
    [CMD.BindStage]: ['bs'], //
    [CMD.BindArticle]: ['ba'], //
    [CMD.GroupShow]: ['gs'] //
  };
  const ALIAS_PRE = (a) => `:${a}`;
  const TAlias = Object.keys(CMD).reduce((memo, key) => {
    const Sym = CMD[key];
    const alias = T[Sym];
    alias.forEach((a) => {
      memo[ALIAS_PRE(a)] = Sym;
    });
    return memo
  }, {});
  console.log({ TAlias });
  const TVal = (symbol) => symbol.toString().match(/Symbol\((?<val>.+)\)/).groups.val;
  const TSyms = ({ ismarked, isnode, isgroup }) => filterTKeys({ ismarked, isnode, isgroup });
  const markT = [CMD.MultiTag, CMD.HAlign, CMD.VAlign, CMD.Link];
  const markNodeT = [CMD.Size, CMD.FSize, CMD.Color, CMD.BGround, CMD.Border];
  const nodeT = [CMD.Title];
  const commonT = [CMD.Search, CMD.Stage, CMD.StageParent];
  let currentT = CMD.Title;

  const filterTKeys = ({ ismarked, isnode, isgroup }) => {
    // console.log({ ismarked, isnode, isgroup })
    if (ismarked && isgroup) return [...markT, CMD.GroupShow, ...commonT]
    if (isgroup) return [CMD.GroupShow, CMD.BindArticle, ...commonT]
    if (ismarked && isnode) return [...markT, ...markNodeT, ...commonT]
    if (isnode) return [...nodeT, ...markNodeT, ...commonT, CMD.BindStage, CMD.BindArticle]
    if (ismarked) return [...markT, ...commonT]
    return [...commonT]
  };

  const show = (_show) => (val) => {
    if (isUnDef(val)) return _show
    commandContainer.markdown(!val);
    return (_show = val)
  };

  return Object.create(
    {
      show: show(false),
      txt(val) {
        // 读取 || 设置
        if (isUnDef(val)) {
          return currentT
          // return T[titleDom.innerHTML]
        }
        return (titleDom.innerHTML = TVal((currentT = val)))
      },
      alias(type) {
        let t = TAlias[type];
        if (isUnDef(t)) return
        this.txt(t);
        return this.show(true)
      },
      switchAction({ ismarked, isnode, isgroup }, dir = 1) {
        // 切换 action
        const keys = TSyms({ ismarked, isnode, isgroup });
        let i = keys.indexOf(this.txt()) + dir;
        if (i > keys.length - 1) i = 0;
        if (i < 0) i = keys.length - 1;
        if (!this.show()) return

        return this.txt(keys[i])
      },
      reset({ title, ismarked, isnode, isgroup, isedit }) {
        // isedit ctrl+e
        this.txt(title || TSyms({ ismarked, isnode, isgroup })[0]);
        this.show(!isedit);
      }
    },
    {
      T: {
        get() {
          return CMD
        }
      },
      type: {
        get() {
          return currentT || CMD.Title
        }
      },
      isBGround: {
        get() {
          return this.type == CMD.BGround
        }
      },
      isBorder: {
        get() {
          return this.type == CMD.Border
        }
      },
      isColor: {
        get() {
          return this.type == CMD.Color
        }
      },
      isTitle: {
        get() {
          return this.type == CMD.Title
        }
      },
      isMTag: {
        get() {
          return this.type == CMD.MultiTag
        }
      },
      isSize: {
        get() {
          return this.type == CMD.Size
        }
      },
      isFontSize: {
        get() {
          return this.type == CMD.FSize
        }
      },
      isVAlign: {
        get() {
          return this.type == CMD.VAlign
        }
      },
      isHAlign: {
        get() {
          return this.type == CMD.HAlign
        }
      },
      isLink: {
        get() {
          return this.type == CMD.Link
        }
      },
      isStage: {
        get() {
          return this.type == CMD.Stage
        }
      },
      isStageParent: {
        get() {
          return this.type == CMD.StageParent
        }
      },
      isBindStage: {
        get() {
          return this.type == CMD.BindStage
        }
      },
      isBindArticle: {
        get() {
          return this.type == CMD.BindArticle
        }
      },
      isGroupShow: {
        get() {
          return this.type == CMD.GroupShow
        }
      }
    }
  )
};
// 编辑框
const createEdit = (commandTitle, pubsub) => {
  const editDom = elmt_byid('GCommandEdit');

  // 清除title
  editDom.addEventListener('keydown', (evt) => {
    if (isTab(evt)) {
      evt.preventDefault();
      textareaTab(editDom);
    }

    if (isToggleCommandEdit(evt)) {
      evt.preventDefault();
      editer.toggleEdit();
    }

    if (!isBackspace(evt)) return
    if (editer.txt() == '') {
      commandTitle.show(false);
    }
  });

  // 更改
  editDom.addEventListener('input', (evt) => {
    const { value = evt.target.value } = evt;
    // 显示 title
    if (commandTitle.show()) return
    if (commandTitle.alias(value)) {
      // 输入指令如  :t
      editer.txt('');
    }
  });

  // 换行转义
  const editValWhthBrFn = () => {
    // 1. 初始类型 inittype , 决定编码类型
    // 2. 编码状态 encode
    // 初始类型 == 编码状态 ? 返回原始数据 : 返回编码数据
    const isEmptyStr = (val) => val.trim() == '';
    const stateFn = (encodeOnLock, isencode) => {
      const lock = createLock(); // 当前无意义
      return {
        isinit: lock.islocked,
        encode: (bool) => (isencode = undef(isencode, bool)),
        inittype(bool) {
          // 初始类型, 决定最终处理效果 encode:true || decode:false
          if (lock.islocked()) return encodeOnLock
          lock.islocked(true);
          encodeOnLock = bool;
        },
        reset() {
          encodeOnLock = false;
          isencode = false;
          lock.unlock();
        }
      }
    };
    const state = stateFn(false, false);
    return {
      normal(val) {
        // 被多次调用, keydown backspace 退格中被调用
        if (isEmptyStr(val)) return val
        // const codeBr = state.encode() ? decodeBr : encodeBr
        const codeBr = state.encode() ? decodeBr : () => val;
        // const retFn = (isreset) => () => isreset ? val : codeBr(val)
        // const ret = retFn(state.encode() == state.inittype())
        // logmid("JSON_PARSE::isreset:", state.encode() == state.inittype())
        return codeBr(val)
      },
      parse(val) {
        // 切换过程中调用, 第一次切换获取状态
        if (isEmptyStr(val)) return val
        const isencode = commandTitle.show();
        val = isencode ? encodeBr(val) : decodeBr(val);
        // state.reset()
        // state.inittype(isencode)
        state.encode(isencode);
        return val
      }
    }
  };
  const editValWhthBr = editValWhthBrFn();

  const editer = {
    focus() {
      editDom.focus();
    },
    blur() {
      editDom.blur();
    },
    toggleEdit() {
      const istitle = commandTitle.show(!commandTitle.show());
      if (!commandTitle.isStage) return editer.txt(editDom.value)
      if (istitle)
        return pubsub.emit('STAGE_TITLE_GET', (val) => {
          editer.txt(val);
        })
      pubsub.emit('STAGE_CONTENT_GET', (val) => editer.txt(val));
    },
    txt(val) {
      if (isUnDef(val)) {
        logmid('JSON_PARSE::', commandTitle.isStage);
        return commandTitle.isStage ? editDom.value : editValWhthBr.normal(editDom.value)
      }
      editDom.value = commandTitle.isStage ? val : editValWhthBr.parse(val.toString());
    }
  };
  return editer
};

const switchActionCache = (commandTitle) => {
  // 多个命令一次确认,缓存切换action的输入内容
  const cache = new Map();
  const nonempty = [commandTitle.T.Title, commandTitle.T.Size, commandTitle.T.FSize, commandTitle.T.BGround, commandTitle.T.Border];
  const lastempty = [commandTitle.T.HAlign, commandTitle.T.VAlign];
  const addAutoFontSize = (cache) => {
    if (cache.size == 1 && !isUnDef(cache.get(commandTitle.T.Title))) {
      cache.set(commandTitle.T.Size, 'auto');
    }
  };

  return {
    add({ type, val }) {
      if (nonempty.some((t) => t == type) && isUnDef(val)) return // 不为空
      cache.forEach((v, k) => {
        if (isEmptyStr(v) && has(lastempty, k)) cache.delete(k);
      }); // 所有空值中保留最后一位(当前状态值为空)
      cache.set(type, val);
      //console.log({ cache })
    },
    use() {
      // 插件
      addAutoFontSize(cache);
    },
    forEach(fn) {
      cache.forEach((v, k) => fn({ type: k, val: v }));
      cache.clear();
    },
    clear() {
      cache.clear();
    }
  }
};
// 选中了元素，调起输入
const createCommand = () => {
  const pubsub = new Event();
  const commandContainer = createContainer();
  const commandTitle = createTitle(commandContainer);
  const commandEdit = createEdit(commandTitle, pubsub);
  const cacheAction = switchActionCache(commandTitle);

  const stateGen = () => {
    let isshow = false;
    return {
      show(bool, vnode, isedit) {
        if (isUnDef(bool)) return isshow // 读取
        if (isshow == bool) return // 无效更新

        if (bool) {
          const { ismarked, isnode, isgroup, letters, txt } = vnode;
          commandContainer.show(true);
          commandTitle.reset({ ismarked, isnode, isgroup, isedit }); // 多状态
          this.switch(ismarked, vnode, 0);
          setTimeout(commandEdit.focus);
        } else {
          commandContainer.show(false);
          commandTitle.reset({ title: commandTitle.T.Title });
          commandEdit.blur();
          commandEdit.txt('');
          cacheAction.clear();
        }
        return (isshow = bool)
      },
      switch(ismarked, vnode, dir) {
        //console.log(commandTitle.type, commandEdit.txt())
        commandTitle.switchAction({ ismarked, isnode: vnode.isnode, isgroup: vnode.isgroup }, dir); // 不同状态,执行的action不同
        //console.log({ actionType })
        if (commandTitle.isStage)
          return pubsub.emit('STAGE_TITLE_GET', (val) => {
            commandEdit.txt(val);
          })
        if (commandTitle.isStageParent)
          return pubsub.emit('STAGE_PARENT_ID_GET', (id) => {
            commandEdit.txt(id);
          })
        commandEdit.txt(unparseVNode(vnode));
      }
    }
  };
  const state = stateGen();

  //  序列化属性到输入框
  const unparseVNode = ({ type, width, height, txt, d, bg, show, fz: fontsize, bd: border, c: color, stage, article, ismarked, isnode, letters }) => {
    // console.log({ type, width, height, txt, d, ismarked, isnode,  fontsize, border })
    const actions = {
      circle: `d:${d}`,
      rect: `width:${round(width, 2)},height:${round(height, 2)}`
    };
    actions['normal'] = actions.rect;
    if (commandTitle.isMTag && ismarked) return letters.join(',')
    if (commandTitle.isSize) return actions[type]
    if (commandTitle.isTitle) return txt
    if (commandTitle.isBGround) return bg
    if (commandTitle.isFontSize) return `${fontsize}`
    if (commandTitle.isBorder) return `${border}`
    if (commandTitle.isColor) return `${color}`
    if (commandTitle.isBindStage) return `${stage}`
    if (commandTitle.isBindArticle) return `${article}`
    if (commandTitle.isGroupShow) return `${show}`
    return ''
  };

  // 选择节点,范围加忽略 a-h|e,f
  const parseMtagEditVal = (editVal) => {
    const {
      start,
      end,
      ignore = ''
    } = (
      editVal.match(/\s*(?<start>\w+)\s*-\s*(?<end>\w+)\|*(?<ignore>.*)/) || {
        groups: {}
      }
    ).groups;
    if (start && end)
      return progressLetters({ start, end }).filter(
        (letter) =>
          !has(
            ignore.split(',').map((v) => v.trim()),
            letter
          )
      )
    return editVal.split(',').filter((item) => !!item)
  };

  // 解析输入的有效值, 这里通过curry延迟调用
  const parseSizeEditVal = (editVal) => (type) => {
    if (editVal == 'auto') return editVal
    const groupsOfMatch = (val, reg) => (val.match(reg) || { groups: {} }).groups;
    const actionsMatch = {
      circle: groupsOfMatch(editVal, /\s*d\s*:\s*(?<d>[\d\.]+)/),
      rect: {
        ...groupsOfMatch(editVal, /\s*width\s*:\s*(?<width>[\d\.]+)\s*/),
        ...groupsOfMatch(editVal, /\s*height\s*:\s*(?<height>[\d\.]+)\s*/)
      }
    };
    actionsMatch['normal'] = actionsMatch.rect;
    return actionsMatch[type]
  };
  // 对齐
  const parseAlignEditVal = (editval) => {
    return (editval.match(/((?<H>H):|(?<V>V):)(?<val>.*)/) || {}).groups
  };
  // 链接
  const parseLinkEditVal = (editVal) => {
    // { link: [[a,b],[c,d]], unlink: [[a,b],[c,d]] }
    // a.3.b  dotted 中间3个点
    // a-3-b  solid 中间3个点
    console.log({ editVal });
    const parse = (v, symbol) =>
      v
        .replace(/\w+/g, (v) => `${v},${v}`)
        .split(',')
        .filter((v) => has(v, symbol))
        .map((v) => {
          console.log({v});
          const { num } = (v.match(/(?<num>\d+)/) || { groups: { num: 0 } }).groups;
          if (num == 0) return v.split(symbol)
          const arr = v.split(symbol);
          console.log(Array(num).fill(''));
          return [arr[0]].concat(Array(num).fill(''), arr[arr.length - 1])
        });

    return editVal.split(',').reduce(
      (memo, cmdunit) => {
        // console.log(parse(cmdunit, '-'))
        if (has(cmdunit, '-')) memo.solidlink = memo.solidlink.concat(parse(cmdunit, '-'));
        if (has(cmdunit, '.')) memo.dottedlink = memo.dottedlink.concat(parse(cmdunit, '.'));
        if (has(cmdunit, '|')) memo.unlink = memo.unlink.concat(parse(cmdunit, '|'));
        if (has(cmdunit, '+')) memo.addlink = memo.addlink.concat(parse(cmdunit, '+'));
        console.log({ memo });
        return memo
      },
      { solidlink: [], unlink: [], dottedlink: [], addlink: [] }
    )
  };

  // 选中单个节点
  const updateNode = (update, { type, val: editVal }) => {
    // 针对node
    //console.log({ type, editVal })
    if (commandTitle.T.Stage == type) {
      const EVENT_NAME = commandTitle.show() ? 'STAGE_TITLE_SET' : 'STAGE_CONTENT_SET';
      pubsub.emit(EVENT_NAME, editVal);
      return
    }
    if (commandTitle.T.Search == type) {
      pubsub.emit('SEARCH', editVal);
      return
    }
    if (commandTitle.T.StageParent == type) {
      pubsub.emit('STAGE_PARENT_ID_SET', +editVal);
      return
    }
    const updates = {
      [commandTitle.T.BGround]: () => update({ type: 'bg', val: editVal }), // 把输入的内容应用到节点上
      [commandTitle.T.Title]: () => update({ type: 'txt', val: editVal }), // TODO:: 单项数据留, 更改vnode触发node更新
      [commandTitle.T.Link]: () => update({ type: 'link', val: parseLinkEditVal(editVal) }), // TODO:: 链接(a-b,b-a 前后就是方向, a-b-c), 断开(a|b,b|a 有方向)
      [commandTitle.T.Size]: () => update({ type: 'size', val: parseSizeEditVal(editVal) }),
      [commandTitle.T.FSize]: () => update({ type: 'fontsize', val: parseFontsizeEditVal(editVal) }),
      [commandTitle.T.HAlign]: () => update({ type: 'align', val: parseAlignEditVal(`H:${editVal}`) }),
      [commandTitle.T.VAlign]: () => update({ type: 'align', val: parseAlignEditVal(`V:${editVal}`) }),
      [commandTitle.T.Border]: () => update({ type: 'border', val: parseBorder(editVal) }),
      [commandTitle.T.Color]: () => update({ type: 'color', val: parseColor(editVal) }),
      [commandTitle.T.BindStage]: () => update({ type: 'stage', val: parseNumber(editVal) }),
      [commandTitle.T.BindArticle]: () => update({ type: 'article', val: parseNumber(editVal) }),
      [commandTitle.T.GroupShow]: () => update({ type: 'show', val: parseGroupShow(editVal) })
    };
    updates[type] && updates[type]();
  };

  const exec = (evt, nodes, update, focusMarkLetters, ismarked, selecteNodesOfMark) => {
    // nodes 选中节点
    if (!(nodes || ismarked)) return // 开启前置条件
    // multi tag
    setTimeout(
      function () {
        if (ismarked && commandTitle.isMTag) {
          //console.log(parseMtagEditVal(commandEdit.txt()))
          selecteNodesOfMark(uniq$1(parseMtagEditVal(commandEdit.txt())));
        }
      }.bind(undefined)
    );

    //console.log({ keyCode, isShiftKeyDown })
    if (isEsc(evt) && state.show()) {
      // esc+以唤醒=> 睡眠
      return state.show(false)
    }
    const fnodes = nodes.getfocus() || [];
    if (state.show() && isToggleCommandEdit(evt)) return
    if (!isCommandEnter(evt) && !isToggleCommandEdit(evt)) return // enter key 键盘开关

    //console.log({ nodes, ismarked })
    {
      //console.log(JSON.stringify(fnodes[0]?.vnode))
      const { txt, type, width, height, cids, stage = '', article = '', show = false, d, bg = '#fff', fz, bd, c } = fnodes[0]?.vnode || {};
      const vnode = {
        bg,
        type,
        width,
        height,
        stage,
        article,
        d,
        show: !!show,
        ismarked,
        isnode: !!fnodes.length,
        isgroup: !!cids,
        letters: focusMarkLetters,
        txt,
        fz,
        bd,
        c
      };
      //console.log({ width, height, d })
      if (!state.show()) {
        // 唤醒并设置内容
        state.show(true, vnode, isToggleCommandEdit(evt));
      } else {
        cacheAction.add({ type: commandTitle.type, val: commandEdit.txt() });
        if (isSwitchNextCommand(evt)) {
          // shift+enter+已唤醒
          if (commandTitle.show()) {
            evt.preventDefault();
            state.switch(ismarked, vnode, isSwitchPrevCommand(evt) ? -1 : 1);
          }
          return
        }
        if (fnodes) {
          // console.log({ cacheAction })
          if (isModel(type, width, height)) cacheAction.use();
          cacheAction.forEach(({ type, val }) => logmid('cacheAction::', { type, val }) && updateNode(update, { type, val }));
        }
        state.show(false);
      }
    }
  };

  return { exec, state, pubsub }
};

const linkType = (type) => {
  const style = {
    dotted: {
      dasharray: [2, 4]
    }
  };
  return { ...(style[type] || {}) }
};
const linkFactory =
  (layer) =>
  ({ dots, type }) => {
    console.log({ dots, type });

    const lineTo = (dots) => dots.map(({ x, y }) => `${x} ${y}`).join(' L');
    console.log('line to::', { layer }, lineTo(dots));
    const path = layer
      .path(`M${lineTo(dots)}`)
      .fill('transparent')
      .stroke({ color: dark.color, width: 1, ...linkType(type) });
    // const path = layer.path(`M${x1} ${y1} L400 450 L${x2} ${y2}`).fill('transparent').stroke({ color: theme.color, width: 1, ...linkType(type) })
    const markers = [];
    // end arrow icon
    path.marker('end', 20, 6, function (add) {
      add.path('M 0 0 L 10 3 L 0 6 z').fill(dark.path.marker);
      markers.push(add);
    });

    // start circle icon
    if (type != 'circle') {
      const endpoint = 6;
      path.marker('start', endpoint, endpoint, function (add) {
        add.circle(endpoint).fill(dark.path.marker);
        add
          .circle(endpoint - 2)
          .dx(1)
          .dy(1)
          .fill('#ccc');
        markers.push(add);
      });
    }

    path.move = (dots) => {
      // console.log({ dots })
      path.attr({ d: `M${lineTo(dots)}` });
      // path.attr({ d: [`M${x1}`, y1, `L${x2}`, y2].join(' ') })
    };

    const remove = path.remove.bind(path);
    path.remove = () => {
      markers.forEach((marker) => marker.remove());
      remove();
    };
    return path
  };
const solid =
  (layer) =>
  ({ dots }) =>
    linkFactory(layer)({ dots, type: 'solid' });
const dotted =
  (layer) =>
  ({ dots }) =>
    linkFactory(layer)({ dots, type: 'dotted' });
// export const solid = (layer) => ({ x1, y1, x2, y2 }) => linkFactory(layer)({ x1, y1, x2, y2, type: 'solid' })
// export const dotted = (layer) => ({ x1, y1, x2, y2 }) => linkFactory(layer)({ x1, y1, x2, y2, type: 'dotted' })

const registe = () => {
  const groups = { link: {}, group: {}, node: {}, end: {} };
  const check = (group, name) => {
    if (group[name]) throw TypeError(`${name} node already registered, or rename`)
  };
  return {
    groups() {
      return groups
    },
    link(name, nodeGen) {
      check(groups.link, name);
      groups.link[name] = nodeGen;
    },
    group(name, nodeGen) {
      check(groups.group, name);
      groups.group[name] = nodeGen;
    },
    node(name, nodeGen) {
      check(groups.node, name);
      groups.node[name] = nodeGen;
    },
    end(name, nodeGen) {
      check(groups.end, name);
      groups.end[name] = nodeGen;
    }
  }
};

const register = registe();
const { Title, Size, FSize, BGround, Border, Color, BindStage, BindArticle, GroupShow } = CMD;
register.node('circle', circle, [Title, Size, FSize, BGround, Border, Color, BindStage, BindArticle]);
register.node('rect', rect, [Title, Size, FSize, BGround, Border, Color, BindStage, BindArticle]);
register.node('normal', normal, [Title, FSize, BGround, Color]);
register.group('group', group, [GroupShow, BindArticle]);
register.end('dot', dot);
register.end('end', end);
register.link('dotted', dotted);
register.link('solid', solid);

const box = ({ left, top, width, height, attr = {}, svgDecor }) => {
  // console.log({ left, top, width, height, attr, svgDecor })
  const svg = SVG()
    .viewbox(left, top, width, height)
    .size(width, height)
    .attr({ preserveAspectRatio: 'xMinYMax meet', ...attr });
  if (isFunc(svgDecor)) return svgDecor(svg)
  return { mnt: svg, box: svg, svg }
};

const layout = ({ left, top, width, height, attr, border }) => {
  const ratio = 8 / 10;
  const borwidth = border / 4;
  const [nw, dw] = scaled(width, ratio),
    [nh, dh] = scaled(height, ratio);
  const offset = { left: dw / 2 - borwidth, top: dh / 2 - borwidth };
  attr = { x: borwidth, y: borwidth };
  return { left, top, width: nw, height: nh, attr, border, offset }
};

// 边框盒子
const borderBox = (options) => {
  let { left, top, width, height, attr, border, offset } = options;
  // console.log({ left, top, width, height, attr, offset })
  const svgDecor = (svg) => {
    // 出现detached SVG, DOM中会有一个SVG的创建节点
    let g = SVG()
      .group()
      .attr({ transform: `translate(${offset.left},${offset.top})` });
    g.rect()
      .attr({ class: 'g-scene-nodetype', width: width + border / 2, height: height + border / 2, fill: dark.bg })
      .stroke({ color: dark.typescene.box.stroke, width: 1 })
      .radius(0)
      .fill('#fffd');
    return { mnt: g, box: svg, svg }
  };
  return box({ left, top, width, height, attr, svgDecor })
};

var shape = ({ box, mnt, svg }) => {
  // console.log({ box })
  let groupLayer = box.group();
  let linkLayer = box.group();
  let nodeLayer = box.group();
  let endLayer = box.group();
  let tagLayer = box.group();
  const tagDecor = () => {
    return {
      set: tag(tagLayer),
      clear() {
        tagLayer && (tagLayer.node.innerHTML = '');
      }
    }
  };

  const shapes = {};

  const shape = {
    has(type) {
      const isdefed = !isUnDef(shapes[type]);
      if (!isdefed) {
        console.warn(TypeError(`${type} node is not register`));
      }
      return isdefed
    },
    create(type, options, newlayer) {
      const shape = shapes[type](options, newlayer);
      if (islink(type)) return shape
      return node(shape, type)
    },
    tag: tagDecor(),

    attach(container) {
      if (svg != mnt) {
        svg.addTo(mnt);
      }
      mnt.addTo(container);
    },
    register(type, name, nodeGen) {
      // 注册节点生成器
      if (!isUnDef(name) && !isUnDef(nodeGen)) register[type](name, nodeGen);

      const groups = register.groups();
      const attach = (group, layer) => {
        Object.keys(group).forEach((key) => {
          if (!isUnDef(shapes[key])) return
          shapes[key] = (options, newlayer) => group[key](newlayer || layer)(patchProperty(options));
        });
      };
      attach(groups.link, linkLayer);
      attach(groups.group, groupLayer);
      attach(groups.node, nodeLayer);
      attach(groups.end, endLayer);
    },
    clear() {
      // mnt.clear()
      mnt.remove();

      tagLayer = null;
      endLayer = null;
      nodeLayer = null;
      groupLayer = null;
      linkLayer = null;
      svg = null;
    },
    svg() {
      return svg
    }
  };

  shape.register();
  return shape
};

// console.log({ box, shape })

const STAGE_EVENT = {
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

const STAGE_STATE = {
  NORMAL: 0,
  MARKED: 1, // 标记
  isnormal: (val) => val == STAGE_STATE.NORMAL,
  ismarked: (val) => val == STAGE_STATE.MARKED
};

const createStage = (options) => {
  const stage = new Stage(options);
  return stage
};

class Stage extends Event {
  // container = null
  // uid = 0  // 元素ID数量
  state = STAGE_STATE.NORMAL
  viewbox = null // 视口, 缩放
  nodes = null // 舞台上的图形节点
  marks = null // 标记
  shape = null
  // options = null
  // shapeGen = null // 图形生成器
  constructor({ left, top, width, height, zoomsize }) {
    super();
    // this.options = { left, top, width, height, zoomsize }
    this.shape = shape(box({ left, top, width, height, zoomsize }));
    this.viewbox = createViewbox({ width, height, zoomsize, svg: this.shape.svg() });
    this.nodes = createNode({ left, top, viewboxScale: this.viewbox.scale, viewboxInfo: this.viewbox.get });
    this.marks = createMark({ tag: this.shape.tag, viewbox: this.viewbox });
    this.listen();
  }
  listen() {
    const mark = marking(this.marks, { ...this.nodes, focusOfMark: this.selecteNodesOfMark.bind(this) });

    this.on(STAGE_EVENT.MARKING, ([evt, callback]) => {
      callback(mark.marked(!!mark.render(evt)));
    }); // 选择节点, 屏蔽其它操作
    this.on(STAGE_EVENT.MOUSEDOWN, () => {
      this.nodes.mousedown();
      mark.clear();
    });
    this.on(STAGE_EVENT.MOUSEUP, () => {
      this.nodes.mouseup();
    });
    this.on(STAGE_EVENT.MOUSEMOVE, (evt) => {
      this.nodes.mousemove(evt);
    });
    this.on(STAGE_EVENT.KEYDOWN, (evt) => {
      this.GC = new GC();

      if (isEsc(evt)) ESC();
      if (isDel(evt)) DEL();
      if (isShapeZoomIn(evt)) this.nodes.zoom('IN');
      if (isShapeZoomOut(evt)) this.nodes.zoom('OUT');
      if (isCopy(evt)) return COPY()
      if (isClose(evt)) CLOSE();
      if (isGroup(evt)) return GROUP(true)
      if (isUnGroup(evt)) return GROUP(false)

      if (this.viewbox.zoom(evt, VIEW_CENTER)) this.nodes.defocus(); //  缩放
      if (mark.marked()) return

      if (isAddEnd(evt)) return ADD_END()

      if (isViewCenter(evt)) return VIEW_CENTER()

      // if (isNextSearch(keyCode, shiftKey)) stage.fire('search:next')
      // if (isPrevSearch(keyCode, shiftKey)) stage.fire('search:prev')

      if (isParent(evt)) return PARENT_NODE()
      // if (isEditView(keyCode)) return EDIT_VIEW()

      if (EDIT_VIEW_ISSHOW || !this.nodes.move(evt)) {
        // 节点移动?
        this.viewbox.move(evt); // 视图移动
      }
    });

    const VIEW_CENTER = () => {
      const vnodes = this.nodes.getfocus().map(({ vnode }) => vnode);
      if (!vnodes.length) return
      const { left, right, top, bottom } = this.nodes.boxOfVNodes(vnodes);

      const [dx, dy, { x, y, width, height }] = centerDiffPoint(this.viewbox.get(), { x: accHF(left, right), y: accHF(top, bottom) });
      this.viewbox.set({ x: x + dx, y: y + dy, width, height });
    };
    this.on('VIEW_CENTER', VIEW_CENTER);

    const GROUP = (isbind) => {
      console.log('----GROUP', this.focusedNodes());
      if (isbind) {
        this.nodes.bindGroup(this.focusedNodes(), this.shape);
      } else {
        this.nodes.unBindGroup(this.focusedNodes());
      }
    };
    const DEL = () => this.nodes.remove();
    const CLOSE = () => {
      const node = this.focusedNodes()[0];
      if (!node) return
      console.log({ node });
    };

    const PARENT_NODE = () => {
      // 选中父节点
      const nodedata = this.nodes.getfocus()[0];
      if (!nodedata) return
      const {
        vnode: { id }
      } = nodedata;
      const parent = this.nodes.parent(id);
      if (!parent) return
      this.nodes.focus([parent.vnode.id]);
    };

    const COPY = () => {
      const nodedatas = this.nodes.getfocus();
      this.nodes.addMultiNode(nodedatas, this.shape);
    };
    // this.on(STAGE_EVENT.SEARCH_TAG, () => searchTag())
    const ADD_END = () => {
      console.log('------ add end --------');
      this.nodes.addEnd(this.shape);
    };
    const ESC = () => {
      // console.log('----------')
      mark.clear(true); // 清除标签和选中节点
    };

    // this.all.clear()
  }
  rerender(vdata, view) {
    this.nodes.clear();
    this.viewbox.set(view);
    this.render(vdata);
  }
  render(vdata) {
    // console.log({ vdata })
    this.nodes.render(vdata, this.shape, this.viewbox);
  }
  focusedNodes() {
    const nodes = this.nodes.getfocus();
    return nodes.map(({ node, vnode }) => ({ node, vnode, letter: this.marks.getLetters(vnode.id)[0] }))
  }
  focusedNodeMarks() {
    const nodes = this.nodes.getfocus();
    return nodes.map(({ vnode }) => this.marks.getLetters(vnode.id)[0])
  }
  selecteNodesOfMark(chars) {
    if (chars.length < 0) return
    // console.log('mark id:', this.marks.getIds(chars))
    const len = this.nodes.focus(this.marks.getIds(chars));
    // console.log({ len })
    this.emit('node', this.focusedNodes());
    return len
  }
  update({ type, val }) {
    if (type == 'link') {
      val = {
        solidlink: val.solidlink.map(this.marks.getAllIds),
        unlink: val.unlink.map(this.marks.getIds),
        dottedlink: val.dottedlink.map(this.marks.getAllIds)
      };
    }
    this.nodes.update({ type, val }, this.shape);
  }
  attach(container) {
    this.shape.attach(container);
  }
  reset(isshowside, { width, height }) {
    this.viewbox.set({ width, height }, true, isshowside);
    // if (isshowside) this.emit('VIEW_CENTER')
  }
  clear() {
    this.all.clear(); // event clear
    this.nodes.clear();
    this.shape.clear();
    // this.viewbox.clear()
  }
  // append(shape) {
  //   this.shapeGen = shape(this.svg)
  // }
}

var css_base = "::-webkit-scrollbar {\n  width: 5px;\n  height: 2px;\n} /* 滑块宽度 */\n::-webkit-scrollbar-track {\n  background-color: #efefef;\n} /* 滚动条的滑轨背景颜色 */\n::-webkit-scrollbar-thumb {\n  background-color: rgba(0, 0, 0, 0.2);\n} /* 滑块颜色 */\n\nhtml,\nbody {\n  padding: 0;\n  margin: 0;\n  height: 100%;\n  width: 100%;\n  font-family: sans-serif;\n}\n\ntext {\n  user-select: none;\n  cursor: pointer;\n  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,\n    sans-serif;\n}\n\n.w100 {\n  width: 100%;\n}\n\n.w80 {\n  width: 80%;\n}\n\n.w90 {\n  width: 90%;\n}\n\n.tac {\n  text-align: center;\n}\n\n.boxr {\n  box-sizing: border-box;\n}\n\n.input {\n  background: #0000004f;\n  border: 1px solid;\n}\n\n.hb {\n  border: 2px solid red;\n}\n\n.hb::hover {\n  border: 2px solid red;\n}\n\n.hide {\n  display: none;\n}\n\n.g-content {\n  overflow: hidden;\n  display: flex;\n  height: 100%;\n}\n.g-content-svg {\n  flex: 1;\n}\n.g-content-edit-view {\n  width: 40%;\n  display: none;\n  background: #fafafa;\n  height: 100%;\n  border-left: 10px solid #efefef;\n  overflow: hidden;\n}\n.g-content-edit {\n  display: none;\n  font-size: 16px;\n\n  width: 100%;\n  height: 100%;\n  padding: 5% 2%;\n  box-sizing: border-box;\n  border: 0;\n  border-left: 1px solid #ccc;\n  overflow: auto;\n\n  outline: none;\n  resize: none;\n  white-space: normal;\n  tab-size: 2;\n}\n\n.g-content-view {\n  display: none;\n  width: 100%;\n  height: 100%;\n  padding: 5% 2%;\n  box-sizing: border-box;\n  border: 0;\n  border-left: 1px solid #ccc;\n  overflow: auto;\n}\n\n.g-command {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: -60%;\n  margin: auto;\n  width: 40%;\n  min-width: 600px;\n  height: 60px;\n  padding: 10px;\n  opacity: 0.8;\n  background: #f3f3f3;\n  border-radius: 8px;\n  box-shadow: 0 0 3px #bfbfbf;\n  text-align: center;\n}\n\n/* markdown 状态 */\n.g-command.markdown {\n  height: 60%;\n  top: -10%;\n  width: 90%;\n}\n.g-command.markdown .g-command-edit {\n  line-height: 24px;\n  padding: 12px;\n  width: 100%;\n  white-space: normal;\n  overflow: hidden auto;\n}\n.g-command.markdown .g-command-title {\n  display: none;\n}\n\n/* markdown 状态 end */\n\n.g-command.markdown .g-command-edit-wrap {\n  flex: 1;\n  padding: 0;\n}\n.g-command-edit-wrap {\n  flex: 1;\n  padding: 0 14px;\n}\n.g-command-edit {\n  font-size: 24px;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n  border: 0;\n  outline: none;\n  line-height: 60px;\n  resize: none;\n  overflow: auto hidden;\n  white-space: nowrap;\n  tab-size: 2;\n}\n\n.g-command-edit::focus {\n  border: 0;\n  outline: none;\n}\n\n.g-command-ctx {\n  display: flex;\n  font-size: 0;\n  width: 100%;\n  height: 100%;\n  padding: 0;\n  border: 0;\n  border-radius: 8px;\n  outline: none;\n  background: #fff;\n  text-align: left;\n}\n\n.g-command-title {\n  padding: 0 16px;\n  border-radius: 8px 0 0 8px;\n  background: #464646;\n  color: #fff;\n  /* font-size: 38px; */\n  font-size: 30px;\n  display: inline-block;\n  height: 100%;\n  vertical-align: top;\n  line-height: 58px;\n  text-align: center;\n  /* width: 20%; */\n}\n\n.g-theme-stage-title {\n  position: fixed;\n  left: 0;\n  top: 0;\n  z-index: 10;\n  padding: 10px;\n  display: inline-block;\n  background: #f5f5f5;\n}\n\n.u-tag {\n  box-shadow: 0 0 3px #bfbfbf;\n  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));\n}\n\n.g-scene-nodetype {\n  box-shadow: 0 0 9px #bfbfbf;\n  filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.1));\n}\n\n.clear-slot {\n  font-size: 0;\n}\n\nbody pre.flow {\n  background-color: #1e2a3a;\n  color: #fff;\n  font-size: 14px;\n}\nbody pre code {\n  white-space: pre;\n}\n.font-zh {\n  font-size: 1.2em;\n}\n";

var css_textarea = "/* * { */\n/*   -webkit-box-sizing: border-box; */\n/*   -moz-box-sizing: border-box; */\n/*   box-sizing: border-box; */\n/* } */\n.g-content-view {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.g-content-view {\n  background: #fff;\n  word-wrap: break-word;\n  overflow: auto;\n  /* font-family: \"Helvetica Neue\", Helvetica, \"Segoe UI\", Arial, freesans, sans-serif; */\n  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,\n    sans-serif;\n  font-size: 15px;\n  line-height: 1.4em;\n}\n\n.g-content-view pre {\n  background-color: #1e2a3a !important;\n  color: #fff;\n}\n.g-content-view pre code.language-flow {\n  font-size: 13px;\n}\n.g-content-view pre code.language-flow .font-zh {\n  padding-right: 0.3em;\n  font-size: 12px;\n}\n.g-content-view pre .font-zh {\n  font-size: 0.9em;\n}\n\n.g-content-view > *:first-child {\n  margin-top: 0 !important;\n}\n.g-content-view strong {\n  font-weight: bold;\n}\n.g-content-view em {\n  font-style: italic;\n}\n.g-content-view h1,\n.g-content-view h2,\n.g-content-view h3,\n.g-content-view h4,\n.g-content-view h5,\n.g-content-view h6 {\n  position: relative;\n  margin-top: 1em;\n  margin-bottom: 16px;\n  font-weight: bold;\n  line-height: 1.4;\n}\n.g-content-view h1,\n.g-content-view h2 {\n  border-bottom: 1px solid #eee;\n}\n.g-content-view h1 {\n  font-size: 2.25em;\n  line-height: 1.2;\n  padding-bottom: 0.3em;\n}\n.g-content-view h2 {\n  padding-bottom: 0.3em;\n  font-size: 1.75em;\n  line-height: 1.225;\n  border-bottom: 1px dashed #eee;\n}\n.g-content-view blockquote {\n  padding: 0 15px;\n  color: #777;\n  border-left: 4px solid #ddd;\n  margin: 0;\n}\n\n.g-content-view ul blockquote,\n.g-content-view ol blockquote {\n  padding: 0;\n  border-width: 0;\n}\n.g-content-view blockquote > :last-child {\n  margin-bottom: 0;\n}\n.g-content-view blockquote > :first-child {\n  margin-top: 0;\n}\n.g-content-view p,\n.g-content-view blockquote,\n.g-content-view ul,\n.g-content-view ol,\n.g-content-view dl,\n.g-content-view table,\n.g-content-view pre {\n  margin-top: 0;\n  margin-bottom: 16px;\n}\n.g-content-view ul,\n.g-content-view ol {\n  padding-left: 1.4em;\n  list-style: initial;\n}\n.g-content-view ol {\n  list-style-type: decimal;\n}\n.g-content-view ol ol,\n.g-content-view ul ol {\n  list-style-type: lower-roman;\n}\n.g-content-view ul ul ol,\n.g-content-view ul ol ol,\n.g-content-view ol ul ol,\n.g-content-view ol ol ol {\n  list-style-type: lower-alpha;\n}\n.g-content-view pre {\n  padding: 16px;\n  overflow: auto;\n  font-size: 100%;\n  line-height: 1.2;\n  background-color: #eee;\n  border-radius: 3px;\n}\n.g-content-view pre code {\n  background-color: transparent;\n  color: inherit;\n}\n.g-content-view pre code:before,\n.g-content-view pre code:after,\n.g-content-view pre tt:before,\n.g-content-view pre tt:after {\n  letter-spacing: 0;\n  content: '';\n}\n.g-content-view code,\n.g-content-view tt {\n  padding: 0;\n  padding-top: 0.2em;\n  padding-bottom: 0.2em;\n  margin: 0;\n  font-size: 95%;\n  background-color: rgba(0, 0, 0, 0.04);\n  border-radius: 3px;\n  color: #c7254e;\n}\n.g-content-view code:before,\n.g-content-view code:after,\n.g-content-view tt:before,\n.g-content-view tt:after {\n  letter-spacing: -0.2em;\n  content: '\\00a0';\n}\n.g-content-view table {\n  width: 100%;\n  border-collapse: collapse;\n  border-spacing: 0;\n  max-width: 100%;\n  display: block;\n  background-color: transparent;\n}\n.g-content-view table th,\n.g-content-view table td {\n  border: 1px solid #ddd;\n  padding: 4px 10px;\n}\n.g-content-view table th {\n  font-weight: bold;\n  background: #f3f3f3;\n}\n.g-content-view table tr:nth-child(2n) {\n  background-color: #f8f8f8;\n}\n";

const createTheme = () => {
  const createStageTitle = () => {
    const stageTitleDom = elmt_byid('GStageTitle');
    // console.log({ stageTitleDom })
    return {
      txt(val) {
        // 读取 || 设置
        if (isUnDef(val)) {
          return stageTitleDom.innerHTML
        }
        return (stageTitleDom.innerHTML = val)
      }
    }
  };
  const stageTitle = createStageTitle();

  return {
    stageTitle
  }
};

const createScene = (options) => {
  const scene = new Scene(options);
  return scene
};

class Scene extends Event {
  viewbox = null // 视口, 缩放
  nodes = null // 舞台上的图形节点
  marks = null // 标记
  shape = null
  options = null
  // shapeGen = null // 图形生成器
  constructor(options) {
    super();
    this.options = options;
  }
  listen() {
    const mark = marking(this.marks, { ...this.nodes, focusOfMark: this.selecteNodesOfMark.bind(this) });
    const ESC = () => mark.clear(true); // 清除标签和选中节点

    this.on(STAGE_EVENT.MOUSEDOWN, () => {
      console.log('---- STAGE_EVENT.MOUSEDOWN -----');
      this.emit('ADD_NODE', this.focusedNodes());
      return mark.clear()
    });
    this.on(STAGE_EVENT.MOUSEUP, () => {
      this.nodes.mouseup();
    });
    this.on(STAGE_EVENT.KEYDOWN, (evt) => {
      if (isEsc(evt)) ESC();
      if (mark.render(evt, true)) return // 选择节点
    });
  }
  render() {
    // 节点渲染

    const { left, top, width, height, zoomsize, attr, offset, border = 6 } = this.options;
    const options = layout({ left, top, width, height, zoomsize, attr, offset, border });

    console.log({ left, top, width, height, zoomsize, attr, offset, border });
    this.shape = shape(borderBox(options));
    this.viewbox = createViewbox({ width, height, zoomsize, svg: this.shape.svg() });
    this.nodes = createNode({
      left: left - options.offset.left,
      top: top - options.offset.top,
      viewboxScale: (x, y) => [x, y],
      viewboxInfo: () => ({ x: 0, y: 0 })
    });
    this.marks = createMark({ tag: this.shape.tag, viewbox: this.viewbox });
    this.listen();
    this.nodes.render(deserializeData(JSON.parse(JSON.stringify(NodeType_Model))), this.shape);
  }
  focusedNodes() {
    const nodes = this.nodes.getfocus();
    return nodes.map(({ node, vnode }) => ({ node, vnode, letter: this.marks.getLetters(vnode.id)[0] }))
  }
  focusedNodeMarks() {
    const nodes = this.nodes.getfocus();
    return nodes.map(({ vnode }) => this.marks.getLetters(vnode.id)[0])
  }
  selecteNodesOfMark(chars) {
    if (chars.length == 0) return
    // console.log(chars, this.marks.getIds(chars))
    const len = this.nodes.focus(this.marks.getIds(chars));
    this.emit('ADD_NODE', this.focusedNodes());
    return len
  }
  attach(container) {
    this.shape.attach(container);
  }
  clear() {
    this.nodes?.clear();
    this.shape?.clear();
    this.shape = null;
    this.viewbox = null;
    // this.nodes = null
    // this.marks = null
  }
}

console.log({ UPDATE });
//logmid('MAIN::',{ stage_maxuid })

async function createStager(board, { width, height, left, top }, { commander, editview, theme }) {
  const content = board.group().attr({ transform: `translate(${left},${top})` });

  const store = (isforce) =>
    storeData(
      {
        ...stages.info(),
        data: curstage.nodes.vnodes(),
        view: curstage.viewbox
      },
      isforce
    );
  const stageStack = (minuid, maxuid) => {
    logmid('MAIN::', { maxuid });
    const stack = [];
    let stage = {};

    return {
      curuid: () => stage.uid,
      parent: () => stage.parent,
      isroot: (uid) => uid == 0 || isUnDef(uid),
      stack(uid) {
        if (isUnDef(uid)) {
          stack.pop();
        } else {
          stack.push(uid);
        }
        logmid('STAGE_LIFE::', { stack });
        return stack[stack.length - 1]
      },
      info(val) {
        return (stage = undef(stage, val))
      },
      update({ title, parent }) {
        // logmid('MAIN::',{ title, parent })
        stage.title = undef(stage.title, title);
        stage.parent = undef(stage.parent, parent);
        logmid('STAGE_LIFE::update:stage.uid:', stage.uid);
        return db_stage.send({
          uid: stage.uid,
          title: stage.title,
          parent: stage.parent
        })
      }
    }
  };
  const { uid: curuid } = local.stage();
  const minuid = curuid || (await db_stage.minuid());
  const maxuid = await db_stage.maxuid();
  logmid('STAGE_LIFE::', { minuid, maxuid, curuid });

  const stages = stageStack(minuid, maxuid);

  const initStage = ({ vdata, view }) => {
    //logmid('MAIN::',{ vdata, view })
    const stage = createStage({
      width,
      height,
      left,
      top,
      zoomsize: view.scale
    });
    stage.viewbox.set(view);
    logmid('MAIN::', { vdata });
    stage.render(vdata);
    stage.attach(content);
    return stage
  };

  // 挂载舞台
  const createMounteStage = (ismounting = false) => {
    const stageData = ({ uid, title }) => createStageData({ uid, parent: stages.info().uid, title, width, height });
    return {
      ismounting() {
        return ismounting
      },
      stageData({ uid, title }) {
        ismounting = true;
        return stageData({ uid, title })
      },
      stageParse({ uid, width, height, data, parent, title }) {
        return {
          uid,
          parent,
          title,
          ...initData({ width, height, data, parent, title })
        }
      },
      stageRender({ uid, parent, title, vdata, view }) {
        const stage = initStage({ vdata, view });
        logmid('MAIN::', { uid });
        stages.info({ uid, parent, title });
        theme.stageTitle.txt(title);
        ismounting = false;
        return stage
      }
    }
  };
  const mounteStage = createMounteStage();

  const stageLife = async (evt) => {
    if (mounteStage.ismounting()) return
    if (isOpenStage(evt)) {
      // 打开子级舞台
      //logmid('MAIN::','--- open stage ---',)
      const nodedatas = curstage.focusedNodes();
      if (!nodedatas.length) return
      let {
        vnode: { stage: stageid, txt }
      } = nodedatas[0];
      logmid('STAGE_LIFE::stageLife::go:', { stageid });
      if (isUnDef(stageid)) {
        stageid = (await db_stage.maxuid()) + 1;
      }
      logmid('STAGE_LIFE::stageLife::go:', { stageid });

      const stage = await mounteStage.stageData({ uid: stageid, title: txt });
      stages.stack(stage.uid);
      nodedatas[0].vnode.stage = stage.uid;
      store(true); // 先保存, 放置缓存失效 DOTO:: 需要stageManager管理器模板

      curstage.clear();
      // curstage = await mounteStage({ uid, title: txt })
      curstage = mounteStage.stageRender(mounteStage.stageParse(stage));
      return
    }
    if (isBackStage(evt)) {
      // 返回上级舞台
      // localmock()
      store(true);
      let { parent } = stages.info();
      logmid('STAGE_LIFE::', { parent });

      if (stages.isroot(parent)) return
      parent = undef(parent, stages.stack());
      logmid('STAGE_LIFE::', { parent });
      curstage.clear();
      curstage = mounteStage.stageRender(mounteStage.stageParse(await mounteStage.stageData({ uid: parent })), true);

      // curstage = await mounteStage({ uid, title }, true)
    }
  };

  let curstage = null;
  if (isDef$1(minuid)) {
    // db有数据 minuid:0 无法进入
    logmid('STAGE_LIFE::', 'LOCAL_STATE_INIT::');
    stages.stack(minuid);
    curstage = mounteStage.stageRender(mounteStage.stageParse(await mounteStage.stageData({ ...STAGE, uid: minuid })));
  }
  const sync = createSync(!isDef$1(minuid));
  sync.pubsub.on(SYNC_STAGE_UPDTE, ({ uid, title, data, parent, updateTime }) => {
    // 从服务端更新数据
    logmid('STAGE_LIFE::', 'SYNC_STAGE_UPDTE::', stages.curuid(), uid);
    if (stages.curuid() != uid) return
    data = JSON.parse(data);
    curstage.clear();
    curstage = mounteStage.stageRender(
      mounteStage.stageParse({
        width,
        height,
        uid,
        parent,
        title,
        data,
        updateTime
      })
    );
    store(true);
  });
  sync.pubsub.on(SYNC_STAGE_INIT, ({ uid, title, data, parent, updateTime }) => {
    // 从服务端初始数据
    logmid('STAGE_LIFE::', 'SYNC_STAGE_INIT::', {
      uid,
      title,
      data,
      parent,
      updateTime
    });
    data = JSON.parse(data);
    curstage = mounteStage.stageRender(
      mounteStage.stageParse({
        width,
        height,
        uid,
        parent,
        title,
        data,
        updateTime
      })
    );
    store(true);
  });
  sync.pubsub.on(SYNC_STAGE_NOTATA, async () => {
    // 没有数据
    logmid('STAGE_LIFE::', 'SYNC_STAGE_NOTATA::', { minuid });
    curstage = mounteStage.stageRender(mounteStage.stageParse(await mounteStage.stageData({ ...STAGE, uid: 1 })));
  });

  sync.syncOperation();

  const mounteNodeManageScene = () => {
    //logmid('MAIN::','STAGE_EVENT.ADD')
    const managerScene = createScene({
      width,
      height,
      left,
      top,
      zoomsize: 1
    });
    managerScene.render();
    managerScene.attach(content);
    return managerScene
  };
  const sceneManageFn = () => {
    const scenes = [];
    return {
      scenes,
      has: () => !!scenes.length,
      add(curstage) {
        if (this.has()) return
        //logmid('MAIN::','------add -------')
        const managerScene = mounteNodeManageScene();
        managerScene.on('ADD_NODE', (nodes) => {
          if (!nodes.length) return
          curstage.nodes.addOfParent(nodes, curstage.shape, curstage.viewbox);
          this.clear();
        });
        scenes.push(managerScene);
      },
      clear() {
        scenes.pop()?.clear(); // managerScene.clear()
      }
    }
  };
  const sceneManager = sceneManageFn();

  const keydown = (evt, scene) => {
    // 各模块调度模板
    commander.exec(
      evt,
      scene.nodes,
      scene.update?.bind(scene), // 事件
      scene.focusedNodeMarks(),
      scene.marks.marked(),
      scene.selecteNodesOfMark.bind(scene)
    );
    if (commander.state.show()) return

    if (!editview.state.editshow()) {
      // 选中节点 &&  侧边未显示
      if (mark.trigger(scene, evt).ismarked() && !editview.state.show() && !isGlobalKey(evt)) return
    }

    if (scene.nodes.hasfocus()) {
      editview.exec(evt, scene.nodes.focusid());
    }

    if (editview.state.editshow() && !isGlobalKey(evt)) return
    if (editview.state.show() && !isGlobalStageKey(evt)) return

    // node 绑定舞台
    // node 解绑舞台
    if (isDel(evt) && scene.nodes.hasfocus()) {
      //
      const nodedatas = scene.focusedNodes();
      nodedatas.forEach(({ vnode: { stage } }) => {
        if (isUnDef(stage)) return
        db_stage.send({ uid: stage, parent: 0 });
      });
      logmid('MAIN::', { nodedatas });
    }
    stageLife(evt);
    scene.emit(STAGE_EVENT.KEYDOWN, evt);
    if (isHistoryNext(evt)) return HISTORY_NEXT()
    if (isHistoryPrev(evt)) return HISTORY_PREV()
  };

  const markFn = () => {
    let ismarked = false;
    return {
      ismarking: (scene) => scene.marks.marked(),
      ismarked: () => ismarked,
      trigger(scene, evt) {
        scene.emit(STAGE_EVENT.MARKING, [evt, (val) => (ismarked = val)]);
        return this
      }
    }
  };
  const mark = markFn();

  logmid('MAIN::', { curstage });
  {
    commander.pubsub.on('STAGE_TITLE_GET', (editStage) => {
      logmid('STAGE_TITLE::get:', theme.stageTitle.txt());
      editStage(theme.stageTitle.txt());
    });
    commander.pubsub.on('STAGE_TITLE_SET', (title) => {
      logmid('STAGE_TITLE::', { title });
      theme.stageTitle.txt(title);
      stages.update({ title }).then((res) => {
        logmid('MAIN::', { res });
      });
    });
    commander.pubsub.on('STAGE_PARENT_ID_GET', (editStage) => {
      logmid('STAGE_PARENT_ID_GET::get:', stages.parent());
      editStage(stages.parent());
    });
    commander.pubsub.on('STAGE_PARENT_ID_SET', (parent) => {
      logmid('STAGE_PARENT_ID_SET::set:', { parent });
      stages.update({ parent }).then((res) => {
        logmid('PSTAGE_PARENT_ID_SET::', { res });
      });
    });

    {
      let _stagechar = '';
      commander.pubsub.on('STAGE_CONTENT_GET', (editStage) => {
        _stagechar = localget();
        // return editStage(_stagechar)
        editStage(
          JSON.stringify(
            JSON.parse(_stagechar),
            (k, v) => {
              return v
            },
            '\t'
          )
        );
      });
      // 接收command中的stage数据
      commander.pubsub.on('STAGE_CONTENT_SET', async (stagechar) => {
        if (_stagechar == stagechar) return
        // 检测内容是否变化, 避免无效更新
        try {
          const stage = jsonparse(`${stagechar}`);
          logmid('MAIN::', { stage });
          curstage.clear();
          curstage = initStage(await initData({ width, height, data: stage.data }));
        } catch (err) {
          logmid('MAIN::', err);
        }
      });
    }
  }

  {
    const articleid = (uid) => undef(curstage.nodes.focusids().article, uid);
    const nodeArticleID = (isNonempty, uid) => (isNonempty ? articleid(uid) : undefined);
    const saveArticle = async ({ data, isNonempty }) => {
      if (isUnDef(data)) return // 无内容变化
      let uid = articleid();
      logmid('ARTICLE::', { data, isNonempty, uid });

      const { uid: newuid } = await db_article.send({ uid, data }); // 永久存储
      logmid('ARTICLE::', { uid, newuid });

      curstage.nodes.update({
        type: UPDATE.ARTICLE_RENDER,
        val: nodeArticleID(isNonempty, newuid)
      });
      store();
    };
    const viewchange = (isNonempty) => {
      const w = isNonempty ? viewport.detach(width) : width;
      board.size(w, height).viewbox(0, 0, w, height);
      curstage.reset(isNonempty, { width: w, height });
    };

    editview.pubsub.on('EDIT_OPEN', async (nodeid) => {
      logmid('ARTICLE::', { nodeid }, articleid());
      viewchange(true);
      const [article] = await db_article.fetchUid(articleid());
      // editview.pubsub.emit('EDIT_OPEN_END', article?.data)
      editview.open(article?.data);
    });
    editview.pubsub.on('EDIT_SAVE_ARTICLE', saveArticle);
    editview.pubsub.on('EDIT_CLOSE', async ({ data, isNonempty }) => {
      // logmid('MAIN::',{ isNonempty })
      if (!isNonempty) {
        const uid = articleid();
        curstage.nodes.update({
          type: UPDATE.ARTICLE_RENDER,
          val: nodeArticleID(isNonempty)
        });
        if (!isUnDef(uid)) await db_article.delete(uid);
      } else {
        await saveArticle({ data, isNonempty });
      }
      editview.close();
      curstage.nodes.defocus();
      viewchange(false);
    });
  }

  const mousedown = (evt) => (scene) => {
    const { x, y } = evt;
    scene.nodes.select({ x, y });
    scene.emit(STAGE_EVENT.MOUSEDOWN, evt);
  };

  const HISTORY = (fn) => {
    fn().then((list) => {
      if (list.length == 0) return
      const { uid, parent, data } = list[0].data;
      const { points, view } = JSON.parse(data);
      logmid('HISTORY::', { points, view, list, uid, parent });
      // this.rerender(deserializeData(points), view)
    });
  };
  const HISTORY_PREV = () => HISTORY(db.history(NODE).prev);
  const HISTORY_NEXT = () => HISTORY(db.history(NODE).next);
  return {
    switch(id) {
      // stage_id
      curstage.clear();
    },
    mousemove(evt) {
      if (!curstage) return
      const { x, y } = evt;
      curstage.nodes.hover({ x, y });

      curstage.emit(STAGE_EVENT.MOUSEMOVE, evt);
    },
    mousedown(evt) {
      if (!curstage) return
      // 拦截, Command, editview
      if (commander.state.show()) return
      if (editview.state.show()) return
      // TODO:: 找到end

      if (sceneManager.scenes.length) {
        sceneManager.scenes.forEach(mousedown(evt));
      } else {
        mousedown(evt)(curstage);
      }
    },
    mouseup(evt) {
      if (!curstage) return

      // if (!curstage || !curstage.nodes) return
      curstage.emit(STAGE_EVENT.MOUSEUP, evt);
      // //logmid('MAIN::',curstage.nodes)
      debounceStoreData(() => ({
        ...stages.info(),
        data: curstage.nodes.vnodes(),
        view: curstage.viewbox
      }));
    },
    async keydown(evt) {
      if (mounteStage.ismounting()) return // 主舞台必须存在
      if (isEsc(evt)) sceneManager.clear(); // 清除子场景
      if (
        isAddNodeManager(evt) && // 添加子场景(满足条件)
        !mark.ismarking(curstage) &&
        !editview.state.show() &&
        !commander.state.show()
      )
        sceneManager.add(curstage);

      if (!sceneManager.has()) {
        // 是否存在子场景
        keydown(evt, curstage);
        debounceStoreData(() => ({
          ...stages.info(),
          data: curstage.nodes.vnodes(),
          view: curstage.viewbox
        }));
      } else {
        sceneManager.scenes.forEach((scene) => scene.emit(STAGE_EVENT.KEYDOWN, evt));
      }
    }
  }
}

const observe = (operation) => (source) => {
  source(0, (t, d) => {
    if (t === 1) operation(d);
  });
};
{
  const source = (start, sink) => {
    if (start !== 0) return
    console.log('Greet');
    sink(0, 'inited ok send message');
    // 解构出执行逻辑(模板), 剥离业务模块
    // 剥离出数据源
    setTimeout(
      function () {
        sink(1, 'vvvv');
      }.bind(undefined),
      100
    );
  };
  const operation = (...arg) => console.log('operation:', arg);
  observe(operation)(source);
}

function makeSubject() {
  let sinks = [];
  let done = false;
  return (type, data) => {
    if (done) return
    if (type === 0) {
      const sink = data;
      sinks.push(sink);
      sink(0, (t) => {
        if (t === 2) {
          const i = sinks.indexOf(sink);
          if (i > -1) sinks.splice(i, 1);
        }
      });
    } else {
      const zinkz = sinks.slice(0);
      for (let i = 0, n = zinkz.length, sink; i < n; i++) {
        sink = zinkz[i];
        if (sinks.indexOf(sink) > -1) sink(type, data);
      }
      if (type === 2) {
        done = true;
        sinks.length = 0;
      }
    }
  }
}

{
  const subject = makeSubject();

  let count = 0;
  setInterval(() => {
    subject(1, ++count);
  }, 1000);
  // observe(x => console.log(x + 1))(subject)

  // setTimeout(() => {
  //   observe(x => console.log(x + 2))(subject)
  // }, 2500)
}

function insertCss(css) {
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', async () => {
  insertCss(css_base); // 插入样式
  insertCss(css_textarea); // 插入样式

  const commander = createCommand(); // 初始输入框
  const editview = createEditView();
  const theme = createTheme();
  await allUidsPm(); // 读取db中uid

  const [left, top] = [0, 0];
  // const width = 0 // document.body.clientWidth
  // const height = 0 //document.body.clientHeight
  const { clientWidth: width, clientHeight: height } = elmt_byid('GSvg');
  const board = SVG().addTo('#GSvg').size(width, height).viewbox(left, top, width, height);
  // const board = SVG().removeNamespace().addTo('#GSvg').size(width, height).viewbox(left, top, width, height)
  // const stage = boot(draw.group().attr({ transform }), { width, height, top, left }) // 初始画布
  const stager = await createStager(board, { width, height, top, left }, { commander, editview, theme }); // 初始画布

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
  window.addEventListener(
    'mousemove',
    (evt) => {
      stager.mousemove(evt);
      // requestIdleCallback((deadline) => {
      //   if (deadline.timeRemaining() < 4) return
      //   stager.mousemove(evt)
      // })
    },
    { passive: false }
  );

  window.addEventListener('mouseup', stager.mouseup.bind(stager));
  window.addEventListener('mousedown', stager.mousedown.bind(stager));
  window.addEventListener('keydown', (evt) => {
    // console.log({ keyCode, altKey, ctrlKey, shiftKey, evt })
    if (isKeyAbort(evt)) return
    GlobalPreventDefault(evt);
    stager.keydown(evt);
    // requestIdleCallback((deadline) => {
    //   if (deadline.timeRemaining() < 4) return
    //   stager.keydown(evt)
    // })
  });
});
//# sourceMappingURL=index.js.map
