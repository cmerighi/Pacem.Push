/**
 * pacem v0.20.0-alexandria (https://js.pacem.it)
 * Copyright 2021 Pacem (https://pacem.it)
 * Licensed under MIT
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var Pacem;
(function (Pacem) {
    const RGB_PATTERN = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
    const RGBA_PATTERN = /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\)$/;
    const HEX_PATTERN = /^#[a-f0-9]{6}$/;
    const HEX_SHORT_PATTERN = /^#[a-f0-9]{3}$/;
    ;
    ;
    class Colors {
        static _clampRGB(rgb) {
            const clmp = (n) => Math.min(1.0, Math.max(0, n));
            if (rgb[3] == null) {
                rgb[3] = 1.0;
            }
            return { r: clmp(rgb[0]), g: clmp(rgb[1]), b: clmp(rgb[2]), a: Math.min(1, Math.max(0, rgb[3])) };
        }
        static _normalize(rgb) {
            return [rgb[0] / 255.0, rgb[1] / 255.0, rgb[2] / 255.0, rgb[3]];
        }
        static parse(clr) {
            clr = (clr || '').toLowerCase();
            if (RGB_PATTERN.test(clr)) {
                let rgbArr = RGB_PATTERN.exec(clr);
                return this._clampRGB(this._normalize([parseInt(rgbArr[1]), parseInt(rgbArr[2]), parseInt(rgbArr[3]), 1]));
            }
            if (RGBA_PATTERN.test(clr)) {
                let rgbArr = RGBA_PATTERN.exec(clr);
                return this._clampRGB(this._normalize([parseInt(rgbArr[1]), parseInt(rgbArr[2]), parseInt(rgbArr[3]), parseFloat(rgbArr[4])]));
            }
            if (HEX_PATTERN.test(clr)) {
                let hex = HEX_PATTERN.exec(clr)[0];
                return this._clampRGB(this._normalize([parseInt('0x' + hex.substr(1, 2)), parseInt('0x' + hex.substr(3, 2)), parseInt('0x' + hex.substr(5, 2)), 1]));
            }
            if (HEX_SHORT_PATTERN.test(clr)) {
                let hex = HEX_SHORT_PATTERN.exec(clr)[0];
                let r = hex.substr(1, 1), g = hex.substr(2, 1), b = hex.substr(3, 1);
                return this._clampRGB(this._normalize([parseInt('0x' + r + r), parseInt('0x' + g + g), parseInt('0x' + b + b), 1]));
            }
        }
        static hue(rgb) {
            const r = rgb.r, g = rgb.g, b = rgb.b;
            return Math.round(Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180 / Math.PI);
        }
        static luminance(rgb) {
            const r = rgb.r, g = rgb.g, b = rgb.b;
            return .5 * (Math.max(r, g, b) + Math.min(r, g, b));
        }
        static saturation(rgb) {
            const l = this.luminance(rgb);
            const r = rgb.r, g = rgb.g, b = rgb.b;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            return (l === 0 || l === 1) ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
        }
        static hsl(rgb) {
            return { h: this.hue(rgb), s: this.saturation(rgb), l: this.luminance(rgb), a: rgb.a };
        }
        static rgb(hsl) {
            const h = hsl.h, s = hsl.s, l = hsl.l, h6 = h / 60.0;
            const C = (1 - Math.abs(2 * l - 1)) * s;
            const X = C * (1 - Math.abs(h6 % 2 - 1));
            const m = l - C / 2;
            const compose = (r, g, b) => this._clampRGB([r + m, g + m, b + m, hsl.a]);
            if (h6 <= 1) {
                return compose(C, X, 0);
            }
            else if (h6 <= 2) {
                return compose(X, C, 0);
            }
            else if (h6 <= 3) {
                return compose(0, C, X);
            }
            else if (h6 <= 4) {
                return compose(0, X, C);
            }
            else if (h6 <= 5) {
                return compose(X, 0, C);
            }
            else if (h6 <= 6) {
                return compose(C, 0, X);
            }
        }
    }
    Pacem.Colors = Colors;
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    const JSON_DATE_PATTERN = /^\/Date\([\d]+\)\/$/i;
    class Dates {
        static parse(input) {
            let d;
            if (typeof input === 'string') {
                if (JSON_DATE_PATTERN.test(input))
                    d = parseInt(input.substring(6));
                else
                    d = Date.parse(input);
                return new Date(d);
            }
            else if (typeof input === 'number') {
                return new Date(input);
            }
            else
                return input;
        }
        static isLeapYear(year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        }
        static daysInMonth(year, month) {
            return [31, (Dates.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        }
        static isDate(date) {
            return date instanceof Date && !isNaN(date.valueOf());
        }
        static dateOnly(datetime) {
            return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate());
        }
        static addMonths(input, value) {
            let n = input.getDate(), i = new Date(input), month = i.getMonth() + value, years = 0;
            while (month < 0) {
                month += 12;
                years--;
            }
            i.setDate(1);
            i.setMonth(month % 12);
            i.setFullYear(i.getFullYear() + years + Math.floor(month / 12));
            i.setDate(Math.min(n, Dates.daysInMonth(i.getFullYear(), i.getMonth())));
            return i;
        }
        static addDays(input, value) {
            return new Date(input.valueOf() + value * 86400000);
        }
    }
    Pacem.Dates = Dates;
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    const FLOAT_PATTERN = /[-+]?[\d]+(\.[\d]+(e-[\d]+)?)?/g;
    function parseAsNumericalArray(input) {
        const arr = [];
        let reg = input.match(FLOAT_PATTERN);
        if (reg && reg.length > 0) {
            reg.forEach(i => arr.push(parseFloat(i)));
        }
        return arr;
    }
    Pacem.parseAsNumericalArray = parseAsNumericalArray;
    class Size {
        static parse(sz) {
            let arr = parseAsNumericalArray(sz);
            if (arr && arr.length === 4) {
                return { width: arr[0], height: arr[1] };
            }
            throw new Error(`Cannot parse "${sz}" as a valid Size.`);
        }
        static isSize(obj) {
            return typeof obj === 'object'
                && 'width' in obj && typeof obj['width'] === 'number'
                && 'height' in obj && typeof obj['height'] === 'number';
        }
    }
    Pacem.Size = Size;
    class Point {
        static parse(pt) {
            let arr = parseAsNumericalArray(pt);
            if (arr && arr.length === 2) {
                return { x: arr[0], y: arr[1] };
            }
            throw new Error(`Cannot parse "${pt}" as a valid Point.`);
        }
        static isPoint(obj) {
            return typeof obj === 'object'
                && 'x' in obj && typeof obj['x'] === 'number'
                && 'y' in obj && typeof obj['y'] === 'number';
        }
        static distance(p1, p2) {
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        }
        static subtract(p, from) {
            return { x: from.x - p.x, y: from.y - p.y };
        }
        static add(...points) {
            var point = { x: 0, y: 0 };
            for (var p of points) {
                point.x += p.x;
                point.y += p.y;
            }
            return point;
        }
    }
    Pacem.Point = Point;
    class Rect {
        static parse(rect) {
            let arr = parseAsNumericalArray(rect);
            if (arr && arr.length === 4) {
                return { x: arr[0], y: arr[1], width: arr[2], height: arr[3] };
            }
            throw new Error(`Cannot parse "${rect}" as a valid Rect.`);
        }
        static isRect(obj) {
            return Point.isPoint(obj) && Size.isSize(obj);
        }
        static intersect(...rects) {
            const empty = { x: 0, y: 0, height: 0, width: 0 }, arr = Array.from(rects || []);
            if (arr.length <= 0) {
                return empty;
            }
            var rect = arr[0];
            for (var i = 1; i < arr.length; i++) {
                const r = arr[i];
                const x = Math.max(r.x, rect.x), y = Math.max(r.y, rect.y), xw = Math.min(r.x + r.width, rect.x + rect.width), xh = Math.min(r.y + r.height, rect.y + rect.height), w = xw - x, h = xh - y;
                if (w < 0 || h <= 0) {
                    return empty;
                }
                rect = { x: x, y: y, width: w, height: h };
            }
            return rect;
        }
        static expand(rect, ...args) {
            const arr = Array.from(args || []);
            let x0 = rect.x, y0 = rect.y, x1 = x0, y1 = y0;
            if (Rect.isRect(rect)) {
                x1 += rect.width;
                y1 += rect.height;
            }
            for (let p of arr) {
                x0 = Math.min(p.x, x0);
                y0 = Math.min(p.y, y0);
                x1 = Math.max(p.x, x1);
                y1 = Math.max(p.y, y1);
            }
            return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
        }
    }
    Pacem.Rect = Rect;
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var _HistoryService_backwards, _HistoryService_forwards, _HistoryService_maxlength, _HistoryService_current;
    class HistoryService {
        constructor(state, maxlength) {
            _HistoryService_backwards.set(this, []);
            _HistoryService_forwards.set(this, []);
            _HistoryService_maxlength.set(this, void 0);
            _HistoryService_current.set(this, void 0);
            __classPrivateFieldSet(this, _HistoryService_current, state, "f");
            __classPrivateFieldSet(this, _HistoryService_maxlength, maxlength, "f");
        }
        get current() {
            return __classPrivateFieldGet(this, _HistoryService_current, "f");
        }
        get canUndo() {
            return __classPrivateFieldGet(this, _HistoryService_backwards, "f").length > 0;
        }
        get canRedo() {
            return __classPrivateFieldGet(this, _HistoryService_forwards, "f").length > 0;
        }
        undo() {
            if (this.canUndo) {
                const back = __classPrivateFieldGet(this, _HistoryService_backwards, "f"), fore = __classPrivateFieldGet(this, _HistoryService_forwards, "f"), current = __classPrivateFieldGet(this, _HistoryService_current, "f");
                fore.unshift(current);
                __classPrivateFieldSet(this, _HistoryService_current, back.pop(), "f");
            }
        }
        redo() {
            if (this.canRedo) {
                const back = __classPrivateFieldGet(this, _HistoryService_backwards, "f"), fore = __classPrivateFieldGet(this, _HistoryService_forwards, "f"), current = __classPrivateFieldGet(this, _HistoryService_current, "f");
                back.push(current);
                __classPrivateFieldSet(this, _HistoryService_current, fore.shift(), "f");
            }
        }
        push(state) {
            __classPrivateFieldGet(this, _HistoryService_forwards, "f").splice(0);
            __classPrivateFieldGet(this, _HistoryService_backwards, "f").push(__classPrivateFieldGet(this, _HistoryService_current, "f"));
            __classPrivateFieldSet(this, _HistoryService_current, state, "f");
            const max = __classPrivateFieldGet(this, _HistoryService_maxlength, "f"), queue = __classPrivateFieldGet(this, _HistoryService_backwards, "f");
            if (max > 0 && queue.length > max) {
                queue.splice(0, queue.length - max);
            }
        }
        reset() {
            __classPrivateFieldGet(this, _HistoryService_forwards, "f").splice(0);
            __classPrivateFieldGet(this, _HistoryService_backwards, "f").splice(0);
        }
    }
    _HistoryService_backwards = new WeakMap(), _HistoryService_forwards = new WeakMap(), _HistoryService_maxlength = new WeakMap(), _HistoryService_current = new WeakMap();
    Pacem.HistoryService = HistoryService;
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    ;
    class Matrix2D {
        static isIdentity(m) {
            return m.a === 1 && m.d === 1 && m.b === 0 && m.f === 0 && m.c === 0 && m.e === 0;
        }
        static get identity() {
            return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
        }
        static copy(m) {
            return { a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f };
        }
        static scale(m, sx, sy = sx) {
            return { a: m.a * sx, b: m.b, c: m.c, d: m.d * sy, e: m.e, f: m.f };
        }
        static translate(m, t) {
            return { a: m.a, b: m.b, c: m.c, d: m.d, e: m.e + t.x, f: m.f + t.y };
        }
        static multiply(m1, m2) {
            if ("x" in m1 && "y" in m1) {
                if (typeof m2 === 'number') {
                    return { x: m1.x * m2, y: m1.y * m2 };
                }
                else {
                    return { x: m1.x * m2.a + m1.y * m2.c + m2.e, y: m1.x * m2.b + m1.y * m2.d + m2.f };
                }
            }
            if (typeof m2 === 'number') {
                return {
                    a: m1.a * m2, b: m1.b * m2, c: m1.c * m2, d: m1.d * m2, e: m1.e * m2, f: m1.f * m2
                };
            }
            return {
                a: m1.a * m2.a + m1.b * m2.c,
                b: m1.a * m2.b + m1.b * m2.d,
                c: m1.c * m2.a + m1.d * m2.c,
                d: m1.c * m2.b + m1.d * m2.d,
                e: m1.e * m2.a + m1.f * m2.c + m2.e,
                f: m1.e * m2.b + m1.f * m2.d + m2.f
            };
        }
        static det(m) {
            return m.a * m.d - m.c * m.b;
        }
        static invert(m) {
            const det = this.det(m);
            if (det === 0) {
                return null;
            }
            const invdet = 1 / det;
            return this.multiply({
                a: m.d,
                b: -m.c,
                c: -m.b,
                d: m.a,
                e: -m.e * m.d + m.c * m.f,
                f: m.e * m.b - m.a * m.f
            }, invdet);
        }
    }
    Pacem.Matrix2D = Matrix2D;
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    class NullChecker {
        static isNull(o) {
            return o === null || o === void 0;
        }
        static isEmpty(o) {
            try {
                return (Array.isArray(o) && o.length === 0)
                    || (typeof o === 'string' && o === '')
                    || (typeof o === 'object' && Object.keys(o).length === 0 && !Pacem.Dates.isDate(o) && !(o instanceof RegExp));
            }
            catch (e) {
                return false;
            }
        }
        static isNullOrEmpty(o) {
            return NullChecker.isNull(o) || NullChecker.isEmpty(o);
        }
    }
    Pacem.NullChecker = NullChecker;
})(Pacem || (Pacem = {}));
Number.prototype.isCloseTo = function (other, precision = 14) {
    return this.toFixed(precision) === other.toFixed(precision);
};
Number.prototype.roundoff = function (precision = 14) {
    return parseFloat(this.toFixed(precision));
};
var Pacem;
(function (Pacem) {
    var Compile;
    (function (Compile) {
        class LexerClass {
            tokenize(input, grammar) {
                const tokens = [];
                while (input) {
                    const start = input.length;
                    for (let rule of grammar) {
                        const newTokens = rule.exec(input, this), length = newTokens === null || newTokens === void 0 ? void 0 : newTokens.length;
                        if (length > 0) {
                            Array.prototype.push.apply(tokens, newTokens);
                            const last = newTokens[length - 1];
                            input = input.substr((last.index || 0) + last.raw.length);
                            break;
                        }
                    }
                    if (input.length >= start) {
                        throw new Error(`Cannot parse\n"${input}"\n using the provided grammar.`);
                    }
                }
                return tokens;
            }
        }
        class Parser {
            constructor(_lexer = new LexerClass()) {
                this._lexer = _lexer;
            }
            parse(input, grammar, renderer) {
                const tokens = this._lexer.tokenize(input, grammar);
                return renderer.render(tokens);
            }
        }
        Compile.Parser = Parser;
    })(Compile = Pacem.Compile || (Pacem.Compile = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Compile;
    (function (Compile) {
        var Markdown;
        (function (Markdown) {
            function htmlEncode(input) {
                return (input !== null && input !== void 0 ? input : '').replace(/</g, '&lt;');
            }
            function extractReference(input) {
                if (Pacem.NullChecker.isNullOrEmpty(input)) {
                    return void 0;
                }
                if (/^\(/.test(input) && /\)$/.test(input)) {
                    return void 0;
                }
                if (/^\[/.test(input) && /\]$/.test(input)) {
                    input = input.substr(1, input.length - 2);
                }
                return input;
            }
            function regexMatchIndex(arr) {
                return (arr === null || arr === void 0 ? void 0 : arr.index) || void 0;
            }
            function extractUrl(input) {
                if (Pacem.NullChecker.isNullOrEmpty(input)) {
                    return void 0;
                }
                if (/^\[/.test(input) && /\]$/.test(input)) {
                    return void 0;
                }
                if (/^\(/.test(input) && /\)$/.test(input)) {
                    input = input.substr(1, input.length - 2);
                }
                return input;
            }
            function normalizeReference(input) {
                return input === null || input === void 0 ? void 0 : input.replace(/[^\w]+/g, ' ').trim().replace(/ +/g, '-').toLowerCase();
            }
            function match(input, pattern, fn) {
                const arr = pattern.exec(input);
                if (arr && arr.length) {
                    return fn(arr);
                }
                return null;
            }
            const COMMENT = /(<!--)([\s\S]*?)(-->|$)/;
            const HR = /^ {0,3}(={3,}|_{3,}|-{3,})(\r?\n|$)/;
            const HEADING = /^ {0,3}(#{1,6})\s+([^\n]+)(\r?\n|$)+/;
            const HEADING1 = /^ {0,3}([^\n]+)(\r?\n=+(\r?\n|$))+/;
            const HEADING2 = /^ {0,3}([^\n]+)(\r?\n-+(\r?\n|$))+/;
            const CODEBLOCK = /^ {4,}.+(\r?\n {4,}.+)*(\r?\n|$)+/;
            const FENCES = /^ {0,3}``` *([^\n]*)\r?\n(([\s\S](?!\r?\n {0,3}```))*.(\r?\n)+) {0,3}```(\r?\n|$)+/;
            const BLOCKQUOTE = /^ {0,3}> *([^\n]+)(\r?\n {0,3}> *([^\n]*))*(\r?\n|$)+/;
            const ULIST = /^( {0,3}([-+]).*\r?\n|$)((?!(?: {0,3}(?:\d+[.\)]|\r?\n\S))).*(\r?\n|$))*/;
            const OLIST = /^( {0,3}(\d+[.\)]).*\r?\n|$)((?!(?: {0,3}(?:[+-]|\r?\n\S))).*(\r?\n|$))*/;
            const LISTITEM = /^(?:[-+*]|\d+[.\)])/m;
            const PARAGRAPH = /^(?! {4,})(.+(\n(?! {0,3}```)(?! {0,3}([-+]|\d+[.\)]))(?! {4,})(?! {0,3}>).+)*)/;
            const REF = /^ {0,3}(!?)\[([^\]]+)\]: +(\S+)(?: +['"\(](.+)['"\)])?(\r?\n|$)+/;
            const IMAGE_OR_LINK = /!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?(\[[^\[\]]*\]|\([^\(\)]*\))?/;
            const CODE = /(?:(?<!\\)`)(.+?)(?:(?<!\\)`)/;
            const EMPHASIZE = /(\*\*?|__?)((?!\1\s?)(?:(?!\1)[\S\s])*[^\s])\1/;
            const STRIKE = /(~~?|__?)(?!\1\s?)([^\s][\s\S]*?(?!\1)[^\s])\1/;
            const QUOTE = /(:")(?!":\s?)([^\s][\s\S]*?(?!":)[^\s])":/;
            const SPACE = /^\s+/;
            const LINEBREAK = / {2,}\r?\n/;
            const TEXT = /^[^\r\n]+/;
            let MARKDOWN_TYPES;
            (function (MARKDOWN_TYPES) {
                MARKDOWN_TYPES["Html"] = "html";
                MARKDOWN_TYPES["Text"] = "text";
                MARKDOWN_TYPES["Paragraph"] = "paragraph";
                MARKDOWN_TYPES["BlockQuote"] = "blockquote";
                MARKDOWN_TYPES["Space"] = "space";
                MARKDOWN_TYPES["Heading"] = "heading";
                MARKDOWN_TYPES["Bold"] = "bold";
                MARKDOWN_TYPES["Italic"] = "italic";
                MARKDOWN_TYPES["CodeBlock"] = "codeblock";
                MARKDOWN_TYPES["Code"] = "code";
                MARKDOWN_TYPES["Image"] = "img";
                MARKDOWN_TYPES["ImageLike"] = "imglike";
                MARKDOWN_TYPES["Link"] = "link";
                MARKDOWN_TYPES["LinkLike"] = "linklike";
                MARKDOWN_TYPES["LineBreak"] = "br";
                MARKDOWN_TYPES["StrikeThrough"] = "strike";
                MARKDOWN_TYPES["Quote"] = "quote";
                MARKDOWN_TYPES["HorizontalRule"] = "hr";
                MARKDOWN_TYPES["OrderedList"] = "ol";
                MARKDOWN_TYPES["UnorderedList"] = "ul";
                MARKDOWN_TYPES["ListItem"] = "listitem";
                MARKDOWN_TYPES["Reference"] = "ref";
            })(MARKDOWN_TYPES || (MARKDOWN_TYPES = {}));
            let MARKDOWN_RULES;
            (function (MARKDOWN_RULES) {
                MARKDOWN_RULES[MARKDOWN_RULES["Comment"] = 0] = "Comment";
                MARKDOWN_RULES[MARKDOWN_RULES["Reference"] = 1] = "Reference";
                MARKDOWN_RULES[MARKDOWN_RULES["HorizontalRule"] = 2] = "HorizontalRule";
                MARKDOWN_RULES[MARKDOWN_RULES["Heading"] = 3] = "Heading";
                MARKDOWN_RULES[MARKDOWN_RULES["Heading1"] = 4] = "Heading1";
                MARKDOWN_RULES[MARKDOWN_RULES["Heading2"] = 5] = "Heading2";
                MARKDOWN_RULES[MARKDOWN_RULES["CodeBlock"] = 6] = "CodeBlock";
                MARKDOWN_RULES[MARKDOWN_RULES["Fences"] = 7] = "Fences";
                MARKDOWN_RULES[MARKDOWN_RULES["BlockQuote"] = 8] = "BlockQuote";
                MARKDOWN_RULES[MARKDOWN_RULES["OrderedList"] = 9] = "OrderedList";
                MARKDOWN_RULES[MARKDOWN_RULES["UnorderedList"] = 10] = "UnorderedList";
                MARKDOWN_RULES[MARKDOWN_RULES["Paragraph"] = 11] = "Paragraph";
                MARKDOWN_RULES[MARKDOWN_RULES["ImageOrLink"] = 12] = "ImageOrLink";
                MARKDOWN_RULES[MARKDOWN_RULES["Emphasize"] = 13] = "Emphasize";
                MARKDOWN_RULES[MARKDOWN_RULES["StrikeThrough"] = 14] = "StrikeThrough";
                MARKDOWN_RULES[MARKDOWN_RULES["Quote"] = 15] = "Quote";
                MARKDOWN_RULES[MARKDOWN_RULES["Code"] = 16] = "Code";
                MARKDOWN_RULES[MARKDOWN_RULES["LineBreak"] = 17] = "LineBreak";
                MARKDOWN_RULES[MARKDOWN_RULES["Text"] = 254] = "Text";
                MARKDOWN_RULES[MARKDOWN_RULES["Space"] = 255] = "Space";
            })(MARKDOWN_RULES || (MARKDOWN_RULES = {}));
            function getGrammar(extra = []) {
                const inert = {
                    [MARKDOWN_RULES.Comment]: {
                        exec: (input, lexer) => match(input, COMMENT, arr => {
                            const index = regexMatchIndex(arr);
                            const output = [{
                                    type: MARKDOWN_TYPES.Html, index, raw: arr[0], text: arr[2]
                                }];
                            if (index > 0) {
                                const left = input.substr(0, index), tokens = lexer.tokenize(left, blockRules);
                                Array.prototype.unshift.apply(output, tokens);
                            }
                            return output;
                        })
                    },
                    [MARKDOWN_RULES.Reference]: {
                        exec: (input) => match(input, REF, arr => {
                            const index = regexMatchIndex(arr), raw = arr[0], text = raw, image = arr[1] === '!', id = arr[2], url = arr[3], title = arr[4];
                            return [{
                                    type: MARKDOWN_TYPES.Reference, index, raw, text, id, image, url, title
                                }];
                        })
                    },
                };
                const blockExtra = [], inlineExtra = [], codeExtra = {};
                for (let r of extra) {
                    let rule, type = 'inline';
                    if ('type' in r) {
                        type = r.type;
                        rule = r.rule;
                    }
                    else {
                        rule = r;
                    }
                    switch (type) {
                        case 'block':
                            blockExtra.push(rule);
                            break;
                        case 'code':
                            if ('lang' in r) {
                                const key = r.lang.toLowerCase();
                                (codeExtra[key] = codeExtra[key] || []).push(rule);
                            }
                            break;
                        default:
                            const inlineRule = {
                                exec: (input, lexer) => {
                                    const output = rule.exec(input, lexer);
                                    inPlaceInlineExec(input, output, lexer);
                                    return output;
                                }
                            };
                            inlineExtra.push(inlineRule);
                            break;
                    }
                }
                const inlinelowpriority = {
                    [MARKDOWN_RULES.Text]: {
                        exec: (input) => match(input, TEXT, arr => {
                            const raw = arr[0], text = raw;
                            return [{
                                    index: regexMatchIndex(arr), raw, text, type: MARKDOWN_TYPES.Text
                                }];
                        })
                    },
                    [MARKDOWN_RULES.Space]: {
                        exec: (input) => match(input, SPACE, arr => {
                            const raw = arr[0];
                            return [{
                                    type: MARKDOWN_TYPES.Space, raw, text: raw
                                }];
                        })
                    }
                };
                const inline = {
                    [MARKDOWN_RULES.ImageOrLink]: {
                        exec: (input, lexer) => inlineMatch(input, IMAGE_OR_LINK, lexer, arr => {
                            var _a;
                            const index = regexMatchIndex(arr), raw = arr[0], image = raw.charAt(0) === '!', text = arr[1], url = extractUrl(arr[2]), ref = normalizeReference((_a = extractReference(arr[2])) !== null && _a !== void 0 ? _a : text);
                            if (image) {
                                return [{
                                        index, type: url ? MARKDOWN_TYPES.Image : MARKDOWN_TYPES.ImageLike,
                                        raw, text, src: url, ref,
                                        tokens: lexer.tokenize(text, inlineRules)
                                    }];
                            }
                            else {
                                return [{
                                        index, type: url ? MARKDOWN_TYPES.Link : MARKDOWN_TYPES.LinkLike,
                                        raw, text, href: url, ref,
                                        tokens: lexer.tokenize(text, inlineRules)
                                    }];
                            }
                        })
                    },
                    [MARKDOWN_RULES.Code]: {
                        exec: (input, lexer) => inlineMatch(input, CODE, lexer, arr => {
                            const text = htmlEncode(arr[1]);
                            return [{
                                    type: MARKDOWN_TYPES.Code, raw: arr[0], text, index: regexMatchIndex(arr)
                                }];
                        })
                    },
                    [MARKDOWN_RULES.Emphasize]: {
                        exec: (input, lexer) => inlineMatch(input, EMPHASIZE, lexer, arr => {
                            if (arr.length < 3 || Pacem.NullChecker.isNullOrEmpty(arr[2])) {
                                return null;
                            }
                            const type = arr[1].length > 1 ? MARKDOWN_TYPES.Bold : MARKDOWN_TYPES.Italic, text = arr[2];
                            return [{
                                    index: regexMatchIndex(arr),
                                    type, raw: arr[0], text, tokens: lexer.tokenize(text, inlineRules)
                                }];
                        })
                    },
                    [MARKDOWN_RULES.StrikeThrough]: {
                        exec: (input, lexer) => inlineMatch(input, STRIKE, lexer, arr => {
                            if (arr.length < 3 || Pacem.NullChecker.isNullOrEmpty(arr[2])) {
                                return null;
                            }
                            const type = MARKDOWN_TYPES.StrikeThrough, text = arr[2];
                            return [{
                                    index: regexMatchIndex(arr),
                                    type, raw: arr[0], text, tokens: lexer.tokenize(text, inlineRules)
                                }];
                        })
                    },
                    [MARKDOWN_RULES.Quote]: {
                        exec: (input, lexer) => inlineMatch(input, QUOTE, lexer, arr => {
                            if (arr.length < 3 || Pacem.NullChecker.isNullOrEmpty(arr[2])) {
                                return null;
                            }
                            const type = MARKDOWN_TYPES.Quote, text = arr[2];
                            return [{
                                    index: regexMatchIndex(arr),
                                    type, raw: arr[0], text, tokens: lexer.tokenize(text, inlineRules)
                                }];
                        })
                    },
                    [MARKDOWN_RULES.LineBreak]: {
                        exec: (input, lexer) => inlineMatch(input, LINEBREAK, lexer, arr => {
                            const raw = arr[0], text = raw;
                            return [{
                                    index: regexMatchIndex(arr), raw, text, type: MARKDOWN_TYPES.LineBreak
                                }];
                        })
                    },
                };
                const inPlaceInlineExec = (input, output, lexer) => {
                    const index = (output === null || output === void 0 ? void 0 : output.length) > 0 && output[0].index;
                    if (index > 0) {
                        const left = input.substr(0, index);
                        const tokens = lexer.tokenize(left, inlineRules) || [];
                        Array.prototype.unshift.apply(output, tokens);
                    }
                };
                const inlineMatch = (input, pattern, lexer, fn) => {
                    const output = match(input, pattern, arr => {
                        if (pattern != CODE) {
                            const codeCheck = CODE.exec(input);
                            if (codeCheck
                                && codeCheck.length
                                && codeCheck.index < arr.index) {
                                return null;
                            }
                        }
                        return fn(arr);
                    });
                    inPlaceInlineExec(input, output, lexer);
                    return output;
                };
                const inlineRules = Object.values(inline);
                Array.prototype.push.apply(inlineRules, inlineExtra);
                inlineRules.push(inlinelowpriority[MARKDOWN_RULES.Text], inlinelowpriority[MARKDOWN_RULES.Space]);
                const getLangGrammar = (lang) => {
                    const retval = [inlinelowpriority[MARKDOWN_RULES.Text], inlinelowpriority[MARKDOWN_RULES.Space]];
                    const key = (lang === null || lang === void 0 ? void 0 : lang.toLowerCase()) || '';
                    if (key && key in codeExtra) {
                        Array.prototype.unshift.apply(retval, codeExtra[key]);
                    }
                    return retval;
                };
                const lowpriority = {
                    [MARKDOWN_RULES.Paragraph]: {
                        exec: (input, lexer) => match(input, PARAGRAPH, arr => {
                            const raw = arr[0], text = raw;
                            return [{
                                    type: MARKDOWN_TYPES.Paragraph, raw, text,
                                    tokens: lexer.tokenize(text, inlineRules)
                                }];
                        })
                    },
                    [MARKDOWN_RULES.Space]: inlinelowpriority[MARKDOWN_RULES.Space]
                };
                const tokenizeListItem = (text, lexer) => {
                    const grammar = !/^ {0,3}(`{3,}|$|>|[+-]\s|\d+[.\)])/m.test(text) ? inlineRules : blockRules;
                    return lexer.tokenize(text, grammar);
                };
                const block = {
                    [MARKDOWN_RULES.HorizontalRule]: {
                        exec: (input, lexer) => match(input, HR, arr => {
                            const raw = arr[0], text = raw;
                            return [{
                                    type: MARKDOWN_TYPES.HorizontalRule, raw, text
                                }];
                        })
                    },
                    [MARKDOWN_RULES.Heading]: {
                        exec: (input, lexer) => match(input, HEADING, arr => {
                            const text = arr[2];
                            return [{
                                    type: MARKDOWN_TYPES.Heading, raw: arr[0], text, level: arr[1].length, ref: normalizeReference(text),
                                    tokens: lexer.tokenize(text, inlineRules)
                                }];
                        })
                    },
                    [MARKDOWN_RULES.Heading1]: {
                        exec: (input, lexer) => match(input, HEADING1, arr => {
                            const text = arr[1];
                            return [{
                                    type: MARKDOWN_TYPES.Heading, raw: arr[0], text, level: 1, ref: normalizeReference(text),
                                    tokens: lexer.tokenize(text, inlineRules)
                                }];
                        })
                    },
                    [MARKDOWN_RULES.Heading2]: {
                        exec: (input, lexer) => match(input, HEADING2, arr => {
                            const text = arr[1];
                            return [{
                                    type: MARKDOWN_TYPES.Heading, raw: arr[0], text, level: 2, ref: normalizeReference(text),
                                    tokens: lexer.tokenize(text, inlineRules)
                                }];
                        })
                    },
                    [MARKDOWN_RULES.CodeBlock]: {
                        exec: (input, lexer) => match(input, CODEBLOCK, arr => {
                            const raw = arr[0], text = htmlEncode(raw);
                            return [{
                                    type: MARKDOWN_TYPES.CodeBlock, raw, text,
                                    tokens: lexer.tokenize(text, [])
                                }];
                        })
                    },
                    [MARKDOWN_RULES.Fences]: {
                        exec: (input, lexer) => match(input, FENCES, arr => {
                            var _a;
                            const text = htmlEncode(arr[2]), lang = (_a = arr[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                            return [{
                                    type: MARKDOWN_TYPES.CodeBlock, raw: arr[0], text, lang,
                                    tokens: lexer.tokenize(text, getLangGrammar(lang))
                                }];
                        })
                    },
                    [MARKDOWN_RULES.BlockQuote]: {
                        exec: (input, lexer) => match(input, BLOCKQUOTE, arr => {
                            const raw = arr[0], text = raw.replace(/^ {0,3}> */gm, '');
                            return [{
                                    type: MARKDOWN_TYPES.BlockQuote, raw, text,
                                    tokens: lexer.tokenize(text, [
                                        lowpriority[MARKDOWN_RULES.Paragraph],
                                        lowpriority[MARKDOWN_RULES.Space]
                                    ])
                                }];
                        })
                    },
                    [MARKDOWN_RULES.OrderedList]: {
                        exec: (input, lexer) => match(input, OLIST, arr => {
                            const raw = arr[0], items = raw.replace(/^ {0,3}/gm, '').split(LISTITEM).filter(i => !Pacem.NullChecker.isNullOrEmpty(i)).map(i => i.trim());
                            return [{
                                    type: MARKDOWN_TYPES.OrderedList, start: parseInt(/\d/.exec(arr[0])[0]), raw, text: raw, tokens: items.map(i => {
                                        return {
                                            type: MARKDOWN_TYPES.ListItem, raw: i, text: i, tokens: tokenizeListItem(i, lexer)
                                        };
                                    })
                                }];
                        })
                    },
                    [MARKDOWN_RULES.UnorderedList]: {
                        exec: (input, lexer) => match(input, ULIST, arr => {
                            const raw = arr[0], items = raw.replace(/^ {0,3}/gm, '').split(LISTITEM).filter(i => !Pacem.NullChecker.isNullOrEmpty(i)).map(i => i.trim());
                            return [{
                                    type: MARKDOWN_TYPES.UnorderedList, raw, text: raw, tokens: items.map(i => {
                                        return {
                                            type: MARKDOWN_TYPES.ListItem, raw: i, text: i, tokens: tokenizeListItem(i, lexer)
                                        };
                                    })
                                }];
                        })
                    }
                };
                const blockRules = Object.values(block);
                Array.prototype.push.apply(blockRules, blockExtra);
                blockRules.push(lowpriority[MARKDOWN_RULES.Paragraph], lowpriority[MARKDOWN_RULES.Space]);
                return [
                    inert[MARKDOWN_RULES.Comment],
                    inert[MARKDOWN_RULES.Reference]
                ].concat(blockRules);
            }
            const CARRIAGE_RETURN_PLACEHOLDER = '\0';
            const TRIM_INSIDE = /[ \r\n]*\0+[ \r\n]*/g;
            function trim(input) {
                return input === null || input === void 0 ? void 0 : input.replace(TRIM_INSIDE, '\n').trim();
            }
            class HtmlRenderer {
                constructor(_extraItemRender = (token, __) => (token === null || token === void 0 ? void 0 : token.text) || '') {
                    this._extraItemRender = _extraItemRender;
                    this._renderContent = (token) => {
                        const children = token.tokens;
                        if (Pacem.NullChecker.isNullOrEmpty(children)) {
                            return token.text;
                        }
                        return this._render(children);
                    };
                }
                _rendeItem(token, allTokens) {
                    var _a, _b;
                    const r = this._renderContent, R = CARRIAGE_RETURN_PLACEHOLDER;
                    switch (token === null || token === void 0 ? void 0 : token.type) {
                        case MARKDOWN_TYPES.Reference:
                            return '';
                        case MARKDOWN_TYPES.Html:
                            return token.raw;
                        case MARKDOWN_TYPES.BlockQuote:
                            return `<blockquote>\n${r(token)}</blockquote>${R}`;
                        case MARKDOWN_TYPES.Bold:
                            return `<b>${r(token)}</b>`;
                        case MARKDOWN_TYPES.CodeBlock:
                            const lang = token['lang'];
                            return `<pre>${R}<code${(lang ? (' class="' + lang + '"') : '')}>${r(token)}</code>${R}</pre>${R}`;
                        case MARKDOWN_TYPES.Code:
                            return `<code>${r(token)}</code>`;
                        case MARKDOWN_TYPES.HorizontalRule:
                            return `<hr />${R}`;
                        case MARKDOWN_TYPES.Heading:
                            const hlevel = token['level'], hid = token['ref'];
                            return `<h${hlevel} id="${hid}">${r(token)}</h${hlevel}>${R}`;
                        case MARKDOWN_TYPES.Image:
                        case MARKDOWN_TYPES.ImageLike:
                            const itk = token;
                            let isrc = itk.src, ititle = '';
                            const alt = itk.text, iref = itk.ref;
                            if (!isrc && iref) {
                                const ireftk = allTokens.find(t => { var _a; return t.type === MARKDOWN_TYPES.Reference && t['image'] === true && ((_a = t['id']) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === iref.toLowerCase(); });
                                if (ireftk) {
                                    isrc = ireftk.url;
                                    ititle = (_a = ireftk.title) !== null && _a !== void 0 ? _a : '';
                                }
                            }
                            return isrc ? `<img src="${isrc}" alt="${alt}"${(ititle ? (' title="' + ititle + '"') : '')} />` : `![${r(token)}]`;
                        case MARKDOWN_TYPES.Italic:
                            return `<i>${r(token)}</i>`;
                        case MARKDOWN_TYPES.StrikeThrough:
                            return `<s>${r(token)}</s>`;
                        case MARKDOWN_TYPES.Quote:
                            return `<q>${r(token)}</q>`;
                        case MARKDOWN_TYPES.LineBreak:
                            return '<br />' + R;
                        case MARKDOWN_TYPES.OrderedList:
                            return `<ol start="${token['start']}">\n${r(token)}</ol>${R}`;
                        case MARKDOWN_TYPES.UnorderedList:
                            return `<ul>\n${r(token)}</ul>${R}`;
                        case MARKDOWN_TYPES.ListItem:
                            return `\t<li>${r(token)}</li>${R}`;
                        case MARKDOWN_TYPES.Link:
                        case MARKDOWN_TYPES.LinkLike:
                            const atk = token;
                            let ahref = atk.href, atitle = '';
                            const aref = atk.ref;
                            if (!ahref && aref) {
                                const areftk = allTokens.find(t => { var _a; return t.type === MARKDOWN_TYPES.Reference && t['image'] !== true && ((_a = t['id']) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === aref.toLowerCase(); });
                                if (areftk) {
                                    ahref = areftk.url;
                                    atitle = (_b = areftk.title) !== null && _b !== void 0 ? _b : '';
                                }
                            }
                            return ahref ? `<a href="${ahref}"${(atitle ? (' title="' + atitle + '"') : '')}>${r(token)}</a>` : `[${r(token)}]`;
                        case MARKDOWN_TYPES.Paragraph:
                            return `<p>${r(token)}</p>${R}`;
                        case MARKDOWN_TYPES.Text:
                        case MARKDOWN_TYPES.Space:
                            return token.text;
                    }
                    return this._extraItemRender(token, allTokens);
                }
                _render(tree) {
                    let acc = '';
                    for (let token of tree || []) {
                        acc += this._rendeItem(token, tree);
                    }
                    return acc;
                }
                render(tree) {
                    return trim(this._render(tree));
                }
            }
            class TokenRenderer {
                _render(token) {
                    return Pacem.NullChecker.isNullOrEmpty(token) ? '' : JSON.stringify(token);
                }
                render(tree) {
                    return '[' + tree.filter(i => !Pacem.NullChecker.isNullOrEmpty(i)).map(this._render).join(',') + ']';
                }
            }
            function isRenderer(obj) {
                return obj && typeof obj === 'object' && typeof obj.render === 'function';
            }
            class Parser extends Pacem.Compile.Parser {
                toHtml(input, extraGrammar, extraItemRenderer) {
                    const renderer = new HtmlRenderer(extraItemRenderer);
                    if (Pacem.NullChecker.isNullOrEmpty(extraGrammar)) {
                        return this.parse(input, renderer);
                    }
                    return this.parse(input, getGrammar(extraGrammar), renderer);
                }
                tokenize(input, extraGrammar) {
                    const json = this.parse(input, getGrammar(extraGrammar), new TokenRenderer());
                    return JSON.parse(json);
                }
                parse(input, grammarOrRenderer = getGrammar(), renderer = new HtmlRenderer()) {
                    if (isRenderer(grammarOrRenderer)) {
                        return super.parse(input, getGrammar(), grammarOrRenderer);
                    }
                    else {
                        return super.parse(input, grammarOrRenderer, renderer);
                    }
                }
            }
            Markdown.Parser = Parser;
        })(Markdown = Compile.Markdown || (Compile.Markdown = {}));
    })(Compile = Pacem.Compile || (Pacem.Compile = {}));
})(Pacem || (Pacem = {}));
