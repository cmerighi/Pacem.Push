/**
 * pacem v0.10.0 (https://js.pacem.it)
 * Copyright 2020 Pacem (https://pacem.it)
 * Licensed under MIT
 */
var Pacem;
(function (Pacem) {
    var Geometry;
    (function (Geometry) {
        var LinearAlgebra;
        (function (LinearAlgebra) {
            class Vector {
                static unit(v) {
                    const clone = { x: v.x, y: v.y };
                    this.normalize(clone);
                    return clone;
                }
                static normalize(v) {
                    const l = Math.sqrt(v.x * v.x + v.y * v.y);
                    if (l <= 0) {
                        throw 'Cannot normalize a vector of length 0.';
                    }
                    const inv = 1 / l;
                    v.x *= inv;
                    v.y *= inv;
                }
                static from(p1, p2) {
                    return Pacem.Point.subtract(p1, p2);
                }
                static dot(v1, v2) {
                    return v1.x * v2.x + v1.y * v2.y;
                }
                static cross(v1, v2) {
                    return v1.x * v2.y - v1.y * v2.x;
                }
            }
            LinearAlgebra.Vector = Vector;
        })(LinearAlgebra = Geometry.LinearAlgebra || (Geometry.LinearAlgebra = {}));
    })(Geometry = Pacem.Geometry || (Pacem.Geometry = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Geometry;
    (function (Geometry) {
        const RAD2DEG = 180.0 / Math.PI;
        const RAD_ROUND = 2 * Math.PI;
        const Vector = Geometry.LinearAlgebra.Vector;
        function isPoint(p) {
            return p != null && 'x' in p && typeof p.x === 'number'
                && 'y' in p && typeof p.y === 'number';
        }
        function isSegment(s) {
            return s != null && Array.isArray(s) && s.length === 2
                && isPoint(s[0]) && isPoint(s[1]);
        }
        class Utils {
            static slopeRad(p1, p2) {
                return Math.atan2(p2.y - p1.y, p2.x - p1.x);
            }
            static slopeRad2(p1, p2) {
                return (RAD_ROUND + this.slopeRad(p1, p2)) % RAD_ROUND;
            }
            static slopeDeg(p1, p2) {
                return this.slopeRad(p1, p2) * RAD2DEG;
            }
            static slopeDeg2(p1, p2) {
                return (360 + this.slopeDeg(p1, p2)) % 360;
            }
            static intersect(arg1, arg2, ...args) {
                if (Array.isArray(arg1) && Array.isArray(arg2)) {
                    return this._intersectSegments(arg1, arg2, true);
                }
                else {
                    return this._intersectRects.apply(this, arguments);
                }
            }
            static intersectLines(segment1, segment2, m2, q2) {
                let s1, s2;
                if (Array.isArray(segment1) && Array.isArray(segment2)
                    && segment1.length === 2 && segment2.length === 2
                    && typeof segment1[0] === 'number' && typeof segment2[0] === 'number' && typeof segment1[1] === 'number' && typeof segment2[1] === 'number') {
                    m2 = segment2[0];
                    q2 = segment2[1];
                    segment2 = segment1[1];
                    segment1 = segment1[0];
                }
                if (typeof segment1 === 'number' && typeof segment2 === 'number') {
                    const m1 = segment1, q1 = segment2;
                    s1 = [
                        { x: 0, y: q1 },
                        { x: 1, y: m1 + q1 }
                    ];
                    s2 = [
                        { x: 0, y: q2 },
                        { x: 1, y: m2 + q2 }
                    ];
                }
                else {
                    s1 = segment1;
                    s2 = segment2;
                }
                return this._intersectSegments(s1, s2, false);
            }
            static cramer(l1, l2) {
                if (Array.isArray(l1)) {
                    l1 = { a: l1[0], b: l1[1], c: l1[2] };
                }
                if (Array.isArray(l2)) {
                    l2 = { a: l2[0], b: l2[1], c: l2[2] };
                }
                let xP = (l1.b * l2.c - l1.c * l2.b) / (l1.b * l2.a - l1.a * l2.b), yP = (l1.c * l2.a - l1.a * l2.c) / (l1.b * l2.a - l1.a * l2.b);
                return { x: -xP.roundoff(), y: -yP.roundoff() };
            }
            static mq(arg0, p2) {
                let p1;
                if (isPoint(arg0)) {
                    p1 = arg0;
                }
                else {
                    p1 = arg0[0];
                    p2 = arg0[1];
                }
                if (p1.x === p2.x) {
                    return [Number.NaN, Number.NaN];
                }
                const m = (p2.y - p1.y) / (p2.x - p1.x);
                const q = p1.y - m * p1.x;
                return [m, q];
            }
            static _intersectSegments(segment1, segment2, excludeProjection) {
                const A = segment1[0], B = segment1[1], C = segment2[0], D = segment2[1], xAB = Math.min(A.x, B.x), yAB = Math.min(A.y, B.y), XAB = Math.max(A.x, B.x), wAB = XAB - xAB, YAB = Math.max(A.y, B.y), hAB = YAB - yAB, xCD = Math.min(C.x, D.x), yCD = Math.min(C.y, D.y), XCD = Math.max(C.x, D.x), wCD = XCD - xCD, YCD = Math.max(C.y, D.y), hCD = YCD - yCD;
                if (wAB === 0 && wCD === 0) {
                    return null;
                }
                if (hAB === 0 && hCD === 0) {
                    return null;
                }
                const outOfXBounds = (p) => {
                    return p.x < xCD || p.x > XCD || p.x < xAB || p.x > XAB;
                };
                const outOfYBounds = (p) => {
                    return p.y < yCD || p.y > YCD || p.y < yAB || p.y > YAB;
                };
                var retval = null;
                if (wAB === 0) {
                    if (excludeProjection && (xCD > xAB || XCD < XAB)) {
                        return null;
                    }
                    const mqCD = this.mq(C, D);
                    retval = this.cramer([1, 0, -xAB], [mqCD[0], -1, mqCD[1]]);
                    if (excludeProjection && outOfYBounds(retval)) {
                        retval = null;
                    }
                }
                else if (wCD === 0) {
                    if (excludeProjection && (xAB > xCD || XAB < XCD)) {
                        return null;
                    }
                    const mqAB = this.mq(A, B);
                    retval = this.cramer([mqAB[0], -1, mqAB[1]], [1, 0, -xCD]);
                    if (excludeProjection && outOfYBounds(retval)) {
                        retval = null;
                    }
                }
                else if (hAB === 0) {
                    if (excludeProjection && (yCD > yAB || YCD < YAB)) {
                        return null;
                    }
                    const mqCD = this.mq(C, D);
                    retval = this.cramer([0, 1, -yAB], [mqCD[0], -1, mqCD[1]]);
                    if (excludeProjection && outOfXBounds(retval)) {
                        retval = null;
                    }
                }
                else if (hCD === 0) {
                    if (excludeProjection && (yAB > yCD || YAB < YCD)) {
                        return null;
                    }
                    const mqAB = this.mq(A, B);
                    retval = this.cramer([mqAB[0], -1, mqAB[1]], [0, 1, -yCD]);
                    if (excludeProjection && outOfXBounds(retval)) {
                        retval = null;
                    }
                }
                else {
                    let intersection;
                    if (!excludeProjection ||
                        ((intersection = this._intersectRects({ x: xAB, y: yAB, width: wAB, height: hAB }, { x: xCD, y: yCD, width: wCD, height: hCD }))
                            && intersection.width > 0
                            && intersection.height > 0)) {
                        const mqAB = this.mq(A, B), mqCD = this.mq(C, D);
                        const mAB = mqAB[0], mCD = mqCD[0], qAB = mqAB[1], qCD = mqCD[1];
                        if (mAB !== mCD) {
                            retval = this.cramer([mAB, -1, qAB], [mCD, -1, qCD]);
                            let xR = retval.x, yR = retval.y;
                            if (excludeProjection
                                && (xR < intersection.x || xR > (intersection.x + intersection.width)
                                    || yR < intersection.y || yR > (intersection.y + intersection.height))) {
                                retval = null;
                            }
                        }
                    }
                }
                if (retval === null) {
                    return null;
                }
                return { x: retval.x, y: retval.y };
            }
            static _intersectRects(...args) {
                return Pacem.Rect.intersect.apply(this, args);
            }
            static dot(v1, v2) {
                return Vector.dot(v1, v2);
            }
            static cross(v1, v2) {
                return Vector.cross(v1, v2);
            }
            static distance(p1, arg2) {
                if (isSegment(p1)) {
                    return Pacem.Point.distance(p1[0], p1[1]);
                }
                else if (isPoint(arg2)) {
                    return Pacem.Point.distance(p1, arg2);
                }
                else {
                    const m = arg2[0], q = arg2[1];
                    return Math.abs(m * p1.x - p1.y + q) / Math.sqrt(Math.pow(m, 2) + 1);
                }
            }
            static inLine(p, segment) {
                const v1 = Vector.from(segment[0], p), v2 = Vector.from(p, segment[1]);
                const prod = this.cross(v1, v2);
                return prod.isCloseTo(0);
            }
            static inSegment(p, segment) {
                const minx = Math.min(segment[0].x, segment[1].x), maxx = Math.max(segment[0].x, segment[1].x), miny = Math.min(segment[0].y, segment[1].y), maxy = Math.max(segment[0].y, segment[1].y);
                return p.x >= minx && p.x <= maxx && p.y >= miny && p.y <= maxy && this.inLine(p, segment);
            }
            static inTriangle(p, triangle) {
                let last;
                for (let j = 0; j < 3; j++) {
                    const p1 = triangle[j], p2 = triangle[(j + 1) % 3], v1 = Pacem.Point.subtract(p2, p), v2 = Pacem.Point.subtract(p1, p), current = this.cross(v1, v2);
                    if (j > 0 && (current * last) <= 0) {
                        return false;
                    }
                    last = current;
                }
                return true;
            }
            static inPolygon(p, vertices) {
                if (!((vertices === null || vertices === void 0 ? void 0 : vertices.length) >= 3)) {
                    throw `Not enough vertices`;
                }
                const length = vertices.length;
                if (length === 3) {
                    return this.inTriangle(p, [vertices[0], vertices[1], vertices[2]]);
                }
                let minx = Number.POSITIVE_INFINITY, miny = Number.POSITIVE_INFINITY, maxx = 0, maxy = 0;
                for (let j = 0; j < length; j++) {
                    const v = vertices[j];
                    minx = Math.min(minx, v.x);
                    miny = Math.min(miny, v.y);
                    maxx = Math.max(maxx, v.x);
                    maxy = Math.max(maxy, v.y);
                }
                if (p.x < minx || p.x > maxx || p.y < miny || p.y > maxy) {
                    return false;
                }
                const outerPoint = { x: minx - 1, y: p.y }, test = [outerPoint, p];
                let intersections = 0;
                for (let j = 0; j < length; j++) {
                    const p1 = vertices[j], p2 = vertices[(j + 1) % length], side = [p1, p2];
                    if (p1.y === p.y) {
                        const p0 = vertices[(j - 1 + length) % length];
                        if (p.x > p1.x && (p0.y - p.y) * (p2.y - p.y) < 0) {
                            intersections++;
                        }
                    }
                    else if (p2.y === p.y) {
                        continue;
                    }
                    else {
                        if (this.intersect(side, test) != null) {
                            intersections++;
                        }
                    }
                }
                return intersections % 2 === 1;
            }
        }
        Geometry.Utils = Utils;
    })(Geometry = Pacem.Geometry || (Pacem.Geometry = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Mathematics;
    (function (Mathematics) {
        function complex(c) {
            if (typeof c === 'number') {
                c = { real: c, img: 0 };
            }
            return c;
        }
        var NOT_A_COMPLEX;
        function buildComplex(real, img) {
            const c = {};
            Object.defineProperty(c, 'real', { value: real, writable: false });
            Object.defineProperty(c, 'img', { value: img, writable: false });
            return c;
        }
        function nac() {
            return NOT_A_COMPLEX || (NOT_A_COMPLEX = buildComplex(Number.NaN, Number.NaN));
        }
        class Complex {
            static build(real, img) {
                if (this.isComplex(real)) {
                    return real;
                }
                return buildComplex(real, img || 0);
            }
            static add(a, b) {
                const ac = complex(a), bc = complex(b);
                return buildComplex(ac.real + bc.real, ac.img + bc.img);
            }
            static subtract(from, what) {
                const ac = complex(from), bc = complex(what);
                return buildComplex(ac.real - bc.real, ac.img - bc.img);
            }
            static multiply(a, b) {
                const ac = complex(a), bc = complex(b);
                return buildComplex(ac.real * bc.real - ac.img * bc.img, ac.real * bc.img + ac.img * bc.real);
            }
            static divide(a, b) {
                const ac = complex(a), bc = complex(b);
                const div = this.absSquare(bc).roundoff();
                if (div === 0) {
                    return nac();
                }
                const inv_div = 1 / div;
                return buildComplex(inv_div * (ac.real * bc.real + ac.img * bc.img), inv_div * (ac.img * bc.real - ac.real * bc.img));
            }
            static absSquare(c) {
                const ac = complex(c);
                return Math.pow(ac.real, 2) + Math.pow(ac.img, 2);
            }
            static modulus(c) {
                return Math.sqrt(this.absSquare(c));
            }
            static isComplex(c) {
                return c != null && typeof c === 'object' && 'real' in c && 'img' in c && typeof c.real === 'number' && typeof c.img === 'number';
            }
            static conjugate(a) {
                a = complex(a);
                return buildComplex(a.real, Math.abs(a.img) == 0 ? 0 : -a.img);
            }
            static get NaC() { return nac(); }
        }
        Mathematics.Complex = Complex;
    })(Mathematics = Pacem.Mathematics || (Pacem.Mathematics = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Mathematics;
    (function (Mathematics) {
        var DataAnalysis;
        (function (DataAnalysis) {
            function euler(k, N) {
                const x = 2 * Math.PI * k / N;
                return Mathematics.Complex.build(Math.cos(x), Math.sin(x));
            }
            const unitCircle = {};
            function exp(k, N) {
                const memN = unitCircle[N] = unitCircle[N] || {};
                return memN[k] = memN[k] || euler(k, N);
            }
            function isPowerOfTwo(length) {
                return length > 0 && (length & (length - 1)) === 0;
            }
            function fftRec(data) {
                const retval = [], N = data.length;
                if (N === 1) {
                    return [Mathematics.Complex.build(data[0])];
                }
                const retval_2n = fftRec(data.filter((_, i) => i % 2 === 0)), retval_2n1 = fftRec(data.filter((_, i) => i % 2 === 1));
                for (var k = 0; k < N / 2; k++) {
                    const t = retval_2n[k], e = Mathematics.Complex.multiply(exp(k, N), retval_2n1[k]);
                    retval[k] = Mathematics.Complex.add(t, e);
                    retval[k + (N / 2)] = Mathematics.Complex.subtract(t, e);
                }
                return retval;
            }
            class Fourier {
                static transform(data, normalize = true) {
                    data = data || [];
                    if (isPowerOfTwo(data.length)) {
                        return this.fft(data, normalize);
                    }
                    return this.dft(data, normalize);
                }
                static invert(data, normalize = true) {
                    return this.idft(data || [], normalize);
                }
                static dft(data, normalize = true) {
                    var _a;
                    const N = (_a = (data || [])) === null || _a === void 0 ? void 0 : _a.length, DEN = normalize ? 1 / Math.sqrt(N) : 1, retval = [];
                    for (let k = 0; k < N; k++) {
                        retval.push({ real: 0, img: 0 });
                        for (let j = 0; j < N; j++) {
                            const e = exp(k * j, N), item = Mathematics.Complex.multiply(data[j], e), itemN = Mathematics.Complex.multiply(item, DEN);
                            retval[k] = Mathematics.Complex.add(retval[k], itemN);
                        }
                    }
                    return retval;
                }
                static idft(data, normalize = true) {
                    const reversed = data.map(i => Mathematics.Complex.build(i.img, i.real)), temp = this.transform(reversed, normalize);
                    return temp.map(c => Mathematics.Complex.build(c.img, c.real));
                }
                static fft(data, normalize = true) {
                    const retval = fftRec(data);
                    if (!normalize) {
                        return retval;
                    }
                    const DEN = 1 / Math.sqrt(data.length);
                    return retval.map(i => Mathematics.Complex.multiply(i, DEN));
                }
            }
            DataAnalysis.Fourier = Fourier;
        })(DataAnalysis = Mathematics.DataAnalysis || (Mathematics.DataAnalysis = {}));
    })(Mathematics = Pacem.Mathematics || (Pacem.Mathematics = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Mathematics;
    (function (Mathematics) {
        var DataAnalysis;
        (function (DataAnalysis) {
            const SQRT_PI = Math.sqrt(Math.PI);
            const erfc = function (x) {
                let t, z, ans;
                z = Math.abs(x);
                t = 1.0 / (1.0 + 0.5 * z);
                ans = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 +
                    t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
                        t * (-0.82215223 + t * 0.17087277)))))))));
                return x >= 0.0 ? ans : 2.0 - ans;
            };
            const erf = function (x) {
                return 1 - erfc(x);
            };
            class Gaussian {
                constructor(mean, stdev) {
                    this.mean = mean;
                    this.stdev = Math.abs(stdev);
                    this.variance = Math.pow(stdev, 2);
                }
                static get normal() {
                    return _normal;
                }
                probabilityDensity(x) {
                    const inv_coeff = this.stdev * Math.SQRT2 * SQRT_PI, exp_part = Math.exp(-0.5 * Math.pow(this._z(x), 2));
                    return exp_part / inv_coeff;
                }
                _z(x) {
                    return (x - this.mean) / this.stdev;
                }
                probability(x) {
                    return 0.5 * erfc(-this._z(x) / Math.SQRT2);
                }
            }
            DataAnalysis.Gaussian = Gaussian;
            const _normal = new Gaussian(0, 1);
        })(DataAnalysis = Mathematics.DataAnalysis || (Mathematics.DataAnalysis = {}));
    })(Mathematics = Pacem.Mathematics || (Pacem.Mathematics = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Mathematics;
    (function (Mathematics) {
        var NumberTheory;
        (function (NumberTheory) {
            class Utils {
                static lcd(...args) {
                    if (args.length <= 1) {
                        throw 'Insufficient set of numbers.';
                    }
                    function ex9(x, y) {
                        if (!y)
                            return y === 0 ? x : NaN;
                        return ex9(y, x % y);
                    }
                    function ex10(x, y) {
                        return x * y / ex9(x, y);
                    }
                    let result = args[0];
                    for (let j = 1; j < args.length; j++) {
                        result = ex10(result, args[j]);
                    }
                    return result;
                }
            }
            NumberTheory.Utils = Utils;
        })(NumberTheory = Mathematics.NumberTheory || (Mathematics.NumberTheory = {}));
    })(Mathematics = Pacem.Mathematics || (Pacem.Mathematics = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Mathematics;
    (function (Mathematics) {
        var DataAnalysis;
        (function (DataAnalysis) {
            function varNum(set) {
                const mean = this.mean(set);
                return set.reduce((p, c) => Math.pow(c - mean, 2) + p, 0);
            }
            function stdev(set, bessel = false) {
                const num = this._varNum(set);
                return Math.sqrt(num / (set.length + (bessel ? 1 : 0)));
            }
            class Utils {
                static sum(set) {
                    return set.reduce((p, c) => p + c, 0);
                }
                static mean(set) {
                    return this.sum(set) / set.length;
                }
                static var(set) {
                    return varNum(set) / set.length;
                }
                static pstdev(population) {
                    return stdev(population, false);
                }
                static sstdev(sample) {
                    return stdev(sample, true);
                }
                static gaussian(mean, stdev) {
                    return new DataAnalysis.Gaussian(mean, stdev);
                }
            }
            DataAnalysis.Utils = Utils;
        })(DataAnalysis = Mathematics.DataAnalysis || (Mathematics.DataAnalysis = {}));
    })(Mathematics = Pacem.Mathematics || (Pacem.Mathematics = {}));
})(Pacem || (Pacem = {}));
