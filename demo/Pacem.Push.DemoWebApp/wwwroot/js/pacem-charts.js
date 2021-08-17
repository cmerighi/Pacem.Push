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
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Charts;
        (function (Charts) {
            Charts.MANAGED_EVENTS = ['keydown', 'keyup', 'click', 'dblclick', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousedown', 'mouseup', 'mousemove', 'contextmenu'];
            function logN(N, x) {
                return Math.log10(x) / Math.log10(N);
            }
            const MSECS_PER_DAY = 1000 * 60 * 60 * 24;
            const MAX_X_LABELS = 10;
            const MAX_Y_LABELS = 10;
            const SERIES_DATAITEM = 'pacem:chart-series:dataitem';
            function getEvenlySpaced(items, type, min, max, formatOrLang, labels = MAX_X_LABELS) {
                const length = (type === 'number' || type === 'date') ? (max - min) : Math.max(1, items.length - 1);
                const gaps = labels - 1;
                var retval = [];
                var step = 1;
                for (var l = gaps; l > 1; l--) {
                    if ((length % l) === 0) {
                        step = length / l;
                        break;
                    }
                }
                if (step === 1 /* coprime number? */ && length > labels) {
                    step = length;
                }
                const fnDate = typeof formatOrLang === 'function' ? formatOrLang : (step >= MSECS_PER_DAY ? ((d) => d.toLocaleDateString(formatOrLang)) : ((d) => d.toLocaleTimeString(formatOrLang)));
                const fnDateFirst = typeof formatOrLang === 'function' ? formatOrLang : (step < MSECS_PER_DAY ? ((d) => d.toLocaleString(formatOrLang)) : fnDate);
                const fnNum = typeof formatOrLang === 'function' ? formatOrLang : (n) => n.toLocaleString(formatOrLang);
                for (var j = 0; j <= length; j += step) {
                    let label;
                    switch (type) {
                        case 'string':
                            if (j >= items.length) {
                                continue;
                            }
                            label = items[j].label;
                            break;
                        case 'number':
                            label = fnNum(min + j);
                            break;
                        case 'date':
                            let date = Pacem.Utils.parseDate(min + j);
                            let fn = (j == 0) ? fnDateFirst : fnDate;
                            label = fn(date);
                            break;
                        default:
                            throw 'Not supported.';
                    }
                    retval.push(label);
                }
                return retval;
            }
            function getRoundedBoundaries(a0, a1, step) {
                if (!(step > 0)) {
                    step = bestGuessedDensity(a0, a1);
                }
                const magn = logN(step, a1 - a0), rounder = Math.pow(step, Math.floor(magn));
                return {
                    min: Math.floor(a0 / rounder) * rounder,
                    max: Math.ceil(a1 / rounder) * rounder,
                    round: rounder
                };
            }
            function bestGuessedDensity(min, max) {
                const delta = max - min;
                if (!(delta > 0)) {
                    return 2;
                }
                const oom = Math.floor(Math.log10(delta));
                const exp = Math.pow(10, -oom);
                // bring everything to a single digit format
                if (oom != 0) {
                    return bestGuessedDensity(min * exp, max * exp);
                }
                const capFn = (n) => {
                    const norm = Math.floor(Math.abs(n) * 10), limit = norm + 10 - (norm % 10);
                    return limit.roundoff();
                };
                const b = capFn(delta);
                let a = 10;
                if (min !== 0) {
                    a = capFn(Math.abs(max));
                }
                const ret = gcd(a, b);
                return ret === 1 ? b : Math.max(ret, 10 - ret);
            }
            function gcd(a, b) {
                if (a <= 0) {
                    return b;
                }
                return gcd(b % a, a);
            }
            class ChartEvent extends Pacem.CustomUIEvent {
                constructor(type, eventInit, originalEvent) {
                    super(type, eventInit, originalEvent);
                }
            }
            Charts.ChartEvent = ChartEvent;
            let PacemChartSeriesElement = class PacemChartSeriesElement extends Components.PacemItemElement {
                get values() {
                    return this.datasource;
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemChartSeriesElement.prototype, "datasource", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemChartSeriesElement.prototype, "label", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemChartSeriesElement.prototype, "color", void 0);
            __decorate([
                Pacem.Watch( /* to be set programmatically (internally) */)
            ], PacemChartSeriesElement.prototype, "_uiElements", void 0);
            PacemChartSeriesElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-chart-series' })
            ], PacemChartSeriesElement);
            Charts.PacemChartSeriesElement = PacemChartSeriesElement;
            const SVG_NS = "http://www.w3.org/2000/svg";
            class PacemSeriesChartElement extends Components.PacemItemsContainerElement {
                constructor() {
                    super();
                    this._itemPropertyChangedCallback = (evt) => {
                        const propName = evt.detail.propertyName;
                        if (propName === 'datasource'
                            || propName === 'label'
                            || propName === 'cssClass'
                            || propName === 'color') {
                            this.draw();
                        }
                    };
                    this._series = [];
                    this._resizeHandler = (evt) => {
                        this._size = evt.detail;
                        this.draw();
                    };
                    // #endregion
                    this._broadcastHandler = (e) => {
                        /* Don't mess with the events:
                         * keep the original (trusted) events with their well-known names
                         * and provide a method to retrieve the 'ChartDataItem' based on the the eventTarget. */
                        const element = e.currentTarget;
                        const dataItem = Pacem.CustomElementUtils.getAttachedPropertyValue(element, SERIES_DATAITEM);
                        if (Pacem.Utils.isNull(dataItem)) {
                            return;
                        }
                        const chart = this, anchorPoint = chart.getAnchorPoint(element);
                        const evt = new ChartEvent('item' + e.type, { detail: { dataItem, anchorPoint } }, e);
                        chart.dispatchEvent(evt);
                    };
                    this._key = Pacem.Utils.uniqueCode();
                }
                validate(item) {
                    return item instanceof PacemChartSeriesElement;
                }
                register(item) {
                    if (super.register(item)) {
                        item.addEventListener(Pacem.PropertyChangeEventName, this._itemPropertyChangedCallback, false);
                        return true;
                    }
                    return false;
                }
                unregister(item) {
                    if (super.unregister(item)) {
                        item.removeEventListener(Pacem.PropertyChangeEventName, this._itemPropertyChangedCallback, false);
                        return true;
                    }
                    return false;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'target') {
                        if (this._div != old) {
                            this._div && this._div.remove();
                        }
                        // reset
                        this._div = null;
                        this._body = null; // <- get checked on next draw
                        const eold = old;
                        if (eold) {
                            eold.classList.remove(Pacem.PCSS + '-chart-area');
                            eold.innerHTML = '';
                        }
                        this._ensureResizer();
                        this.draw();
                    }
                    else if (!first) {
                        switch (name) {
                            case 'items':
                                this._databindAndDrawDebounced();
                                break;
                            case 'datasource':
                                this._databind();
                            // fall down to draw() call.
                            case 'yAxisDensity':
                            case 'xAxisType':
                            case 'xAxisPosition':
                            case 'yAxisFormat':
                                this.draw();
                                break;
                        }
                    }
                }
                _databindAndDrawDebounced() {
                    cancelAnimationFrame(this._handle);
                    this._handle = requestAnimationFrame(() => {
                        this._databind();
                        this.draw();
                    });
                }
                _databind() {
                    this._datasource = Pacem.Utils.isNullOrEmpty(this.datasource) ? this.items : this.datasource;
                }
                disconnectedCallback() {
                    this._div && this._div.remove();
                    const resizer = this._resizer;
                    if (!Pacem.Utils.isNull(resizer)) {
                        resizer.removeEventListener('resize', this._resizeHandler, false);
                        resizer.remove();
                    }
                    super.disconnectedCallback();
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._ensureResizer();
                    this._databind();
                    this.draw();
                }
                _ensureResizer(target = this.target || this._div) {
                    if (Pacem.Utils.isNull(this._resizer)) {
                        const resizer = this._resizer = this.parentElement.insertBefore(new Components.PacemResizeElement(), this);
                        resizer.addEventListener('resize', this._resizeHandler, false);
                    }
                    this._resizer.target = target;
                }
                // #region OO-scoped props
                get chartSize() {
                    return this._size;
                }
                get chartSeries() {
                    return this._series;
                }
                get chartBody() {
                    return this._body;
                }
                get chartGrid() {
                    return this._grid;
                }
                get chartMask() {
                    return this._mask;
                }
                get chartKey() {
                    return this._key;
                }
                get chartContainer() {
                    return this._div;
                }
                assignUiBehaviors(ui, series, data, color) {
                    const alreadyRegistered = !Pacem.Utils.isNull(Pacem.CustomElementUtils.getAttachedPropertyValue(ui, SERIES_DATAITEM));
                    const item = { series: series.label, label: data.label, value: data.value, color: color || series.color };
                    Pacem.CustomElementUtils.setAttachedPropertyValue(ui, SERIES_DATAITEM, item);
                    if (!alreadyRegistered) {
                        Charts.MANAGED_EVENTS.forEach(type => {
                            ui.addEventListener(type, this._broadcastHandler);
                        });
                    }
                }
                disposeUiBehaviors(ui) {
                    Pacem.CustomElementUtils.deleteAttachedPropertyValue(ui, SERIES_DATAITEM);
                    Charts.MANAGED_EVENTS.forEach(type => {
                        ui.removeEventListener(type, this._broadcastHandler);
                    });
                }
                ensureChartContainer() {
                    if (Pacem.Utils.isNull(this._div)) {
                        let div = this._div = this.target || document.createElement('div');
                        div.classList.add(Pacem.PCSS + '-chart-area');
                        if (div != this.target) {
                            this.parentElement.insertBefore(div, this);
                        }
                    }
                    return this._div;
                }
                ensureChartBody(type, w, h) {
                    if (Pacem.Utils.isNull(this._body)) {
                        let svg = this._body = document.createElementNS(SVG_NS, 'svg');
                        svg.setAttribute('pacem', '');
                        svg.setAttribute('class', Pacem.PCSS + '-' + type + '-chart');
                        svg.setAttribute('preserveAspectRatio', 'xMinYMax slice');
                        const g = this._grid = document.createElementNS(SVG_NS, 'svg');
                        g.setAttribute('pacem', '');
                        g.setAttribute('class', 'chart-grid');
                        // put mask on series
                        let defs = document.createElementNS(SVG_NS, 'defs');
                        let mask = this._mask = document.createElementNS(SVG_NS, 'mask');
                        // black (hides)
                        let rect = document.createElementNS(SVG_NS, 'rect');
                        rect.setAttribute('x', '0');
                        rect.setAttribute('y', '0');
                        rect.setAttribute('width', '100%');
                        rect.setAttribute('height', '100%');
                        // white (shows)
                        let rect0 = document.createElementNS(SVG_NS, 'rect');
                        rect0.setAttribute('y', '0');
                        rect0.setAttribute('width', '100%');
                        rect0.setAttribute('fill', '#fff');
                        mask.id = 'gnrc_mask_' + this._key;
                        mask.appendChild(rect);
                        mask.appendChild(rect0);
                        // place mask on series so that lines won't be rendered outside the grid borders
                        //g2.setAttribute('mask', 'url(#' + mask.id + ')');
                        defs.appendChild(mask);
                        svg.appendChild(defs);
                        svg.appendChild(g);
                        this._div.appendChild(svg);
                    }
                    return this._body;
                }
                chartDataItemToPoint(input, source) {
                    switch (this.xAxisType || 'string') {
                        case 'number':
                            return { x: parseFloat(input.label), y: input.value };
                        case 'date':
                            return { x: Pacem.Utils.parseDate(input.label).valueOf(), y: input.value };
                        case 'string':
                            return { x: source.findIndex(e => e.label == input.label), y: input.value };
                        default:
                            throw 'Not supported.';
                    }
                }
                getVirtualGrid(items, minX, maxX, minY, maxY, xAxisType = this.xAxisType, steps) {
                    const rangeY = getRoundedBoundaries(minY, maxY, steps), stepY = rangeY.round;
                    // fill y-axis array
                    var y = [];
                    for (let j = rangeY.min; j <= rangeY.max; j += stepY) {
                        y.push(j.roundoff());
                    }
                    // fill x-axis array;
                    let lang = Pacem.Utils.lang(this);
                    let format = null;
                    const intl = this.xAxisFormat;
                    if (!Pacem.Utils.isNullOrEmpty(intl)) {
                        switch (xAxisType) {
                            case 'number':
                                format = (n) => Intl.NumberFormat(lang, intl).format(n);
                                break;
                            case 'date':
                                format = (n) => Intl.DateTimeFormat(lang, intl).format(Pacem.Utils.parseDate(n));
                                break;
                        }
                    }
                    const x = getEvenlySpaced(items, xAxisType, minX, maxX, format !== null && format !== void 0 ? format : lang);
                    return { x: x, y: y };
                }
                wipeOut(series = this._series, startIndex = 0) {
                    for (var j = series.length - 1; j >= startIndex; j--) {
                        series[j].remove();
                    }
                    series.splice(startIndex);
                }
                buildLinearGradient(seriesIndex, invert = false) {
                    const grad = document.createElementNS(SVG_NS, 'linearGradient');
                    grad.id = this.chartKey + '_grad' + seriesIndex + (invert ? '_inverted' : '');
                    if (invert) {
                        Pacem.Utils.addClass(grad, 'bottom-up');
                    }
                    grad.setAttribute('x1', '0%');
                    grad.setAttribute('x2', '0%');
                    grad.setAttribute('y1', '0%');
                    grad.setAttribute('y2', '100%');
                    grad.setAttribute('spreadMethod', 'pad');
                    const stop1 = document.createElementNS(SVG_NS, 'stop');
                    stop1.setAttribute('offset', '0%');
                    const stop2 = document.createElementNS(SVG_NS, 'stop');
                    stop2.setAttribute('offset', '100%');
                    grad.appendChild(stop1);
                    grad.appendChild(stop2);
                    return grad;
                }
                setGradientColor(grad, color) {
                    for (let j = 0; j < grad.children.length; j++) {
                        const stop = grad.children.item(j);
                        if (stop instanceof SVGStopElement) {
                            stop.style.stopColor = color;
                        }
                    }
                }
                estimateYAxisLabelWidth(max) {
                    const txt = this.formatYAxisLabel(max);
                    return this.estimateLabelWidth(txt);
                }
                estimateLabelWidth(txt) {
                    const grid = this._grid;
                    if (Pacem.Utils.isNull(grid)) {
                        throw new Error('Unable to estimate label without an underlying grid available.');
                    }
                    const lbl = document.createElementNS(SVG_NS, 'text');
                    lbl.textContent = txt;
                    grid.appendChild(lbl);
                    const size = Pacem.Utils.offset(lbl);
                    lbl.remove();
                    return size.width;
                }
                formatYAxisLabel(y) {
                    const intl = this.yAxisFormat;
                    return Pacem.Utils.isNullOrEmpty(intl) ? y.toString() : Intl.NumberFormat(Pacem.Utils.lang(this), intl).format(y);
                }
                estimateXAxisLabelWidth(max) {
                    const txt = this.formatXAxisLabel(max);
                    return this.estimateLabelWidth(txt);
                }
                formatXAxisLabel(x) {
                    const intl = this.xAxisFormat, lang = Pacem.Utils.lang(this);
                    switch (this.xAxisType) {
                        case 'date':
                            const date = Pacem.Utils.Dates.parse(x);
                            return Pacem.Utils.isNullOrEmpty(intl) ? date.toLocaleString(lang) : Intl.DateTimeFormat(lang, intl).format(date);
                        case 'number':
                            const num = x;
                            return Pacem.Utils.isNullOrEmpty(intl) ? num.toLocaleString(lang) : Intl.NumberFormat(lang, intl).format(num);
                        default:
                            return x;
                    }
                }
                draw() {
                    this.drawSeries(this._datasource);
                }
                /**
                 * Default implementation.
                 * @param element
                 */
                getAnchorPoint(element) {
                    const rect = Pacem.Utils.offset(element);
                    return { x: rect.left + rect.width * .5, y: rect.top + rect.height * .5 };
                }
            }
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Element })
            ], PacemSeriesChartElement.prototype, "target", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemSeriesChartElement.prototype, "xAxisType", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemSeriesChartElement.prototype, "xAxisPosition", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemSeriesChartElement.prototype, "datasource", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemSeriesChartElement.prototype, "yAxisDensity", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemSeriesChartElement.prototype, "yAxisFormat", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemSeriesChartElement.prototype, "xAxisFormat", void 0);
            Charts.PacemSeriesChartElement = PacemSeriesChartElement;
        })(Charts = Components.Charts || (Components.Charts = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Charts;
        (function (Charts) {
            const SVG_NS = "http://www.w3.org/2000/svg";
            const PADDING_PIXELS = 24;
            let PacemColumnChartElement = class PacemColumnChartElement extends Charts.PacemSeriesChartElement {
                constructor() {
                    super(...arguments);
                    /** Set a value between 0 and 1, for the columns' stack/cluster horizontal size (percentage of the available space). */
                    this.groupWidth = .0;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'type' || name === 'groupWidth') {
                        this.draw();
                    }
                }
                _safen(w = this.groupWidth) {
                    return Math.min(1, Math.max(w || .75, 0));
                }
                drawSeries(datasource) {
                    if (!this.isReady || Pacem.Utils.isNull(this.chartSize)) {
                        return;
                    }
                    const div = this.ensureChartContainer();
                    const type = this.type || 'cluster';
                    const padding = PADDING_PIXELS;
                    // resize all
                    var size = this.chartSize;
                    if (size.height <= padding || size.width <= padding) {
                        return;
                    }
                    // items && labels?
                    if (Pacem.Utils.isNullOrEmpty(datasource) || datasource.every(i => Pacem.Utils.isNullOrEmpty(i.values))) {
                        this.wipeOut();
                        return;
                    }
                    const body = this.ensureChartBody('column', size.width, size.height);
                    // from now on, drawing...
                    this.log(Pacem.Logging.LogLevel.Debug, `Drawing ${type} chart.`);
                    // #region computations
                    const xAxisType = this.xAxisType || 'string';
                    let minY = 0, maxY = 0, minX = 0, maxX = 0, maxCount = 0;
                    let stretch = 1;
                    const accumulator = { negative: [], positive: [] };
                    // individuate the min/max x & y in order correctly apply aspect ratio...
                    for (let series of datasource) {
                        let data = series.values;
                        if (!Pacem.Utils.isNullOrEmpty(data)) {
                            let j = 0;
                            for (let item of data) {
                                accumulator.positive[j] = accumulator.positive[j] || 0;
                                accumulator.negative[j] = accumulator.negative[j] || 0;
                                let pt = this.chartDataItemToPoint(item, data);
                                minY = Math.min(minY, pt.y);
                                maxY = Math.max(maxY, pt.y);
                                minX = Math.min(minX, pt.x);
                                maxX = Math.max(maxX, pt.x);
                                if (pt.y > 0) {
                                    accumulator.positive[j] += pt.y;
                                }
                                else if (pt.y < 0) {
                                    accumulator.negative[j] += pt.y;
                                }
                                j++;
                            }
                            maxCount = Math.max(maxCount, data.length);
                        }
                    }
                    const stacked = type === 'stack';
                    if (stacked) {
                        minY = Math.min.apply(null, accumulator.negative);
                        maxY = Math.max.apply(null, accumulator.positive);
                    }
                    // estimate y-axis max width
                    const paddingYAxis = Math.max(padding, this.estimateYAxisLabelWidth(maxY) + PADDING_PIXELS * .5);
                    if (maxX === 0 && maxX === minX) {
                        maxX = 1;
                    }
                    // add "1 slot" (half at the beginning and half after the end)
                    const slot = (maxX - minX) / maxCount, halfSlot = slot * .5, 
                    // the following are usefule during the very rendering
                    availSlot = slot * this._safen(this.groupWidth), halfAvailSlot = availSlot * .5;
                    /** virtual grid made of x- and y-axis labels */
                    const withValues = datasource.find(i => !Pacem.Utils.isNullOrEmpty(i.values));
                    const grid = this.getVirtualGrid(withValues.values, minX - halfSlot, maxX + halfSlot, minY, maxY, xAxisType, this.yAxisDensity);
                    const topGrid = grid.y[grid.y.length - 1], bottomGrid = grid.y[0];
                    if (topGrid === bottomGrid) {
                        return;
                    }
                    /** width of the WHOLE series dedicated area */
                    const seriesWidth = size.width - 2 * paddingYAxis;
                    /** height of the WHOLE series dedicated area */
                    const gridHeight = (size.height - 2 * padding);
                    const seriesHeight = gridHeight * (1 - (topGrid - bottomGrid - (maxY - minY)) / (topGrid - bottomGrid));
                    const seriesY = gridHeight * (topGrid - maxY) / (topGrid - bottomGrid);
                    // consider padding
                    stretch = seriesWidth / seriesHeight;
                    body.setAttribute('height', size.height.toString());
                    body.setAttribute('width', size.width.toString());
                    body.setAttribute('viewBox', `0 0 ${size.width} ${size.height}`);
                    // #endregion
                    // #region render series
                    let iter = 0;
                    // normalize
                    const spanX = maxX - minX, spanY = maxY - minY;
                    const normX = 100 * stretch / spanX, normY = 100 / spanY;
                    const normPadding = 100 * padding / seriesHeight;
                    const chartSeries = this.chartSeries;
                    const chartGrid = this.chartGrid;
                    const xPad = (halfSlot - minX) * normX;
                    const buildPoint = (it, series) => {
                        const p = this.chartDataItemToPoint(it, series);
                        return {
                            x: xPad + p.x * 2 * xPad,
                            y: p.y * normY
                        };
                    };
                    var accumulators = new Array(maxCount);
                    for (let series of datasource) {
                        // does the series svg exist?
                        let svg;
                        let grad;
                        let gradInv;
                        let g;
                        if (chartSeries.length > iter) {
                            svg = chartSeries[iter];
                            grad = svg.firstElementChild.firstElementChild;
                            gradInv = svg.firstElementChild.lastElementChild;
                            g = svg.lastElementChild;
                        }
                        else {
                            svg = document.createElementNS(SVG_NS, 'svg');
                            svg.setAttribute('pacem', '');
                            chartGrid.insertAdjacentElement('afterend', svg);
                            const defs = document.createElementNS(SVG_NS, 'defs');
                            defs.appendChild(grad = this.buildLinearGradient(iter));
                            defs.appendChild(gradInv = this.buildLinearGradient(iter, true));
                            svg.appendChild(defs);
                            svg.appendChild(g = document.createElementNS(SVG_NS, 'g'));
                            chartSeries.push(svg);
                        }
                        // series positioning:
                        /*
                         --------------------------------------
                         |   |--------------------------------|
                         |pad|         series here            |
                         |   |--------------------------------|
                         --------------------------------------
                         |   |             pad                |
                         --------------------------------------
                         */
                        var className = 'chart-series series-fill';
                        if (!Pacem.Utils.isNullOrEmpty(series.className)) {
                            className += ' ' + series.className;
                        }
                        svg.setAttribute('class', className);
                        svg.setAttribute('x', paddingYAxis.toString());
                        svg.setAttribute('y', seriesY.toString());
                        svg.setAttribute('width', seriesWidth.toString());
                        svg.setAttribute('height', (seriesHeight + 2 * padding).toString());
                        const data = series.values;
                        const spinRect = (index) => {
                            while (index >= g.children.length) {
                                g.appendChild(document.createElementNS(SVG_NS, 'rect'));
                            }
                            const rect = g.children.item(index);
                            rect.style.stroke = series.color;
                            const gradient = data[index].value < 0 ? gradInv : grad;
                            this.setGradientColor(gradient, series.color);
                            rect.style.fill = `url(#${gradient.id})`;
                            return rect;
                        };
                        // fix 0 y
                        const precision = 10;
                        const assignVerticalCoordsCoords = (rect, pt0, pt, pt0Start = pt0) => {
                            const y = -Math.max(pt0.y, pt.y), h = Math.abs(pt.y - pt0.y);
                            const fnAssign = () => {
                                rect.setAttribute('y', y.toFixed(precision));
                                rect.setAttribute('height', h.toFixed(precision));
                            };
                            if (!rect.hasAttribute('y')) {
                                // boostrap easing animated transition
                                rect.setAttribute('y', '-' + pt0Start.y.toFixed(precision));
                                rect.setAttribute('height', '0');
                                requestAnimationFrame(fnAssign);
                            }
                            else {
                                fnAssign();
                            }
                        };
                        if (!Pacem.Utils.isNullOrEmpty(data)) {
                            ;
                            const pt00 = buildPoint({ value: 0, label: data[0].label }, data);
                            if (stacked) {
                                // #region STACK
                                const iHalfAvailSlot = halfAvailSlot * normX, iAvailSlotAttr = (availSlot * normX).toFixed(precision);
                                for (let j = 0; j < data.length; j++) {
                                    const item = data[j];
                                    if (Pacem.Utils.isNullOrEmpty(accumulators[j])) {
                                        accumulators[j] = { positive: 0, negative: 0 };
                                    }
                                    const accumulator = accumulators[j];
                                    let posCursor = accumulator.positive, negCursor = accumulator.negative;
                                    const neg = item.value < 0, y = neg ? negCursor : (posCursor + item.value), y0 = neg ? (negCursor + item.value) : posCursor;
                                    const pt = buildPoint({ label: item.label, value: y }, data);
                                    const pt0 = buildPoint({ label: item.label, value: y0 }, data);
                                    const x = pt.x - iHalfAvailSlot;
                                    const rect = spinRect(j);
                                    this.assignUiBehaviors(rect, series, item);
                                    rect.setAttribute('x', x.toFixed(precision));
                                    rect.setAttribute('width', iAvailSlotAttr);
                                    assignVerticalCoordsCoords(rect, pt0, pt, pt00);
                                    if (neg) {
                                        accumulator.negative = y0;
                                    }
                                    else {
                                        accumulator.positive = y;
                                    }
                                }
                                // #endregion
                            }
                            else {
                                // #region CLUSTER
                                const iHalfAvailSlot = halfAvailSlot * normX, iSlot = (iHalfAvailSlot * 2) / datasource.length, //,
                                iSlotAttr = iSlot.toFixed(precision);
                                for (let j = 0; j < data.length; j++) {
                                    // looping through the series-data
                                    const item = data[j];
                                    const pt = buildPoint(item, data);
                                    const x = pt.x - iHalfAvailSlot + iSlot * iter;
                                    const rect = spinRect(j);
                                    this.assignUiBehaviors(rect, series, item);
                                    rect.setAttribute('x', x.toFixed(precision));
                                    rect.setAttribute('width', iSlotAttr);
                                    assignVerticalCoordsCoords(rect, pt00, pt);
                                }
                                // #endregion
                            }
                        }
                        // cleanup exceeding rects
                        for (let j = g.children.length - 1; j >= (data === null || data === void 0 ? void 0 : data.length) || 0; j--) {
                            const rect = g.children.item(j);
                            this.disposeUiBehaviors(rect);
                            rect.remove();
                        }
                        // tick
                        iter++;
                    }
                    // remove exceeding series
                    this.wipeOut(chartSeries, iter);
                    const w0 = 100 * stretch, h0 = 100 + 2 * normPadding, x0 = 0, //minX * normX,
                    y0 = maxY * normY + normPadding;
                    const svbox = `${x0} ${-y0} ${w0} ${h0}`;
                    for (var svg of chartSeries) {
                        svg.setAttribute('viewBox', svbox);
                    }
                    const chartMask = this.chartMask;
                    let mask = chartMask.children.item(1);
                    mask.setAttribute('x', x0.toString());
                    mask.setAttribute('height', (size.height - padding).toString());
                    // #endregion
                    // #region grid
                    chartGrid.setAttribute('viewBox', `0 0 ${size.width} ${size.height}`);
                    if (grid.x.length < 1 || grid.y.length <= 1) {
                        for (let j = chartGrid.children.length - 1; j >= 0; j--) {
                            chartGrid.children.item(j).remove();
                        }
                        return;
                    }
                    let pgrid;
                    if (chartGrid.children.length > 0) {
                        pgrid = chartGrid.children.item(0);
                    }
                    else {
                        pgrid = document.createElementNS(SVG_NS, 'path');
                        chartGrid.appendChild(pgrid);
                    }
                    const tick = PADDING_PIXELS * .25;
                    let lblCounter = 0;
                    let ensureLabel = (index, x, y, txt) => {
                        const ndx = index + /* <path> is the first child element */ 1;
                        let lbl;
                        if (chartGrid.children.length <= ndx) {
                            lbl = document.createElementNS(SVG_NS, 'text');
                            chartGrid.appendChild(lbl);
                        }
                        else {
                            lbl = chartGrid.children.item(ndx);
                        }
                        lbl.textContent = txt;
                        lbl.setAttribute('x', x.toString());
                        lbl.setAttribute('y', y.toString());
                        return lbl;
                    };
                    let dgrid = `M${paddingYAxis},${padding} v${gridHeight}`; //H${w}
                    // x
                    let j = 0;
                    const xincr = seriesWidth / (grid.x.length /*- 1 consider the extra slot */), yincr = gridHeight / (grid.y.length - 1);
                    if (this.xAxisPosition !== 'none') {
                        const paddingX = xincr * .5 + paddingYAxis;
                        for (var x of grid.x) {
                            let xcoord = paddingX + j * xincr;
                            if (this.xAxisPosition === 'top') {
                                dgrid += ` M${xcoord},${padding} v${-tick}`;
                                let lbl = ensureLabel(lblCounter++, xcoord, 0, x);
                                lbl.setAttribute('text-anchor', 'middle');
                                lbl.setAttribute('alignment-baseline', 'hanging');
                            }
                            else {
                                let ycoord = gridHeight + padding;
                                dgrid += ` M${xcoord},${ycoord} v${tick}`;
                                ensureLabel(lblCounter++, xcoord, ycoord + padding, x).setAttribute('text-anchor', 'middle');
                            }
                            j++;
                        }
                    }
                    // y
                    j = 0;
                    for (var y of grid.y) {
                        const ycoord = gridHeight + padding - j * yincr, xcoord = paddingYAxis - tick;
                        dgrid += ` M${xcoord},${ycoord} H${(seriesWidth + paddingYAxis)}`;
                        let txt = this.formatYAxisLabel(y);
                        ensureLabel(lblCounter++, xcoord - tick, ycoord, txt).setAttribute('text-anchor', 'end');
                        j++;
                    }
                    pgrid.setAttribute('d', dgrid);
                    // exceeding labels?
                    for (let j = chartGrid.children.length - 1; j > lblCounter; j--) {
                        chartGrid.children.item(j).remove();
                    }
                    // #endregion
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemColumnChartElement.prototype, "type", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemColumnChartElement.prototype, "groupWidth", void 0);
            PacemColumnChartElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-column-chart' })
            ], PacemColumnChartElement);
            Charts.PacemColumnChartElement = PacemColumnChartElement;
        })(Charts = Components.Charts || (Components.Charts = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Charts;
        (function (Charts) {
            /**
             * Returns the anchor points for a Bézier curve.
             * @param p The actual point.
             * @param p0 The previous point, if any.
             * @param p1 The next point, if any.
             */
            function getSplineCtrlPoints(p, p0, p1) {
                let c0 = p, c1 = p;
                const p0Null = Pacem.Utils.isNull(p0), p1Null = Pacem.Utils.isNull(p1);
                if (!(p0Null && p1Null)) {
                    const portion = 3;
                    let m0, m1;
                    if (!p0Null) {
                        m0 = (p.y - p0.y) / (p.x - p0.x);
                    }
                    if (!p1Null) {
                        m1 = (p1.y - p.y) / (p1.x - p.x);
                    }
                    // average slope
                    const m = ((m1 || (m0 || 0)) + (m0 || (m1 || 0))) / 2;
                    const dx0 = p0Null ? 0 : (p.x - p0.x) / portion;
                    const dx1 = p1Null ? 0 : (p1.x - p.x) / portion;
                    c0 = { x: p.x - dx0, y: p.y - dx0 * m };
                    c1 = { x: p.x + dx1, y: p.y + dx1 * m };
                }
                return { c0: c0, c1: c1 };
            }
            const GET_VAL = Pacem.CustomElementUtils.getAttachedPropertyValue;
            const SET_VAL = Pacem.CustomElementUtils.setAttachedPropertyValue;
            const DEL_VAL = Pacem.CustomElementUtils.deleteAttachedPropertyValue;
            const PADDING_PIXELS = 24;
            const SERIES_MAGNITUDE = 'pacem:chart-series:area';
            const SVG_NS = "http://www.w3.org/2000/svg";
            let PacemChartElement = class PacemChartElement extends Charts.PacemSeriesChartElement {
                _getVirtualGrid(items, minX, maxX, minY, maxY, xAxisType = this.xAxisType, steps) {
                    return super.getVirtualGrid(items, minX, maxX, minY, maxY, xAxisType, steps);
                }
                _wipe(series = this.chartSeries, startIndex = 0) {
                    super.wipeOut(series, startIndex);
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'type') {
                        this.draw();
                    }
                }
                _buildLinearGradient(seriesIndex) {
                    return super.buildLinearGradient(seriesIndex);
                }
                _setGradientColor(grad, color) {
                    super.setGradientColor(grad, color);
                }
                drawSeries(datasource) {
                    if (!this.isReady || Pacem.Utils.isNull(this.chartSize)) {
                        return;
                    }
                    this.ensureChartContainer();
                    const type = this.type || 'line';
                    const padding = PADDING_PIXELS;
                    // resize all
                    var size = this.chartSize;
                    if (size.height <= padding || size.width <= padding) {
                        return;
                    }
                    // items && labels?
                    if (Pacem.Utils.isNullOrEmpty(datasource) || datasource.every(i => Pacem.Utils.isNullOrEmpty(i.values))) {
                        this._wipe();
                        return;
                    }
                    const body = this.ensureChartBody('line', size.width, size.height);
                    // from now on, drawing...
                    this.log(Pacem.Logging.LogLevel.Debug, `Drawing ${type} chart.`);
                    // #region computations
                    const xAxisType = this.xAxisType || 'string';
                    let minY = Number.NaN, maxY = Number.NaN, minX = Number.NaN, maxX = Number.NaN;
                    let stretch = 1;
                    // individuate the min/max x & y in order correctly apply aspect ratio...
                    for (let series of datasource) {
                        let data = series.values;
                        if (data && data.length) {
                            let j = 0;
                            for (let item of data) {
                                let pt = this.chartDataItemToPoint(item, data);
                                minY = isNaN(minY) ? pt.y : Math.min(minY, pt.y);
                                maxY = isNaN(maxY) ? pt.y : Math.max(maxY, pt.y);
                                if (j === 0)
                                    minX = isNaN(minX) ? pt.x : Math.min(minX, pt.x);
                                else if (j === data.length - 1)
                                    maxX = isNaN(maxX) ? pt.x : Math.max(maxX, pt.x);
                                j++;
                            }
                        }
                    }
                    // estimate y-axis max width
                    const paddingYAxisEnd = Math.max(padding, this.estimateXAxisLabelWidth(minX) * .5 + PADDING_PIXELS), paddingYAxis = Math.max(paddingYAxisEnd, this.estimateYAxisLabelWidth(maxY) + PADDING_PIXELS * .5);
                    /** virtual grid made of x- and y-axis labels */
                    const withValues = datasource.find(i => !Pacem.Utils.isNullOrEmpty(i.values));
                    const grid = this._getVirtualGrid(withValues.values, minX, maxX, minY, maxY, xAxisType, this.yAxisDensity);
                    const topGrid = grid.y[grid.y.length - 1], bottomGrid = grid.y[0];
                    if (topGrid === bottomGrid)
                        return;
                    /** width of the WHOLE series dedicated area */
                    const seriesWidth = size.width - paddingYAxis - paddingYAxisEnd;
                    /** height of the WHOLE series dedicated area */
                    const gridHeight = (size.height - 2 * padding);
                    const seriesHeight = gridHeight * (1 - (topGrid - bottomGrid - (maxY - minY)) / (topGrid - bottomGrid));
                    const seriesY = gridHeight * (topGrid - maxY) / (topGrid - bottomGrid);
                    // const seriesY2 = gridHeight * (minY - bottomGrid) / (topGrid - bottomGrid);
                    // if not a `graph`
                    if (xAxisType !== 'number' || (this.aspectRatio !== 'monometric' && this.aspectRatio !== 'logaritmic')) {
                        // consider padding
                        stretch = seriesWidth / seriesHeight;
                        body.setAttribute('height', size.height.toString());
                        body.setAttribute('width', size.width.toString());
                    }
                    body.setAttribute('viewBox', `0 0 ${size.width} ${size.height}`);
                    // #endregion
                    // #region render series
                    let iter = 0;
                    // normalize
                    const spanX = maxX - minX, spanY = maxY - minY;
                    const normX = 100 * stretch / spanX, normY = 100 / spanY;
                    const normPadding = 100 * padding / seriesHeight;
                    const buildPoint = (it, series) => {
                        let p = this.chartDataItemToPoint(it, series);
                        //pt.x *= normX;
                        p.y *= normY;
                        // Limit as much as possible the magnitude of a number inclued in the svg.
                        // Big numbers "overflow the renderer".
                        p.x = (p.x - minX) * normX;
                        //pt.y = (pt.y - minY) * normY;
                        return p;
                    };
                    const chartSeries = this.chartSeries;
                    const chartGrid = this.chartGrid;
                    const splineHere = type === 'spline' || type === 'splinearea';
                    for (let series of datasource) {
                        // does the series svg exist?
                        let svg;
                        let grad;
                        if (chartSeries.length > iter) {
                            svg = chartSeries[iter];
                            grad = svg.firstElementChild.firstElementChild;
                        }
                        else {
                            svg = document.createElementNS(SVG_NS, 'svg');
                            svg.setAttribute('pacem', '');
                            chartGrid.insertAdjacentElement('afterend', svg);
                            const defs = document.createElementNS(SVG_NS, 'defs');
                            defs.appendChild(grad = this._buildLinearGradient(iter));
                            svg.appendChild(defs);
                            // fill path
                            svg.appendChild(document.createElementNS(SVG_NS, 'path'));
                            // stroke path
                            svg.appendChild(document.createElementNS(SVG_NS, 'path'));
                            chartSeries.push(svg);
                        }
                        // series positioning:
                        /*
                         --------------------------------------
                         |   |--------------------------------|
                         |pad|         series here            |
                         |   |--------------------------------|
                         --------------------------------------
                         |   |             pad                |
                         --------------------------------------
                         */
                        var className = 'chart-series';
                        var fill = type === 'area' || type === 'splinearea';
                        if (!Pacem.Utils.isNullOrEmpty(series.className)) {
                            className += ' ' + series.className;
                        }
                        svg.setAttribute('class', className);
                        svg.setAttribute('x', paddingYAxis.toString());
                        svg.setAttribute('y', seriesY.toString());
                        svg.setAttribute('width', seriesWidth.toString());
                        svg.setAttribute('height', (seriesHeight + 2 * padding).toString());
                        // pick path as single child element for the series.
                        let pathFill = svg.children.item(1);
                        let path = svg.lastElementChild;
                        path.style.stroke = series.color;
                        pathFill.style.stroke =
                            path.style.fill = 'none';
                        this._setGradientColor(grad, series.color);
                        pathFill.style.fill = `url(#${grad.id})`;
                        pathFill.style.display = fill ? '' : 'none';
                        let d = '';
                        let data = series.values;
                        if (data && data.length) {
                            if (splineHere) {
                                // #region SPLINE
                                let pt0, pt, c0;
                                for (let j = 0; j < data.length; j++) {
                                    const item = data[j];
                                    if (isNaN(item.value)) {
                                        continue;
                                    }
                                    if (!pt) {
                                        pt = buildPoint(item, data);
                                    }
                                    let pt1;
                                    if (splineHere && j < (data.length - 1)) {
                                        pt1 = buildPoint(data[j + 1], data);
                                    }
                                    // accumulate `area` for sorting
                                    let areaSoFar = GET_VAL(series, SERIES_MAGNITUDE, 0);
                                    areaSoFar += item.value;
                                    SET_VAL(series, SERIES_MAGNITUDE, areaSoFar);
                                    var c = getSplineCtrlPoints(pt, pt0, pt1);
                                    d += Pacem.Utils.isNullOrEmpty(d) ? `M${pt.x},${-pt.y} ` : `C${c0.x},${-c0.y} ${c.c0.x},${-c.c0.y} ${pt.x},${-pt.y} `;
                                    // step next
                                    pt0 = pt;
                                    pt = pt1, c0 = c.c1;
                                }
                                // #endregion
                            }
                            else {
                                // #region LINE
                                for (let item of data) {
                                    if (isNaN(item.value)) {
                                        continue;
                                    }
                                    const pt = buildPoint(item, data);
                                    // accumulate `area` for sorting
                                    let areaSoFar = GET_VAL(series, SERIES_MAGNITUDE, 0);
                                    areaSoFar += item.value;
                                    SET_VAL(series, SERIES_MAGNITUDE, areaSoFar);
                                    d += Pacem.Utils.isNullOrEmpty(d) ? `M${pt.x},${-pt.y} ` : `L${pt.x},${-pt.y} `;
                                }
                                // #endregion
                            }
                        }
                        path.setAttribute('d', d);
                        pathFill.setAttribute('d', d + `V${(-minY * normY)} H0 Z`);
                        // tick
                        iter++;
                    }
                    // remove exceeding series
                    this._wipe(chartSeries, iter);
                    const w0 = 100 * stretch, h0 = 100 + 2 * normPadding, x0 = 0, //minX * normX,
                    y0 = maxY * normY + normPadding;
                    const svbox = `${x0} ${-y0} ${w0} ${h0}`;
                    for (var svg of chartSeries) {
                        svg.setAttribute('viewBox', svbox);
                    }
                    const chartMask = this.chartMask;
                    let mask = chartMask.children.item(1);
                    mask.setAttribute('x', x0.toString());
                    mask.setAttribute('height', (size.height - padding).toString());
                    // #endregion
                    // #region grid
                    chartGrid.setAttribute('viewBox', `0 0 ${size.width} ${size.height}`);
                    if (grid.x.length <= 1 || grid.y.length <= 1) {
                        for (let j = chartGrid.children.length - 1; j >= 0; j--) {
                            chartGrid.children.item(j).remove();
                        }
                        return;
                    }
                    let pgrid;
                    if (chartGrid.children.length > 0) {
                        pgrid = chartGrid.children.item(0);
                    }
                    else {
                        pgrid = document.createElementNS(SVG_NS, 'path');
                        chartGrid.appendChild(pgrid);
                    }
                    const tick = padding * .25;
                    let lblCounter = 0;
                    let ensureLabel = (index, x, y, txt) => {
                        const ndx = index + /* <path> is the first child element */ 1;
                        let lbl;
                        if (chartGrid.children.length <= ndx) {
                            lbl = document.createElementNS(SVG_NS, 'text');
                            chartGrid.appendChild(lbl);
                        }
                        else {
                            lbl = chartGrid.children.item(ndx);
                        }
                        lbl.textContent = txt;
                        lbl.setAttribute('x', x.toString());
                        lbl.setAttribute('y', y.toString());
                        return lbl;
                    };
                    let dgrid = `M${paddingYAxis},${padding} v${gridHeight}`; //H${w}
                    // x
                    let j = 0;
                    const xincr = seriesWidth / (grid.x.length - 1), yincr = gridHeight / (grid.y.length - 1);
                    if (this.xAxisPosition !== 'none') {
                        for (var x of grid.x) {
                            let xcoord = paddingYAxis + j * xincr;
                            if (this.xAxisPosition === 'top') {
                                dgrid += ` M${xcoord},${padding} v${-tick}`;
                                let lbl = ensureLabel(lblCounter++, xcoord, 0, x);
                                lbl.setAttribute('text-anchor', 'middle');
                                lbl.setAttribute('alignment-baseline', 'hanging');
                            }
                            else {
                                let ycoord = gridHeight + padding;
                                dgrid += ` M${xcoord},${ycoord} v${tick}`;
                                ensureLabel(lblCounter++, xcoord, ycoord + padding, x).setAttribute('text-anchor', 'middle');
                            }
                            j++;
                        }
                    }
                    // y
                    j = 0;
                    for (var y of grid.y) {
                        const ycoord = gridHeight + padding - j * yincr, xcoord = paddingYAxis - tick;
                        dgrid += ` M${xcoord},${ycoord} H${(seriesWidth + paddingYAxis)}`;
                        let txt = this.formatYAxisLabel(y);
                        ensureLabel(lblCounter++, xcoord - tick, ycoord, txt).setAttribute('text-anchor', 'end');
                        j++;
                    }
                    pgrid.setAttribute('d', dgrid);
                    // exceeding labels?
                    for (let j = chartGrid.children.length - 1; j > lblCounter; j--) {
                        chartGrid.children.item(j).remove();
                    }
                    // #endregion
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemChartElement.prototype, "type", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemChartElement.prototype, "aspectRatio", void 0);
            PacemChartElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-chart' })
            ], PacemChartElement);
            Charts.PacemChartElement = PacemChartElement;
        })(Charts = Components.Charts || (Components.Charts = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-foundation.d.ts" />
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Charts;
        (function (Charts) {
            let PacemPieSliceElement = class PacemPieSliceElement extends Components.PacemItemElement {
                constructor() {
                    super(...arguments);
                    this._broadcastHandler = (e) => {
                        this.emit(e);
                    };
                }
                findContainer() {
                    return Pacem.CustomElementUtils.findAncestorOfType(this, PacemPieChartElement);
                }
                get chart() {
                    return this.container;
                }
                /** Returns the center of mass (point) of this pie/doughnut slice, in absolute coords (pixels). */
                getCenterOfMass() {
                    const area = this.chart && this.chart.area;
                    if (Pacem.Utils.isNull(area)) {
                        return null;
                    }
                    const rect = Pacem.Utils.offset(area), center = { x: rect.width / 2 + rect.left, y: rect.top + rect.height / 2 }, r = Math.min(rect.width, rect.height) * .5;
                    const pos = this.normalizedPolarCoords, angle = PI1_2 - pos.angle;
                    return {
                        y: center.y - r * pos.radius * Math.sin(angle),
                        x: center.x + r * pos.radius * Math.cos(angle)
                    };
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first && this.chart && name != 'normalizedPolarCoords')
                        this.chart.draw();
                }
                /** @internal */
                _assignUi(el) {
                    const ui = this._ui = el;
                    Charts.MANAGED_EVENTS.forEach(type => {
                        ui.addEventListener(type, this._broadcastHandler);
                    });
                }
                /** @internal */
                _disposeUi() {
                    if (!Pacem.Utils.isNull(this._ui)) {
                        Charts.MANAGED_EVENTS.forEach(type => {
                            this._ui.removeEventListener(type, this._broadcastHandler);
                        });
                    }
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemPieSliceElement.prototype, "value", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemPieSliceElement.prototype, "label", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemPieSliceElement.prototype, "color", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemPieSliceElement.prototype, "normalizedPolarCoords", void 0);
            PacemPieSliceElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-pie-slice' })
            ], PacemPieSliceElement);
            Charts.PacemPieSliceElement = PacemPieSliceElement;
            const TWO_PI = Math.PI * 2;
            const PI1_2 = Math.PI * .5;
            let PacemPieChartElement = class PacemPieChartElement extends Components.PacemItemsContainerElement {
                constructor() {
                    super();
                    /** Set a value between 0 and 1, for doughnut appearance. */
                    this.cutout = .0;
                    this._slices = new WeakMap();
                    this._key = Pacem.Utils.uniqueCode();
                }
                validate(item) {
                    return item instanceof PacemPieSliceElement;
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this.draw();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'target') {
                        this._g = null;
                        this._div && this._div.remove();
                        const eold = old;
                        if (eold) {
                            eold.classList.remove(Pacem.PCSS + '-chart-area');
                            eold.innerHTML = '';
                        }
                        this.draw();
                    }
                    else if (!first && (name === 'cutout' || name === 'items'))
                        this.draw();
                }
                get area() {
                    return this._svg;
                }
                disconnectedCallback() {
                    this._div && this._div.remove();
                    super.disconnectedCallback();
                }
                _ensureArea() {
                    if (Pacem.Utils.isNull(this._g)) {
                        let div = this.target || (this._div = document.createElement('div'));
                        div.classList.add(Pacem.PCSS + '-chart-area');
                        let svg = this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svg.setAttribute('pacem', '');
                        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                        svg.setAttribute('viewBox', '0 0 100 100');
                        //svg.style.height =
                        //    svg.style.width = '100%';
                        svg.classList.add(Pacem.PCSS + '-pie-chart');
                        let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                        let g = this._g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                        svg.appendChild(defs);
                        svg.appendChild(g);
                        div.appendChild(svg);
                        this._div &&
                            this.parentElement.insertBefore(div, this);
                    }
                    if (this.maskBasedRendering) {
                        if (Pacem.Utils.isNull(this._mask)) {
                            let mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
                            mask.id = 'pie_mask_' + this._key;
                            let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                            rect.setAttribute('x', '0');
                            rect.setAttribute('y', '0');
                            rect.setAttribute('width', '100');
                            rect.setAttribute('height', '100');
                            rect.setAttribute('fill', '#fff');
                            let circle = this._mask = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                            circle.setAttribute('cx', '50');
                            circle.setAttribute('cy', '50');
                            const defs = this._svg.firstElementChild;
                            mask.appendChild(rect);
                            mask.appendChild(circle);
                            defs.appendChild(mask);
                            this._g.setAttribute('mask', `url(#${mask.id})`);
                        }
                        const cutout = 50.0 * this._safeCutout;
                        this._mask.setAttribute('r', `${cutout}`);
                    }
                    else {
                        if (!Pacem.Utils.isNull(this._mask)) {
                            this._svg.firstElementChild.innerHTML = '';
                            this._mask = null;
                            this._g.removeAttribute('mask');
                        }
                    }
                    return this._g;
                }
                get _safeCutout() {
                    return Math.min(1, Math.max(0, this.cutout)) || .0;
                }
                _drawSlice(path, slice, whole, partial) {
                    const largeFlag = slice.value > .5 * whole ? 1 : 0;
                    const angle = TWO_PI * slice.value / whole;
                    const rot = 360.0 * partial / whole;
                    const x = (slice.value >= whole) ? /* handling single slice */ 49.9 : 50 * (1 + Math.sin(angle));
                    const y = 50 * (1 - Math.cos(angle));
                    // set geometry data
                    const c = this._safeCutout, r = c * 50.0;
                    path.style.fill = slice.color; //.setAttribute('fill', slice.color || (path.getAttribute('fill') || '#000'));
                    //path.setAttribute('transform', `rotate(${rot} 50 50)`);
                    path.style.transform = `rotate(${rot}deg)`;
                    path.style.transformOrigin = '50% 50%';
                    const d = this.maskBasedRendering ?
                        `M50,50 V0 A50,50 0 ${largeFlag} 1 ${x} ${y} L50,50 Z` :
                        `M50,0 A50,50 0 ${largeFlag} 1 ${x} ${y} l${(50 - x) * (1.0 - c)},${(50 - y) * (1.0 - c)} A${r},${r} 0 ${largeFlag} 0 50,${(50 - r)} Z`;
                    path.setAttribute('d', d);
                    slice.normalizedPolarCoords = { radius: c + Math.SQRT1_2 * (1.0 - c), angle: /* deg to rad */ Math.PI * rot / 180.0 + angle / 2 };
                }
                _isSliceOk(slice) {
                    return !slice.disabled //&& slice.value > 0
                    ;
                }
                draw() {
                    const g = this._ensureArea(), pCount = g.children.length, chartArea = this._svg.parentElement;
                    let ndx = 0, sum = .0, progress = .0;
                    if (Pacem.Utils.isNullOrEmpty(this.items)) {
                        g.innerHTML = '';
                        Pacem.Utils.removeClass(chartArea, 'chart-has-data');
                    }
                    else {
                        Pacem.Utils.addClass(chartArea, 'chart-has-data');
                        for (let slice of this.items) {
                            if (!this._isSliceOk(slice))
                                continue;
                            sum += slice.value;
                        }
                        if (sum <= 0) {
                            g.innerHTML = '';
                            Pacem.Utils.removeClass(chartArea, 'chart-has-data');
                        }
                        else {
                            for (let slice of this.items) {
                                if (!this._isSliceOk(slice))
                                    continue;
                                let p;
                                if (ndx >= pCount) {
                                    const g_n = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                                    g_n.setAttribute('class', 'chart-series ' + Pacem.PCSS + '-pie-slice' + (Pacem.Utils.isNullOrEmpty(slice.className) ? '' : (' ' + slice.className)));
                                    p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                    g_n.appendChild(p);
                                    g.appendChild(g_n);
                                    // add listeners (click, mouse-..., touch-...)
                                    slice._assignUi(g_n);
                                    this._slices.set(g_n, slice);
                                }
                                else {
                                    p = g.children.item(ndx).firstElementChild;
                                }
                                if (slice.value > 0) {
                                    this._drawSlice(p, slice, sum, progress);
                                    progress += slice.value;
                                    p.removeAttribute('display');
                                }
                                else {
                                    p.setAttribute('display', 'none');
                                }
                                ndx++;
                            }
                        }
                    }
                    while (ndx < g.children.length) {
                        const slices = this._slices, g_n = g.children.item(ndx);
                        // remove listeners
                        if (slices.has(g_n)) {
                            slices.get(g_n)._disposeUi();
                            slices.delete(g_n);
                        }
                        g.removeChild(g_n);
                    }
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemPieChartElement.prototype, "cutout", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Element })
            ], PacemPieChartElement.prototype, "target", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemPieChartElement.prototype, "maskBasedRendering", void 0);
            __decorate([
                Pacem.Debounce(true)
            ], PacemPieChartElement.prototype, "draw", null);
            PacemPieChartElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-pie-chart' })
            ], PacemPieChartElement);
            Charts.PacemPieChartElement = PacemPieChartElement;
        })(Charts = Components.Charts || (Components.Charts = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
