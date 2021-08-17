/**
 * pacem v0.20.0-alexandria (https://js.pacem.it)
 * Copyright 2021 Pacem (https://pacem.it)
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
    var Geometry;
    (function (Geometry) {
        var LinearAlgebra;
        (function (LinearAlgebra) {
            const RAD2DEG = 180.0 / Math.PI;
            const DEG2RAD = 1.0 / RAD2DEG;
            class Vector3D {
                static from(...args) {
                    const l = 3;
                    if (args.length !== l) {
                        throw new RangeError(`Must provide exactly ${l} numbers`);
                    }
                    return { x: args[0], y: args[1], z: args[2] };
                }
                static parse(input) {
                    const arr = Pacem.parseAsNumericalArray(input);
                    if (arr && arr.length === 3) {
                        return Vector3D.from.apply(null, arr);
                    }
                    throw new Error(`Cannot parse "${input}" as a valid Vector3D.`);
                }
                static i() {
                    return { x: 1, y: 0, z: 0 };
                }
                static j() {
                    return { x: 0, y: 1, z: 0 };
                }
                static k() {
                    return { x: 0, y: 0, z: 1 };
                }
                static subtract(p, from) {
                    return { x: from.x - p.x, y: from.y - p.y, z: from.z - p.z };
                }
                static add(...points) {
                    var point = { x: 0, y: 0, z: 0 };
                    for (var p of points) {
                        point.x += p.x;
                        point.y += p.y;
                        point.z += p.z;
                    }
                    return point;
                }
                static dot(v1, v2) {
                    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
                }
                static cross(v1, v2) {
                    return {
                        x: (v1.y * v2.z) - (v1.z * v2.y),
                        y: (v1.z * v2.x) - (v1.x * v2.z),
                        z: (v1.x * v2.y) - (v1.y * v2.x)
                    };
                }
                static magSqr(v) {
                    return v.x * v.x + v.y * v.y + v.z * v.z;
                }
                static mag(v) {
                    return Math.sqrt(Vector3D.magSqr(v));
                }
                static unit(v) {
                    const clone = { x: v.x, y: v.y, z: v.z };
                    this.normalize(clone);
                    return clone;
                }
                static normalize(v) {
                    const l = Vector3D.mag(v);
                    if (l <= 0) {
                        throw 'Cannot normalize a vector of length 0.';
                    }
                    const inv = 1 / l;
                    v.x *= inv;
                    v.y *= inv;
                    v.z *= inv;
                }
                static angleBetween(vector1, vector2) {
                    var num;
                    var v1 = Vector3D.unit(vector1);
                    var v2 = Vector3D.unit(vector2);
                    var dot = Vector3D.dot(v1, v2);
                    if (dot < 0.0) {
                        const vectord = { x: -v1.x - v2.x, y: -v1.y - v2.y, z: -v1.z - v2.z };
                        const length = Vector3D.mag(vectord);
                        num = Math.PI - (2.0 * Math.asin(length / 2.0));
                    }
                    else {
                        var vectord = { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
                        const length = Vector3D.mag(vectord);
                        num = 2.0 * Math.asin(length / 2.0);
                    }
                    return RAD2DEG * num;
                }
            }
            LinearAlgebra.Vector3D = Vector3D;
            class Matrix3D {
                static identity() {
                    return {
                        m11: 1, m12: 0, m13: 0, m14: 0,
                        m21: 0, m22: 1, m23: 0, m24: 0,
                        m31: 0, m32: 0, m33: 1, m34: 0,
                        offsetX: 0, offsetY: 0, offsetZ: 0, m44: 1
                    };
                }
                static from(...args) {
                    const l = 16;
                    if (args.length !== l) {
                        throw new RangeError(`Must provide exactly ${l} numbers`);
                    }
                    return {
                        m11: args[0],
                        m12: args[1],
                        m13: args[2],
                        m14: args[3],
                        m21: args[4],
                        m22: args[5],
                        m23: args[6],
                        m24: args[7],
                        m31: args[8],
                        m32: args[9],
                        m33: args[10],
                        m34: args[11],
                        offsetX: args[12],
                        offsetY: args[13],
                        offsetZ: args[14],
                        m44: args[15]
                    };
                }
                static toArray(m) {
                    return [m.m11, m.m12, m.m13, m.m14,
                        m.m21, m.m22, m.m23, m.m24,
                        m.m31, m.m32, m.m33, m.m34,
                        m.offsetX, m.offsetY, m.offsetZ, m.m44];
                }
                static clone(m) {
                    return Matrix3D.from.apply(null, Matrix3D.toArray(m));
                }
                static parse(input) {
                    const arr = Pacem.parseAsNumericalArray(input);
                    if (arr && arr.length === 16) {
                        return Matrix3D.from.apply(null, arr);
                    }
                    throw new Error(`Cannot parse "${input}" as a valid Matrix3D.`);
                }
                static isIdentity(m) {
                    return m.m11 == 1.0 && m.m12 == .0 && m.m13 == .0 && m.m14 == .0
                        && m.m21 == .0 && m.m22 == 1.0 && m.m23 == .0 && m.m24 == .0
                        && m.m31 == .0 && m.m32 == .0 && m.m33 == 1.0 && m.m34 == .0
                        && m.offsetX == .0 && m.offsetY == .0 && m.offsetZ == .0 && m.m44 == 1.0;
                }
                static isAffine(m) {
                    return m.m14 == .0 && m.m24 == .0 && m.m34 == .0 && m.m44 == 1.0;
                }
                static determinant(m) {
                    if (Matrix3D.isIdentity(m))
                        return 1.0;
                    else if (Matrix3D.isAffine(m)) {
                        return m.m11 * (m.m22 * m.m33 - m.m32 * m.m23)
                            - m.m12 * (m.m21 * m.m33 - m.m31 * m.m23)
                            + m.m13 * (m.m21 * m.m32 - m.m31 * m.m22);
                    }
                    else {
                        const num6 = (m.m13 * m.m24) - (m.m23 * m.m14);
                        const num5 = (m.m13 * m.m34) - (m.m33 * m.m14);
                        const num4 = (m.m13 * m.m44) - (m.offsetZ * m.m14);
                        const num3 = (m.m23 * m.m34) - (m.m33 * m.m24);
                        const num2 = (m.m23 * m.m44) - (m.offsetZ * m.m24);
                        const num = (m.m33 * m.m44) - (m.offsetZ * m.m34);
                        const num10 = ((m.m22 * num5) - (m.m32 * num6)) - (m.m12 * num3);
                        const num9 = ((m.m12 * num2) - (m.m22 * num4)) + (m.offsetY * num6);
                        const num8 = ((m.m32 * num4) - (m.offsetY * num5)) - (m.m12 * num);
                        const num7 = ((m.m22 * num) - (m.m32 * num2)) + (m.offsetY * num3);
                        const det = ((((m.offsetX * num10) + (m.m31 * num9)) + (m.m21 * num8)) + (m.m11 * num7));
                        return det;
                    }
                }
                static multiply(m1, m2) {
                    if (Matrix3D.isIdentity(m1))
                        return m2;
                    if (Matrix3D.isIdentity(m2))
                        return m1;
                    return Matrix3D.from((((m1.m11 * m2.m11) + (m1.m12 * m2.m21)) + (m1.m13 * m2.m31)) + (m1.m14 * m2.offsetX), (((m1.m11 * m2.m12) + (m1.m12 * m2.m22)) + (m1.m13 * m2.m32)) + (m1.m14 * m2.offsetY), (((m1.m11 * m2.m13) + (m1.m12 * m2.m23)) + (m1.m13 * m2.m33)) + (m1.m14 * m2.offsetZ), (((m1.m11 * m2.m14) + (m1.m12 * m2.m24)) + (m1.m13 * m2.m34)) + (m1.m14 * m2.m44), (((m1.m21 * m2.m11) + (m1.m22 * m2.m21)) + (m1.m23 * m2.m31)) + (m1.m24 * m2.offsetX), (((m1.m21 * m2.m12) + (m1.m22 * m2.m22)) + (m1.m23 * m2.m32)) + (m1.m24 * m2.offsetY), (((m1.m21 * m2.m13) + (m1.m22 * m2.m23)) + (m1.m23 * m2.m33)) + (m1.m24 * m2.offsetZ), (((m1.m21 * m2.m14) + (m1.m22 * m2.m24)) + (m1.m23 * m2.m34)) + (m1.m24 * m2.m44), (((m1.m31 * m2.m11) + (m1.m32 * m2.m21)) + (m1.m33 * m2.m31)) + (m1.m34 * m2.offsetX), (((m1.m31 * m2.m12) + (m1.m32 * m2.m22)) + (m1.m33 * m2.m32)) + (m1.m34 * m2.offsetY), (((m1.m31 * m2.m13) + (m1.m32 * m2.m23)) + (m1.m33 * m2.m33)) + (m1.m34 * m2.offsetZ), (((m1.m31 * m2.m14) + (m1.m32 * m2.m24)) + (m1.m33 * m2.m34)) + (m1.m34 * m2.m44), (((m1.offsetX * m2.m11) + (m1.offsetY * m2.m21)) + (m1.offsetZ * m2.m31)) + (m1.m44 * m2.offsetX), (((m1.offsetX * m2.m12) + (m1.offsetY * m2.m22)) + (m1.offsetZ * m2.m32)) + (m1.m44 * m2.offsetY), (((m1.offsetX * m2.m13) + (m1.offsetY * m2.m23)) + (m1.offsetZ * m2.m33)) + (m1.m44 * m2.offsetZ), (((m1.offsetX * m2.m14) + (m1.offsetY * m2.m24)) + (m1.offsetZ * m2.m34)) + (m1.m44 * m2.m44));
                }
                static invert(m) {
                    if (Matrix3D.isAffine(m)) {
                        const cofactor31 = (m.m12 * m.m23) - (m.m22 * m.m13);
                        const cofactor21 = (m.m32 * m.m13) - (m.m12 * m.m33);
                        const cofactor11 = (m.m22 * m.m33) - (m.m32 * m.m23);
                        const determinant = Matrix3D.determinant(m);
                        if (determinant == 0.0) {
                            return null;
                        }
                        const num20 = (m.m21 * m.m13) - (m.m11 * m.m23);
                        const num19 = (m.m11 * m.m33) - (m.m31 * m.m13);
                        const num18 = (m.m31 * m.m23) - (m.m21 * m.m33);
                        const num7 = (m.m11 * m.m22) - (m.m21 * m.m12);
                        const num6 = (m.m11 * m.m32) - (m.m31 * m.m12);
                        const num5 = (m.m11 * m.offsetY) - (m.offsetX * m.m12);
                        const num4 = (m.m21 * m.m32) - (m.m31 * m.m22);
                        const num3 = (m.m21 * m.offsetY) - (m.offsetX * m.m22);
                        const num2 = (m.m31 * m.offsetY) - (m.offsetX * m.m32);
                        const num17 = ((m.m23 * num5) - (m.offsetZ * num7)) - (m.m13 * num3);
                        const num16 = ((m.m13 * num2) - (m.m33 * num5)) + (m.offsetZ * num6);
                        const num15 = ((m.m33 * num3) - (m.offsetZ * num4)) - (m.m23 * num2);
                        const num14 = num7;
                        const num13 = -num6;
                        const num12 = num4;
                        const invdet = 1.0 / determinant;
                        return Matrix3D.from(cofactor11 * invdet, cofactor21 * invdet, cofactor31 * invdet, .0, num18 * invdet, num19 * invdet, num20 * invdet, .0, num12 * invdet, num13 * invdet, num14 * invdet, .0, num15 * invdet, num16 * invdet, num17 * invdet, 1.0);
                    }
                    else {
                        const determinant = Matrix3D.determinant(m);
                        if (determinant == 0.0) {
                            return null;
                        }
                        const num1 = m.m33 * m.m44 - m.m34 * m.offsetZ;
                        const num2 = m.m32 * m.m44 - m.m34 * m.offsetY;
                        const num3 = m.m31 * m.m44 - m.m34 * m.offsetX;
                        const num4 = m.m32 * m.offsetZ - m.m33 * m.offsetY;
                        const num5 = m.m31 * m.offsetZ - m.m33 * m.offsetX;
                        const num6 = m.m31 * m.offsetY - m.m32 * m.offsetX;
                        const num7 = m.m33 * m.m44 - m.m34 * m.offsetZ;
                        const num8 = m.m32 * m.m44 - m.m34 * m.offsetY;
                        const num9 = m.m31 * m.m44 - m.m34 * m.offsetX;
                        const num10 = m.m32 * m.offsetZ - m.m33 * m.offsetY;
                        const num11 = m.m31 * m.offsetZ - m.m33 * m.offsetX;
                        const num12 = m.m31 * m.offsetY - m.m32 * m.offsetX;
                        const num13 = m.m23 * m.m44 - m.m24 * m.offsetZ;
                        const num14 = m.m22 * m.m44 - m.m24 * m.offsetY;
                        const num15 = m.m21 * m.m44 - m.m24 * m.offsetX;
                        const num16 = m.m22 * m.offsetZ - m.m23 * m.offsetY;
                        const num17 = m.m21 * m.offsetZ - m.m23 * m.offsetX;
                        const num18 = m.m21 * m.offsetY - m.m22 * m.offsetX;
                        const num19 = m.m23 * m.m34 - m.m24 * m.m33;
                        const num20 = m.m22 * m.m34 - m.m24 * m.m32;
                        const num21 = m.m21 * m.m34 - m.m24 * m.m31;
                        const num22 = m.m22 * m.m33 - m.m23 * m.m32;
                        const num23 = m.m21 * m.m33 - m.m23 * m.m31;
                        const num24 = m.m21 * m.m32 - m.m22 * m.m31;
                        const cofactor11 = (m.m22 * num1 - m.m23 * num2 + m.m24 * num4);
                        const cofactor12 = -(m.m21 * num1 - m.m23 * num3 + m.m24 * num5);
                        const cofactor13 = (m.m21 * num2 - m.m22 * num3 + m.m24 * num6);
                        const cofactor14 = -(m.m21 * num4 - m.m22 * num5 + m.m23 * num6);
                        const cofactor21 = -(m.m12 * num7 - m.m13 * num8 + m.m14 * num10);
                        const cofactor22 = (m.m11 * num7 - m.m13 * num9 + m.m14 * num11);
                        const cofactor23 = -(m.m11 * num8 - m.m12 * num9 + m.m14 * num12);
                        const cofactor24 = (m.m11 * num10 - m.m12 * num11 + m.m13 * num12);
                        const cofactor31 = (m.m12 * num13 - m.m13 * num14 + m.m14 * num16);
                        const cofactor32 = -(m.m11 * num13 - m.m13 * num15 + m.m14 * num17);
                        const cofactor33 = (m.m11 * num14 - m.m12 * num15 + m.m14 * num18);
                        const cofactor34 = -(m.m11 * num16 - m.m12 * num17 + m.m13 * num18);
                        const cofactor41 = -(m.m12 * num19 - m.m13 * num20 + m.m14 * num22);
                        const cofactor42 = (m.m11 * num19 - m.m13 * num21 + m.m14 * num23);
                        const cofactor43 = -(m.m11 * num20 - m.m12 * num21 + m.m14 * num24);
                        const cofactor44 = (m.m11 * num22 - m.m12 * num23 + m.m13 * num24);
                        const inverseDet = 1.0 / determinant;
                        return Matrix3D.from(cofactor11 * inverseDet, cofactor21 * inverseDet, cofactor31 * inverseDet, cofactor41 * inverseDet, cofactor12 * inverseDet, cofactor22 * inverseDet, cofactor32 * inverseDet, cofactor42 * inverseDet, cofactor13 * inverseDet, cofactor23 * inverseDet, cofactor33 * inverseDet, cofactor43 * inverseDet, cofactor14 * inverseDet, cofactor24 * inverseDet, cofactor34 * inverseDet, cofactor44 * inverseDet);
                    }
                }
                static transform(point, matrix) {
                    var pt = { x: point.x, y: point.y, z: point.z };
                    if (!Matrix3D.isIdentity(matrix)) {
                        var x = pt.x;
                        var y = pt.y;
                        var z = pt.z;
                        pt.x = (((x * matrix.m11) + (y * matrix.m21)) + (z * matrix.m31)) + matrix.offsetX;
                        pt.y = (((x * matrix.m12) + (y * matrix.m22)) + (z * matrix.m32)) + matrix.offsetY;
                        pt.z = (((x * matrix.m13) + (y * matrix.m23)) + (z * matrix.m33)) + matrix.offsetZ;
                        if (!Matrix3D.isAffine(matrix)) {
                            var num4 = (((x * matrix.m14) + (y * matrix.m24)) + (z * matrix.m34)) + matrix.m44;
                            if (num4 != .0) {
                                pt.x /= num4;
                                pt.y /= num4;
                                pt.z /= num4;
                            }
                        }
                    }
                    return pt;
                }
            }
            LinearAlgebra.Matrix3D = Matrix3D;
            class Quaternion {
                static from(...args) {
                    const l = 4;
                    if (args.length !== l) {
                        throw new RangeError(`Must provide exactly ${l} numbers`);
                    }
                    return {
                        x: args[0],
                        y: args[1],
                        z: args[2],
                        w: args[3],
                    };
                }
                static parse(input) {
                    const arr = Pacem.parseAsNumericalArray(input);
                    if (arr && arr.length === 4) {
                        return Quaternion.from.apply(null, arr);
                    }
                    throw new Error(`Cannot parse "${input}" as a valid Quaternion.`);
                }
                static fromAxisAngle(axis, angleDeg) {
                    angleDeg %= 360.0;
                    var angleInRadians = DEG2RAD * angleDeg;
                    var length = Vector3D.mag(axis);
                    if (length == 0.0) {
                        throw new RangeError('Invalid argument');
                    }
                    var factor = Math.sin(0.5 * angleInRadians) / length;
                    var x = axis.x * factor;
                    var y = axis.y * factor;
                    var z = axis.z * factor;
                    return Quaternion.from(x, y, z, Math.cos(.5 * angleInRadians));
                }
                static fromRotationMatrix(rotationMatrix) {
                    const trace = rotationMatrix.m11 + rotationMatrix.m22 + rotationMatrix.m33 + rotationMatrix.m44;
                    if (trace > 0) {
                        const sq = 0.5 / Math.sqrt(trace);
                        const w = 0.25 / sq;
                        const x = (rotationMatrix.m23 - rotationMatrix.m32) * sq;
                        const y = (rotationMatrix.m31 - rotationMatrix.m13) * sq;
                        const z = (rotationMatrix.m12 - rotationMatrix.m21) * sq;
                        return Quaternion.from(x, y, z, w);
                    }
                    else {
                        if (rotationMatrix.m11 > rotationMatrix.m22 && rotationMatrix.m11 > rotationMatrix.m22) {
                            const sq = 0.5 / Math.sqrt(rotationMatrix.m44 + rotationMatrix.m11 - rotationMatrix.m22 - rotationMatrix.m33);
                            const w = (rotationMatrix.m23 - rotationMatrix.m32) * sq;
                            const x = 0.25 / sq;
                            const y = (rotationMatrix.m12 + rotationMatrix.m21) * sq;
                            const z = (rotationMatrix.m31 + rotationMatrix.m13) * sq;
                            return Quaternion.from(x, y, z, w);
                        }
                        else if (rotationMatrix.m22 > rotationMatrix.m33) {
                            const sq = .5 / Math.sqrt(rotationMatrix.m44 + rotationMatrix.m22 - rotationMatrix.m11 - rotationMatrix.m33);
                            const z = (rotationMatrix.m23 + rotationMatrix.m32) * sq;
                            const y = 0.25 / sq;
                            const x = (rotationMatrix.m12 + rotationMatrix.m21) * sq;
                            const w = (rotationMatrix.m31 - rotationMatrix.m13) * sq;
                            return Quaternion.from(x, y, z, w);
                        }
                        else {
                            const sq = .5 / Math.sqrt(rotationMatrix.m44 + rotationMatrix.m33 - rotationMatrix.m11 - rotationMatrix.m22);
                            const y = (rotationMatrix.m23 + rotationMatrix.m32) * sq;
                            const z = 0.25 / sq;
                            const w = (rotationMatrix.m12 - rotationMatrix.m21) * sq;
                            const x = (rotationMatrix.m31 - rotationMatrix.m13) * sq;
                            return Quaternion.from(x, y, z, w);
                        }
                    }
                }
                static conjugate(q) {
                    return Quaternion.from(-q.x, -q.y, -q.z, q.w);
                }
                static norm(q) {
                    return ((q.x * q.x) + (q.y * q.y) + (q.z * q.z));
                }
                static axis(q) {
                    if (q.x == .0 && q.y == .0 && q.z == .0) {
                        return Vector3D.j();
                    }
                    return Vector3D.unit(q);
                }
                static angle(q) {
                    let y = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z);
                    let x = q.w;
                    if (y > Number.MAX_VALUE) {
                        const num = Math.max(Math.abs(q.x), Math.max(Math.abs(q.y), Math.abs(q.z)));
                        const num5 = q.x / num;
                        const num4 = q.y / num;
                        const num3 = q.z / num;
                        y = Math.sqrt(((num5 * num5) + (num4 * num4)) + (num3 * num3));
                        x /= num;
                    }
                    return (Math.atan2(y, x) * 114.59155902616465);
                }
                static toRotationMatrix(q) {
                    var m = Matrix3D.identity();
                    var X = q.x;
                    var Y = q.y;
                    var Z = q.z;
                    var W = q.w;
                    m.m11 = 1.0 - 2.0 * Y * Y - 2.0 * Z * Z;
                    m.m12 = 2.0 * X * Y + 2.0 * W * Z;
                    m.m13 = 2.0 * X * Z - 2.0 * W * Y;
                    m.m21 = 2.0 * X * Y - 2.0 * W * Z;
                    m.m22 = 1.0 - 2.0 * X * X - 2.0 * Z * Z;
                    m.m23 = 2.0 * Y * Z + 2.0 * W * X;
                    m.m31 = 2.0 * W * Y + 2.0 * X * Z;
                    m.m32 = 2.0 * Y * Z - 2.0 * W * X;
                    m.m33 = 1.0 - 2.0 * X * X - 2.0 * Y * Y;
                    return m;
                }
                static invert(q) {
                    const flippedNorm = 1.0 / Quaternion.norm(q);
                    const retval = Quaternion.conjugate(q);
                    retval.x *= flippedNorm;
                    retval.y *= flippedNorm;
                    retval.z *= flippedNorm;
                    retval.w *= flippedNorm;
                    return retval;
                }
                static multiply(q1, q2) {
                    return Quaternion.from(q1.w * q2.x + q1.x + q2.w + q1.y * q2.z - q1.z * q2.y, q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x, q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w, q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z);
                }
                static dot(q1, q2) {
                    var q = Quaternion.multiply(q1, Quaternion.conjugate(q2));
                    return q.w;
                }
            }
            LinearAlgebra.Quaternion = Quaternion;
        })(LinearAlgebra = Geometry.LinearAlgebra || (Geometry.LinearAlgebra = {}));
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
                    if (Pacem.NullChecker.isNullOrEmpty(args) || args.length <= 1) {
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
                    let result = Math.round(args[0]);
                    for (let j = 1; j < args.length; j++) {
                        result = ex10(result, Math.round(args[j]));
                    }
                    return result;
                }
                static gcd(a, b) {
                    a = Math.round(a),
                        b = Math.round(b);
                    if (a === 0) {
                        return b;
                    }
                    return Utils.gcd(b % a, a);
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
