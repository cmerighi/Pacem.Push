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
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        const consts = { API_JS: 'https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/5.0.7/signalr.min.js' };
        let PacemHubListener = class PacemHubListener extends Components.PacemItemElement {
            constructor() {
                super(...arguments);
                this.onreceive = (...args) => {
                    this.dispatchEvent(new CustomEvent('receive', { detail: Array.from(args) }));
                };
            }
            propertyChangedCallback(name, old, val, first) {
                super.propertyChangedCallback(name, old, val, first);
                if (this.container instanceof PacemHubProxy && !Pacem.Utils.isNull(this.container.connection)) {
                    const conn = this.container.connection;
                    switch (name) {
                        case 'method':
                            if (!Pacem.Utils.isNullOrEmpty(old))
                                conn.off(old, this.onreceive);
                            if (!Pacem.Utils.isNullOrEmpty(val))
                                conn.on(val, this.onreceive);
                            break;
                        case 'disabled':
                            if (!Pacem.Utils.isNullOrEmpty(this.method)) {
                                let onoff = val ? conn.off : conn.on;
                                onoff(this.method, this.onreceive);
                            }
                            break;
                    }
                }
            }
        };
        __decorate([
            Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
        ], PacemHubListener.prototype, "method", void 0);
        PacemHubListener = __decorate([
            Pacem.CustomElement({ tagName: Pacem.P + '-hub-listener' })
        ], PacemHubListener);
        Components.PacemHubListener = PacemHubListener;
        let PacemHubProxy = class PacemHubProxy extends Components.PacemItemsContainerElement {
            validate(item) {
                return item instanceof PacemHubListener;
            }
            get connection() {
                return this._hub;
            }
            invoke(method, ...args) {
                if (this.connected)
                    return this._hub.invoke.apply(this._hub, arguments);
                throw 'Hub is not connected. Cannot call `invoke` method.';
            }
            send(method, ...args) {
                if (this.connected)
                    return this._hub.send.apply(this._hub, arguments);
                throw 'Hub is not connected. Cannot call `send` method.';
            }
            start() {
                this._resetProxy();
            }
            propertyChangedCallback(name, old, val, first) {
                super.propertyChangedCallback(name, old, val, first);
                //
                if (name === 'url' || name === 'disabled' || name === 'accesstoken') {
                    this._resetProxy();
                }
            }
            disconnectedCallback() {
                if (this.connected) {
                    this._hub.stop();
                }
                super.disconnectedCallback();
            }
            async _resetProxy() {
                if (!Pacem.Utils.isNull(this._hub)) {
                    await this._hub.stop();
                    this.connected = false;
                    this._setupProxy();
                }
                else {
                    this._setupProxy();
                }
            }
            _initialize() {
                return Pacem.CustomElementUtils.importjs(consts.API_JS);
            }
            async _setupProxy() {
                if (!this.disabled && !Pacem.Utils.isNullOrEmpty(this.url)) {
                    await this._initialize();
                    const connBuilder = new signalR.HubConnectionBuilder();
                    connBuilder.withUrl(this.url, {
                        accessTokenFactory: () => this.accesstoken
                    });
                    const h = this._hub = connBuilder.build();
                    h.onclose(() => {
                        this.connected = false;
                        this._hub = null;
                    });
                    await h.start();
                    this.connected = true;
                    // on(...)
                    for (var item of this.items) {
                        if (item.disabled || Pacem.Utils.isNullOrEmpty(item.method))
                            continue;
                        h.on(item.method, item.onreceive);
                    }
                }
            }
        };
        __decorate([
            Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
        ], PacemHubProxy.prototype, "url", void 0);
        __decorate([
            Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
        ], PacemHubProxy.prototype, "accesstoken", void 0);
        __decorate([
            Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
        ], PacemHubProxy.prototype, "connected", void 0);
        PacemHubProxy = __decorate([
            Pacem.CustomElement({ tagName: Pacem.P + '-hub-proxy' })
        ], PacemHubProxy);
        Components.PacemHubProxy = PacemHubProxy;
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
