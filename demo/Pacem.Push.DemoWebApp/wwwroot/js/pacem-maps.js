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
/// <reference path="../../../dist/js/pacem-core.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Maps;
        (function (Maps) {
            Maps.MapConsts = {
                MAP_SELECTOR: Pacem.P + '-map',
                LINK_SELECTOR: Pacem.P + '-map-link',
                MARKER_SELECTOR: Pacem.P + '-map-marker',
                POLYLINE_SELECTOR: Pacem.P + '-map-polyline',
                CIRCLE_SELECTOR: Pacem.P + '-map-circle',
                LAYER_SELECTOR: Pacem.P + '-map-layer',
                DEFAULT_COORDS: { lat: 44.714188025077984, lng: 10.296516444873811 }
            };
            class MapUtils {
                static parseCoords(input) {
                    if (input && !isNaN(input['lat']) && !isNaN(input['lng']))
                        return [input['lat'], input['lng']];
                    else if (Pacem.Utils.isArray(input) && input.length > 1)
                        return [input[0], input[1]];
                    else if (/^\s*(\+|-)?[\d]+(.[\d]+)?\s*,\s*(\+|-)?[\d]+(.[\d]+)?\s*$/.test(input)) {
                        var splitted = input.split(',');
                        return [parseFloat(splitted[0]), parseFloat(splitted[1])];
                    }
                    return [Maps.MapConsts.DEFAULT_COORDS.lat, Maps.MapConsts.DEFAULT_COORDS.lng];
                }
                static expandBounds(bnds, latLng) {
                    if (latLng) {
                        if (!Array.isArray(latLng)) {
                            latLng = [latLng.lat, latLng.lng];
                        }
                        bnds.push(latLng);
                    }
                }
                static isContentEmpty(element) {
                    return element.children.length == 0;
                }
            }
            Maps.MapUtils = MapUtils;
            ;
            class MapRelevantElement extends Components.PacemEventTarget {
                get map() {
                    return this['_map'] = this['_map'] || Pacem.CustomElementUtils.findAncestorOfType(this, PacemMapElement);
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this.map && this.map.register(this);
                }
                disconnectedCallback() {
                    this.map && this.map.unregister(this);
                    super.disconnectedCallback();
                }
            }
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], MapRelevantElement.prototype, "hide", void 0);
            Maps.MapRelevantElement = MapRelevantElement;
            class PacemMapAdapterElement extends Components.PacemEventTarget {
                updateMapElement(ctrl, center, zoom) {
                    var _a, _b;
                    const lat = center.lat, lng = center.lng;
                    ctrl.zoom = zoom;
                    if (lat != ((_a = ctrl.center) === null || _a === void 0 ? void 0 : _a.lat) || lng != ((_b = ctrl.center) === null || _b === void 0 ? void 0 : _b.lng)) {
                        ctrl.center = { lat, lng };
                    }
                }
            }
            Maps.PacemMapAdapterElement = PacemMapAdapterElement;
            class MapEvent extends Pacem.CustomTypedEvent {
                constructor(type, args) {
                    super(type, args);
                }
            }
            Maps.MapEvent = MapEvent;
            let PacemMapMarkerElement = class PacemMapMarkerElement extends MapRelevantElement {
                onDragEnd(position) {
                    this.position = position;
                    this.dispatchEvent(new MapEvent('dragend', { position: position }));
                }
                onInfoOpen() {
                    this.dispatchEvent(new MapEvent('openinfo'));
                }
                onInfoClose() {
                    this.dispatchEvent(new MapEvent('closeinfo'));
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemMapMarkerElement.prototype, "position", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemMapMarkerElement.prototype, "icon", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemMapMarkerElement.prototype, "caption", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemMapMarkerElement.prototype, "draggable", void 0);
            PacemMapMarkerElement = __decorate([
                Pacem.CustomElement({ tagName: Maps.MapConsts.MARKER_SELECTOR })
            ], PacemMapMarkerElement);
            Maps.PacemMapMarkerElement = PacemMapMarkerElement;
            let PacemMapLayerElement = class PacemMapLayerElement extends MapRelevantElement {
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemMapLayerElement.prototype, "url", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemMapLayerElement.prototype, "include", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemMapLayerElement.prototype, "mode", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemMapLayerElement.prototype, "minZoom", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemMapLayerElement.prototype, "maxZoom", void 0);
            PacemMapLayerElement = __decorate([
                Pacem.CustomElement({ tagName: Maps.MapConsts.LAYER_SELECTOR })
            ], PacemMapLayerElement);
            Maps.PacemMapLayerElement = PacemMapLayerElement;
            let PacemMapElement = class PacemMapElement extends Components.PacemEventTarget {
                constructor() {
                    super(...arguments);
                    this.zoom = 12;
                    this.center = Maps.MapConsts.DEFAULT_COORDS;
                    this.scale = true;
                    this.mousewheel = true;
                    this.draggable = true;
                    this.doubleClickZoom = true;
                    this.keyboardShortcuts = true;
                    /** Gets or sets whether to autofit the bounds whenever the map gets refreshed. */
                    this.autofit = true;
                    this.paddingTop = 0;
                    this.paddingLeft = 0;
                    this.paddingRight = 0;
                    this.paddingBottom = 0;
                    this._drawHandler = (evt) => {
                        this._draw(evt.target);
                    };
                    this._initialized = false;
                    this._afterInit = (_, old) => {
                        this._initialized = true;
                        // loop through child element map-relevant-items
                        for (var child of Pacem.CustomElementUtils.findDescendants(this, n => n instanceof MapRelevantElement)) {
                            this._erase(child, old);
                            this._draw(child);
                        }
                        // dispose old, if any.
                        old === null || old === void 0 ? void 0 : old.destroy(this);
                    };
                    this._resizeHandler = (e) => {
                        this.onResize(e);
                    };
                    //#endregion
                }
                get container() {
                    return this._container;
                }
                register(item) {
                    item.addEventListener(Pacem.PropertyChangeEventName, this._drawHandler, false);
                    this._draw(item);
                }
                unregister(item) {
                    this._erase(item);
                    item.removeEventListener(Pacem.PropertyChangeEventName, this._drawHandler, false);
                }
                _draw(item, adapter = this.adapter) {
                    this._initialized &&
                        adapter &&
                        adapter.drawItem(item);
                }
                _erase(item, adapter = this.adapter) {
                    this._initialized &&
                        adapter &&
                        adapter.removeItem(item);
                }
                //#endregion
                //#region lifecycle
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'adapter') {
                        if (!Pacem.Utils.isNull(this._container)) {
                            this._initialized = false;
                            this.adapter.initialize(this).then(_ => this._afterInit(_, old));
                        }
                    }
                    else {
                        switch (name) {
                            case 'zoom':
                            case 'center':
                                this.adapter && this.adapter.setView(val);
                                break;
                            case 'autofit':
                                if (val) {
                                    this.adapter && this.adapter.fitBounds();
                                }
                                break;
                        }
                        this.adapter && this.adapter.invalidateSize();
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    const container = this._container = document.createElement('div');
                    Pacem.Utils.addClass(container, Pacem.PCSS + '-map');
                    this.insertAdjacentElement('afterend', container);
                    const resizer = this._resizer = document.createElement(Pacem.P + '-resize');
                    resizer.addEventListener('resize', this._resizeHandler, false);
                    resizer.target = container;
                    container.insertAdjacentElement('afterend', resizer);
                    //
                    this.adapter && this.adapter.initialize(this).then(this._afterInit);
                }
                disconnectedCallback() {
                    const resizer = this._resizer;
                    if (!Pacem.Utils.isNull(resizer)) {
                        resizer.removeEventListener('resize', this._resizeHandler, false);
                        resizer.remove();
                    }
                    super.disconnectedCallback();
                }
                onResize(e) {
                    this.adapter && this.adapter.invalidateSize();
                }
            };
            __decorate([
                Pacem.Watch({ emit: true, converter: Pacem.PropertyConverters.Number })
            ], PacemMapElement.prototype, "zoom", void 0);
            __decorate([
                Pacem.Watch({ emit: true, converter: Pacem.PropertyConverters.Json })
            ], PacemMapElement.prototype, "center", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemMapElement.prototype, "scale", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemMapElement.prototype, "mousewheel", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemMapElement.prototype, "zoomControl", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemMapElement.prototype, "draggable", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemMapElement.prototype, "doubleClickZoom", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemMapElement.prototype, "keyboardShortcuts", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemMapElement.prototype, "autofit", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemMapElement.prototype, "paddingTop", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemMapElement.prototype, "paddingLeft", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemMapElement.prototype, "paddingRight", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemMapElement.prototype, "paddingBottom", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Element })
            ], PacemMapElement.prototype, "adapter", void 0);
            PacemMapElement = __decorate([
                Pacem.CustomElement({ tagName: Maps.MapConsts.MAP_SELECTOR })
            ], PacemMapElement);
            Maps.PacemMapElement = PacemMapElement;
        })(Maps = Components.Maps || (Components.Maps = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Maps;
        (function (Maps) {
            const consts = {
                TIMEOUT: 1000,
                API_URI: '//webapi.amap.com/maps',
                UI_URI: '//webapi.amap.com/ui/1.1/main.js?v=1.1.1'
            };
            const AMapUtils = {
                getLocation(latLng) {
                    if (Array.isArray(latLng)) {
                        latLng = { lat: latLng[0], lng: latLng[1] };
                    }
                    // switch lng and lat
                    return [latLng.lng, latLng.lat];
                },
                getLngLat(latLng) {
                    const lngLat = AMapUtils.getLocation(latLng);
                    return new AMap.LngLat(lngLat[0], lngLat[1]);
                }, getPosition(pos) {
                    switch (pos.toLowerCase()) {
                        case 'topleft':
                            return 'lt';
                        case 'bottomleft':
                            return 'lb';
                        case 'bottomright':
                            return 'rb';
                        default:
                            return 'rt';
                    }
                }, getLang(lang) {
                    switch (lang) {
                        case 'zh-cn':
                            return 'zh_cn';
                        case 'zh-en':
                            return 'zh_en';
                        default:
                            // defaults to english
                            return 'en';
                    }
                }, expandBounds(bnds, lngLat) {
                    var sw = bnds.getSouthWest(), ne = bnds.getNorthEast();
                    const pt = Pacem.Utils.isArray(lngLat) ? new AMap.LngLat(lngLat[0], lngLat[1]) : lngLat, lat = pt.getLat(), lng = pt.getLng();
                    if (sw.lat > lat) {
                        sw = new AMap.LngLat(sw.lng, lat);
                    }
                    if (sw.lng > lng) {
                        sw = new AMap.LngLat(lng, sw.lat);
                    }
                    if (ne.lat < lat) {
                        ne = new AMap.LngLat(ne.lng, lat);
                    }
                    if (ne.lng < lng) {
                        ne = new AMap.LngLat(lng, ne.lat);
                    }
                    return new AMap.Bounds(sw, ne);
                }
            };
            class PacemAMapMarkerAdapter {
                constructor(map) {
                    this.map = map;
                    this.markers = new Map();
                    this.infoWindows = new Map();
                }
                _onDragEnd(item, evt) {
                    const pos = this.markers.get(item).getPosition(), dpos = { lat: pos.lat, lng: pos.lng };
                    item.onDragEnd(dpos);
                }
                _onInfo(item) {
                    item.onInfoOpen();
                }
                _onClose(item) {
                    item.onInfoClose();
                }
                drawMarker(item) {
                    var ctrl = this;
                    if (Pacem.Utils.isNull(ctrl.map.map))
                        return;
                    else if (Pacem.Utils.isNull(item && item.position)) {
                        ctrl.map.removeItem(item);
                        return;
                    }
                    //
                    var marker;
                    if (!ctrl.markers.has(item)) {
                        marker = new AMap.Marker({
                            position: [0, 0],
                            map: ctrl.map.map
                        });
                        marker.on('click', (e) => ctrl.openInfoWindow(item, e));
                        marker.on('drag', () => ctrl.map.fitBounds(true));
                        marker.on('dragend', (e) => ctrl._onDragEnd(item, e));
                        ctrl.markers.set(item, marker);
                    }
                    else
                        marker = ctrl.markers.get(item);
                    // set position
                    marker.setPosition(AMapUtils.getLocation(item.position));
                    if (typeof item.icon === 'string') {
                        // icon url only
                        marker.setIcon(item.icon);
                    }
                    else if (!Pacem.Utils.isNull(item.icon)) {
                        // structured icon
                        const options = { image: item.icon.url };
                        if (!Pacem.Utils.isNullOrEmpty(item.icon.size)) {
                            options.size = options.imageSize = new AMap.Size(item.icon.size.width, item.icon.size.height);
                            marker.setAnchor("bottom-center");
                        }
                        marker.setIcon(new AMap.Icon(options));
                        if (!Pacem.Utils.isNullOrEmpty(item.icon.anchor)) {
                            marker.setAnchor("top-left");
                            marker.setOffset(new AMap.Pixel(-item.icon.anchor.x, -item.icon.anchor.y));
                        }
                    }
                    marker.setLabel({ content: item.caption, offset: [0, 0], direction: 'ltr' });
                    marker.setDraggable(item.draggable);
                }
                closeInfoWindow(item, evt) {
                    const ctrl = this;
                    if (ctrl.infoWindows.has(item)) {
                        const info = ctrl.infoWindows.get(item);
                        if (info.getIsOpen()) {
                            info.close();
                        }
                    }
                }
                openInfoWindow(item, evt) {
                    var ctrl = this, marker = ctrl.markers.get(item), content = item.caption;
                    if (!Maps.MapUtils.isContentEmpty(item)) {
                        content = item.innerHTML;
                    }
                    if (!Pacem.Utils.isNullOrEmpty(content)) {
                        var info;
                        if (!ctrl.infoWindows.has(item)) {
                            let offsY = marker.getSize()[1];
                            info = new AMap.InfoWindow({
                                anchor: 'bottom-center', offset: [0, -offsY]
                            });
                            info.on('close', function () {
                                ctrl._onClose(item);
                            });
                            ctrl.infoWindows.set(item, info);
                        }
                        else {
                            info = ctrl.infoWindows.get(item);
                        }
                        info.setContent(content);
                        const pos = marker.getPosition(), loc = [pos.getLng(), pos.getLat()];
                        info.open(ctrl.map.map, loc, 0);
                        ctrl._onInfo(item);
                    }
                }
            }
            const MAP_EVENTS = ['zoomend', 'moveend', 'dragend'];
            let PacemAMapAdapterElement = class PacemAMapAdapterElement extends Maps.PacemMapAdapterElement {
                constructor() {
                    super();
                    this._mapUpdateHandler = (e) => {
                        const map = this._map, ctrl = this._container;
                        if (!Pacem.Utils.isNull(map) && !Pacem.Utils.isNull(ctrl)) {
                            this.updateMapElement(ctrl, map.getCenter(), map.getZoom());
                        }
                    };
                    // TODO: implement
                    this._shapes = new Map();
                    this._markersAdapter = new PacemAMapMarkerAdapter(this);
                }
                popupInfoWindow(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        this._markersAdapter.openInfoWindow(item);
                    }
                }
                popoutInfoWindow(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        this._markersAdapter.closeInfoWindow(item);
                    }
                }
                invalidateSize() {
                    const map = this._map;
                    if (map) {
                        // AMap.Map.trigger(map, 'resize', {});
                        map.emit("resize");
                    }
                }
                destroy(_) {
                    MAP_EVENTS.forEach(evt => {
                        this._map.on(evt, this._mapUpdateHandler);
                    });
                    this._map.destroy();
                }
                async initialize(container) {
                    const v = this.apiVersion || '2.0', k = this.apiKey || '';
                    await Pacem.CustomElementUtils.importjs(consts.API_URI + '?v=' + v + '&key=' + k);
                    await Pacem.CustomElementUtils.importjs(consts.UI_URI);
                    const ctrl = this._container = container;
                    if (Pacem.Utils.isNull(AMap))
                        return;
                    var scale = ctrl.scale;
                    var draggable = ctrl.draggable;
                    var dblClickZoom = ctrl.doubleClickZoom;
                    var kbShortcuts = ctrl.keyboardShortcuts;
                    //
                    const centerPos = Maps.MapUtils.parseCoords(ctrl.center);
                    const mapOptions = {
                        center: AMapUtils.getLocation(centerPos),
                        scrollWheel: ctrl.mousewheel,
                        animateEnable: true,
                        dragEnable: draggable,
                        keyboardEnable: kbShortcuts,
                        doubleClickZoom: dblClickZoom,
                        zoomEnable: scale,
                        viewMode: '2D',
                        zoom: ctrl.zoom,
                        langForeign: AMapUtils.getLang(Pacem.Utils.lang(container)),
                        layers: [AMap.createDefaultLayer()]
                    };
                    var canvas = ctrl.container;
                    var mapElement = document.createElement('div');
                    mapElement.style.width = '100%';
                    mapElement.style.height = '100%';
                    canvas.innerHTML = '';
                    canvas.appendChild(mapElement);
                    const map = this._map = new AMap.Map(mapElement, mapOptions);
                    window['AMapUI'].loadUI(['control/BasicControl'], (BasicControl) => {
                        if (ctrl.zoomControl) {
                            map.addControl(new BasicControl.Zoom({
                                position: AMapUtils.getPosition(ctrl.zoomControl)
                            }));
                        }
                    });
                    map.on('complete', () => {
                        container.dispatchEvent(new Maps.MapEvent("maploaded"));
                    }, map, /* once */ true);
                    MAP_EVENTS.forEach(evt => {
                        map.on(evt, this._mapUpdateHandler);
                    });
                    return mapElement;
                }
                drawItem(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        var adapter = this._markersAdapter;
                        var marker = adapter.drawMarker(item);
                        if (!adapter.markers.has(item))
                            adapter.markers.set(item, marker);
                    }
                    this.fitBounds(true);
                }
                removeItem(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        var adapter = this._markersAdapter;
                        var marker = adapter.markers.get(item);
                        if (!Pacem.Utils.isNull(marker)) {
                            marker.setMap(null);
                            adapter.markers.delete(item);
                        }
                    }
                    this.fitBounds(true);
                }
                get map() {
                    return this._map;
                }
                setView(center, zoom) {
                    const map = this._map;
                    if (!Pacem.Utils.isNull(map)) {
                        if (typeof center === 'number') {
                            map.setZoom(center);
                        }
                        else {
                            const amapCenter = AMapUtils.getLngLat(center);
                            map.setCenter(amapCenter);
                            if (zoom) {
                                map.setZoom(zoom);
                            }
                        }
                    }
                }
                fitBounds(onlyIfAutofit) {
                    if (!this.map)
                        return;
                    const ctrl = this._container;
                    // check against autofit
                    if (!ctrl.autofit && onlyIfAutofit === true)
                        return;
                    const markers = this._markersAdapter.markers, shapes = this._shapes;
                    const map = this._map;
                    // no markers
                    if (!markers.size && !shapes.size) {
                        map.setCenter(AMapUtils.getLocation(ctrl.center));
                        map.setZoom(ctrl.zoom);
                    }
                    else {
                        var bnds = null;
                        var j = 0;
                        for (var m of markers.keys()) {
                            let marker = markers.get(m);
                            if (Pacem.Utils.isNull(marker))
                                continue;
                            const mpos = marker.getPosition();
                            if (mpos) {
                                bnds = Pacem.Utils.isNull(bnds) ? new AMap.Bounds(mpos, mpos) : AMapUtils.expandBounds(bnds, mpos);
                                j++;
                            }
                        }
                        for (var s of shapes.keys()) {
                            var bx = shapes.get(s).getBounds();
                            const sw = bx.getSouthWest(), ne = bx.getNorthEast();
                            bnds = AMapUtils.expandBounds(bnds, sw);
                            bnds = AMapUtils.expandBounds(bnds, ne);
                            j += 2;
                        }
                        if (j >= 2) {
                            const bndsp = this._padBounds(bnds);
                            map.setBounds(bndsp);
                        }
                        else {
                            if (j == 1) {
                                map.setCenter(bnds.getCenter());
                                map.setZoom(ctrl.zoom);
                            }
                        }
                    }
                }
                _padBounds(bnds) {
                    const ctrl = this._container;
                    const paddingTop = ctrl.paddingTop || 0, paddingLeft = ctrl.paddingLeft || 0, paddingRight = ctrl.paddingRight || 0, paddingBottom = ctrl.paddingBottom || 0;
                    const map = this._map;
                    if (paddingLeft || paddingTop || paddingRight || paddingBottom) {
                        //
                        const nw = bnds.getNorthWest(), se = bnds.getSouthEast();
                        const se_px = map.lngLatToPixel(se), nw_px = map.lngLatToPixel(nw);
                        var n_nw = map.pixelToLngLat(new AMap.Pixel(nw_px.x - paddingLeft, nw_px.y - paddingTop));
                        var n_se = map.pixelToLngLat(new AMap.Pixel(se_px.x + paddingRight, se_px.y + paddingBottom));
                        //
                        bnds = AMapUtils.expandBounds(bnds, n_nw);
                        bnds = AMapUtils.expandBounds(bnds, n_se);
                    }
                    return bnds;
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemAMapAdapterElement.prototype, "apiKey", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemAMapAdapterElement.prototype, "apiVersion", void 0);
            PacemAMapAdapterElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-map-adapter-amap' })
            ], PacemAMapAdapterElement);
            Maps.PacemAMapAdapterElement = PacemAMapAdapterElement;
        })(Maps = Components.Maps || (Components.Maps = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/azure-maps.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Maps;
        (function (Maps) {
            const consts = {
                TIMEOUT: 1000,
                API_JS: 'https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js',
                API_CSS: 'https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css'
            };
            class AtlasMapUtils {
                static getPosition(latLng) {
                    if (Array.isArray(latLng)) {
                        latLng = { lat: latLng[0], lng: latLng[1] };
                    }
                    return atlas.data.Position.fromLatLng(latLng);
                }
                static getBounds(bounds) {
                    return atlas.data.BoundingBox.fromPositions(bounds.map(p => /* reverse */ [p[1], p[0]]));
                }
                static getLatLng(position) {
                    return { lat: position[1], lng: position[0] };
                }
            }
            class PacemAzureMarkerAdapter {
                constructor(map) {
                    this.map = map;
                    this.markers = new Map();
                }
                _onDragEnd(item, evt) {
                    var pos = evt.target.getOptions().position;
                    item.onDragEnd(AtlasMapUtils.getLatLng(pos));
                }
                _onInfo(item) {
                    item.onInfoOpen();
                }
                _onClose(item) {
                    item.onInfoClose();
                }
                drawMarker(item) {
                    var ctrl = this;
                    if (Pacem.Utils.isNull(ctrl.map.map))
                        return;
                    else if (Pacem.Utils.isNull(item && item.position)) {
                        ctrl.map.removeItem(item);
                        return;
                    }
                    //
                    var marker;
                    var position = AtlasMapUtils.getPosition(item.position);
                    if (!ctrl.markers.has(item)) {
                        marker = new atlas.HtmlMarker();
                        const map = ctrl.map.map;
                        map.markers.add(marker, position);
                        map.events.add('click', marker, (e) => ctrl.openInfoWindow(item, e));
                        map.events.add('drag', marker, () => ctrl.map.fitBounds(true));
                        map.events.add('dragend', marker, (e) => ctrl._onDragEnd(item, e));
                        ctrl.markers.set(item, marker);
                    }
                    else
                        marker = ctrl.markers.get(item);
                    let popupOptions = { position: position, pixelOffset: [0, -36 /* default marker size */] };
                    let options = { position: position, draggable: item.draggable, popup: new atlas.Popup() };
                    let fnIcon = (icon, w, h) => `<img width="${(w || 'auto')}" height="${(h || 'auto')}" style="pointer-events: none" src="${icon}" />`; //item.icon.url;
                    if (typeof item.icon === 'string') {
                        // icon url only
                        options.htmlContent = fnIcon(item.icon);
                    }
                    else if (!Pacem.Utils.isNull(item.icon)) {
                        // structured icon
                        const size = item.icon.size, anchor = item.icon.anchor;
                        options.htmlContent = fnIcon(item.icon.url, size && size.width, size && size.height);
                        if (anchor) {
                            options.anchor = "top-left";
                            options.pixelOffset = [-anchor.x, -anchor.y];
                            popupOptions.pixelOffset = [0, -anchor.y];
                        }
                        else if (size && size.height) {
                            popupOptions.pixelOffset = [0, -size.height / 2];
                        }
                    }
                    options.popup.setOptions(popupOptions);
                    options.text = item.caption;
                    marker.setOptions(options);
                }
                closeInfoWindow(item, evt) {
                    var ctrl = this, marker = (evt === null || evt === void 0 ? void 0 : evt.target) || ctrl.markers.get(item), popup = marker.getOptions().popup;
                    if (!popup || !popup.isOpen()) {
                        return;
                    }
                    popup.close();
                }
                openInfoWindow(item, evt) {
                    var ctrl = this, marker = (evt === null || evt === void 0 ? void 0 : evt.target) || ctrl.markers.get(item), content = item.caption, popup = marker.getOptions().popup;
                    if (!popup) {
                        return;
                    }
                    if (!Maps.MapUtils.isContentEmpty(item)) {
                        content = item.innerHTML;
                    }
                    if (!Pacem.Utils.isNullOrEmpty(content)) {
                        popup.setOptions({ content: `<div style="padding: 24px;">${content}</div>` });
                        marker.togglePopup();
                        ctrl._onInfo(item);
                        ctrl.map.map.events.addOnce('close', popup, (e) => {
                            popup.setOptions({ content: '' });
                            ctrl._onClose(item);
                        });
                    }
                }
            }
            const MAP_EVENTS = ['moveend', 'dragend', 'zoomend', 'rotateend'];
            let PacemAzureMapAdapterElement = class PacemAzureMapAdapterElement extends Maps.PacemMapAdapterElement {
                constructor() {
                    super();
                    //#endregion
                    this._mapUpdateHandler = (evt) => {
                        this._updateMap();
                    };
                    this._shapes = new Map();
                    this._markersAdapter = new PacemAzureMarkerAdapter(this);
                }
                popupInfoWindow(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        this._markersAdapter.openInfoWindow(item);
                    }
                }
                popoutInfoWindow(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        this._markersAdapter.closeInfoWindow(item);
                    }
                }
                setView(center, zoom) {
                    const map = this._map;
                    if (!Pacem.Utils.isNull(map)) {
                        const camera = map.getCamera();
                        if (typeof center === 'number') {
                            map.setCamera({ zoom: center, center: camera.center });
                        }
                        else {
                            map.setCamera({ position: AtlasMapUtils.getPosition(center), zoom: zoom || camera.zoom });
                        }
                    }
                }
                get map() {
                    return this._map;
                }
                // #region ABSTRACT IMPLEMENTATION
                destroy(_) {
                    const map = this._map;
                    MAP_EVENTS.forEach(evt => {
                        map.events.remove(evt, this._mapUpdateHandler);
                    });
                    map.dispose();
                }
                async initialize(container) {
                    await Promise.all([
                        Pacem.CustomElementUtils.importjs(consts.API_JS),
                        Pacem.CustomElementUtils.importcss(consts.API_CSS)
                    ]);
                    const ctrl = this._container = container;
                    var scale = ctrl.scale;
                    var draggable = ctrl.draggable;
                    var dblClickZoom = ctrl.doubleClickZoom;
                    var kbShortcuts = ctrl.keyboardShortcuts;
                    //
                    var center = AtlasMapUtils.getPosition(ctrl.center);
                    var mapOptions = {
                        center: center,
                        zoom: ctrl.zoom,
                        subscriptionKey: this.subscriptionKey,
                        dragPanInteraction: draggable,
                        scrollZoomInteraction: ctrl.mousewheel,
                        dblClickZoomInteraction: !dblClickZoom,
                        keyboardInteraction: kbShortcuts,
                        language: Pacem.Utils.lang(container)
                    };
                    var canvas = ctrl.container;
                    var mapElement = document.createElement('div');
                    mapElement.id = `azure-maps-${Pacem.Utils.uniqueCode()}`;
                    mapElement.style.width = '100%';
                    mapElement.style.height = '100%';
                    canvas.innerHTML = '';
                    canvas.appendChild(mapElement);
                    var map = this._map = new atlas.Map(mapElement.id, mapOptions);
                    if (scale && ctrl.zoomControl) {
                        map.events.addOnce('ready', (e) => {
                            let pos = atlas.ControlPosition.NonFixed;
                            switch (ctrl.zoomControl) {
                                case 'topleft':
                                    pos = atlas.ControlPosition.TopLeft;
                                    break;
                                case 'topright':
                                    pos = atlas.ControlPosition.TopRight;
                                    break;
                                case 'bottomright':
                                    pos = atlas.ControlPosition.BottomRight;
                                    break;
                                case 'bottomleft':
                                    pos = atlas.ControlPosition.BottomLeft;
                                    break;
                            }
                            map.controls.add(new atlas.control.ZoomControl(), { position: pos });
                        });
                    }
                    MAP_EVENTS.forEach(evt => {
                        map.events.add(evt, this._mapUpdateHandler);
                    });
                    map.events.addOnce('ready', () => {
                        container.dispatchEvent(new Maps.MapEvent("maploaded"));
                    });
                    return mapElement;
                }
                invalidateSize() {
                    var ctrl = this;
                    if (ctrl.map)
                        ctrl.map.resize();
                }
                removeItem(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        var adapter = this._markersAdapter;
                        var marker = adapter.markers.get(item);
                        if (!Pacem.Utils.isNull(marker)) {
                            this.map.markers.remove(marker);
                            adapter.markers.delete(item);
                        }
                    }
                    this.fitBounds(true);
                }
                drawItem(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        var adapter = this._markersAdapter;
                        var marker = adapter.drawMarker(item);
                        if (!adapter.markers.has(item))
                            adapter.markers.set(item, marker);
                    }
                    this.fitBounds(true);
                }
                _updateMap() {
                    const map = this._map, ctrl = this._container;
                    if (!Pacem.Utils.isNull(map) && !Pacem.Utils.isNull(ctrl)) {
                        const camera = map.getCamera(), center = camera.center, zoom = camera.zoom;
                        if (camera.zoom === 1) {
                            console.warn('Azure Maps control lacks in reflecting the actual map zoom onto the camera property. Cannot reflect info back to PacemMapElement.');
                        }
                        else
                            this.updateMapElement(ctrl, AtlasMapUtils.getLatLng(center), zoom);
                    }
                }
                fitBounds(onlyIfAutofit) {
                    if (!this.map)
                        return;
                    var ctrl = this._container;
                    // check against autofit
                    if (!ctrl.autofit && onlyIfAutofit === true)
                        return;
                    var markers = this._markersAdapter.markers, shapes = this._shapes;
                    // no markers
                    if (!markers.size && !shapes.size) {
                        this._map.setCamera({ center: AtlasMapUtils.getPosition(ctrl.center), zoom: ctrl.zoom });
                        return;
                    }
                    var bnds = [];
                    for (var m of markers.keys()) {
                        let marker = markers.get(m);
                        if (Pacem.Utils.isNull(marker))
                            continue;
                        Maps.MapUtils.expandBounds(bnds, AtlasMapUtils.getLatLng(marker.getOptions().position));
                    }
                    for (var s of shapes.keys()) {
                        var bx = shapes.get(s).getBounds();
                        Maps.MapUtils.expandBounds(bnds, AtlasMapUtils.getLatLng(atlas.data.BoundingBox.getSouthWest(bx)));
                        Maps.MapUtils.expandBounds(bnds, AtlasMapUtils.getLatLng(atlas.data.BoundingBox.getNorthEast(bx)));
                    }
                    var paddingTop = ctrl.paddingTop || 0, paddingLeft = ctrl.paddingLeft || 0, paddingRight = ctrl.paddingRight || 0, paddingBottom = ctrl.paddingBottom || 0;
                    if (bnds.length >= 2) {
                        // TODO: avoid double loop (specially for large sets), just set coords in 'correct' place for Azure maps right away...
                        this._map.setCamera({ bounds: AtlasMapUtils.getBounds(bnds), padding: { 'top': paddingTop, 'bottom': paddingBottom, 'left': paddingLeft, 'right': paddingRight } });
                    }
                    else {
                        if (bnds.length === 1) {
                            this._map.setCamera({ center: AtlasMapUtils.getPosition(bnds[0]), zoom: ctrl.zoom });
                        }
                    }
                }
                ;
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemAzureMapAdapterElement.prototype, "subscriptionKey", void 0);
            __decorate([
                Pacem.Debounce(500)
            ], PacemAzureMapAdapterElement.prototype, "_updateMap", null);
            __decorate([
                Pacem.Debounce(consts.TIMEOUT)
            ], PacemAzureMapAdapterElement.prototype, "fitBounds", null);
            PacemAzureMapAdapterElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-map-adapter-azure' })
            ], PacemAzureMapAdapterElement);
            Maps.PacemAzureMapAdapterElement = PacemAzureMapAdapterElement;
        })(Maps = Components.Maps || (Components.Maps = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Maps;
        (function (Maps) {
            const consts = {
                TIMEOUT: 1000,
                API_URI: 'https://maps.googleapis.com/maps/api/js'
            };
            class GMapsUtils {
                static getPosition(latLng) {
                    if (Array.isArray(latLng)) {
                        latLng = { lat: latLng[0], lng: latLng[1] };
                    }
                    return latLng;
                }
            }
            class PacemGoogleMarkerAdapter {
                constructor(map) {
                    this.map = map;
                    this.markers = new Map();
                    this.infoWindows = new Map();
                }
                _onDragEnd(item, evt) {
                    const pos = this.markers.get(item).getPosition(), dpos = { lat: pos.lat(), lng: pos.lng() };
                    item.onDragEnd(dpos);
                }
                _onInfo(item) {
                    item.onInfoOpen();
                }
                _onClose(item) {
                    item.onInfoClose();
                }
                drawMarker(item) {
                    var ctrl = this;
                    if (Pacem.Utils.isNull(ctrl.map.map))
                        return;
                    else if (Pacem.Utils.isNull(item && item.position)) {
                        ctrl.map.removeItem(item);
                        return;
                    }
                    //
                    var marker;
                    if (!ctrl.markers.has(item)) {
                        marker = new google.maps.Marker({
                            position: { lat: 0, lng: 0 },
                            map: ctrl.map.map
                        });
                        marker.addListener('click', (e) => ctrl.openInfoWindow(item, e));
                        marker.addListener('drag', () => ctrl.map.fitBounds(true));
                        marker.addListener('dragend', (e) => ctrl._onDragEnd(item, e));
                        ctrl.markers.set(item, marker);
                    }
                    else
                        marker = ctrl.markers.get(item);
                    // set position
                    marker.setPosition(GMapsUtils.getPosition(item.position));
                    if (typeof item.icon === 'string') {
                        // icon url only
                        marker.setIcon(item.icon);
                    }
                    else if (!Pacem.Utils.isNull(item.icon)) {
                        // structured icon
                        let options = { url: item.icon.url };
                        if (!Pacem.Utils.isNullOrEmpty(item.icon.size)) {
                            options.size = new google.maps.Size(item.icon.size.width, item.icon.size.height);
                            options.anchor = new google.maps.Point(item.icon.size.width / 2, item.icon.size.height);
                        }
                        if (!Pacem.Utils.isNullOrEmpty(item.icon.anchor)) {
                            options.anchor = new google.maps.Point(item.icon.anchor.x, item.icon.anchor.y);
                        }
                        marker.setIcon(options);
                    }
                    marker.setLabel(item.caption);
                    marker.setDraggable(item.draggable);
                }
                closeInfoWindow(item, evt) {
                    const ctrl = this;
                    if (ctrl.infoWindows.has(item)) {
                        const info = ctrl.infoWindows.get(item);
                        info.close();
                    }
                }
                openInfoWindow(item, evt) {
                    var _a, _b, _c, _d;
                    var ctrl = this, marker = ctrl.markers.get(item), content = item.caption;
                    if (!Maps.MapUtils.isContentEmpty(item)) {
                        content = item.innerHTML;
                    }
                    if (!Pacem.Utils.isNullOrEmpty(content)) {
                        var info;
                        if (!ctrl.infoWindows.has(item)) {
                            let offsX = 0;
                            if (typeof item.icon !== 'string' && !Pacem.Utils.isNull(item.icon)) {
                                offsX = (_d = (((_b = (_a = item.icon.size) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0) / 2) -
                                    ((_c = item.icon.anchor) === null || _c === void 0 ? void 0 : _c.x)) !== null && _d !== void 0 ? _d : 0;
                            }
                            info = new google.maps.InfoWindow({
                                pixelOffset: new google.maps.Size(-offsX, 0)
                            });
                            info.addListener('closeclick', function () {
                                ctrl._onClose(item);
                            });
                            ctrl.infoWindows.set(item, info);
                        }
                        else {
                            info = ctrl.infoWindows.get(item);
                        }
                        info.setContent(content);
                        info.open(ctrl.map.map, marker);
                        ctrl._onInfo(item);
                    }
                }
            }
            const MAP_EVENTS = ['dragend', 'zoom_changed'];
            let PacemGoogleMapAdapterElement = class PacemGoogleMapAdapterElement extends Maps.PacemMapAdapterElement {
                constructor() {
                    super();
                    this._listeners = [];
                    //#endregion
                    this._mapUpdateHandler = () => {
                        const map = this._map, ctrl = this._container;
                        if (!Pacem.Utils.isNull(map) && !Pacem.Utils.isNull(ctrl)) {
                            const center = map.getCenter();
                            this.updateMapElement(ctrl, { lat: center.lat(), lng: center.lng() }, map.getZoom());
                        }
                    };
                    this._shapes = new Map();
                    this._markersAdapter = new PacemGoogleMarkerAdapter(this);
                }
                popupInfoWindow(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        this._markersAdapter.openInfoWindow(item);
                    }
                }
                popoutInfoWindow(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        this._markersAdapter.closeInfoWindow(item);
                    }
                }
                setView(center, zoom) {
                    const map = this._map;
                    if (!Pacem.Utils.isNull(map)) {
                        if (typeof center === 'number') {
                            map.setZoom(center);
                        }
                        else {
                            map.setCenter(center);
                            if (zoom)
                                map.setZoom(zoom);
                        }
                    }
                }
                get map() {
                    return this._map;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        default:
                            this.invalidateSize();
                            break;
                    }
                }
                // #region ABSTRACT IMPLEMENTATION
                destroy(_) {
                    //const map = this._map;
                    const listeners = this._listeners;
                    while (listeners.length) {
                        google.maps.event.removeListener(listeners.pop());
                    }
                }
                async initialize(container) {
                    await Pacem.CustomElementUtils.importjs(consts.API_URI + '?key=' + this.apiKey);
                    const ctrl = this._container = container;
                    if (Pacem.Utils.isNull(google && google.maps))
                        return;
                    var scale = ctrl.scale;
                    var draggable = ctrl.draggable;
                    var dblClickZoom = ctrl.doubleClickZoom;
                    var kbShortcuts = ctrl.keyboardShortcuts;
                    //
                    const centerPos = Maps.MapUtils.parseCoords(ctrl.center);
                    var center = new google.maps.LatLng(centerPos[0], centerPos[1]);
                    var mapOptions = {
                        zoomControl: scale && !Pacem.Utils.isNullOrEmpty(ctrl.zoomControl),
                        zoomControlOptions: {
                            position: (function (zpos) {
                                switch (zpos) {
                                    case 'topright':
                                        return google.maps.ControlPosition.RIGHT_TOP;
                                    case 'bottomleft':
                                        return google.maps.ControlPosition.LEFT_BOTTOM;
                                    case 'bottomright':
                                        return google.maps.ControlPosition.RIGHT_BOTTOM;
                                    default:
                                        return google.maps.ControlPosition.LEFT_TOP;
                                }
                            })(ctrl.zoomControl)
                        },
                        scrollwheel: ctrl.mousewheel,
                        disableDoubleClickZoom: dblClickZoom,
                        keyboardShortcuts: kbShortcuts,
                        draggable: draggable
                    };
                    var canvas = ctrl.container;
                    var mapElement = document.createElement('div');
                    mapElement.style.width = '100%';
                    mapElement.style.height = '100%';
                    canvas.innerHTML = '';
                    canvas.appendChild(mapElement);
                    var map = this._map = new google.maps.Map(mapElement, mapOptions);
                    if (scale && ctrl.zoomControl) {
                        var zPos = google.maps.ControlPosition.TOP_LEFT;
                        switch (ctrl.zoomControl) {
                            case 'topright':
                                zPos = google.maps.ControlPosition.TOP_RIGHT;
                                break;
                            case 'bottomleft':
                                zPos = google.maps.ControlPosition.BOTTOM_LEFT;
                                break;
                            case 'bottomright':
                                zPos = google.maps.ControlPosition.BOTTOM_RIGHT;
                                break;
                        }
                        var zOptions = {
                            position: zPos
                        };
                        map.setOptions({
                            zoomControlOptions: zOptions
                        });
                    }
                    const listeners = this._listeners;
                    MAP_EVENTS.forEach(evt => {
                        listeners.push(map.addListener(evt, this._mapUpdateHandler));
                    });
                    // setting now the center and zoom, triggers the "load" event and activates the child-components, if any.
                    map.setCenter(center);
                    map.setZoom(ctrl.zoom);
                    // first-load
                    var listener = map.addListener('idle', function once(e) {
                        listener.remove();
                        container.dispatchEvent(new Maps.MapEvent("maploaded"));
                    });
                    // call setView NOW to trigger the load event :(
                    const cnt = Maps.MapUtils.parseCoords(ctrl.center), xpr = new google.maps.LatLng(cnt[0], cnt[1]);
                    map.setCenter(xpr);
                    map.setZoom(ctrl.zoom);
                    return mapElement;
                }
                invalidateSize() {
                    var ctrl = this;
                    if (ctrl.map) {
                        google.maps.event.trigger(ctrl.map, "resize");
                    }
                }
                removeItem(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        var adapter = this._markersAdapter;
                        var marker = adapter.markers.get(item);
                        if (!Pacem.Utils.isNull(marker)) {
                            marker.setMap(null);
                            adapter.markers.delete(item);
                        }
                    }
                    this.fitBounds(true);
                }
                drawItem(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        var adapter = this._markersAdapter;
                        var marker = adapter.drawMarker(item);
                        if (!adapter.markers.has(item))
                            adapter.markers.set(item, marker);
                    }
                    this.fitBounds(true);
                }
                fitBounds(onlyIfAutofit) {
                    if (!this.map)
                        return;
                    const ctrl = this._container;
                    // check against autofit
                    if (!ctrl.autofit && onlyIfAutofit === true)
                        return;
                    const markers = this._markersAdapter.markers, shapes = this._shapes;
                    const map = this._map;
                    // no markers
                    if (!markers.size && !shapes.size) {
                        map.setCenter(ctrl.center);
                        map.setZoom(ctrl.zoom);
                        return;
                    }
                    var bnds = new google.maps.LatLngBounds();
                    var j = 0;
                    for (var m of markers.keys()) {
                        let marker = markers.get(m);
                        if (Pacem.Utils.isNull(marker))
                            continue;
                        const mpos = marker.getPosition();
                        if (mpos) {
                            bnds.extend({ lat: mpos.lat(), lng: mpos.lng() });
                            j++;
                        }
                    }
                    for (var s of shapes.keys()) {
                        var bx = shapes.get(s).getBounds();
                        const sw = bx.getSouthWest(), ne = bx.getNorthEast();
                        bnds.extend({ lat: sw.lat(), lng: sw.lng() });
                        bnds.extend({ lat: ne.lat(), lng: ne.lng() });
                        j += 2;
                    }
                    if (j >= 2)
                        map.fitBounds(bnds);
                    else {
                        if (j == 1) {
                            map.setCenter(bnds.getCenter());
                            map.setZoom(ctrl.zoom);
                        }
                    }
                    //
                    this._padBounds();
                }
                ;
                _padBounds() {
                    const ctrl = this._container;
                    const paddingTop = ctrl.paddingTop || 0, paddingLeft = ctrl.paddingLeft || 0, paddingRight = ctrl.paddingRight || 0, paddingBottom = ctrl.paddingBottom || 0;
                    if (paddingLeft || paddingTop || paddingRight || paddingBottom) {
                        const map = this._map;
                        var bnds = map.getBounds();
                        const w = map.getDiv().clientWidth, h = map.getDiv().clientHeight;
                        //
                        var n_nw = map.getProjection().fromPointToLatLng(new google.maps.Point(-paddingLeft, -paddingTop));
                        var n_se = map.getProjection().fromPointToLatLng(new google.maps.Point(w + paddingRight, h + paddingBottom));
                        //
                        bnds.extend(n_nw);
                        bnds.extend(n_se);
                    }
                }
                _redrawMap() {
                    // do nothing (no tiles)
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemGoogleMapAdapterElement.prototype, "apiKey", void 0);
            __decorate([
                Pacem.Debounce(consts.TIMEOUT)
            ], PacemGoogleMapAdapterElement.prototype, "fitBounds", null);
            PacemGoogleMapAdapterElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-map-adapter-google' })
            ], PacemGoogleMapAdapterElement);
            Maps.PacemGoogleMapAdapterElement = PacemGoogleMapAdapterElement;
        })(Maps = Components.Maps || (Components.Maps = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Maps;
        (function (Maps) {
            const consts = {
                TIMEOUT: 1000,
                API_JS: 'https://unpkg.com/leaflet@1.5.1/dist/leaflet.js',
                API_JS_INTEGRITY: 'sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og==',
                API_CSS: 'https://unpkg.com/leaflet@1.5.1/dist/leaflet.css',
                API_CSS_INTEGRITY: 'sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=='
            };
            class PacemLeafletMarkerAdapter {
                constructor(_map) {
                    this._map = _map;
                    this._markers = new Map();
                }
                get markers() {
                    return this._markers;
                }
                _onDragEnd(item, evt) {
                    var pos = evt.target.getLatLng();
                    item.onDragEnd(pos);
                }
                _onInfo(item) {
                    item.onInfoOpen();
                }
                _onClose(item) {
                    item.onInfoClose();
                }
                drawMarker(item) {
                    var ctrl = this;
                    if (Pacem.Utils.isNull(ctrl._map.map)) {
                        return;
                    }
                    else {
                        if ((Pacem.Utils.isNullOrEmpty(item && item.position) || (item && item.hide))) {
                            if (!Pacem.Utils.isNull(item)) {
                                ctrl._map.removeItem(item);
                                this._markers.delete(item);
                            }
                            return;
                        }
                    }
                    //
                    var marker;
                    if (!ctrl._markers.has(item)) {
                        marker = L.marker(item.position).addTo(ctrl._map.map);
                        marker.on('click', (e) => ctrl.openInfoWindow(item, e));
                        marker.on('drag', () => ctrl._map.fitBounds(true));
                        marker.on('dragend', (e) => ctrl._onDragEnd(item, e));
                        ctrl._markers.set(item, marker);
                    }
                    else
                        marker = ctrl._markers.get(item);
                    marker.setLatLng(item.position);
                    if (typeof item.icon === 'string') {
                        // icon url only
                        ctrl._setIcon(marker, item.icon);
                    }
                    else if (!Pacem.Utils.isNull(item.icon)) {
                        // structured icon
                        let options = { iconUrl: item.icon.url };
                        if (!Pacem.Utils.isNullOrEmpty(item.icon.size)) {
                            Pacem.Utils.extend(options, {
                                iconSize: [item.icon.size.width, item.icon.size.height],
                                iconAnchor: [item.icon.size.width / 2, item.icon.size.height],
                                popupAnchor: [0, -item.icon.size.height]
                            });
                        }
                        if (!Pacem.Utils.isNullOrEmpty(item.icon.anchor)) {
                            Pacem.Utils.extend(options, {
                                iconAnchor: [item.icon.anchor.x, item.icon.anchor.y]
                            });
                        }
                        ctrl._setIcon(marker, new L.Icon(options));
                    }
                    ctrl._setCaption(marker, item.caption);
                    ctrl._setDraggable(marker, item.draggable);
                }
                closeInfoWindow(item, evt) {
                    const ctrl = this, marker = (evt === null || evt === void 0 ? void 0 : evt.target) || ctrl._markers.get(item);
                    marker.closePopup();
                }
                openInfoWindow(item, evt) {
                    var ctrl = this, marker = (evt === null || evt === void 0 ? void 0 : evt.target) || ctrl._markers.get(item), content = item.caption;
                    if (!Maps.MapUtils.isContentEmpty(item)) {
                        content = item.innerHTML;
                    }
                    if (!Pacem.Utils.isNullOrEmpty(content)) {
                        marker
                            .bindPopup(content)
                            .openPopup();
                        ctrl._onInfo(item);
                        marker.on('popupclose', function () {
                            marker.unbindPopup();
                            ctrl._onClose(item);
                        });
                    }
                }
                _setDraggable(marker, v) {
                    if (v === true)
                        marker.dragging.enable();
                    else
                        marker.dragging.disable();
                }
                _setIcon(marker, v) {
                    // legacy (deprecated)
                    if (typeof v === 'string') {
                        var icon = { 'iconUrl': v }, size, anchor, popup;
                        if ((size = this['size']) && /[\d]+,[\d]+/.test(size)) {
                            var ndx = -1;
                            var size0 = [parseInt(size.substring(0, (ndx = size.indexOf(',')))), parseInt(size.substring(ndx + 1))];
                            Object.assign(icon, { 'iconSize': size0 });
                        }
                        if ((anchor = this['anchor']) && /[\d]+,[\d]+/.test(anchor)) {
                            var ndx = -1;
                            var anchor0 = [parseInt(anchor.substring(0, (ndx = anchor.indexOf(',')))), parseInt(anchor.substring(ndx + 1))];
                            Object.assign(icon, { 'iconAnchor': anchor0, 'popupAnchor': [0, -anchor0[1]] });
                        }
                        if ((popup = this['popupAnchor']) && /[\d]+,[\d]+/.test(popup)) {
                            var ndx = -1;
                            var anchor0 = [parseInt(anchor.substring(0, (ndx = anchor.indexOf(',')))), parseInt(anchor.substring(ndx + 1))];
                            Object.assign(icon, { 'popupAnchor': anchor0 });
                        }
                        marker.setIcon(L.icon(icon));
                    }
                    // good
                    else if (v)
                        marker.setIcon(v);
                }
                _setCaption(marker, content) {
                    if (marker.getPopup() && marker.getPopup().getContent() != content)
                        marker.setPopupContent(content);
                }
                removeMarker(item) {
                    const bag = this._markers;
                    if (bag.has(item)) {
                        bag.get(item).remove();
                        bag.delete(item);
                    }
                }
            }
            class PacemLeafletLayerAdapter {
                constructor(_map) {
                    this._map = _map;
                    this._layers = new Map();
                }
                drawLayer(item) {
                    const bag = this._layers;
                    // replace:
                    // remove, if any
                    if (bag.has(item)) {
                        let layer = bag.get(item);
                        if (layer) {
                            layer.remove();
                        }
                    }
                    // check if disabled
                    if (item.hide) {
                        bag.delete(item);
                        return;
                    }
                    // then set again
                    const mode = (item.mode || '').toLowerCase(), map = this._map.map;
                    switch (mode) {
                        case 'wms':
                            let wms = L.tileLayer.wms(item.url, { layers: (item.include || []).join(','), minZoom: item.minZoom, maxZoom: item.maxZoom, transparent: true, format: 'image/png' }).addTo(map);
                            bag.set(item, wms);
                            break;
                        default:
                            let tms = L.tileLayer(item.url, { tms: mode === 'tms', minZoom: item.minZoom, maxZoom: item.maxZoom }).addTo(map);
                            bag.set(item, tms);
                            break;
                    }
                }
                removeLayer(item) {
                    const bag = this._layers;
                    if (bag.has(item)) {
                        bag.get(item).remove();
                        bag.delete(item);
                    }
                }
            }
            let PacemLeafletMapAdapterElement = class PacemLeafletMapAdapterElement extends Maps.PacemMapAdapterElement {
                constructor() {
                    super();
                    this.tiles = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                    this.attribution = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
                    //#endregion
                    this._mapUpdateHandler = () => {
                        const map = this._map, ctrl = this._container;
                        if (!Pacem.Utils.isNull(map) && !Pacem.Utils.isNull(ctrl)) {
                            this.updateMapElement(ctrl, map.getCenter(), map.getZoom());
                        }
                    };
                    this._tileLayer = null;
                    this._shapes = new Map();
                    this._markersAdapter = new PacemLeafletMarkerAdapter(this);
                    this._layersAdapter = new PacemLeafletLayerAdapter(this);
                }
                popupInfoWindow(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        this._markersAdapter.openInfoWindow(item);
                    }
                }
                popoutInfoWindow(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        this._markersAdapter.closeInfoWindow(item);
                    }
                }
                setView(center, zoom) {
                    const map = this._map;
                    if (!Pacem.Utils.isNull(map)) {
                        if (typeof center === 'number') {
                            map.setZoom(center);
                        }
                        else {
                            map.setView(center, zoom || map.getZoom());
                        }
                    }
                }
                get map() {
                    return this._map;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'tiles':
                            this._redrawMap();
                            break;
                    }
                    this.invalidateSize();
                }
                // #region ABSTRACT IMPLEMENTATION
                destroy(_) {
                    this._map.clearAllEventListeners();
                }
                async initialize(container) {
                    await Promise.all([Pacem.CustomElementUtils.importjs(consts.API_JS, consts.API_JS_INTEGRITY, true),
                        Pacem.CustomElementUtils.importcss(consts.API_CSS, consts.API_CSS_INTEGRITY, true)]);
                    const ctrl = this._container = container;
                    var scale = ctrl.scale;
                    var draggable = ctrl.draggable;
                    var dblClickZoom = ctrl.doubleClickZoom;
                    var kbShortcuts = ctrl.keyboardShortcuts;
                    //
                    var center = L.latLng(Maps.MapUtils.parseCoords(ctrl.center));
                    var mapOptions = {
                        zoomControl: scale && !Pacem.Utils.isNullOrEmpty(ctrl.zoomControl),
                        scrollWheelZoom: ctrl.mousewheel,
                        dragging: draggable,
                        doubleClickZoom: !dblClickZoom,
                        keyboard: kbShortcuts
                    };
                    var canvas = ctrl.container;
                    var mapElement = document.createElement('div');
                    mapElement.style.width = '100%';
                    mapElement.style.height = '100%';
                    canvas.innerHTML = '';
                    canvas.appendChild(mapElement);
                    var map = this._map = L.map(mapElement, mapOptions);
                    ['zoomend', 'moveend'].forEach(evt => {
                        map.on(evt, _ => {
                            this._idleFiller();
                            this._mapUpdateHandler();
                        });
                    });
                    map.on('load', () => {
                        if (scale && ctrl.zoomControl) {
                            map.zoomControl.setPosition(ctrl['zoomControl']);
                        }
                        this._idleFiller();
                    });
                    this._tileLayer = L.tileLayer(this.tiles, { attribution: this.attribution }).addTo(map);
                    // setting now the center and zoom, triggers the "load" event and activates the child-components, if any.
                    /*
                    LeafletJS docs: Map's "load" Event
                    "Fired when the map is initialized (when its center and zoom are set for the first time)."
                    (http://leafletjs.com/reference.html#map-events)
                    */
                    map.setView(center, ctrl.zoom);
                    // first-load
                    map.once('idle', function () {
                        map.fire('resize');
                        container.dispatchEvent(new Maps.MapEvent("maploaded"));
                    });
                    // call setView NOW to trigger the load event :(
                    const cnt = Maps.MapUtils.parseCoords(ctrl.center), xpr = [cnt[0], cnt[1]];
                    map.setView(xpr, ctrl.zoom);
                    return mapElement;
                }
                invalidateSize() {
                    var ctrl = this;
                    if (ctrl.map)
                        ctrl.map.invalidateSize();
                }
                removeItem(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        this._markersAdapter.removeMarker(item);
                    }
                    else if (item instanceof Maps.PacemMapLayerElement) {
                        this._layersAdapter.removeLayer(item);
                    }
                    this.fitBounds(true);
                }
                drawItem(item) {
                    if (item instanceof Maps.PacemMapMarkerElement) {
                        this._markersAdapter.drawMarker(item);
                    }
                    else if (item instanceof Maps.PacemMapLayerElement) {
                        this._layersAdapter.drawLayer(item);
                    }
                    this.fitBounds(true);
                }
                _idleFiller() {
                    var ctrl = this;
                    if (ctrl.map) {
                        ctrl.map.fire('idle');
                    }
                }
                fitBounds(onlyIfAutofit) {
                    if (!this.map)
                        return;
                    var ctrl = this._container;
                    // check against autofit
                    if (!ctrl.autofit && onlyIfAutofit === true)
                        return;
                    var markers = this._markersAdapter.markers, shapes = this._shapes;
                    // no markers
                    if (!markers.size && !shapes.size) {
                        this._map.setView(Maps.MapUtils.parseCoords(ctrl.center), ctrl.zoom);
                        return;
                    }
                    var bnds = [];
                    for (var m of markers.keys()) {
                        let marker = markers.get(m);
                        if (Pacem.Utils.isNull(marker))
                            continue;
                        Maps.MapUtils.expandBounds(bnds, marker.getLatLng());
                    }
                    for (var s of shapes.keys()) {
                        var bx = shapes.get(s).getBounds();
                        Maps.MapUtils.expandBounds(bnds, bx.getSouthWest());
                        Maps.MapUtils.expandBounds(bnds, bx.getNorthEast());
                    }
                    var paddingTop = ctrl.paddingTop, paddingLeft = ctrl.paddingLeft, paddingRight = ctrl.paddingRight, paddingBottom = ctrl.paddingBottom;
                    var pads = { 'paddingTopLeft': new L.Point(paddingLeft, paddingTop), 'paddingBottomRight': new L.Point(paddingRight, paddingBottom) };
                    if (bnds.length >= 2 || (bnds.length == 1 && (paddingTop || paddingLeft || paddingBottom || paddingRight))) {
                        const bounds = L.latLngBounds(bnds), ne = bounds.getNorthEast(), sw = bounds.getSouthWest();
                        try {
                            this.map.fitBounds([[ne.lat, ne.lng], [sw.lat, sw.lng]], pads);
                        }
                        catch (e) {
                            throw e;
                        }
                    }
                    else {
                        if (bnds.length == 1)
                            this.map.setView(bnds[0], ctrl.zoom);
                    }
                }
                ;
                _redrawMap() {
                    var ctrl = this;
                    if (!Pacem.Utils.isNull(ctrl.tiles && ctrl._tileLayer))
                        ctrl._tileLayer.setUrl(ctrl.tiles);
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemLeafletMapAdapterElement.prototype, "tiles", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemLeafletMapAdapterElement.prototype, "attribution", void 0);
            __decorate([
                Pacem.Debounce(500)
            ], PacemLeafletMapAdapterElement.prototype, "_idleFiller", null);
            __decorate([
                Pacem.Debounce(consts.TIMEOUT)
            ], PacemLeafletMapAdapterElement.prototype, "fitBounds", null);
            PacemLeafletMapAdapterElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-map-adapter-leaflet' })
            ], PacemLeafletMapAdapterElement);
            Maps.PacemLeafletMapAdapterElement = PacemLeafletMapAdapterElement;
        })(Maps = Components.Maps || (Components.Maps = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
