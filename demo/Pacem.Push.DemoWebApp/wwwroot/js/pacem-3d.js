/**
 * pacem v0.20.0-alexandria (https://js.pacem.it)
 * Copyright 2021 Pacem (https://pacem.it)
 * Licensed under MIT
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
    var Drawing3D;
    (function (Drawing3D) {
        Drawing3D.Point3DConverter = {
            convert: (attr) => Pacem.Geometry.LinearAlgebra.Vector3D.parse(attr),
            convertBack: (prop) => `${prop.x || 0} ${prop.y || 0} ${prop.z || 0}`
        };
        Drawing3D.QuaternionConverter = {
            convert: (attr) => Pacem.Geometry.LinearAlgebra.Quaternion.parse(attr),
            convertBack: (prop) => `${prop.x || 0} ${prop.y || 0} ${prop.z || 0} ${prop.w || 0}`
        };
    })(Drawing3D = Pacem.Drawing3D || (Pacem.Drawing3D = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            class Pacem3DDetector {
                constructor() {
                    this._detected = {
                        supported: false, info: {}
                    };
                    let cvs = document.createElement('canvas');
                    let contextNames = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];
                    let ctx;
                    let getParam = function (str) {
                        if (!str)
                            return undefined;
                        return ctx.getParameter(str);
                    };
                    // addLine
                    let addLine = (section, name, value) => {
                        let detected = this._detected;
                        var info = detected.info[section] = detected.info[section] || {};
                        name = name.replace(/[^\w]+/g, '');
                        name = name.substring(0, 1).toLowerCase() + name.substring(1);
                        info[name] = value;
                    };
                    if (navigator.userAgent.indexOf('MSIE') >= 0) {
                        try {
                            ctx = window['WebGLHelper'].CreateGLContext(cvs, 'canvas');
                        }
                        catch (e) { }
                    }
                    else {
                        for (var i = 0; i < contextNames.length; i++) {
                            try {
                                ctx = cvs.getContext(contextNames[i]);
                                if (ctx) {
                                    addLine('main', 'Context Name', contextNames[i]);
                                    break;
                                }
                            }
                            catch (e) { }
                        }
                    }
                    this._detected.supported = !!ctx;
                    addLine('main', 'Platform', navigator.platform);
                    addLine('main', 'Agent', navigator.userAgent);
                    if (ctx) {
                        addLine('main', 'Vendor', getParam(ctx.VENDOR));
                        addLine('main', 'Version', getParam(ctx.VERSION));
                        addLine('main', 'Renderer', getParam(ctx.RENDERER));
                        addLine('main', 'Shading Language Version', getParam(ctx.SHADING_LANGUAGE_VERSION));
                        addLine('bits', 'Rgba Bits', getParam(ctx.RED_BITS) + ', ' + getParam(ctx.GREEN_BITS) + ', ' + getParam(ctx.BLUE_BITS) + ', ' + getParam(ctx.ALPHA_BITS));
                        addLine('bits', 'Depth Bits', getParam(ctx.DEPTH_BITS));
                        addLine('shader', 'Max Vertex Attribs', getParam(ctx.MAX_VERTEX_ATTRIBS));
                        addLine('shader', 'Max Vertex Texture Image Units', getParam(ctx.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
                        addLine('shader', 'Max Varying Vectors', getParam(ctx.MAX_VARYING_VECTORS));
                        addLine('shader', 'Max Uniform Vectors', getParam(ctx.MAX_VERTEX_UNIFORM_VECTORS));
                        addLine('tex', 'Max Combined Texture Image Units', getParam(ctx.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
                        addLine('tex', 'Max Texture Size', getParam(ctx.MAX_TEXTURE_SIZE));
                        addLine('tex', 'Max Cube Map Texture Size', getParam(ctx.MAX_CUBE_MAP_TEXTURE_SIZE));
                        addLine('tex', 'Num. Compressed Texture Formats', getParam(ctx.COMPRESSED_TEXTURE_FORMATS));
                        addLine('misc', 'Max Render Buffer Size', getParam(ctx.MAX_RENDERBUFFER_SIZE));
                        addLine('misc', 'Max Viewport Dimensions', getParam(ctx.MAX_VIEWPORT_DIMS));
                        addLine('misc', 'Aliased Line Width Range', getParam(ctx.ALIASED_LINE_WIDTH_RANGE));
                        addLine('misc', 'Aliased Point Size Range', getParam(ctx.ALIASED_POINT_SIZE_RANGE));
                        addLine('misc', 'Supported Extensions', ctx.getSupportedExtensions() || []);
                    }
                }
                get info() {
                    return this._detected.info;
                }
                get supported() {
                    return this._detected.supported;
                }
            }
            Drawing3D.Pacem3DDetector = Pacem3DDetector;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Drawing3D;
    (function (Drawing3D) {
        class NodeGeometry {
            constructor(positions = []) {
                this.positions = positions;
            }
            barycenter() {
                const positions = this.positions;
                var bary = { x: 0, y: 0, z: 0 };
                if (!Pacem.Utils.isNullOrEmpty(positions)) {
                    var count = positions.length;
                    for (var i = 0; i < positions.length; i++) {
                        var pt = positions[i];
                        bary.x += pt.x;
                        bary.y += pt.y;
                        bary.z += pt.z;
                    }
                    var countDbl = 1.0 * count;
                    bary.x /= countDbl;
                    bary.y /= countDbl;
                    bary.z /= countDbl;
                }
                return bary;
            }
        }
        Drawing3D.NodeGeometry = NodeGeometry;
        class LineGeometry extends NodeGeometry {
        }
        Drawing3D.LineGeometry = LineGeometry;
        class MeshGeometry extends NodeGeometry {
            constructor(positions, triangleIndices, textureCoordinates = [], normals = []) {
                super(positions);
                this.triangleIndices = triangleIndices;
                this.textureCoordinates = textureCoordinates;
                this.normals = normals;
            }
        }
        Drawing3D.MeshGeometry = MeshGeometry;
    })(Drawing3D = Pacem.Drawing3D || (Pacem.Drawing3D = {}));
})(Pacem || (Pacem = {}));
/// <reference path="converters.ts" />
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-numerical.d.ts" />
var Pacem;
(function (Pacem) {
    var Drawing3D;
    (function (Drawing3D) {
        var _UI3DEvent_point;
        function isStage(object) {
            return !Pacem.Utils.isNull(object) && 'render' in object && typeof object['render'] === 'function';
        }
        Drawing3D.isStage = isStage;
        function isRenderable(object) {
            return !Pacem.Utils.isNull(object) && 'stage' in object && isStage(object['stage']);
        }
        Drawing3D.isRenderable = isRenderable;
        function isUi3DObject(object) {
            return 'transformMatrix' in object && isRenderable(object);
        }
        Drawing3D.isUi3DObject = isUi3DObject;
        function isMesh(object) {
            return isUi3DObject(object) && 'geometry' in object;
        }
        Drawing3D.isMesh = isMesh;
        function isGroup(object) {
            return isUi3DObject(object) && 'items' in object && !Pacem.Utils.isNullOrEmpty(object['items']);
        }
        Drawing3D.isGroup = isGroup;
        /**
         * Sets the normals to a mesh geometry by computing each face's unit orthogonal vector.
         * @param geometry
         */
        function computeSharpVertexNormals(geometry) {
            const normals = [];
            if (!Pacem.Utils.isNullOrEmpty(geometry)) {
                const indices = geometry.triangleIndices;
                if (indices.length % 3 !== 0) {
                    throw new RangeError(`Invalid mesh geometry: ${indices.length} is not multiple of 3.`);
                }
                for (let j = 2; j < indices.length; j += 3) {
                    const u = indices[j - 2], v = indices[j - 1], w = indices[j];
                    const a = geometry.positions[u], b = geometry.positions[v], c = geometry.positions[w];
                    const vAB = Pacem.Geometry.LinearAlgebra.Vector3D.subtract(a, b), vAC = Pacem.Geometry.LinearAlgebra.Vector3D.subtract(a, c);
                    const orthogonal = Pacem.Geometry.LinearAlgebra.Vector3D.cross(vAC, vAB), normal = Pacem.Geometry.LinearAlgebra.Vector3D.unit(orthogonal);
                    normals.push(normal, normal, normal);
                }
            }
            geometry.normals = normals;
        }
        Drawing3D.computeSharpVertexNormals = computeSharpVertexNormals;
        class UI3DEvent extends Pacem.CustomUIEvent {
            constructor(type, eventInit, originalEvent, point) {
                super(type, eventInit, originalEvent);
                _UI3DEvent_point.set(this, void 0);
                __classPrivateFieldSet(this, _UI3DEvent_point, point, "f");
            }
            /** Gets the event's source position in 3d coordinates. */
            get point() {
                return __classPrivateFieldGet(this, _UI3DEvent_point, "f");
            }
        }
        _UI3DEvent_point = new WeakMap();
        Drawing3D.UI3DEvent = UI3DEvent;
        class DragEvent extends UI3DEvent {
        }
        Drawing3D.DragEvent = DragEvent;
        class RenderableEvent extends UI3DEvent {
            constructor(type, args, originalEvent, p) {
                super(type, { detail: args, bubbles: true, cancelable: true }, originalEvent, p);
            }
        }
        Drawing3D.RenderableEvent = RenderableEvent;
    })(Drawing3D = Pacem.Drawing3D || (Pacem.Drawing3D = {}));
})(Pacem || (Pacem = {}));
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            var _RenderableElement_staleFlags;
            Drawing3D.TAG_MIDDLE_NAME = "3d";
            Drawing3D.DEG2RAD = Math.PI / 180;
            const ThreeDConsts = {
                OBJECT_SELECTOR: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-object',
                LIGHT_SELECTOR: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-light',
                CAMERA_SELECTOR: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-camera',
                LINE_SELECTOR: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-line',
                MESH_SELECTOR: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-mesh',
                GROUP_SELECTOR: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-group',
                DEFAULT_COORDS: { x: 0, y: 0, z: 0 }
            };
            let StalePropertyFlag;
            (function (StalePropertyFlag) {
                StalePropertyFlag["Position"] = "position";
                StalePropertyFlag["Transform"] = "transform";
                StalePropertyFlag["Geometry"] = "geometry";
                StalePropertyFlag["Children"] = "children";
                StalePropertyFlag["Material"] = "material";
                StalePropertyFlag["Light"] = "light";
                StalePropertyFlag["Camera"] = "camera";
            })(StalePropertyFlag = Drawing3D.StalePropertyFlag || (Drawing3D.StalePropertyFlag = {}));
            ;
            class RenderableElement extends Components.PacemCrossItemsContainerElement {
                constructor() {
                    super(...arguments);
                    _RenderableElement_staleFlags.set(this, []);
                    this.position = ThreeDConsts.DEFAULT_COORDS;
                }
                validate(_) {
                    // by default no children allowed (Group will except)
                    return false;
                }
                findContainer() {
                    // override
                    return this.parent || this.stage;
                }
                get stage() {
                    return this['_scene'] = this['_scene'] || Pacem.CustomElementUtils.findAncestorOfType(this, Drawing3D.Pacem3DElement);
                }
                get parent() {
                    return this['_drawableParent'] = this['_drawableParent'] || Pacem.CustomElementUtils.findAncestor(this, i => i instanceof RenderableElement);
                }
                get flags() {
                    return __classPrivateFieldGet(this, _RenderableElement_staleFlags, "f");
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
                            this.setAsDirty();
                            break;
                        case 'items':
                            this.setAsDirty(StalePropertyFlag.Children);
                            break;
                        case 'position':
                            this.setAsDirty(StalePropertyFlag.Position);
                            break;
                    }
                }
                /** Calls for a redraw of the current element in the next rendering process. */
                setAsDirty(...flags) {
                    var _a;
                    // set the flags that identify the stale part of the object to be updated.
                    for (let flag of flags) {
                        if (!this.flags.includes(flag)) {
                            this.flags.push(flag);
                        }
                    }
                    (_a = this.stage) === null || _a === void 0 ? void 0 : _a.render(this);
                }
            }
            _RenderableElement_staleFlags = new WeakMap();
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.Drawing3D.Point3DConverter })
            ], RenderableElement.prototype, "position", void 0);
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true, converter: Pacem.PropertyConverters.String })
            ], RenderableElement.prototype, "tag", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], RenderableElement.prototype, "inert", void 0);
            Drawing3D.RenderableElement = RenderableElement;
            class Ui3DElement extends RenderableElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'transformMatrix':
                            this.setAsDirty(StalePropertyFlag.Transform);
                            break;
                        case 'rotate':
                        case 'scaleX':
                        case 'scaleY':
                        case 'translateX':
                        case 'translateY':
                            this._computeTransformMatrix();
                            break;
                    }
                }
                _computeTransformMatrix() {
                    const m = Pacem.Utils.isNull(this.rotate) ?
                        Pacem.Geometry.LinearAlgebra.Matrix3D.identity() :
                        Pacem.Geometry.LinearAlgebra.Quaternion.toRotationMatrix(this.rotate);
                    if (this.translateX) {
                        m.offsetX = this.translateX;
                    }
                    if (this.translateY) {
                        m.offsetY = this.translateY;
                    }
                    if (this.translateZ) {
                        m.offsetZ = this.translateZ;
                    }
                    if (this.scaleX) {
                        m.m11 = this.scaleX;
                    }
                    if (this.scaleY) {
                        m.m22 = this.scaleY;
                    }
                    if (this.scaleZ) {
                        m.m33 = this.scaleZ;
                    }
                    this.transformMatrix = m;
                }
            }
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.Drawing3D.QuaternionConverter })
            ], Ui3DElement.prototype, "rotate", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], Ui3DElement.prototype, "scaleX", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], Ui3DElement.prototype, "scaleY", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], Ui3DElement.prototype, "scaleZ", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], Ui3DElement.prototype, "translateX", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], Ui3DElement.prototype, "translateY", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], Ui3DElement.prototype, "translateZ", void 0);
            __decorate([
                Pacem.Watch({ emit: false })
            ], Ui3DElement.prototype, "transformMatrix", void 0);
            Drawing3D.Ui3DElement = Ui3DElement;
            let Pacem3DGroupElement = class Pacem3DGroupElement extends Ui3DElement {
                validate(child) {
                    // overrides default denial
                    return child instanceof RenderableElement;
                }
            };
            Pacem3DGroupElement = __decorate([
                Pacem.CustomElement({ tagName: ThreeDConsts.GROUP_SELECTOR })
            ], Pacem3DGroupElement);
            Drawing3D.Pacem3DGroupElement = Pacem3DGroupElement;
            let Pacem3DMeshElement = class Pacem3DMeshElement extends Ui3DElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'geometry':
                            this.setAsDirty(StalePropertyFlag.Geometry);
                            break;
                        case 'material':
                        case 'backMaterial':
                            this.setAsDirty(StalePropertyFlag.Material);
                            break;
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], Pacem3DMeshElement.prototype, "geometry", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], Pacem3DMeshElement.prototype, "material", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], Pacem3DMeshElement.prototype, "backMaterial", void 0);
            Pacem3DMeshElement = __decorate([
                Pacem.CustomElement({ tagName: ThreeDConsts.MESH_SELECTOR })
            ], Pacem3DMeshElement);
            Drawing3D.Pacem3DMeshElement = Pacem3DMeshElement;
            let Pacem3DObjectElement = class Pacem3DObjectElement extends Ui3DElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'content' || name === 'type') {
                        this.setAsDirty(StalePropertyFlag.Geometry, StalePropertyFlag.Material);
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false })
            ], Pacem3DObjectElement.prototype, "content", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], Pacem3DObjectElement.prototype, "type", void 0);
            Pacem3DObjectElement = __decorate([
                Pacem.CustomElement({ tagName: ThreeDConsts.OBJECT_SELECTOR })
            ], Pacem3DObjectElement);
            Drawing3D.Pacem3DObjectElement = Pacem3DObjectElement;
            let Pacem3DLightElement = class Pacem3DLightElement extends RenderableElement {
                constructor() {
                    super(...arguments);
                    this.intensity = .25;
                    this.target = ThreeDConsts.DEFAULT_COORDS;
                    this.color = '#fff';
                    this.type = 'omni';
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'type':
                        case 'color':
                        case 'intensity':
                        case 'target':
                            this.setAsDirty(StalePropertyFlag.Light);
                            break;
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], Pacem3DLightElement.prototype, "intensity", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.Drawing3D.Point3DConverter })
            ], Pacem3DLightElement.prototype, "target", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], Pacem3DLightElement.prototype, "color", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], Pacem3DLightElement.prototype, "type", void 0);
            Pacem3DLightElement = __decorate([
                Pacem.CustomElement({ tagName: ThreeDConsts.LIGHT_SELECTOR })
            ], Pacem3DLightElement);
            Drawing3D.Pacem3DLightElement = Pacem3DLightElement;
            let Pacem3DCameraElement = class Pacem3DCameraElement extends RenderableElement {
                constructor() {
                    super(...arguments);
                    this.fov = 45;
                    this.aspect = 1.78;
                    this.near = 0.1;
                    this.far = 1000.0;
                    this.type = 'perspective';
                    this.lookAt = ThreeDConsts.DEFAULT_COORDS;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'fov':
                        case 'aspect':
                        case 'near':
                        case 'far':
                        case 'type':
                        case 'lookAt':
                            this.setAsDirty(StalePropertyFlag.Camera);
                            break;
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], Pacem3DCameraElement.prototype, "fov", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], Pacem3DCameraElement.prototype, "aspect", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], Pacem3DCameraElement.prototype, "near", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], Pacem3DCameraElement.prototype, "far", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], Pacem3DCameraElement.prototype, "type", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.Drawing3D.Point3DConverter })
            ], Pacem3DCameraElement.prototype, "lookAt", void 0);
            Pacem3DCameraElement = __decorate([
                Pacem.CustomElement({ tagName: ThreeDConsts.CAMERA_SELECTOR })
            ], Pacem3DCameraElement);
            Drawing3D.Pacem3DCameraElement = Pacem3DCameraElement;
            class Pacem3DAdapterElement extends Components.PacemEventTarget {
            }
            Drawing3D.Pacem3DAdapterElement = Pacem3DAdapterElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            var _Pacem3DElement_size;
            let Pacem3DElement = class Pacem3DElement extends Components.PacemItemsContainerElement {
                constructor() {
                    super(...arguments);
                    this._addHandler = (evt) => {
                        this._add(evt.target);
                    };
                    this._clickHandler = (evt) => {
                        let me = this;
                        if (!me.interactive || Pacem.Utils.isNull(me._lastHitResult)) {
                            return;
                        }
                        const type = evt.type.replace(/^mouse/, '');
                        const hit = me._lastHitResult, object = hit.object, point = hit.point;
                        this._itemDispatch(object, point, type, evt);
                    };
                    this._moveHandler = (evt) => {
                        var _a, _b;
                        let me = this;
                        if (!me.adapter || !me.interactive) {
                            return;
                        }
                        // what's really needed:
                        const rect = me._resizer.currentSize;
                        let result = me.adapter.raycast({ x: evt.pageX - rect.left, y: evt.pageY - rect.top }, rect);
                        // TODO: handle dragging
                        if (result != me._lastHitResult) {
                            if ((result === null || result === void 0 ? void 0 : result.object) != ((_a = me._lastHitResult) === null || _a === void 0 ? void 0 : _a.object)) {
                                const obj = result === null || result === void 0 ? void 0 : result.object, last = (_b = me._lastHitResult) === null || _b === void 0 ? void 0 : _b.object, pt = result === null || result === void 0 ? void 0 : result.point;
                                if (!Pacem.Utils.isNull(last)) {
                                    this._itemDispatch(last, pt, 'out', evt);
                                }
                                if (!Pacem.Utils.isNull(obj)) {
                                    this._itemDispatch(obj, pt, 'over', evt);
                                }
                            }
                            me._lastHitResult = result;
                        }
                    };
                    _Pacem3DElement_size.set(this, void 0);
                    this._resizeHandler = (evt) => {
                        const size = __classPrivateFieldSet(this, _Pacem3DElement_size, evt.detail, "f"); // { width: evt.detail.width, height: evt.detail.height };
                        const adapter = this.adapter;
                        if (!Pacem.Utils.isNull(adapter)) {
                            this.adapter.invalidateSize(size);
                            this.dispatchEvent(new Components.ResizeEvent(size));
                        }
                    };
                    //#endregion
                }
                validate(item) {
                    return item instanceof Drawing3D.RenderableElement;
                }
                get stage() {
                    return this._container;
                }
                get scene() {
                    return this.adapter && this.adapter.scene;
                }
                register(item) {
                    const retval = super.register(item);
                    if (retval) {
                        this._add(item);
                        item.addEventListener(Pacem.PropertyChangeEventName, this._addHandler, false);
                    }
                    return retval;
                }
                unregister(item) {
                    const retval = super.unregister(item);
                    if (retval) {
                        item.removeEventListener(Pacem.PropertyChangeEventName, this._addHandler, false);
                        this._erase(item);
                    }
                    return retval;
                }
                _add(item) {
                    this.adapter &&
                        this.adapter.addItem(item);
                }
                _erase(item) {
                    this.adapter &&
                        this.adapter.removeItem(item);
                }
                _initializeAdapter(old, val) {
                    return new Promise((resolve, _) => {
                        if (!Pacem.Utils.isNull(old)) {
                            this.items.forEach(i => old.removeItem(i));
                        }
                        if (!Pacem.Utils.isNull(this._container) && !Pacem.Utils.isNull(val)) {
                            val.initialize(this).then(_ => {
                                this.items.forEach(i => this._add(i));
                            }, e => {
                                this.log(Pacem.Logging.LogLevel.Error, e === null || e === void 0 ? void 0 : e.toString());
                            });
                        }
                        resolve();
                    });
                }
                //#region lifecycle
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (Pacem.Utils.isNull(this._container)) {
                        return;
                    }
                    if (name === 'adapter' && !first) {
                        this._initializeAdapter(old, val);
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    // stage
                    const container = this._container;
                    // resizer
                    const resizer = this._resizer;
                    resizer.addEventListener('resize', this._resizeHandler, false);
                    resizer.target = container;
                    // adapter
                    this._initializeAdapter(null, this.adapter).then(_ => {
                        container.addEventListener('mousemove', this._moveHandler, false);
                        container.addEventListener('click', this._clickHandler, false);
                        container.addEventListener('mouseup', this._clickHandler, false);
                        container.addEventListener('mousedown', this._clickHandler, false);
                        this.render();
                    });
                }
                _itemDispatch(target, point, type, offset) {
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
                        const m = point;
                        const evt = () => offset instanceof Event ? new Pacem.Drawing3D.RenderableEvent(evtType, target, originalEvent, m) : new Pacem.Drawing3D.DragEvent(evtType, { detail: dragArgs, cancelable: evtType === Pacem.UI.DragDropEventType.Init || evtType === Pacem.UI.DragDropEventType.Drag }, originalEvent, m), itemevt = offset instanceof Event ? new Pacem.Drawing3D.RenderableEvent('item' + evtType, target, originalEvent, m) : new Pacem.Drawing3D.DragEvent('item' + evtType, { detail: dragArgs, cancelable: evtType === Pacem.UI.DragDropEventType.Init || evtType === Pacem.UI.DragDropEventType.Drag }, originalEvent, m);
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
                disconnectedCallback() {
                    const resizer = this._resizer, container = this._container;
                    if (!Pacem.Utils.isNull(container)) {
                        container.removeEventListener('click', this._clickHandler, false);
                        container.removeEventListener('mouseup', this._clickHandler, false);
                        container.removeEventListener('mousedown', this._clickHandler, false);
                        container.removeEventListener('mousemove', this._moveHandler, false);
                    }
                    if (!Pacem.Utils.isNull(resizer)) {
                        resizer.removeEventListener('resize', this._resizeHandler, false);
                    }
                    super.disconnectedCallback();
                }
                get size() {
                    return __classPrivateFieldGet(this, _Pacem3DElement_size, "f");
                }
                render(item, deepUpdate) {
                    if (!Pacem.Utils.isNull(item)) {
                        const adapter = this.adapter;
                        if (!Pacem.Utils.isNull(adapter)) {
                            adapter.updateItem(item);
                        }
                    }
                    else {
                        requestAnimationFrame(() => this.render());
                        if (!this.disabled && !Pacem.Utils.isNull(this.adapter)) {
                            let cancelable = new CustomEvent('prerender', { detail: { scene: this.adapter.scene }, cancelable: true });
                            this.dispatchEvent(cancelable);
                            if (!cancelable.defaultPrevented) {
                                this.adapter.render();
                                this.dispatchEvent(new CustomEvent('render', { detail: { scene: this.adapter.scene } }));
                            }
                        }
                    }
                }
            };
            _Pacem3DElement_size = new WeakMap();
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], Pacem3DElement.prototype, "interactive", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], Pacem3DElement.prototype, "orbit", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Element })
            ], Pacem3DElement.prototype, "adapter", void 0);
            __decorate([
                Pacem.ViewChild(`.${Pacem.PCSS}-3d`)
            ], Pacem3DElement.prototype, "_container", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-resize')
            ], Pacem3DElement.prototype, "_resizer", void 0);
            Pacem3DElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME, shadow: Pacem.Defaults.USE_SHADOW_ROOT, template: `<${Pacem.P}-resize watch-position="true"></${Pacem.P}-resize><div class="${Pacem.PCSS}-3d"></div><${Pacem.P}-content></${Pacem.P}-content>`
                })
            ], Pacem3DElement);
            Drawing3D.Pacem3DElement = Pacem3DElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../types.ts" />
var Pacem;
(function (Pacem) {
    var Drawing3D;
    (function (Drawing3D) {
        let KnownShader;
        (function (KnownShader) {
            KnownShader["Basic"] = "basic";
            KnownShader["Lambert"] = "lambert";
            KnownShader["Phong"] = "phong";
            KnownShader["Standard"] = "standard";
            KnownShader["Line"] = "line";
        })(KnownShader = Drawing3D.KnownShader || (Drawing3D.KnownShader = {}));
        function isMaterial(obj) {
            return /*'color' in obj &&*/ 'shader' in obj;
        }
        Drawing3D.isMaterial = isMaterial;
        function isBasicMaterial(obj) {
            return isMaterial(obj) && obj.shader === KnownShader.Basic;
        }
        Drawing3D.isBasicMaterial = isBasicMaterial;
        function isLineMaterial(obj) {
            return isMaterial(obj) && obj.shader === KnownShader.Line;
        }
        Drawing3D.isLineMaterial = isLineMaterial;
        function isLambertMaterial(obj) {
            return isMaterial(obj) && obj.shader === KnownShader.Lambert;
        }
        Drawing3D.isLambertMaterial = isLambertMaterial;
        function isPhongMaterial(obj) {
            return isMaterial(obj) && obj.shader === KnownShader.Phong;
        }
        Drawing3D.isPhongMaterial = isPhongMaterial;
        function isStandardMaterial(obj) {
            return isMaterial(obj) && obj.shader === KnownShader.Standard;
        }
        Drawing3D.isStandardMaterial = isStandardMaterial;
    })(Drawing3D = Pacem.Drawing3D || (Pacem.Drawing3D = {}));
})(Pacem || (Pacem = {}));
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            var _MaterialElement_shader;
            class MaterialElement extends Components.PacemEventTarget {
                constructor(shader) {
                    super();
                    _MaterialElement_shader.set(this, void 0);
                    __classPrivateFieldSet(this, _MaterialElement_shader, shader, "f");
                }
                get shader() {
                    return __classPrivateFieldGet(this, _MaterialElement_shader, "f");
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first) {
                        switch (name) {
                            case 'opacity':
                            case 'wireframe':
                            case 'color':
                            case 'visible':
                            case 'map':
                                this.updateMaterial();
                                break;
                        }
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this.updateMaterial();
                }
                updateMaterial() {
                    this.material = this.createMaterial();
                }
                createMaterial() {
                    var _a, _b, _c;
                    return {
                        opacity: (_a = this.opacity) !== null && _a !== void 0 ? _a : 1.0,
                        wireframe: (_b = this.wireframe) !== null && _b !== void 0 ? _b : false,
                        color: this.color || Pacem.Utils.Css.getVariableValue(`--${Pacem.PCSS}-color-primary`),
                        visible: (_c = this.visible) !== null && _c !== void 0 ? _c : true,
                        map: this.map,
                        shader: this.shader
                    };
                }
            }
            _MaterialElement_shader = new WeakMap();
            __decorate([
                Pacem.Watch()
            ], MaterialElement.prototype, "material", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], MaterialElement.prototype, "opacity", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], MaterialElement.prototype, "wireframe", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], MaterialElement.prototype, "color", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], MaterialElement.prototype, "visible", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], MaterialElement.prototype, "map", void 0);
            Drawing3D.MaterialElement = MaterialElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../../dist/js/pacem-core.d.ts" />
/// <reference path="../types.ts" />
/// <reference path="../materials/material.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            function isMeshGeometry(obj) {
                return 'positions' in obj && Pacem.Utils.isArray(obj.positions)
                    && 'triangleIndices' in obj && Pacem.Utils.isArray(obj.triangleIndices);
            }
            function isVector3D(obj) {
                return 'x' in obj && typeof obj.x === 'number'
                    && 'y' in obj && typeof obj.y === 'number'
                    && 'z' in obj && typeof obj.z === 'number';
            }
            function flattenVectorArray(array) {
                const retval = [];
                for (let v of array) {
                    if (isVector3D(v)) {
                        retval.push(v.x, v.y, v.z);
                    }
                    else {
                        retval.push(v.x, v.y);
                    }
                }
                return retval;
            }
            const threeJsVersion = '0.128.0';
            const consts = {
                VERSION: threeJsVersion,
                API_URI: `https://unpkg.com/three@${threeJsVersion}/build/three.js`,
                ORBIT_URI: `https://unpkg.com/three@${threeJsVersion}/examples/js/controls/OrbitControls.js`,
                LOADERS: [
                //`https://unpkg.com/three@${threeJsVersion}/examples/js/loaders/OBJLoader.js`,
                //`https://unpkg.com/three@${threeJsVersion}/examples/js/loaders/MTLLoader.js`,
                ],
                DEFAULT_MATERIAL: function () {
                    return new THREE.MeshStandardMaterial({ color: '#069', flatShading: true });
                }
            };
            function matrix3DToMatrix4(m) {
                const matrix = new THREE.Matrix4();
                matrix.set(m.m11, m.m12, m.m13, m.m14, m.m21, m.m22, m.m23, m.m24, m.m31, m.m32, m.m33, m.m34, m.offsetX, m.offsetY, m.offsetZ, m.m44);
                return matrix;
            }
            function flattenMatrix3D(m) {
                return [
                    // right way to translate the matrix3D to matrix4
                    m.m11, m.m21, m.m31, m.offsetX,
                    m.m12, m.m22, m.m32, m.offsetY,
                    m.m13, m.m23, m.m33, m.offsetZ,
                    m.m14, m.m24, m.m34, m.m44,
                ];
            }
            function nodeGeometryToBufferGeometry(mesh) {
                const geometry = new THREE.BufferGeometry();
                const vertices = flattenVectorArray(mesh.positions);
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                if (mesh instanceof Pacem.Drawing3D.MeshGeometry) {
                    if (!Pacem.Utils.isNullOrEmpty(mesh.triangleIndices)) {
                        geometry.setIndex(mesh.triangleIndices);
                    }
                    const vertices = flattenVectorArray(mesh.positions);
                    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                    const uvs = flattenVectorArray(mesh.textureCoordinates);
                    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
                    if (Pacem.Utils.isNullOrEmpty(mesh.normals)) {
                        geometry.computeVertexNormals();
                    }
                    else {
                        const normals = flattenVectorArray(mesh.normals);
                        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
                    }
                }
                return geometry;
            }
            function lightToLight(item) {
                var light;
                switch (item.type) {
                    case 'spot':
                        const spotLight = new THREE.SpotLight();
                        spotLight.target.position.set(item.target.x, item.target.y, item.target.z);
                        light = spotLight;
                        break;
                    default:
                        light = new THREE.PointLight();
                        break;
                }
                return light;
            }
            function materialToMaterial(material) {
                var _a, _b, _c, _d, _e, _f, _g;
                if (Pacem.Utils.isNull(material)) {
                    return null;
                }
                const lineBase = {
                    color: material.color,
                    opacity: (_a = material.opacity) !== null && _a !== void 0 ? _a : 1,
                    transparent: true,
                    wireframe: (_b = material.wireframe) !== null && _b !== void 0 ? _b : false,
                    visible: (_c = material.visible) !== null && _c !== void 0 ? _c : true
                };
                const base = Pacem.Utils.extend({}, lineBase, { wireframe: (_d = material.wireframe) !== null && _d !== void 0 ? _d : false });
                const mipMapMaterial = (m) => {
                    if (material.map) {
                        m['map'] = new THREE.TextureLoader().load(material.map, _ => {
                            // console.log('texture loaded!');
                            m.needsUpdate = true;
                        });
                    }
                    return m;
                };
                if (Pacem.Drawing3D.isStandardMaterial(material)) {
                    const std = mipMapMaterial(new THREE.MeshStandardMaterial(Pacem.Utils.extend(base, {
                        roughness: material.roughness,
                        metalness: material.metalness,
                        emissive: material.emissiveColor,
                        flatShading: material.flatShading,
                        refractionRatio: material.refractionRatio,
                    })));
                    return std;
                }
                else if (Pacem.Drawing3D.isPhongMaterial(material)) {
                    const phong = mipMapMaterial(new THREE.MeshPhongMaterial(Pacem.Utils.extend(base, {
                        shininess: material.shininess,
                        emissive: material.emissiveColor,
                        flatShading: material.flatShading,
                        specular: material.specularColor,
                        reflectivity: material.reflectivity,
                        refractionRatio: material.refractionRatio,
                    })));
                    return phong;
                }
                else if (Pacem.Drawing3D.isLambertMaterial(material)) {
                    const lambert = mipMapMaterial(new THREE.MeshLambertMaterial(Pacem.Utils.extend(base, {
                        emissive: material.emissiveColor,
                        reflectivity: material.reflectivity,
                        refractionRatio: material.refractionRatio,
                    })));
                    return lambert;
                }
                else if (Pacem.Drawing3D.isLineMaterial(material)) {
                    const dash = material.dashArray && material.dashArray[0] || null, gap = material.dashArray && material.dashArray.length > 1 && material.dashArray[1] || dash;
                    const lineMatOptions = Pacem.Utils.extend(lineBase, {
                        linecap: (_e = material.lineCap) !== null && _e !== void 0 ? _e : 'round',
                        linejoin: (_f = material.lineJoin) !== null && _f !== void 0 ? _f : 'round',
                        linewidth: (_g = material.lineWidth) !== null && _g !== void 0 ? _g : 1
                    });
                    return Pacem.Utils.isNullOrEmpty(material.dashArray) ?
                        new THREE.LineBasicMaterial(lineMatOptions)
                        : new THREE.LineDashedMaterial(Pacem.Utils.extend({ dashSize: dash, gapSize: gap }, lineMatOptions));
                }
                else if (Pacem.Drawing3D.isMaterial(material)) {
                    const basic = mipMapMaterial(new THREE.MeshBasicMaterial(base));
                    return basic;
                }
                else {
                    return null;
                }
            }
            function materialToMaterials(frontMaterial, backMaterial, multiAllowed) {
                // material
                const multi = multiAllowed;
                // composite
                const materials = [];
                // front mat
                const material = materialToMaterial(frontMaterial);
                if (!Pacem.Utils.isNull(material)) {
                    material.side = THREE.FrontSide;
                    materials.push(material);
                }
                // back mat
                if (!Pacem.Utils.isNull(backMaterial)) {
                    if (backMaterial == frontMaterial) {
                        material.side = THREE.DoubleSide;
                    }
                    else {
                        // multi-material
                        const backsideMaterial = materialToMaterial(backMaterial);
                        if (!Pacem.Utils.isNull(backsideMaterial)) {
                            backsideMaterial.side = THREE.BackSide;
                            materials.push(backsideMaterial);
                        }
                    }
                }
                return multi && materials.length > 1 ? materials : material;
            }
            function load(item) {
                var _a;
                if (!Pacem.Utils.isNullOrEmpty(item.content)) {
                    const type = (_a = item.type) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                    switch (type) {
                        case 'obj':
                            const obj = new THREE['OBJLoader']();
                            return obj.parse(item.content);
                        default:
                            const loader = new THREE.ObjectLoader();
                            return loader.parse(item.content);
                    }
                }
                else {
                    throw new Error('Missing content.');
                }
            }
            function meshType(geometry) {
                return geometry instanceof Pacem.Drawing3D.LineGeometry ? THREE.Line : THREE.Mesh;
            }
            function build(mesh) {
                if (Pacem.Utils.isNullOrEmpty(mesh.geometry)) {
                    return null;
                }
                const ctor = meshType(mesh.geometry);
                return new ctor();
            }
            function isTHREEAvailable() {
                return 'THREE' in window;
            }
            async function whenTHREEAvailable(...args) {
                const start = Date.now();
                var initialized = false;
                do {
                    initialized = isTHREEAvailable();
                    for (let pred of args) {
                        initialized && (initialized = pred());
                    }
                    if (!initialized) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                } while (!initialized && (Date.now() - start) < 30000);
                if (!initialized) {
                    throw new Error('The wait for THREE adapter initialization timed out.');
                }
            }
            let Pacem3DThreeAdapterElement = class Pacem3DThreeAdapterElement extends Drawing3D.Pacem3DAdapterElement {
                constructor() {
                    super(...arguments);
                    this._renderer = null;
                    this._camera = null;
                    this._scene = null;
                    this._orbitCtrls = null;
                    this._objects = new WeakMap();
                    this._dict = {};
                    this._orbitControlsDelegate = (_) => {
                    };
                    this._ensureAndRefresh = (item, object3D, parent) => {
                        object3D.matrixAutoUpdate = false;
                        // choose whether to render the object or not
                        if (object3D.visible = !item.hide) {
                            // the modeling part
                            // 1. pacem 3d mesh
                            if (Pacem.Drawing3D.isMesh(item)) {
                                let mesh3D = object3D;
                                if (item.flags.indexOf(Drawing3D.StalePropertyFlag.Geometry) >= 0) {
                                    mesh3D.geometry.dispose();
                                    // swap Line <-> Mesh according to the geometry
                                    const mesh3D2 = build(item);
                                    if (mesh3D2.constructor.name !== mesh3D.constructor.name) {
                                        parent.remove(object3D);
                                        delete this._dict[object3D.id];
                                        object3D = mesh3D = mesh3D2;
                                    }
                                    // /swap
                                    mesh3D.geometry = nodeGeometryToBufferGeometry(item.geometry);
                                }
                                if (item.flags.indexOf(Drawing3D.StalePropertyFlag.Material) >= 0) {
                                    if (Pacem.Utils.isArray(mesh3D.material)) {
                                        for (let m of mesh3D.material) {
                                            m.dispose();
                                        }
                                    }
                                    else {
                                        mesh3D.material.dispose();
                                    }
                                    mesh3D.material = materialToMaterials(item.material) || consts.DEFAULT_MATERIAL();
                                }
                            }
                            // 2. 3d 'native' object
                            else if (item instanceof Drawing3D.Pacem3DObjectElement
                                && (item.flags.indexOf(Drawing3D.StalePropertyFlag.Material) >= 0 || item.flags.indexOf(Drawing3D.StalePropertyFlag.Geometry) >= 0)) {
                                // swap reference
                                object3D.parent && object3D.parent.remove(object3D);
                                object3D = load(item);
                            }
                            // 3. grouping object
                            else if (item instanceof Drawing3D.Pacem3DGroupElement) {
                                if (item.flags.indexOf(Drawing3D.StalePropertyFlag.Children) >= 0) {
                                    // remove all children
                                    for (let j = object3D.children.length - 1; j >= 0; j--) {
                                        const child = object3D.children[j];
                                        object3D.remove(child);
                                    }
                                    // re-create
                                    for (let child of item.items) {
                                        this._addOrUpdateItem(child, object3D);
                                    }
                                }
                            }
                            // 4. light
                            else if (item instanceof Drawing3D.Pacem3DLightElement) {
                                const light = object3D;
                                if (item.flags.indexOf(Drawing3D.StalePropertyFlag.Light) >= 0) {
                                    light.color = new THREE.Color(item.color);
                                    light.intensity = item.intensity;
                                }
                            }
                            // the configuring part
                            let posv = item.position; // || new THREE.Vector3(0, 0, 0);
                            if (Pacem.Drawing3D.isUi3DObject(item)
                                && !Pacem.Utils.isNull(item.transformMatrix)
                                && (item.flags.indexOf(Drawing3D.StalePropertyFlag.Position) >= 0 || item.flags.indexOf(Drawing3D.StalePropertyFlag.Transform) >= 0)) {
                                const positionMatrix = Pacem.Geometry.LinearAlgebra.Matrix3D.from(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, posv.x, posv.y, posv.z, 1);
                                // item.transformMatrix is a local matrix thus
                                // prepend in the multiplication (i.e. FIRST apply transform THEN apply positioning)
                                const transformMatrix = Pacem.Geometry.LinearAlgebra.Matrix3D.multiply(item.transformMatrix, positionMatrix);
                                THREE.Matrix4.prototype.set.apply(object3D.matrix, flattenMatrix3D(transformMatrix));
                            }
                            else if (item.flags.indexOf(Drawing3D.StalePropertyFlag.Position) >= 0) {
                                object3D.position.set(posv.x, posv.y, posv.z);
                                object3D.updateMatrix();
                            }
                        }
                        object3D.userData = item.tag;
                        if (Pacem.Utils.isNull(parent.getObjectById(object3D.id))) {
                            parent.add(object3D);
                            this._dict[object3D.id] = item;
                        }
                        // clear flags
                        item.flags.splice(0);
                        return object3D;
                    };
                    //#endregion
                }
                dispose(scene) {
                    // do nothing
                }
                project(point3D) {
                    // check feasibility
                    if (Pacem.Utils.isNull(this._camera) || Pacem.Utils.isNull(this._stage))
                        return null;
                    //
                    const vector = new THREE.Vector3(point3D.x, point3D.y, point3D.z);
                    const width = this._stage.width, height = this._stage.height;
                    const widthHalf = width / 2, heightHalf = height / 2;
                    const point = vector.project(this._camera);
                    const x = (point.x * widthHalf) + widthHalf;
                    const y = -(point.y * heightHalf) + heightHalf;
                    return { x: x, y: y };
                }
                get scene() {
                    return this._scene;
                }
                raycast(point, size) {
                    if (isTHREEAvailable() && !Pacem.Utils.isNull(this._camera)) {
                        const camera = this._camera;
                        const vector = new THREE.Vector2((point.x / size.width) * 2 - 1, -(point.y / size.height) * 2 + 1);
                        const raycaster = new THREE.Raycaster();
                        raycaster.setFromCamera(vector, camera);
                        const intersects = raycaster.intersectObjects(this._scene.children, true);
                        let obj;
                        let intersection;
                        let j = 0;
                        while (intersects.length > j && (intersection = intersects[j++]) && (obj = intersection.object)) {
                            const item = this._dict[obj.id];
                            if (item.inert) {
                                continue;
                            }
                            const v = intersection.point, x = v.x, y = v.y, z = v.z, point = { x, y, z };
                            return { object: this._dict[obj.id], point };
                        }
                    }
                    return null;
                }
                // #region ABSTRACT IMPLEMENTATION
                async initialize(container) {
                    if (!Pacem.Utils.isNull(this._stage)) {
                        return this._stage;
                    }
                    this._3d = container;
                    const wrapper = container.stage;
                    const stage = this._stage = document.createElement('canvas');
                    wrapper.innerHTML = '';
                    wrapper.appendChild(stage);
                    await Pacem.CustomElementUtils.importjs(consts.API_URI);
                    await whenTHREEAvailable();
                    await Promise.all([Pacem.CustomElementUtils.importjs(consts.ORBIT_URI)]
                        .concat(consts.LOADERS.map(js => Pacem.CustomElementUtils.importjs(js))));
                    // here comes THREE.js
                    this._scene = new THREE.Scene();
                    // this._scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), consts.DEFAULT_MATERIAL()));
                    this.invalidateSize(container.size);
                    let w = this._stage.width, h = this._stage.height;
                    //if (!ctrl.renderer)
                    let parameters = {
                        canvas: stage, antialias: true, stencil: false, alpha: true //, clearAlpha: 1
                    };
                    this._renderer = new THREE.WebGLRenderer(parameters);
                    this._renderer.setSize(w, h);
                    this.orbit = container.orbit;
                    return stage;
                }
                _setCamera(cam) {
                    this._camera = cam;
                    this.invalidateSize(this._3d.size);
                    this._disposeOrbitControls();
                    // re-init
                    if (this.orbit) {
                        this._initOrbitControls();
                    }
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'orbit') {
                        if (val === true)
                            this._initOrbitControls();
                        else
                            this._disposeOrbitControls();
                    }
                }
                _initOrbitControls() {
                    const cam = this._camera;
                    if (Pacem.Utils.isNull(this._3d) || Pacem.Utils.isNull(cam)) {
                        return;
                    }
                    const controls = this._orbitCtrls = new THREE['OrbitControls'](cam, this._3d.stage);
                    controls.addEventListener('change', this._orbitControlsDelegate);
                }
                _disposeOrbitControls() {
                    const controls = this._orbitCtrls;
                    if (Pacem.Utils.isNull(controls)) {
                        return;
                    }
                    controls.removeEventListener('change', this._orbitControlsDelegate);
                    controls.dispose();
                }
                invalidateSize(size) {
                    if (!isTHREEAvailable() || Pacem.Utils.isNull(size)) {
                        return;
                    }
                    let w = size.width;
                    let h = size.height;
                    this._stage.width = w;
                    this._stage.height = h;
                    let camera = this._camera;
                    if (camera instanceof THREE.PerspectiveCamera) {
                        camera.aspect = w / h;
                        camera.updateProjectionMatrix();
                    }
                    if (this._renderer) {
                        this._renderer.setSize(w, h);
                    }
                }
                removeItem(item) {
                    const bag = this._objects;
                    const obj3d = bag.get(item);
                    if (!Pacem.Utils.isNull(obj3d)) {
                        this._scene.remove(obj3d);
                        delete this._dict[obj3d.id];
                        bag.delete(item);
                    }
                }
                updateItem(item) {
                    this._addOrUpdateItem(item);
                }
                addItem(item) {
                    this._addOrUpdateItem(item);
                }
                _addOrUpdateItem(item, parent = this._scene) {
                    if (!isTHREEAvailable() || Pacem.Utils.isNull(parent)) {
                        return;
                    }
                    if (item instanceof Drawing3D.Pacem3DCameraElement) {
                        if (item.type === 'perspective') {
                            var pcam;
                            if (this._camera instanceof THREE.PerspectiveCamera) {
                                var pcam = this._camera;
                            }
                            else {
                                pcam = new THREE.PerspectiveCamera();
                            }
                            const lookAtVector = new THREE.Vector3(item.lookAt.x, item.lookAt.y, item.lookAt.z);
                            pcam.lookAt(lookAtVector);
                            pcam.fov = item.fov;
                            pcam.aspect = item.aspect;
                            pcam.near = item.near;
                            pcam.far = item.far;
                            pcam.position.set(item.position.x, item.position.y, item.position.z);
                            //
                            this._setCamera(pcam);
                            //
                            const orbit = this._orbitCtrls;
                            if (!Pacem.Utils.isNull(orbit) && orbit.object === pcam) {
                                orbit.target = lookAtVector;
                                orbit.update();
                            }
                        }
                        else {
                            // cam not supported
                        }
                    }
                    else {
                        if (!this._objects.has(item)) {
                            // adding
                            const then = (object3D) => {
                                // clear flags
                                // item.flags.splice(0);
                                if (object3D) {
                                    object3D = this._ensureAndRefresh(item, object3D, parent);
                                    this._objects.set(item, object3D);
                                }
                                else {
                                    // object not built
                                    // throw?
                                }
                            };
                            // TODO: switch to interface matching
                            if (item instanceof Drawing3D.Pacem3DObjectElement) {
                                const mesh = load(item);
                                then(mesh);
                            }
                            else if (item instanceof Drawing3D.Pacem3DMeshElement) {
                                // beware! a change in the geometry could cause a change in the object3D type
                                const mesh = build(item);
                                then(mesh);
                            }
                            else if (item instanceof Drawing3D.Pacem3DLightElement) {
                                const light = lightToLight(item);
                                then(light);
                            }
                            else if (item instanceof Drawing3D.Pacem3DGroupElement) {
                                const group = new THREE.Group();
                                then(group);
                            }
                        }
                        else {
                            // updating
                            const obj = this._objects.get(item);
                            const objOut = this._ensureAndRefresh(item, obj, parent);
                            if (objOut != obj) {
                                this._objects.set(item, objOut);
                            }
                        }
                    }
                }
                render() {
                    if (this._camera) {
                        this._renderer.render(this._scene, this._camera);
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], Pacem3DThreeAdapterElement.prototype, "orbit", void 0);
            Pacem3DThreeAdapterElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-3d-three-adapter' })
            ], Pacem3DThreeAdapterElement);
            Drawing3D.Pacem3DThreeAdapterElement = Pacem3DThreeAdapterElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="material.ts" />
/// <reference path="../types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            let BasicMaterialElement = class BasicMaterialElement extends Drawing3D.MaterialElement {
                constructor() {
                    super(Pacem.Drawing3D.KnownShader.Basic);
                }
            };
            BasicMaterialElement = __decorate([
                Pacem.CustomElement({ tagName: `${Pacem.P}-${Drawing3D.TAG_MIDDLE_NAME}-material-basic` })
            ], BasicMaterialElement);
            Drawing3D.BasicMaterialElement = BasicMaterialElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="material.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            let LambertMaterialElement = class LambertMaterialElement extends Drawing3D.MaterialElement {
                constructor() {
                    super(Pacem.Drawing3D.KnownShader.Lambert);
                }
                createMaterial() {
                    var _a, _b;
                    return Pacem.Utils.extend({
                        emissiveColor: this.emissiveColor || '#000',
                        reflectivity: (_a = this.reflectivity) !== null && _a !== void 0 ? _a : 0,
                        refractionRatio: (_b = this.refractionRatio) !== null && _b !== void 0 ? _b : 0
                    }, super.createMaterial());
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first) {
                        switch (name) {
                            case 'emissiveColor':
                            case 'reflectivity':
                            case 'refractionRatio':
                                this.updateMaterial();
                                break;
                        }
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], LambertMaterialElement.prototype, "emissiveColor", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], LambertMaterialElement.prototype, "reflectivity", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], LambertMaterialElement.prototype, "refractionRatio", void 0);
            LambertMaterialElement = __decorate([
                Pacem.CustomElement({ tagName: `${Pacem.P}-${Drawing3D.TAG_MIDDLE_NAME}-material-lambert` })
            ], LambertMaterialElement);
            Drawing3D.LambertMaterialElement = LambertMaterialElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="material.ts" />
/// <reference path="../types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            let LineMaterialElement = class LineMaterialElement extends Drawing3D.MaterialElement {
                constructor() {
                    super(Pacem.Drawing3D.KnownShader.Line);
                }
                createMaterial() {
                    var _a, _b, _c;
                    return Pacem.Utils.extend({
                        lineWidth: (_a = this.lineWidth) !== null && _a !== void 0 ? _a : 1,
                        lineJoin: (_b = this.lineJoin) !== null && _b !== void 0 ? _b : 'round',
                        lineCap: (_c = this.lineCap) !== null && _c !== void 0 ? _c : 'round',
                        dashArray: this.dashArray,
                    }, super.createMaterial());
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], LineMaterialElement.prototype, "lineWidth", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], LineMaterialElement.prototype, "lineJoin", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], LineMaterialElement.prototype, "lineCap", void 0);
            __decorate([
                Pacem.Watch({
                    emit: false, converter: {
                        convert: (attr) => attr === null || attr === void 0 ? void 0 : attr.split(',').map(i => parseInt(i)).filter(i => !Number.isNaN(i)),
                        convertBack: (prop) => prop === null || prop === void 0 ? void 0 : prop.join(',')
                    }
                })
            ], LineMaterialElement.prototype, "dashArray", void 0);
            LineMaterialElement = __decorate([
                Pacem.CustomElement({ tagName: `${Pacem.P}-${Drawing3D.TAG_MIDDLE_NAME}-material-line` })
            ], LineMaterialElement);
            Drawing3D.LineMaterialElement = LineMaterialElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="material.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            let PhongMaterialElement = class PhongMaterialElement extends Drawing3D.MaterialElement {
                constructor() {
                    super(Pacem.Drawing3D.KnownShader.Phong);
                }
                createMaterial() {
                    var _a, _b, _c, _d;
                    return Pacem.Utils.extend({
                        emissiveColor: this.emissiveColor || '#000',
                        reflectivity: (_a = this.reflectivity) !== null && _a !== void 0 ? _a : 0,
                        refractionRatio: (_b = this.refractionRatio) !== null && _b !== void 0 ? _b : 0,
                        specularColor: this.specularColor || '#000',
                        shininess: (_c = this.shininess) !== null && _c !== void 0 ? _c : 0,
                        flatShading: (_d = this.flatShading) !== null && _d !== void 0 ? _d : true
                    }, super.createMaterial());
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first) {
                        switch (name) {
                            case 'emissiveColor':
                            case 'reflectivity':
                            case 'refractionRatio':
                            case 'specularColor':
                            case 'shininess':
                            case 'flatShading':
                                this.updateMaterial();
                                break;
                        }
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PhongMaterialElement.prototype, "emissiveColor", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PhongMaterialElement.prototype, "reflectivity", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PhongMaterialElement.prototype, "refractionRatio", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PhongMaterialElement.prototype, "specularColor", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PhongMaterialElement.prototype, "shininess", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PhongMaterialElement.prototype, "flatShading", void 0);
            PhongMaterialElement = __decorate([
                Pacem.CustomElement({ tagName: `${Pacem.P}-${Drawing3D.TAG_MIDDLE_NAME}-material-phong` })
            ], PhongMaterialElement);
            Drawing3D.PhongMaterialElement = PhongMaterialElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="material.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            let StandardMaterialElement = class StandardMaterialElement extends Drawing3D.MaterialElement {
                constructor() {
                    super(Pacem.Drawing3D.KnownShader.Standard);
                }
                createMaterial() {
                    var _a, _b, _c, _d;
                    return Pacem.Utils.extend({
                        emissiveColor: this.emissiveColor || '#000',
                        refractionRatio: (_a = this.refractionRatio) !== null && _a !== void 0 ? _a : 0,
                        metalness: (_b = this.metalness) !== null && _b !== void 0 ? _b : 0,
                        roughness: (_c = this.roughness) !== null && _c !== void 0 ? _c : 0,
                        flatShading: (_d = this.flatShading) !== null && _d !== void 0 ? _d : false
                    }, super.createMaterial());
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first) {
                        switch (name) {
                            case 'emissiveColor':
                            case 'roughness':
                            case 'metalness':
                            case 'refractionRatio':
                            case 'flatShading':
                                this.updateMaterial();
                                break;
                        }
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], StandardMaterialElement.prototype, "emissiveColor", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], StandardMaterialElement.prototype, "refractionRatio", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], StandardMaterialElement.prototype, "roughness", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], StandardMaterialElement.prototype, "metalness", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], StandardMaterialElement.prototype, "flatShading", void 0);
            StandardMaterialElement = __decorate([
                Pacem.CustomElement({ tagName: `${Pacem.P}-${Drawing3D.TAG_MIDDLE_NAME}-material-standard` })
            ], StandardMaterialElement);
            Drawing3D.StandardMaterialElement = StandardMaterialElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Drawing3D;
    (function (Drawing3D) {
        class OBJParser {
            static parse(content) {
                // vertices
                const vertices = [];
                const vParser = /^v((\s+-?[\d\.]+){3})/gm;
                let arr = vParser.exec(content);
                while (arr && arr.length) {
                    vertices.push(Drawing3D.Point3DConverter.convert(arr[1]));
                    arr = vParser.exec(content);
                }
                // uvmap
                const vt = [];
                const tParser = /^vt((\s+-?[\d\.]+){2})/gm;
                arr = tParser.exec(content);
                while (arr && arr.length) {
                    vt.push(Pacem.Point.parse(arr[1]));
                    arr = tParser.exec(content);
                }
                const uv = new Array(vt.length);
                // normals
                const vn = [];
                const nParser = /^vn((\s+-?[\d\.]+){3})/gm;
                arr = nParser.exec(content);
                while (arr && arr.length) {
                    vn.push(Drawing3D.Point3DConverter.convert(arr[1]));
                    arr = nParser.exec(content);
                }
                const normals = new Array(vn.length);
                const positions = [];
                const fParser = /^f((\s+([\d]+\/[\d]+\/[\d]+)){3,})/gm;
                arr = fParser.exec(content);
                while (arr && arr.length) {
                    const fjParser = /([\d]+)\/([\d]+)\/([\d]+)/g;
                    const face = arr[1];
                    let jArr = fjParser.exec(face);
                    let jIndex = 0;
                    var vIndex0, tIndex0, nIndex0;
                    var vIndex, tIndex, nIndex;
                    var index = positions.length;
                    while (jArr && jArr.length) {
                        if (jIndex > 2) {
                            // 4+ vertex-face
                            // but mesh only allows triangluar faces
                            // re-add(0)
                            positions.push(vertices[vIndex0]);
                            uv[index] = vt[tIndex0];
                            normals[index] = vn[nIndex0];
                            index++;
                            // re-add(last)
                            positions.push(vertices[vIndex]);
                            uv[index] = vt[tIndex];
                            normals[index] = vn[nIndex];
                            index++;
                        }
                        // OBJ indexes are 1-based
                        vIndex = parseInt(jArr[1]) - 1;
                        tIndex = parseInt(jArr[2]) - 1;
                        nIndex = parseInt(jArr[3]) - 1;
                        positions.push(vertices[vIndex]);
                        uv[index] = vt[tIndex];
                        normals[index] = vn[nIndex];
                        if (jIndex === 0) {
                            vIndex0 = vIndex;
                            tIndex0 = tIndex;
                            nIndex0 = nIndex;
                        }
                        jIndex++;
                        index++;
                        jArr = fjParser.exec(face);
                    }
                    // loop
                    arr = fParser.exec(content);
                }
                // faces
                return new Drawing3D.MeshGeometry(positions, [], uv, normals);
            }
        }
        class Parser3D {
            static parseGeometry(content, type) {
                switch (type.toLowerCase()) {
                    case 'obj':
                        return OBJParser.parse(content);
                    default:
                        throw new Error(`Type '${type}' is not supported.`);
                }
            }
        }
        __decorate([
            Pacem.Transformer('parse3D')
        ], Parser3D, "parseGeometry", null);
    })(Drawing3D = Pacem.Drawing3D || (Pacem.Drawing3D = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            class Pacem3DPrimitiveElement extends Components.PacemEventTarget {
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    if (Pacem.Utils.isNull(this.geometry)) {
                        this.geometry = this.createDefaultGeometry();
                    }
                }
            }
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], Pacem3DPrimitiveElement.prototype, "geometry", void 0);
            Drawing3D.Pacem3DPrimitiveElement = Pacem3DPrimitiveElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="primitive.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            var PacemBoxElement_1;
            let PacemBoxElement = PacemBoxElement_1 = class PacemBoxElement extends Drawing3D.Pacem3DPrimitiveElement {
                static createMeshGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {
                    const w = width || 1, h = height || 1, d = depth || 1, sw = widthSegments || 1, sh = heightSegments || 1, sd = depthSegments || 1;
                    const positions = [];
                    const uv = [];
                    const indices = [];
                    // populationg positions
                    for (var j = 0; j <= sh; j++) {
                        var y = h / 2.0 - h * (1.0 * j) / (1.0 * sh);
                        for (var k = 0; k <= sd; k++) {
                            var z = -d / 2.0 + d * (1.0 * k) / (1.0 * sd);
                            for (var i = 0; i <= sw; i++) {
                                var x = -w / 2.0 + w * (1.0 * i) / (1.0 * sw);
                                // add only surface nodes
                                if (i == 0 || i == sw || k == 0 || k == sd || j == 0 || j == sh)
                                    positions.push({ x, y, z });
                            }
                        }
                    }
                    var getPosIndex = function (x, y, z) {
                        var epsilon = .00001;
                        for (var i = 0; i < positions.length; i++) {
                            var pt = positions[i];
                            if (Math.abs(pt.x - x) < epsilon && Math.abs(pt.y - y) < epsilon && Math.abs(pt.z - z) < epsilon)
                                return i;
                        }
                        return -1;
                    };
                    var appendFace = function (c_1, c_2, c_3, c_4, u, v, u_next, v_next) {
                        indices.push(c_1);
                        indices.push(c_2);
                        indices.push(c_3);
                        indices.push(c_1);
                        indices.push(c_3);
                        indices.push(c_4);
                        uv.push({ x: u, y: v_next });
                        uv.push({ x: u_next, y: v_next });
                        uv.push({ x: u_next, y: v });
                        uv.push({ x: u, y: v_next });
                        uv.push({ x: u_next, y: v });
                        uv.push({ x: u, y: v });
                    };
                    // top face (1)
                    for (var k = 0; k < sd; k++) {
                        var y = h / 2.0;
                        var z = -d / 2.0 + d * (1.0 * k) / (1.0 * sd);
                        var z_next = -d / 2.0 + d * (1.0 * (k + 1)) / (1.0 * sd);
                        for (var i = 0; i < sw; i++) {
                            var x = -w / 2.0 + (1.0 * i) * w / (1.0 * sw);
                            var x_next = -w / 2.0 + (1.0 * (i + 1)) * w / (1.0 * sw);
                            // coord-indices + tex-coords
                            var c_1 = getPosIndex(x, y, z_next);
                            var c_2 = getPosIndex(x_next, y, z_next);
                            var c_3 = getPosIndex(x_next, y, z);
                            var c_4 = getPosIndex(x, y, z);
                            var u_next = (1.0 * (i + 1)) / (1.0 * sw);
                            var u = (1.0 * i) / (1.0 * sw);
                            var v_next = 1.0 - (1.0 * (k + 1)) / (1.0 * sd);
                            var v = 1.0 - (1.0 * k) / (1.0 * sd);
                            appendFace(c_1, c_2, c_3, c_4, u, v, u_next, v_next);
                        }
                    }
                    // back face (2)
                    for (var j = 0; j < sh; j++) {
                        var y = h / 2.0 - (1.0 * j) * h / (1.0 * sh);
                        var y_next = h / 2.0 - (j + 1.0) * h / (1.0 * sh);
                        var z = -d / 2.0;
                        for (var i = 0; i < sw; i++) {
                            var x = w / 2.0 - 1.0 * i * w / (1.0 * sw);
                            var x_next = w / 2.0 - (i + 1.0) * w / (1.0 * sw);
                            // coord-indices + tex-coords
                            var c_1 = getPosIndex(x, y_next, z);
                            var c_2 = getPosIndex(x_next, y_next, z);
                            var c_3 = getPosIndex(x_next, y, z);
                            var c_4 = getPosIndex(x, y, z);
                            var u_next = (i + 1.0) / (1.0 * sw);
                            var u = (1.0 * i) / (1.0 * sw);
                            var v_next = 1.0 - (j + 1.0) / (1.0 * sh);
                            var v = 1.0 - 1.0 * j / (1.0 * sh);
                            appendFace(c_1, c_2, c_3, c_4, u, v, u_next, v_next);
                        }
                    }
                    // left face (3)
                    for (var j = 0; j < sh; j++) {
                        var y = h / 2.0 - (1.0 * j) * h / (1.0 * sh);
                        var y_next = h / 2.0 - (j + 1.0) * h / (1.0 * sh);
                        var x = -w / 2.0;
                        for (var k = 0; k < sd; k++) {
                            var z = -d / 2.0 + k * d / (1.0 * sd);
                            var z_next = -d / 2.0 + (k + 1.0) * d / (1.0 * sd);
                            // coord-indices + tex-coords
                            var c_1 = getPosIndex(x, y_next, z);
                            var c_2 = getPosIndex(x, y_next, z_next);
                            var c_3 = getPosIndex(x, y, z_next);
                            var c_4 = getPosIndex(x, y, z);
                            var u_next = (k + 1.0) / (1.0 * sd);
                            var u = (1.0 * k) / (1.0 * sd);
                            var v_next = 1.0 - (j + 1.0) / (1.0 * sh);
                            var v = 1.0 - j / (1.0 * sh);
                            appendFace(c_1, c_2, c_3, c_4, u, v, u_next, v_next);
                        }
                    }
                    // front face (4)
                    for (var j = 0; j < sh; j++) {
                        var y = h / 2.0 - j * h / (1.0 * sh);
                        var y_next = h / 2.0 - (j + 1.0) * h / (1.0 * sh);
                        var z = d / 2.0;
                        for (var i = 0; i < sw; i++) {
                            var x = -w / 2.0 + i * w / (1.0 * sw);
                            var x_next = -w / 2.0 + (i + 1.0) * w / (1.0 * sw);
                            // coord-indices + tex-coords
                            var c_1 = getPosIndex(x, y_next, z);
                            var c_2 = getPosIndex(x_next, y_next, z);
                            var c_3 = getPosIndex(x_next, y, z);
                            var c_4 = getPosIndex(x, y, z);
                            var u_next = (i + 1.0) / (1.0 * sw);
                            var u = (1.0 * i) / (1.0 * sw);
                            var v_next = 1.0 - (j + 1.0) / (1.0 * sh);
                            var v = 1.0 - (1.0 * j) / (1.0 * sh);
                            appendFace(c_1, c_2, c_3, c_4, u, v, u_next, v_next);
                        }
                    }
                    // right face (5)
                    for (var j = 0; j < sh; j++) {
                        var y = h / 2.0 - j * h / (1.0 * sh);
                        var y_next = h / 2.0 - (j + 1.0) * h / (1.0 * sh);
                        var x = w / 2.0;
                        for (var k = 0; k < sd; k++) {
                            var z = d / 2.0 - k * d / (1.0 * sd);
                            var z_next = d / 2.0 - (k + 1.0) * d / (1.0 * sd);
                            // coord-indices + tex-coords
                            var c_1 = getPosIndex(x, y_next, z);
                            var c_2 = getPosIndex(x, y_next, z_next);
                            var c_3 = getPosIndex(x, y, z_next);
                            var c_4 = getPosIndex(x, y, z);
                            var u_next = (k + 1.0) / (1.0 * sd);
                            var u = (1.0 * k) / (1.0 * sd);
                            var v_next = 1.0 - (j + 1.0) / (1.0 * sh);
                            var v = 1.0 - (1.0 * j) / (1.0 * sh);
                            appendFace(c_1, c_2, c_3, c_4, u, v, u_next, v_next);
                        }
                    }
                    // bottom face (6)
                    for (var k = 0; k < sd; k++) {
                        var y = -h / 2.0;
                        var z = d / 2.0 - d * k / (1.0 * sd);
                        var z_next = d / 2.0 - d * (k + 1.0) / (1.0 * sd);
                        for (var i = 0; i < sw; i++) {
                            var x = -w / 2.0 + i * w / (1.0 * sw);
                            var x_next = -w / 2.0 + (i + 1.0) * w / (1.0 * sw);
                            // coord-indices + tex-coords
                            var c_1 = getPosIndex(x, y, z_next);
                            var c_2 = getPosIndex(x_next, y, z_next);
                            var c_3 = getPosIndex(x_next, y, z);
                            var c_4 = getPosIndex(x, y, z);
                            var u_next = (i + 1.0) / (1.0 * sw);
                            var u = (1.0 * i) / (1.0 * sw);
                            var v_next = 1.0 - (k + 1.0) / (1.0 * sd);
                            var v = 1.0 - (1.0 * k) / (1.0 * sd);
                            appendFace(c_1, c_2, c_3, c_4, u, v, u_next, v_next);
                        }
                    }
                    const geom = new Pacem.Drawing3D.MeshGeometry(positions, indices, uv);
                    Pacem.Drawing3D.computeSharpVertexNormals(geom);
                    return geom;
                }
                createDefaultGeometry() {
                    return PacemBoxElement_1.createMeshGeometry();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'width':
                        case 'height':
                        case 'depth':
                        case 'widthSegments':
                        case 'heightSegments':
                        case 'depthSegments':
                            this.geometry = PacemBoxElement_1.createMeshGeometry(this.width, this.height, this.depth, this.widthSegments, this.heightSegments, this.depthSegments);
                            break;
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemBoxElement.prototype, "width", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemBoxElement.prototype, "height", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemBoxElement.prototype, "depth", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemBoxElement.prototype, "widthSegments", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemBoxElement.prototype, "heightSegments", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemBoxElement.prototype, "depthSegments", void 0);
            PacemBoxElement = PacemBoxElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-primitive-box' })
            ], PacemBoxElement);
            Drawing3D.PacemBoxElement = PacemBoxElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="primitive.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            var PacemCylinderElement_1;
            let PacemCylinderElement = PacemCylinderElement_1 = class PacemCylinderElement extends Drawing3D.Pacem3DPrimitiveElement {
                static createMeshGeometry(radius, height, sides, heightSegments, capSegments) {
                    const r = radius || 1.0;
                    height || (height = 1.0);
                    sides || (sides = 18);
                    heightSegments || (heightSegments = 5);
                    capSegments || (capSegments = 1);
                    const nodes = [], uv = [], indices = [];
                    const theta = Drawing3D.DEG2RAD * (360.0 / sides);
                    // top & bottom vertices (pivot @(0,0,0))
                    nodes.push({ x: .0, y: height, z: .0 });
                    nodes.push({ x: .0, y: .0, z: .0 });
                    // ======================================
                    // cap loops
                    const capRadius = r / capSegments;
                    for (let j = 1; j <= capSegments; j++) {
                        //int j_prev = j - 1;
                        var rho = capRadius * j;
                        for (var i = 0; i < sides; i++) {
                            const startIndex = 2 + 2 * sides * (j - 1);
                            const A = i == 0 ? startIndex + 2 * (sides - 1) : startIndex + 2 * (i - 1);
                            const B = startIndex + 2 * i;
                            const u = Math.cos(theta * i);
                            const v = -Math.sin(theta * i);
                            const u_prev = Math.cos(theta * (i - 1.0));
                            const v_prev = -Math.sin(theta * (i - 1.0));
                            const x = rho * u;
                            const z = rho * v;
                            const topPoint = { x, y: height, z };
                            const bottomPoint = { x, y: .0, z };
                            // 
                            nodes.push(topPoint);
                            nodes.push(bottomPoint);
                            // coordinates & texture
                            const factor = .5 * rho / r;
                            const uB = u * factor;
                            const vB = v * factor;
                            const uA = u_prev * factor;
                            const vA = v_prev * factor;
                            if (j == 1) {
                                const faceIndicesTop = [0 /* top vertex*/, A, B];
                                const faceIndicesBottom = [1 /* bottom vertex*/, B + 1, A + 1];
                                // texture
                                const uvTop = [
                                    { x: .5, y: .5 },
                                    { x: .5 + uA, y: .5 - vA },
                                    { x: 0.5 + uB, y: .5 - vB }
                                ];
                                const uvBottom = [
                                    { x: .5, y: .5 },
                                    { x: 0.5 + uB, y: .5 + vB },
                                    { x: .5 + uA, y: .5 + vA }
                                ];
                                // faces
                                Array.prototype.push.apply(indices, faceIndicesTop);
                                Array.prototype.push.apply(indices, faceIndicesBottom);
                                // texture
                                for (let i = 0; i < uvTop.length; i++)
                                    uv.push(uvTop[i]);
                                for (let i = 0; i < uvBottom.length; i++)
                                    uv.push(uvBottom[i]);
                            }
                            else {
                                const startIndexPrevLoop = 2 + 2 * sides * (j - 2);
                                const D = i == 0 ? startIndexPrevLoop + 2 * (sides - 1) : startIndexPrevLoop + 2 * (i - 1);
                                const C = startIndexPrevLoop + 2 * i;
                                // coordinates & texture
                                const factor0 = .5 * ((j - 1.0) / capSegments);
                                const uC = u * factor0;
                                const vC = v * factor0;
                                const uD = u_prev * factor0;
                                const vD = v_prev * factor0;
                                const uvA = { x: .5 + uA, y: .5 - vA };
                                const uvB = { x: .5 + uB, y: .5 - vB };
                                const uvC = { x: .5 + uC, y: .5 - vC };
                                const uvD = { x: .5 + uD, y: .5 - vD };
                                const uvA2 = { x: .5 + uA, y: .5 + vA };
                                const uvB2 = { x: .5 + uB, y: .5 + vB };
                                const uvC2 = { x: .5 + uC, y: .5 + vC };
                                const uvD2 = { x: .5 + uD, y: .5 + vD };
                                // top
                                indices.push(A);
                                indices.push(B);
                                indices.push(D);
                                indices.push(D);
                                indices.push(B);
                                indices.push(C);
                                // bottom
                                indices.push(C + 1);
                                indices.push(B + 1);
                                indices.push(A + 1);
                                indices.push(C + 1);
                                indices.push(A + 1);
                                indices.push(D + 1);
                                // textures top
                                uv.push(uvA);
                                uv.push(uvB);
                                uv.push(uvD);
                                uv.push(uvD);
                                uv.push(uvB);
                                uv.push(uvC);
                                // texture bottom
                                uv.push(uvC2);
                                uv.push(uvB2);
                                uv.push(uvA2);
                                uv.push(uvC2);
                                uv.push(uvA2);
                                uv.push(uvD2);
                            }
                        }
                    }
                    // ======================================
                    // side loops
                    const sideStartIndex = 2 + 2 * sides * (capSegments);
                    const capLastIndex = 2 + 2 * sides * (capSegments - 1);
                    const fU = 1.0 / sides;
                    const fV = 1.0 / heightSegments;
                    for (let j = 1; j <= heightSegments; j++) {
                        for (let i = 0; i < sides; i++) {
                            if (j != heightSegments) {
                                var x = r * Math.cos(theta * i);
                                var z = -r * Math.sin(theta * i);
                                var y = (height * j) / heightSegments;
                                //
                                nodes.push({ x, y, z });
                            }
                            const i_prev = i == 0 ? sides - 1 : i - 1;
                            const A = j == 1 ? capLastIndex + 2 * i_prev + 1 : sideStartIndex + sides * (j - 2) + i_prev;
                            const B = j == 1 ? capLastIndex + 2 * i + 1 : sideStartIndex + sides * (j - 2) + i;
                            const C = j == heightSegments ? capLastIndex + 2 * i : sideStartIndex + sides * (j - 1) + i;
                            // const D = j == heightSegments ? capLastIndex + 2 * i_prev : sideStartIndex + sides * (j - 1) + i_prev;
                            const u_prev = i_prev * fU;
                            const v_prev = (j - 1) * fV;
                            const u = i == 0 ? 1.0 : i * fU;
                            const v = j * fV;
                            const uvA = { x: u_prev, y: v_prev };
                            const uvB = { x: u, y: v_prev };
                            const uvC = { x: u, y: v };
                            const uvD = { x: u_prev, y: v };
                            indices.push(A);
                            indices.push(B);
                            indices.push(C);
                            //
                            uv.push(uvA);
                            uv.push(uvB);
                            uv.push(uvC);
                            uv.push(uvA);
                            uv.push(uvC);
                            uv.push(uvD);
                        }
                    }
                    // put the whole thing together
                    return new Pacem.Drawing3D.MeshGeometry(nodes, indices, uv);
                }
                createDefaultGeometry() {
                    return PacemCylinderElement_1.createMeshGeometry();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'radius':
                        case 'height':
                        case 'sides':
                        case 'heightSegments':
                        case 'capSegments':
                            this.geometry = PacemCylinderElement_1.createMeshGeometry(this.radius, this.height, this.sides, this.heightSegments, this.capSegments);
                            break;
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemCylinderElement.prototype, "radius", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemCylinderElement.prototype, "height", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemCylinderElement.prototype, "sides", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemCylinderElement.prototype, "heightSegments", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemCylinderElement.prototype, "capSegments", void 0);
            PacemCylinderElement = PacemCylinderElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-primitive-cylinder' })
            ], PacemCylinderElement);
            Drawing3D.PacemCylinderElement = PacemCylinderElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="primitive.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            var PacemLineElement_1;
            const DEFAULT_LINE = [{ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }];
            let PacemLineElement = PacemLineElement_1 = class PacemLineElement extends Drawing3D.Pacem3DPrimitiveElement {
                static createLineGeometry(positions) {
                    return new Pacem.Drawing3D.LineGeometry(positions || DEFAULT_LINE);
                }
                createDefaultGeometry() {
                    return PacemLineElement_1.createLineGeometry();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'positions':
                            this.geometry = PacemLineElement_1.createLineGeometry(val);
                            break;
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemLineElement.prototype, "positions", void 0);
            PacemLineElement = PacemLineElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-primitive-line' })
            ], PacemLineElement);
            Drawing3D.PacemLineElement = PacemLineElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="primitive.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            var PacemPlaneElement_1;
            let PacemPlaneElement = PacemPlaneElement_1 = class PacemPlaneElement extends Drawing3D.Pacem3DPrimitiveElement {
                static createMeshGeometry(width, length, widthSegments, lengthSegments) {
                    width || (width = 1.0);
                    length || (length = 1.0);
                    widthSegments || (widthSegments = 4);
                    lengthSegments || (lengthSegments = 4);
                    const nodes = [];
                    const uv = [];
                    const indices = [];
                    const normals = [], normal = Pacem.Geometry.LinearAlgebra.Vector3D.from(0, 0, 1);
                    for (let j = 0; j <= lengthSegments; j++) {
                        for (let i = 0; i <= widthSegments; i++) {
                            const x = -width / 2.0 + i * width / (1.0 * widthSegments);
                            const y = .0;
                            const z = -length / 2.0 + j * length / (1.0 * lengthSegments);
                            nodes.push({ x, y, z });
                            if (j < lengthSegments && i < widthSegments) {
                                const rowPoints = widthSegments + 1;
                                // const colPoints = lengthSegments + 1;
                                const u_next = (i + 1.0) / (1.0 * widthSegments);
                                const u = (1.0 * i) / (1.0 * widthSegments);
                                const v_next = 1.0 - (j + 1.0) / (1.0 * lengthSegments);
                                const v = 1.0 - (1.0 * j) / (1.0 * lengthSegments);
                                indices.push((j + 1) * rowPoints + i);
                                indices.push((j + 1) * rowPoints + i + 1);
                                indices.push(j * rowPoints + i + 1);
                                indices.push((j + 1) * rowPoints + i);
                                indices.push(j * rowPoints + i + 1);
                                indices.push(j * rowPoints + i);
                                uv.push({ x: u, y: v_next });
                                uv.push({ x: u_next, y: v_next });
                                uv.push({ x: u_next, y: v });
                                uv.push({ x: u, y: v_next });
                                uv.push({ x: u_next, y: v });
                                uv.push({ x: u, y: v });
                                normals.push(normal, normal, normal, normal, normal, normal);
                            }
                        }
                    }
                    return new Pacem.Drawing3D.MeshGeometry(nodes, indices, uv, normals);
                }
                createDefaultGeometry() {
                    return PacemPlaneElement_1.createMeshGeometry();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'width':
                        case 'length':
                        case 'widthSegments':
                        case 'lengthSegments':
                            this.geometry = PacemPlaneElement_1.createMeshGeometry(this.width, this.length, this.widthSegments, this.lengthSegments);
                            break;
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemPlaneElement.prototype, "width", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemPlaneElement.prototype, "length", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemPlaneElement.prototype, "widthSegments", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemPlaneElement.prototype, "lengthSegments", void 0);
            PacemPlaneElement = PacemPlaneElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-primitive-plane' })
            ], PacemPlaneElement);
            Drawing3D.PacemPlaneElement = PacemPlaneElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="primitive.ts" />
/// <reference path="box.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            var PacemTetrahedronElement_1, PacemOctahedronElement_1, PacemHexahedronElement_1, PacemIcosahedronElement_1, PacemDodecahedronElement_1;
            const _utils = {
                parseFloats: function (input) {
                    const pattern = /([\d.-]+)/i;
                    var match = pattern.exec(input);
                    const ret = [];
                    while (match != null) {
                        const g = match[0];
                        const j = parseFloat(g);
                        ret.push(j);
                        input = input.replace(g, '');
                        match = pattern.exec(input);
                    }
                    return ret;
                }
            };
            const point3D = Pacem.Geometry.LinearAlgebra.Vector3D;
            class PolyhedronElement extends Drawing3D.Pacem3DPrimitiveElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'radius') {
                        this._assignMeshGeometry(val);
                    }
                }
                _assignMeshGeometry(radius) {
                    this.geometry = this.createMeshGeometry(radius > .0 ? radius : 1.0);
                }
                createDefaultGeometry() {
                    return this.createMeshGeometry(1.0);
                }
            }
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PolyhedronElement.prototype, "radius", void 0);
            Drawing3D.PolyhedronElement = PolyhedronElement;
            // #region Tetrahedron
            let PacemTetrahedronElement = PacemTetrahedronElement_1 = class PacemTetrahedronElement extends PolyhedronElement {
                static createMeshGeometry(radius) {
                    radius || (radius = 1.0);
                    const nodesCoordsString = "0 0.5774 -0.8165, 0 0.5774 0.8165, 0.8165 -0.5774 0, -0.8165 -0.5774 0";
                    const nodesToParse = nodesCoordsString.split(',');
                    const nodes = [];
                    for (let i = 0; i < nodesToParse.length; i++) {
                        const nodeToParse = nodesToParse[i];
                        const pt3D = _utils.parseFloats(nodeToParse);
                        nodes.push({ x: pt3D[0] * radius, y: pt3D[1] * radius, z: pt3D[2] * radius });
                    }
                    const indices = [1, 2, 0, 2, 3, 0, 3, 1, 0, 3, 2, 1];
                    const textureCoordsString = "0.5 0.9995, 0.5 0.0004995, 0.0004995 0.5, 0.9995 0.5,  0.5 0.0004995, 0.9995 0.5, 0.5 0.9995, 0.0004995 0.5,  0.9995 0.5, 0.5 0.9995, 0.0004995 0.5, 0.5 0.0004995";
                    const pointsToParse = textureCoordsString.split(',');
                    const texIndices = [4, 5, 6, 7, 8, 9, 10, 11, 0, 3, 2, 1];
                    const uv = [];
                    for (let i = 0; i < texIndices.length; i++) {
                        const ndx = texIndices[i];
                        const uvCoords = _utils.parseFloats(pointsToParse[ndx]);
                        uv.push({ x: uvCoords[0], y: uvCoords[1] });
                    }
                    const geom = new Pacem.Drawing3D.MeshGeometry(nodes, indices, uv);
                    Pacem.Drawing3D.computeSharpVertexNormals(geom);
                    return geom;
                }
                createMeshGeometry(radius = this.radius) {
                    return PacemTetrahedronElement_1.createMeshGeometry(radius);
                }
            };
            PacemTetrahedronElement = PacemTetrahedronElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-primitive-tetrahedron' })
            ], PacemTetrahedronElement);
            Drawing3D.PacemTetrahedronElement = PacemTetrahedronElement;
            // #endregion
            // #region Octahedron
            let PacemOctahedronElement = PacemOctahedronElement_1 = class PacemOctahedronElement extends PolyhedronElement {
                static createMeshGeometry(radius) {
                    radius || (radius = 1.0);
                    // -------------------------------------------------------------------------------------------------
                    const nodesCoordsString = "0 0.7071 -0.7071, 0 0.7071 0.7071, 1 0 0, 0 -0.7071 -0.7071, -1 0 0, 0 -0.7071 0.7071";
                    const indices = [1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1, 0, 4, 5, 1, 5, 2, 1, 2, 5, 3, 4, 3, 5];
                    const textureCoordsString = "0.5 0.9995, 0.5 0.9995, 0.0004995 0.5, 0.5 0.9995, 0.9995 0.5, 0.5 0.0004995, 0.5 0.0004995, 0.9995 0.5, 0.5 0.9995, 0.0004995 0.5, 0.5 0.0004995, 0.5 0.9995, 0.5 0.0004995, 0.9995 0.5, 0.5 0.9995, 0.0004995 0.5, 0.5 0.0004995, 0.0004995 0.5, 0.5 0.0004995, 0.5 0.9995, 0.5 0.0004995, 0.9995 0.5, 0.5 0.0004995, 0.5 0.9995";
                    const texIndices = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 0, 17, 18, 19, 20, 21, 1, 2, 22, 23, 4, 3, 5];
                    // -------------------------------------------------------------------------------------------------
                    const nodesToParse = nodesCoordsString.split(',');
                    const nodes = [];
                    for (let i = 0; i < nodesToParse.length; i++) {
                        const nodeToParse = nodesToParse[i];
                        const pt3D = _utils.parseFloats(nodeToParse);
                        nodes.push({ x: pt3D[0] * radius, y: pt3D[1] * radius, z: pt3D[2] * radius });
                    }
                    const pointsToParse = textureCoordsString.split(',');
                    const uv = [];
                    for (let i = 0; i < texIndices.length; i++) {
                        const ndx = texIndices[i];
                        const uvCoords = _utils.parseFloats(pointsToParse[ndx]);
                        uv.push({ x: uvCoords[0], y: uvCoords[1] });
                    }
                    const geom = new Pacem.Drawing3D.MeshGeometry(nodes, indices, uv);
                    Pacem.Drawing3D.computeSharpVertexNormals(geom);
                    return geom;
                }
                createMeshGeometry(radius = this.radius) {
                    return PacemOctahedronElement_1.createMeshGeometry(radius);
                }
            };
            PacemOctahedronElement = PacemOctahedronElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-primitive-octahedron' })
            ], PacemOctahedronElement);
            Drawing3D.PacemOctahedronElement = PacemOctahedronElement;
            // #endregion
            // #region Hexahedron
            let PacemHexahedronElement = PacemHexahedronElement_1 = class PacemHexahedronElement extends PolyhedronElement {
                static createMeshGeometry(radius) {
                    radius || (radius = 1.0);
                    const inv_sqrt3 = 1.0 / Math.sqrt(3.0);
                    const w = 2.0 * radius * inv_sqrt3;
                    return Pacem.Components.Drawing3D.PacemBoxElement.createMeshGeometry(w, w, w);
                }
                createMeshGeometry(radius = this.radius) {
                    return PacemHexahedronElement_1.createMeshGeometry(radius);
                }
            };
            PacemHexahedronElement = PacemHexahedronElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-primitive-hexahedron' })
            ], PacemHexahedronElement);
            Drawing3D.PacemHexahedronElement = PacemHexahedronElement;
            // #endregion
            // #region Icosahedron
            let PacemIcosahedronElement = PacemIcosahedronElement_1 = class PacemIcosahedronElement extends PolyhedronElement {
                static createMeshGeometry(radius) {
                    radius || (radius = 1.0);
                    const nodesCoordsString = "0 0.850651 -0.525731, 0 0.850651 0.525731, 0.850651 0.525731 0, 0.525731 0 -0.850651, -0.525731 0 -0.850651, -0.850651 0.525731 0, -0.525731 0 0.850651, 0.525731 0 0.850651, 0.850651 -0.525731 0, 0 -0.850651 0.525731, 0 -0.850651 -0.525731, -0.850651 -0.525731 0";
                    const indices = [1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 1, 0,
                        5, 6, 1, 6, 7, 1, 7, 2, 1, 2, 8, 3,
                        2, 7, 8, 6, 9, 7, 9, 8, 7, 8, 10, 3,
                        8, 9, 10, 6, 11, 9, 11, 10, 9, 10, 4, 3,
                        10, 11, 4, 6, 5, 11, 5, 4, 11];
                    const textureCoordsString = "0.5 0.808708, 0.5 0.999501, 0.5 0.808708, 0.191292 0.5,  " +
                        "0.000499547 0.5, 0.5 0.808708, 0.9995 0.5, 0.808708 0.5," +
                        "0.000499487 0.5, 0.5 0.191292, 0.5 0.000499487, 0.5 0.191292," +
                        "0.5 0.191292, 0.999501 0.5, 0.5 0.808708, 0.5 0.808708," +
                        "0.9995 0.5, 0.808708 0.999501, 0.191292 0.5, 0.808708 0.5," +
                        "0.5 0.999501, 0.808708 0.5, 0.999501 0.808708, 0.5 0.999501," +
                        "0.000499487 0.5, 0.5 0.191292, 0.5 0.808708, 0.9995 0.5," +
                        "0.808708 0.999501, 0.191292 0.5, 0.808708 0.5, 0.5 0.999501," +
                        "0.808708 0.5, 0.999501 0.808708, 0.5 0.808708, 0.5 0.191292," +
                        "0.9995 0.5, 0.000499547 0.5, 0.5 0.191292, 0.191292 0.5," +
                        "0.5 0.000499487, 0.808708 0.5, 0.5 0.000499487, 0.999501 0.191292," +
                        "0.5 0.191292, 0.808708 0.000499487, 0.9995 0.5, 0.5 0.191292," +
                        "0.5 0.808708, 0.9995 0.5, 0.5 0.191292, 0.808708 0.000499487," +
                        "0.999501 0.5, 0.5 0.808708, 0.5 0.000499487, 0.808708 0.5," +
                        "0.999501 0.191292, 0.808708 0.5, 0.5 0.808708, 0.5 0.191292";
                    const texIndices = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                        24, 25, 0, 26, 27, 28, 29, 30, 31, 32, 33, 1,
                        34, 35, 36, 2, 37, 38, 39, 40, 41, 42, 43, 7,
                        44, 45, 46, 8, 47, 48, 49, 50, 51, 52, 53, 9,
                        54, 55, 3, 10, 56, 57, 6, 58, 59, 5, 4, 11];
                    // -------------------------------------------------------------------------------------------------
                    const nodesToParse = nodesCoordsString.split(',');
                    const nodes = [];
                    for (let i = 0; i < nodesToParse.length; i++) {
                        const nodeToParse = nodesToParse[i];
                        const pt3D = _utils.parseFloats(nodeToParse);
                        nodes.push({ x: pt3D[0] * radius, y: pt3D[1] * radius, z: pt3D[2] * radius });
                    }
                    const pointsToParse = textureCoordsString.split(',');
                    const uv = [];
                    for (let i = 0; i < texIndices.length; i++) {
                        const ndx = texIndices[i];
                        const uvCoords = _utils.parseFloats(pointsToParse[ndx]);
                        uv.push({ x: uvCoords[0], y: uvCoords[1] });
                    }
                    const geom = new Pacem.Drawing3D.MeshGeometry(nodes, indices, uv);
                    Pacem.Drawing3D.computeSharpVertexNormals(geom);
                    return geom;
                }
                createMeshGeometry(radius = this.radius) {
                    return PacemIcosahedronElement_1.createMeshGeometry(radius);
                }
            };
            PacemIcosahedronElement = PacemIcosahedronElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-primitive-icosahedron' })
            ], PacemIcosahedronElement);
            Drawing3D.PacemIcosahedronElement = PacemIcosahedronElement;
            // #endregion
            // #region Dodecahedron
            let PacemDodecahedronElement = PacemDodecahedronElement_1 = class PacemDodecahedronElement extends PolyhedronElement {
                static createMeshGeometry(radius) {
                    radius || (radius = 1.0);
                    const n1 = point3D.from(0.356822 * radius, 0.934172 * radius, 0 * radius);
                    const n2 = point3D.from(-0.356822 * radius, 0.934172 * radius, 0 * radius);
                    const n3 = point3D.from(0.57735 * radius, 0.57735 * radius, -0.57735 * radius);
                    const n4 = point3D.from(0 * radius, 0.356822 * radius, -0.934172 * radius);
                    const n5 = point3D.from(-0.57735 * radius, 0.57735 * radius, -0.57735 * radius);
                    const n6 = point3D.from(-0.57735 * radius, 0.57735 * radius, 0.57735 * radius);
                    const n7 = point3D.from(0 * radius, 0.356822 * radius, 0.934172 * radius);
                    const n8 = point3D.from(0.57735 * radius, 0.57735 * radius, 0.57735 * radius);
                    const n9 = point3D.from(0.934172 * radius, 0 * radius, -0.356822 * radius);
                    const n10 = point3D.from(0.934172 * radius, 0 * radius, 0.356822 * radius);
                    const n11 = point3D.from(0 * radius, -0.356822 * radius, 0.934172 * radius);
                    const n12 = point3D.from(0.57735 * radius, -0.57735 * radius, 0.57735 * radius);
                    const n13 = point3D.from(0.57735 * radius, -0.57735 * radius, -0.57735 * radius);
                    const n14 = point3D.from(0.356822 * radius, -0.934172 * radius, 0 * radius);
                    const n15 = point3D.from(-0.57735 * radius, -0.57735 * radius, 0.57735 * radius);
                    const n16 = point3D.from(-0.356822 * radius, -0.934172 * radius, 0 * radius);
                    const n17 = point3D.from(0 * radius, -0.356822 * radius, -0.934172 * radius);
                    const n18 = point3D.from(-0.57735 * radius, -0.57735 * radius, -0.57735 * radius);
                    const n19 = point3D.from(-0.934172 * radius, 0 * radius, 0.356822 * radius);
                    const n20 = point3D.from(-0.934172 * radius, 0 * radius, -0.356822 * radius);
                    const positions = [
                        n1,
                        n2,
                        n3,
                        n4,
                        n5,
                        n6,
                        n7,
                        n8,
                        n9,
                        n10,
                        n11,
                        n12,
                        n13,
                        n14,
                        n15,
                        n16,
                        n17,
                        n18,
                        n19,
                        n20
                    ];
                    const indices = [0, 2, 3, 0, 3, 4, 0, 4, 1, 1, 5, 6, 1, 6, 7,
                        1, 7, 0, 7, 9, 8, 7, 8, 2, 7, 2, 0,
                        7, 6, 10, 7, 10, 11, 7, 11, 9, 11, 13, 12,
                        11, 12, 8, 11, 8, 9, 11, 10, 14, 11, 14, 15,
                        11, 15, 13, 15, 17, 16, 15, 16, 12, 15, 12, 13,
                        15, 14, 18, 15, 18, 19, 15, 19, 17, 19, 4, 3,
                        19, 3, 16, 19, 16, 17, 19, 18, 5, 19, 5, 1,
                        19, 1, 4, 18, 14, 10, 18, 10, 6, 18, 6, 5,
                        3, 2, 8, 3, 8, 12, 3, 12, 16];
                    const textureCoordsString = "0.5 0.999501, 0.5 0.999501, 0.191292 0.808708, 0.5 0.690792, " +
                        "0.191292 0.808708, 0.191292 0.808708, 0.5 0.690792,                              " +
                        "0.808708 0.808708, 0.000499517 0.5, 0.309208 0.5, 0.5 0.309208,                  " +
                        "0.191292 0.191292, 0.191292 0.191292, 0.309208 0.5,                              " +
                        "0.191292 0.191292, 0.5 0.000499517, 0.5 0.309208, 0.808708 0.191292,             " +
                        "0.000499517 0.5, 0.309208 0.5, 0.690792 0.5, 0.808708 0.808708,                  " +
                        "0.5 0.999501, 0.690792 0.5, 0.5 0.999501, 0.191292 0.808708,                     " +
                        "0.690792 0.5, 0.191292 0.808708, 0.309208 0.5, 0.309208 0.5,                     " +
                        "0.191292 0.191292, 0.5 0.000499517, 0.309208 0.5, 0.5 0.000499517,               " +
                        "0.808708 0.191292, 0.309208 0.5, 0.808708 0.191292,                              " +
                        "0.690792 0.5, 0.191292 0.808708, 0.309208 0.5, 0.690792 0.5,                     " +
                        "0.191292 0.808708, 0.690792 0.5, 0.808708 0.808708,                              " +
                        "0.191292 0.808708, 0.808708 0.808708, 0.808708 0.808708,                         " +
                        "0.5 0.690792, 0.5 0.309208, 0.808708 0.808708, 0.5 0.309208,                     " +
                        "0.808708 0.191292, 0.808708 0.191292, 0.9995 0.5, 0.191292 0.191292,             " +
                        "0.5 0.000499517, 0.808708 0.191292, 0.191292 0.191292,                           " +
                        "0.808708 0.191292, 0.690792 0.5, 0.191292 0.191292,                              " +
                        "0.690792 0.5, 0.191292 0.191292, 0.5 0.000499517, 0.808708 0.191292,             " +
                        "0.191292 0.191292, 0.808708 0.191292, 0.690792 0.5,                              " +
                        "0.690792 0.5, 0.309208 0.5, 0.690792 0.5, 0.808708 0.808708,                     " +
                        "0.5 0.999501, 0.690792 0.5, 0.5 0.999501, 0.191292 0.808708,                     " +
                        "0.690792 0.5, 0.191292 0.808708, 0.5 0.000499517, 0.808708 0.191292,             " +
                        "0.690792 0.5, 0.5 0.000499517, 0.690792 0.5, 0.309208 0.5,                       " +
                        "0.309208 0.5, 0.191292 0.191292, 0.9995 0.5, 0.808708 0.808708,                  " +
                        "0.5 0.690792, 0.9995 0.5, 0.5 0.690792, 0.5 0.309208,                            " +
                        "0.9995 0.5, 0.5 0.309208, 0.309208 0.5, 0.690792 0.5,                            " +
                        "0.808708 0.808708, 0.309208 0.5, 0.808708 0.808708,                              " +
                        "0.5 0.999501, 0.000499517 0.5, 0.5 0.309208, 0.000499517 0.5,                    " +
                        "0.5 0.690792, 0.5 0.690792, 0.000499517 0.5, 0.5 0.690792,                       " +
                        "0.191292 0.191292";
                    const texIndices = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                        32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
                        44, 45, 0, 46, 47, 48, 49, 50, 51, 7, 52, 53,
                        54, 55, 56, 57, 58, 59, 60, 61, 9, 62, 63, 64,
                        65, 66, 67, 11, 68, 69, 70, 71, 72, 73, 74, 75,
                        76, 77, 13, 78, 79, 80, 81, 82, 83, 15, 84, 85,
                        86, 87, 88, 89, 90, 91, 92, 93, 17, 94, 95, 96,
                        97, 98, 99, 19, 1, 4, 100, 14, 101, 102, 10, 103,
                        18, 6, 5, 104, 2, 105, 106, 8, 107, 3, 12, 16];
                    // -------------------------------------------------------------------------------------------------
                    const pointsToParse = textureCoordsString.split(',');
                    const uv = [];
                    for (let i = 0; i < texIndices.length; i++) {
                        const ndx = texIndices[i];
                        const uvCoords = _utils.parseFloats(pointsToParse[ndx]);
                        uv.push({ x: uvCoords[0], y: uvCoords[1] });
                    }
                    const geom = new Pacem.Drawing3D.MeshGeometry(positions, indices, uv);
                    Pacem.Drawing3D.computeSharpVertexNormals(geom);
                    return geom;
                }
                createMeshGeometry(radius = this.radius) {
                    return PacemDodecahedronElement_1.createMeshGeometry(radius);
                }
            };
            PacemDodecahedronElement = PacemDodecahedronElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-primitive-dodecahedron' })
            ], PacemDodecahedronElement);
            Drawing3D.PacemDodecahedronElement = PacemDodecahedronElement;
            // #endregion
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="primitive.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            var PacemSphereElement_1;
            let PacemSphereElement = PacemSphereElement_1 = class PacemSphereElement extends Drawing3D.Pacem3DPrimitiveElement {
                static createMeshGeometry(radius, segs) {
                    //
                    const nodes = [];
                    const uv = [];
                    const indices = [];
                    //
                    const r = radius || 1, tessellation = segs || 8;
                    const theta = Drawing3D.DEG2RAD * (360.0 / tessellation);
                    const segments = tessellation % 2 == 0 ? tessellation / 2 : (tessellation - 1) / 2;
                    // top vertex
                    nodes.push({ x: .0, y: r, z: .0 });
                    for (let j = 1; j < segments; j++) {
                        // loop "latitude"
                        const angle1 = theta * j;
                        const cos_angle1 = Math.cos(angle1);
                        const sin_angle1 = Math.sin(angle1);
                        const v = 1.0 - 1.0 * j / segments;
                        for (let i = 0; i < tessellation; i++) {
                            // loop "longitude"
                            const angle2 = theta * i - Math.PI / 2.0;
                            const cos_angle2 = Math.cos(angle2);
                            const sin_angle2 = Math.sin(angle2);
                            const x = r * sin_angle1 * cos_angle2;
                            const y = r * cos_angle1;
                            const z = r * sin_angle1 * sin_angle2;
                            nodes.push({ x, y, z });
                            // coordinates & texture
                            const i_prev = i == 0 ? tessellation - 1 : i - 1;
                            const u = i == 0 ? .0 : 1.0 - 1.0 * i / tessellation;
                            const u_prev = 1.0 - 1.0 * i_prev / tessellation;
                            // triangles
                            if (j == 1) {
                                indices.push(1 + i);
                                indices.push(1 + i_prev);
                                indices.push(0);
                                //
                                uv.push({ x: u, y: v });
                                uv.push({ x: u_prev, y: v });
                                uv.push({ x: .5, y: 1.0 });
                            }
                            else {
                                indices.push((j - 1) * tessellation + i + 1);
                                indices.push((j - 1) * tessellation + i_prev + 1);
                                indices.push((j - 2) * tessellation + i_prev + 1);
                                indices.push((j - 1) * tessellation + i + 1);
                                indices.push((j - 2) * tessellation + i_prev + 1);
                                indices.push((j - 2) * tessellation + i + 1);
                                //
                                const v_prev = 1.0 - (j - 1.0) / segments;
                                //var faceUV = [];
                                uv.push({ x: u, y: v });
                                uv.push({ x: u_prev, y: v });
                                uv.push({ x: u_prev, y: v_prev });
                                uv.push({ x: u, y: v });
                                uv.push({ x: u_prev, y: v_prev });
                                uv.push({ x: u, y: v_prev });
                            }
                        }
                    }
                    // bottom vertex
                    nodes.push({ x: .0, y: -r, z: .0 });
                    const last = nodes.length - 1;
                    for (let i = 0; i < tessellation; i++) {
                        const j = segments - 2;
                        const i_prev = i == 0 ? tessellation - 1 : i - 1;
                        const u = i == 0 ? .0 : 1.0 - 1.0 * i / tessellation;
                        const u_prev = 1.0 - 1.0 * i_prev / tessellation;
                        const v = 1.0 - (j + 1.0) / segments;
                        // triangles
                        indices.push(last);
                        indices.push(j * tessellation + 1 + i_prev);
                        indices.push(j * tessellation + 1 + i);
                        uv.push({ x: .5, y: 0 });
                        uv.push({ x: u_prev, y: v });
                        uv.push({ x: u, y: v });
                    }
                    return new Pacem.Drawing3D.MeshGeometry(nodes, indices, uv);
                }
                createDefaultGeometry() {
                    return PacemSphereElement_1.createMeshGeometry();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'radius':
                        case 'segments':
                            this.geometry = PacemSphereElement_1.createMeshGeometry(this.radius, this.segments);
                            break;
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemSphereElement.prototype, "radius", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemSphereElement.prototype, "segments", void 0);
            PacemSphereElement = PacemSphereElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-primitive-sphere' })
            ], PacemSphereElement);
            Drawing3D.PacemSphereElement = PacemSphereElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="primitive.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Drawing3D;
        (function (Drawing3D) {
            var PacemTorusElement_1;
            let PacemTorusElement = PacemTorusElement_1 = class PacemTorusElement extends Drawing3D.Pacem3DPrimitiveElement {
                static createMeshGeometry(radius, innerRadius, segments, sides) {
                    //
                    const nodes = [];
                    const uv = [];
                    const coords = [];
                    //
                    segments || (segments = 24);
                    sides || (sides = 12);
                    const theta = Drawing3D.DEG2RAD * (360.0 / segments);
                    const phi = Drawing3D.DEG2RAD * (360.0 / sides);
                    const r1 = radius || 1.0;
                    const r2 = innerRadius || .25;
                    for (let j = 0; j < segments; j++) {
                        // Math.PI/2 adjustement (useful for UV mapping)
                        const angle1 = theta * j - Math.PI / 2.0;
                        const sin_angle1 = Math.sin(angle1);
                        const cos_angle1 = Math.cos(angle1);
                        for (let i = 0; i < sides; i++) {
                            // Math.PI adjustement (useful for UV mapping)
                            const angle2 = phi * i + Math.PI;
                            const cos_angle2 = Math.cos(angle2);
                            const x = r1 * cos_angle1 + r2 * cos_angle2 * cos_angle1;
                            const y = r2 * Math.sin(angle2);
                            const z = r1 * sin_angle1 + r2 * cos_angle2 * sin_angle1;
                            nodes.push({ x, y, z });
                            const prev_j = j > 0 ? j - 1 : segments - 1;
                            const prev_i = i > 0 ? i - 1 : sides - 1;
                            const u = j == 0 ? .0 : 1.0 - 1.0 * j / segments;
                            const v = i > 0 ? 1.0 * i / sides : 1.0;
                            const u_prev = j > 0 ? 1.0 - (j - 1.0) / segments : 1.0 / segments;
                            const v_prev = i > 0 ? (i - 1.0) / sides : 1.0 - 1.0 / sides;
                            // triangles <=> Int32Collection
                            //           <=> PointCollection
                            coords.push(j * sides + prev_i);
                            coords.push(prev_j * sides + prev_i);
                            coords.push(prev_j * sides + i);
                            coords.push(j * sides + prev_i);
                            coords.push(prev_j * sides + i);
                            coords.push(j * sides + i);
                            //
                            uv.push({ x: u, y: v_prev });
                            uv.push({ x: u_prev, y: v_prev });
                            uv.push({ x: u_prev, y: v });
                            uv.push({ x: u, y: v_prev });
                            uv.push({ x: u_prev, y: v });
                            uv.push({ x: u, y: v });
                        }
                    }
                    return new Pacem.Drawing3D.MeshGeometry(nodes, coords, uv);
                }
                createDefaultGeometry() {
                    return PacemTorusElement_1.createMeshGeometry();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'radius':
                        case 'innerRadius':
                        case 'segments':
                        case 'sides':
                            this.geometry = PacemTorusElement_1.createMeshGeometry(this.radius, this.innerRadius, this.segments, this.sides);
                            break;
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemTorusElement.prototype, "radius", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemTorusElement.prototype, "innerRadius", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemTorusElement.prototype, "segments", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemTorusElement.prototype, "sides", void 0);
            PacemTorusElement = PacemTorusElement_1 = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-' + Drawing3D.TAG_MIDDLE_NAME + '-primitive-torus' })
            ], PacemTorusElement);
            Drawing3D.PacemTorusElement = PacemTorusElement;
        })(Drawing3D = Components.Drawing3D || (Components.Drawing3D = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
