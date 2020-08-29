/**
 * pacem v0.10.0 (https://js.pacem.it)
 * Copyright 2020 Pacem (https://pacem.it)
 * Licensed under MIT
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
/// <reference path="../../../dist/js/pacem-core.d.ts" />
var Pacem;
(function (Pacem) {
    var Drawing;
    (function (Drawing) {
        var _transformMatrix_1;
        function isDrawable(object) {
            return !Pacem.Utils.isNull(object) && 'stage' in object;
        }
        Drawing.isDrawable = isDrawable;
        function isUiObject(object) {
            return /*'transformMatrix' in object &&*/ isDrawable(object);
        }
        Drawing.isUiObject = isUiObject;
        function isShape(object) {
            return isUiObject(object) && 'pathData' in object;
        }
        Drawing.isShape = isShape;
        function isGroup(object) {
            return isUiObject(object) && 'items' in object && !Pacem.Utils.isNullOrEmpty(object['items']);
        }
        Drawing.isGroup = isGroup;
        function isText(object) {
            return isUiObject(object) && 'text' in object && typeof object['text'] === 'string';
        }
        Drawing.isText = isText;
        function isImage(object) {
            return isUiObject(object) && 'src' in object && typeof object['src'] === 'string';
        }
        Drawing.isImage = isImage;
        class UI2DEvent extends Pacem.CustomUIEvent {
            constructor(type, eventInit, originalEvent, transformMatrix) {
                super(type, eventInit, originalEvent);
                _transformMatrix_1.set(this, void 0);
                __classPrivateFieldSet(this, _transformMatrix_1, transformMatrix);
            }
            /** Gets the screen transform matrix. */
            get transformMatrix() {
                return __classPrivateFieldGet(this, _transformMatrix_1);
            }
            project(pt = { x: this.screenX, y: this.screenY }) {
                return Pacem.Matrix2D.multiply(pt, __classPrivateFieldGet(this, _transformMatrix_1));
            }
        }
        _transformMatrix_1 = new WeakMap();
        Drawing.UI2DEvent = UI2DEvent;
        class DragEvent extends UI2DEvent {
        }
        Drawing.DragEvent = DragEvent;
        class DrawableEvent extends UI2DEvent {
            constructor(type, args, originalEvent, m) {
                super(type, { detail: args, bubbles: true, cancelable: true }, originalEvent, m);
            }
        }
        Drawing.DrawableEvent = DrawableEvent;
    })(Drawing = Pacem.Drawing || (Pacem.Drawing = {}));
})(Pacem || (Pacem = {}));
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing;
        (function (Drawing) {
            Drawing.TAG_MIDDLE_NAME = "2d";
            Drawing.TWO_PI = 2 * Math.PI;
            const DEG2RAD = Math.PI / 180.0;
            class Pacem2DAdapterElement extends Components.PacemEventTarget {
                constructor() {
                    super(...arguments);
                    this.DefaultShapeValues = {
                        stroke: "#000",
                        lineWidth: 1,
                        fill: "#fff"
                    };
                }
            }
            Drawing.Pacem2DAdapterElement = Pacem2DAdapterElement;
            class DrawableElement extends Components.PacemCrossItemsContainerElement {
                validate(_) {
                    // by default no children allowed (Group will except)
                    return false;
                }
                findContainer() {
                    // override
                    return this.parent || this.stage;
                }
                get stage() {
                    return this['_scene'] = this['_scene'] || Pacem.CustomElementUtils.findAncestorOfType(this, Drawing.Pacem2DElement);
                }
                get parent() {
                    return this['_drawableParent'] = this['_drawableParent'] || Pacem.CustomElementUtils.findAncestor(this, i => i instanceof DrawableElement);
                }
                disconnectedCallback() {
                    delete this['_scene'];
                    delete this['_drawableParent'];
                    super.disconnectedCallback();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'hide':
                        case 'items':
                            const scene = this.stage;
                            if (!Pacem.Utils.isNull(scene)) {
                                name === 'hide' ? scene.draw(this) : scene.requestDraw(this, true);
                            }
                            break;
                    }
                }
            }
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true, converter: Pacem.PropertyConverters.String })
            ], DrawableElement.prototype, "tag", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], DrawableElement.prototype, "inert", void 0);
            Drawing.DrawableElement = DrawableElement;
            class UiElement extends DrawableElement {
                constructor() {
                    super(...arguments);
                    this._transformMatrix = Pacem.Matrix2D.identity;
                }
                propertyChangedCallback(name, old, val, first) {
                    if (!first) {
                        switch (name) {
                            case 'rotate':
                            case 'scaleX':
                            case 'scaleY':
                            case 'translateX':
                            case 'translateY':
                                this._updateTransformMatrix();
                            // flow down
                            case 'opacity':
                                if (!Pacem.Utils.isNull(this.stage)) {
                                    this.stage.draw(this);
                                }
                                break;
                        }
                    }
                }
                _updateTransformMatrix() {
                    let rotation = DEG2RAD * (this.rotate || 0), cos = Math.cos(rotation), sin = Math.sin(rotation), a = this.scaleX * cos, b = -sin, c = sin, d = this.scaleY * cos, e = this.translateX, f = this.translateY;
                    this._transformMatrix = { a: a, b: b, c: c, d: d, e: e, f: f };
                }
                /** @internal */
                get transformMatrix() {
                    const m = this._transformMatrix;
                    return { a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f };
                }
            }
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], UiElement.prototype, "rotate", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], UiElement.prototype, "scaleX", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], UiElement.prototype, "scaleY", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], UiElement.prototype, "translateX", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], UiElement.prototype, "translateY", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], UiElement.prototype, "opacity", void 0);
            Drawing.UiElement = UiElement;
            class ShapeElement extends UiElement {
                propertyChangedCallback(name, old, val, first) {
                    if (!first) {
                        switch (name) {
                            case 'data':
                            case 'stroke':
                            case 'lineWidth':
                            case 'fill':
                                if (!Pacem.Utils.isNull(this.stage)) {
                                    this.stage.draw(this);
                                }
                                break;
                        }
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this.data = this.getPathData();
                }
                get pathData() {
                    return this.data;
                }
            }
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], ShapeElement.prototype, "data", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], ShapeElement.prototype, "stroke", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], ShapeElement.prototype, "lineWidth", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], ShapeElement.prototype, "fill", void 0);
            __decorate([
                Pacem.Watch({
                    emit: false,
                    converter: {
                        convert: (attr) => attr === null || attr === void 0 ? void 0 : attr.split(',').map(i => parseInt(i)).filter(i => !Number.isNaN(i)),
                        convertBack: (prop) => prop === null || prop === void 0 ? void 0 : prop.join(',')
                    }
                })
            ], ShapeElement.prototype, "dashArray", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], ShapeElement.prototype, "lineJoin", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], ShapeElement.prototype, "lineCap", void 0);
            Drawing.ShapeElement = ShapeElement;
        })(Drawing = Components.Drawing || (Components.Drawing = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing;
        (function (Drawing) {
            var PacemCircleElement_1;
            let PacemCircleElement = PacemCircleElement_1 = class PacemCircleElement extends Drawing.ShapeElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first) {
                        switch (name) {
                            case 'center':
                            case 'radius':
                                this.data = this.getPathData();
                                break;
                        }
                    }
                }
                getPathData() {
                    const r = this.radius, c = this.center;
                    if (!Pacem.Utils.isNull(c) && !Pacem.Utils.isNull(r)) {
                        return PacemCircleElement_1.getPathData(c, r);
                    }
                    return null;
                }
                get boundingRect() {
                    var c = this.center, r = this.radius, d = 2 * r;
                    return { x: c.x - r, y: c.y - r, width: d, height: d };
                }
                static getPathData(c = { x: NaN, y: NaN }, r = NaN) {
                    const d = 2 * r, cx = c.x, cy = c.y;
                    return `M ${cx} ${cy} m ${-r}, 0 a ${r},${r} 0 1,1 ${d},0 a ${r},${r} 0 1,1 ${-d},0`;
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Point })
            ], PacemCircleElement.prototype, "center", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemCircleElement.prototype, "radius", void 0);
            PacemCircleElement = PacemCircleElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing.TAG_MIDDLE_NAME + '-circle' })
            ], PacemCircleElement);
            Drawing.PacemCircleElement = PacemCircleElement;
        })(Drawing = Components.Drawing || (Components.Drawing = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing;
        (function (Drawing) {
            let PacemGroupElement = class PacemGroupElement extends Drawing.DrawableElement {
                validate(item) {
                    return item instanceof Drawing.DrawableElement && item.parent === this;
                }
            };
            PacemGroupElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing.TAG_MIDDLE_NAME + '-group' })
            ], PacemGroupElement);
            Drawing.PacemGroupElement = PacemGroupElement;
        })(Drawing = Components.Drawing || (Components.Drawing = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing;
        (function (Drawing) {
            let PacemImageElement = class PacemImageElement extends Drawing.UiElement {
                propertyChangedCallback(name, old, val, first) {
                    if (!first) {
                        switch (name) {
                            case 'src':
                            case 'x':
                            case 'y':
                            case 'width':
                            case 'height':
                                if (!Pacem.Utils.isNull(this.stage)) {
                                    this.stage.draw(this);
                                }
                                break;
                        }
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemImageElement.prototype, "src", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemImageElement.prototype, "x", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemImageElement.prototype, "y", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemImageElement.prototype, "width", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemImageElement.prototype, "height", void 0);
            PacemImageElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing.TAG_MIDDLE_NAME + '-image' })
            ], PacemImageElement);
            Drawing.PacemImageElement = PacemImageElement;
        })(Drawing = Components.Drawing || (Components.Drawing = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing;
        (function (Drawing) {
            let PacemPathElement = class PacemPathElement extends Drawing.ShapeElement {
                constructor() {
                    super(...arguments);
                    this.getPathData = () => this.d;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'd') {
                        this.data = this.getPathData();
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemPathElement.prototype, "d", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemPathElement.prototype, "boundingRect", void 0);
            PacemPathElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing.TAG_MIDDLE_NAME + '-path' })
            ], PacemPathElement);
            Drawing.PacemPathElement = PacemPathElement;
        })(Drawing = Components.Drawing || (Components.Drawing = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing;
        (function (Drawing) {
            var PacemRectElement_1;
            let PacemRectElement = PacemRectElement_1 = class PacemRectElement extends Drawing.ShapeElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first && (name === 'x' || name === 'y' || name === 'w' || name === 'h')) {
                        this.data = this.getPathData();
                    }
                }
                getPathData() {
                    const x = this.x, y = this.y, w = this.w, h = this.h;
                    if (!Pacem.Utils.isNull(x) && !Pacem.Utils.isNull(y) && !Pacem.Utils.isNull(w) && !Pacem.Utils.isNull(h)) {
                        return PacemRectElement_1.getPathData(x, y, w, h);
                    }
                    return null;
                }
                get boundingRect() {
                    return { x: this.x, y: this.y, width: this.w, height: this.h };
                }
                static getPathData(x = NaN, y = NaN, w = NaN, h = NaN) {
                    return `M ${x} ${y} h ${w} v ${h} h ${-w} z`;
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemRectElement.prototype, "x", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemRectElement.prototype, "y", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemRectElement.prototype, "w", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemRectElement.prototype, "h", void 0);
            PacemRectElement = PacemRectElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing.TAG_MIDDLE_NAME + '-rect' })
            ], PacemRectElement);
            Drawing.PacemRectElement = PacemRectElement;
        })(Drawing = Components.Drawing || (Components.Drawing = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing;
        (function (Drawing) {
            var _trasformMatrix;
            // group [1] := align x,[3] := align y,[6] := slice
            const ASPECTRATIO_PATTERN = /^\s*[xX]\s*([Mm](in|ax|id))\s*[yY]\s*([Mm](in|ax|id))(\s+(none|slice|meet))?\s*$/;
            const aspectRatioPropertyConverter = {
                convert: (attr) => {
                    const regArr = ASPECTRATIO_PATTERN.exec(attr);
                    if (regArr && regArr.length >= 4) {
                        return {
                            x: regArr[1].toLowerCase(),
                            y: regArr[3].toLowerCase(),
                            slice: regArr[6] === 'slice'
                        };
                    }
                    return 'none';
                },
                convertBack: (val) => {
                    if (Pacem.Utils.isNull(val) || typeof val === 'string') {
                        return 'none';
                    }
                    return `xM${(val.x.substr(1))}YM${(val.y.substr(1))} ${(val.slice ? 'slice' : 'meet')}`;
                }
            };
            const DEFAULT_STAGE_OPTIONS = {
                panControl: true,
                zoomControl: true,
                panModifiers: [Pacem.EventKeyModifier.AltKey],
                zoomModifiers: [Pacem.EventKeyModifier.AltKey]
            };
            let Pacem2DElement = class Pacem2DElement extends Components.PacemItemsContainerElement {
                constructor() {
                    super(...arguments);
                    _trasformMatrix.set(this, Pacem.Matrix2D.identity);
                    this._options = DEFAULT_STAGE_OPTIONS;
                    this._resizeHandler = (evt) => {
                        this._size = { width: evt.detail.width, height: evt.detail.height };
                        const adapter = this.adapter;
                        if (!Pacem.Utils.isNull(adapter)) {
                            this._invalidateSize();
                        }
                    };
                    this._zoomHandler = (evt) => {
                        const opts = this._options;
                        if (opts.zoomControl && Pacem.CustomEventUtils.matchModifiers(evt, opts.zoomModifiers)) {
                            // prevent anything
                            Pacem.avoidHandler(evt);
                            const size = this._size, zoomingOut = evt.deltaY < 0, vbox = this.viewbox || { x: 0, y: 0, width: size.width, height: size.height };
                            // center change?
                            const factor = .1, sign = zoomingOut ? -1 : 1, factorWSign = factor * sign, scale = 1 + factorWSign;
                            const vsize = Math.min(vbox.width, vbox.height), targetWidth = vsize * scale, targetHeight = vsize * scale;
                            if (targetWidth > 0 && targetHeight > 0) {
                                const aspectRatio = this._getActualAspectRatio();
                                const alignmentX = aspectRatio.x;
                                const alignmentY = aspectRatio.y;
                                const slice = aspectRatio.slice;
                                // offset
                                const stageRect = Pacem.Utils.offsetRect(evt.currentTarget), vboxRatio = vbox.width / vbox.height, size = slice ? Math.max(stageRect.width, stageRect.height) : Math.min(stageRect.width, stageRect.height), pt = { x: evt.clientX, y: evt.clientY };
                                let 
                                // to be adjusted based on aspectRatio
                                adjX, adjY;
                                ;
                                switch (alignmentX) {
                                    case 'mid':
                                        adjX = (targetWidth - vbox.width) * (pt.x - stageRect.x - .5 * (stageRect.width - size)) / (size * vboxRatio);
                                        break;
                                    case 'max':
                                        adjX = (targetWidth - vbox.width) * (pt.x - stageRect.x - (stageRect.width - size)) / (size * vboxRatio);
                                        break;
                                    default:
                                        adjX = (targetWidth - vbox.width) * (pt.x - stageRect.x) / (size * vboxRatio);
                                        break;
                                }
                                switch (alignmentY) {
                                    case 'mid':
                                        adjY = (targetHeight - vbox.height) * (pt.y - stageRect.y - .5 * (stageRect.height - size)) / (size * vboxRatio);
                                        break;
                                    case 'max':
                                        adjY = (targetHeight - vbox.height) * (pt.y - stageRect.y - (stageRect.height - size)) / (size * vboxRatio);
                                        break;
                                    default:
                                        adjY = (targetHeight - vbox.height) * (pt.y - stageRect.y) / (size * vboxRatio);
                                        break;
                                }
                                const targetX = vbox.x - adjX, targetY = vbox.y - adjY;
                                this.viewbox = { x: targetX, y: targetY, width: targetWidth, height: targetHeight };
                            }
                        }
                    };
                    this._panHandler = (evt) => {
                        const state = this._panningStart, actual = this._getPanPoint(evt);
                        if (!Pacem.Utils.isNullOrEmpty(state && state.point) && !Pacem.Utils.isNull(actual)) {
                            const factor = state.factor, vbox = state.box, start = state.point;
                            this.viewbox = {
                                x: vbox.x - factor * (actual.x - start.x),
                                y: vbox.y - factor * (actual.y - start.y),
                                width: vbox.width,
                                height: vbox.height
                            };
                        }
                    };
                    this._panStartHandler = (evt) => {
                        const opts = this._options;
                        if (!opts.panControl) {
                            return;
                        }
                        const size = this._size, vbox = this.viewbox || { x: 0, y: 0, width: size.width, height: size.height }, start = this._getPanPoint(evt);
                        if (start) {
                            Pacem.avoidHandler(evt);
                            this._stage.style.pointerEvents = 'none';
                            const aspectRatio = this._getActualAspectRatio();
                            const wBased = vbox.width / size.width, hBased = vbox.height / size.height, factor = aspectRatio.slice ? Math.min(wBased, hBased) : Math.max(wBased, hBased);
                            this._panningStart = { point: start, box: vbox, factor };
                        }
                    };
                    this._panEndHandler = (evt) => {
                        this._stage.style.pointerEvents = '';
                        this._panningStart = null;
                    };
                }
                get stage() {
                    return this._stage;
                }
                get transformMatrix() {
                    return __classPrivateFieldGet(this, _trasformMatrix);
                }
                validate(item) {
                    return item instanceof Drawing.DrawableElement && /* only direct items */ Pacem.Utils.isNull(item.parent);
                }
                draw(item, redraw = false) {
                    const adapter = this.adapter;
                    if (!this.disabled && !Pacem.Utils.isNull(adapter)) {
                        let cancelable = new CustomEvent('predraw', { cancelable: true });
                        this.dispatchEvent(cancelable);
                        if (!cancelable.defaultPrevented) {
                            adapter.draw(this, item, redraw);
                            this.dispatchEvent(new CustomEvent('draw'));
                        }
                    }
                }
                _drawDebounced(item, force = false) {
                    if (!Pacem.Utils.isNull(item) && Pacem.Drawing.isGroup(item)) {
                        this.draw(item, force);
                    }
                    else {
                        this.draw(item);
                    }
                }
                requestDraw(item, redraw = false) {
                    this._drawDebounced(item, redraw);
                }
                _buildUpDatasourceFromDOM() {
                    this.datasource = (this.items || []).slice();
                }
                _getActualAspectRatio() {
                    const aspectRatio = this.aspectRatio || 'none';
                    const alignmentX = aspectRatio === 'none' ? 'mid' : aspectRatio.x;
                    const alignmentY = aspectRatio === 'none' ? 'mid' : aspectRatio.y;
                    const slice = aspectRatio === 'none' ? false : aspectRatio.slice;
                    return { x: alignmentX, y: alignmentY, slice };
                }
                _getPanPoint(evt) {
                    const opts = this._options;
                    if (evt instanceof MouseEvent && Pacem.CustomEventUtils.matchModifiers(evt, opts.panModifiers)) {
                        return Pacem.CustomEventUtils.getEventCoordinates(evt).page;
                    }
                    return null;
                }
                _invalidateSize() {
                    this.adapter.invalidateSize(this, this._size);
                    __classPrivateFieldSet(this, _trasformMatrix, this.adapter.getTransformMatrix(this));
                    this.dispatchEvent(new Components.ResizeEvent(this._size));
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    const adapter = this.adapter;
                    if (!Pacem.Utils.isNull(adapter)) {
                        adapter.initialize(this);
                        this._invalidateSize();
                        // request draw right away
                        this._drawDebounced();
                    }
                    const resize = this._resize;
                    resize.addEventListener(Pacem.Components.ResizeEventName, this._resizeHandler, false);
                    const stage = this._stage;
                    resize.target = stage;
                    const options = { capture: false, passive: true };
                    // zooming
                    stage.addEventListener('wheel', this._zoomHandler, false);
                    // panning
                    stage.addEventListener('mousedown', this._panStartHandler, false);
                    stage.addEventListener('touchstart', this._panStartHandler, options);
                    window.addEventListener('mousemove', this._panHandler, false);
                    window.addEventListener('mouseup', this._panEndHandler, false);
                    window.addEventListener('touchmove', this._panHandler, options);
                    window.addEventListener('touchend', this._panEndHandler, options);
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'adapter':
                            if (!Pacem.Utils.isNull(old)) {
                                val.dispose(this);
                            }
                            if (!Pacem.Utils.isNull(val)) {
                                val.initialize(this);
                                this._drawDebounced();
                            }
                            break;
                        case 'aspectRatio':
                        case 'viewbox':
                            if (!Pacem.Utils.isNull(this.adapter)) {
                                this._invalidateSize();
                            }
                            break;
                        case 'items':
                            this._buildUpDatasourceFromDOM();
                            break;
                        case 'options':
                            this._options = Pacem.Utils.extend({}, DEFAULT_STAGE_OPTIONS, val || {});
                            break;
                        case 'disabled':
                        case 'datasource':
                            this._drawDebounced();
                            break;
                    }
                }
                disconnectedCallback() {
                    const resizer = this._resize, stage = this._stage;
                    if (!Pacem.Utils.isNull(resizer)) {
                        resizer.removeEventListener(Pacem.Components.ResizeEventName, this._resizeHandler, false);
                    }
                    if (!Pacem.Utils.isNull(stage)) {
                        // zooming
                        stage.removeEventListener('wheel', this._zoomHandler, false);
                        // panning
                        stage.removeEventListener('mousedown', this._panStartHandler, false);
                        stage.removeEventListener('touchstart', this._panStartHandler);
                        window.removeEventListener('mousemove', this._panHandler, false);
                        window.removeEventListener('mouseup', this._panEndHandler, false);
                        window.removeEventListener('touchmove', this._panHandler);
                        window.removeEventListener('touchend', this._panEndHandler);
                    }
                    if (!Pacem.Utils.isNull(this.adapter)) {
                        this.adapter.dispose(this);
                    }
                    super.disconnectedCallback();
                }
            };
            _trasformMatrix = new WeakMap();
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Element })
            ], Pacem2DElement.prototype, "adapter", void 0);
            __decorate([
                Pacem.Watch({ reflectBack: true, converter: Pacem.PropertyConverters.Rect })
            ], Pacem2DElement.prototype, "viewbox", void 0);
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true, converter: aspectRatioPropertyConverter })
            ], Pacem2DElement.prototype, "aspectRatio", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], Pacem2DElement.prototype, "datasource", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], Pacem2DElement.prototype, "options", void 0);
            __decorate([
                Pacem.ViewChild('.' + Pacem.PCSS + '-2d')
            ], Pacem2DElement.prototype, "_stage", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-resize')
            ], Pacem2DElement.prototype, "_resize", void 0);
            __decorate([
                Pacem.Debounce(true)
            ], Pacem2DElement.prototype, "_drawDebounced", null);
            Pacem2DElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing.TAG_MIDDLE_NAME, shadow: Pacem.Defaults.USE_SHADOW_ROOT, template: `<${Pacem.P}-resize></${Pacem.P}-resize><div class="${Pacem.PCSS}-2d"></div><pacem-content></pacem-content>` })
            ], Pacem2DElement);
            Drawing.Pacem2DElement = Pacem2DElement;
        })(Drawing = Components.Drawing || (Components.Drawing = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing;
        (function (Drawing) {
            let PacemTextElement = class PacemTextElement extends Drawing.UiElement {
                propertyChangedCallback(name, old, val, first) {
                    if (!first) {
                        switch (name) {
                            case 'text':
                            case 'color':
                            case 'fontFamily':
                            case 'fontSize':
                            case 'anchor':
                                if (!Pacem.Utils.isNull(this.stage)) {
                                    this.stage.draw(this);
                                }
                                break;
                        }
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemTextElement.prototype, "text", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemTextElement.prototype, "color", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemTextElement.prototype, "fontFamily", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemTextElement.prototype, "fontSize", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Point })
            ], PacemTextElement.prototype, "anchor", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemTextElement.prototype, "textAnchor", void 0);
            PacemTextElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing.TAG_MIDDLE_NAME + '-text' })
            ], PacemTextElement);
            Drawing.PacemTextElement = PacemTextElement;
        })(Drawing = Components.Drawing || (Components.Drawing = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing;
        (function (Drawing) {
            // const TWO_PI = 2 * Math.PI;
            const DEG2RAD = Math.PI / 180.0;
            function isNone(fillOrStroke) {
                return fillOrStroke === 'none' || Pacem.Utils.isNullOrEmpty(fillOrStroke);
            }
            function fallback(v, f) {
                return Pacem.Utils.isNull(v) ? f : v;
            }
            /** Implementation postponed. Focus on SVG adapter. */
            let PacemCanvasAdapterElement = class PacemCanvasAdapterElement extends Drawing.Pacem2DAdapterElement {
                constructor() {
                    super(...arguments);
                    this._pointer = {
                        page: { x: 0, y: 0 }, screen: { x: 0, y: 0 }, client: { x: 0, y: 0 }
                    };
                    this._canvasOffset = { x: 0, y: 0, width: 0, height: 0 };
                    this._clickHandler = (evt) => {
                        const currentHitTarget = this._hitTarget;
                        if (!Pacem.Utils.isNull(currentHitTarget)) {
                            const m = currentHitTarget.stage.transformMatrix;
                            if (currentHitTarget instanceof Element) {
                                currentHitTarget.dispatchEvent(new Pacem.Drawing.DrawableEvent('click', currentHitTarget, evt, m));
                            }
                            currentHitTarget.stage.dispatchEvent(new Pacem.Drawing.DrawableEvent('itemclick', currentHitTarget, evt, m));
                        }
                    };
                    this._mousemoveHandler = (evt) => {
                        this._scopeEvent = evt;
                        this._pointer = Pacem.CustomEventUtils.getEventCoordinates(evt);
                        // this._modifiers = CustomEventUtils.getEventKeyModifiers(evt);
                    };
                    this._touchstartHandler = (evt) => {
                        if (evt.touches.length === 1) {
                            this._scopeEvent = evt;
                            this._pointer = Pacem.CustomEventUtils.getEventCoordinates(evt);
                            // this._modifiers = CustomEventUtils.getEventKeyModifiers(evt);
                        }
                    };
                    this._scenes = new WeakMap();
                    this._handles = new WeakMap();
                }
                snapshot(stage) {
                    return new Promise((resolve, _) => {
                        const scenes = this._scenes;
                        if (scenes.has(stage)) {
                            var ctx2d = scenes.get(stage).context;
                            ctx2d.canvas.toBlob((b) => {
                                resolve(b);
                            }, 'image/png');
                        }
                        else {
                            resolve(null);
                        }
                    });
                }
                getTransformMatrix(scene) {
                    const scenes = this._scenes;
                    if (scenes.has(scene)) {
                        return scenes.get(scene).transformMatrix;
                    }
                    return Pacem.Matrix2D.identity;
                }
                invalidateSize(scene, size) {
                    const scenes = this._scenes;
                    if (!Pacem.Utils.isNull(scene) && !Pacem.Utils.isNullOrEmpty(size)) {
                        if (scenes.has(scene)) {
                            var ctx = scenes.get(scene).context;
                            ctx.canvas.width = size.width;
                            ctx.canvas.height = size.height;
                            this._canvasOffset = Pacem.Utils.offsetRect(ctx.canvas);
                        }
                    }
                }
                getHitTarget(stage) {
                    const target = this._hitTarget;
                    if (!Pacem.Utils.isNull(target) && target.stage === stage) {
                        return target;
                    }
                    return null;
                }
                initialize(scene) {
                    if (Pacem.Utils.isNull(scene)) {
                        throw 'Provided scene is null or undefined.';
                    }
                    const scenes = this._scenes;
                    // already in the store?
                    if (scenes.has(scene)) {
                        return scenes.get(scene).context.canvas;
                    }
                    const stage = scene.stage;
                    // empty stage DOM
                    stage.innerHTML = '';
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    canvas.addEventListener('mousemove', this._mousemoveHandler, false);
                    canvas.addEventListener('touchstart', this._touchstartHandler, { passive: true });
                    canvas.addEventListener('touchmove', this._touchstartHandler, { passive: true });
                    canvas.addEventListener('touchend', this._clickHandler, { passive: true });
                    canvas.addEventListener('click', this._clickHandler, false);
                    stage.appendChild(canvas);
                    scenes.set(scene, { context, transformMatrix: Pacem.Matrix2D.identity });
                    // this._requestDraw(scene);
                    return canvas;
                }
                _requestDraw(scene) {
                    const handles = this._handles;
                    if (handles.has(scene)) {
                        cancelAnimationFrame(handles.get(scene));
                    }
                    handles.set(scene, requestAnimationFrame(() => { this.draw(scene); }));
                }
                dispose(scene) {
                    const scenes = this._scenes;
                    if (scenes.has(scene)) {
                        var tuple = scenes.get(scene), context = tuple.context;
                        context.canvas.removeEventListener('click', this._clickHandler, false);
                        context.canvas.removeEventListener('touchend', this._clickHandler, false);
                        context.canvas.removeEventListener('touchmove', this._touchstartHandler);
                        context.canvas.removeEventListener('touchstart', this._touchstartHandler);
                        context.canvas.removeEventListener('mousemove', this._mousemoveHandler, false);
                        // remove
                        context.canvas.remove();
                        scenes.delete(scene);
                    }
                }
                draw(scene) {
                    const scenes = this._scenes, handles = this._handles;
                    if (!Pacem.Utils.isNull(scene)) {
                        if (scene.adapter !== this) {
                            // not a pertinent stage anymore
                            if (scenes.has(scene)) {
                                scenes.delete(scene);
                                handles.get(scene);
                            }
                            return;
                        }
                        if (!scenes.has(scene)) {
                            // forgiving behavior (call initialize() if it's the case)
                            this.initialize(scene);
                            return;
                        }
                        if (handles.has(scene)) {
                            // already in the drawing loop, reset
                            cancelAnimationFrame(handles.get(scene));
                        }
                        const formerHitTarget = this._hitTarget;
                        const items = scene.datasource || [];
                        // reset hit target
                        this._hitTarget = null;
                        // clear stage
                        const tuple = scenes.get(scene), context = tuple.context, canvas = context.canvas;
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        // viewbox
                        const m = tuple.transformMatrix = this._resetTransform(scene.viewbox, context);
                        // draw recursively
                        for (let drawable of items) {
                            this._draw(context, drawable);
                        }
                        // check hit target
                        const currentHitTarget = this._hitTarget;
                        if (currentHitTarget != formerHitTarget) {
                            if (!Pacem.Utils.isNull(formerHitTarget)) {
                                if (formerHitTarget instanceof Element) {
                                    formerHitTarget.dispatchEvent(new Pacem.Drawing.DrawableEvent('out', formerHitTarget, this._scopeEvent, m));
                                }
                                scene.dispatchEvent(new Pacem.Drawing.DrawableEvent('itemout', formerHitTarget, this._scopeEvent, m));
                            }
                            if (!Pacem.Utils.isNull(currentHitTarget)) {
                                if (currentHitTarget instanceof Element) {
                                    currentHitTarget.dispatchEvent(new Pacem.Drawing.DrawableEvent('over', currentHitTarget, this._scopeEvent, m));
                                }
                                scene.dispatchEvent(new Pacem.Drawing.DrawableEvent('itemover', currentHitTarget, this._scopeEvent, m));
                            }
                        }
                        // loop
                        this._requestDraw(scene);
                    }
                }
                _resetTransform(viewbox, context) {
                    context.resetTransform();
                    const rect = viewbox, size = context.canvas;
                    if (!Pacem.Utils.isNull(rect)) {
                        const w = size.width, h = size.height, scale = 1 / Math.min(rect.width / w, rect.height / h), a = scale, b = 0, c = 0, d = scale, e = w / 2 - scale * rect.x, f = h / 2 - scale * rect.y;
                        context.transform(a, b, c, d, e, f);
                        return { a: a, b: b, c: c, d: d, e: e, f: f };
                    }
                }
                _hasItems(object) {
                    return 'items' in object && Pacem.Utils.isArray(object.items);
                }
                _draw(ctx, item) {
                    var data;
                    const defaults = this.DefaultShapeValues;
                    // draw
                    if (Pacem.Drawing.isDrawable(item)) {
                        if (item.hide) {
                            return;
                        }
                    }
                    if (!Pacem.Utils.isNull(ctx) && Pacem.Drawing.isShape(item) && !Pacem.Utils.isNullOrEmpty(data = item.pathData)) {
                        ctx.strokeStyle = fallback(item.stroke, defaults.stroke);
                        ctx.lineWidth = fallback(item.lineWidth, defaults.lineWidth);
                        if (!Pacem.Utils.isNullOrEmpty(item.dashArray)) {
                            ctx.setLineDash(item.dashArray);
                        }
                        if (!Pacem.Utils.isNullOrEmpty(item.lineCap)) {
                            ctx.lineCap = item.lineCap;
                        }
                        if (!Pacem.Utils.isNullOrEmpty(item.lineJoin)) {
                            ctx.lineJoin = item.lineJoin;
                        }
                        ctx.lineWidth = fallback(item.lineWidth, defaults.lineWidth);
                        ctx.fillStyle = fallback(item.fill, defaults.fill);
                        ctx.globalAlpha = fallback(item.opacity, 1);
                        let t = item.transformMatrix;
                        if (!Pacem.Utils.isNull(t) && !Pacem.Matrix2D.isIdentity(t)) {
                            ctx.transform(t.a, t.b, t.c, t.d, t.e, t.f);
                        }
                        ctx.beginPath();
                        // Path2D
                        const hasFill = !isNone(item.fill), hasStroke = !isNone(item.stroke);
                        var path2D = new Path2D(data);
                        const pointer = this._pointer, offset = this._canvasOffset, point = { x: pointer.page.x - offset.x, y: pointer.page.y - offset.y };
                        if (!item.inert /* is hit-test visible? */
                            && !Pacem.Utils.isNull(pointer)) {
                            if ((hasFill && ctx.isPointInPath(path2D, point.x, point.y))
                                || (hasStroke && ctx.isPointInStroke(path2D, point.x, point.y))) {
                                // overwrite current hit-target (last one wins)
                                this._hitTarget = item;
                            }
                        }
                        if (hasStroke)
                            ctx.stroke(path2D);
                        if (hasFill)
                            ctx.fill(path2D);
                        // reset defaults
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = '#000';
                        ctx.setLineDash([]);
                        ctx.lineCap = 'butt';
                        ctx.lineJoin = 'miter';
                        // reset transform
                        this._resetTransform(item.stage.viewbox, ctx);
                    }
                    if (Pacem.Drawing.isDrawable(item) && this._hasItems(item) && !item.hide) {
                        if (Pacem.Drawing.isUiObject(item)) {
                            // TypeScript bug
                            const ui = item;
                            const t = ui.transformMatrix;
                            if (!Pacem.Utils.isNull(t) && !Pacem.Matrix2D.isIdentity(t)) {
                                ctx.transform(t.a, t.b, t.c, t.d, t.e, t.f);
                            }
                        }
                        for (let child of item.items || []) {
                            this._draw(ctx, child);
                        }
                    }
                }
            };
            PacemCanvasAdapterElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing.TAG_MIDDLE_NAME + '-canvas-adapter' })
            ], PacemCanvasAdapterElement);
            Drawing.PacemCanvasAdapterElement = PacemCanvasAdapterElement;
        })(Drawing = Components.Drawing || (Components.Drawing = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing;
        (function (Drawing) {
            const SVG_NS = 'http://www.w3.org/2000/svg', DRAWABLE_VAR = 'pacem:drawable';
            function fallback(v, f) {
                return Pacem.Utils.isNull(v) ? f : v;
            }
            function replaceChildAt(parent, newChild, targetIndex) {
                if (targetIndex >= parent.children.length) {
                    parent.appendChild(newChild);
                    return null;
                }
                else {
                    return parent.replaceChild(newChild, parent.children.item(targetIndex));
                }
            }
            let PacemSvgAdapterElement = class PacemSvgAdapterElement extends Drawing.Pacem2DAdapterElement {
                constructor() {
                    super(...arguments);
                    this._hitTarget = null;
                    this._dragInitHandler = (evt) => {
                        const args = evt.detail, el = args.element, drawable = Pacem.CustomElementUtils.getAttachedPropertyValue(el, DRAWABLE_VAR), transformMatrix = drawable.stage.transformMatrix, initialMatrix = Pacem.Utils.deserializeTransform(el.style);
                        args.data = {
                            transformMatrix: transformMatrix, item: drawable,
                            initialTransformMatrix: initialMatrix
                        };
                        const reject = this._itemDispatch(drawable, evt, { x: 0, y: 0 });
                        if (reject) {
                            // reject dragging
                            evt.preventDefault();
                        }
                    };
                    this._draggingHandler = (evt) => {
                        Pacem.avoidHandler(evt);
                        this._dragging = true;
                        const el = evt.detail.element;
                        const data = evt.detail.data;
                        const args = evt.detail;
                        const offset = {
                            x: (args.currentPosition.x - args.origin.x) * data.transformMatrix.a + data.initialTransformMatrix.e,
                            y: (args.currentPosition.y - args.origin.y) * data.transformMatrix.d + data.initialTransformMatrix.f
                        };
                        const rejected = this._itemDispatch(data.item, evt, offset);
                        if (!rejected) {
                            el.style.transform = `matrix(1,0,0,1,${offset.x},${offset.y})`;
                        }
                    };
                    this._dragEndHandler = (evt) => {
                        this._dragging = false;
                        const args = evt.detail, data = args.data, transform = Pacem.Utils.deserializeTransform(args.element.style);
                        this._itemDispatch(data.item, evt, { x: transform.e, y: transform.f });
                    };
                    this._mousemoveHandler = (evt) => {
                        var pt = Pacem.CustomEventUtils.getEventCoordinates(evt).client;
                        if (!this._dragging) {
                            // not dragging around
                            var d = null;
                            var el = document.elementsFromPoint(pt.x, pt.y).find(i => {
                                d = Pacem.CustomElementUtils.getAttachedPropertyValue(i, DRAWABLE_VAR);
                                return d && !d.inert;
                            });
                            var old = this._hitTarget, val = d;
                            if (Pacem.Utils.isNull(d && d.stage) || !this._scenes.has(d.stage) || d.inert) {
                                val = null;
                            }
                            this._hitTarget = val;
                            if (val !== old) {
                                if (!Pacem.Utils.isNull(old)) {
                                    this._dragger.unregister(this._items.get(old));
                                    this._itemDispatch(old, 'out', evt);
                                }
                                if (!Pacem.Utils.isNull(val)) {
                                    if (val.draggable) {
                                        this._dragger.register(this._items.get(val));
                                    }
                                    this._itemDispatch(val, 'over', evt);
                                }
                            }
                        }
                    };
                    this._mouseDownUpHandler = (evt) => {
                        if (!Pacem.Utils.isNull(this._hitTarget)) {
                            const type = evt.type.replace(/^mouse/, '');
                            this._itemDispatch(this._hitTarget, type, evt);
                        }
                    };
                    this._scenes = new WeakMap();
                    this._items = new WeakMap();
                }
                snapshot(stage, background) {
                    return new Promise((resolve, _) => {
                        if (this._scenes.has(stage)) {
                            const svg = this._scenes.get(stage);
                            Pacem.Utils.snapshotElement(svg, background).then(b => {
                                resolve(b);
                            });
                        }
                        else {
                            resolve(null);
                        }
                    });
                }
                getTransformMatrix(scene) {
                    const scenes = this._scenes;
                    if (scenes.has(scene)) {
                        return scenes.get(scene).getScreenCTM().inverse();
                    }
                    return Pacem.Matrix2D.identity;
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    const dragDrop = this._dragger = document.createElement(Pacem.P + '-drag-drop');
                    dragDrop.mode = Pacem.UI.DragDataMode.Self;
                    // append
                    const shell = Pacem.CustomElementUtils.findAncestorShell(this);
                    shell.appendChild(dragDrop);
                    dragDrop.addEventListener(Pacem.UI.DragDropEventType.Init, this._dragInitHandler, false);
                    dragDrop.addEventListener(Pacem.UI.DragDropEventType.Drag, this._draggingHandler, false);
                    dragDrop.addEventListener(Pacem.UI.DragDropEventType.End, this._dragEndHandler, false);
                }
                disconnectedCallback() {
                    const dragger = this._dragger;
                    if (!Pacem.Utils.isNull(dragger)) {
                        dragger.removeEventListener(Pacem.UI.DragDropEventType.Init, this._dragInitHandler, false);
                        dragger.removeEventListener(Pacem.UI.DragDropEventType.Drag, this._draggingHandler, false);
                        dragger.removeEventListener(Pacem.UI.DragDropEventType.End, this._dragEndHandler, false);
                        dragger.remove();
                    }
                    super.disconnectedCallback();
                }
                invalidateSize(scene, size) {
                    const scenes = this._scenes;
                    if (!Pacem.Utils.isNull(scene) && !Pacem.Utils.isNullOrEmpty(size)) {
                        if (scenes.has(scene)) {
                            var svg = scenes.get(scene);
                            svg.setAttribute('width', size.width + '');
                            svg.setAttribute('height', size.height + '');
                            const rect = scene.viewbox, aspectRatio = scene.aspectRatio;
                            if (!Pacem.Utils.isNullOrEmpty(rect)) {
                                svg.setAttribute('viewBox', `${rect.x} ${rect.y} ${rect.width} ${rect.height}`);
                            }
                            else {
                                svg.removeAttribute('viewBox');
                            }
                            if (Pacem.Utils.isNullOrEmpty(aspectRatio) || typeof aspectRatio === 'string') {
                                svg.removeAttribute('preserveAspectRatio');
                            }
                            else {
                                svg.setAttribute('preserveAspectRatio', `xM${aspectRatio.x.substr(1)}YM${aspectRatio.y.substr(1)} ${(aspectRatio.slice ? 'slice' : 'meet')}`);
                            }
                        }
                    }
                }
                initialize(scene) {
                    if (Pacem.Utils.isNull(scene)) {
                        throw 'Provided scene is null or undefined.';
                    }
                    const scenes = this._scenes;
                    // already in the store?
                    if (scenes.has(scene)) {
                        return scenes.get(scene);
                    }
                    const stage = scene.stage;
                    // empty stage DOM and clear dictionary
                    stage.innerHTML = '';
                    this._items = new WeakMap();
                    var svg = document.createElementNS(SVG_NS, 'svg');
                    stage.appendChild(svg);
                    scenes.set(scene, svg);
                    const options = { passive: false, capture: true };
                    svg.addEventListener('mousemove', this._mousemoveHandler, false);
                    svg.addEventListener('click', this._mouseDownUpHandler, false);
                    svg.addEventListener('mousedown', this._mouseDownUpHandler, false);
                    svg.addEventListener('mouseup', this._mouseDownUpHandler, false);
                    // draw right away
                    // this.draw(scene);
                    return svg;
                }
                dispose(scene) {
                    const scenes = this._scenes;
                    if (scenes.has(scene)) {
                        var svg = scenes.get(scene);
                        svg.removeEventListener('mousemove', this._mousemoveHandler);
                        svg.removeEventListener('click', this._mouseDownUpHandler);
                        svg.removeEventListener('mousedown', this._mouseDownUpHandler);
                        svg.removeEventListener('mouseup', this._mouseDownUpHandler);
                        // remove
                        svg.remove();
                        scenes.delete(scene);
                    }
                }
                getHitTarget(scene) {
                    return this._hitTarget;
                }
                draw(scene, item, deepRedraw = false) {
                    const scenes = this._scenes, dict = this._items;
                    if (!Pacem.Utils.isNull(scene)) {
                        if (scene.adapter === this) {
                            if (!scenes.has(scene)) {
                                // forgiving behavior (call initialize() if it's the case)
                                this.initialize(scene);
                            }
                        }
                        else {
                            if (scenes.has(scene)) {
                                scenes.delete(scene);
                            }
                            return;
                        }
                    }
                    else {
                        return;
                    }
                    var items = scene.datasource, flow = true, parent = scenes.get(scene);
                    // item provided?
                    if (!Pacem.Utils.isNull(item)) {
                        if (dict.has(item)) {
                            items = [item];
                            parent = dict.get(item).parentNode;
                            flow = false;
                        }
                    }
                    if (flow) {
                        // sweep everything, quick and dirty
                        parent.innerHTML = '';
                    }
                    this._draw(parent, items || [], flow, deepRedraw);
                }
                _itemDispatch(target, type, offset) {
                    if (!Pacem.Utils.isNull(target)) {
                        var dragArgs, originalEvent, evtType;
                        if (offset instanceof Event) {
                            originalEvent = offset;
                        }
                        else {
                            dragArgs = { item: target, offset: offset };
                        }
                        if (typeof type === 'string') {
                            evtType = type;
                        }
                        else {
                            evtType = type.type;
                            originalEvent = type.originalEvent;
                        }
                        const m = target.stage.transformMatrix;
                        const evt = () => offset instanceof Event ? new Pacem.Drawing.DrawableEvent(evtType, target, originalEvent, m) : new Pacem.Drawing.DragEvent(evtType, { detail: dragArgs, cancelable: evtType === Pacem.UI.DragDropEventType.Init || evtType === Pacem.UI.DragDropEventType.Drag }, originalEvent, m), itemevt = offset instanceof Event ? new Pacem.Drawing.DrawableEvent('item' + evtType, target, originalEvent, m) : new Pacem.Drawing.DragEvent('item' + evtType, { detail: dragArgs, cancelable: evtType === Pacem.UI.DragDropEventType.Init || evtType === Pacem.UI.DragDropEventType.Drag }, originalEvent, m);
                        var prevent = false;
                        if (target instanceof EventTarget) {
                            const evnt = evt();
                            target.dispatchEvent(evnt);
                            prevent = evnt.defaultPrevented;
                        }
                        target.stage.dispatchEvent(itemevt);
                        // was the event (in one of its forms) rejected?
                        return prevent || itemevt.defaultPrevented;
                    }
                    return false;
                }
                _hasItems(object) {
                    return Pacem.Drawing.isGroup(object);
                }
                _disposeSvg(el) {
                    if (!Pacem.Utils.isNull(el)) {
                        var drawable = Pacem.CustomElementUtils.getAttachedPropertyValue(el, DRAWABLE_VAR);
                        this._items.delete(drawable);
                    }
                }
                _draw(parent, items, flow, deepRedraw) {
                    const dict = this._items;
                    // children counter
                    let j = 0;
                    if (!Pacem.Utils.isNullOrEmpty(items)) {
                        for (let item of items) {
                            let el;
                            if (!dict.has(item)) {
                                el = this._buildSVGElement(item);
                                Pacem.CustomElementUtils.setAttachedPropertyValue(el, DRAWABLE_VAR, item);
                                this._disposeSvg(replaceChildAt(parent, el, j));
                                dict.set(item, el);
                            }
                            else {
                                el = dict.get(item);
                                if (el.parentNode !== parent) {
                                    this._disposeSvg(replaceChildAt(parent, el, j));
                                }
                            }
                            if (Pacem.Drawing.isDrawable(item)) {
                                if (item.hide) {
                                    el.setAttribute('display', 'none');
                                }
                                else {
                                    el.removeAttribute('display');
                                }
                                el.style.transform = 'none';
                            }
                            if (Pacem.Drawing.isShape(item)) {
                                const path = el;
                                const defaults = this.DefaultShapeValues;
                                path.setAttribute('d', fallback(item.pathData, 'M0,0'));
                                path.setAttribute('fill', fallback(item.fill, defaults.fill));
                                path.setAttribute('stroke', fallback(item.stroke, defaults.stroke));
                                let css = '';
                                if (!Pacem.Utils.isNullOrEmpty(item.dashArray)) {
                                    css += `stroke-dasharray: ${item.dashArray.join(',')};`;
                                }
                                if (!Pacem.Utils.isNullOrEmpty(item.lineCap)) {
                                    css += `stroke-linecap: ${item.lineCap};`;
                                }
                                if (!Pacem.Utils.isNullOrEmpty(item.lineJoin)) {
                                    css += `stroke-linejoin: ${item.lineJoin};`;
                                }
                                path.style.cssText = css;
                                path.setAttribute('stroke-width', '' + fallback(item.lineWidth, defaults.lineWidth));
                            }
                            else if (Pacem.Drawing.isText(item)) {
                                const text = el;
                                text.textContent = item.text;
                                text.style.fill = Pacem.Utils.isNullOrEmpty(item.color) ? '' : item.color;
                                text.style.fontFamily = Pacem.Utils.isNullOrEmpty(item.fontFamily) ? '' : item.fontFamily;
                                text.style.fontSize = Pacem.Utils.isNull(item.fontSize) ? '' : item.fontSize + 'px';
                                text.setAttribute('text-anchor', fallback(item.textAnchor, 'start'));
                                if (!Pacem.Utils.isNull(item.anchor)) {
                                    text.setAttribute('x', item.anchor.x.toString());
                                    text.setAttribute('y', item.anchor.y.toString());
                                }
                                else {
                                    text.removeAttribute('x');
                                    text.removeAttribute('y');
                                }
                            }
                            else if (Pacem.Drawing.isImage(item)) {
                                const img = el;
                                img.setAttribute('href', item.src);
                                if (item.width > 0) {
                                    img.setAttribute('width', '' + item.width);
                                }
                                else {
                                    img.removeAttribute('width');
                                }
                                if (item.height > 0) {
                                    img.setAttribute('height', '' + item.height);
                                }
                                else {
                                    img.removeAttribute('height');
                                }
                                if (!Pacem.Utils.isNull(item.x)) {
                                    img.setAttribute('x', '' + item.x);
                                }
                                else {
                                    img.removeAttribute('x');
                                }
                                if (!Pacem.Utils.isNull(item.y)) {
                                    img.setAttribute('y', '' + item.y);
                                }
                                else {
                                    img.removeAttribute('y');
                                }
                            }
                            if (Pacem.Drawing.isUiObject(item)) {
                                const t = item.transformMatrix;
                                if (Pacem.Utils.isNull(t) || Pacem.Matrix2D.isIdentity(t)) {
                                    el.removeAttribute('transform');
                                }
                                else {
                                    el.setAttribute('transform', `matrix(${t.a} ${t.b} ${t.c} ${t.d} ${t.e} ${t.f})`);
                                }
                                const opacity = fallback(item.opacity, 1);
                                if (opacity === 1) {
                                    el.removeAttribute('opacity');
                                }
                                else {
                                    el.setAttribute('opacity', '' + opacity);
                                }
                            }
                            if ((flow || deepRedraw) && this._hasItems(item)) {
                                // recursion
                                this._draw(el, item.items, true, deepRedraw);
                            }
                            j++;
                        }
                    }
                    if (flow) {
                        // remove exceeding children
                        for (let k = parent.children.length - 1; k >= j; k--) {
                            const el = parent.children.item(k);
                            this._disposeSvg(el);
                            el.remove();
                        }
                    }
                }
                _buildSVGElement(item) {
                    if (Pacem.Drawing.isShape(item)) {
                        return document.createElementNS(SVG_NS, 'path');
                    }
                    if (Pacem.Drawing.isText(item)) {
                        return document.createElementNS(SVG_NS, 'text');
                    }
                    if (Pacem.Drawing.isImage(item)) {
                        return document.createElementNS(SVG_NS, 'image');
                    }
                    return document.createElementNS(SVG_NS, 'g');
                }
            };
            PacemSvgAdapterElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing.TAG_MIDDLE_NAME + '-svg-adapter' })
            ], PacemSvgAdapterElement);
            Drawing.PacemSvgAdapterElement = PacemSvgAdapterElement;
        })(Drawing = Components.Drawing || (Components.Drawing = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
