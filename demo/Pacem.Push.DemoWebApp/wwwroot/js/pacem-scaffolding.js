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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            var _PacemItemElement_container;
            const ORIGINAL_VALUE_FIELD = 'pacem:model:original-value';
            class PacemFormRelevantElement extends Components.PacemElement {
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this.form = Pacem.CustomElementUtils.findAncestorOfType(this, Scaffolding.PacemFormElement);
                }
            }
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Element })
            ], PacemFormRelevantElement.prototype, "form", void 0);
            Scaffolding.PacemFormRelevantElement = PacemFormRelevantElement;
            class PacemModelElement extends PacemFormRelevantElement {
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    const name = this.name, form = this.form;
                    if (!Pacem.Utils.isNullOrEmpty(name) && !Pacem.Utils.isNull(form)
                        && (!this.hasAttribute('autobind')
                            || (this.getAttribute('autobind') !== 'off' && this.getAttribute('autobind') !== 'false'))) {
                        form.registerField(name, this);
                        // automatic bind value given the field name
                        if (!this.hasAttribute('value')) {
                            const formId = form.id = form.id || 'frm_' + Pacem.Utils.uniqueCode();
                            this.setAttribute('value', `{{ #${formId}.entity.${name}, twoway }}`);
                        }
                    }
                    this._setAsOriginalValue(this.value);
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'value':
                            this.viewValue = this.getViewValue(val);
                            break;
                        case 'valid':
                            if (!val) {
                                Pacem.Utils.addClass(this, Pacem.PCSS + '-invalid');
                            }
                            else {
                                Pacem.Utils.removeClass(this, Pacem.PCSS + '-invalid');
                            }
                            break;
                        case 'dirty':
                            if (val) {
                                Pacem.Utils.addClass(this, Pacem.PCSS + '-dirty');
                            }
                            else {
                                Pacem.Utils.removeClass(this, Pacem.PCSS + '-dirty');
                            }
                            break;
                        case 'name':
                            let form = this.form;
                            if (form != null) {
                                if (old)
                                    form.unregisterField(old);
                                form.registerField(val, this);
                            }
                            break;
                        case 'form':
                            let n = this.name;
                            if (!Pacem.Utils.isNullOrEmpty(n)) {
                                if (old != null)
                                    old.unregisterField(n);
                                if (val != null)
                                    val.registerField(n, this);
                            }
                            break;
                    }
                }
                disconnectedCallback() {
                    let name = this.name, form = this.form;
                    if (!Pacem.Utils.isNullOrEmpty(name) && !Pacem.Utils.isNull(form))
                        form.unregisterField(name);
                    super.disconnectedCallback();
                }
                get originalValue() {
                    return Pacem.CustomElementUtils.getAttachedPropertyValue(this, ORIGINAL_VALUE_FIELD);
                }
                _setAsOriginalValue(v) {
                    Pacem.CustomElementUtils.setAttachedPropertyValue(this, ORIGINAL_VALUE_FIELD, v);
                }
                reset() {
                    this.value = this.originalValue;
                    // then
                    this.dirty = false;
                }
                setPristine() {
                    this._setAsOriginalValue(this.value);
                    //
                    this.dirty = false;
                }
                setDirty() {
                    this.dirty = true;
                }
            }
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemModelElement.prototype, "viewValue", void 0);
            __decorate([
                Pacem.Watch({
                    converter: {
                        convert: (attr, element) => {
                            if (!(element instanceof PacemModelElement))
                                return attr;
                            return element.convertValueAttributeToProperty(attr);
                        },
                        convertBack: (prop) => prop.toString()
                    }
                })
            ], PacemModelElement.prototype, "value", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemModelElement.prototype, "dirty", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemModelElement.prototype, "valid", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemModelElement.prototype, "name", void 0);
            Scaffolding.PacemModelElement = PacemModelElement;
            class PacemBaseElement extends PacemModelElement {
                constructor() {
                    super(...arguments);
                    this.focusHandler = (evt) => {
                        const focusFieldgroup = (add = true) => {
                            // TODO: re-think, since this is an ugly workaround just to properly set the outline and borders of the fieldgroup 
                            if (Pacem.Utils.is(this.parentElement, '.' + Pacem.PCSS + '-fieldgroup')) {
                                (add ? Pacem.Utils.addClass : Pacem.Utils.removeClass).apply(this, [this.parentElement, Pacem.PCSS + '-focus']);
                            }
                        };
                        const blurFieldgroup = () => focusFieldgroup(false);
                        switch (evt.type) {
                            case 'focus':
                                Pacem.Utils.addClass(this, Pacem.PCSS + '-focus');
                                focusFieldgroup();
                                this._preFocusValue = this.value;
                                break;
                            case 'blur':
                                Pacem.Utils.removeClass(this, Pacem.PCSS + '-focus');
                                blurFieldgroup();
                                break;
                        }
                        if (evt.bubbles)
                            this.emit(evt);
                        else
                            this.dispatchEvent(new FocusEvent(evt.type));
                    };
                    this.changeHandler = (evt) => {
                        const val = this.value;
                        this.onChange(evt).then(v => {
                            if (!this.compareValuePropertyValues(val, v)) {
                                this.dispatchEvent(new Event('change'));
                                this.dirty = true;
                            }
                        }, _ => {
                            // do nothing
                        });
                    };
                    this.keydownHandler = (evt) => {
                        Pacem.stopPropagationHandler(evt);
                    };
                    this.keyupHandler = (evt) => {
                        switch (evt.keyCode) {
                            case /* Esc */ 27:
                                Pacem.stopPropagationHandler(evt);
                                // choose between reset and set
                                if (this.compareValuePropertyValues(this.originalValue, this._preFocusValue)) {
                                    this.reset();
                                }
                                else {
                                    this.value = this._preFocusValue;
                                }
                                this.blur();
                                break;
                            case /* Enter */ 13:
                                if (this.preventKeyboardSubmit) {
                                    Pacem.stopPropagationHandler(evt);
                                }
                                break;
                        }
                    };
                }
                compareValuePropertyValues(old, val) {
                    return Pacem.DefaultComparer(old, val);
                }
                get preventKeyboardSubmit() {
                    return false;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'required':
                        case 'disabled':
                        case 'autofocus':
                        case 'placeholder':
                        case 'readonly':
                            for (let inputField of this.inputFields)
                                val ? inputField.setAttribute(name, val) : inputField.removeAttribute(name);
                            break;
                        //case 'name':
                        case 'tabOrder':
                            for (let inputField of this.inputFields)
                                inputField.setAttribute('tabindex', val);
                            break;
                        case 'value':
                            this.acceptValue(val);
                            break;
                    }
                    if (name === 'required'
                        || name === 'disabled'
                        || name === 'readonly') {
                        let className = `${Pacem.PCSS}-${name}`;
                        val ? Pacem.Utils.addClass(this, className) : Pacem.Utils.removeClass(this, className);
                    }
                    if (name === 'readonly') {
                        this.toggleReadonlyView(val);
                    }
                    // aria-... attributes
                    else if (name === 'required') {
                        this.aria.attributes.set('required', !!val + '');
                    }
                    else if (name === 'valid') {
                        // Specs say that 'aria-invalid' on required attributes SHOULD NOT be set before submission, 
                        // think about a 'submitted state'(?) to check against...
                        this.aria.attributes.set('invalid', (!val && !!this.dirty) + '');
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this.toggleReadonlyView(this.readonly || false);
                    // aria-attribute
                    if (!Pacem.Utils.isNullOrEmpty(this.id)) {
                        const label = document.querySelector(`label[for=${this.id}]`);
                        if (label) {
                            if (label.id) {
                                this.aria.attributes.set('labelledby', label.id);
                            }
                            else {
                                this.aria.attributes.set('label', label.textContent);
                            }
                        }
                        else {
                            this.aria.attributes.remove('labelledby');
                            this.aria.attributes.remove('label');
                        }
                        ;
                    }
                    for (let inputField of this.inputFields) {
                        inputField.addEventListener('focus', this.focusHandler, false);
                        inputField.addEventListener('blur', this.focusHandler, false);
                        inputField.addEventListener('change', this.changeHandler, false);
                        // avoid interference with other handlers (e.g. cref UI.PacemAdapterElement)
                        inputField.addEventListener('keydown', this.keydownHandler, false);
                        inputField.addEventListener('keyup', this.keyupHandler, false);
                        inputField.addEventListener('mousedown', Pacem.stopPropagationHandler, false);
                        inputField.addEventListener('touchstart', Pacem.stopPropagationHandler, { passive: false, capture: false });
                    }
                }
                disconnectedCallback() {
                    for (let inputField of this.inputFields) {
                        if (Pacem.Utils.isNull(inputField))
                            continue;
                        inputField.removeEventListener('touchstart', Pacem.stopPropagationHandler, { capture: false });
                        inputField.removeEventListener('keydown', this.keydownHandler, false);
                        inputField.removeEventListener('keyup', this.keyupHandler, false);
                        inputField.removeEventListener('mousedown', Pacem.stopPropagationHandler, false);
                        //
                        inputField.removeEventListener('change', this.changeHandler, false);
                        inputField.removeEventListener('focus', this.focusHandler, false);
                        inputField.removeEventListener('blur', this.focusHandler, false);
                    }
                    super.disconnectedCallback();
                }
                focus() {
                    const fields = this.inputFields;
                    if (fields && fields.length) {
                        fields[0].focus();
                    }
                }
                blur() {
                    const fields = this.inputFields;
                    if (!Pacem.Utils.isNullOrEmpty(fields)) {
                        for (let field of fields) {
                            field.blur();
                        }
                    }
                }
            }
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemBaseElement.prototype, "required", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemBaseElement.prototype, "autofocus", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemBaseElement.prototype, "readonly", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemBaseElement.prototype, "name", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemBaseElement.prototype, "placeholder", void 0);
            Scaffolding.PacemBaseElement = PacemBaseElement;
            class PacemItemElement extends Components.PacemElement {
                constructor() {
                    super(...arguments);
                    _PacemItemElement_container.set(this, void 0);
                }
                /** @overridable */
                findContainer() {
                    return Pacem.CustomElementUtils.findAncestor(this, n => n instanceof PacemItemsContainerBaseElement);
                }
                get container() {
                    return __classPrivateFieldGet(this, _PacemItemElement_container, "f");
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    const container = __classPrivateFieldSet(this, _PacemItemElement_container, this.findContainer(), "f");
                    if (!Pacem.Utils.isNull(container)) {
                        container.register(this);
                    }
                }
                disconnectedCallback() {
                    if (!Pacem.Utils.isNull(__classPrivateFieldGet(this, _PacemItemElement_container, "f"))) {
                        __classPrivateFieldGet(this, _PacemItemElement_container, "f").unregister(this);
                    }
                    super.disconnectedCallback();
                }
            }
            _PacemItemElement_container = new WeakMap();
            Scaffolding.PacemItemElement = PacemItemElement;
            class PacemItemsContainerBaseElement extends PacemBaseElement {
                /**
                 * Registers a new item among the items.
                 * @param item {PacemDataItemElement} Item to be enrolled
                 */
                register(item) {
                    let flag = true;
                    if (Pacem.Utils.isNull(this.items)) {
                        this.items = [item];
                    }
                    else if (this.items.indexOf(item) === -1) {
                        this.items.push(item);
                    }
                    else {
                        flag = false;
                    }
                    return flag;
                }
                /**
                 * Removes an existing element from the items.
                 * @param item {PacemDataItemElement} Item to be removed
                 */
                unregister(item) {
                    const ndx = !Pacem.Utils.isNull(this.items) && this.items.indexOf(item);
                    if (ndx >= 0) {
                        this.items.splice(ndx, 1)[0];
                        return true;
                    }
                    return false;
                }
            }
            __decorate([
                Pacem.Watch( /* can only be databound or assigned at runtime */)
            ], PacemItemsContainerBaseElement.prototype, "items", void 0);
            Scaffolding.PacemItemsContainerBaseElement = PacemItemsContainerBaseElement;
            let PacemDataItemElement = class PacemDataItemElement extends PacemItemElement {
            };
            __decorate([
                Pacem.Watch({
                    converter: {
                        convert: (attr, element) => {
                            // boolean?
                            if (attr === 'true')
                                return true;
                            if (attr === 'false')
                                return false;
                            // number?
                            let num = parseFloat(attr);
                            if (!isNaN(num))
                                return num;
                            // date?
                            let date = Pacem.Utils.Dates.parse(attr);
                            if (Pacem.Utils.Dates.isDate(date))
                                return date;
                            return attr;
                        },
                        convertBack: (prop) => prop.toString()
                    }
                })
            ], PacemDataItemElement.prototype, "value", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemDataItemElement.prototype, "label", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemDataItemElement.prototype, "disabled", void 0);
            PacemDataItemElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-data-item' })
            ], PacemDataItemElement);
            Scaffolding.PacemDataItemElement = PacemDataItemElement;
            class PacemDataSourceElement extends PacemItemsContainerBaseElement {
                constructor(multipleChoice = false) {
                    super();
                    this.multipleChoice = multipleChoice;
                    this._itemPropertyChangedHandler = (evt) => {
                        this.databind();
                    };
                }
                /**
                 * Registers a new item among the items.
                 * @param item {PacemDataItemElement} Item to be enrolled
                 */
                register(item) {
                    const flag = super.register(item);
                    if (flag) {
                        item.addEventListener(Pacem.PropertyChangeEventName, this._itemPropertyChangedHandler, false);
                    }
                    return flag;
                }
                /**
                 * Removes an existing element from the items.
                 * @param item {PacemDataItemElement} Item to be removed
                 */
                unregister(item) {
                    const flag = super.register(item);
                    if (flag) {
                        item.removeEventListener(Pacem.PropertyChangeEventName, this._itemPropertyChangedHandler, false);
                    }
                    return flag;
                }
                buildAdaptedDatasource(ds = this.datasource) {
                    return ds && ds.map(i => this.mapEntityToItem(i));
                }
                databind(datasource = this.buildAdaptedDatasource(this.datasource)) {
                    if (Pacem.Utils.isNull(datasource) && Pacem.Utils.isNull(this.adaptedDatasource))
                        return;
                    const ds = this.adaptedDatasource = datasource || []; /*
                        .map(i => this.mapEntityToItem(i))*/
                    ;
                    if (Pacem.Utils.isNullOrEmpty(ds.filter(i => this.isDataSourceItemSelected(i))))
                        this.handleDatasourceMismatch(ds);
                }
                handleDatasourceMismatch(datasource) {
                    this.value = undefined;
                }
                /**
                 * Checks wether the provided `item` matches the control's criteria for a selected option against a provided value (which defaults to control's value).
                 * @param item {any} item to check against
                 * @param value {any} value to match
                 */
                isItemSelected(item, value = this.value) {
                    if (Pacem.Utils.isNullOrEmpty(value)) {
                        return false;
                    }
                    const v = this.mapEntityToValue(item), c = this.compareBy;
                    if (this.multipleChoice && Pacem.Utils.isArray(value))
                        return !Pacem.Utils.isNull(value.find(j => 
                        // caution: numbers and strings might be compared, ease the comparison by loosing equality constraints: `===` to `==`.
                        j /* value item */ == /*=*/ v /* datasource item */ || (typeof j === 'object' && !Pacem.Utils.isNullOrEmpty(c) && c in v && c in j && v[c] == /*=*/ j[c])));
                    else if (!this.multipleChoice) {
                        return value == /*=*/ v || (typeof value === 'object' && !Pacem.Utils.isNullOrEmpty(c) && c in v && c in value && v[c] == /*=*/ value[c]);
                    }
                    else {
                        return false;
                    }
                }
                /**
                 * Checks wether the provided `item` matches the control's criteria for a selected option against a provided value (which defaults to control's value).
                 * @param item {DataSourceItem} item to check against
                 * @param value {any} value to match
                 */
                isDataSourceItemSelected(item, value = this.value) {
                    if (Pacem.Utils.isNullOrEmpty(value)) {
                        return false;
                    }
                    if (item.disabled) {
                        return false;
                    }
                    const c = this.compareBy;
                    if (this.multipleChoice && Pacem.Utils.isArray(value)) {
                        // caution: numbers and strings might be compared, ease the comparison by loosing equality constraints: `===` to `==`.
                        let found = value.find(j => j == /*=*/ item.value || (typeof j === 'object' && !Pacem.Utils.isNullOrEmpty(c) && c in j && !Pacem.Utils.isNullOrEmpty(item.value) && c in item.value && j[c] == /*=*/ item.value[c]));
                        return !Pacem.Utils.isNull(found);
                    }
                    else if (!this.multipleChoice && !Pacem.Utils.isNullOrEmpty(item.value)) {
                        return value == /*=*/ item.value || (typeof value === 'object' && !Pacem.Utils.isNullOrEmpty(c) && c in value && !Pacem.Utils.isNullOrEmpty(item.value) && c in item.value && value[c] == /*=*/ item.value[c]);
                    }
                    else {
                        return false;
                    }
                }
                mapEntityToValue(entity) {
                    if (entity == null)
                        throw 'entity cannot be null';
                    // declared
                    if (entity instanceof PacemDataItemElement) {
                        return entity.value;
                    }
                    // databound
                    let value = entity, prop;
                    if (prop = this.valueProperty) {
                        value = entity[prop];
                    }
                    return value;
                }
                mapEntityToViewValue(entity) {
                    if (entity == null)
                        throw 'entity cannot be null';
                    // declared
                    if (entity instanceof PacemDataItemElement) {
                        return entity.label || entity.value;
                    }
                    // databound
                    let viewValue = entity.toString(), prop;
                    if (prop = this.textProperty) {
                        viewValue = entity[prop];
                    }
                    return viewValue;
                }
                mapEntityToItem(entity) {
                    if (entity == null)
                        throw 'entity cannot be null';
                    // declared
                    if (entity instanceof PacemDataItemElement) {
                        return { value: entity.value, viewValue: entity.label || entity.value, disabled: entity.disabled, data: entity };
                    }
                    // databound
                    let disabled = false;
                    const disabledProp = this.disabledProperty;
                    if (!Pacem.Utils.isNullOrEmpty(disabledProp)) {
                        disabled = entity[disabledProp] || false;
                    }
                    return { value: this.mapEntityToValue(entity), viewValue: this.mapEntityToViewValue(entity), disabled: disabled, data: entity };
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'datasource':
                        case 'textProperty':
                        case 'disabledProperty':
                        case 'valueProperty':
                            cancelAnimationFrame(this._handle);
                            this._handle = requestAnimationFrame(() => {
                                this.databind();
                                // refresh view value, since it depends on selected items.
                                this.viewValue = this.getViewValue(this.value);
                            });
                            break;
                        case 'items':
                            cancelAnimationFrame(this._handleItems);
                            this._handleItems = requestAnimationFrame(() => {
                                this.datasource = this.items;
                            });
                            break;
                    }
                }
                getViewValue(val) {
                    if (Pacem.Utils.isNullOrEmpty(this.datasource)) {
                        return undefined;
                    }
                    return this.datasource.filter(i => this.isItemSelected(i)).map(i => this.mapEntityToViewValue(i)).join(', ');
                }
                convertValueAttributeToProperty(attr) {
                    if (this.multipleChoice)
                        return attr.split(',').map(i => i.trim());
                    return attr;
                }
                compareValuePropertyValues(old, val) {
                    return Pacem.Utils.areSemanticallyEqual(old, val);
                }
            }
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemDataSourceElement.prototype, "datasource", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemDataSourceElement.prototype, "valueProperty", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemDataSourceElement.prototype, "textProperty", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemDataSourceElement.prototype, "disabledProperty", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemDataSourceElement.prototype, "compareBy", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemDataSourceElement.prototype, "adaptedDatasource", void 0);
            __decorate([
                Pacem.Debounce(true)
            ], PacemDataSourceElement.prototype, "databind", null);
            Scaffolding.PacemDataSourceElement = PacemDataSourceElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            const JsonOrStringConverter = {
                convert: (attr, el) => {
                    return /\{.+\}/.test(attr) ? Pacem.PropertyConverters.Json.convert(attr) : Pacem.PropertyConverters.String.convert(attr);
                },
                convertBack: (prop, el) => {
                    if (typeof prop === 'string') {
                        return prop;
                    }
                    return Pacem.PropertyConverters.Json.convertBack(prop, el);
                }
            };
            // #region MONTH-PICKER (util component)
            function buildMonthGrid() {
                let header = '';
                for (let month = 0; month < 12; month++) {
                    header += `<div class="calendar-month month-${month + 1}"><${Pacem.P}-span class="month-button text-ellipsed" on-click=":host._setMonth(${month})" css-class="{{ { 'selected-month': :host._isSelectedMonth(${month}, :host.month, :host.viewYear), 'this-month': :host._isThisMonth(${month}, :host.viewYear) } }}" text="{{ :host._getMonthLabel(${month}) }}"></${Pacem.P}-span></div>`;
                }
                return header;
            }
            let PacemCalendarMonthPickerElement = class PacemCalendarMonthPickerElement extends Components.PacemElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'viewYear':
                            this.dispatchEvent(new CustomEvent('viewyearchange', { detail: new Date(val, 0, 1), bubbles: false, cancelable: false }));
                            Pacem.Utils.removeClass(this, "viewyear-next viewyear-previous");
                            requestAnimationFrame(() => {
                                Pacem.Utils.addClass(this, old > val ? "viewyear-previous" : "viewyear-next");
                            });
                            break;
                    }
                }
                _getMonthLabel(m) {
                    const year = new Date().getFullYear();
                    const date = new Date(year, m, 1);
                    return date.toLocaleString(Pacem.Utils.lang(this), { month: 'short' });
                }
                _isThisMonth(m, v = this.viewYear) {
                    return this._isSelectedMonth(m, new Date(), v);
                }
                _isSelectedMonth(m, d = this.month, v = this.viewYear) {
                    const actual = Pacem.Utils.parseDate(d);
                    if (!Pacem.Utils.Dates.isDate(actual)) {
                        return false;
                    }
                    const viewYear = v !== null && v !== void 0 ? v : new Date().getFullYear();
                    return actual.getMonth() === m && actual.getFullYear() === viewYear;
                }
                _setMonth(m) {
                    const year = this.viewYear;
                    const date = new Date(year, m, 1);
                    this.month = date;
                    this.dispatchEvent(new CustomEvent('monthselect', { detail: date, bubbles: false, cancelable: false }));
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Date })
            ], PacemCalendarMonthPickerElement.prototype, "month", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Date })
            ], PacemCalendarMonthPickerElement.prototype, "viewYear", void 0);
            PacemCalendarMonthPickerElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-calendar-month-picker', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<div class="${Pacem.PCSS}-month-picker">${buildMonthGrid()}</div>`
                })
            ], PacemCalendarMonthPickerElement);
            Scaffolding.PacemCalendarMonthPickerElement = PacemCalendarMonthPickerElement;
            // #endregion
            // #region YEAR-PICKER (util component)
            const YEARS_IN_RANGE = 12;
            function buildYearGrid() {
                let header = '';
                for (let year = 0; year < YEARS_IN_RANGE; year++) {
                    header += `<div class="calendar-year year-${year + 1}"><${Pacem.P}-span class="year-button text-ellipsed" on-click=":host._setYear(${year})" css-class="{{ { 'selected-year': :host._isSelectedYear(${year}, :host.year, :host.viewYear), 'this-year': :host._isThisYear(${year}, :host.viewYear) } }}" text="{{ :host._getYearLabel(${year}, :host.viewYear) }}"></${Pacem.P}-span></div>`;
                }
                return header;
            }
            function rangeFirstYear(y) {
                const mod = y % 10;
                return y - mod;
            }
            let PacemCalendarYearPickerElement = class PacemCalendarYearPickerElement extends Components.PacemElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'viewYear':
                            this.dispatchEvent(new CustomEvent('viewyearchange', { detail: new Date(val, 0, 1), bubbles: false, cancelable: false }));
                            Pacem.Utils.removeClass(this, "viewyear-next viewyear-previous");
                            requestAnimationFrame(() => {
                                Pacem.Utils.addClass(this, old > val ? "viewyear-previous" : "viewyear-next");
                            });
                            break;
                    }
                }
                _getYearLabel(y, year = this.viewYear) {
                    const first = rangeFirstYear(year);
                    return '' + (first + y);
                }
                _isThisYear(y, v = this.viewYear) {
                    return this._isSelectedYear(y, new Date(), v);
                }
                _isSelectedYear(y, d = this.year, v = this.viewYear) {
                    const actual = Pacem.Utils.parseDate(d);
                    if (!Pacem.Utils.Dates.isDate(actual)) {
                        return false;
                    }
                    const start = rangeFirstYear(v), computed = start + y;
                    ;
                    return actual.getFullYear() === computed;
                }
                _setYear(y) {
                    const v = this.viewYear, first = rangeFirstYear(v);
                    const date = new Date(first + y, 0, 1);
                    this.year = date;
                    this.dispatchEvent(new CustomEvent('yearselect', { detail: date, bubbles: false, cancelable: false }));
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Date })
            ], PacemCalendarYearPickerElement.prototype, "year", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Date })
            ], PacemCalendarYearPickerElement.prototype, "viewYear", void 0);
            PacemCalendarYearPickerElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-calendar-year-picker', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<div class="${Pacem.PCSS}-year-picker">${buildYearGrid()}</div>`
                })
            ], PacemCalendarYearPickerElement);
            Scaffolding.PacemCalendarYearPickerElement = PacemCalendarYearPickerElement;
            // #endregion
            function buildCalendarHeader() {
                let header = '';
                for (let day = 0; day < 7; day++) {
                    header += `<${Pacem.P}-span class="calendar-heading day-${day + 1} text-ellipsed" text="{{ :host._getHeaderLabel(:host._week[${day}]) }}"></${Pacem.P}-span>`;
                }
                return `<${Pacem.P}-panel hide="{{ :host.viewmode !== 'calendar' }}" class="calendar-header">${header}</${Pacem.P}-panel>`;
            }
            let PacemCalendarPickerElement = class PacemCalendarPickerElement extends Scaffolding.PacemBaseElement {
                constructor() {
                    super(...arguments);
                    this.viewmode = 'calendar';
                    this._clearBtnHandler = (evt) => {
                        evt.preventDefault();
                        this._viewDate = new Date();
                        this.changeHandler(new Pacem.Components.UI.DateSelectEvent(void 0));
                    };
                    this._viewDateChangeHandler = (e) => {
                        this._onViewDateChange(e);
                    };
                    this._popCalendarHandler = (e) => {
                        this.viewmode = 'calendar';
                        const dateValue = Pacem.Utils.parseDate(this.value);
                        this._calendar.viewDate =
                            this._monthPicker.month =
                                this._yearPicker.year =
                                    dateValue || this._calendar.viewDate;
                        const offset = Pacem.Utils.offset(this._input);
                        const dropdown = this._dropdown;
                        dropdown.style.top = (offset.top + offset.height) + 'px';
                        dropdown.style.left = offset.left + 'px';
                        dropdown.hidden = false;
                        requestAnimationFrame(() => {
                            Pacem.Utils.addClass(dropdown, 'dropdown-in');
                        });
                    };
                    this._hideCalendarHandler = (e) => {
                        const path = e.composedPath() || [];
                        if (path.indexOf(this._input) >= 0 || path.indexOf(this._dropdown) >= 0) {
                            return;
                        }
                        this._hideCalendar();
                    };
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'viewmode':
                        case '_viewDate':
                            this._onViewDateChange(this._viewDate);
                            break;
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    const dropdown = this._dropdown = this._proxy.dom[0];
                    const calendar = this._calendar = dropdown.querySelector(Pacem.P + '-calendar');
                    const monthPicker = this._monthPicker = dropdown.querySelector(Pacem.P + '-calendar-month-picker');
                    const yearPicker = this._yearPicker = dropdown.querySelector(Pacem.P + '-calendar-year-picker');
                    this._monthLabel = dropdown.querySelector('.calendar-month');
                    this._yearLabel = dropdown.querySelector('.calendar-year');
                    this._rangeLabel = dropdown.querySelector('.calendar-year-range');
                    const now = this._calendar.now = new Date();
                    const dateValue = Pacem.Utils.Dates.parse(this.value);
                    const hasValue = Pacem.Utils.Dates.isDate(dateValue);
                    const date = hasValue ? dateValue : now;
                    calendar.dayLabelFormatter = (d) => {
                        return Pacem.Utils.parseDate(d).toLocaleString(Pacem.Utils.lang(this), { day: 'numeric' });
                    };
                    monthPicker.addEventListener('viewyearchange', this._viewDateChangeHandler, false);
                    yearPicker.addEventListener('viewyearchange', this._viewDateChangeHandler, false);
                    calendar.addEventListener('viewdatechange', this._viewDateChangeHandler, false);
                    calendar.viewDate = date;
                    calendar.date = dateValue;
                    const input = this._input;
                    input.addEventListener('focus', this._popCalendarHandler, false);
                    input.addEventListener('mousedown', this._popCalendarHandler, false);
                    dropdown.addEventListener('mousedown', Pacem.stopPropagationHandler, false);
                    window.document.body.addEventListener('mousedown', this._hideCalendarHandler, true);
                    this._clearButton.addEventListener('mousedown', this._clearBtnHandler, false);
                }
                disconnectedCallback() {
                    const input = this._input;
                    if (!Pacem.Utils.isNull(input)) {
                        this._clearButton.removeEventListener('mousedown', this._clearBtnHandler, false);
                        input.removeEventListener('focus', this._popCalendarHandler, false);
                        input.removeEventListener('mousedown', this._popCalendarHandler, false);
                        this._dropdown.removeEventListener('mousedown', Pacem.stopPropagationHandler, false);
                        window.document.body.removeEventListener('mousedown', this._hideCalendarHandler, true);
                        this._calendar.removeEventListener('viewdatechange', this._viewDateChangeHandler, false);
                        this._monthPicker.removeEventListener('viewyearchange', this._viewDateChangeHandler, false);
                        this._yearPicker.removeEventListener('viewyearchange', this._viewDateChangeHandler, false);
                    }
                    super.disconnectedCallback();
                }
                _getHeaderLabel(d, mode = this.viewmode) {
                    const dte = Pacem.Utils.parseDate(d);
                    if (Pacem.Utils.Dates.isDate(dte)) {
                        return dte.toLocaleString(Pacem.Utils.lang(this), { weekday: 'narrow' });
                    }
                    return '...';
                }
                _prev(e) {
                    let months = -1;
                    switch (this.viewmode) {
                        case 'month':
                            months = -12;
                            break;
                        case 'year':
                            months = -120;
                            break;
                    }
                    this._jumpMonths(months);
                }
                _next(e) {
                    let months = 1;
                    switch (this.viewmode) {
                        case 'month':
                            months = 12;
                            break;
                        case 'year':
                            months = 120;
                            break;
                    }
                    this._jumpMonths(months);
                }
                _jumpMonths(m) {
                    const vd = Pacem.Utils.parseDate(this._viewDate);
                    this._viewDate = Pacem.Utils.Dates.addMonths(vd, m);
                }
                _setMonth(e) {
                    this._viewDate = e.detail;
                    this.viewmode = 'calendar';
                }
                _setYear(e) {
                    this._viewDate = e.detail;
                    this.viewmode = 'month';
                }
                _onViewDateChange(e) {
                    if (Pacem.Utils.isNullOrEmpty(e)) {
                        return;
                    }
                    const date = Pacem.Utils.parseDate(this._viewDate);
                    if (Pacem.Utils.Dates.isDate(date) && !Pacem.Utils.isNull(this._monthLabel)) {
                        switch (this.viewmode) {
                            case 'month':
                                this._yearLabel.text = date.toLocaleString(Pacem.Utils.lang(this), { year: 'numeric' });
                                break;
                            case 'year':
                                const fy = rangeFirstYear(date.getFullYear());
                                this._rangeLabel.text = `${fy} - ${fy + YEARS_IN_RANGE - 1}`;
                                break;
                            default:
                                this._monthLabel.text = date.toLocaleString(Pacem.Utils.lang(this), { month: 'long', year: 'numeric' });
                                break;
                        }
                    }
                }
                _hideCalendar() {
                    // animation just in case
                    Pacem.Utils.removeClass(this._dropdown, 'dropdown-in');
                    Pacem.Utils.addAnimationEndCallback(this._dropdown, e => {
                        this._dropdown.hidden = true;
                        Pacem.Utils.removeClass(this._dropdown, 'dropdown-select');
                    }, 250);
                }
                get inputFields() {
                    return [this._input];
                }
                toggleReadonlyView(readonly) {
                    if (this.isReady) {
                        this._input.readOnly = true;
                        this._input.hidden = readonly;
                        this._span.hide = !readonly;
                    }
                }
                onChange(evt) {
                    return new Promise((resolve, reject) => {
                        if (Pacem.CustomEventUtils.isInstanceOf(evt, Pacem.Components.UI.DateSelectEvent)) {
                            Pacem.Utils.addClass(this._dropdown, 'dropdown-select');
                            this.focus();
                            this._hideCalendar();
                            resolve(this.value = evt.detail);
                        }
                        else {
                            resolve(this.value);
                        }
                    });
                }
                acceptValue(val) {
                    this._input.value = this.viewValue;
                    const calendar = this._calendar;
                    if (!Pacem.Utils.isNull(calendar)) {
                        calendar.viewDate = calendar.date = Pacem.Utils.parseDate(val);
                    }
                }
                getViewValue(value) {
                    const v = value;
                    if (v) {
                        return Pacem.Utils.core.date(v, this.format || 'short', Pacem.Utils.lang(this));
                    }
                    return '';
                }
                compareValuePropertyValues(old, val) {
                    const dold = Pacem.Utils.parseDate(old), dval = Pacem.Utils.parseDate(val);
                    if (Pacem.Utils.isNullOrEmpty(dold) && Pacem.Utils.isNullOrEmpty(dval)) {
                        return true;
                    }
                    if (Pacem.Utils.isNullOrEmpty(dold) || Pacem.Utils.isNullOrEmpty(dval)) {
                        return false;
                    }
                    return dold.valueOf() == dval.valueOf();
                }
                convertValueAttributeToProperty(attr) {
                    return Pacem.PropertyConverters.Datetime.convert(attr);
                }
            };
            __decorate([
                Pacem.ViewChild("input[type=text]")
            ], PacemCalendarPickerElement.prototype, "_input", void 0);
            __decorate([
                Pacem.ViewChild(`.${Pacem.PCSS}-readonly`)
            ], PacemCalendarPickerElement.prototype, "_span", void 0);
            __decorate([
                Pacem.ViewChild(`${Pacem.P}-button[clear]`)
            ], PacemCalendarPickerElement.prototype, "_clearButton", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + "-shell-proxy")
            ], PacemCalendarPickerElement.prototype, "_proxy", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: JsonOrStringConverter })
            ], PacemCalendarPickerElement.prototype, "format", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Eval })
            ], PacemCalendarPickerElement.prototype, "disabledRanges", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemCalendarPickerElement.prototype, "weekStart", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemCalendarPickerElement.prototype, "viewmode", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemCalendarPickerElement.prototype, "_week", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemCalendarPickerElement.prototype, "_viewDate", void 0);
            PacemCalendarPickerElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-calendar-picker', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<div class="${Pacem.PCSS}-calendar-picker">
    <input type="text" class="${Pacem.PCSS}-input" /><${Pacem.P}-span text="{{ :host.viewValue }}" class="${Pacem.PCSS}-readonly"></${Pacem.P}-span>
    <${Pacem.P}-button class="button-flat ${Pacem.PCSS}-anim anim-pop anim-sudden anim-quick pos-absolute absolute-right absolute-top display-block ${Pacem.PCSS}-margin margin-0"
                 tab-order="-1"
                 hide="{{ :host.readonly || $pacem.isNull(:host.value) }}"
                 icon-glyph="close"
                 clear></${Pacem.P}-button>
</div>
<${Pacem.P}-shell-proxy>
    <div class="${Pacem.PCSS}-calendar-picker-dropdown" pacem hidden>
        <${Pacem.P}-collapse collapse="false">
            <div class="dropdown-grid">
                <div class="calendar-title">
                    <${Pacem.P}-span class="calendar-month calendar-zoom" on-click=":host.viewmode = 'month'" hide="{{ :host.viewmode !== 'calendar' }}"></${Pacem.P}-span>
                    <${Pacem.P}-span class="calendar-year calendar-zoom" on-click=":host.viewmode = 'year'" hide="{{ :host.viewmode !== 'month' }}"></${Pacem.P}-span>
                    <${Pacem.P}-span class="calendar-year-range" hide="{{ :host.viewmode !== 'year' }}"></${Pacem.P}-span>
                </div>
                <div class="calendar-month-nav ${Pacem.PCSS}-buttonset buttons">
                    <div class="buttonset-left">
                        <${Pacem.P}-button class="button button-size size-auto" on-click=":host._prev($event)" icon-glyph="chevron_left"></${Pacem.P}-button>
                        <${Pacem.P}-button class="button button-size size-auto" on-click=":host._next($event)" icon-glyph="chevron_right"></${Pacem.P}-button>
                    </div>
                </div>
                ${buildCalendarHeader()}
                <${Pacem.P}-calendar hide="{{ :host.viewmode !== 'calendar' }}" week="{{ :host._week, twoway }}" view-date="{{ :host._viewDate, twoway }}" week-start="{{ :host.weekStart }}" disabled-ranges="{{ :host.disabledRanges }}" on-dateselect="{{ :host.changeHandler($event) }}"></${Pacem.P}-calendar>
                <${Pacem.P}-calendar-month-picker hide="{{ :host.viewmode !== 'month' }}" on-monthselect=":host._setMonth($event)" month="{{ :host.value || Date.now() }}" view-year="{{ :host._viewDate && :host._viewDate.getFullYear() }}"></${Pacem.P}-calendar-month-picker>
                <${Pacem.P}-calendar-year-picker hide="{{ :host.viewmode !== 'year' }}" on-yearselect=":host._setYear($event)" year="{{ :host.value || Date.now() }}" view-year="{{ :host._viewDate && :host._viewDate.getFullYear() }}"></${Pacem.P}-calendar-year-picker>
            </div>
        <${Pacem.P}-collapse>
    </div>
</${Pacem.P}-shell-proxy>`
                })
            ], PacemCalendarPickerElement);
            Scaffolding.PacemCalendarPickerElement = PacemCalendarPickerElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            Scaffolding.CHAR_COUNTER_CHILD = `<${Pacem.P}-char-count hide="{{ :host.readonly || !(:host.minlength > 0 || :host.maxlength > 0) }}" minlength="{{ :host.minlength }}" maxlength="{{ :host.maxlength }}" string="{{ :host.value }}"></${Pacem.P}-char-count>`;
            let PacemCharCountElement = class PacemCharCountElement extends Components.PacemElement {
                _isValid(v) {
                    const l = this._length(v);
                    if (this.minlength > 0 && l < this.minlength)
                        return false;
                    if (this.maxlength > 0 && l > this.maxlength)
                        return false;
                    return true;
                }
                _length(s) {
                    return (s && s.length) || 0;
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemCharCountElement.prototype, "minlength", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemCharCountElement.prototype, "maxlength", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemCharCountElement.prototype, "string", void 0);
            PacemCharCountElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-char-count',
                    shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<${Pacem.P}-panel class="${Pacem.PCSS}-char-count" css-class="{{ {'valid': :host._isValid(:host.string), 'invalid': !:host._isValid(:host.string) } }}">
    <${Pacem.P}-span hide="{{ !(:host.minlength > 0) }}" class="${Pacem.PCSS}-char-min" content="{{ :host.minlength }}"></${Pacem.P}-span>
    <${Pacem.P}-span class="${Pacem.PCSS}-char-curr" content="{{ :host._length(:host.string) || '0' }}"></${Pacem.P}-span>
    <${Pacem.P}-span hide="{{ !(:host.maxlength > 0) }}" class="${Pacem.PCSS}-char-max" content="{{ :host.maxlength }}"></${Pacem.P}-span>
</${Pacem.P}-panel>`
                })
            ], PacemCharCountElement);
            Scaffolding.PacemCharCountElement = PacemCharCountElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemCheckboxListElement = class PacemCheckboxListElement extends Scaffolding.PacemDataSourceElement {
                constructor() {
                    super(true);
                    this._selectedUiItems = [];
                    this['key'] = '_' + Pacem.Utils.uniqueCode();
                }
                acceptValue(val) {
                    // no need to implement
                }
                get inputFields() {
                    return [];
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'disabled') {
                        this._disable.model = val;
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._disable.model = this.disabled;
                }
                toggleReadonlyView(readonly) {
                    this._span.hidden = !readonly;
                    this._repeater.hidden = readonly;
                }
                _selectionChanged(evt, index, item) {
                    if (evt.detail.propertyName === 'selected') {
                        let ndx, uiItems = this._selectedUiItems;
                        if (evt.detail.currentValue === true) {
                            uiItems.push(this.datasource[index]);
                        }
                        else if ((ndx = uiItems.indexOf(this.datasource[index])) !== -1) {
                            uiItems.splice(ndx, 1);
                        }
                    }
                }
                onChange(evt) {
                    const val = this.value = this._selectedUiItems.map(i => this.mapEntityToValue(i));
                    return Pacem.Utils.fromResult(val);
                }
            };
            __decorate([
                Pacem.ViewChild(`span.${Pacem.PCSS}-readonly`)
            ], PacemCheckboxListElement.prototype, "_span", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-repeater')
            ], PacemCheckboxListElement.prototype, "_repeater", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-data')
            ], PacemCheckboxListElement.prototype, "_disable", void 0);
            PacemCheckboxListElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-checkbox-list', template: `<${Pacem.P}-repeater datasource="{{ :host.adaptedDatasource }}">
    <ol class="${Pacem.PCSS}-checkbox-list ${Pacem.PCSS}-viewfinder" pacem>
        <template>
            <li><${Pacem.P}-checkbox disabled="{{ ::_disable.model || ^item.disabled }}" name="{{ :host.key, once }}" autobind="off" caption="{{ ^item.viewValue }}" true-value="{{ ^item.value }}" selected="{{ :host.isDataSourceItemSelected(^item, :host.value) }}"
on-focus=":host.focusHandler($event)" on-blur=":host.focusHandler($event)"
on-${Pacem.PropertyChangeEventName}=":host._selectionChanged($event, ^index, ^item)" on-change=":host.changeHandler($event)"></${Pacem.P}-checkbox></li>
        </template>
    </ol>
</${Pacem.P}-repeater><span class="${Pacem.PCSS}-readonly"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></span><${Pacem.P}-data></${Pacem.P}-data><${Pacem.P}-content></${Pacem.P}-content>`,
                    shadow: Pacem.Defaults.USE_SHADOW_ROOT
                })
            ], PacemCheckboxListElement);
            Scaffolding.PacemCheckboxListElement = PacemCheckboxListElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            const StringOrBooleanPropertyConverter = {
                convert: (attr) => attr === 'true' ? true : (attr === 'false' ? false : attr),
                convertBack: (prop) => prop.toString()
            };
            let PacemCheckboxElement = class PacemCheckboxElement extends Scaffolding.PacemBaseElement {
                constructor() {
                    super('checkbox');
                    this.caption = '';
                    this._key = '_' + Pacem.Utils.uniqueCode();
                }
                convertValueAttributeToProperty(attr) {
                    StringOrBooleanPropertyConverter.convert(attr) === this.trueValue ? this.trueValue : this.falseValue;
                }
                toggleReadonlyView(readonly) {
                    this.span.hidden = !readonly;
                    this._checkbox.hidden = this._label.hidden = readonly;
                }
                get inputFields() {
                    return [this._checkbox];
                }
                onChange(evt) {
                    this.selected = this._checkbox.checked;
                    const value = this.value = this.selected ? this.trueValue : this.falseValue;
                    return Pacem.Utils.fromResult(value);
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._checkbox.id = this._label.htmlFor = this._key;
                    this._synchronizeUi();
                    if (this.value /* weak equality to deal with declarative values and conversions */ == this.trueValue)
                        this.selected = true;
                    else if (this.value /* weak equality to deal with declarative values and conversions */ == this.falseValue)
                        this.selected = false;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!this.isReady) {
                        // the following are only UI-relevant modifications
                        return;
                    }
                    switch (name) {
                        case 'caption':
                            this._label.hidden = Pacem.Utils.isNullOrEmpty(val);
                            break;
                        case 'name':
                            this._checkbox.name = val;
                            break;
                        case 'selected':
                            this._synchronizeUi();
                            break;
                    }
                }
                _synchronizeUi(val = this.selected) {
                    if (this._checkbox.checked = val) {
                        this.value = this.trueValue;
                        Pacem.Utils.addClass(this, Pacem.PCSS + '-selected');
                        this.aria.attributes.set('checked', 'true');
                    }
                    else {
                        this.value = this.falseValue;
                        Pacem.Utils.removeClass(this, Pacem.PCSS + '-selected');
                        this.aria.attributes.set('checked', 'false');
                    }
                }
                acceptValue(val) {
                    this.selected = val /* weak equality to deal with declarative values and conversions */ == this.trueValue;
                }
                getViewValue(val) {
                    if (!Pacem.Utils.isNull(val))
                        return this.caption;
                    return '';
                }
            };
            __decorate([
                Pacem.ViewChild("input[type=checkbox]")
            ], PacemCheckboxElement.prototype, "_checkbox", void 0);
            __decorate([
                Pacem.ViewChild("label")
            ], PacemCheckboxElement.prototype, "_label", void 0);
            __decorate([
                Pacem.ViewChild(`.${Pacem.PCSS}-readonly`)
            ], PacemCheckboxElement.prototype, "span", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemCheckboxElement.prototype, "caption", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: StringOrBooleanPropertyConverter })
            ], PacemCheckboxElement.prototype, "trueValue", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: StringOrBooleanPropertyConverter })
            ], PacemCheckboxElement.prototype, "falseValue", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemCheckboxElement.prototype, "selected", void 0);
            PacemCheckboxElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-checkbox',
                    template: `<${Pacem.P}-span class="${Pacem.PCSS}-readonly ${Pacem.PCSS}-checkbox" text="{{ :host.caption }}"></${Pacem.P}-span>
<input type="checkbox" class="${Pacem.PCSS}-input" /><label class="${Pacem.PCSS}-label ${Pacem.PCSS}-checkbox ${Pacem.PCSS}-viewfinder" pacem><${Pacem.P}-text text="{{ :host.caption }}"></${Pacem.P}-text></label>`,
                    shadow: Pacem.Defaults.USE_SHADOW_ROOT
                })
            ], PacemCheckboxElement);
            Scaffolding.PacemCheckboxElement = PacemCheckboxElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            Scaffolding.FormSubmitEventName = 'submit';
            Scaffolding.FormResetEventName = 'reset';
            class FormSubmitEvent extends Pacem.CustomTypedEvent {
                constructor(args) {
                    super(Scaffolding.FormSubmitEventName, args, { bubbles: true, cancelable: true });
                }
            }
            Scaffolding.FormSubmitEvent = FormSubmitEvent;
            class FormResetEvent extends Event {
                constructor() {
                    super(Scaffolding.FormResetEventName, { bubbles: true, cancelable: true });
                }
            }
            Scaffolding.FormResetEvent = FormResetEvent;
            const EMITTABLE_EVENT_TYPES = ['download' /* upload element */, Pacem.CommandEventName];
            const SUBMIT_CANCELLATION_TOKEN = false;
            class FormEventEmitter {
                constructor(_element) {
                    this._element = _element;
                    this._itemEmitHandler = (e) => {
                        this._element.handle(e);
                        if (e.type === Pacem.CommandEventName) {
                            const evt = e;
                            this._element.handle(new CustomEvent('item' + evt.detail.commandName.toLowerCase(), { detail: evt.detail.commandArgument }));
                        }
                    };
                }
                start() {
                    EMITTABLE_EVENT_TYPES.forEach(t => this._element.addEventListener(t, this._itemEmitHandler, false));
                }
                stop() {
                    EMITTABLE_EVENT_TYPES.forEach(t => this._element.removeEventListener(t, this._itemEmitHandler, false));
                }
            }
            Scaffolding.FormEventEmitter = FormEventEmitter;
            let PacemFormElement = class PacemFormElement extends Scaffolding.PacemFormRelevantElement {
                constructor() {
                    super('form');
                    this.method = Pacem.Net.HttpMethod.Post;
                    this._emitter = null;
                    this._buttons = { submit: undefined, reset: undefined };
                    this._keyupHandler = (evt) => {
                        if (evt.keyCode === /* Enter */ 13
                            // no modifiers
                            && !evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey) {
                            let btn = evt.currentTarget.querySelector(Pacem.P + '-button[type=submit]');
                            if (!Pacem.Utils.isNull(btn) && Pacem.Utils.isVisible(btn) && !btn.disabled) {
                                btn.click();
                            }
                        }
                    };
                    this._submit = (fetcher, evt) => {
                        if (!Pacem.Utils.isNull(evt)) {
                            Pacem.avoidHandler(evt);
                        }
                        Promise.all(this._validateAllFields()).then(p => {
                            if (p.findIndex(f => f === false) === -1) {
                                this.submit(fetcher).then(_ => {
                                    // successful submission here
                                    this.setPristine();
                                }, _ => {
                                    // catch rejected/canceled
                                });
                            }
                        });
                    };
                    this._reset = (evt) => {
                        if (!Pacem.Utils.isNull(evt))
                            Pacem.avoidHandler(evt);
                        var resetEvt = new FormResetEvent();
                        this.dispatchEvent(resetEvt);
                        if (resetEvt.defaultPrevented) {
                            return;
                        }
                        // reset
                        // fields first
                        for (var field in this._fields) {
                            var fld = this._fields[field];
                            if (fld instanceof Scaffolding.PacemModelElement)
                                fld.reset();
                        }
                        // then sub-forms
                        for (var form of this._subForms) {
                            form._reset();
                        }
                    };
                    this._fields = {};
                    this._validators = {};
                    this._subForms = [];
                    this._fieldPropertyChanged = (evt) => {
                        switch (evt.detail.propertyName) {
                            case 'value':
                                // validate:
                                let model = evt.target;
                                this._checkFieldValidity(model.name);
                                break;
                            case 'dirty':
                                this._checkDirtyness();
                                break;
                            case 'valid':
                                this._checkValidity();
                                break;
                        }
                    };
                    this._validatorPropertyChanged = (evt) => {
                        const validator = evt.target, name = validator.watch;
                        if (evt.detail.propertyName === 'invalid') {
                            let model = this._fields[validator.watch];
                            if (validator.invalid)
                                model.valid = false;
                            else
                                this._checkFieldValidity(name);
                        }
                        else {
                            this._checkFieldValidity(name);
                        }
                    };
                    /** Gets or sets whether to hint invalid fields even if still pristine (default 'true').
                     * When 'true' - and form is autogenerated - the submit button status is tightly bound to the form valid state. */
                    this.suddenValidation = true;
                    /** Gets or sets whether the form should show - when autogenerated - the reset button. */
                    this.resettable = true;
                    this._emitter = new FormEventEmitter(this);
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if ((name === 'method' && this.autogenerate === true && !Pacem.Utils.isNullOrEmpty(this.metadata)) ||
                        (name === 'metadata' && this.autogenerate === true) ||
                        (name === 'autogenerate' && val === true && this.metadata && (this.metadata['props'] || this.metadata).length > 0)) {
                        this._buildUpForm();
                    }
                    else {
                        switch (name) {
                            case 'readonly':
                                //this._lockSubForms(val);
                                break;
                        }
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this.form && this.form.registerSubForm(this);
                    this._checkValidity();
                    this.addEventListener('keyup', this._keyupHandler, false);
                    this._emitter.start();
                }
                disconnectedCallback() {
                    this._emitter.stop();
                    this.removeEventListener('keyup', this._keyupHandler, false);
                    this.form && this.form.unregisterSubForm(this);
                    super.disconnectedCallback();
                }
                _buildUpForm() {
                    const key = '_' + Pacem.Utils.uniqueCode();
                    const uid = this.id = (this.id || key);
                    const f_uid = 'fetch' + key;
                    //
                    const form = document.createElement('form');
                    form.id = "form" + key;
                    form.className = Pacem.PCSS + '-form';
                    form.setAttribute('pacem', '');
                    form.setAttribute('novalidate', '');
                    const html = `<${Pacem.P}-repeater class="${Pacem.PCSS}-animatable-list ${Pacem.PCSS}-list-bottom" datasource="{{ #${uid}.metadata && (#${uid}.metadata.props || #${uid}.metadata) }}">
    <${Pacem.P}-panel css="{{ #${uid}.metadata.display && #${uid}.metadata.display.css }}" css-class="{{ (#${uid}.metadata.display && #${uid}.metadata.display.cssClass || []).concat(#${uid}.suddenValidation ? [] : ['lazy-validation']) }}">
        <template>
            <${Pacem.P}-form-field css-class="{{ ^item.display && ^item.display.cssClass }}" css="{{ ^item.display && ^item.display.css }}"
                             fetch-credentials="{{ #${uid}.fetchCredentials }}" fetch-headers="{{ #${uid}.fetchHeaders }}"
                             logger="{{ #${uid}.logger }}" entity="{{ #${uid}.entity, twoway }}" metadata="{{ ^item }}" readonly="{{ #${uid}.readonly || ^item.isReadOnly }}"></${Pacem.P}-form-field>
        </template>
    </${Pacem.P}-panel>
</${Pacem.P}-repeater>
<${Pacem.P}-fetch logger="{{ #${uid}.logger }}" id="${f_uid}" method="${this.method}" credentials="{{ #${uid}.fetchCredentials }}" headers="{{ #${uid}.fetchHeaders }}"></${Pacem.P}-fetch> 
<div class="${Pacem.PCSS}-buttonset buttons">
    <div class="buttonset-left">
        <${Pacem.P}-button logger="{{ #${uid}.logger }}" on-click="#${uid}._submit(#${f_uid}, $event)" type="submit" hide="{{ #${uid}.readonly || Pacem.Utils.isNullOrEmpty(#${uid}.action) || !Pacem.Utils.isNull(#${uid}.form) }}" class="button primary button-size size-small" css-class="{{ {'buttonset-last': !#${uid}.resettable || !#${uid}.dirty || !Pacem.Utils.isNull(#${uid}.form) } }}" disabled="{{ #${uid}.suddenValidation && (!(#${uid}.valid && #${uid}.dirty) || #${f_uid}.fetching) }}">
            <${Pacem.P}-text text="{{ #${uid}.submitCaption || 'OK' }}"></${Pacem.P}-text>
        </${Pacem.P}-button>
        <${Pacem.P}-button logger="{{ #${uid}.logger }}" on-click="#${uid}._reset($event)" type="reset" class="button button-size size-small" css-class="{{ {'buttonset-first': #${uid}.readonly || Pacem.Utils.isNullOrEmpty(#${uid}.action) || !Pacem.Utils.isNull(#${uid}.form)} }}" hide="{{ !#${uid}.resettable || #${uid}.readonly || !#${uid}.dirty || !Pacem.Utils.isNull(#${uid}.form) }}" disabled="{{ #${f_uid}.fetching }}">
            <${Pacem.P}-text text="{{ #${uid}.resetCaption || 'Reset' }}"></${Pacem.P}-text>
        </${Pacem.P}-button>
</div></div>`;
                    // buttons are kept hidden if 
                    form.innerHTML = html;
                    this.innerHTML = '';
                    this.appendChild(form);
                    form.addEventListener('submit', Pacem.avoidHandler, false);
                    const old = this._buttons;
                    const val = this._buttons = {
                        submit: form.lastElementChild.firstElementChild.firstElementChild,
                        reset: form.lastElementChild.firstElementChild.lastElementChild
                    };
                    this.dispatchEvent(new Pacem.PropertyChangeEvent({ propertyName: 'formButtons', currentValue: val, oldValue: old }));
                }
                /** Gets the 'submit' and 'reset' form buttons. */
                get formButtons() {
                    return this._buttons;
                }
                /**
                 * Submits the form data via a provided fetcher.
                 * @param fetcher The fetching delegate.
                 */
                submit(fetcher) {
                    if (Pacem.Utils.isNull(fetcher))
                        throw `Fetcher cannot be null while submitting a form.`;
                    var deferred = Pacem.DeferPromise.defer();
                    this._submitInternally(fetcher).then(_ => {
                        this.dispatchEvent(new CustomEvent("success", { detail: _ }));
                        deferred.resolve(_);
                    }, _ => {
                        if (_ !== SUBMIT_CANCELLATION_TOKEN) {
                            this.dispatchEvent(new CustomEvent("fail", { detail: _ }));
                        }
                        deferred.reject(_);
                    });
                    return deferred.promise;
                }
                /** Resets the form to its pristine values. */
                reset() {
                    this._reset();
                }
                _submitInternally(fetcher, args) {
                    if (Pacem.Utils.isNull(fetcher))
                        throw `Fetcher cannot be null while submitting a form.`;
                    var deferred = Pacem.DeferPromise.defer();
                    const entity = this.entity, entityName = this.entityName;
                    var model = {};
                    if (!Pacem.Utils.isNullOrEmpty(entityName)) {
                        model[entityName] = entity;
                    }
                    else {
                        model = entity;
                    }
                    var args = { parameters: model, fields: this._getAllFields() };
                    // allow to inject some logic while submitting...
                    var submitEvt = new FormSubmitEvent(args);
                    this.dispatchEvent(submitEvt);
                    if (submitEvt.defaultPrevented) {
                        // rejection using `false` identifies a canceled submission.
                        deferred.reject(SUBMIT_CANCELLATION_TOKEN);
                    }
                    else {
                        // ...use the output parameters
                        fetcher.parameters = Pacem.Utils.extend({}, submitEvt.detail.parameters);
                        // a) fetcher success event listener
                        const fnSuccess = (evt) => {
                            fetcher.removeEventListener(Pacem.Net.FetchSuccessEventName, fnSuccess, false);
                            fetcher.removeEventListener(Pacem.Net.FetchErrorEventName, fnError, false);
                            const r = evt.detail;
                            if (r.headers.get("Content-Length") == "0") {
                                // if (204) then resolve right here (won't enter 'fnResult')
                                fetcher.removeEventListener(Pacem.Net.FetchResultEventName, fnResult, false);
                                this.success = true;
                                deferred.resolve({});
                            }
                        };
                        // b) fetcher fetchresult event listener
                        const fnResult = (evt) => {
                            // remove listeners (others have already been removed in 'fnSuccess')
                            fetcher.removeEventListener(Pacem.Net.FetchResultEventName, fnResult, false);
                            //
                            var result = evt.detail;
                            if (typeof (result) === 'object' && result.hasOwnProperty('success')) {
                                if (result.success === true) {
                                    this.success = true;
                                    deferred.resolve(result.result || {});
                                }
                                else {
                                    this.fail = true;
                                    deferred.reject(result.error);
                                }
                            }
                            else {
                                this.success = true;
                                deferred.resolve(result);
                            }
                        };
                        // c) fetcher error event listener
                        const fnError = (evt) => {
                            // remove listeners
                            fetcher.removeEventListener(Pacem.Net.FetchSuccessEventName, fnSuccess, false);
                            fetcher.removeEventListener(Pacem.Net.FetchResultEventName, fnResult, false);
                            fetcher.removeEventListener(Pacem.Net.FetchErrorEventName, fnError, false);
                            this.fail = true;
                            const response = evt.detail;
                            deferred.reject(response);
                        };
                        // fetcher propertychange event listener
                        const fnPropChange = (evt) => {
                            switch (evt.detail.propertyName) {
                                case 'fetching':
                                    if (evt.detail.currentValue === true) {
                                        Pacem.Utils.addClass(this, Pacem.PCSS + '-fetching');
                                    }
                                    else {
                                        Pacem.Utils.removeClass(this, Pacem.PCSS + '-fetching');
                                        fetcher.removeEventListener(Pacem.PropertyChangeEventName, fnPropChange, false);
                                    }
                                    break;
                            }
                        };
                        fetcher.addEventListener(Pacem.PropertyChangeEventName, fnPropChange, false);
                        fetcher.addEventListener(Pacem.Net.FetchSuccessEventName, fnSuccess, false);
                        fetcher.addEventListener(Pacem.Net.FetchResultEventName, fnResult, false);
                        fetcher.addEventListener(Pacem.Net.FetchErrorEventName, fnError, false);
                        if (!Pacem.Utils.isNullOrEmpty(this.action)) {
                            fetcher.url = this.action;
                        }
                        // is it an 'inert' PacemFetchElement?
                        if (fetcher instanceof Components.PacemFetchElement && !fetcher.autofetch) {
                            fetcher.fetch();
                        }
                        this.success = this.fail = false;
                    }
                    //
                    return deferred.promise;
                }
                _getAllFields(accumulator = {}) {
                    Pacem.Utils.extend(accumulator, this._fields);
                    for (var form of this._subForms) {
                        form._getAllFields(accumulator);
                    }
                    return accumulator;
                }
                /** Sets the current form state as its pristine state. */
                setPristine() {
                    for (var field in this._fields) {
                        var fld = this._fields[field];
                        if (fld instanceof Scaffolding.PacemModelElement)
                            fld.setPristine();
                    }
                    for (var form of this._subForms) {
                        form.setPristine();
                    }
                }
                _checkFieldValidity(name) {
                    if (name in this._fields)
                        this._validateField(name, false);
                }
                validate(name) {
                    if (!Pacem.Utils.isNullOrEmpty(name)) {
                        this._checkFieldValidity(name);
                    }
                    else {
                        this._validateAllFields();
                    }
                }
                _validateAllFields(setAsDirty = true) {
                    const tasks = [];
                    for (let field in this._fields) {
                        tasks.push(this._validateField(field, setAsDirty));
                    }
                    for (let sub of this._subForms) {
                        Array.prototype.push.apply(tasks, sub._validateAllFields(setAsDirty));
                    }
                    return tasks;
                }
                // Remove Concurrent from here, better check the closure for params in @Concurrent
                //@Concurrent()
                _validateField(name, setAsDirty) {
                    var deferred = Pacem.DeferPromise.defer();
                    var model = this._fields[name];
                    if (model) {
                        var validators = this._validators[model.name];
                        if (validators && validators.length > 0) {
                            this.log(Pacem.Logging.LogLevel.Log, `Computing "${model.name}" validity.`);
                            Promise.all(validators.map(v => v.validate(model.value)
                                .then(_ => !(v.invalid = !_))))
                                .then(results => {
                                let valid = true;
                                for (var result of results) {
                                    if (result === false) {
                                        valid = false;
                                        // set dirty only when not valid
                                        if (setAsDirty)
                                            model.setDirty();
                                        break;
                                    }
                                }
                                this.log(Pacem.Logging.LogLevel.Log, `Property "${model.name}" turns out to be ${(valid ? '' : 'not ')}valid.`);
                                deferred.resolve(model.valid = valid);
                            });
                        }
                        else {
                            this.log(Pacem.Logging.LogLevel.Log, `Property "${model.name}" has no validators.`);
                            deferred.resolve(model.valid = true);
                        }
                    }
                    else {
                        this.log(Pacem.Logging.LogLevel.Log, `Property "${name}" has no fields in this form.`);
                        deferred.resolve(true);
                    }
                    //
                    return deferred.promise;
                }
                // #region FORM HIERARCHY validity/dirtyness
                _checkDirtyness() {
                    let dirty = false;
                    for (var model in this._fields) {
                        if (this._fields[model].dirty === true) {
                            dirty = true;
                            break;
                        }
                    }
                    if ( /* still */dirty === false) {
                        for (var form of this._subForms) {
                            if (form.dirty) {
                                dirty = true;
                                break;
                            }
                        }
                    }
                    this.dirty = dirty;
                }
                ;
                _checkValidity() {
                    let valid = true;
                    for (var model in this._fields) {
                        this.log(Pacem.Logging.LogLevel.Log, `Checking "${model}" validity.`);
                        if (this._fields[model].valid === false) {
                            this.log(Pacem.Logging.LogLevel.Log, `"${model}" is not valid.`);
                            valid = false;
                            break;
                        }
                    }
                    if ( /* still */valid === true) {
                        for (var form of this._subForms) {
                            if (!form.valid) {
                                valid = false;
                                break;
                            }
                        }
                    }
                    this.valid = valid;
                }
                ;
                registerSubForm(form) {
                    let arr = this._subForms;
                    if (arr.indexOf(form) == -1) {
                        form.addEventListener(Pacem.PropertyChangeEventName, this._fieldPropertyChanged, false);
                        arr.push(form);
                        this._checkValidity();
                        this._checkDirtyness();
                    }
                }
                unregisterSubForm(form) {
                    let arr = this._subForms, ndx = arr.indexOf(form);
                    if (ndx >= 0) {
                        form.removeEventListener(Pacem.PropertyChangeEventName, this._fieldPropertyChanged, false);
                        arr.splice(ndx, 1);
                        this._checkValidity();
                        this._checkDirtyness();
                    }
                }
                registerField(name, model) {
                    var container = this._fields;
                    if (container[name] != model) {
                        this.unregisterField(name, false);
                        container[name] = model;
                        this.log(Pacem.Logging.LogLevel.Log, `Registering "${name}" field.`);
                        if (model instanceof HTMLElement)
                            model.addEventListener(Pacem.PropertyChangeEventName, this._fieldPropertyChanged, false);
                        this._checkFieldValidity(name);
                        this._checkDirtyness();
                    }
                }
                unregisterField(name, check = true) {
                    var container = this._fields, current = container[name];
                    if (current instanceof HTMLElement)
                        current.removeEventListener(Pacem.PropertyChangeEventName, this._fieldPropertyChanged, false);
                    delete container[name];
                    if (current && check === true) {
                        this._checkValidity();
                        this._checkDirtyness();
                    }
                }
                registerValidator(name, validator) {
                    var container = this._validators[name] = this._validators[name] || [], index = container.indexOf(validator);
                    if (index == -1) {
                        container.push(validator);
                        if (validator instanceof HTMLElement)
                            validator.addEventListener(Pacem.PropertyChangeEventName, this._validatorPropertyChanged, false);
                        this.log(Pacem.Logging.LogLevel.Log, `Calling "${name}" validity check after validator registration.`);
                        // most likely, at this point, the corresponding field isn't available yet.
                        this._checkFieldValidity(name);
                    }
                }
                unregisterValidator(name, validator) {
                    this._unregisterValidator(name, validator, true);
                }
                _unregisterValidator(name, validator, check) {
                    var container = this._validators[name] = this._validators[name] || [], index = container.indexOf(validator);
                    if (index >= 0) {
                        if (validator instanceof HTMLElement)
                            validator.removeEventListener(Pacem.PropertyChangeEventName, this._validatorPropertyChanged, false);
                        container.splice(index, 1);
                        if (check)
                            this._checkFieldValidity(name);
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemFormElement.prototype, "fetchCredentials", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemFormElement.prototype, "fetchHeaders", void 0);
            __decorate([
                Pacem.Watch({ reflectBack: true, converter: Pacem.PropertyConverters.String })
            ], PacemFormElement.prototype, "method", void 0);
            __decorate([
                Pacem.Watch({ reflectBack: true, converter: Pacem.PropertyConverters.String })
            ], PacemFormElement.prototype, "submitCaption", void 0);
            __decorate([
                Pacem.Watch({ reflectBack: true, converter: Pacem.PropertyConverters.String })
            ], PacemFormElement.prototype, "resetCaption", void 0);
            __decorate([
                Pacem.Debounce(100)
            ], PacemFormElement.prototype, "_buildUpForm", null);
            __decorate([
                Pacem.Concurrent()
            ], PacemFormElement.prototype, "validate", null);
            __decorate([
                Pacem.Watch({ reflectBack: true, converter: Pacem.PropertyConverters.Boolean })
            ], PacemFormElement.prototype, "valid", void 0);
            __decorate([
                Pacem.Watch({ reflectBack: true, converter: Pacem.PropertyConverters.Boolean })
            ], PacemFormElement.prototype, "dirty", void 0);
            __decorate([
                Pacem.Watch({ reflectBack: true, converter: Pacem.PropertyConverters.Boolean })
            ], PacemFormElement.prototype, "readonly", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemFormElement.prototype, "success", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemFormElement.prototype, "fail", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemFormElement.prototype, "entity", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemFormElement.prototype, "entityName", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemFormElement.prototype, "metadata", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemFormElement.prototype, "autogenerate", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemFormElement.prototype, "suddenValidation", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemFormElement.prototype, "resettable", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemFormElement.prototype, "action", void 0);
            PacemFormElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-form' })
            ], PacemFormElement);
            Scaffolding.PacemFormElement = PacemFormElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="types.ts" />
/// <reference path="form.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            /** For internal use ONLY! */
            let PacemChildFormPropagatorElement = class PacemChildFormPropagatorElement extends Components.PacemEventTarget {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'watch' || name === 'property' || (name === 'model' && val && val.length > (old && old.length || 0))) {
                        this._synchronize();
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._synchronize();
                }
                _synchronize() {
                    const model = this.model, propagate = this.property, value = this.watch;
                    if (Pacem.Utils.isNullOrEmpty(model) || Pacem.Utils.isNullOrEmpty(propagate)) {
                        return;
                    }
                    if (Pacem.Utils.isArray(model)) {
                        for (let item of model) {
                            item[propagate] = value;
                        }
                        // trigger change
                        model.splice(model.length);
                    }
                    else {
                        model[propagate] = value;
                        // trigger change
                        this.model = Pacem.Utils.clone(model);
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemChildFormPropagatorElement.prototype, "property", void 0);
            __decorate([
                Pacem.Watch({ emit: false })
            ], PacemChildFormPropagatorElement.prototype, "watch", void 0);
            __decorate([
                Pacem.Watch({ emit: false /* mandatory twoway binding */ })
            ], PacemChildFormPropagatorElement.prototype, "model", void 0);
            PacemChildFormPropagatorElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-childform-propagator' })
            ], PacemChildFormPropagatorElement);
            Scaffolding.PacemChildFormPropagatorElement = PacemChildFormPropagatorElement;
            /** Represents a sub-form for automatic generation of editing fields for sub-entities.  */
            let PacemChildFormElement = class PacemChildFormElement extends Scaffolding.PacemBaseElement {
                constructor() {
                    super(...arguments);
                    /** Internal representation of the entity. */
                    this._model = [];
                    this._subForms = [];
                }
                get inputFields() {
                    return [];
                }
                toggleReadonlyView(readonly) {
                    // automatic
                }
                onChange(evt) {
                    return new Promise((resolve, _) => {
                        var val = this._modelToEntity();
                        resolve(this.value = val);
                    });
                }
                acceptValue(val) {
                    this._entityToModel(val);
                }
                getViewValue(value) {
                    return '';
                }
                convertValueAttributeToProperty(attr) {
                    return Pacem.PropertyConverters.Json.convert(attr, this);
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'mode':
                            this._entityToModel();
                            break;
                    }
                }
                _dragStart(evt) {
                    var args = evt.detail;
                    const size = Pacem.Utils.offset(args.element), floater = args.floater;
                    floater.style.width = size.width + 'px';
                    floater.style.height = size.height + 'px';
                }
                _dragEnd(evt) {
                    if (this.mode === 'array' /*&& !Utils.isNull(evt.detail.target)*/) {
                        this._triggerChange();
                    }
                }
                reset() {
                    super.reset();
                    // once the value/entity with this component is reset
                    // it is not necessary to process the subForms
                    this._subForms.forEach(f => {
                        f.setPristine();
                    });
                }
                _itemCreate(evt) {
                    const ndx = evt.detail.index, subForms = this._subForms;
                    evt.detail.dom[0].childNodes.forEach(e => {
                        if (e instanceof Element && e.localName === (Pacem.P + '-form')) {
                            subForms.splice(ndx, subForms.length - ndx, e);
                        }
                    });
                }
                _itemChange(ndx, evt) {
                    if (evt.detail.propertyName === 'entity'
                        && Pacem.Utils.Json.stringify(this._model[ndx]) !== Pacem.Utils.Json.stringify(evt.detail.currentValue)) {
                        this._model.splice(ndx, 1, evt.detail.currentValue);
                        this._triggerChange();
                    }
                }
                _deleteAt(evt) {
                    // prevent the event to bubble (nested scenarios).
                    Pacem.avoidHandler(evt.srcEvent);
                    const model = this._model;
                    if (this.mode === 'array') {
                        model.splice(evt.detail, 1);
                    }
                    else {
                        model.splice(0, model.length);
                    }
                    this._triggerChange();
                }
                _addItem(evt) {
                    const mode = this.mode, model = this._model;
                    if (mode === 'array') {
                        model.push({});
                    }
                    else {
                        model.splice(0, model.length, {});
                    }
                    this._triggerChange();
                }
                _triggerChange() {
                    this.changeHandler(new Event('change'));
                }
                _entityToModel(entity = this.value) {
                    switch (this.mode) {
                        case 'array':
                            let arr = entity || [];
                            if (Pacem.Utils.isArray(arr)) {
                                this._model.cloneFrom(arr);
                            }
                            break;
                        default:
                            const model = this._model, length = model.length;
                            if (length !== 1 || model[0] !== entity) {
                                if (!Pacem.Utils.isNull(entity)) {
                                    model.splice(0, length, entity);
                                }
                                else {
                                    model.splice(0, length);
                                }
                            }
                            break;
                    }
                }
                _modelToEntity(model = this._model) {
                    switch (this.mode) {
                        case 'array':
                            return Pacem.Utils.clone(model);
                        default:
                            return model && model.length && model[0] || null;
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemChildFormElement.prototype, "fetchCredentials", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemChildFormElement.prototype, "fetchHeaders", void 0);
            __decorate([
                Pacem.ViewChild('.' + Pacem.PCSS + '-childform')
            ], PacemChildFormElement.prototype, "_container", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-drag-drop')
            ], PacemChildFormElement.prototype, "_dragger", void 0);
            __decorate([
                Pacem.ViewChild('.' + Pacem.PCSS + '-childform-item-floater')
            ], PacemChildFormElement.prototype, "_floater", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemChildFormElement.prototype, "mode", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemChildFormElement.prototype, "lockItems", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemChildFormElement.prototype, "metadata", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemChildFormElement.prototype, "_model", void 0);
            PacemChildFormElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-childform', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<${Pacem.P}-repeater datasource="{{ :host._model }}" on-itemdelete=":host._deleteAt($event)" on-${Components.RepeaterItemCreateEventName}=":host._itemCreate($event)">
    <div class="${Pacem.PCSS}-childform">
    <template>
        <${Pacem.P}-panel class="${Pacem.PCSS}-childform-item" behaviors="{{ [::_dragger] }}">
            <${Pacem.P}-panel class="childform-item-handle ${Pacem.PCSS}-margin margin-right-1" hide="{{ :host.lockItems || :host.readonly || :host.mode !== 'array' || !(:host._model && :host._model.length > 1) }}"><i class="${Pacem.PCSS}-icon drag-handle">drag_handle</i></${Pacem.P}-panel>
            <${Pacem.P}-panel class="childform-item-index text-small"><${Pacem.P}-span hide="{{ !:host.readonly || :host.mode !== 'array' }}" class="${Pacem.PCSS}-margin margin-right-1" text="{{ ^index+1 }}"></${Pacem.P}-span></${Pacem.P}-panel>
            <${Pacem.P}-form entity="{{ ^item }}" fetch-headers="{{ :host.fetchHeaders }}" fetch-credentials="{{ :host.fetchCredentials }}" on-${Pacem.PropertyChangeEventName}=":host._itemChange(^index, $event)" readonly="{{ :host.readonly }}" metadata="{{ :host.metadata }}" autogenerate="true" logger="{{ :host.logger }}"></${Pacem.P}-form>
            <${Pacem.P}-button tab-order="-1" class="flat circular circle-small clear ${Pacem.PCSS}-margin margin-left-1" hide="{{ :host.lockItems || :host.readonly }}" command-name="delete" command-argument="{{ ^index }}"></${Pacem.P}-button>
        </${Pacem.P}-panel>
    </template>
    </div>
    <${Pacem.P}-button tab-order="-1" class="flat circular circle-small add" hide="{{ :host.lockItems || :host.readonly || !(:host.mode === 'array' || $pacem.isNullOrEmpty(:host._model)) }}" on-click=":host._addItem($event)"></${Pacem.P}-button>
</${Pacem.P}-repeater>
<div class="${Pacem.PCSS}-childform-item-floater ${Pacem.PCSS}-panel panel-border">
    <div class="corner top-left"></div><div class="corner top-right"></div><div class="corner bottom-left"></div><div class="corner bottom-right"></div>
</div>
<${Pacem.P}-drag-drop floater="{{ ::_floater }}" disabled="{{ :host.lockItems }}"
    on-${Pacem.UI.DragDropEventType.Start}=":host._dragStart($event)"
    on-${Pacem.UI.DragDropEventType.End}=":host._dragEnd($event)" 
    drop-behavior="${Pacem.UI.DropBehavior.InsertChild}" mode="${Pacem.UI.DragDataMode.Alias}" handle-selector=".drag-handle" drop-targets="{{ [::_container] }}"></${Pacem.P}-drag-drop>`
                })
            ], PacemChildFormElement);
            Scaffolding.PacemChildFormElement = PacemChildFormElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            var _ContenteditableDOMObserver_selector, _ContenteditableDOMObserver_callback, _ContenteditableDOMObserver_contentElement, _ContenteditableDOMObserver_mutationObserver;
            function isRoot(element) {
                return element instanceof HTMLDivElement
                    && element.contentEditable === 'true'
                    && element.hasAttribute('pacem')
                    && element.hasAttribute('role')
                    && element.attributes['role'].value === 'presenter';
            }
            class ContenteditableDOMObserver {
                constructor(contentElement, mutationCallback, selector = '*[contenteditable=false]') {
                    _ContenteditableDOMObserver_selector.set(this, void 0);
                    _ContenteditableDOMObserver_callback.set(this, void 0);
                    _ContenteditableDOMObserver_contentElement.set(this, void 0);
                    _ContenteditableDOMObserver_mutationObserver.set(this, void 0);
                    __classPrivateFieldSet(this, _ContenteditableDOMObserver_callback, mutationCallback, "f");
                    __classPrivateFieldSet(this, _ContenteditableDOMObserver_selector, selector, "f");
                    __classPrivateFieldSet(this, _ContenteditableDOMObserver_mutationObserver, new MutationObserver(list => {
                        const fn = (item, removed) => {
                            item.childNodes.forEach(i => /* recursion here */ fn(i, removed));
                            mutationCallback(item, removed);
                        };
                        for (let entry of list) {
                            const added = entry.addedNodes;
                            const removed = entry.removedNodes;
                            for (let j = 0; j < added.length; j++) {
                                const item = added.item(j);
                                fn(item, false);
                            }
                            for (let j = 0; j < removed.length; j++) {
                                const item = removed.item(j);
                                fn(item, true);
                            }
                        }
                    }), "f");
                    this._initContainer(contentElement);
                }
                _initContainer(contentElement) {
                    contentElement.querySelectorAll(__classPrivateFieldGet(this, _ContenteditableDOMObserver_selector, "f")).forEach(el => __classPrivateFieldGet(this, _ContenteditableDOMObserver_callback, "f").call(this, el));
                    __classPrivateFieldGet(this, _ContenteditableDOMObserver_mutationObserver, "f").observe(contentElement, { subtree: true, childList: true });
                    __classPrivateFieldSet(this, _ContenteditableDOMObserver_contentElement, contentElement, "f");
                }
                _disposeContainer(contentElement) {
                    const observer = __classPrivateFieldGet(this, _ContenteditableDOMObserver_mutationObserver, "f");
                    if (!Pacem.Utils.isNull(observer)) {
                        observer.disconnect();
                    }
                    contentElement.querySelectorAll(__classPrivateFieldGet(this, _ContenteditableDOMObserver_selector, "f")).forEach(el => __classPrivateFieldGet(this, _ContenteditableDOMObserver_callback, "f").call(this, el, true));
                }
                dispose() {
                    this._disposeContainer(__classPrivateFieldGet(this, _ContenteditableDOMObserver_contentElement, "f"));
                }
            }
            _ContenteditableDOMObserver_selector = new WeakMap(), _ContenteditableDOMObserver_callback = new WeakMap(), _ContenteditableDOMObserver_contentElement = new WeakMap(), _ContenteditableDOMObserver_mutationObserver = new WeakMap();
            Scaffolding.ContenteditableDOMObserver = ContenteditableDOMObserver;
            class ContenteditableUtils {
                static getDefaultDashboard() {
                    const frag = new DocumentFragment();
                    const toolbar0 = document.createElement('div');
                    Pacem.Utils.addClass(toolbar0, Pacem.PCSS + '-contenteditable-toolbar');
                    const undo = new Scaffolding.PacemContenteditableHistoryCommandElement();
                    undo.command = 'undo';
                    undo.keyboardShortcut = "Ctrl+Z";
                    const redo = new Scaffolding.PacemContenteditableHistoryCommandElement();
                    redo.command = 'redo';
                    redo.keyboardShortcut = "Ctrl+Y";
                    toolbar0.append(undo, redo);
                    const separator0 = document.createElement('div');
                    Pacem.Utils.addClass(separator0, Pacem.PCSS + '-contenteditable-separator');
                    const toolbar1 = document.createElement('div');
                    Pacem.Utils.addClass(toolbar1, Pacem.PCSS + '-contenteditable-toolbar');
                    const bold = new Scaffolding.PacemContenteditableExecCommandElement();
                    bold.command = Scaffolding.KnownExecCommand.Bold;
                    bold.keyboardShortcut = "Ctrl+B";
                    const italic = new Scaffolding.PacemContenteditableExecCommandElement();
                    italic.command = Scaffolding.KnownExecCommand.Italic;
                    italic.keyboardShortcut = "Ctrl+I";
                    const underline = new Scaffolding.PacemContenteditableExecCommandElement();
                    underline.command = Scaffolding.KnownExecCommand.Underline;
                    underline.keyboardShortcut = "Ctrl+U";
                    const strike = new Scaffolding.PacemContenteditableExecCommandElement();
                    strike.command = Scaffolding.KnownExecCommand.StrikeThrough;
                    underline.keyboardShortcut = "Ctrl+K";
                    const ul = new Scaffolding.PacemContenteditableExecCommandElement();
                    ul.command = Scaffolding.KnownExecCommand.UnorderedList;
                    const ol = new Scaffolding.PacemContenteditableExecCommandElement();
                    ol.command = Scaffolding.KnownExecCommand.OrderedList;
                    const alignLeft = new Scaffolding.PacemContenteditableAlignCommandElement();
                    alignLeft.align = 'left';
                    const alignCenter = new Scaffolding.PacemContenteditableAlignCommandElement();
                    alignCenter.align = 'center';
                    const alignRight = new Scaffolding.PacemContenteditableAlignCommandElement();
                    alignRight.align = 'right';
                    const justify = new Scaffolding.PacemContenteditableAlignCommandElement();
                    justify.align = 'justify';
                    toolbar1.append(bold, italic, underline, strike, ul, ol, alignLeft, alignCenter, alignRight, justify);
                    const separator1 = document.createElement('div');
                    Pacem.Utils.addClass(separator1, Pacem.PCSS + '-contenteditable-separator');
                    const toolbar2 = document.createElement('div');
                    Pacem.Utils.addClass(toolbar2, Pacem.PCSS + '-contenteditable-toolbar');
                    const link = new Scaffolding.PacemContenteditableLinkCommandElement();
                    const img = new Scaffolding.PacemContenteditableImageCommandElement();
                    toolbar2.append(link, img);
                    frag.append(toolbar0, separator0, toolbar1, separator1, toolbar2);
                    return frag;
                }
                static findSurroundingNode(range, arg1) {
                    var node = range instanceof Node ? range : range.commonAncestorContainer;
                    while (node && !(typeof arg1 === 'string' && node instanceof Element && node.tagName === arg1.toUpperCase()
                        || typeof arg1 === 'function' && Pacem.Utils.isNull(arg1.prototype) && arg1(node)
                        || typeof arg1 === 'function' && !Pacem.Utils.isNull(arg1.prototype) && node instanceof arg1)) {
                        const parent = node.parentNode;
                        if (isRoot(parent)) {
                            node = null;
                            break;
                        }
                        node = parent;
                    }
                    return node;
                }
                static findSurroundingBlockElement(range) {
                    return this.findSurroundingNode(range, ContenteditableUtils.isBlockElement);
                }
                static findSurroundingSiblingBlockElements(range) {
                    let output = [];
                    if (isRoot(range.startContainer)) {
                        if (!range.collapsed) {
                            const root = range.startContainer;
                            for (let k = range.startOffset; k <= range.endOffset; k++) {
                                const child = root.children.item(k);
                                if (this.isBlockElement(child)) {
                                    output.push(root.children.item(k));
                                }
                            }
                        }
                        return output;
                    }
                    // simil-collapsed
                    if (range.startContainer === range.endContainer) {
                        let retval = range.startContainer;
                        while (!ContenteditableUtils.isBlockElement(retval) && retval.parentElement.contentEditable != 'true') {
                            retval = retval.parentElement;
                        }
                        return retval instanceof Element ? [retval] :
                            (retval.parentElement.contentEditable === 'true' ? [] : [retval.parentElement]);
                    }
                    // generic
                    let root = range.commonAncestorContainer, started = false;
                    for (let j = 0; j < root.childNodes.length; j++) {
                        const iNode = root.childNodes.item(j);
                        const pick = (!started && iNode.contains(range.startContainer))
                            || started;
                        if (pick && ContenteditableUtils.isBlockElement(iNode)) {
                            output.push(iNode);
                            started = true;
                            if (iNode.contains(range.endContainer)) {
                                break;
                            }
                        }
                    }
                    return started ? output : (root instanceof Element && !isRoot(root) ? [root] : []);
                }
                static findContainingRootElements(range) {
                    const range1 = range.cloneRange(), range2 = range.cloneRange();
                    range1.collapse(true);
                    range2.collapse();
                    let root = this.findSurroundingNode(range1, n => n.parentElement.contentEditable === 'true');
                    const retval = [root];
                    while (!root.contains(range2.startContainer)) {
                        retval.push(root = root.nextElementSibling);
                    }
                    return retval;
                }
                static isBlockElement(node) {
                    return node instanceof Element && !getComputedStyle(node).display.startsWith('inline');
                }
                static select(node, inside = false) {
                    const range = document.createRange();
                    if (!inside) {
                        range.setStartBefore(node);
                        range.setEndAfter(node);
                    }
                    else {
                        range.setStart(node, 0);
                        range.setEnd(node, node.childNodes.length);
                    }
                    const selection = document.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    return range;
                }
                static copyAttributes(to, from) {
                    const attrs = from.attributes;
                    for (let j = 0; j < attrs.length; j++) {
                        const attr = attrs.item(j);
                        to.setAttribute(attr.name, attr.value);
                    }
                }
                /**
                 * Checks whether the provided range wraps an 'inert' (contentEditable=false) element, and returns result accordingly.
                 * @param range
                 */
                static testInertElementWrapping(range) {
                    if (!Pacem.Utils.isNull(range)) {
                        const parent = range.startContainer, index = range.startOffset;
                        var node;
                        if (parent === range.endContainer && index == (range.endOffset - 1) && (node = parent.childNodes.item(index)) instanceof HTMLElement && node.contentEditable === 'false') {
                            return { result: true, element: node };
                        }
                    }
                    return { result: false };
                }
            }
            Scaffolding.ContenteditableUtils = ContenteditableUtils;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="contenteditable/utils.ts" />
/// <reference path="char-counter.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            var _PacemContenteditableElement_history;
            const EXECUTECOMMAND_NAME = 'execute';
            const EMPTY_CONTENT = '<p><br></p>';
            class ContenteditableChangeEvent extends Pacem.CustomTypedEvent {
                constructor(html) {
                    super('contenteditablechange', { html: html });
                }
            }
            class PacemContenteditableCommandElement extends Scaffolding.PacemItemElement {
                constructor() {
                    super(...arguments);
                    this._containerPropChangeHandler = (evt) => {
                        const p = evt.detail;
                        this.containerPropertyChangedCallback(p.propertyName, p.oldValue, p.currentValue, p.firstChange);
                    };
                }
                execCommand(...args) {
                    const me = this;
                    if (me.disabled) {
                        return;
                    }
                    me.exec.apply(me, args).then(_ => {
                        me.dispatchEvent(new Event(EXECUTECOMMAND_NAME));
                    }, e => {
                        console.error(e);
                    });
                }
                connectedCallback() {
                    super.connectedCallback();
                    Pacem.Utils.addClass(this, Pacem.PCSS + '-contenteditable-command');
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    const cnt = this.container;
                    if (!Pacem.Utils.isNull(cnt)) {
                        this.contentElement = cnt.contentElement;
                        cnt.addEventListener(Pacem.PropertyChangeEventName, this._containerPropChangeHandler, false);
                    }
                }
                disconnectedCallback() {
                    const cnt = this.container;
                    if (!Pacem.Utils.isNull(cnt)) {
                        cnt.removeEventListener(Pacem.PropertyChangeEventName, this._containerPropChangeHandler, false);
                    }
                    super.disconnectedCallback();
                }
                containerPropertyChangedCallback(name, old, val, first) {
                    if (name === 'range') {
                        this.range = val;
                    }
                }
            }
            __decorate([
                Pacem.Watch()
            ], PacemContenteditableCommandElement.prototype, "range", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemContenteditableCommandElement.prototype, "contentElement", void 0);
            Scaffolding.PacemContenteditableCommandElement = PacemContenteditableCommandElement;
            function isFileCommand(obj) {
                return obj instanceof PacemContenteditableCommandElement && 'pasteCallback' in obj && typeof obj['pasteCallback'] === 'function';
            }
            function isElement(node) {
                return (node === null || node === void 0 ? void 0 : node.nodeType) == Node.ELEMENT_NODE;
            }
            let PacemContenteditableElement = class PacemContenteditableElement extends Scaffolding.PacemItemsContainerBaseElement {
                constructor() {
                    super('rich text editor');
                    _PacemContenteditableElement_history.set(this, void 0);
                    this._focusHandler = (evt) => {
                        this._ensureInteractiveMarkup();
                    };
                    this._blurHandler = (evt) => {
                        // clean up the output
                        const container = this._container;
                        for (let command of this.items) {
                            command.cleanUp(container);
                        }
                        this._checkChangedHandler(evt);
                    };
                    this._pasteHandler = (evt) => {
                        // I'll manage it myself!
                        evt.preventDefault();
                        const range = this.range, files = evt.clipboardData.files;
                        if (!Pacem.Utils.isNull(range) && files.length === 0) {
                            const text = evt.clipboardData.getData('text/plain');
                            const plainText = text.replace(/</gi, '&lt;').replace(/\n/gi, '<br />');
                            const frag = range.createContextualFragment(plainText);
                            range.deleteContents();
                            range.insertNode(frag);
                            this._checkChangedHandler(evt);
                        }
                        else {
                            for (let j = 0; j < files.length; j++) {
                                const f = files.item(j);
                                for (let cmd of this.items) {
                                    if (isFileCommand(cmd)) {
                                        cmd.pasteCallback(f).then(_ => this._checkChangedHandler(evt), _ => { });
                                    }
                                }
                            }
                            // this._checkAndSynchronizeHandler(evt);
                        }
                    };
                    this._shortcutHandler = (evt) => {
                        var _a;
                        // prevent any default shortcut combo apart from 'copy', 'cut' and 'paste' (mainly due to the clipboard access limitations)
                        if (evt.ctrlKey && ['C', 'V', 'X'].indexOf((_a = evt.key) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === -1) {
                            // Let it manage it only if the relevant command is available
                            evt.preventDefault();
                        }
                    };
                    this._inputHandler = (evt) => {
                        this._fixRangeMarkup();
                        this._checkChangedHandler(evt);
                    };
                    this._checkChangedHandler = (evt) => {
                        const container = this._container, inputHtml = container.innerHTML;
                        var html = inputHtml;
                        if (Pacem.Utils.isNullOrEmpty(inputHtml)
                            || inputHtml === '<br>'
                            || inputHtml === EMPTY_CONTENT) {
                            container.innerHTML = EMPTY_CONTENT;
                            html = '';
                        }
                        if (html != this.value) {
                            this.changeHandler(new ContenteditableChangeEvent(html));
                            if (this.value != __classPrivateFieldGet(this, _PacemContenteditableElement_history, "f").current) {
                                this._updateHistory();
                            }
                        }
                        // fire history change in any case
                        this._fireHistoryChange();
                    };
                    this._selectionChangeHandler = (evt) => {
                        const selection = document.getSelection();
                        if (selection && selection.anchorNode && this._container.contains(selection.anchorNode)) {
                            const range = selection.getRangeAt(0);
                            this.range = range.cloneRange();
                        }
                        else {
                            this.range = null;
                        }
                    };
                    //this._workspace = document.createElement('div');
                }
                get history() {
                    return __classPrivateFieldGet(this, _PacemContenteditableElement_history, "f");
                }
                reset() {
                    super.reset();
                    __classPrivateFieldGet(this, _PacemContenteditableElement_history, "f").reset();
                    this._fireHistoryChange();
                }
                _fireHistoryChange() {
                    const h = __classPrivateFieldGet(this, _PacemContenteditableElement_history, "f");
                    this.dispatchEvent(new Pacem.PropertyChangeEvent({ propertyName: 'history', oldValue: h, currentValue: h }));
                }
                convertValueAttributeToProperty(attr) {
                    return attr;
                }
                toggleReadonlyView(readonly) {
                    this._dashboard.hidden = readonly;
                    if (readonly) {
                        this._container.removeAttribute('contenteditable');
                    }
                    else {
                        this._container.setAttribute('contenteditable', 'true');
                        document.execCommand("defaultParagraphSeparator", false, "p");
                    }
                }
                register(item) {
                    if (super.register(item)) {
                        item.addEventListener(EXECUTECOMMAND_NAME, this._checkChangedHandler, false);
                        return true;
                    }
                    return false;
                }
                unregister(item) {
                    if (super.unregister(item)) {
                        item.removeEventListener(EXECUTECOMMAND_NAME, this._checkChangedHandler, false);
                        return true;
                    }
                    return false;
                }
                /** @override */
                get preventKeyboardSubmit() {
                    return true;
                }
                get inputFields() {
                    return [this._container];
                }
                get contentElement() {
                    return this._container;
                }
                onChange(evt) {
                    return new Promise((resolve, reject) => {
                        if (Pacem.CustomEventUtils.isInstanceOf(evt, ContenteditableChangeEvent)) {
                            const html = this.value = evt.detail.html;
                            resolve(html);
                            // find a less-instrusive way to call this...
                            this._selectionChangeHandler(evt);
                        }
                        else
                            resolve(this.value);
                    });
                }
                _fixRangeMarkup() {
                    const range = this.range, fnDownwards = (node) => {
                        node.childNodes.forEach(i => fnDownwards(i));
                        if (isElement(node) && node.tagName === 'SPAN') {
                            Element.prototype.replaceWith.apply(node, Array.from(node.childNodes));
                        }
                        else if (node instanceof HTMLElement) {
                            node.removeAttribute('style');
                        }
                    }, fn = (node) => {
                        let element = node;
                        if (!isElement(element)) {
                            element = node.parentElement;
                        }
                        fnDownwards(element);
                    };
                    if (!Pacem.Utils.isNull(range)) {
                        fn(range.commonAncestorContainer);
                    }
                }
                _ensureInteractiveMarkup() {
                    const workspace = this._container, nodes = workspace.childNodes, childCount = nodes.length;
                    if (childCount == 0 || workspace.innerHTML === EMPTY_CONTENT) {
                        workspace.innerHTML = EMPTY_CONTENT;
                    }
                    else {
                        let node, range;
                        const closeRange = (n) => {
                            range.setEndAfter(n);
                            const p = document.createElement('p');
                            range.surroundContents(p);
                        };
                        for (let j = 0; j < childCount; j++) {
                            node = nodes.item(j);
                            if (!(node instanceof Element)) {
                                if (Pacem.Utils.isNull(range)) {
                                    range = document.createRange();
                                    range.setStartBefore(node);
                                }
                            }
                            else if (range) {
                                closeRange(node.previousSibling);
                                range = null;
                            }
                        }
                        // open range?
                        if (!Pacem.Utils.isNull(range)) {
                            closeRange(node);
                        }
                    }
                }
                _updateHistory() {
                    __classPrivateFieldGet(this, _PacemContenteditableElement_history, "f").push(this.value);
                    this._fireHistoryChange();
                }
                acceptValue(val) {
                    if (!Pacem.Utils.isNull(this._container) && /*the following `if` statement prevents from flashing the content and writing backwards!*/ val != this._container.innerHTML) {
                        this._container.innerHTML = val;
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    const container = this._container;
                    __classPrivateFieldSet(this, _PacemContenteditableElement_history, new Pacem.HistoryService(this.value), "f");
                    container.addEventListener('blur', this._blurHandler, false);
                    container.addEventListener('keydown', this._shortcutHandler, false);
                    container.addEventListener('focus', this._focusHandler, false);
                    container.addEventListener('input', this._inputHandler, false);
                    container.addEventListener('paste', this._pasteHandler, false);
                    document.addEventListener('selectionchange', this._selectionChangeHandler, false);
                }
                disconnectedCallback() {
                    document.removeEventListener('selectionchange', this._selectionChangeHandler, false);
                    const container = this._container;
                    if (!Pacem.Utils.isNull(container)) {
                        container.removeEventListener('keydown', this._shortcutHandler, false);
                        container.removeEventListener('blur', this._blurHandler, false);
                        container.removeEventListener('focus', this._focusHandler, false);
                        container.removeEventListener('input', this._inputHandler, false);
                        container.removeEventListener('paste', this._pasteHandler, false);
                    }
                    super.disconnectedCallback();
                }
                getViewValue(val) {
                    return val;
                }
            };
            _PacemContenteditableElement_history = new WeakMap();
            __decorate([
                Pacem.ViewChild("div[pacem]")
            ], PacemContenteditableElement.prototype, "_container", void 0);
            __decorate([
                Pacem.ViewChild("div[dashboard]")
            ], PacemContenteditableElement.prototype, "_dashboard", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemContenteditableElement.prototype, "range", void 0);
            __decorate([
                Pacem.Debounce(500)
            ], PacemContenteditableElement.prototype, "_updateHistory", null);
            PacemContenteditableElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-contenteditable', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<div class="${Pacem.PCSS}-contenteditable ${Pacem.PCSS}-viewfinder">
    <div contenteditable="true" role="presenter" pacem></div>
</div>${Scaffolding.CHAR_COUNTER_CHILD}
<div dashboard>
    <${Pacem.P}-content></${Pacem.P}-content>
</div>`
                })
            ], PacemContenteditableElement);
            Scaffolding.PacemContenteditableElement = PacemContenteditableElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            const emptyVal = '';
            const JsonOrStringConverter = {
                convert: (attr, el) => {
                    return /\{.+\}/.test(attr) ? Pacem.PropertyConverters.Json.convert(attr) : Pacem.PropertyConverters.String.convert(attr);
                },
                convertBack: (prop, el) => {
                    if (typeof prop === 'string') {
                        return prop;
                    }
                    return Pacem.PropertyConverters.Json.convertBack(prop, el);
                }
            };
            //class DatetimeChangeEvent extends CustomTypedEvent<{ date: Date }> {
            //    constructor(date: Date) {
            //        super('datetimechange', { date: date });
            //    }
            //}
            let PacemDatetimePickerElement = class PacemDatetimePickerElement extends Scaffolding.PacemBaseElement {
                constructor() {
                    super();
                    this.precision = 'day';
                    this._months = [];
                    this._dates = [];
                    this._a24 = [];
                    this._a60 = [];
                    this._years = [];
                    this.hours = '00';
                    this.minutes = '00';
                    this.seconds = '00';
                }
                get inputFields() {
                    return [this._yearel, this._monthel, this._dateel, this._hourel, this._minel, this._secel];
                }
                toggleReadonlyView(readonly) {
                    this._allFields.hidden = readonly;
                }
                convertValueAttributeToProperty(attr) {
                    return Pacem.PropertyConverters.Datetime.convert(attr);
                }
                connectedCallback() {
                    super.connectedCallback();
                    const today = new Date();
                    let year = this.year = today.getFullYear();
                    this.min = new Date(year - 100, 0, 1);
                    this.max = new Date(year + 10, 11, 31);
                    this.month = today.getMonth();
                    //
                    let months = [], hours = [], minutes = [], leftPad = Pacem.Utils.leftPad;
                    // months
                    for (let i = 0; i < 12; i++) {
                        let date = new Date(year, i, 1), label = date.toLocaleString(Pacem.Utils.lang(this), { month: "short" });
                        ;
                        months.push({ value: i, date: date, label: label });
                    }
                    this._months = months;
                    // hours
                    for (let i = 0; i < 24; i++) {
                        hours.push(leftPad(i, 2, '0'));
                    }
                    this._a24 = hours;
                    // minutes/secs
                    for (let i = 0; i < 60; i++) {
                        minutes.push(leftPad(i, 2, '0'));
                    }
                    this._a60 = minutes;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'dateValue':
                            this.log(Pacem.Logging.LogLevel.Log, `dateValue changed from ${old} to ${val}`);
                            this._disassembleDate(val);
                            // this.changeHandler(new DatetimeChangeEvent(val));
                            break;
                        case 'min':
                        case 'max':
                            if (!Pacem.Utils.isNullOrEmpty(this.min)
                                && !Pacem.Utils.isNullOrEmpty(this.max)) {
                                this._setupYears();
                            }
                            break;
                        case 'year':
                        case 'month':
                            this._buildupDates();
                            break;
                        case 'date':
                        case 'hours':
                        case 'minutes':
                        case 'seconds':
                            this._buildup();
                            break;
                    }
                }
                acceptValue(val) {
                    this.dateValue = Pacem.Utils.parseDate(val);
                }
                _disassembleDate(v) {
                    if (!v) {
                        this.date = undefined;
                        return;
                    }
                    if (typeof v === 'string')
                        v = Pacem.Utils.parseDate(v);
                    const leftPad = (i) => Pacem.Utils.leftPad(i, 2, '0');
                    this.year = v.getFullYear();
                    this.month = v.getMonth();
                    this.date = v.getDate();
                    this.hours = leftPad(v.getHours());
                    this.minutes = leftPad(v.getMinutes());
                    this.seconds = leftPad(v.getSeconds());
                }
                _setupYears() {
                    let years = [];
                    const min = Pacem.Utils.parseDate(this.min), max = Pacem.Utils.parseDate(this.max);
                    for (let i = min.getFullYear(); i <= max.getFullYear(); i++) {
                        years.push(i);
                    }
                    this._years = years;
                }
                onChange(evt) {
                    return new Promise((resolve, reject) => {
                        //if (CustomEventUtils.isInstanceOf(evt, DatetimeChangeEvent)) {
                        //    const date = (<DatetimeChangeEvent>evt).detail.date;
                        //    resolve(this.value = date); // keep same type (Date or string equivalent)
                        //} else {
                        //    resolve(this.value = Utils.parseDate(this.value));
                        //}
                        resolve(this.value = this._computeValue());
                    });
                }
                _buildupDates(evt) {
                    if (evt)
                        evt.stopPropagation();
                    const v = this, options = { weekday: 'short', day: 'numeric' }, isDate = (k) => {
                        try {
                            let monthvalue = +v.month, parsed = new Date(+v.year, +v.month, k);
                            return parsed.getMonth() == monthvalue;
                        }
                        catch (e) {
                            return false;
                        }
                    };
                    var dates = [];
                    if (!Pacem.Utils.isNullOrEmpty(v.year) && !Pacem.Utils.isNullOrEmpty(v.month)) {
                        let day = 1;
                        do {
                            let date = new Date(+v.year, +v.month, day), label = date.toLocaleString(Pacem.Utils.lang(this), options);
                            dates.push({ value: day, date: date, label: label, disabled: date < this.min || date > this.max });
                        } while (isDate(++day));
                    }
                    this._dates = dates;
                    if (!isDate(+this.date))
                        this.date = '';
                    else
                        this._buildup();
                }
                _computeValue() {
                    const v = this;
                    if (Pacem.Utils.isNullOrEmpty(v.year)
                        || Pacem.Utils.isNullOrEmpty(v.month)
                        || Pacem.Utils.isNullOrEmpty(v.date)) {
                        return null;
                    }
                    else {
                        //
                        try {
                            let value = new Date(+v.year, +v.month, +v.date);
                            value.setHours(+v.hours);
                            value.setMinutes(+v.minutes);
                            value.setSeconds(+v.seconds);
                            value.setMilliseconds(0);
                            if (!Number.isNaN(value.valueOf())) {
                                return value;
                            }
                            else
                                return null;
                        }
                        catch (e) {
                            return null;
                        }
                    }
                }
                _buildup(evt) {
                    if (evt)
                        evt.stopPropagation();
                    //
                    this.dateValue = this._computeValue();
                }
                getViewValue(val) {
                    const v = /*this.dateValue ||*/ val;
                    if (v) {
                        return Pacem.Utils.core.date(v, this.format || (this.precision != 'day' ? 'full' : 'short'), Pacem.Utils.lang(this));
                    }
                    return '';
                }
            };
            __decorate([
                Pacem.ViewChild('.' + Pacem.PCSS + '-datetime-picker-year >       ' + Pacem.P + '-select')
            ], PacemDatetimePickerElement.prototype, "_yearel", void 0);
            __decorate([
                Pacem.ViewChild('.' + Pacem.PCSS + '-datetime-picker-month >      ' + Pacem.P + '-select')
            ], PacemDatetimePickerElement.prototype, "_monthel", void 0);
            __decorate([
                Pacem.ViewChild('.' + Pacem.PCSS + '-datetime-picker-date >       ' + Pacem.P + '-select')
            ], PacemDatetimePickerElement.prototype, "_dateel", void 0);
            __decorate([
                Pacem.ViewChild('.' + Pacem.PCSS + '-datetime-picker-hours >      ' + Pacem.P + '-select')
            ], PacemDatetimePickerElement.prototype, "_hourel", void 0);
            __decorate([
                Pacem.ViewChild('.' + Pacem.PCSS + '-datetime-picker-minutes >    ' + Pacem.P + '-select')
            ], PacemDatetimePickerElement.prototype, "_minel", void 0);
            __decorate([
                Pacem.ViewChild('.' + Pacem.PCSS + '-datetime-picker-seconds >    ' + Pacem.P + '-select')
            ], PacemDatetimePickerElement.prototype, "_secel", void 0);
            __decorate([
                Pacem.ViewChild(`div.${Pacem.PCSS}-datetime-picker-fields`)
            ], PacemDatetimePickerElement.prototype, "_allFields", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Datetime })
            ], PacemDatetimePickerElement.prototype, "dateValue", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Datetime })
            ], PacemDatetimePickerElement.prototype, "min", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Datetime })
            ], PacemDatetimePickerElement.prototype, "max", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemDatetimePickerElement.prototype, "precision", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: JsonOrStringConverter })
            ], PacemDatetimePickerElement.prototype, "format", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemDatetimePickerElement.prototype, "_dates", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemDatetimePickerElement.prototype, "_years", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemDatetimePickerElement.prototype, "year", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemDatetimePickerElement.prototype, "month", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemDatetimePickerElement.prototype, "date", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemDatetimePickerElement.prototype, "hours", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemDatetimePickerElement.prototype, "minutes", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemDatetimePickerElement.prototype, "seconds", void 0);
            __decorate([
                Pacem.Debounce(10)
            ], PacemDatetimePickerElement.prototype, "_buildup", null);
            PacemDatetimePickerElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-datetime-picker', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<div class="${Pacem.PCSS}-datetime-picker">
    <div class="${Pacem.PCSS}-datetime-picker-fields ${Pacem.PCSS}-viewfinder">

    <div class="${Pacem.PCSS}-datetime-picker-year">
    <${Pacem.P}-select value="{{ :host.year, twoway }}" placeholder="..." datasource="{{ :host._years }}">
    </${Pacem.P}-select></div>

    <div class="${Pacem.PCSS}-datetime-picker-month">
    <${Pacem.P}-select value="{{ :host.month, twoway }}" placeholder="..." value-property="value" text-property="label" datasource="{{ :host._months }}">
    </${Pacem.P}-select></div>

    <div class="${Pacem.PCSS}-datetime-picker-date">
    <${Pacem.P}-select value="{{ :host.date, twoway }}" placeholder="..." value-property="value" text-property="label" datasource="{{ :host._dates }}">
    </${Pacem.P}-select></div>

    <${Pacem.P}-panel class="${Pacem.PCSS}-datetime-picker-hours" hide="{{ :host.precision === 'day' }}">
    <${Pacem.P}-select value="{{ :host.hours, twoway }}" datasource="{{ :host._a24 }}">
    </${Pacem.P}-select></${Pacem.P}-panel>

    <${Pacem.P}-panel class="${Pacem.PCSS}-datetime-picker-minutes" hide="{{ :host.precision === 'day' }}">
    <${Pacem.P}-select value="{{ :host.minutes, twoway }}" datasource="{{ :host._a60 }}">
    </${Pacem.P}-select></${Pacem.P}-panel>

    <${Pacem.P}-panel class="${Pacem.PCSS}-datetime-picker-seconds" hide="{{ :host.precision !== 'second' }}">
    <${Pacem.P}-select value="{{ :host.seconds, twoway }}" datasource="{{ :host._a60 }}">
    </${Pacem.P}-select></${Pacem.P}-panel>

    </div>
    <${Pacem.P}-panel class="${Pacem.PCSS}-datetime-picker-preview" hide="{{ Pacem.Utils.isNullOrEmpty(:host.dateValue) || :host.precision === 'day' || :host.readonly }}">
        <dl>
            <dt>local:</dt><dd><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></dd>
            <dt>iso:</dt><dd><${Pacem.P}-text text="{{ (:host.dateValue && :host.dateValue.toISOString()) || '' }}"></${Pacem.P}-text></dd>
        </dl>
    </${Pacem.P}-panel>
    <${Pacem.P}-span class="${Pacem.PCSS}-readonly" css-class="{{ { 'date': :host.precision === 'day', 'datetime': :host.precision !== 'day' } }}" content="{{ :host.viewValue }}" hide="{{ !:host.readonly }}"></${Pacem.P}-span>
</div>`
                })
            ], PacemDatetimePickerElement);
            Scaffolding.PacemDatetimePickerElement = PacemDatetimePickerElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="types.ts" />
/// <reference path="contenteditable.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            function getFormId(key) {
                return 'form' + key;
            }
            function patternToString(pattern) {
                return new RegExp(pattern /*.split('\\').join('\\\\')*/).source;
            }
            function isKnownValidator(v) {
                return 'errorMessage' in v;
            }
            function isValidatorFactory(v) {
                return 'attributes' in v && typeof v.attributes === 'function';
            }
            let PacemFormFieldElement = class PacemFormFieldElement extends Components.PacemElement {
                constructor(_md = new Pacem.MarkdownService()) {
                    super();
                    this._md = _md;
                    this._entityPropertyChangeHandler = (e) => {
                        // nudge entity propertychange notification
                        this.dispatchEvent(new Pacem.PropertyChangeEvent({ propertyName: 'entity', currentValue: this.entity }));
                    };
                    this._labelClickHandler = (_) => {
                        document.getElementById(this._label.htmlFor).focus();
                    };
                    this._key = '_' + Pacem.Utils.uniqueCode();
                }
                get key() {
                    return this._key;
                }
                get fetcher() {
                    return this._fetcher;
                }
                get field() {
                    return this._field;
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._buildUpForm();
                    this._buildUpFetcher();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'readonly':
                            this._ensureBalloon();
                            break;
                        case 'metadata':
                            this._ensureBalloon();
                            this._buildUpLabel();
                            this._buildUpField();
                            break;
                        case 'entity':
                            // In the case that the entity is a HTMLElement,
                            // its changes might not propagate correctly.
                            // This is a nudgy solution. Explore how to improve
                            // `CustomElementUtils.set` as an alternative...
                            if (old instanceof HTMLElement) {
                                old.removeEventListener(Pacem.PropertyChangeEventName, this._entityPropertyChangeHandler, false);
                            }
                            if (val instanceof HTMLElement) {
                                val.addEventListener(Pacem.PropertyChangeEventName, this._entityPropertyChangeHandler, false);
                            }
                            break;
                    }
                }
                disconnectedCallback() {
                    if (this.entity instanceof HTMLElement) {
                        this.entity.removeEventListener(Pacem.PropertyChangeEventName, this._entityPropertyChangeHandler, false);
                    }
                    if (!Pacem.Utils.isNull(this._label)) {
                        this._label.removeEventListener('click', this._labelClickHandler, false);
                    }
                    if (!Pacem.Utils.isNull(this._balloon)) {
                        this._balloon.remove();
                    }
                    super.disconnectedCallback();
                }
                _normalizeTooltip() {
                    const metadata = this.metadata && this.metadata.extra && this.metadata.extra.tooltip || false;
                    if (typeof metadata === 'object') {
                        return metadata;
                    }
                    return { type: metadata };
                }
                _ensureBalloon() {
                    var innerText, tooltip;
                    const noBalloon = this.readonly
                        || ((tooltip = this._normalizeTooltip()).type === false)
                        || Pacem.Utils.isNullOrEmpty(innerText = this.metadata && this.metadata.display && this.metadata.display.description);
                    // balloon
                    if (Pacem.Utils.isNull(this._balloon) && !noBalloon) {
                        let balloon = document.createElement(Pacem.P + '-balloon');
                        balloon.options = {
                            behavior: Components.UI.BalloonBehavior.Tooltip,
                            trigger: tooltip.trigger || Components.UI.BalloonTrigger.Hover,
                            position: tooltip.position || Components.UI.BalloonPosition.Top,
                            hoverDelay: 200, hoverTimeout: 50,
                            align: tooltip.align || Components.UI.BalloonAlignment.Auto
                        };
                        Pacem.Utils.addClass(balloon, Pacem.PCSS + '-field-tooltip');
                        var shell = Pacem.CustomElementUtils.findAncestorShell(this);
                        shell.appendChild(this._balloon = balloon);
                    }
                    const balloon = this._balloon;
                    if (!Pacem.Utils.isNull(balloon)) {
                        balloon.target = this._label;
                        if (!(balloon.disabled = noBalloon)) {
                            const content = innerText || '';
                            switch (tooltip.type) {
                                case 'md':
                                case 'markdown':
                                    balloon.innerHTML = this._md.toHtml(content);
                                    break;
                                case 'html':
                                    balloon.innerHTML = content;
                                    break;
                                default:
                                    balloon.innerText = content;
                                    break;
                            }
                        }
                    }
                }
                _buildUpLabel() {
                    // label
                    var label = this._label;
                    let meta = this.metadata;
                    label.htmlFor = this._key;
                    Pacem.Utils.addClass(label, Pacem.PCSS + '-label');
                    const vals = this.metadata.validators;
                    if (vals && vals.find(v => v.type === 'required')) {
                        Pacem.Utils.addClass(label, Pacem.PCSS + '-required');
                    }
                    else {
                        Pacem.Utils.removeClass(label, Pacem.PCSS + '-required');
                    }
                    //
                    if (!Pacem.Utils.isNull(this._balloon) && !this._balloon.disabled) {
                        Pacem.Utils.addClass(label, Pacem.PCSS + '-tooltip');
                    }
                    else {
                        Pacem.Utils.removeClass(label, Pacem.PCSS + '-tooltip');
                    }
                    // exploit a pacem-span so that it cleans the htm content up
                    const span = new Pacem.Components.PacemSpanElement();
                    span.content = (meta.display && meta.display.name) || meta.prop;
                    label.innerHTML = '';
                    label.appendChild(span);
                    label.setAttribute('id', 'label' + this._key);
                    label.addEventListener('click', this._labelClickHandler, false);
                }
                // #region Template-called
                _isValueNullOrEmpty(entity = this.entity, metadata = this.metadata) {
                    return Pacem.Utils.isNullOrEmpty(entity && metadata && entity[metadata.prop]);
                }
                /**
                 * Reflects the value onto the entity attribute, if the 'entity' is an instance of HTMLElement.
                 */
                _handleValueChange(evt) {
                    if (evt.detail.propertyName === 'value') {
                        const value = evt.detail.currentValue, prop = this.metadata.prop;
                        if (this.entity instanceof HTMLElement) {
                            // handle the entity as an element and modify the attribute
                            let attr = Pacem.CustomElementUtils.camelToKebab(prop);
                            if (Pacem.Utils.isNullOrEmpty(value)) {
                                this.entity.removeAttribute(attr);
                            }
                            else {
                                this.entity.setAttribute(attr, value.toString());
                            }
                        }
                        else {
                            this.entity[prop] = value;
                        }
                    }
                }
                /**
                 * 'Prettifies' the input value (for some specific cases) to be included in an URL segment or query string.
                 * @param v Input value
                 */
                _adjustDependencyValue(v) {
                    if (Pacem.Utils.Dates.isDate(v)) {
                        return Pacem.Utils.Dates.parse(v).toISOString();
                    }
                    return v;
                }
                // #endregion
                _buildUpFetcher() {
                    // fetcher
                    var fetcher = this._fetcher;
                    fetcher.setAttribute('id', 'fetch' + this._key);
                }
                _buildUpForm() {
                    // form
                    var form = this._form;
                    form.setAttribute('id', getFormId(this._key));
                }
                _buildUpField() {
                    if (this._field)
                        this._field.remove();
                    this._fetcher.removeAttribute('parameters');
                    this._fetcher.result =
                        this._fetcher.url = null;
                    for (var j = this._validators.children.length - 1; j >= 0; j--)
                        this._validators.children[j].remove();
                    var meta = this.metadata;
                    // field
                    let tagName = Pacem.P + '-input-text';
                    let numericTagName = Pacem.P + (meta.display && meta.display.ui === 'slider' ? '-slider' : '-input-number');
                    let attrs = {
                        'id': this._key, 'name': meta.prop,
                        // readonly if property `readonly` set to true OR metadata property is not editable OR parent form's `readonly` property is set to true
                        'readonly': "{{ :host.readonly || :host.metadata.isReadOnly || ::_form.readonly }}",
                        'value': `{{ :host.entity.${meta.prop}, twoway }}`,
                        'placeholder': `${((meta.display && meta.display.watermark) || "")}`
                    };
                    // fetch data
                    let fetchData = meta.extra || {};
                    let fetchAttrs = {};
                    let disabledAttr = "false";
                    let dependingClause = '';
                    let dependingDisabling = '';
                    let dependingParameters = '';
                    let dependsOn = [];
                    // #region dependency from other props
                    if (!Pacem.Utils.isNullOrEmpty(fetchData.dependsOn)) {
                        if (typeof fetchData.dependsOn === 'function') {
                            const depAttrs = fetchData.dependsOn(this, ':host', ':host.entity', '$this.entity'), hideAttr = depAttrs.hideAttr;
                            if (!Pacem.Utils.isNullOrEmpty(hideAttr)) {
                                this.setAttribute('hide', hideAttr);
                            }
                            if (!Pacem.Utils.isNullOrEmpty(depAttrs.disabledAttr)) {
                                disabledAttr = depAttrs.disabledAttr;
                                if (Pacem.CustomElementUtils.isBindingAttribute(disabledAttr)) {
                                    dependingDisabling = Pacem.CustomElementUtils.extractBindingAttributeExpression(disabledAttr);
                                }
                            }
                            if (!Pacem.Utils.isNullOrEmpty(depAttrs.parameterAttrs)) {
                                const pAttrs = depAttrs.parameterAttrs, parameterPairs = [];
                                for (let alias in pAttrs) {
                                    parameterPairs.push(`${alias}: ${pAttrs[alias]}`);
                                }
                                dependingParameters = parameterPairs.join(', ');
                            }
                        }
                        else {
                            dependsOn = fetchData.dependsOn;
                            // there should be a better way...
                            let disablingClauses = { empty: [], notEqual: {} };
                            let hidingClauses = { empty: [], notEqual: {} };
                            // fetch
                            let namesAndPaths = [];
                            let paths = [];
                            for (var depends of dependsOn) {
                                let path = ':host.entity.' + depends.prop, path2 = '$this.entity.' + depends.prop;
                                if (!Pacem.Utils.isNullOrEmpty(depends.value)) {
                                    let clause = (p) => p + ' !== ' + JSON.stringify(depends.value);
                                    (disablingClauses.notEqual[path] = disablingClauses.notEqual[path] || []).push(clause(path));
                                    if (depends.hide) {
                                        (hidingClauses.notEqual[path2] = hidingClauses.notEqual[path2] || []).push(clause(path2));
                                    }
                                }
                                else {
                                    let clause = (p) => '$pacem.isNullOrEmpty(' + p + ')';
                                    disablingClauses.empty.push(clause(path));
                                    if (depends.hide) {
                                        hidingClauses.empty.push(clause(path2));
                                    }
                                }
                                // fetch
                                paths.push(path);
                                namesAndPaths.push(`${(depends.alias || depends.prop)} : :host._adjustDependencyValue(${path})`);
                                dependingClause += `!$pacem.isNullOrEmpty(${path}) && `;
                            }
                            dependingParameters = namesAndPaths.join(', ');
                            let joinClauses = (d) => {
                                let ne = 'false', emp = 'false';
                                if (!Pacem.Utils.isNullOrEmpty(d.notEqual)) {
                                    // when a value is provided then pick the logical operator when provided.
                                    // consider to switch semantic (i.e. 'or' -> '&&', 'and' -> '||') due to the 'notEqual' operator.
                                    // 'and' is assumed to be the default
                                    const neByProp = [];
                                    for (let dp in d.notEqual) {
                                        // same property conditions always concatenated with '&&' (logical and)
                                        neByProp.push('(' + d.notEqual[dp].join(' && ') + ')');
                                    }
                                    // different property clauses should be concatenated with '||' (logical or)
                                    ne = '(' + neByProp.join(' || ') + ')';
                                }
                                if (!Pacem.Utils.isNullOrEmpty(d.empty)) {
                                    // logical operator doe not affect 'empty' (no 'value' explicitated) deps:
                                    // empty always means 'BAD', then ANY empty entry would automatically trigger a negative outcome ('||').
                                    emp = '(' + d.empty.join(' || ') + ')';
                                }
                                return ne + ' || ' + emp;
                            };
                            dependingDisabling = joinClauses(disablingClauses);
                            disabledAttr = `{{ ${dependingDisabling} }}`;
                            // never disable the form-field, NEVER!
                            // attrs['disabled'] = disabledAttr; // * BUG
                            this.setAttribute('hide', `{{ ${joinClauses(hidingClauses)} }}`);
                        }
                    }
                    // #endregion
                    const fn = 'fn';
                    const fns = this[fn] = this[fn] || {};
                    const spinStaticDatasourceAttr = (source = []) => {
                        let args = (dependsOn || []).map(p => ':host.entity.' + p.prop).join(', ');
                        const fnKey = 'fn' + Pacem.Utils.uniqueCode();
                        switch (typeof source) {
                            case 'function':
                                fns[fnKey] = source;
                                break;
                            default:
                                if (Pacem.Utils.isArray(source)) {
                                    fns[fnKey] = () => source;
                                }
                                else {
                                    throw 'Unsupported source format.';
                                }
                                break;
                        }
                        return `{{ :host.${fn}.${fnKey}(${args}) }}`;
                    };
                    const children = new DocumentFragment();
                    let uiHint;
                    // metadata
                    if (typeof meta.type === 'function' /* < factory */) {
                        // build-up meta-structure
                        var retval = meta.type(this, ':host', ':host.entity');
                        // element must be a registered custom-element (hyphen!)
                        if (retval.tagName.indexOf('-') === -1) {
                            this.log(Pacem.Logging.LogLevel.Error, `${tagName} is not an allowed form-field`);
                        }
                        else {
                            // set tagName
                            tagName = retval.tagName;
                            // set/override attributes
                            Pacem.Utils.extend(attrs, retval.attrs || {});
                            // prepare recursive seeding function
                            function seedChildren(parent, children) {
                                if (!Pacem.Utils.isNullOrEmpty(children)) {
                                    for (let child of children) {
                                        // element must be a registered custom-element (hyphen!)
                                        if (child.tagName.indexOf('-') === -1) {
                                            this.log(Pacem.Logging.LogLevel.Error, `${child.tagName} is not an allowed child element for form-field ${tagName}`);
                                            continue;
                                        }
                                        const el = document.createElement(child.tagName);
                                        if (!Pacem.Utils.isNullOrEmpty(child.attrs)) {
                                            for (let attr in child.attrs) {
                                                const attrVal = child.attrs[attr];
                                                el.setAttribute(attr, attrVal);
                                            }
                                        }
                                        if (!Pacem.Utils.isNullOrEmpty(child.children)) {
                                            // recursion here
                                            seedChildren(el, child.children);
                                        }
                                        parent.appendChild(el);
                                    }
                                }
                            }
                            // seed
                            seedChildren(children, retval.children);
                        }
                    }
                    else
                        switch (uiHint = (meta.display && meta.display.ui)) {
                            // remove this (use dataType = 'HTML' instead).
                            case 'contentEditable':
                                console.warn('`contentEditable` ui hint is deprecated. Lean on `dataType` equal to \'HTML\' instead.');
                                tagName = Pacem.P + '-contenteditable';
                                children.append(Scaffolding.ContenteditableUtils.getDefaultDashboard());
                                break;
                            case 'snapshot':
                                tagName = Pacem.P + '-thumbnail';
                                let w = attrs['width'] = '' + meta.extra.width;
                                let h = attrs['height'] = '' + meta.extra.height;
                                let mode = attrs['mode'] = meta.type.toLowerCase() === 'string' ? 'string' : 'binary';
                                break;
                            case 'oneToMany':
                            case 'manyToMany':
                                // select
                                delete attrs['placeholder'];
                                if (uiHint === 'oneToMany') {
                                    tagName = Pacem.P + '-select';
                                    attrs['on-wheel'] = '$event.preventDefault()';
                                }
                                else {
                                    // checkboxlist
                                    tagName = Pacem.P + '-checkbox-list';
                                }
                                if (!Pacem.Utils.isNullOrEmpty(fetchData.textProperty)) {
                                    attrs['text-property'] = fetchData.textProperty;
                                }
                                if (!Pacem.Utils.isNullOrEmpty(fetchData.disabledProperty)) {
                                    attrs['disabled-property'] = fetchData.disabledProperty;
                                }
                                if (!Pacem.Utils.isNullOrEmpty(fetchData.valueProperty)) {
                                    if (!meta.isComplexType)
                                        attrs['value-property'] = fetchData.valueProperty;
                                    else
                                        attrs['compare-by'] = fetchData.valueProperty;
                                }
                                if (Pacem.Utils.isNullOrEmpty(fetchData.source)) {
                                    // datasource has to be fetched
                                    this._fetcher.id = `fetch${this._key}`;
                                    this._fetcher.url = fetchData.sourceUrl;
                                    this._fetcher.method = fetchData.verb;
                                    //
                                    fetchAttrs['parameters'] = `{{ { ${dependingParameters} } }}`;
                                    fetchAttrs['disabled'] = disabledAttr;
                                    attrs['datasource'] = `{{ ${dependingClause}Pacem.Utils.getApiResult(#fetch${this._key}.result) || null }}`;
                                }
                                else {
                                    // static datasource provided
                                    attrs['datasource'] = spinStaticDatasourceAttr(fetchData.source);
                                }
                                break;
                            case 'suggest':
                            case 'tags':
                            case 'autocomplete':
                                // autocomplete
                                const tags = meta.display.ui === 'tags';
                                tagName = Pacem.P + (tags ? '-tags' : '-suggest');
                                this._fetcher.id = `fetch${this._key}`;
                                if (!Pacem.Utils.isNullOrEmpty(fetchData.textProperty)) {
                                    attrs['text-property'] = fetchData.textProperty;
                                }
                                let itemValue = `#${this._key}.value`;
                                if (!Pacem.Utils.isNullOrEmpty(fetchData.valueProperty)) {
                                    attrs['compare-by'] = fetchData.valueProperty;
                                    if (tags) {
                                        itemValue = `(${itemValue} && ${itemValue}.${fetchData.valueProperty}) || ''`;
                                    }
                                    else {
                                        attrs['value-property'] = fetchData.valueProperty;
                                    }
                                }
                                if (!Pacem.Utils.isNullOrEmpty(fetchData.sourceUrl)) {
                                    fetchAttrs['url'] = `${fetchData.sourceUrl}`;
                                    this._fetcher.method = fetchData.verb;
                                    //
                                    if (!Pacem.Utils.isNullOrEmpty(fetchData.dependsOn)) {
                                        // deps
                                        fetchAttrs['parameters'] = `{{ { ${dependingParameters}, q: #${this._key}.hint || '', ${(fetchData.valueProperty || 'value')}: ${itemValue} || '' } }}`;
                                        fetchAttrs['disabled'] = disabledAttr;
                                    }
                                    else {
                                        // no deps
                                        fetchAttrs['parameters'] = `{{ {q: #${this._key}.hint || '', ${(fetchData.valueProperty || 'value')}: ${itemValue} || '' } }}`;
                                    }
                                    attrs['datasource'] = `{{ ${dependingClause}Pacem.Utils.getApiResult(#fetch${this._key}.result) || null }}`;
                                }
                                else {
                                    // static datasource
                                    attrs['datasource'] = spinStaticDatasourceAttr(fetchData.source);
                                }
                                if (tags) {
                                    attrs['allow-new'] = (meta.extra.allowNew === true).toString();
                                    attrs['allow-duplicates'] = (meta.extra.allowDuplicates === true).toString();
                                }
                                else {
                                    if (!Pacem.Utils.isNullOrEmpty(fetchData.disabledProperty)) {
                                        attrs['disabled-property'] = fetchData.disabledProperty;
                                    }
                                    if (!Pacem.Utils.isNullOrEmpty(fetchData.itemtemplate)) {
                                        const itmpl = fetchData.itemtemplate;
                                        if (itmpl instanceof HTMLElement) {
                                            attrs['itemtemplate'] = '{{ #' + (itmpl.id = itmpl.id || this._key + '_itemtmpl') + ' }}';
                                            if (!itmpl.isConnected) {
                                                this.append(itmpl);
                                            }
                                        }
                                        else {
                                            attrs['itemtemplate'] = itmpl;
                                        }
                                    }
                                    if (!Pacem.Utils.isNullOrEmpty(fetchData.filterFields)) {
                                        const ffields = fetchData.filterFields;
                                        attrs['filter-fields'] = (Pacem.Utils.isArray(ffields)) ? ffields.join(' ') : ffields;
                                    }
                                }
                                break;
                            case "calendar":
                                tagName = Pacem.P + '-calendar-picker';
                                if (!Pacem.Utils.isNullOrEmpty(fetchData.format)) {
                                    attrs['format'] = '{{ ' + JSON.stringify(fetchData.format) + ' }}';
                                }
                                if (!Pacem.Utils.isNullOrEmpty(fetchData.disabledRanges)) {
                                    attrs['disabled-ranges'] = '{{ ' + JSON.stringify(fetchData.disabledRanges) + ' }}';
                                }
                                break;
                            case 'switcher':
                                if ((meta.type || '').toLowerCase() === 'boolean') {
                                    attrs['class'] = "checkbox-switch";
                                }
                                else {
                                    break;
                                }
                            default:
                                let dataType = (meta.dataType || meta.type || '').toLowerCase();
                                switch (dataType) {
                                    // should deprecated this one:
                                    case 'imageurl':
                                        tagName = Pacem.P + '-input-image';
                                        const f_id = this._fetcher.id = `fetch${this._key}`;
                                        attrs['image-set'] = `{{ Pacem.Utils.getApiResult(#${f_id}.result) }}`;
                                        attrs['on-imagefetchrequest'] = `#${f_id}.url = '${meta.extra.fetchUrl}'; #${f_id}.parameters = { q: $event.detail.hint, skip: $event.detail.skip, take: $event.detail.take }`;
                                        attrs['max-width'] = '' + meta.extra.width;
                                        attrs['max-height'] = '' + meta.extra.height;
                                        attrs['max-thumbnail-height'] = '' + meta.extra.thumbHeight;
                                        attrs['max-thumbnail-width'] = '' + meta.extra.thumbWidth;
                                        attrs['upload-url'] = meta.extra.uploadUrl;
                                        attrs['allow-snapshot'] = '' + meta.extra.snapshot;
                                        break;
                                    case 'upload':
                                        // upload
                                        tagName = Pacem.P + '-upload';
                                        let uploadExtra = meta.extra || {};
                                        attrs['url'] = uploadExtra.uploadUrl;
                                        attrs['parallelism'] = '' + uploadExtra.parallelism;
                                        attrs['chunk-size'] = '' + uploadExtra.chunkSize;
                                        attrs['max-image-width'] = '' + uploadExtra.maxImageWidth;
                                        attrs['max-image-height'] = '' + uploadExtra.maxImageHeight;
                                        break;
                                    case 'html':
                                        // contenteditable
                                        tagName = Pacem.P + '-contenteditable';
                                        children.append(Scaffolding.ContenteditableUtils.getDefaultDashboard());
                                        break;
                                    case 'enumeration':
                                        // radiobutton list
                                        tagName = Pacem.P + '-radio-list';
                                        attrs['class'] = Pacem.PCSS + '-radio-list';
                                        attrs['value-property'] = "value";
                                        attrs['text-property'] = "caption";
                                        attrs['datasource'] = '{{ ' + JSON.stringify(meta.extra.enum) + ' }}';
                                        delete attrs['placeholder'];
                                        break;
                                    case 'password':
                                        tagName = Pacem.P + '-input-password';
                                        break;
                                    case 'emailaddress':
                                        tagName = Pacem.P + '-input-email';
                                        break;
                                    case "color":
                                        tagName = Pacem.P + '-input-color';
                                        break;
                                    case "time":
                                    case "date":
                                    case "datetime":
                                        tagName = Pacem.P + '-datetime-picker';
                                        delete attrs['placeholder'];
                                        if (dataType === 'datetime') {
                                            attrs['precision'] = "minute";
                                        }
                                        if (!Pacem.Utils.isNullOrEmpty(fetchData.format)) {
                                            attrs['format'] = '{{ ' + JSON.stringify(fetchData.format) + ' }}';
                                        }
                                        if (!Pacem.Utils.isNullOrEmpty(fetchData.disabledRanges)) {
                                            attrs['disabled-ranges'] = '{{ ' + JSON.stringify(fetchData.disabledRanges) + ' }}';
                                        }
                                        break;
                                    case "url":
                                        tagName = Pacem.P + '-input-url';
                                        break;
                                    case "phonenumber":
                                        tagName = Pacem.P + '-input-tel';
                                        break;
                                    case "multilinetext":
                                        tagName = Pacem.P + '-textarea';
                                        break;
                                    case "markdown":
                                        tagName = Pacem.P + '-textarea-markdown';
                                        break;
                                    case 'latlng':
                                        tagName = Pacem.P + '-latlng';
                                        if (!Pacem.Utils.isNullOrEmpty(meta.extra) && typeof meta.extra === 'object' && !Pacem.Utils.isArray(meta.extra)) {
                                            attrs['options'] = JSON.stringify(meta.extra);
                                        }
                                        break;
                                    case 'percent':
                                    case 'percentage':
                                    case 'currency':
                                        let baseOptions = dataType === 'currency' ? { style: 'currency', currency: 'EUR' } : { style: 'percent', maximumFractionDigits: 2 };
                                        let intl = Object.assign(baseOptions, meta.extra);
                                        attrs['format'] = JSON.stringify(intl);
                                    default:
                                        switch ((meta.type || '').toLowerCase()) {
                                            case "boolean":
                                                tagName = Pacem.P + '-checkbox';
                                                //attrs['selected'] = `{{ :host.entity.${meta.prop}, twoway }}`;
                                                attrs['true-value'] = "{{ true }}";
                                                attrs['false-value'] = "{{ false }}";
                                                attrs['caption'] = attrs['placeholder'];
                                                //delete attrs['value'];
                                                delete attrs['placeholder'];
                                                break;
                                            case "byte":
                                                attrs['min'] = '0';
                                                attrs['max'] = '255';
                                            case "int16":
                                            case "int32":
                                            case "int64":
                                            case "short":
                                            case "integer":
                                            case "int":
                                            case "long":
                                                attrs['step'] = "1";
                                                tagName = numericTagName;
                                                break;
                                            case "double":
                                            case "decimal":
                                            case "float":
                                            case "single":
                                            case "number":
                                                tagName = numericTagName;
                                                attrs['step'] = '' + (meta.extra && meta.extra.step || 'any');
                                                break;
                                            default:
                                                if ((meta.type === 'array' || meta.type === 'object') && !Pacem.Utils.isNullOrEmpty(meta.props)) {
                                                    tagName = Pacem.P + '-childform';
                                                    delete attrs['placeholder'];
                                                    attrs['metadata'] = Pacem.Utils.Json.stringify(meta.props, { functions: Pacem.JsonFunctionConversion.Reference });
                                                    attrs['mode'] = meta.type;
                                                    attrs['lock-items'] = '' + (meta.extra && meta.extra.lockItems || false);
                                                    attrs['logger'] = '{{ :host.logger }}';
                                                    if (!Pacem.Utils.isNullOrEmpty(fetchData.dependsOn)) {
                                                        var extraDom = '';
                                                        for (let d of dependsOn) {
                                                            extraDom += `<${Pacem.P}-childform-propagator model="${attrs["value"]}" watch="{{ :host.entity.${d.prop} }}" property="${(d.alias || d.prop)}"></${Pacem.P}-childform-propagator>\n`;
                                                        }
                                                        this._container.innerHTML = extraDom;
                                                    }
                                                    attrs['fetch-credentials'] = '{{ :host.fetchCredentials }}';
                                                    attrs['fetch-headers'] = '{{ :host.fetchHeaders }}';
                                                }
                                                break;
                                        }
                                        break;
                                }
                                break;
                        }
                    // #region commands
                    if (!Pacem.Utils.isNullOrEmpty(meta.commands)) {
                        Pacem.Utils.addClass(this._container, Pacem.PCSS + '-fieldgroup');
                        const prepend = this._container.appendChild(document.createElement('div')), append = this._container.appendChild(document.createElement('div'));
                        Pacem.Utils.addClass(prepend, `fieldgroup-prepend ${Pacem.PCSS}-buttonset buttons`);
                        Pacem.Utils.addClass(append, `fieldgroup-append ${Pacem.PCSS}-buttonset buttons`);
                        const disable = dependingDisabling || 'false';
                        meta.commands.forEach(cmd => {
                            const btn = document.createElement(Pacem.P + '-button');
                            btn.setAttribute('icon-glyph', cmd.icon);
                            btn.setAttribute('command-name', cmd.name);
                            if (cmd.dependsOnValue) {
                                btn.setAttribute('disabled', `{{ (${disable}) || !::_form.valid || $pacem.isNullOrEmpty(:host.entity.${meta.prop}) }}`);
                                btn.setAttribute('command-argument', `{{ :host.entity.${meta.prop} }}`);
                            }
                            else {
                                btn.setAttribute('disabled', disabledAttr);
                            }
                            btn.setAttribute('tooltip', cmd.tooltip);
                            if (!Pacem.Utils.isNullOrEmpty(cmd.cssClass)) {
                                Pacem.Utils.addClass(btn, cmd.cssClass.join(' '));
                            }
                            (cmd.prepend ? prepend : append).appendChild(btn);
                        });
                    }
                    // #endregion
                    // #region validators
                    if (!Pacem.Utils.isNullOrEmpty(meta.validators)) {
                        meta.validators.forEach((v) => {
                            var validatorElement;
                            var params = {};
                            var attributes = {};
                            if (isKnownValidator(v)) {
                                params = v['params'] || {};
                                attributes['error-message'] = v.errorMessage;
                            }
                            if (isValidatorFactory(v)) {
                                attributes = v.attributes(this, ':host', ':host.entity');
                            }
                            switch (v.type) {
                                case 'required':
                                    attrs['required'] = 'true';
                                    validatorElement = new Scaffolding.PacemRequiredValidatorElement();
                                    break;
                                case 'length':
                                    let lengthValidator = new Scaffolding.PacemLengthValidatorElement();
                                    validatorElement = lengthValidator;
                                    let max = params && params['max'];
                                    let min = params && params['min'];
                                    if (max != null) {
                                        attrs['maxlength'] = '' + (lengthValidator.max = max);
                                    }
                                    else if ('max' in attributes) {
                                        attrs['max'] = attributes['max'];
                                    }
                                    if (min != null) {
                                        attrs['minlength'] = '' + (lengthValidator.min = min);
                                    }
                                    else if ('min' in attributes) {
                                        attrs['minlength'] = attributes['min'];
                                    }
                                    break;
                                case 'range':
                                    let rangeValidator = new Scaffolding.PacemRangeValidatorElement();
                                    validatorElement = rangeValidator;
                                    let maxNum = params && params['max'];
                                    let minNum = params && params['min'];
                                    let isDateTime = tagName === Pacem.P + '-datetime-picker';
                                    if (maxNum != null) {
                                        rangeValidator.max = maxNum;
                                        attrs['max'] = "{{ " + (isDateTime ? "'" + maxNum + "'" : maxNum) + " }}";
                                    }
                                    else if ('max' in attributes) {
                                        attrs['max'] = attributes['max'];
                                    }
                                    if (minNum != null) {
                                        rangeValidator.min = minNum;
                                        attrs['min'] = "{{ " + (isDateTime ? "'" + minNum + "'" : minNum) + " }}";
                                    }
                                    else if ('min' in attributes) {
                                        attrs['min'] = attributes['min'];
                                    }
                                    break;
                                case 'email':
                                    let emailValidator = new Scaffolding.PacemRegexValidatorElement();
                                    validatorElement = emailValidator;
                                    attrs['pattern'] = patternToString(emailValidator.pattern = "^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z0-9]{2,6}$");
                                    break;
                                case 'regex':
                                    let regexValidator = new Scaffolding.PacemRegexValidatorElement();
                                    validatorElement = regexValidator;
                                    let pattern = params['pattern'];
                                    pattern || (pattern = attributes['pattern']);
                                    attrs['pattern'] = patternToString(pattern);
                                    regexValidator.pattern = pattern;
                                    break;
                                case 'binary':
                                    let binaryValidator = new Scaffolding.PacemBinaryValidatorElement();
                                    validatorElement = binaryValidator;
                                    let filePattern = params['pattern'];
                                    if (filePattern != null) {
                                        attrs['pattern'] = patternToString(filePattern);
                                        binaryValidator.pattern = filePattern;
                                    }
                                    else if ('pattern' in attributes) {
                                        attrs['pattern'] = attributes['pattern'];
                                    }
                                    let maxSize = params && params['maxSize'];
                                    if (maxSize != null) {
                                        binaryValidator.maxSize = maxSize;
                                        attrs['max-size'] = '' + maxSize;
                                    }
                                    else if ('max-size' in attributes) {
                                        attrs['max-size'] = attributes['max-size'];
                                    }
                                    break;
                                case 'compare':
                                    let compareValidator = new Scaffolding.PacemCompareValidatorElement();
                                    validatorElement = compareValidator;
                                    let comparedTo = '';
                                    if ('value' in params) {
                                        comparedTo = `{{ ${params.value} }}`;
                                    }
                                    else {
                                        const toProp = 'to' in params ? params.to : params.toProperty;
                                        comparedTo = `{{ :host.entity.${toProp} }}`;
                                    }
                                    compareValidator.setAttribute('to', comparedTo);
                                    let operator = compareValidator.operator = params['operator'] || attributes['operator'] || 'equal';
                                    // In case of `date(time)` try to add some interaction with `datetime-picker`'s min/max props.
                                    if (tagName === Pacem.P + '-datetime-picker') {
                                        switch (operator) {
                                            case 'lessOrEqual':
                                            case 'less': // approximation: edge value won't be allowed but will result enabled on the `datetime-picker`
                                                attrs['max'] = comparedTo;
                                                break;
                                            case 'greaterOrEqual':
                                            case 'greater': // approximation: edge value won't be allowed but will result enabled on the `datetime-picker`
                                                attrs['min'] = comparedTo;
                                                break;
                                        }
                                    }
                                    break;
                                case 'async':
                                    let asyncValidator = new Scaffolding.PacemAsyncValidatorElement();
                                    validatorElement = asyncValidator;
                                    asyncValidator.url = params['url'];
                                    let parameters = [], depOn = params['dependsOn'] || dependsOn;
                                    parameters.push(`${meta.prop} : :host.entity.${meta.prop}`);
                                    for (let depend of depOn || []) {
                                        parameters.push(`${(depend.alias || depend.prop)} : :host.entity.${depend.prop}`);
                                    }
                                    asyncValidator.setAttribute('parameters', `{{ { ${(parameters.join(', '))} } }}`);
                                    asyncValidator.method = params['verb'] || Pacem.Net.HttpMethod.Get;
                                    asyncValidator.setAttribute('fetch-credentials', '{{ :host.fetchCredentials }}');
                                    asyncValidator.setAttribute('fetch-headers', '{{ :host.fetchHeaders }}');
                                    break;
                                case 'custom':
                                    validatorElement = new Scaffolding.PacemCustomValidatorElement();
                                    break;
                                default:
                                    // custom (extra-lib) validator
                                    if (!Pacem.Utils.isNullOrEmpty(v.type) && /* must be a custom element */ v.type.indexOf('-') > 0) {
                                        const tagName = v.type;
                                        const extern = document.createElement(tagName);
                                        if (extern instanceof Scaffolding.PacemBaseValidatorElement) {
                                            validatorElement = extern;
                                        }
                                    }
                                    break;
                            }
                            //
                            if (Pacem.Utils.isNull(validatorElement)) {
                                throw `Cannot generate a formfield validator based on type: ${v.type}.`;
                            }
                            else {
                                validatorElement.watch = meta.prop;
                                validatorElement.setAttribute('hide', '{{ !this.invalid }}');
                                validatorElement.setAttribute('disabled', disabledAttr);
                                for (let attrName in attributes) {
                                    validatorElement.setAttribute(attrName, attributes[attrName]);
                                }
                                this._validators.appendChild(validatorElement);
                            }
                        });
                    }
                    // #endregion
                    // #region build-up
                    let field = document.createElement(tagName);
                    for (var name in attrs) {
                        let attr;
                        if (!Pacem.Utils.isNullOrEmpty(attr = attrs[name]))
                            field.setAttribute(name, attr);
                    }
                    field.append(children);
                    // #endregion
                    this._field = field;
                    this._container.insertBefore(field, this._container.firstElementChild);
                    for (var name in fetchAttrs) {
                        let attr;
                        if (!Pacem.Utils.isNullOrEmpty(attr = fetchAttrs[name]))
                            this._fetcher.setAttribute(name, attr);
                    }
                    // fire propertychange event for bindings' sake...
                    this.dispatchEvent(new Pacem.PropertyChangeEvent({ propertyName: 'field', currentValue: field }));
                }
            };
            __decorate([
                Pacem.ViewChild('label')
            ], PacemFormFieldElement.prototype, "_label", void 0);
            __decorate([
                Pacem.ViewChild(`div.${Pacem.PCSS}-input-container`)
            ], PacemFormFieldElement.prototype, "_container", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-fetch')
            ], PacemFormFieldElement.prototype, "_fetcher", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-form')
            ], PacemFormFieldElement.prototype, "_form", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-panel.' + Pacem.PCSS + '-validators')
            ], PacemFormFieldElement.prototype, "_validators", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemFormFieldElement.prototype, "metadata", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemFormFieldElement.prototype, "fetchHeaders", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemFormFieldElement.prototype, "fetchCredentials", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemFormFieldElement.prototype, "readonly", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemFormFieldElement.prototype, "entity", void 0);
            PacemFormFieldElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-form-field', template: `<${Pacem.P}-form class="${Pacem.PCSS}-field" logger="{{ :host.logger }}" 
css-class="{{ {'${Pacem.PCSS}-fetching': ::_fetcher.fetching, '${Pacem.PCSS}-dirty': this.dirty, '${Pacem.PCSS}-invalid': !this.valid, '${Pacem.PCSS}-editable': !:host.readonly, '${Pacem.PCSS}-readonly': :host.readonly, '${Pacem.PCSS}-pristine': !this.dirty, '${Pacem.PCSS}-valid': this.valid, '${Pacem.PCSS}-has-value': !:host._isValueNullOrEmpty(:host.entity, :host.metadata) } }}">
    <label class="${Pacem.PCSS}-label"></label>
    <div class="${Pacem.PCSS}-input-container"></div>
    <${Pacem.P}-fetch debounce="50" logger="{{ :host.logger }}" credentials="{{ :host.fetchCredentials }}" headers="{{ :host.fetchHeaders }}" diff-by-values="true"></${Pacem.P}-fetch>
    <${Pacem.P}-panel class="${Pacem.PCSS}-validators" hide="{{ ::_form.valid || !::_form.dirty || :host.readonly }}"></${Pacem.P}-panel>
</${Pacem.P}-form>`
                })
            ], PacemFormFieldElement);
            Scaffolding.PacemFormFieldElement = PacemFormFieldElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let ChangePolicy;
            (function (ChangePolicy) {
                ChangePolicy["Input"] = "input";
                ChangePolicy["Blur"] = "blur";
            })(ChangePolicy = Scaffolding.ChangePolicy || (Scaffolding.ChangePolicy = {}));
            class PacemBaseInputElement extends Scaffolding.PacemBaseElement {
                constructor() {
                    super(...arguments);
                    this.debounce = false;
                    this.changePolicy = ChangePolicy.Input;
                    this._focusHandler = (evt) => {
                        if (this.autoselect && !Pacem.Utils.isNull(this.inputField)) {
                            this.inputField.select();
                        }
                    };
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'placeholder':
                            this.inputField && this.inputField.setAttribute(name, val);
                            break;
                    }
                }
                acceptValue(val) {
                    if (this.inputField && val !== this.inputField.value) {
                        this.inputField.value = Pacem.Utils.isNullOrEmpty(val) ? '' : val;
                    }
                }
                get inputField() {
                    return this.inputFields[0];
                }
                onChange(evt) {
                    var deferred = Pacem.DeferPromise.defer();
                    if (evt.type === 'input' && this.changePolicy === ChangePolicy.Blur)
                        deferred.resolve(this.value);
                    else {
                        //
                        const fn = () => {
                            const val = this.getValue(this.inputField.value);
                            if (val !== this.value) {
                                this.value = val;
                                // /* DO NOT MESS THE change EVENT DISPATCH */ this.dispatchEvent(new Event('change'));
                            }
                            deferred.resolve(val);
                        };
                        const d = this.debounce;
                        if (typeof d === 'number' && d > 0) {
                            clearTimeout(this._handle);
                            this._handle = setTimeout(fn, d);
                        }
                        else if (d === true) {
                            cancelAnimationFrame(this._handle);
                            this._handle = requestAnimationFrame(fn);
                        }
                        else
                            requestAnimationFrame(fn);
                    }
                    return deferred.promise;
                }
                ;
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    let field = this.inputField;
                    field.size = 1;
                    field.autocomplete = 'off';
                    field.addEventListener('input', this.changeHandler, false);
                    field.addEventListener('focus', this._focusHandler, false);
                }
                disconnectedCallback() {
                    let field = this.inputField;
                    if (!Pacem.Utils.isNull(field)) {
                        field.removeEventListener('focus', this._focusHandler, false);
                        field.removeEventListener('input', this.changeHandler, false);
                    }
                    super.disconnectedCallback();
                }
            }
            __decorate([
                Pacem.Watch({
                    emit: false, converter: {
                        convert: (attr) => {
                            switch (attr) {
                                case 'true':
                                    return true;
                                case 'false':
                                    return false;
                                default:
                                    return parseFloat(attr);
                            }
                        },
                        convertBack: (prop) => prop.toString()
                    }
                })
            ], PacemBaseInputElement.prototype, "debounce", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemBaseInputElement.prototype, "changePolicy", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemBaseInputElement.prototype, "autoselect", void 0);
            Scaffolding.PacemBaseInputElement = PacemBaseInputElement;
            class PacemOrdinalInputElement extends PacemBaseInputElement {
                convertValueAttributeToProperty(attr) {
                    return parseFloat(attr);
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'min':
                        case 'max':
                        case 'step':
                            val != null ? this.inputField.setAttribute(name, val) : this.inputField.removeAttribute(name);
                            break;
                    }
                }
            }
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemOrdinalInputElement.prototype, "min", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemOrdinalInputElement.prototype, "max", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemOrdinalInputElement.prototype, "step", void 0);
            Scaffolding.PacemOrdinalInputElement = PacemOrdinalInputElement;
            class PacemTextualInputElement extends PacemBaseInputElement {
                convertValueAttributeToProperty(attr) {
                    return attr;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'pattern':
                        case 'maxlength':
                        case 'minlength':
                            val != null ? this.inputField.setAttribute(name, val) : this.inputField.removeAttribute(name);
                            break;
                    }
                }
                getValue(val) {
                    return val;
                }
                getViewValue(val) {
                    return val;
                }
            }
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemTextualInputElement.prototype, "pattern", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemTextualInputElement.prototype, "minlength", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemTextualInputElement.prototype, "maxlength", void 0);
            Scaffolding.PacemTextualInputElement = PacemTextualInputElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="input.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemColorInputElement = class PacemColorInputElement extends Scaffolding.PacemBaseElement {
                constructor() {
                    super();
                }
                acceptValue(val) {
                    const parsed = this._parseValue(val);
                    if (parsed != null) {
                        this._tint.value = parsed.tint;
                        this._alpha.value = parsed.alpha.toString();
                    }
                }
                convertValueAttributeToProperty(attr) {
                    return attr;
                }
                onChange(evt) {
                    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/669685/ (bug open since Aug 2014!)
                    const alpha = this._alpha.valueAsNumber || parseInt(this._alpha.value);
                    const tint = this._tint.value;
                    const value = this.value = this._getValue(tint, alpha);
                    return Pacem.Utils.fromResult(value);
                }
                toggleReadonlyView(readonly) {
                    this._wrapper.hidden = readonly;
                    this._span.hidden = !readonly;
                }
                _getValue(tint, alpha) {
                    // #rrggbb
                    if (isNaN(alpha) || alpha === 100)
                        return tint;
                    // rgba(r,g,b,a)
                    const r = parseInt(tint.substr(1, 2), 16);
                    const g = parseInt(tint.substr(3, 2), 16);
                    const b = parseInt(tint.substr(5, 2), 16);
                    return `rgba(${r},${g},${b},${alpha * .01})`;
                }
                _parseValue(val) {
                    var rgba;
                    if ((rgba = /^rgba?\(([\d,\s\.]+)\)$/.exec(val)) != null) {
                        let core = rgba[1].split(',');
                        if (core.length >= 3) {
                            const fn = (x) => Pacem.Utils.leftPad(parseInt(x).toString(16), 2, '0');
                            const r = fn(core[0]);
                            const g = fn(core[1]);
                            const b = fn(core[2]);
                            const a = core.length > 3 ? parseFloat(core[3]) : 1;
                            return { tint: '#' + r + g + b, alpha: Math.round(Math.max(0, Math.min(1, (isNaN(a) ? 1 : a))) * 100) };
                        }
                    }
                    else if (/^#[0-9a-fA-F]{3,6}/.test(val) === true) {
                        let rgb = val.substr(1);
                        if (rgb.length === 3) {
                            rgb = rgb.charAt(0) + rgb.charAt(0) + rgb.charAt(1) + rgb.charAt(1) + rgb.charAt(2) + rgb.charAt(2);
                        }
                        return { tint: '#' + rgb, alpha: 100 };
                    }
                    return null;
                }
                getViewValue(value) {
                    return value;
                }
                get inputFields() {
                    return [this._tint, this._alpha];
                }
            };
            __decorate([
                Pacem.ViewChild('input[type=color]')
            ], PacemColorInputElement.prototype, "_tint", void 0);
            __decorate([
                Pacem.ViewChild('input[type=number]')
            ], PacemColorInputElement.prototype, "_alpha", void 0);
            __decorate([
                Pacem.ViewChild(`.${Pacem.PCSS}-viewfinder`)
            ], PacemColorInputElement.prototype, "_wrapper", void 0);
            __decorate([
                Pacem.ViewChild(`.${Pacem.PCSS}-readonly`)
            ], PacemColorInputElement.prototype, "_span", void 0);
            PacemColorInputElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-input-color', template: `<div class="${Pacem.PCSS}-viewfinder">
<${Pacem.P}-panel class="${Pacem.PCSS}-input-color" css="{{ { \'background-color\': :host.viewValue } }}"><input type="color" class="${Pacem.PCSS}-input" /></${Pacem.P}-panel>
<input class="${Pacem.PCSS}-input" type="number" min="0" max="100" step="1" value="100" />
</div>
<${Pacem.P}-span class="${Pacem.PCSS}-readonly" css="{{ { \'background-color\': :host.viewValue } }}"></${Pacem.P}-span>`,
                    shadow: Pacem.Defaults.USE_SHADOW_ROOT
                })
            ], PacemColorInputElement);
            Scaffolding.PacemColorInputElement = PacemColorInputElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="input.ts" />
/// <reference path="char-counter.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemEmailInputElement = class PacemEmailInputElement extends Scaffolding.PacemTextualInputElement {
                toggleReadonlyView(readonly) {
                    this.input.hidden = readonly;
                    this.anchor.hidden = !readonly;
                }
                get inputFields() {
                    return [this.input];
                }
            };
            __decorate([
                Pacem.ViewChild('input[type=email]')
            ], PacemEmailInputElement.prototype, "input", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-a')
            ], PacemEmailInputElement.prototype, "anchor", void 0);
            PacemEmailInputElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-input-email',
                    template: `<input type="email" class="${Pacem.PCSS}-input ${Pacem.PCSS}-viewfinder" />${Scaffolding.CHAR_COUNTER_CHILD}<${Pacem.P}-a class="${Pacem.PCSS}-readonly" disabled="{{ $pacem.isNullOrEmpty(:host.value) }}" href="{{ \'mailto:\'+ :host.value }}"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></${Pacem.P}-a>`, shadow: Pacem.Defaults.USE_SHADOW_ROOT
                })
            ], PacemEmailInputElement);
            Scaffolding.PacemEmailInputElement = PacemEmailInputElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            Scaffolding.FileUploadEventName = 'fileupload';
            class FileUploadEvent extends Pacem.CustomTypedEvent {
                constructor(file) {
                    super(Scaffolding.FileUploadEventName, file);
                }
            }
            Scaffolding.FileUploadEvent = FileUploadEvent;
            const ERROR_BINDING = '!Pacem.Utils.isNullOrEmpty(:host.value) && :host.invalidFile && Pacem.Utils.isNullOrEmpty(:host.url)';
            /**
             * PacemUploader Component
             */
            let PacemUploadElement = class PacemUploadElement extends Scaffolding.PacemBaseElement {
                constructor(_tweener = new Pacem.Animations.TweenService()) {
                    super();
                    this._tweener = _tweener;
                    this.undoCaption = 'undo';
                    this.retryCaption = 'retry';
                    this.clearCaption = 'clear';
                    this.uploading = false;
                    this.size = 0;
                    this.percentage = .0;
                    this.complete = false;
                    this.failed = false;
                    this.invalidFile = false;
                    this._fields = {
                        'parallelism': 3,
                        'uid': '',
                        'ongoing': 0,
                        'enqueuer': null,
                        'blob': null,
                        'retryFrom': 0,
                        'chunkSize': 1024 * 128,
                        'undone': false
                    };
                }
                convertValueAttributeToProperty(attr) {
                    return attr; // better assumptions anyone?
                }
                acceptValue(val) {
                    this.percentage = 0;
                    this.uploading = false;
                    this._fileupload.value = '';
                }
                _getMimeIcon(file = this.value, uploading = this.uploading) {
                    if (uploading) {
                        return 'sync';
                    }
                    var filename = file;
                    if (Pacem.Utils.isNullOrEmpty(file)) {
                        return 'file_upload';
                    }
                    if (typeof file === 'object') {
                        filename = file.name;
                    }
                    const extPattern = /\.([\w]+)(\s|$)/;
                    const match = extPattern.exec(filename);
                    if (match && match.length) {
                        switch (match[1].toLowerCase()) {
                            case 'pdf':
                                return 'picture_as_pdf';
                            //case 'txt':
                            //case 'doc':
                            //case 'docx':
                            //    return '<i class="pacem-icon">collection_text</i>';
                            case 'jpg':
                            case 'jpeg':
                            case 'gif':
                            case 'png':
                                return 'filter';
                        }
                    }
                    return 'filter_none';
                }
                get blob() {
                    return this._fields.blob;
                }
                get inputFields() {
                    return [this._fileupload];
                }
                getViewValue(val) {
                    const value = this._localValue || val;
                    if (!Pacem.Utils.isNullOrEmpty(value) && typeof value === 'object') {
                        return `${value.name}\n(${Pacem.Utils.core.size(value.size)})`;
                    }
                    return value;
                }
                toggleReadonlyView(readonly) {
                    this._fileupload.hidden = readonly;
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._fileupload.addEventListener('click', Pacem.stopPropagationHandler, false);
                }
                disconnectedCallback() {
                    if (this._fileupload) {
                        this._fileupload.removeEventListener('click', Pacem.stopPropagationHandler, false);
                    }
                    super.disconnectedCallback();
                }
                /**
                 * Triggered from the component's template.
                 */
                _dispatchDownload(evt) {
                    Pacem.avoidHandler(evt);
                    const value = this._localValue || this.value, dispatch = (name) => {
                        this.dispatchEvent(new CustomEvent('download', { detail: name, bubbles: true, cancelable: false }));
                    };
                    if (!Pacem.Utils.isNullOrEmpty(value)) {
                        if (typeof value === 'string') {
                            // dispatch outside if url is provided
                            dispatch(value);
                        }
                        else {
                            if (!Pacem.Utils.isNullOrEmpty(value.content)) {
                                // download right-away the content when provided
                                Pacem.Utils.download(Pacem.Utils.dataURLToBlob('data:application/download;base64,' + value.content), value.name, value.type);
                            }
                            else {
                                // dispatch outside if content is empty
                                dispatch(value.name);
                            }
                        }
                    }
                }
                reset() {
                    super.reset();
                    this._localValue = null;
                    this.invalidFile = false;
                }
                _validate(file = this._fileupload.files[0], filename) {
                    if (file instanceof File) {
                        filename = file.name;
                    }
                    filename = filename.substr(filename.lastIndexOf('\\') + 1);
                    // max size exceeded
                    const size = this.maxSize;
                    if (size > 0 && size < file.size) {
                        this.invalidFile = true;
                        return false;
                    }
                    // pattern unmatched
                    const pattern = this.pattern;
                    if (pattern && !(new RegExp(pattern, 'i').test(filename))) {
                        this.invalidFile = true;
                        return false;
                    }
                    // all-right then
                    this.invalidFile = false;
                    return true;
                }
                upload(file, filename, state) {
                    if (this._validate(file, filename)) {
                        return this._upload(file, filename, state);
                    }
                }
                async _upload(file, filename, state) {
                    var Uploader = this, fields = Uploader._fields;
                    if (!file)
                        return;
                    if (!filename && file instanceof File) {
                        filename = file.name;
                    }
                    Uploader.failed = false;
                    fields.undone = false;
                    fields.ongoing = 0;
                    const blob = file, size = Uploader.size = blob.size;
                    filename = filename.substr(filename.lastIndexOf('\\') + 1);
                    Uploader.percentage = .0;
                    Uploader.complete = false;
                    //
                    var request = {
                        filename: filename, length: size, action: "start", state: state
                    };
                    //
                    Uploader.uploading = true;
                    try {
                        var r = await Uploader._fetch(request);
                        if (r.ok) {
                            var json = await r.json();
                            fields.retryFrom = 0;
                            fields.blob = blob;
                            fields.uid = json.uid;
                            Uploader._manage();
                        }
                        else {
                            Uploader.uploading = false;
                        }
                        return r;
                    }
                    catch (e) {
                        Uploader.uploading = false;
                    }
                    finally {
                    }
                }
                async _blobToBase64(blob) {
                    const result = await Pacem.Utils.blobToDataURL(blob);
                    return result.substr(result.indexOf('base64,') + 7);
                }
                async _doUpload(blob, skip) {
                    var Uploader = this, fields = Uploader._fields;
                    fields.ongoing++;
                    //
                    const chunk = await this._blobToBase64(blob);
                    var request = {
                        chunk: chunk,
                        uid: fields.uid, position: skip,
                        action: "do"
                    };
                    try {
                        const r = await Uploader._fetch(request);
                        if (r.ok) {
                            fields.ongoing--;
                            if (!!fields.undone)
                                return;
                            const json = await r.json();
                            const result = json;
                            // parallelism > 1 may cause non-ordered responses
                            if (result.percentage > this.percentage) {
                                await Uploader._tweenPercentage(Math.round(Math.max(1, result.percentage)), 200);
                            }
                            if (Uploader.complete != result.complete) {
                                Uploader.complete = result.complete;
                                if (Uploader.complete === true) {
                                    Uploader.uploading = false;
                                    Uploader.changeHandler(new FileUploadEvent(result));
                                }
                            }
                        }
                        else {
                            // error occurred
                            fields.retryFrom = skip;
                            Uploader.failed = true;
                            Uploader.uploading = false;
                        }
                    }
                    catch (_) {
                        // crash
                        fields.retryFrom = skip;
                        Uploader.failed = true;
                        Uploader.uploading = false;
                    }
                }
                _manage() {
                    const fields = this._fields, size = this.size, blob = fields.blob, chunkSize = this.chunkSize || fields.chunkSize;
                    var start = fields.retryFrom;
                    var end = start + chunkSize;
                    //
                    fields.enqueuer = setInterval(() => {
                        if (start < size && !this.failed) {
                            const parallelism = this.parallelism || fields.parallelism;
                            if (fields.ongoing >= parallelism)
                                return;
                            this._doUpload(blob.slice(start, end), start);
                            start = end;
                            end = start + chunkSize;
                        }
                        else {
                            var input = this._fileupload;
                            input.value = '';
                            window.clearInterval(fields.enqueuer);
                        }
                    }, 100);
                }
                async _buildLocalValue(file, filename = file.name, blob = file) {
                    return this._localValue = { name: filename, size: file.size, type: file.type, lastModified: Pacem.Utils.parseDate(file.lastModified).toISOString(), content: await this._blobToBase64(blob) };
                }
                onChange(evt) {
                    return new Promise(async (resolve, reject) => {
                        if (Pacem.CustomEventUtils.isInstanceOf(evt, FileUploadEvent)) {
                            // result of an upload?
                            const file = this.value = evt.detail.filename;
                            this.dispatchEvent(evt);
                            resolve(file);
                        }
                        else {
                            let Uploader = this, input = Uploader._fileupload;
                            if (input.files.length === 0) {
                                // clear
                                resolve(this.value = null);
                            }
                            else {
                                var file = input.files[0], filename = file.name, blob = file;
                                // validate file
                                if (!this._validate(file) && !Pacem.Utils.isNullOrEmpty(this.url)) {
                                    // do not start uploads with an invalid file
                                    resolve(this.value = await this._buildLocalValue(file));
                                }
                                else {
                                    if (/\.(jpe?g|png)$/i.test(filename) && this.maxImageWidth > 0 && this.maxImageHeight > 0) {
                                        blob = await Pacem.Utils.resizeImage(blob, this.maxImageWidth, this.maxImageHeight, .6);
                                    }
                                    await this._buildLocalValue(file, filename, blob);
                                    if (Pacem.Utils.isNullOrEmpty(this.url)) {
                                        // mimic upload
                                        this.uploading = true; // <- triggers anim
                                        if (!Pacem.Utils.isNullOrEmpty(this.value)) {
                                            this.percentage = 0;
                                            await Pacem.Utils.waitForAnimationEnd(this._tuner);
                                        }
                                        else {
                                            await Pacem.Utils.idle(250);
                                        }
                                        await this._tweener.run(0, 100, 500, 0, Pacem.Animations.Easings.sineInOut, (t, v) => {
                                            this.percentage = v;
                                        });
                                        // reset pct
                                        this.percentage = .0;
                                        this.uploading = false;
                                        // no direct upload? set the value to the very File
                                        resolve(this.value = this._localValue);
                                    }
                                    else {
                                        // upload, then wait for resulting filename (value will be the filename string) 
                                        Uploader._upload(blob, input.value);
                                        resolve(this.value);
                                    }
                                }
                            }
                        }
                    });
                }
                _fetch(request) {
                    return fetch(this.url, {
                        method: 'POST', credentials: this.fetchCredentials, headers: Pacem.Utils.extend({ 'Accept': 'application/json', 'Content-Type': 'application/json' }, this.fetchHeaders || {}), body: JSON.stringify(request)
                    });
                }
                async _undo(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var Uploader = this, fields = Uploader._fields, input = Uploader._fileupload;
                    clearInterval(fields.enqueuer);
                    var request = {
                        action: "undo", uid: fields.uid
                    };
                    try {
                        var r = await Uploader._fetch(request);
                        if (r.ok) {
                            fields.undone = true;
                            Uploader.size = 0;
                            Uploader._tweenPercentage(.0, 300);
                        }
                        return r;
                    }
                    catch (e) {
                    }
                    finally {
                        // This input element accepts a filename, which may only be programmatically set to the empty string(!)
                        input.value = '';
                        Uploader.uploading = false;
                        return r;
                    }
                }
                _tweenPercentage(pct, duration = 500) {
                    const from = this.percentage;
                    return this._tweener.run(from, pct, duration, 0, Pacem.Animations.Easings.sineInOut, (t, v) => {
                        this.percentage = v;
                    });
                }
                _retry(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.failed = false;
                    this._manage();
                }
                _clear(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.url = null;
                    this.invalidFile = false;
                    const input = this.inputFields[0];
                    // https://stackoverflow.com/a/35323290
                    input.value = '';
                    if (!/safari/i.test(navigator.userAgent)) {
                        input.type = '';
                        input.type = 'file';
                    }
                    this.changeHandler(null);
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemUploadElement.prototype, "fetchCredentials", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemUploadElement.prototype, "fetchHeaders", void 0);
            __decorate([
                Pacem.ViewChild('input[type=file]')
            ], PacemUploadElement.prototype, "_fileupload", void 0);
            __decorate([
                Pacem.ViewChild(`${Pacem.P}-tuner`)
            ], PacemUploadElement.prototype, "_tuner", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemUploadElement.prototype, "undoCaption", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemUploadElement.prototype, "retryCaption", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemUploadElement.prototype, "clearCaption", void 0);
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true, converter: Pacem.PropertyConverters.String })
            ], PacemUploadElement.prototype, "pattern", void 0);
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true, converter: Pacem.PropertyConverters.String })
            ], PacemUploadElement.prototype, "url", void 0);
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true, converter: Pacem.PropertyConverters.Number })
            ], PacemUploadElement.prototype, "maxImageWidth", void 0);
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true, converter: Pacem.PropertyConverters.Number })
            ], PacemUploadElement.prototype, "parallelism", void 0);
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true, converter: Pacem.PropertyConverters.Number })
            ], PacemUploadElement.prototype, "chunkSize", void 0);
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true, converter: Pacem.PropertyConverters.Number })
            ], PacemUploadElement.prototype, "maxImageHeight", void 0);
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true, converter: Pacem.PropertyConverters.Number })
            ], PacemUploadElement.prototype, "maxSize", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemUploadElement.prototype, "uploading", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemUploadElement.prototype, "size", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemUploadElement.prototype, "percentage", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemUploadElement.prototype, "complete", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemUploadElement.prototype, "failed", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemUploadElement.prototype, "invalidFile", void 0);
            PacemUploadElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-upload', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<${Pacem.P}-button on-click=":host._dispatchDownload($event)" class="${Pacem.PCSS}-upload ${Pacem.PCSS}-viewfinder flat" css-class="{{ {'upload-chosen': !Pacem.Utils.isNullOrEmpty(:host.value) && !:host.uploading, 'upload-error': ${ERROR_BINDING}, 'upload-readonly': :host.readonly } }}">

    <${Pacem.P}-panel class="upload-button" hide="{{ (:host.uploading || :host.failed) && !Pacem.Utils.isNullOrEmpty(:host.url) }}">
        <${Pacem.P}-button tooltip="{{ :host.readonly ? :host.viewValue : 'upload' }}" class="circular pos-relative overflow-hidden" icon-glyph="{{ :host._getMimeIcon(:host.value, :host.uploading) }}" 
            on-mouseover="$this.iconGlyph = :host._getMimeIcon(:host.readonly ? :host.value : '', :host.uploading)" on-mouseout="$this.iconGlyph = :host._getMimeIcon(:host.value, :host.uploading)"
            css-class="{{ {'${Pacem.PCSS}-anim anim-rotate': :host.uploading, 'button-error': :host.invalidFile, 'button-primary': Pacem.Utils.isNullOrEmpty(:host.value) && !:host.invalidFile, 'button-success': !Pacem.Utils.isNullOrEmpty(:host.value) && !:host.invalidFile } }}">
            <input type="file" class="${Pacem.PCSS}-transparent ${Pacem.PCSS}-clickable pos-absolute absolute-left absolute-right absolute-top absolute-bottom" />
        </${Pacem.P}-button>
    </${Pacem.P}-panel>
    <${Pacem.P}-panel class="upload-button" hide="{{ !:host.failed }}">
        <${Pacem.P}-button class="circular flat" icon-glyph="refresh"
        tooltip="{{ :host.retryCaption }}" on-click=":host._retry($event)"><${Pacem.P}-text text="{{ :host.retryCaption }}"></${Pacem.P}-text></${Pacem.P}-button>
    </${Pacem.P}-panel>
    <${Pacem.P}-panel class="upload-button" hide="{{ !:host.uploading || Pacem.Utils.isNullOrEmpty(:host.url) }}">
        <${Pacem.P}-button class="circular flat" icon-glyph="clear" tooltip="{{ :host.undoCaption }}" 
            on-click=":host._undo($event)"><${Pacem.P}-text text="{{ :host.undoCaption }}"></${Pacem.P}-text></${Pacem.P}-button>
    </${Pacem.P}-panel>

    <${Pacem.P}-span tooltip="{{ :host.viewValue }}"
                hide="{{ $pacem.isNullOrEmpty(:host.value) || :host.uploading }}" class="upload-data readonly text-reset display-block ${Pacem.PCSS}-anim text-truncate text-left ${Pacem.PCSS}-pad pad-right-3" text="{{ :host.viewValue }}"></${Pacem.P}-span>

    <${Pacem.P}-panel class="upload-progress hit-none" hide="{{ :host.readonly || (!Pacem.Utils.isNullOrEmpty(:host.value) && !:host.uploading) }}">
        <${Pacem.P}-tuner value="{{ :host.percentage }}" css-class="{{ {'tuner-success': !:host.invalidFile, 'tuner-error': :host.invalidFile} }}" interactive="false"></${Pacem.P}-tuner>
    </${Pacem.P}-panel>

    <${Pacem.P}-button class="circular flat clear-button" icon-glyph="clear" hide="{{ $pacem.isNullOrEmpty(:host.value) }}" tooltip="{{ :host.clearCaption }}" on-click=":host._clear($event)"></${Pacem.P}-button>
        
</${Pacem.P}-button>`
                })
            ], PacemUploadElement);
            Scaffolding.PacemUploadElement = PacemUploadElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="input.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemHiddenInputElement = class PacemHiddenInputElement extends Scaffolding.PacemTextualInputElement {
                constructor() {
                    super();
                }
                toggleReadonlyView(readonly) { }
                get inputFields() {
                    return [this.input];
                }
            };
            __decorate([
                Pacem.ViewChild('input[type=hidden]')
            ], PacemHiddenInputElement.prototype, "input", void 0);
            PacemHiddenInputElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-input-hidden', template: '<input type="hidden" />', shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemHiddenInputElement);
            Scaffolding.PacemHiddenInputElement = PacemHiddenInputElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="input.ts" />
/// <reference path="char-counter.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemUrlInputElement = class PacemUrlInputElement extends Scaffolding.PacemTextualInputElement {
                constructor() {
                    super();
                }
                toggleReadonlyView(readonly) {
                    this.input.hidden = readonly;
                    this.anchor.hidden = !readonly;
                }
                get inputFields() {
                    return [this.input];
                }
            };
            __decorate([
                Pacem.ViewChild('input[type=url]')
            ], PacemUrlInputElement.prototype, "input", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-a')
            ], PacemUrlInputElement.prototype, "anchor", void 0);
            PacemUrlInputElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-input-url', template: `<input type="url" class="${Pacem.PCSS}-input" />${Scaffolding.CHAR_COUNTER_CHILD}<${Pacem.P}-a class="${Pacem.PCSS}-readonly" disabled="{{ $pacem.isNullOrEmpty(:host.value) }}" href="{{ :host.value }}" target="_blank"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></${Pacem.P}-a>`, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemUrlInputElement);
            Scaffolding.PacemUrlInputElement = PacemUrlInputElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="input.ts" />
/// <reference path="input-url.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            class Picture {
            }
            Scaffolding.Picture = Picture;
            Scaffolding.ImageFetchRequestEventName = 'imagefetchrequest';
            class ImageFetchRequestEvent extends Pacem.CustomTypedEvent {
                constructor(args) {
                    super(Scaffolding.ImageFetchRequestEventName, args, { bubbles: true /*, scoped: false */ });
                }
            }
            Scaffolding.ImageFetchRequestEvent = ImageFetchRequestEvent;
            let PacemEditImageElement = class PacemEditImageElement extends Components.PacemElement {
                constructor() {
                    super(...arguments);
                    this._index = 0;
                    this.hint = '';
                }
                _uploaderPropertyChangedCallback(evt) {
                    const val = evt.detail.currentValue;
                    switch (evt.detail.propertyName) {
                        case 'percentage':
                            this._progressbar.percentage = val * 100.0;
                            break;
                        case 'uploading':
                            if (val)
                                this._done(true);
                            break;
                    }
                }
                _thumbnailUploaderPropertyChangedCallback(evt) {
                    const val = evt.detail.currentValue;
                    switch (evt.detail.propertyName) {
                        case 'percentage':
                            this._progressbar.percentage = val * 100.0;
                            break;
                        case 'uploading':
                            this._done(val);
                            break;
                    }
                }
                _uploaderFileUploadCallback(evt) {
                    const uploader = this._uploader;
                    const thumbUploader = this._thumbUploader, w = thumbUploader.maxImageWidth, h = thumbUploader.maxImageHeight;
                    if (w > 0 && h > 0) {
                        var blob = uploader.blob;
                        const uid = evt.detail.uid;
                        Pacem.Utils.resizeImage(blob, w, h).then(blob2 => {
                            if (blob2 != blob) {
                                thumbUploader.upload(blob2, 'thumbnail.jpg', uid);
                                return;
                            }
                            else
                                // fallback
                                this._done(false);
                        });
                    }
                    else
                        // fallback
                        this._done(false);
                }
                _done(uploading) {
                    if (!uploading) {
                        this._imagefetch(0);
                    }
                    this._repeater.hidden = uploading;
                    this._progressbar.hidden = !uploading;
                }
                _snapshotPropertyChangedCallback(evt) {
                    switch (evt.detail.propertyName) {
                        case 'value':
                            const blob = Pacem.Utils.dataURLToBlob(evt.detail.currentValue);
                            this._uploader.upload(blob, 'snapshot.jpg');
                            break;
                    }
                }
                reset() {
                    this._snapshot.step = Components.UI.SnapshotStep.Start;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'imageSet':
                            let set = val || { skip: 0, set: [] };
                            if (Pacem.Utils.isNullOrEmpty(this._images) || set.skip === 0)
                                this._images = set.set;
                            else if (!Pacem.Utils.isNull(this._images))
                                Array.prototype.splice.apply(this._images, [set.skip, this._images.length - set.skip].concat(set.set));
                            this._fetching = false;
                            break;
                        case 'hint':
                            if (!first)
                                this._imagefetch(0);
                            break;
                    }
                }
                _imagefetchSuddenly(ndx) {
                    this._fetching = true;
                    this._imagefetch(ndx);
                }
                _imagefetch(ndx) {
                    if (!(ndx >= 0))
                        ndx = (this._images && this._images.length) || 0;
                    this.dispatchEvent(new ImageFetchRequestEvent({ hint: this.hint, skip: ndx, take: 18 }));
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemEditImageElement.prototype, "uploadUrl", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemEditImageElement.prototype, "hint", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemEditImageElement.prototype, "imageSet", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemEditImageElement.prototype, "value", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemEditImageElement.prototype, "maxWidth", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemEditImageElement.prototype, "maxHeight", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemEditImageElement.prototype, "maxThumbnailWidth", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemEditImageElement.prototype, "maxThumbnailHeight", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemEditImageElement.prototype, "allowSnapshot", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemEditImageElement.prototype, "_fetching", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemEditImageElement.prototype, "_images", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-repeater')
            ], PacemEditImageElement.prototype, "_repeater", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-upload[main]')
            ], PacemEditImageElement.prototype, "_uploader", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-upload[thumb]')
            ], PacemEditImageElement.prototype, "_thumbUploader", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-snapshot')
            ], PacemEditImageElement.prototype, "_snapshot", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-progressbar')
            ], PacemEditImageElement.prototype, "_progressbar", void 0);
            __decorate([
                Pacem.Debounce(500)
            ], PacemEditImageElement.prototype, "_imagefetch", null);
            PacemEditImageElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-edit-image', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<${Pacem.P}-panel class="${Pacem.PCSS}-edit-image"
        css-class="{{ {'${Pacem.PCSS}-snapshot': ::_snapshot.step != '${Components.UI.SnapshotStep.Start}', '${Pacem.PCSS}-uploading': ::_uploader.uploading, '${Pacem.PCSS}-upload-enabled': !Pacem.Utils.isNullOrEmpty(:host.uploadUrl), '${Pacem.PCSS}-snapshot-enabled': !Pacem.Utils.isNullOrEmpty(:host.uploadUrl) && :host.allowSnapshot} }}">
        <div>
            <${Pacem.P}-input-search value="{{ :host.hint, twoway }}"></${Pacem.P}-input-search>
            <${Pacem.P}-upload main pattern=".+\.(jpe?g|png|svg|ico)$" url="{{ :host.uploadUrl }}"
                    max-image-width="{{ :host.maxWidth }}" max-image-height="{{ :host.maxHeight }}"
                    on-${Scaffolding.FileUploadEventName}=":host._uploaderFileUploadCallback($event)"
                    on-${Pacem.PropertyChangeEventName}=":host._uploaderPropertyChangedCallback($event)" hide="{{ Pacem.Utils.isNullOrEmpty(:host.uploadUrl) || ::_thumbUploader.uploading }}"></${Pacem.P}-upload>
            <${Pacem.P}-upload thumb pattern=".+\.(jpe?g|png|svg|ico)$" url="{{ :host.uploadUrl }}" hide="{{ !::_thumbUploader.uploading  }}"
                    max-image-width="{{ :host.maxThumbnailWidth }}" max-image-height="{{ :host.maxThumbnailHeight }}"
                    on-${Pacem.PropertyChangeEventName}=":host._thumbnailUploaderPropertyChangedCallback($event)"></${Pacem.P}-upload>
            <${Pacem.P}-button class="${Pacem.PCSS}-snapshot" on-click="Pacem.avoidHandler($event); ::_snapshot.step = '${Components.UI.SnapshotStep.Taking}'" hide="{{ Pacem.Utils.isNullOrEmpty(:host.uploadUrl) || !:host.allowSnapshot }}"></${Pacem.P}-button>
            <${Pacem.P}-infinite-scroller container="{{ ::_repeater }}" on-fetchmore=":host._imagefetchSuddenly()" disabled="{{ :host._fetching || :host.disabled || :host._images.length >= :host.imageSet.total }}"></${Pacem.P}-infinite-scroller>
            <${Pacem.P}-repeater datasource="{{ :host._images }}">
                <template>
                    <${Pacem.P}-img css-class="{{ {'${Pacem.PCSS}-selected': ^item.src === :host.value } }}" on-click=":host.value = ^item.src" src="{{ ^item.thumb }}" adapt="contain"></${Pacem.P}-img>
                </template>
            </${Pacem.P}-repeater>
            <${Pacem.P}-progressbar class="progressbar-smaller progressbar-accent" caption="{{ ::_thumbUploader.uploading ? 'thumbnail...' : 'uploading...' }}"></${Pacem.P}-progressbar>
        </div>
        <div>
            <${Pacem.P}-snapshot hide="{{ !:host.allowSnapshot }}" on-${Pacem.PropertyChangeEventName}=":host._snapshotPropertyChangedCallback($event)"></${Pacem.P}-snapshot>
        </div>
    </${Pacem.P}-panel>`
                })
            ], PacemEditImageElement);
            Scaffolding.PacemEditImageElement = PacemEditImageElement;
            let PacemImageInputElement = class PacemImageInputElement extends Scaffolding.PacemBaseElement {
                constructor() {
                    super(...arguments);
                    this._broadcastFetchRequestEventName = (evt) => {
                        this.dispatchEvent(new ImageFetchRequestEvent(evt.detail));
                    };
                    this._innerValueChangedHandler = (evt) => {
                        if (evt.detail.propertyName === 'value' && !Pacem.Utils.isNull(this._dialog))
                            this._dialog.state = evt.detail.currentValue;
                    };
                    // #endregion
                }
                convertValueAttributeToProperty(attr) {
                    return attr; // better assumptions anyone?
                }
                getViewValue(value) {
                    return value;
                }
                get inputFields() {
                    return [];
                }
                _clear(evt) {
                    this.changeHandler(evt);
                }
                onChange(evt) {
                    let value = this.value;
                    if (Pacem.CustomEventUtils.isInstanceOf(evt, Components.UI.DialogResultEvent)
                        && evt.detail.button === Components.UI.DialogButton.Ok)
                        value = this.value = evt.detail.state;
                    else if (evt.target === this._input)
                        value = this.value = this._input.value;
                    else if (evt.target === this._clearBtn)
                        value = this.value = undefined;
                    return Pacem.Utils.fromResult(value);
                }
                toggleReadonlyView(readonly) {
                    this._input.hidden = this._editBtn.hide = this._clearBtn.hide = readonly;
                }
                _addDialog() {
                    var dialog = document.createElement(Pacem.P + '-dialog');
                    dialog.buttons = Components.UI.DialogButtons.OkCancel;
                    dialog.addEventListener(Components.UI.DialogResultEventName, this.changeHandler, false);
                    dialog.appendChild(this._addEditImage());
                    document.body.appendChild(dialog);
                    //
                    return this._dialog = dialog;
                }
                _removeDialog() {
                    this._removeEditImage();
                    if (!Pacem.Utils.isNull(this._dialog)) {
                        this._dialog.removeEventListener(Components.UI.DialogResultEventName, this.changeHandler, false);
                        this._dialog.remove();
                    }
                }
                _addEditImage() {
                    var editImage = document.createElement(Pacem.P + '-edit-image');
                    editImage.disabled = true;
                    editImage.addEventListener(Pacem.PropertyChangeEventName, this._innerValueChangedHandler, false);
                    editImage.addEventListener(Scaffolding.ImageFetchRequestEventName, this._broadcastFetchRequestEventName, false);
                    editImage.uploadUrl = this.uploadUrl;
                    editImage.allowSnapshot = this.allowSnapshot;
                    editImage.maxWidth = this.maxWidth;
                    editImage.maxHeight = this.maxHeight;
                    editImage.maxThumbnailHeight = this.maxThumbnailHeight;
                    editImage.maxThumbnailWidth = this.maxThumbnailWidth;
                    return this._editImage = editImage;
                }
                _removeEditImage() {
                    if (!Pacem.Utils.isNull(this._editImage)) {
                        this._editImage.removeEventListener(Pacem.PropertyChangeEventName, this._innerValueChangedHandler, false);
                        this._editImage.removeEventListener(Scaffolding.ImageFetchRequestEventName, this._broadcastFetchRequestEventName, false);
                    }
                }
                connectedCallback() {
                    super.connectedCallback();
                    this._addDialog();
                }
                disconnectedCallback() {
                    this._removeDialog();
                    super.disconnectedCallback();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'uploadUrl':
                            if (!Pacem.Utils.isNull(this._editImage))
                                this._editImage.uploadUrl = val;
                            break;
                        case 'allowSnapshot':
                            if (!Pacem.Utils.isNull(this._editImage))
                                this._editImage.allowSnapshot = val;
                            break;
                        case 'imageSet':
                            if (!Pacem.Utils.isNull(this._editImage))
                                this._editImage.imageSet = val;
                            break;
                        case 'maxThumbnailHeight':
                            if (!Pacem.Utils.isNull(this._editImage))
                                this._editImage.maxThumbnailHeight = val;
                            break;
                        case 'maxThumbnailWidth':
                            if (!Pacem.Utils.isNull(this._editImage))
                                this._editImage.maxThumbnailWidth = val;
                            break;
                        case 'maxHeight':
                            if (!Pacem.Utils.isNull(this._editImage))
                                this._editImage.maxHeight = val;
                            break;
                        case 'maxWidth':
                            if (!Pacem.Utils.isNull(this._editImage))
                                this._editImage.maxWidth = val;
                            break;
                    }
                }
                acceptValue(val) {
                    if (!Pacem.Utils.isNull(this._editImage))
                        this._editImage.value = val;
                }
                _update(val) {
                    this._image.src = val;
                }
                _retrieve() {
                    return this.value;
                }
                _edit(evt) {
                    Pacem.avoidHandler(evt);
                    var editImage = this._editImage, state = this.value;
                    editImage.disabled = false;
                    editImage.reset();
                    editImage.value = state;
                    this._dialog.open(state).then(args => {
                        switch (args.button) {
                            case Components.UI.DialogButton.Cancel:
                                // reset value
                                this._update(this.value);
                                break;
                            case Components.UI.DialogButton.Ok:
                                // save
                                this._update(args.state);
                                break;
                        }
                        this._editImage.disabled = true;
                    });
                }
            };
            __decorate([
                Pacem.ViewChild(Pacem.P + '-img')
            ], PacemImageInputElement.prototype, "_image", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-button.' + Pacem.PCSS + '-edit')
            ], PacemImageInputElement.prototype, "_editBtn", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-button.' + Pacem.PCSS + '-clear')
            ], PacemImageInputElement.prototype, "_clearBtn", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-input-url')
            ], PacemImageInputElement.prototype, "_input", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemImageInputElement.prototype, "uploadUrl", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemImageInputElement.prototype, "imageSet", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemImageInputElement.prototype, "maxWidth", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemImageInputElement.prototype, "maxHeight", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemImageInputElement.prototype, "maxThumbnailWidth", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemImageInputElement.prototype, "maxThumbnailHeight", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemImageInputElement.prototype, "allowSnapshot", void 0);
            PacemImageInputElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-input-image', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<div class="${Pacem.PCSS}-input-image"><${Pacem.P}-img src="{{ :host.value }}" adapt="contain"></${Pacem.P}-img><div class="${Pacem.PCSS}-input-image-dashboard">
    <${Pacem.P}-button on-click=":host._edit($event)" hide="{{ :host.disabled }}" class="${Pacem.PCSS}-edit">Edit</${Pacem.P}-button>
    <${Pacem.P}-button on-click=":host._clear($event)" hide="{{ :host.disabled }}" class="${Pacem.PCSS}-clear">Clear</${Pacem.P}-button>
</div><${Pacem.P}-input-url placeholder="{{ :host.placeholder }}" on-change=":host.changeHandler($event)" value="{{ :host.value }}"></${Pacem.P}-input-url>

    <${Pacem.P}-panel hide="{{ Pacem.Utils.isNullOrEmpty(:host.value) }}">
    <dl class="${Pacem.PCSS}-input-image-preview">
        <dt>dimensions:</dt><dd><${Pacem.P}-text text="{{ ::_image.size.width +'x'+ ::_image.size.height }}"></${Pacem.P}-text></dd>
        <dt>size:</dt><dd><${Pacem.P}-text text="{{ $pacem.size(::_image.size.weight) }}"></${Pacem.P}-text></dd>
    </dl></${Pacem.P}-panel>

</div>`
                })
            ], PacemImageInputElement);
            Scaffolding.PacemImageInputElement = PacemImageInputElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="input.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemNumberInputElement = class PacemNumberInputElement extends Scaffolding.PacemOrdinalInputElement {
                toggleReadonlyView(readonly) {
                    this._span.hidden = !readonly;
                    this._input.hidden = readonly;
                }
                get inputFields() {
                    return [this._input];
                }
                getViewValue(val) {
                    return this.value != null ? this._format(this.value) : undefined;
                }
                _format(v = this.value) {
                    const intl = this.format;
                    if (!Pacem.Utils.isNullOrEmpty(intl)) {
                        return new Intl.NumberFormat(Pacem.Utils.lang(this), intl).format(v);
                    }
                    return v.toString();
                }
                getValue(val) {
                    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/669685/ (bug open since Aug 2014!)
                    const v = this.inputField.valueAsNumber || parseFloat(this.inputField.value);
                    return isNaN(v) ? undefined : v;
                }
            };
            __decorate([
                Pacem.ViewChild('input[type=number]')
            ], PacemNumberInputElement.prototype, "_input", void 0);
            __decorate([
                Pacem.ViewChild(`span.${Pacem.PCSS}-readonly`)
            ], PacemNumberInputElement.prototype, "_span", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemNumberInputElement.prototype, "format", void 0);
            PacemNumberInputElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-input-number', template: `<input type="number" class="${Pacem.PCSS}-input ${Pacem.PCSS}-viewfinder" /><span class="${Pacem.PCSS}-readonly"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></span>`, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemNumberInputElement);
            Scaffolding.PacemNumberInputElement = PacemNumberInputElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="char-counter.ts" />
/// <reference path="input.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemPasswordInputElement = class PacemPasswordInputElement extends Scaffolding.PacemTextualInputElement {
                constructor() {
                    super();
                }
                get inputFields() {
                    return [this.input];
                }
                toggleReadonlyView(readonly) {
                    this.input.hidden = readonly;
                    this.span.hidden = !readonly;
                }
                getViewValue(val) {
                    return Pacem.Utils.leftPad('', Math.floor(8 + 3 * Math.random()), '•');
                }
            };
            __decorate([
                Pacem.ViewChild('input[type=password]')
            ], PacemPasswordInputElement.prototype, "input", void 0);
            __decorate([
                Pacem.ViewChild(`span.${Pacem.PCSS}-readonly`)
            ], PacemPasswordInputElement.prototype, "span", void 0);
            PacemPasswordInputElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-input-password', template: `<input type="password" class="${Pacem.PCSS}-input ${Pacem.PCSS}-viewfinder" />${Scaffolding.CHAR_COUNTER_CHILD}<span class="${Pacem.PCSS}-readonly"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></span>`, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemPasswordInputElement);
            Scaffolding.PacemPasswordInputElement = PacemPasswordInputElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="input.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemSearchInputElement = class PacemSearchInputElement extends Scaffolding.PacemTextualInputElement {
                constructor() {
                    super();
                }
                get inputFields() {
                    return [this.input];
                }
                toggleReadonlyView(readonly) {
                    // no readonly view provided.
                }
            };
            __decorate([
                Pacem.ViewChild('input[type=search]')
            ], PacemSearchInputElement.prototype, "input", void 0);
            PacemSearchInputElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-input-search', template: '<input type="search" class="' + Pacem.PCSS + '-input" />', shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemSearchInputElement);
            Scaffolding.PacemSearchInputElement = PacemSearchInputElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="input.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemTelInputElement = class PacemTelInputElement extends Scaffolding.PacemTextualInputElement {
                constructor() {
                    super();
                }
                toggleReadonlyView(readonly) {
                    this.input.hidden = readonly;
                    this.anchor.hidden = !readonly;
                }
                get inputFields() {
                    return [this.input];
                }
            };
            __decorate([
                Pacem.ViewChild('input[type=tel]')
            ], PacemTelInputElement.prototype, "input", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-a')
            ], PacemTelInputElement.prototype, "anchor", void 0);
            PacemTelInputElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-input-tel', template: `<input type="tel" class="${Pacem.PCSS}-input" /><${Pacem.P}-a class="${Pacem.PCSS}-readonly" disabled="{{ $pacem.isNullOrEmpty(:host.value) }}" href="{{ 'tel:'+ :host.value }}"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></${Pacem.P}-a>`, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemTelInputElement);
            Scaffolding.PacemTelInputElement = PacemTelInputElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="input.ts" />
/// <reference path="char-counter.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemTextInputElement = class PacemTextInputElement extends Scaffolding.PacemTextualInputElement {
                constructor() {
                    super();
                }
                toggleReadonlyView(readonly) {
                    this._span.hidden = !readonly;
                    this._input.hidden = readonly;
                }
                get inputFields() {
                    return [this._input];
                }
            };
            __decorate([
                Pacem.ViewChild('input[type=text]')
            ], PacemTextInputElement.prototype, "_input", void 0);
            __decorate([
                Pacem.ViewChild('span.' + Pacem.PCSS + '-readonly')
            ], PacemTextInputElement.prototype, "_span", void 0);
            PacemTextInputElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-input-text',
                    template: `<input type="text" class="${Pacem.PCSS}-input" />${Scaffolding.CHAR_COUNTER_CHILD}<span class="${Pacem.PCSS}-readonly"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></span>`,
                    shadow: Pacem.Defaults.USE_SHADOW_ROOT
                })
            ], PacemTextInputElement);
            Scaffolding.PacemTextInputElement = PacemTextInputElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="../../../dist/js/pacem-maps.d.ts" />
/// <reference path="input.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            Scaffolding.DEFAULT_TILES = "";
            Scaffolding.DEFAULT_ATTRIBUTION = "";
            //const TILES = `//api.mapbox.com/styles/v1/cmerighi/ciwz1gib7002l2prvgpi724nk/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY21lcmlnaGkiLCJhIjoiY2lsZHIxdGJmMDAxOHc4bHowamxpZ2Z2OCJ9.7I7ndF-rAkx_1Sqi0bw3Ew`;
            //const ATTRIBUTION = `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>`
            const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';
            let PacemLatLngElement = class PacemLatLngElement extends Scaffolding.PacemBaseElement {
                convertValueAttributeToProperty(attr) {
                    const regexArray = /^\s*([+-]?\d+\.?\d+)[,\s]\s*([+-]?\d+\.?\d+)\s*$/.exec(attr);
                    if (regexArray && regexArray.length === 3) {
                        return { lat: parseFloat(regexArray[1]), lng: parseFloat(regexArray[2]) };
                    }
                    throw `Invalid coordinates format for "${attr}"`;
                }
                compareValuePropertyValues(old, val) {
                    if (old && typeof old.lat === 'number' && typeof old.lng === 'number'
                        && val && typeof val.lat === 'number' && typeof val.lng === 'number') {
                        return old.lat === val.lat && old.lng === val.lng;
                    }
                    return false;
                }
                getViewValue(value) {
                    return this._getViewValue(value);
                }
                _getViewValue(value, precision = 8) {
                    return value && typeof value.lat === 'number' && typeof value.lng === 'number' && value.lat.toFixed(precision) + ',' + value.lng.toFixed(precision) || '';
                }
                get inputFields() {
                    return [this._latInput, this._lngInput];
                }
                toggleReadonlyView(readonly) {
                    this._inputContainer.hidden = /*
                    this._lngInput.hide = this._latInput.hide =*/
                        readonly;
                }
                // regex: 
                acceptValue(val) {
                    let e_val = this._ensureValue(val);
                    this._lat = e_val.lat;
                    this._lng = e_val.lng;
                }
                _ensureValue(val) {
                    return (val && typeof val.lat === 'number' && typeof val.lng === 'number') ? val : Pacem.Components.Maps.MapConsts.DEFAULT_COORDS;
                }
                onChange(evt) {
                    if (evt && evt.type === 'dragend') {
                        var mevt = evt;
                        // geocoordinate change due to map drag
                        this._lat = mevt.detail.position.lat;
                        this._lng = mevt.detail.position.lng;
                    } // else: geocoordinate change due to text-input
                    const lat = this._lat;
                    const lng = this._lng;
                    if (Pacem.Utils.isNull(lat) || Pacem.Utils.isNull(lng))
                        return Pacem.Utils.fromResult(this.value);
                    return Pacem.Utils.fromResult(this.value = { lat: lat, lng: lng });
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'options' && !first) {
                        const opts = Pacem.Utils.clone((val || { provider: 'osm' }));
                        this._synchronizeOptions(opts);
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._synchronizeOptions();
                }
                _synchronizeOptions(opts = this.options || { provider: 'osm' }) {
                    const marker = this._marker, map = this._map;
                    marker.icon = opts.icon;
                    switch (opts && opts.provider) {
                        case 'azure':
                            this._azureAdapter.subscriptionKey = opts.apiKey;
                            map.adapter = this._azureAdapter;
                            break;
                        case 'google':
                        case 'gmaps':
                            this._googleAdapter.apiKey = opts.apiKey;
                            map.adapter = this._googleAdapter;
                            break;
                        default:
                            if (!Pacem.Utils.isNullOrEmpty(opts.attribution)) {
                                this._leafletAdapter.attribution = opts.attribution;
                            }
                            if (!Pacem.Utils.isNullOrEmpty(opts.tiles)) {
                                this._leafletAdapter.tiles = opts.tiles;
                            }
                            map.adapter = this._leafletAdapter;
                            break;
                    }
                    delete opts['provider'];
                    delete opts['icon'];
                    delete opts['apiKey'];
                    delete opts['attribution'];
                    delete opts['tiles'];
                    for (let prop in opts) {
                        if (prop in map) {
                            map[prop] = opts[prop];
                        }
                    }
                }
            };
            __decorate([
                Pacem.ViewChild(Pacem.P + '-map-adapter-leaflet')
            ], PacemLatLngElement.prototype, "_leafletAdapter", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-map-adapter-azure')
            ], PacemLatLngElement.prototype, "_azureAdapter", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-map-adapter-google')
            ], PacemLatLngElement.prototype, "_googleAdapter", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-map')
            ], PacemLatLngElement.prototype, "_map", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-map-marker')
            ], PacemLatLngElement.prototype, "_marker", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-input-number:nth-child(1)')
            ], PacemLatLngElement.prototype, "_latInput", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-input-number:nth-child(2)')
            ], PacemLatLngElement.prototype, "_lngInput", void 0);
            __decorate([
                Pacem.ViewChild(`.${Pacem.PCSS}-latlng-fields`)
            ], PacemLatLngElement.prototype, "_inputContainer", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-fetch')
            ], PacemLatLngElement.prototype, "_fetcher", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json, emit: false })
            ], PacemLatLngElement.prototype, "options", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemLatLngElement.prototype, "_lat", void 0);
            __decorate([
                Pacem.Watch()
            ], PacemLatLngElement.prototype, "_lng", void 0);
            PacemLatLngElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-latlng', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<div class="${Pacem.PCSS}-latlng">
    <div class="${Pacem.PCSS}-latlng-fields ${Pacem.PCSS}-viewfinder">
        <${Pacem.P}-input-number class="${Pacem.PCSS}-lat" value="{{ :host._lat, twoway }}" min="-90" max="90" step="{{ 'any' }}"></${Pacem.P}-input-number>
        <${Pacem.P}-input-number class="${Pacem.PCSS}-lng" value="{{ :host._lng, twoway }}" min="-180" max="180" step="{{ 'any' }}"></${Pacem.P}-input-number>
    </div>
    <${Pacem.P}-panel hide="{{ Pacem.Utils.isNull(:host.value) || :host.readonly }}">
    <dl class="${Pacem.PCSS}-latlng-preview">
        <dt>decimals:</dt><dd><${Pacem.P}-text text="{{ :host._getViewValue(:host.value, 12) }}"></${Pacem.P}-text></dd>
        <dt>address:</dt><dd><${Pacem.P}-text text="{{ ::_fetcher.result.display_name || '?' }}"></${Pacem.P}-text></dd>
        <dt>degrees:</dt><dd><${Pacem.P}-span css-class="{{ {'${Pacem.PCSS}-lat-north': :host._lat > 0, '${Pacem.PCSS}-lat-south': :host._lat < 0} }}" content="{{ $pacem.decToDeg(Math.abs(:host._lat)) }}"></${Pacem.P}-span>,
        <${Pacem.P}-span css-class="{{ {'${Pacem.PCSS}-lng-east': :host._lng > 0, '${Pacem.PCSS}-lng-west': :host._lng < 0} }}" content="{{ $pacem.decToDeg(Math.abs(:host._lng)) }}"></${Pacem.P}-span></dd>
    </dl>
    </${Pacem.P}-panel>
    <${Pacem.P}-span class="${Pacem.PCSS}-readonly" hide="{{ !:host.readonly }}" content="{{ :host.viewValue + ($pacem.isNullOrEmpty(::_fetcher.result.display_name) ? '' : (' <small>'+ ::_fetcher.result.display_name +'</small>')) }}"></${Pacem.P}-span>

    <${Pacem.P}-map-adapter-leaflet></${Pacem.P}-map-adapter-leaflet>
    <${Pacem.P}-map-adapter-azure></${Pacem.P}-map-adapter-azure>
    <${Pacem.P}-map-adapter-google></${Pacem.P}-map-adapter-google>

    <${Pacem.P}-map adapter="{{ ::_adapter }}">
        <${Pacem.P}-map-marker position="{{ :host._ensureValue(:host.value) }}" on-dragend=":host.changeHandler($event)" draggable="{{ !:host.readonly }}"></${Pacem.P}-map-marker>
    </${Pacem.P}-map>
    <${Pacem.P}-fetch disabled="{{ $pacem.isNull(:host.value) }}" parameters="{{ { format: 'json', lat: :host._lat, lon: :host._lng } }}" url="${REVERSE_GEOCODE_URL}"></${Pacem.P}-fetch>
</div>`
                })
            ], PacemLatLngElement);
            Scaffolding.PacemLatLngElement = PacemLatLngElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            const ITEM_TXT_CORE = `change-policy="${Scaffolding.ChangePolicy.Blur}" readonly="{{ :host.readonly }}"`;
            function isEmpty(nvp) {
                return Pacem.Utils.isNullOrEmpty(nvp && nvp.name);
            }
            function pullEmpty() {
                return { name: '', value: '' };
            }
            let PacemNameValueListElement = class PacemNameValueListElement extends Scaffolding.PacemBaseElement {
                constructor() {
                    super(...arguments);
                    this.inputFields = [];
                    this._bag = [];
                }
                toggleReadonlyView(readonly) {
                    // let the bindings do their job...
                }
                onChange(evt) {
                    return new Promise((resolve, reject) => {
                        let val = this._bagToValue(this._bag);
                        if (!this.compareValuePropertyValues(val, this.value)) {
                            resolve(this.value = val);
                        }
                        else {
                            reject();
                        }
                    });
                }
                acceptValue(val) {
                    this._bag = this._valueToBag(val);
                }
                getViewValue(value) {
                    return ''; // unneeded
                }
                compareValuePropertyValues(old, val) {
                    return Pacem.Utils.Json.stringify(old) === Pacem.Utils.Json.stringify(val);
                }
                convertValueAttributeToProperty(attr) {
                    return Pacem.PropertyConverters.Json.convert(attr);
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'dictionary' && !first) {
                        this.value = this._bagToValue();
                    }
                }
                _bagToValue(bag = this._bag) {
                    if (!this.dictionary) {
                        // not a dictionary
                        // return an array
                        let b = [];
                        for (let item of bag || []) {
                            if (isEmpty(item)) {
                                continue;
                            }
                            if (b.find(i => i.name === item.name && i.value === item.value)) {
                                continue;
                            }
                            b.push(item);
                        }
                        return b;
                    }
                    // dictionary
                    // return an object
                    let v = {};
                    for (let kvp of bag || []) {
                        if (kvp.name in v) {
                            // skip existing names...
                            continue;
                        }
                        v[kvp.name] = kvp.value;
                    }
                    return v;
                }
                _valueToBag(val = this.value) {
                    const bag = [];
                    if (!Pacem.Utils.isNullOrEmpty(val) && typeof val === 'object') {
                        if (this.dictionary && !Pacem.Utils.isArray(val)) {
                            for (let prop in val) {
                                bag.push({ name: prop, value: val[prop] });
                            }
                        }
                        else if (!this.dictionary && Pacem.Utils.isArray(val)) {
                            Array.prototype.splice.apply(bag, [0, 0].concat(val.map(i => Pacem.Utils.clone(i))));
                        }
                    }
                    return !Pacem.Utils.isNullOrEmpty(bag) ? bag : [pullEmpty()];
                }
                _deleteAt(evt) {
                    this._bag.splice(evt.detail, 1);
                    this.changeHandler(evt);
                }
                _addItem(evt) {
                    const bag = this._bag, lastItem = this._bag[this._bag.length - 1];
                    if (!isEmpty(lastItem)) {
                        bag.push(pullEmpty());
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemNameValueListElement.prototype, "dictionary", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Json })
            ], PacemNameValueListElement.prototype, "_bag", void 0);
            PacemNameValueListElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-namevalue-list', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<${Pacem.P}-repeater datasource="{{ :host._bag }}" on-itemdelete=":host._deleteAt($event)">
    <template>
        <div class="${Pacem.PCSS}-fieldset ${Pacem.PCSS}-margin margin-bottom-1">
            <div class="fieldset-auto">
                <div class="${Pacem.PCSS}-fieldgroup">
                    <${Pacem.P}-input-text ${ITEM_TXT_CORE} value="{{ ^item.name, twoway }}" on-change=":host.changeHandler($event)"></${Pacem.P}-input-text>
                    <div class="fieldgroup-prepend"></div>
                </div>
                <div class="${Pacem.PCSS}-fieldgroup">
                    <${Pacem.P}-input-text ${ITEM_TXT_CORE} value="{{ ^item.value, twoway }}" on-change=":host.changeHandler($event)"></${Pacem.P}-input-text>
                    <div class="fieldgroup-append">
                        <${Pacem.P}-button class="${Pacem.PCSS}-cell cols-2 flat delete" hide="{{ :host.readonly }}" command-name="delete" command-argument="{{ ^index }}"></${Pacem.P}-button>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <${Pacem.P}-button class="flat add" hide="{{ :host.readonly }}" on-click=":host._addItem($event)"></${Pacem.P}-button>
</${Pacem.P}-repeater>`
                })
            ], PacemNameValueListElement);
            Scaffolding.PacemNameValueListElement = PacemNameValueListElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemPropertyPickerElement = class PacemPropertyPickerElement extends Scaffolding.PacemBaseElement {
                get inputFields() {
                    return [this._select];
                }
                toggleReadonlyView(readonly) {
                    this._select.readonly = readonly;
                }
                onChange(evt) {
                    return Pacem.Utils.fromResult(this.value = this._select.value);
                }
                acceptValue(val) {
                    this._select.value = val;
                }
                getViewValue(value) {
                    return this._select.viewValue;
                }
                convertValueAttributeToProperty(attr) {
                    return Pacem.PropertyConverters.Element.convert(attr);
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._databind();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first) {
                        switch (name) {
                            case 'target':
                                this._databind();
                                break;
                        }
                    }
                }
                _databind() {
                    const props = [], 
                    // recursive fn
                    fnRec = (container, prop, name) => {
                        const val = container[prop];
                        if (typeof val === 'object' && val != null && !Pacem.Utils.isArray(val)) {
                            for (let key of Object.keys(val)) {
                                const fullName = name + '.' + key;
                                // add nested
                                props.push(fullName);
                                // try again (recursively)
                                fnRec(val, key, fullName);
                            }
                        }
                    };
                    let src = this.target;
                    if (!Pacem.Utils.isNull(src)) {
                        let observed = Pacem.CustomElementUtils.getWatchedProperties(src);
                        for (let obs of observed) {
                            let name = obs.name;
                            // add straight
                            props.push(name);
                            // dig nested stuff
                            fnRec(src, name, name);
                        }
                    }
                    this._select.datasource = props.sort();
                }
            };
            __decorate([
                Pacem.ViewChild(Pacem.P + '-select')
            ], PacemPropertyPickerElement.prototype, "_select", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Element })
            ], PacemPropertyPickerElement.prototype, "target", void 0);
            PacemPropertyPickerElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-property-picker', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<${Pacem.P}-select></${Pacem.P}-select>`
                })
            ], PacemPropertyPickerElement);
            Scaffolding.PacemPropertyPickerElement = PacemPropertyPickerElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemRadioListElement = class PacemRadioListElement extends Scaffolding.PacemDataSourceElement {
                constructor() {
                    super();
                    this['key'] = '_' + Pacem.Utils.uniqueCode();
                }
                acceptValue(val) {
                    // no need to implement
                }
                get inputFields() {
                    return [];
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'disabled') {
                        this._disable.model = val;
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._disable.model = this.disabled;
                }
                toggleReadonlyView(readonly) {
                    this._repeater.hidden = readonly;
                    this._span.hidden = !readonly;
                }
                _selectionChanged(evt, index, item) {
                    if (evt.detail.propertyName === 'selected' && evt.detail.currentValue === true) {
                        this._selectedValue = this.mapEntityToValue(this.datasource[index]);
                        this.changeHandler(evt);
                    }
                }
                onChange(evt) {
                    this.value = this._selectedValue;
                    this.databind();
                    return Pacem.Utils.fromResult(this._selectedValue);
                }
            };
            __decorate([
                Pacem.ViewChild(Pacem.P + '-repeater')
            ], PacemRadioListElement.prototype, "_repeater", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-data')
            ], PacemRadioListElement.prototype, "_disable", void 0);
            __decorate([
                Pacem.ViewChild(`span.${Pacem.PCSS}-readonly`)
            ], PacemRadioListElement.prototype, "_span", void 0);
            PacemRadioListElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-radio-list', template: `<${Pacem.P}-repeater datasource="{{ :host.adaptedDatasource }}">
    <ol class="${Pacem.PCSS}-radio-list ${Pacem.PCSS}-viewfinder" pacem>
        <template>
            <li><${Pacem.P}-radio disabled="{{ ::_disable.model || ^item.disabled }}" name="{{ :host.key, once }}" autobind="off" caption="{{ ^item.viewValue }}" value="{{ ^item.value }}" selected="{{ :host.isDataSourceItemSelected(^item, :host.value) }}"
on-focus=":host.focusHandler($event)" on-blur=":host.focusHandler($event)"
on-${Pacem.PropertyChangeEventName}=":host._selectionChanged($event, ^index, ^item)"></${Pacem.P}-radio></li>
        </template>
    </ol>
</${Pacem.P}-repeater><span class="${Pacem.PCSS}-readonly ${Pacem.PCSS}-radio"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></span><${Pacem.P}-data></${Pacem.P}-data><${Pacem.P}-content></${Pacem.P}-content>`,
                    shadow: Pacem.Defaults.USE_SHADOW_ROOT
                })
            ], PacemRadioListElement);
            Scaffolding.PacemRadioListElement = PacemRadioListElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemRadioElement = class PacemRadioElement extends Scaffolding.PacemBaseElement {
                constructor() {
                    super();
                    this._key = '_' + Pacem.Utils.uniqueCode();
                }
                convertValueAttributeToProperty(attr) {
                    return attr;
                }
                toggleReadonlyView(readonly) {
                    this.span.hidden = !readonly;
                    this._radio.hidden = /*this.label.hidden =*/ readonly;
                }
                get inputFields() {
                    return [this._radio];
                }
                onChange(evt) {
                    this.selected = this._radio.checked;
                    const value = this.selected ? this._radio.value : undefined;
                    return Pacem.Utils.fromResult(value);
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._radio.id = this._label.htmlFor = this._key;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'name':
                            this._radio.name = val;
                            break;
                        case 'selected':
                            (this._radio.checked = val) ?
                                Pacem.Utils.addClass(this, Pacem.PCSS + '-selected')
                                :
                                    Pacem.Utils.removeClass(this, Pacem.PCSS + '-selected');
                            break;
                    }
                }
                acceptValue(val) {
                    this._radio.value = Pacem.Utils.isNullOrEmpty(val) ? '' : val;
                }
                getViewValue(val) {
                    if (!Pacem.Utils.isNull(val))
                        return this.caption;
                    return '';
                }
            };
            __decorate([
                Pacem.ViewChild("input[type=radio]")
            ], PacemRadioElement.prototype, "_radio", void 0);
            __decorate([
                Pacem.ViewChild("label")
            ], PacemRadioElement.prototype, "_label", void 0);
            __decorate([
                Pacem.ViewChild(`.${Pacem.PCSS}-readonly`)
            ], PacemRadioElement.prototype, "span", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemRadioElement.prototype, "caption", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemRadioElement.prototype, "selected", void 0);
            PacemRadioElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-radio',
                    template: `<${Pacem.P}-span class="${Pacem.PCSS}-readonly ${Pacem.PCSS}-radio" text="{{ :host.caption }}"></${Pacem.P}-span><input type="radio" class="${Pacem.PCSS}-input" /><label class="${Pacem.PCSS}-label ${Pacem.PCSS}-radio ${Pacem.PCSS}-viewfinder"><${Pacem.P}-text text="{{ :host.caption }}"></${Pacem.P}-text></label>`,
                    shadow: Pacem.Defaults.USE_SHADOW_ROOT
                })
            ], PacemRadioElement);
            Scaffolding.PacemRadioElement = PacemRadioElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemSelectElement = class PacemSelectElement extends Scaffolding.PacemDataSourceElement {
                constructor() {
                    super(...arguments);
                    this.emptyOption = true;
                }
                toggleReadonlyView(readonly) {
                    this._repeater.hidden = readonly;
                    this._span.hidden = !readonly;
                }
                // no actual need to be idem-potent...
                // (take care in future)
                get inputFields() {
                    return [this._select];
                }
                _manageDom(evt) {
                    const args = evt.detail, item = args.item;
                    let option = args.dom.find(o => o instanceof HTMLOptionElement);
                    option.value = item.value;
                    option.textContent = item.viewValue;
                    option.disabled = item.disabled;
                    option.selected = this.isDataSourceItemSelected(item);
                    (Pacem.Utils.isNullOrEmpty(option.value) ? Pacem.Utils.addClass : Pacem.Utils.removeClass).apply(this, [option, Pacem.PCSS + '-watermark']);
                }
                onChange(evt) {
                    let select = this._select, selectedIndex = select.selectedIndex, datasource = this.adaptedDatasource, item = selectedIndex >= 0 && datasource[selectedIndex], value;
                    if (item != null) {
                        value = item.value;
                    }
                    else
                        value = undefined;
                    return Pacem.Utils.fromResult(this.value = value);
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        // case 'required':
                        case 'placeholder':
                        case 'emptyOption':
                            this.databind();
                            break;
                    }
                }
                buildAdaptedDatasource(ds = this.datasource) {
                    let adapted = super.buildAdaptedDatasource(ds);
                    if (adapted && this.emptyOption) {
                        adapted.splice(0, 0, { viewValue: this.placeholder || '', value: '', data: null });
                    }
                    return adapted;
                }
                handleDatasourceMismatch(ds) {
                    if (this.emptyOption) {
                        super.handleDatasourceMismatch(ds);
                    }
                    else {
                        // change value, since it does not exist in database and there's not null/empty fallback...
                        this.value = ds[0].value;
                        // ...you'll re-enter the acceptValue procedure with hopefully more luck.
                    }
                }
                ;
                acceptValue(val) {
                    const ds = this.adaptedDatasource, item = ds && ds.filter(i => this.isDataSourceItemSelected(i, val));
                    //let item = this.datasource && this.datasource.filter(i => this.isItemSelected(i));
                    if (item && item.length == 1)
                        this._select.selectedIndex = ds.indexOf(item[0]);
                    else {
                        this._select.value = undefined;
                        let opts = this._select.options;
                        if (opts.length > 0 && Pacem.Utils.isNullOrEmpty(opts[0].value)) {
                            this._select.selectedIndex = 0;
                        }
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    //select.addEventListener("change", this.changeHandler, false);
                    var options = { capture: false, passive: true };
                    this._select.addEventListener("wheel", this.emitHandler, options);
                }
                disconnectedCallback() {
                    if (!Pacem.Utils.isNull(this._select)) {
                        //select.removeEventListener("change", this.changeHandler, false);
                        var options = { capture: false, passive: true };
                        this._select.removeEventListener("wheel", this.emitHandler, options);
                    }
                    super.disconnectedCallback();
                }
            };
            __decorate([
                Pacem.ViewChild('select')
            ], PacemSelectElement.prototype, "_select", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-repeater')
            ], PacemSelectElement.prototype, "_repeater", void 0);
            __decorate([
                Pacem.ViewChild(`span.${Pacem.PCSS}-readonly`)
            ], PacemSelectElement.prototype, "_span", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemSelectElement.prototype, "emptyOption", void 0);
            PacemSelectElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-select', template: `<${Pacem.P}-repeater datasource="{{ :host.adaptedDatasource }}" on-${Components.RepeaterItemCreateEventName}=":host._manageDom($event)">
    <select class="${Pacem.PCSS}-select ${Pacem.PCSS}-viewfinder">
        <template>
            <option></option>
        </template>
    </select>
</${Pacem.P}-repeater><span class="${Pacem.PCSS}-readonly"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></span><${Pacem.P}-content></${Pacem.P}-content>`, shadow: Pacem.Defaults.USE_SHADOW_ROOT
                })
            ], PacemSelectElement);
            Scaffolding.PacemSelectElement = PacemSelectElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="input.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemSliderElement = class PacemSliderElement extends Scaffolding.PacemBaseElement {
                constructor() {
                    super(...arguments);
                    this.inputFields = [];
                    this._dragHandler = (evt) => {
                        evt.preventDefault();
                        this._computeAndAssignValue(evt.detail.currentPosition.x, this.changePolicy !== 'end');
                    };
                    this._endHandler = (evt) => {
                        evt.preventDefault();
                        this._computeAndAssignValue(evt.detail.currentPosition.x, this.changePolicy === 'end');
                    };
                    this._startHandler = (evt) => {
                        this._thumb.focus();
                    };
                    this._downHandler = (evt) => {
                        const x = evt instanceof MouseEvent ? evt.clientX : evt.touches && evt.touches.length && evt.touches[0].clientX, trackSize = this._trackSize;
                        if (!Pacem.Utils.isNullOrEmpty(trackSize)) {
                            this._computeAndAssignValue(x, true);
                        }
                    };
                    this._keydownHandler = (evt) => {
                        switch (evt.keyCode) {
                            case 39: // right
                            case 37: // left
                                Pacem.avoidHandler(evt);
                                let forward = evt.keyCode === 39; // TODO: include rtl!
                                let step = (typeof this.step !== 'number' ? 1.0 : this.step) * (forward ? 1 : -1);
                                let cease = false;
                                let ceaseFn = (evt) => {
                                    cease = true;
                                    window.removeEventListener('keyup', ceaseFn, false);
                                    Pacem.Utils.removeClass(this, 'slider-keydown');
                                };
                                window.addEventListener('keyup', ceaseFn, false);
                                Pacem.Utils.addClass(this, 'slider-keydown');
                                Pacem.Utils.accelerateCallback(token => {
                                    if (!(token.cancel = cease)) {
                                        this._setValue(this.value + step);
                                    }
                                });
                                break;
                        }
                    };
                }
                onChange(evt) {
                    return new Promise((resolve, reject) => {
                        if (evt.type === 'slide') {
                            resolve(this.value = evt.detail);
                        }
                        resolve(this.value);
                    });
                }
                _draw(val = this.value) {
                    const trackSize = this._trackSize;
                    if (Pacem.Utils.isNull(trackSize)) {
                        return;
                    }
                    let v = parseFloat(val) || this.min;
                    let percentage = Math.min(1, Math.max(0, (v - this.min) / (this.max - this.min)));
                    this._progress.style.transform = `scale(${(percentage)}, 1)`;
                    this._thumb.style.transform = `translateX(${Math.round(percentage * trackSize.width)}px)`;
                }
                _format(v) {
                    const intl = this.format;
                    if (!Pacem.Utils.isNullOrEmpty(intl)) {
                        return new Intl.NumberFormat(Pacem.Utils.lang(this), intl).format(v);
                    }
                    // fallback
                    let sv = '-';
                    if (!Pacem.Utils.isNull(v)) {
                        sv = v.toLocaleString();
                    }
                    let evt = new CustomEvent("formatvalue", { detail: { value: v } });
                    this.dispatchEvent(evt);
                    return Pacem.Utils.isNull(evt.detail.output) ? sv : evt.detail.output;
                }
                acceptValue(val) {
                    this._draw(val);
                }
                getViewValue(value) {
                    return this._format(value);
                }
                convertValueAttributeToProperty(attr) {
                    return parseFloat(attr);
                }
                toggleReadonlyView(readonly) {
                    this._thumb.hidden = readonly;
                }
                _setTrackSize(evt) {
                    const size = evt.detail;
                    this._trackSize = { x: size.left, y: size.top, width: size.width, height: size.height };
                    this._draw(this.value);
                }
                _computeAndAssignValue(x, triggerChange) {
                    // constraint to track size to compute the slider value
                    const constraint = this._trackSize, step = this.step;
                    let perc = (x - constraint.x) / constraint.width;
                    let v = (this.max - this.min) * perc + this.min;
                    if (typeof step === 'number') {
                        v = Math.round(v / step) * step;
                    }
                    if (triggerChange) {
                        this._setValue(v);
                    }
                    else {
                        this._draw(v);
                    }
                }
                _setValue(v) {
                    v = Math.min(this.max, Math.max(this.min, v));
                    this.changeHandler(new CustomEvent('slide', { detail: v }));
                }
                connectedCallback() {
                    super.connectedCallback();
                    this.addEventListener('mousedown', this._downHandler, false);
                    this.addEventListener('touchstart', this._downHandler, false);
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._dragger.addEventListener(Pacem.UI.DragDropEventType.Init, this._startHandler, false);
                    this._dragger.addEventListener(Pacem.UI.DragDropEventType.Drag, this._dragHandler, false);
                    this._dragger.addEventListener(Pacem.UI.DragDropEventType.End, this._endHandler, false);
                    this._thumb.addEventListener('keydown', this._keydownHandler, false);
                    this._min.text = this._format(this.min);
                    this._max.text = this._format(this.max);
                    // balloon
                    const balloon = this._shellProxy.dom[0];
                    balloon.target = this._thumb;
                    balloon.options = {
                        trigger: Components.UI.BalloonTrigger.Focus,
                        trackPosition: true,
                        position: Components.UI.BalloonPosition.Top,
                        align: Components.UI.BalloonAlignment.Center,
                        behavior: Components.UI.BalloonBehavior.Tooltip,
                        hoverDelay: 0, hoverTimeout: 0
                    };
                    balloon.disabled = !this.thumbLabel;
                    //
                    this._thumb.tabIndex = 0;
                }
                disconnectedCallback() {
                    this.removeEventListener('mousedown', this._downHandler, false);
                    this.removeEventListener('touchstart', this._downHandler, false);
                    if (!Pacem.Utils.isNull(this._dragger)) {
                        this._dragger.removeEventListener(Pacem.UI.DragDropEventType.End, this._endHandler, false);
                        this._dragger.removeEventListener(Pacem.UI.DragDropEventType.Drag, this._dragHandler, false);
                        this._dragger.removeEventListener(Pacem.UI.DragDropEventType.Init, this._startHandler, false);
                    }
                    if (!Pacem.Utils.isNull(this._thumb)) {
                        this._thumb.removeEventListener('keydown', this._keydownHandler, false);
                    }
                    super.disconnectedCallback();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (first) {
                        return;
                    }
                    switch (name) {
                        case 'thumbLabel':
                            (val ? Pacem.Utils.addClass : Pacem.Utils.removeClass).apply(this, [this, 'slider-thumblabel']);
                            const balloon = this._shellProxy.dom[0];
                            balloon.disabled = !val;
                            break;
                        case 'min':
                        case 'max':
                            if (!Pacem.Utils.isNull(this._max) && !Pacem.Utils.isNull(this._min)) {
                                this._min.text = this._format(this.min);
                                this._max.text = this._format(this.max);
                            }
                            this._setValue(this.value);
                            this._draw();
                            break;
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemSliderElement.prototype, "min", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemSliderElement.prototype, "max", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemSliderElement.prototype, "thumbLabel", void 0);
            __decorate([
                Pacem.Watch({
                    emit: false, converter: {
                        convert: (attr) => {
                            let v = parseFloat(attr);
                            if (isNaN(v)) {
                                return 'any';
                            }
                            return v;
                        }, convertBack: (v) => (v || '').toString()
                    }
                })
            ], PacemSliderElement.prototype, "step", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemSliderElement.prototype, "changePolicy", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemSliderElement.prototype, "format", void 0);
            __decorate([
                Pacem.ViewChild(`.slider-track`)
            ], PacemSliderElement.prototype, "_track", void 0);
            __decorate([
                Pacem.ViewChild(`.slider-progress`)
            ], PacemSliderElement.prototype, "_progress", void 0);
            __decorate([
                Pacem.ViewChild(`.slider-thumb`)
            ], PacemSliderElement.prototype, "_thumb", void 0);
            __decorate([
                Pacem.ViewChild(`${Pacem.P}-text[min]`)
            ], PacemSliderElement.prototype, "_min", void 0);
            __decorate([
                Pacem.ViewChild(`${Pacem.P}-text[max]`)
            ], PacemSliderElement.prototype, "_max", void 0);
            __decorate([
                Pacem.ViewChild(`${Pacem.P}-drag-drop`)
            ], PacemSliderElement.prototype, "_dragger", void 0);
            __decorate([
                Pacem.ViewChild(`${Pacem.P}-shell-proxy`)
            ], PacemSliderElement.prototype, "_shellProxy", void 0);
            PacemSliderElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-slider',
                    template: `<${Pacem.P}-text text="{{ :host._format(:host.min) }}" min></${Pacem.P}-text>
    <div class="slider-track"><div class="slider-progress"></div></div>
    <${Pacem.P}-panel class="${Pacem.PCSS}-clickable slider-thumb" behaviors="{{ [::_dragger] }}">
        <div class="thumb-label"></div>
    </${Pacem.P}-panel>
    <${Pacem.P}-text text="{{ :host._format(:host.max) }}" max></${Pacem.P}-text>
    <div class="slider-footer"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></div>
<${Pacem.P}-drag-drop lock-timeout="0"></${Pacem.P}-drag-drop><${Pacem.P}-resize watch-position="true" on-${Components.ResizeEventName}=":host._setTrackSize($event)" target="{{ ::_track }}"></${Pacem.P}-resize>
<${Pacem.P}-shell-proxy><${Pacem.P}-balloon class="text-center"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></${Pacem.P}-balloon></${Pacem.P}-shell-proxy>
`,
                    shadow: Pacem.Defaults.USE_SHADOW_ROOT
                })
            ], PacemSliderElement);
            Scaffolding.PacemSliderElement = PacemSliderElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            var _PacemSuggestElement_selecting;
            class SuggestionSelectEvent extends Pacem.CustomTypedEvent {
                constructor(value) {
                    super('suggestionselect', { selectedValue: value });
                }
            }
            let PacemSuggestElement = class PacemSuggestElement extends Scaffolding.PacemDataSourceElement {
                constructor() {
                    super(...arguments);
                    this._toggleBtnHandler = (evt) => {
                        evt.preventDefault();
                        if (!this.disabled) {
                            this._balloon.toggle();
                        }
                    };
                    this._clearBtnHandler = (evt) => {
                        evt.preventDefault();
                        this._lockSelection();
                        this.value = void 0;
                        this._unlockSelection();
                        if (!this.preventFocus) {
                            this._input.focus();
                        }
                        this.popup();
                    };
                    _PacemSuggestElement_selecting.set(this, void 0);
                    this._balloonPopupHandler = (evt) => {
                        Pacem.Utils.addClass(this._btnArrow, 'rotate-180');
                    };
                    this._balloonPopoutHandler = (evt) => {
                        Pacem.Utils.removeClass(this._btnArrow, 'rotate-180');
                    };
                    this._focusHandler = (evt) => {
                        if (this.preventFocus) {
                            // manage the balloon toggle manually (since focus won't be dispatched)
                            evt.preventDefault();
                            const balloon = this._balloon;
                            if (!balloon.visible) {
                                this.popup();
                            }
                            else {
                                this.popout();
                            }
                        }
                        const actualHint = (this._downOn = this._input).value;
                        if (this.viewValue != actualHint) {
                            this.hint = actualHint;
                        }
                        // now just lean on the balloon's trigger, it will popup eventually...
                    };
                    this._keyupHandler = (evt) => {
                        if (evt.target !== this._downOn) {
                            Pacem.avoidHandler(evt);
                        }
                        else if /* TODO: check this clause against TAB navigation */ (this._isTyping()) {
                            this.hint = this._input.value;
                            this.changeHandler(new SuggestionSelectEvent(null));
                        }
                    };
                    this._keydownHandler = (evt) => {
                        this._downOn = evt.target;
                        var el;
                        switch (evt.keyCode) {
                            case 40: /*arrow down*/
                            case 9: /*tab*/
                            case 13: /* enter */
                                if (this._balloon.visible === true && !Pacem.Utils.isNull(el = this._repeater.querySelector('ol > li'))) {
                                    while (!Pacem.Utils.isNull(el) && el.dataset['pacemDisabled'] === 'true' && el.localName === 'li') {
                                        el = el.nextElementSibling;
                                    }
                                    Pacem.avoidHandler(evt);
                                    if (!Pacem.Utils.isNull(el)) {
                                        this._focus(el);
                                    }
                                }
                                break;
                        }
                    };
                    this._selectHandler = (evt) => {
                        const _this = this;
                        var fn = function (e) {
                            Pacem.avoidHandler(e);
                            const el = e.currentTarget, value = JSON.parse(el.dataset['pacemValue']), disabled = el.dataset['pacemDisabled'] === 'true';
                            if (!disabled) {
                                _this._lockSelection();
                                _this.changeHandler(new SuggestionSelectEvent(value));
                            }
                        };
                        if ((evt instanceof KeyboardEvent && (evt.keyCode === 9 /*tab*/
                            || evt.keyCode === 13 /*enter*/
                            || evt.keyCode === 32 /*space-bar*/))
                            || evt.type === 'mousedown') {
                            fn.apply(this, [evt]);
                        }
                        else if (evt instanceof KeyboardEvent) {
                            this._downOn = evt.target;
                            var li = evt.target, target = li;
                            switch (evt.keyCode) {
                                case 38 /*arrow up*/:
                                    do {
                                        target = target.previousElementSibling;
                                    } while (!Pacem.Utils.isNull(target) && target.dataset['pacemDisabled'] === 'true');
                                    target = target || this._input;
                                    Pacem.avoidHandler(evt);
                                    break;
                                case 40 /*arrow down*/:
                                    do {
                                        target = (target.nextElementSibling);
                                    } while (!Pacem.Utils.isNull(target) && target.localName === 'li' && target.dataset['pacemDisabled'] === 'true');
                                    target = target || li;
                                    Pacem.avoidHandler(evt);
                                    break;
                                case 27 /*esc*/:
                                    this.popout();
                                    Pacem.avoidHandler(evt);
                                    break;
                            }
                            this._focus(target);
                        }
                    };
                    this._afterSelectHandler = (evt) => {
                        // keyup event
                        if (evt.keyCode === 9 /*tab*/
                            || evt.keyCode === 13 /*enter*/
                            || evt.keyCode === 32 /*space-bar*/) {
                            Pacem.avoidHandler(evt);
                        }
                    };
                }
                get inputFields() {
                    return [this._input];
                }
                acceptValue(val) {
                    if (!this._isTyping()
                        && (this.allowNew || !Pacem.Utils.isNullOrEmpty(this.datasource))) {
                        this.hint = '';
                        this._input.value = this.getViewValue(val) || '';
                    }
                }
                getViewValue(val) {
                    var superValue = super.getViewValue(val);
                    if (Pacem.Utils.isNullOrEmpty(superValue) && this.allowNew && !Pacem.Utils.isNullOrEmpty(val)) {
                        superValue = this.mapEntityToViewValue(val);
                    }
                    return superValue;
                }
                onChange(evt) {
                    return new Promise((resolve, reject) => {
                        // change triggered elsewhere... (see _afterSelectHandler)
                        if (evt.type === 'suggestionselect') {
                            const val = evt.detail.selectedValue;
                            this.value = val;
                            if (val) {
                                this.popout();
                            }
                            resolve(val);
                            this._unlockSelection();
                        }
                        else {
                            // keep the current value
                            resolve(this.value);
                        }
                    });
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._setDropdownMode();
                    this._setupItemTemplate();
                    var balloon = this._createBalloon();
                    balloon.appendChild(this._repeater);
                    this._checkBalloon(balloon);
                    const shell = Pacem.CustomElementUtils.findAncestorShell(this);
                    shell.appendChild(balloon);
                    this._balloon = balloon;
                    this._input.addEventListener('mousedown', this._focusHandler, false);
                    this._input.addEventListener('keydown', this._keydownHandler, false);
                    this._input.addEventListener('keyup', this._keyupHandler, false);
                    this._input.addEventListener('focus', this._focusHandler, false);
                    this._btnClear.addEventListener('mousedown', this._clearBtnHandler, false);
                    this._btnArrow.addEventListener('mousedown', this._toggleBtnHandler, false);
                    this._databind();
                    this._syncButtons();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (Pacem.Utils.isNull(this._balloon)) {
                        return;
                    }
                    const typing = this._isTyping();
                    switch (name) {
                        case 'adaptedDatasource':
                            if (!Pacem.Utils.isNullOrEmpty(val)) {
                                if (!typing) {
                                    this._input.value = this.getViewValue(this.value);
                                }
                                else {
                                    this.popup();
                                }
                            }
                            else {
                                this.popout();
                            }
                            break;
                        case 'hint':
                            if (!typing) {
                                this._input.value = val;
                            }
                            break;
                        case 'disabled':
                        case 'value':
                        case 'readonly':
                            this._checkBalloon();
                            break;
                        case 'itemtemplate':
                            if (!first) {
                                this._setupItemTemplate();
                            }
                            break;
                        case 'allowTyping':
                            if (!first) {
                                this._setDropdownMode();
                            }
                            break;
                    }
                    if (['adaptedDatasource', 'hint', 'value'].indexOf(name) >= 0) {
                        this._databind();
                    }
                    if (['allowTyping', 'value', 'hint'].indexOf(name) >= 0) {
                        this._syncButtons();
                    }
                }
                disconnectedCallback() {
                    if (!Pacem.Utils.isNull(this._balloon)) {
                        this._balloon.removeEventListener('popup', this._balloonPopupHandler, false);
                        this._balloon.removeEventListener('popout', this._balloonPopoutHandler, false);
                        this._balloon.remove();
                    }
                    if (!Pacem.Utils.isNull(this._input)) {
                        this._input.removeEventListener('mousedown', this._focusHandler, false);
                        this._input.removeEventListener('focus', this._focusHandler, false);
                        this._input.removeEventListener('keydown', this._keydownHandler, false);
                        this._input.removeEventListener('keyup', this._keyupHandler, false);
                    }
                    if (!Pacem.Utils.isNull(this._btnClear)) {
                        this._btnClear.removeEventListener('mousedown', this._clearBtnHandler, false);
                    }
                    if (!Pacem.Utils.isNull(this._btnArrow)) {
                        this._btnArrow.addEventListener('mousedown', this._toggleBtnHandler, false);
                    }
                    super.disconnectedCallback();
                }
                _databind() {
                    if (!Pacem.Utils.isNull(this._repeater)) {
                        this._repeater.datasource = this._filter(this.adaptedDatasource, this.hint, this.value);
                    }
                }
                _syncButtons() {
                    if (!Pacem.Utils.isNull(this._btnArrow)) {
                        // hide="{{ !$pacem.isNullOrEmpty(:host.hint || :host.value) || :host.allowTyping !== false }}"
                        this._btnArrow.hide = this.allowTyping !== false || !Pacem.Utils.isNullOrEmpty(this.hint || this.value);
                    }
                    if (!Pacem.Utils.isNull(this._btnClear)) {
                        //  hide="{{ $pacem.isNullOrEmpty(:host.hint || :host.value) }}"
                        this._btnClear.hide = Pacem.Utils.isNullOrEmpty(this.hint || this.value);
                    }
                }
                _isTyping() {
                    return !__classPrivateFieldGet(this, _PacemSuggestElement_selecting, "f") && Pacem.Utils.is(this._input, ':focus'); // && this.viewValue !== this._input.value;
                }
                _lockSelection(unlock = false) {
                    __classPrivateFieldSet(this, _PacemSuggestElement_selecting, !unlock, "f");
                    this._checkBalloon();
                }
                _unlockSelection() {
                    this._lockSelection(true);
                }
                _setDropdownMode(allowTyping = this.allowTyping) {
                    const dropdown = !(allowTyping !== null && allowTyping !== void 0 ? allowTyping : true);
                    this._input.readOnly = dropdown;
                }
                _setupItemTemplate() {
                    if (this.itemtemplate instanceof HTMLTemplateElement) {
                        const frag = this.itemtemplate.cloneNode(true).content;
                        const tmpl = document.createElement('template');
                        const li = document.createElement('li');
                        li.append(frag);
                        tmpl.content.appendChild(li);
                        this._tmplProxy.target = tmpl;
                    }
                    else {
                        this._tmplProxy.target = this._defaultTemplate;
                    }
                }
                _focus(el) {
                    if (Pacem.Utils.isNull(el) || this.preventFocus) {
                        return;
                    }
                    el.focus();
                    el.dispatchEvent(new Event('focus', { bubbles: true }));
                }
                _filter(ds, hint, value = this.value) {
                    let datasource = ds || [];
                    //if (!Utils.isNull(value)) {
                    //    datasource = datasource.filter(i => i.value == value);
                    //} else 
                    if (!Pacem.Utils.isNullOrEmpty(hint && hint.trim())) {
                        const lowerHints = hint.toLowerCase().split(' ');
                        let filtered = datasource.filter(i => {
                            for (let lowerHint of lowerHints) {
                                if (i.viewValue.toLowerCase().indexOf(lowerHint) >= 0) {
                                    return true;
                                }
                                // check the whole 'data' object, just in case
                                const filters = this.filterFields;
                                if (!Pacem.Utils.isNullOrEmpty(filters)) {
                                    const iData = i.data;
                                    if (typeof iData === 'object' && !Pacem.Utils.isNullOrEmpty(iData)) {
                                        for (let prop in iData) {
                                            if (filters.indexOf(prop) === -1) {
                                                continue;
                                            }
                                            const iPropValue = iData[prop];
                                            if (Pacem.Utils.isNullOrEmpty(iPropValue)) {
                                                continue;
                                            }
                                            if (iPropValue.toString().toLowerCase().indexOf(lowerHint) >= 0) {
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                            return false;
                        });
                        const concatenate = this.allowNew
                            // only concatenate on plain strings...
                            && Pacem.Utils.isNullOrEmpty(this.valueProperty)
                            && Pacem.Utils.isNullOrEmpty(this.textProperty)
                            // ...and no matches are available
                            && (Pacem.Utils.isNullOrEmpty(filtered) || Pacem.Utils.isNull(filtered.find(i => i.viewValue === hint)));
                        datasource = concatenate ? [{ value: hint, viewValue: hint, data: hint }].concat(filtered) : filtered;
                    }
                    let retval = datasource;
                    if (this.allowTyping !== false) {
                        // max-suggestions enabled only when typing is allowed (default)
                        retval = datasource.slice(0, this.maxSuggestions || 10);
                    }
                    //
                    if (this._isTyping()) {
                        this.popup();
                    }
                    this._balloon.style.opacity = Pacem.Utils.isNullOrEmpty(retval) ? '0' : '';
                    this.log(Pacem.Logging.LogLevel.Log, `${retval.length} dropdown suggestion(s), given hint '${hint}' and ${(ds || []).length} datasource items`);
                    return retval;
                }
                _itemCreate(evt) {
                    const li = evt.detail.dom.find(i => i instanceof HTMLLIElement);
                    const item = evt.detail.item;
                    const index = evt.detail.index;
                    const disabled = item.disabled === true;
                    li.tabIndex = disabled ? -1 : 0;
                    li.dataset['pacemValue'] = JSON.stringify(item.value);
                    li.dataset['pacemViewValue'] = JSON.stringify(item.viewValue);
                    li.dataset['pacemDisabled'] = disabled.toString();
                    li.addEventListener('keydown', this._selectHandler, false);
                    li.addEventListener('keyup', this._afterSelectHandler, false);
                    li.addEventListener('mousedown', this._selectHandler, false);
                }
                _itemRemove(evt) {
                    const li = evt.detail.dom.find(i => i instanceof HTMLLIElement);
                    li.removeEventListener('keydown', this._selectHandler, false);
                    li.removeEventListener('keyup', this._afterSelectHandler, false);
                    li.removeEventListener('mousedown', this._selectHandler, false);
                }
                toggleReadonlyView(readonly) {
                    this.span.hidden = !readonly;
                    this._input.hidden = readonly;
                    if (readonly) {
                        this._btnClear.hide = this._btnArrow.hide = true;
                    }
                    else {
                        this._syncButtons();
                    }
                }
                /*
                Balloon and repeater
                */
                popup() {
                    var _a;
                    if (!Pacem.Utils.isNullOrEmpty(this.adaptedDatasource)) {
                        (_a = this._balloon) === null || _a === void 0 ? void 0 : _a.popup();
                    }
                }
                popout() {
                    var _a;
                    (_a = this._balloon) === null || _a === void 0 ? void 0 : _a.popout();
                }
                _checkBalloon(balloon = this._balloon) {
                    if (!Pacem.Utils.isNull(balloon)) {
                        const hasValue = !Pacem.Utils.isNullOrEmpty(this.value) && !Pacem.Utils.isNullOrEmpty(this._input.value) && Pacem.Utils.isNullOrEmpty(this.hint);
                        balloon.disabled = __classPrivateFieldGet(this, _PacemSuggestElement_selecting, "f") || hasValue || this.readonly || this.disabled || /* normalize to an actual boolean */ false; // || Pacem.Utils.isNullOrEmpty(this.adaptedDatasource);
                    }
                }
                _createBalloon() {
                    /*<${ P }-balloon target="{{ ::_input }}" options="{ position: 'bottom', align: 'left', behavior: 'inert', hoverDelay: 0 }"
        disabled="{{ :host.readonly || Pacem.Utils.isNullOrEmpty(:host.adaptedDatasource) }}">*/
                    const balloon = document.createElement(Pacem.P + '-balloon');
                    Pacem.Utils.addClass(balloon, 'suggest dropdown');
                    balloon.options = {
                        trackPosition: true,
                        trigger: Components.UI.BalloonTrigger.Focus,
                        position: Components.UI.BalloonPosition.VerticalAuto,
                        size: Components.UI.BalloonSizing.Match,
                        align: Components.UI.BalloonAlignment.Start,
                        behavior: Components.UI.BalloonBehavior.Menu,
                        hoverDelay: 0, hoverTimeout: 0
                    };
                    balloon.addEventListener('popup', this._balloonPopupHandler, false);
                    balloon.addEventListener('popout', this._balloonPopoutHandler, false);
                    balloon.target = this._input;
                    return balloon;
                }
            };
            _PacemSuggestElement_selecting = new WeakMap();
            __decorate([
                Pacem.ViewChild('input[type=text]')
            ], PacemSuggestElement.prototype, "_input", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-repeater')
            ], PacemSuggestElement.prototype, "_repeater", void 0);
            __decorate([
                Pacem.ViewChild(`span.${Pacem.PCSS}-readonly`)
            ], PacemSuggestElement.prototype, "span", void 0);
            __decorate([
                Pacem.ViewChild(`template`)
            ], PacemSuggestElement.prototype, "_defaultTemplate", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-template-proxy')
            ], PacemSuggestElement.prototype, "_tmplProxy", void 0);
            __decorate([
                Pacem.ViewChild(`${Pacem.P}-button[toggle]`)
            ], PacemSuggestElement.prototype, "_btnArrow", void 0);
            __decorate([
                Pacem.ViewChild(`${Pacem.P}-button[clear]`)
            ], PacemSuggestElement.prototype, "_btnClear", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemSuggestElement.prototype, "hint", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemSuggestElement.prototype, "maxSuggestions", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemSuggestElement.prototype, "allowTyping", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemSuggestElement.prototype, "preventFocus", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Element })
            ], PacemSuggestElement.prototype, "itemtemplate", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.StringArray })
            ], PacemSuggestElement.prototype, "filterFields", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemSuggestElement.prototype, "allowNew", void 0);
            PacemSuggestElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-suggest', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<div class="${Pacem.PCSS}-relative"><input type="text" class="${Pacem.PCSS}-input" />
<${Pacem.P}-button clear
class="button-flat ${Pacem.PCSS}-anim anim-pop anim-sudden anim-quick pos-absolute absolute-right absolute-top display-block ${Pacem.PCSS}-margin margin-0" 
    icon-glyph="highlight_off"></${Pacem.P}-button>
<${Pacem.P}-button 
class="button-flat icon-rotate ${Pacem.PCSS}-anim anim-pop anim-sudden anim-quick pos-absolute absolute-right absolute-top display-block ${Pacem.PCSS}-margin margin-0" 
    icon-glyph="arrow_drop_down" toggle></${Pacem.P}-button>
</div>
<span class="${Pacem.PCSS}-readonly"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></span>
<${Pacem.P}-repeater on-${Components.RepeaterItemCreateEventName}=":host._itemCreate($event)" on-${Components.RepeaterItemRemoveEventName}=":host._itemRemove($event)">
    <ol>
        <${Pacem.P}-template-proxy></${Pacem.P}-template-proxy>
    </ol>
</${Pacem.P}-repeater><${Pacem.P}-content></${Pacem.P}-content>
<template>
    <li><${Pacem.P}-span content="{{ $pacem.highlight(^item.viewValue, ::_input.value) }}"></${Pacem.P}-span></li>
</template>`
                })
            ], PacemSuggestElement);
            Scaffolding.PacemSuggestElement = PacemSuggestElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            class TagRemoveEvent extends Pacem.CustomTypedEvent {
                constructor(value) {
                    super('tagremove', { index: value });
                }
            }
            class TagAddEvent extends Pacem.CustomTypedEvent {
                constructor(value) {
                    super('tagadd', { value: value });
                }
            }
            let PacemTagElement = class PacemTagElement extends Components.PacemElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'readonly':
                            let readonly = !!val;
                            (readonly ? Pacem.Utils.addClass : Pacem.Utils.removeClass)(this, 'tag-readonly');
                            this._btn.disabled = this._btn.hide = readonly;
                            break;
                        case 'tag':
                            Pacem.Utils.removeClass(this, 'tag-out');
                            break;
                    }
                }
                _remove() {
                    const tag = this;
                    Pacem.Utils.addClass(tag, 'tag-out');
                    Pacem.Utils.addAnimationEndCallback(tag, () => {
                        this.dispatchEvent(new Event("remove"));
                    });
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemTagElement.prototype, "tag", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemTagElement.prototype, "readonly", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-button')
            ], PacemTagElement.prototype, "_btn", void 0);
            PacemTagElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-tag', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<${Pacem.P}-text text="{{ :host.tag }}"></${Pacem.P}-text>
                <${Pacem.P}-button on-click=":host._remove()"></${Pacem.P}-button>`
                })
            ], PacemTagElement);
            Scaffolding.PacemTagElement = PacemTagElement;
            let PacemTagsElement = class PacemTagsElement extends Scaffolding.PacemDataSourceElement {
                constructor() {
                    super(true);
                    this.inputFields = [];
                }
                toggleReadonlyView(readonly) {
                    this._suggest.readonly = readonly;
                    this.querySelector('.tag-new').hidden = readonly;
                }
                _tagRemove(ndx) {
                    this.changeHandler(new TagRemoveEvent(ndx));
                }
                _tagAdd(v) {
                    this.changeHandler(new TagAddEvent(v));
                    // after the - just in case - assignment => reset the suggest component
                }
                handleDatasourceMismatch() {
                    // do nothing!
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'datasource':
                        case 'textProperty':
                            this._suggest[name] = val;
                            break;
                        case 'valueProperty':
                            // DON't pass the value-property to the suggest
                            if (!Pacem.Utils.isNullOrEmpty(val)) {
                                throw `Cannot set 'valueProperty' on ${this.constructor.name}s.`;
                            }
                            break;
                        case 'value':
                            this._tags.datasource = val;
                            break;
                    }
                }
                onChange(evt) {
                    return new Promise((resolve, reject) => {
                        switch (evt.type) {
                            case 'tagremove':
                                this._justAddedIndex = -1;
                                const trev = evt, ndxrev = trev.detail.index, 
                                // manipulate a copy of the array (to preserve the originalValue)
                                valrev = Pacem.Utils.clone(this.value);
                                const trunk2 = valrev.splice(ndxrev + 1), trunk1 = valrev.splice(0, ndxrev);
                                resolve(this.value = trunk1.concat(trunk2));
                                break;
                            case 'tagadd':
                                const value = evt.detail.value, 
                                // manipulate a copy of the array (to preserve the originalValue)
                                valadd = Pacem.Utils.clone(this.value);
                                if ( // no empty items
                                !Pacem.Utils.isNullOrEmpty(value)
                                    // no duplicated items
                                    && (this.allowDuplicates || Pacem.Utils.isNullOrEmpty(valadd && valadd.find(i => this.mapEntityToViewValue(i) == this.mapEntityToViewValue(value))))) {
                                    let newvalue = (valadd || []).concat([value]);
                                    resolve(this.value = newvalue);
                                    this._justAddedIndex = this.value.length - 1;
                                    setTimeout(() => {
                                        this._suggest.focus();
                                    }, 250);
                                    // this will allow to accept the hint change...
                                    this._suggest.blur();
                                    this._suggest.hint = '';
                                    this._suggest.reset();
                                }
                                break;
                            default:
                                resolve(this.value);
                                break;
                        }
                    });
                }
                acceptValue(val) {
                    // no need to implement
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemTagsElement.prototype, "hint", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemTagsElement.prototype, "allowDuplicates", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemTagsElement.prototype, "allowNew", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Number })
            ], PacemTagsElement.prototype, "_justAddedIndex", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-suggest')
            ], PacemTagsElement.prototype, "_suggest", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-repeater.' + Pacem.PCSS + '-tags')
            ], PacemTagsElement.prototype, "_tags", void 0);
            PacemTagsElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-tags', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<${Pacem.P}-repeater class="${Pacem.PCSS}-tags">
    <ul class="${Pacem.PCSS}-tags ${Pacem.PCSS}-viewfinder ${Pacem.PCSS}-list list-unstyled list-inline">
        <template>
            <li class="${Pacem.PCSS}-tag">
                <${Pacem.P}-tag on-remove=":host._tagRemove(^index)" css-class="{{ { 'tag-in': :host._justAddedIndex === ^index } }}" tag="{{ :host.mapEntityToViewValue(^item) }}" readonly="{{ :host.readonly }}"></${Pacem.P}-tag>
            </li>
        </template>
        <li class="tag-new">
            <${Pacem.P}-suggest logger="{{ :host.logger }}" placeholder="{{ :host.placeholder }}" allow-new="{{ :host.allowNew }}" class="${Pacem.PCSS}-tags" on-change=":host._tagAdd($this.value)" hint="{{ :host.hint, twoway }}">
                <${Pacem.P}-content></${Pacem.P}-content>
            </${Pacem.P}-suggest>
        </li>
    </ul>
</${Pacem.P}-repeater>`
                })
            ], PacemTagsElement);
            Scaffolding.PacemTagsElement = PacemTagsElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="char-counter.ts" />
/// <reference path="input.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemMarkdownTextAreaElement = class PacemMarkdownTextAreaElement extends Scaffolding.PacemTextualInputElement {
                constructor(_md = new Pacem.MarkdownService()) {
                    super();
                    this._md = _md;
                    this.rows = 5;
                    this.cols = 50;
                    this._keydownHandler = (evt) => {
                        if (evt.keyCode === 9 /* tab */) {
                            const input = this.input, value = input.value;
                            var ndx = input.selectionStart;
                            input.value = value.substr(0, ndx) + '    ' + value.substr(ndx);
                            Pacem.preventDefaultHandler(evt);
                        }
                    };
                }
                toggleReadonlyView(readonly) {
                    this.input.hidden = readonly;
                }
                /** @override */
                get preventKeyboardSubmit() {
                    return true;
                }
                get inputFields() {
                    return [this.input];
                }
                getViewValue(val) {
                    return this._md.toHtml(val);
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'rows'
                        || name === 'cols') {
                        this.inputField.setAttribute(name, val);
                    }
                    else if (name == 'viewValue') {
                        this._markdown.innerHTML = val;
                    }
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this.input.addEventListener("keydown", this._keydownHandler, false);
                }
                disconnectedCallback() {
                    this.input &&
                        this.input.removeEventListener("keydown", this._keydownHandler, false);
                    super.disconnectedCallback();
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemMarkdownTextAreaElement.prototype, "rows", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemMarkdownTextAreaElement.prototype, "cols", void 0);
            __decorate([
                Pacem.ViewChild('textarea')
            ], PacemMarkdownTextAreaElement.prototype, "input", void 0);
            __decorate([
                Pacem.ViewChild(`div.${Pacem.PCSS}-readonly`)
            ], PacemMarkdownTextAreaElement.prototype, "_markdown", void 0);
            PacemMarkdownTextAreaElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-textarea-markdown', template: `<textarea class="${Pacem.PCSS}-input" pacem></textarea>${Scaffolding.CHAR_COUNTER_CHILD}<div class="${Pacem.PCSS}-readonly ${Pacem.PCSS}-markdown"></div>`, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemMarkdownTextAreaElement);
            Scaffolding.PacemMarkdownTextAreaElement = PacemMarkdownTextAreaElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="input.ts" />
/// <reference path="char-counter.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemTextAreaElement = class PacemTextAreaElement extends Scaffolding.PacemTextualInputElement {
                constructor() {
                    super(...arguments);
                    this.rows = 5;
                    this.cols = 50;
                }
                /** @override */
                get preventKeyboardSubmit() {
                    return true;
                }
                toggleReadonlyView(readonly) {
                    this._span.hidden = !readonly;
                    this._input.hidden = readonly;
                }
                get inputFields() {
                    return [this._input];
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'rows'
                        || name === 'cols') {
                        this.inputField.setAttribute(name, val);
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemTextAreaElement.prototype, "rows", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemTextAreaElement.prototype, "cols", void 0);
            __decorate([
                Pacem.ViewChild('textarea')
            ], PacemTextAreaElement.prototype, "_input", void 0);
            __decorate([
                Pacem.ViewChild(`span.${Pacem.PCSS}-readonly`)
            ], PacemTextAreaElement.prototype, "_span", void 0);
            PacemTextAreaElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-textarea', template: `<textarea class="${Pacem.PCSS}-input" pacem></textarea>${Scaffolding.CHAR_COUNTER_CHILD}<span class="${Pacem.PCSS}-readonly"><${Pacem.P}-text text="{{ :host.viewValue }}"></${Pacem.P}-text></span>`, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemTextAreaElement);
            Scaffolding.PacemTextAreaElement = PacemTextAreaElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../dist/js/pacem-ui.d.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            class PacemBaseValidatorElement extends Scaffolding.PacemFormRelevantElement {
                constructor() {
                    super();
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    Pacem.Utils.addClass(this, Pacem.PCSS + '-validator');
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    let form = this.form;
                    switch (name) {
                        case 'watch':
                            old && form && form.unregisterValidator(val, this);
                            form && form.registerValidator(val, this);
                            break;
                        case 'invalid':
                            break;
                        case 'form':
                            let n = this.watch;
                            if (!Pacem.Utils.isNullOrEmpty(n)) {
                                if (old != null)
                                    old.unregisterValidator(n, this);
                                if (val != null)
                                    val.registerValidator(n, this);
                            }
                            break;
                        case 'disabled':
                            this.triggerFormFieldValidation();
                            break;
                    }
                }
                triggerFormFieldValidation() {
                    const form = this.form, watch = this.watch;
                    if (!Pacem.Utils.isNull(form) && !Pacem.Utils.isNullOrEmpty(watch)) {
                        form.validate(watch);
                    }
                }
                validate(val) {
                    if (this.disabled) {
                        return Pacem.Utils.fromResult(true);
                    }
                    return this.evaluate(val);
                }
            }
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemBaseValidatorElement.prototype, "invalid", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemBaseValidatorElement.prototype, "errorMessage", void 0);
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true, converter: Pacem.PropertyConverters.String })
            ], PacemBaseValidatorElement.prototype, "watch", void 0);
            Scaffolding.PacemBaseValidatorElement = PacemBaseValidatorElement;
            Scaffolding.BASIC_VALIDATOR_TEMPLATE = `<${Pacem.P}-span hide="{{ !:host.invalid  }}" text="{{ :host.errorMessage }}"></${Pacem.P}-span>`;
            // #region TEXTUAL
            function isValueEmpty(val) {
                return Pacem.Utils.isNullOrEmpty(val);
            }
            let PacemRequiredValidatorElement = class PacemRequiredValidatorElement extends PacemBaseValidatorElement {
                evaluate(val) {
                    let retval = !isValueEmpty(val);
                    return Pacem.Utils.fromResult(retval);
                }
            };
            PacemRequiredValidatorElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-required-validator', template: Scaffolding.BASIC_VALIDATOR_TEMPLATE, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemRequiredValidatorElement);
            Scaffolding.PacemRequiredValidatorElement = PacemRequiredValidatorElement;
            let PacemRegexValidatorElement = class PacemRegexValidatorElement extends PacemBaseValidatorElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first && name === 'pattern') {
                        this.triggerFormFieldValidation();
                    }
                }
                evaluate(val) {
                    let retval = true, pattern = this.pattern;
                    if (!isValueEmpty(val)) {
                        retval = new RegExp(pattern).test(val);
                    }
                    return Pacem.Utils.fromResult(retval);
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemRegexValidatorElement.prototype, "pattern", void 0);
            PacemRegexValidatorElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-regex-validator', template: Scaffolding.BASIC_VALIDATOR_TEMPLATE, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemRegexValidatorElement);
            Scaffolding.PacemRegexValidatorElement = PacemRegexValidatorElement;
            let PacemLengthValidatorElement = class PacemLengthValidatorElement extends PacemBaseValidatorElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first &&
                        (name === 'min' || name === 'max')) {
                        this.triggerFormFieldValidation();
                    }
                }
                evaluate(val) {
                    let retval = true;
                    if (!isValueEmpty(val)) {
                        if (this.min >= 0)
                            retval = retval && (val || '').toString().length >= this.min;
                        if (this.max >= 0)
                            retval = retval && (val || '').toString().length <= this.max;
                    }
                    return Pacem.Utils.fromResult(retval);
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemLengthValidatorElement.prototype, "min", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemLengthValidatorElement.prototype, "max", void 0);
            PacemLengthValidatorElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-length-validator', template: Scaffolding.BASIC_VALIDATOR_TEMPLATE, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemLengthValidatorElement);
            Scaffolding.PacemLengthValidatorElement = PacemLengthValidatorElement;
            // #endregion
            // #region NUMERIC/ORDINAL
            let PacemRangeValidatorElement = class PacemRangeValidatorElement extends PacemBaseValidatorElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first &&
                        (name === 'min' || name === 'max')) {
                        this.triggerFormFieldValidation();
                    }
                }
                evaluate(val) {
                    let retval = true;
                    if (!isValueEmpty(val)) {
                        let date = val;
                        if (val instanceof Date || (typeof val !== 'number' && (date = Pacem.Utils.parseDate(val)) instanceof Date && isFinite(date.valueOf()))) {
                            if (this.min != null)
                                retval = retval && date.valueOf() >= Pacem.Utils.parseDate(this.min).valueOf();
                            if (this.max != null)
                                retval = retval && date.valueOf() <= Pacem.Utils.parseDate(this.max).valueOf();
                        }
                        else {
                            if (this.min != null)
                                retval = retval && val >= this.min;
                            if (this.max != null)
                                retval = retval && val <= this.max;
                        }
                    }
                    return Pacem.Utils.fromResult(retval);
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemRangeValidatorElement.prototype, "min", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Number })
            ], PacemRangeValidatorElement.prototype, "max", void 0);
            PacemRangeValidatorElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-range-validator', template: Scaffolding.BASIC_VALIDATOR_TEMPLATE, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemRangeValidatorElement);
            Scaffolding.PacemRangeValidatorElement = PacemRangeValidatorElement;
            // #endregion
            // #region COMPLEX
            let PacemCompareValidatorElement = class PacemCompareValidatorElement extends PacemBaseValidatorElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first &&
                        (name === 'operator' || name === 'to')) {
                        this.triggerFormFieldValidation();
                    }
                }
                evaluate(val) {
                    let retval = true, other = this.to;
                    if (!isValueEmpty(val) && !isValueEmpty(other)) {
                        switch (this.operator) {
                            case 'lessOrEqual':
                                retval = val <= other;
                                break;
                            case 'less':
                                retval = val < other;
                                break;
                            case 'greaterOrEqual':
                                retval = val >= other;
                                break;
                            case 'greater':
                                retval = val > other;
                                break;
                            case 'notEqual':
                                retval = val !== other;
                                break;
                            default:
                                retval = val === other;
                                break;
                        }
                    }
                    return Pacem.Utils.fromResult(retval);
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemCompareValidatorElement.prototype, "operator", void 0);
            __decorate([
                Pacem.Watch({ emit: false, reflectBack: true })
            ], PacemCompareValidatorElement.prototype, "to", void 0);
            PacemCompareValidatorElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-compare-validator', template: Scaffolding.BASIC_VALIDATOR_TEMPLATE, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemCompareValidatorElement);
            Scaffolding.PacemCompareValidatorElement = PacemCompareValidatorElement;
            // #endregion
            let PacemBinaryValidatorElement = class PacemBinaryValidatorElement extends PacemBaseValidatorElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first &&
                        (name === 'pattern' || name === 'maxSize')) {
                        this.triggerFormFieldValidation();
                    }
                }
                evaluate(val) {
                    let retval = true, pattern = this.pattern, maxSize = this.maxSize;
                    if (!isValueEmpty(val)) {
                        // file name
                        if (!Pacem.Utils.isNullOrEmpty(pattern)) {
                            let filename = typeof val === 'string' ? val : val.name;
                            retval = new RegExp(pattern, 'i').test(filename);
                        }
                        // max size
                        if (!Pacem.Utils.isNull(maxSize) && typeof val === 'object' && val.size > 0) {
                            retval = retval && val.size <= maxSize;
                        }
                    }
                    return Pacem.Utils.fromResult(retval);
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemBinaryValidatorElement.prototype, "pattern", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemBinaryValidatorElement.prototype, "maxSize", void 0);
            PacemBinaryValidatorElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-binary-validator', template: Scaffolding.BASIC_VALIDATOR_TEMPLATE, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemBinaryValidatorElement);
            Scaffolding.PacemBinaryValidatorElement = PacemBinaryValidatorElement;
            let PacemAsyncValidatorElement = class PacemAsyncValidatorElement extends PacemBaseValidatorElement {
                constructor() {
                    super(...arguments);
                    this._deferredToken = null;
                }
                _fetch(val) {
                    const deferred = this._deferredToken;
                    const fetcher = this._fetcher;
                    var params = this.parameters || {};
                    params[this.watch] = val;
                    fetcher.parameters = params;
                    fetcher.url = this.url;
                    fetcher.as = 'text';
                    fetcher.method = this.method;
                    // debounce
                    clearTimeout(this._debouncer);
                    this._debouncer = setTimeout(() => {
                        fetcher.fetch().then(_ => {
                            const result = fetcher.result;
                            switch (result) {
                                case 'true':
                                    deferred.resolve(true);
                                    break;
                                case 'false':
                                    deferred.resolve(false);
                                    break;
                                default: // expect json
                                    try {
                                        let json = JSON.parse(result);
                                        let res = Pacem.Utils.getApiResult(json);
                                        deferred.resolve(res || false);
                                    }
                                    catch (_) {
                                        deferred.resolve(false);
                                    }
                                    break;
                            }
                        }, _ => {
                            deferred.resolve(false);
                        });
                    }, 1000);
                    return deferred.promise;
                }
                evaluate(val) {
                    if (Pacem.Utils.isNullOrEmpty(val)) {
                        return Pacem.Utils.fromResult(true);
                    }
                    else {
                        this._deferredToken = this._deferredToken = Pacem.DeferPromise.defer();
                        return this._fetch(val).then(r => {
                            this._deferredToken = null;
                            return r;
                        }, _ => {
                            this._deferredToken = null;
                            return false;
                        });
                    }
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first) {
                        switch (name) {
                            case 'parameters':
                            case 'url':
                            case 'method':
                            case 'fetchCredentials':
                            case 'fetchHeaders':
                                this.triggerFormFieldValidation();
                                break;
                        }
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemAsyncValidatorElement.prototype, "parameters", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemAsyncValidatorElement.prototype, "fetchCredentials", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemAsyncValidatorElement.prototype, "fetchHeaders", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemAsyncValidatorElement.prototype, "url", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemAsyncValidatorElement.prototype, "method", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-fetch')
            ], PacemAsyncValidatorElement.prototype, "_fetcher", void 0);
            PacemAsyncValidatorElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-async-validator',
                    template: Scaffolding.BASIC_VALIDATOR_TEMPLATE + `<${Pacem.P}-fetch autofetch="false" throttle="true" credentials="{{ :host.fetchCredentials }}" headers="{{ :host.fetchHeaders }}"></${Pacem.P}-fetch>`, shadow: Pacem.Defaults.USE_SHADOW_ROOT
                })
            ], PacemAsyncValidatorElement);
            Scaffolding.PacemAsyncValidatorElement = PacemAsyncValidatorElement;
            let PacemCustomValidatorElement = class PacemCustomValidatorElement extends PacemBaseValidatorElement {
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first &&
                        (name === 'isValid')) {
                        this.triggerFormFieldValidation();
                    }
                }
                evaluate(val) {
                    let retval = true;
                    if (!isValueEmpty(val)) {
                        retval = !!this.isValid;
                    }
                    return Pacem.Utils.fromResult(retval);
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Boolean })
            ], PacemCustomValidatorElement.prototype, "isValid", void 0);
            PacemCustomValidatorElement = __decorate([
                Pacem.CustomElement({ tagName: Pacem.P + '-custom-validator', template: Scaffolding.BASIC_VALIDATOR_TEMPLATE, shadow: Pacem.Defaults.USE_SHADOW_ROOT })
            ], PacemCustomValidatorElement);
            Scaffolding.PacemCustomValidatorElement = PacemCustomValidatorElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            class PacemContenteditableButtonCommandElement extends Scaffolding.PacemContenteditableCommandElement {
                cleanUp(_) {
                    // do nothing
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'range') {
                        this.active = !Pacem.Utils.isNull(val);
                    }
                }
                getTooltip(altText = this.altText, shortcut = this.keyboardShortcut) {
                    const hint = altText;
                    if (Pacem.Utils.isNullOrEmpty(shortcut)) {
                        return hint;
                    }
                    return `${hint} (${shortcut})`;
                }
            }
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemContenteditableButtonCommandElement.prototype, "icon", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemContenteditableButtonCommandElement.prototype, "keyboardShortcut", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemContenteditableButtonCommandElement.prototype, "altText", void 0);
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.Boolean })
            ], PacemContenteditableButtonCommandElement.prototype, "active", void 0);
            Scaffolding.PacemContenteditableButtonCommandElement = PacemContenteditableButtonCommandElement;
            Scaffolding.CONTENTELEMENT_BUTTONCOMMAND_TEMPLATE = `<${Pacem.P}-button disabled="{{ !:host.active }}" css-class="{{ {'text-primary': :host.isRelevant(:host.range)} }}" tooltip="{{ :host.getTooltip(:host.altText, :host.keyboardShortcut) }}" class="button" on-click=":host.execCommand()"><${Pacem.P}-icon class="text-rootsize" icon="{{ :host.icon }}"></${Pacem.P}-icon></${Pacem.P}-button>
                   <${Pacem.P}-shortcut disabled="{{ !:host.active }}" target="{{ :host.contentElement }}" combination="{{ :host.keyboardShortcut }}" on-execute=":host.execCommand()"></${Pacem.P}-shortcut>`;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="types.ts" />
/// <reference path="utils.ts" />
/// <reference path="../contenteditable.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            function getAlignIcon(align) {
                return 'format_align_' + align;
            }
            let PacemContenteditableAlignCommandElement = class PacemContenteditableAlignCommandElement extends Scaffolding.PacemContenteditableButtonCommandElement {
                isRelevant(range) {
                    const els = Scaffolding.ContenteditableUtils.findSurroundingSiblingBlockElements(range);
                    if (Pacem.Utils.isNullOrEmpty(els)) {
                        return false;
                    }
                    const el = els[0], textAlign = getComputedStyle(el).textAlign;
                    return textAlign == this.align;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'align') {
                        if (Pacem.Utils.isNullOrEmpty(this.icon) || this.icon === getAlignIcon(old)) {
                            this.icon = getAlignIcon(val);
                        }
                        if (Pacem.Utils.isNullOrEmpty(this.altText) || this.altText === old) {
                            this.altText = val;
                        }
                    }
                }
                exec() {
                    const elements = Scaffolding.ContenteditableUtils.findSurroundingSiblingBlockElements(this.range);
                    let targetAlign;
                    for (let el of elements) {
                        if (Scaffolding.ContenteditableUtils.isBlockElement(el) && el instanceof HTMLElement) {
                            // normalize alignment: pick one element (the 1st one) to rule them all
                            if (Pacem.Utils.isNull(targetAlign)) {
                                targetAlign = Pacem.Utils.hasClass(el, 'text-' + this.align) ? '' : this.align;
                            }
                            el.style.textAlign = '';
                            Pacem.Utils.removeClass(el, 'text-left text-right text-center text-justify');
                            if (!Pacem.Utils.isEmpty(targetAlign)) {
                                Pacem.Utils.addClass(el, 'text-' + targetAlign);
                            }
                        }
                    }
                    return Promise.resolve();
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemContenteditableAlignCommandElement.prototype, "align", void 0);
            PacemContenteditableAlignCommandElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-contenteditable-aligncommand', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: Scaffolding.CONTENTELEMENT_BUTTONCOMMAND_TEMPLATE
                })
            ], PacemContenteditableAlignCommandElement);
            Scaffolding.PacemContenteditableAlignCommandElement = PacemContenteditableAlignCommandElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="utils.ts" />
/// <reference path="../contenteditable.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let KnownExecCommand;
            (function (KnownExecCommand) {
                KnownExecCommand["Bold"] = "bold";
                KnownExecCommand["Italic"] = "italic";
                KnownExecCommand["Underline"] = "underline";
                KnownExecCommand["StrikeThrough"] = "strikeThrough";
                KnownExecCommand["OrderedList"] = "insertOrderedList";
                KnownExecCommand["UnorderedList"] = "insertUnorderedList";
                KnownExecCommand["JustifyLeft"] = "justifyLeft";
                KnownExecCommand["JustifyCenter"] = "justifyCenter";
                KnownExecCommand["JustifyRight"] = "justifyRight";
                KnownExecCommand["JustifyFull"] = "justifyFull";
                //Copy = 'copy',
                //Cut = 'cut',
                //Paste = 'paste'
                //Undo = 'undo',
                //Redo = 'redo',
            })(KnownExecCommand = Scaffolding.KnownExecCommand || (Scaffolding.KnownExecCommand = {}));
            ;
            /**
             * Returns relevant material icon ligatures
             * @param cmd A known command
             */
            function getKnownCommandIcon(cmd) {
                const lower_cmd = cmd === null || cmd === void 0 ? void 0 : cmd.toLowerCase();
                switch (lower_cmd) {
                    case "bold":
                    case "italic":
                        return 'format_' + lower_cmd;
                    case 'underline':
                        return 'format_underlined';
                    case 'strikethrough':
                        return 'strikethrough_s';
                    case 'insertorderedlist':
                        return 'format_list_numbered';
                    case 'insertunorderedlist':
                        return 'format_list_bulleted';
                    case 'justifyleft':
                    case 'justifyright':
                    case 'justifycenter':
                        return 'format_align_' + lower_cmd.substr(7 /* 'justify' */);
                    case 'justifyfull':
                        return 'format_align_justify';
                    default:
                        return 'help_outline';
                }
            }
            function getKnownCommandFilters(cmd, argument) {
                const lower_cmd = cmd === null || cmd === void 0 ? void 0 : cmd.toLowerCase();
                switch (lower_cmd) {
                    case "bold":
                        return ['b', 'strong'];
                    case "italic":
                        return ['i', 'em'];
                    case 'underline':
                        return ['u'];
                    case 'strikethrough':
                        return ['strike', 's', 'del'];
                    case 'insertorderedlist':
                        return ['ol'];
                    case 'insertunorderedlist':
                        return ['ul'];
                    case 'justifyleft':
                        return [{ style: { name: 'text-align', value: 'left' } }];
                    case 'justifyright':
                        return [{ style: { name: 'text-align', value: 'right' } }];
                    case 'justifycenter':
                        return [{ style: { name: 'text-align', value: 'center' } }];
                    case 'justifyfull':
                        return [{ style: { name: 'text-align', value: 'justify' } }];
                    case 'formatblock':
                        return [argument];
                    default:
                        return ['none'];
                }
            }
            let PacemContenteditableExecCommandElement = class PacemContenteditableExecCommandElement extends Scaffolding.PacemContenteditableButtonCommandElement {
                _matchRelevance(range, arg) {
                    const found = (typeof arg === 'object') ?
                        Scaffolding.ContenteditableUtils.findSurroundingNode(range, node => node instanceof HTMLElement
                            && (Pacem.Utils.isNullOrEmpty(arg.tagName) || node.tagName === arg.tagName.toUpperCase())
                            && node.style[arg.style.name] === arg.style.value)
                        : Scaffolding.ContenteditableUtils.findSurroundingNode(range, arg);
                    return !Pacem.Utils.isNull(found);
                }
                isRelevant(range) {
                    const filters = getKnownCommandFilters(this.command, this.argument);
                    for (let f of filters) {
                        if (this._matchRelevance(range, f)) {
                            return true;
                        }
                    }
                    return false;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (name === 'command') {
                        if (Pacem.Utils.isNullOrEmpty(this.icon) || this.icon === getKnownCommandIcon(old)) {
                            this.icon = getKnownCommandIcon(val);
                        }
                        if (Pacem.Utils.isNullOrEmpty(this.altText) || this.altText === old) {
                            this.altText = val;
                        }
                    }
                }
                exec() {
                    return new Promise((resolve, _) => {
                        // check if selection is around an 'inert' ([contenteditable=false]) element
                        const r = this.range, cmdfilter = getKnownCommandFilters(this.command, this.argument)[0];
                        if (!Pacem.Utils.isNull(r)) {
                            // #region wrap/unwrap (manages contenteditable=false 'islands')
                            const island = Scaffolding.ContenteditableUtils.testInertElementWrapping(r);
                            if (island.result
                                && typeof cmdfilter === 'string' && ['b', 'i', 'strike', 'u'].indexOf(cmdfilter) >= 0) {
                                // wrap or remove?
                                const wrapper = Scaffolding.ContenteditableUtils.findSurroundingNode(r, cmdfilter);
                                if (!Pacem.Utils.isNull(wrapper) && wrapper.childNodes.length === 1) {
                                    // remove
                                    const newChild = wrapper.childNodes.item(0), select = island.element;
                                    wrapper.parentElement.replaceChild(newChild, wrapper);
                                    Scaffolding.ContenteditableUtils.select(select);
                                }
                                else {
                                    // wrap
                                    const n = document.createElement(cmdfilter), select = island.element;
                                    const frag = r.extractContents();
                                    r.insertNode(n);
                                    n.append(frag);
                                    Scaffolding.ContenteditableUtils.select(select);
                                }
                            }
                            // #endregion
                            else {
                                document.execCommand(this.command, false, this.argument);
                            }
                        }
                        resolve();
                    });
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemContenteditableExecCommandElement.prototype, "command", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemContenteditableExecCommandElement.prototype, "argument", void 0);
            PacemContenteditableExecCommandElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-contenteditable-execcommand', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: Scaffolding.CONTENTELEMENT_BUTTONCOMMAND_TEMPLATE
                })
            ], PacemContenteditableExecCommandElement);
            Scaffolding.PacemContenteditableExecCommandElement = PacemContenteditableExecCommandElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="types.ts" />
/// <reference path="utils.ts" />
/// <reference path="../contenteditable.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemContenteditableHistoryCommandElement = class PacemContenteditableHistoryCommandElement extends Scaffolding.PacemContenteditableButtonCommandElement {
                exec() {
                    return new Promise((resolve, _) => {
                        var _a;
                        const history = (_a = this.container) === null || _a === void 0 ? void 0 : _a.history;
                        if (!Pacem.Utils.isNull(history)) {
                            switch (this.command) {
                                case 'redo':
                                    if (history.canRedo) {
                                        history.redo();
                                        resolve();
                                    }
                                    break;
                                default:
                                    if (history.canUndo) {
                                        history.undo();
                                        resolve();
                                    }
                                    break;
                            }
                            this.contentElement.innerHTML = history.current;
                        }
                    });
                }
                isRelevant(_) {
                    return false;
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'command':
                            this.icon = this.icon || val;
                            this.altText = val;
                            this.keyboardShortcut = this.keyboardShortcut || ('Ctrl+' + (val === 'redo' ? 'Y' : 'Z'));
                            break;
                    }
                }
                containerPropertyChangedCallback(name, old, val, first) {
                    super.containerPropertyChangedCallback(name, old, val, first);
                    const c = this.container, h = c.history;
                    if (name === 'range' || name === 'history') {
                        // override 'active' state setting
                        this.active = !Pacem.Utils.isNull(c.range) &&
                            ((this.command === 'redo' && (h === null || h === void 0 ? void 0 : h.canRedo)) || (this.command !== 'redo' && (h === null || h === void 0 ? void 0 : h.canUndo)));
                    }
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String, reflectBack: true })
            ], PacemContenteditableHistoryCommandElement.prototype, "command", void 0);
            PacemContenteditableHistoryCommandElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-contenteditable-historycommand', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: Scaffolding.CONTENTELEMENT_BUTTONCOMMAND_TEMPLATE
                })
            ], PacemContenteditableHistoryCommandElement);
            Scaffolding.PacemContenteditableHistoryCommandElement = PacemContenteditableHistoryCommandElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../contenteditable.ts" />
/// <reference path="utils.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            //@CustomElement({ tagName: P + '-contenteditable-selectable' })
            //export class PacemContenteditableSelectableBehaviorElement extends Pacem.Behaviors.PacemBehavior {
            var _PacemContenteditableImageCommandElement_observer;
            //    protected decorate(element: Element) {
            //        if (element instanceof HTMLElement || element instanceof SVGElement) {
            //            Utils.addClass(element, PCSS + '-contenteditable-selectable');
            //        }
            //    }
            //    protected undecorate(element: Element) {
            //        if (element instanceof HTMLElement || element instanceof SVGElement) {
            //            Utils.removeClass(element, PCSS + '-contenteditable-selectable');
            //        }
            //    }
            //}
            function insertPicture(range, blob) {
                return new Promise((resolve, reject) => {
                    Pacem.Utils.blobToDataURL(blob)
                        .then(Pacem.Utils.loadImage)
                        .then(img => {
                        const pic = document.createElement('picture');
                        pic.setAttribute('contenteditable', 'false');
                        img.tabIndex = 0;
                        pic.appendChild(img);
                        range.deleteContents();
                        range.insertNode(pic);
                        resolve(pic);
                    });
                });
            }
            let PacemContenteditableImageCommandElement = class PacemContenteditableImageCommandElement extends Scaffolding.PacemContenteditableButtonCommandElement {
                constructor() {
                    super(...arguments);
                    _PacemContenteditableImageCommandElement_observer.set(this, void 0);
                    this._setBehaviorHandler = (evt) => {
                        const img = evt.target, pic = img.parentElement;
                        // this._rescale.register(pic);
                        this.range = Scaffolding.ContenteditableUtils.select(pic);
                    };
                    this._disposeBehaviorHandler = (_) => {
                    };
                    // #endregion
                }
                pasteCallback(f) {
                    if (f.type.startsWith('image')) {
                        return insertPicture(this.range, f);
                    }
                    else {
                        return Promise.reject();
                    }
                }
                cleanUp(content) {
                    content.querySelectorAll('picture[contenteditable=false]').forEach(pic => {
                        const childCount = pic.childNodes.length;
                        for (let j = childCount - 1; j > 0; j--) {
                            // remove leftover rescale divs
                            pic.childNodes.item(j).remove();
                        }
                    });
                    // legacy leftovers
                    content.querySelectorAll('div.' + Pacem.PCSS + '-rescale').forEach(i => i.remove());
                }
                isRelevant(range) {
                    return false;
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    if (Pacem.Utils.isNullOrEmpty(this.altText)) {
                        this.altText = 'insert image';
                    }
                    if (Pacem.Utils.isNullOrEmpty(this.icon)) {
                        this.icon = 'insert_photo';
                    }
                    if (Pacem.Utils.isNullOrEmpty(this.keyboardShortcut)) {
                        this.keyboardShortcut = 'Ctrl+Shift+I';
                    }
                    this._rescale.addEventListener('rescale', this._rescaleImg, false);
                }
                disconnectedCallback() {
                    if (!Pacem.Utils.isNull(this._rescale)) {
                        this._rescale.removeEventListener('rescale', this._rescaleImg, false);
                        this._disposeContainer();
                    }
                    super.disconnectedCallback();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    switch (name) {
                        case 'disabled':
                            if (!Pacem.Utils.isNull(this._rescale)) {
                                this._rescale.disabled = val;
                            }
                            break;
                        case 'contentElement':
                            if (old) {
                                this._disposeContainer(old);
                            }
                            if (val) {
                                this._initContainer(val);
                            }
                            break;
                        case 'range':
                            this._rangeChangeCallback(old, val);
                            break;
                    }
                }
                exec() {
                    return new Promise((resolve, reject) => {
                        const file = this._file, range = this.range;
                        file.onchange = (evt) => {
                            const f = file.files[0];
                            if (Pacem.Utils.isNull(f)) {
                                resolve();
                            }
                            else {
                                insertPicture(range, f)
                                    .then(pic => {
                                    file.value = '';
                                    resolve();
                                });
                            }
                        };
                        file.click();
                    });
                }
                // #region private
                _rescaleImg(evt) {
                    evt.preventDefault();
                    const pic = evt.detail.element, rect = evt.detail.targetRect, img = pic.firstElementChild;
                    img.style.width = rect.width + 'px';
                    img.style.height = rect.height + 'px';
                }
                _rangeChangeCallback(old, val) {
                    if (!Pacem.Utils.isNull(old)
                        && !old.collapsed
                        && old.commonAncestorContainer instanceof Element
                        && old.commonAncestorContainer === old.startContainer
                        && old.commonAncestorContainer === old.endContainer
                        && old.startOffset === (old.endOffset - 1)) {
                        const el = old.commonAncestorContainer.childNodes.item(old.startOffset);
                        if (el instanceof HTMLPictureElement) {
                            this._rescale.unregister(el);
                        }
                    }
                    if (!Pacem.Utils.isNull(val)
                        && !val.collapsed
                        && val.commonAncestorContainer instanceof Element
                        && val.commonAncestorContainer === val.startContainer
                        && val.commonAncestorContainer === val.endContainer
                        && val.startOffset === (val.endOffset - 1)) {
                        const el = val.commonAncestorContainer.childNodes.item(val.startOffset);
                        if (el instanceof HTMLPictureElement) {
                            this._rescale.register(el);
                        }
                    }
                }
                _enhancePictureElement(pic) {
                    if (pic.firstElementChild) {
                        pic.firstElementChild.addEventListener('focus', this._setBehaviorHandler, false);
                        pic.firstElementChild.addEventListener('blur', this._disposeBehaviorHandler, false);
                    }
                }
                _downgradePictureElement(pic) {
                    if (pic.firstElementChild) {
                        // this._rescale.unregister(pic);
                        pic.firstElementChild.removeEventListener('focus', this._setBehaviorHandler, false);
                        pic.firstElementChild.removeEventListener('blur', this._disposeBehaviorHandler, false);
                    }
                }
                _initContainer(contentElement = this.contentElement) {
                    __classPrivateFieldSet(this, _PacemContenteditableImageCommandElement_observer, new Scaffolding.ContenteditableDOMObserver(contentElement, (pic, removed) => {
                        if (pic instanceof HTMLPictureElement) {
                            if (removed) {
                                this._downgradePictureElement(pic);
                            }
                            else {
                                this._enhancePictureElement(pic);
                            }
                        }
                    }, 'picture'), "f");
                }
                _disposeContainer(_ = this.contentElement) {
                    const observer = __classPrivateFieldGet(this, _PacemContenteditableImageCommandElement_observer, "f");
                    if (!Pacem.Utils.isNull(observer)) {
                        observer.dispose();
                    }
                }
            };
            _PacemContenteditableImageCommandElement_observer = new WeakMap();
            __decorate([
                Pacem.ViewChild('input[type=file]')
            ], PacemContenteditableImageCommandElement.prototype, "_file", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + "-rescale")
            ], PacemContenteditableImageCommandElement.prototype, "_rescale", void 0);
            PacemContenteditableImageCommandElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-contenteditable-imagecommand', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<input type="file" accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon" class="${Pacem.PCSS}-trasparent ${Pacem.PCSS}-inert" pacem hidden>` +
                        Scaffolding.CONTENTELEMENT_BUTTONCOMMAND_TEMPLATE + `<${Pacem.P}-rescale keep-proportions="true"></${Pacem.P}-rescale>`
                })
            ], PacemContenteditableImageCommandElement);
            Scaffolding.PacemContenteditableImageCommandElement = PacemContenteditableImageCommandElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../contenteditable.ts" />
/// <reference path="utils.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemContenteditableLinkCommandElement = class PacemContenteditableLinkCommandElement extends Scaffolding.PacemContenteditableButtonCommandElement {
                isRelevant(range) {
                    return !Pacem.Utils.isNull(Scaffolding.ContenteditableUtils.findSurroundingNode(range, HTMLAnchorElement));
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    if (Pacem.Utils.isNullOrEmpty(this.altText)) {
                        this.altText = 'insert link';
                    }
                    if (Pacem.Utils.isNullOrEmpty(this.icon)) {
                        this.icon = 'insert_link';
                    }
                    if (Pacem.Utils.isNullOrEmpty(this.keyboardShortcut)) {
                        this.keyboardShortcut = 'Ctrl+H';
                    }
                }
                exec(arg, target = this.target) {
                    return new Promise((resolve, reject) => {
                        var selection = this.range;
                        var anchorNode = Scaffolding.ContenteditableUtils.findSurroundingNode(selection, HTMLAnchorElement);
                        //console.log('selection: ' + selection);
                        var current = "http://";
                        var regex = /<a.*href=\"([^\"]*)/;
                        if (anchorNode && regex.test(anchorNode.outerHTML)) {
                            current = regex.exec(anchorNode.outerHTML)[1];
                        }
                        //console.log('link: ' + current);
                        if (arg === 'current') {
                            return current == 'http://' ? '' : current;
                        }
                        var link = arg || (arg === void 0 && window.prompt('link (empty to unlink):', current));
                        if (!link) {
                            document.execCommand('unlink');
                        }
                        else {
                            document.execCommand('createLink', false, link);
                            anchorNode = Scaffolding.ContenteditableUtils.findSurroundingNode(selection, HTMLAnchorElement);
                            if (anchorNode) {
                                anchorNode.setAttribute('target', target || '_blank');
                            }
                        }
                        resolve();
                    });
                }
            };
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.String })
            ], PacemContenteditableLinkCommandElement.prototype, "target", void 0);
            PacemContenteditableLinkCommandElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-contenteditable-linkcommand', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: Scaffolding.CONTENTELEMENT_BUTTONCOMMAND_TEMPLATE
                })
            ], PacemContenteditableLinkCommandElement);
            Scaffolding.PacemContenteditableLinkCommandElement = PacemContenteditableLinkCommandElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../contenteditable.ts" />
/// <reference path="utils.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            var _PacemContenteditablePlaceholderElement_relevancy, _PacemContenteditablePlaceholderElement_normalizedDatasource, _PacemContenteditablePlaceholderElement_observer;
            function insertPlaceholder(range, placeholder) {
                const ins = document.createElement('ins');
                ins.textContent = placeholder;
                ins.setAttribute('contenteditable', 'false');
                // not necessary:
                // ins.style.display = 'inline-block';
                ins.tabIndex = 0;
                range.deleteContents();
                range.insertNode(ins);
                return ins;
            }
            function isPlaceholder(node) {
                return node instanceof HTMLModElement && node.tagName === 'INS';
            }
            function isRelevant(range) {
                const wraps = Scaffolding.ContenteditableUtils.testInertElementWrapping(range);
                if (wraps.result && isPlaceholder(wraps.element)) {
                    const element = wraps.element, placeholder = element.textContent;
                    return { result: true, element, placeholder };
                }
                return { result: false };
            }
            let PacemContenteditablePlaceholderElement = class PacemContenteditablePlaceholderElement extends Scaffolding.PacemContenteditableCommandElement {
                constructor() {
                    super(...arguments);
                    _PacemContenteditablePlaceholderElement_relevancy.set(this, void 0);
                    _PacemContenteditablePlaceholderElement_normalizedDatasource.set(this, void 0);
                    // #region mutation observer
                    _PacemContenteditablePlaceholderElement_observer.set(this, void 0);
                    this._focusHandler = (evt) => {
                        const ins = evt.target;
                        this.range = Scaffolding.ContenteditableUtils.select(ins);
                    };
                    // #endregion
                }
                cleanUp(content) {
                    content.querySelectorAll('ins[contenteditable=false]').forEach(ins => {
                        Pacem.Utils.removeClass(ins, 'placeholder-selected');
                    });
                }
                exec(ph) {
                    const el = insertPlaceholder(this.range, ph);
                    const range = Scaffolding.ContenteditableUtils.select(el);
                    range.collapse(false);
                    return Promise.resolve(el);
                }
                isRelevant(_) {
                    var _a, _b;
                    return (_b = (_a = __classPrivateFieldGet(this, _PacemContenteditablePlaceholderElement_relevancy, "f")) === null || _a === void 0 ? void 0 : _a.result) !== null && _b !== void 0 ? _b : false;
                }
                viewActivatedCallback() {
                    super.viewActivatedCallback();
                    this._fillDropdown();
                    this._initContainer();
                }
                propertyChangedCallback(name, old, val, first) {
                    super.propertyChangedCallback(name, old, val, first);
                    if (!first) {
                        switch (name) {
                            case 'datasource':
                                this._fillDropdown();
                                break;
                            case 'contentElement':
                                if (old) {
                                    this._disposeContainer(old);
                                }
                                if (val) {
                                    this._initContainer(val);
                                }
                                break;
                            case 'range':
                                this._changeRelevancy();
                                break;
                        }
                    }
                }
                disconnectedCallback() {
                    this._disposeContainer();
                    super.disconnectedCallback();
                }
                _changeRelevancy(range = this.range) {
                    const old = __classPrivateFieldGet(this, _PacemContenteditablePlaceholderElement_relevancy, "f");
                    if (!Pacem.Utils.isNull(old === null || old === void 0 ? void 0 : old.element)) {
                        Pacem.Utils.removeClass(old.element, 'placeholder-selected');
                    }
                    const val = __classPrivateFieldSet(this, _PacemContenteditablePlaceholderElement_relevancy, isRelevant(range), "f");
                    if (!Pacem.Utils.isNull(val === null || val === void 0 ? void 0 : val.element)) {
                        Pacem.Utils.addClass(val.element, 'placeholder-selected');
                    }
                    if (val.result) {
                        this._dropdown.value = val.placeholder;
                    }
                    else {
                        this._dropdown.popout();
                        this._dropdown.value = void 0;
                    }
                }
                _fillDropdown(datasource = this.datasource || []) {
                    const ds = __classPrivateFieldSet(this, _PacemContenteditablePlaceholderElement_normalizedDatasource, datasource.map(i => { return typeof i === 'string' ? { placeholder: i, definition: i } : i; }), "f");
                    const dd = this._dropdown;
                    dd.textProperty =
                        dd.valueProperty = 'placeholder';
                    dd.datasource = ds;
                }
                _initContainer(contentElement = this.contentElement) {
                    __classPrivateFieldSet(this, _PacemContenteditablePlaceholderElement_observer, new Scaffolding.ContenteditableDOMObserver(contentElement, (item, removed) => {
                        if (isPlaceholder(item)) {
                            if (removed) {
                                this._downgradePlaceholderElement(item);
                            }
                            else {
                                this._enhancePlaceholderElement(item);
                            }
                        }
                    }, 'ins[contenteditable=false]'), "f");
                }
                _disposeContainer(_ = this.contentElement) {
                    const observer = __classPrivateFieldGet(this, _PacemContenteditablePlaceholderElement_observer, "f");
                    if (!Pacem.Utils.isNull(observer)) {
                        observer.dispose();
                    }
                }
                _enhancePlaceholderElement(ins) {
                    ins.addEventListener('focus', this._focusHandler, false);
                }
                _downgradePlaceholderElement(ins) {
                    ins.removeEventListener('focus', this._focusHandler, false);
                }
            };
            _PacemContenteditablePlaceholderElement_relevancy = new WeakMap(), _PacemContenteditablePlaceholderElement_normalizedDatasource = new WeakMap(), _PacemContenteditablePlaceholderElement_observer = new WeakMap();
            __decorate([
                Pacem.ViewChild('template')
            ], PacemContenteditablePlaceholderElement.prototype, "_itemtemplate", void 0);
            __decorate([
                Pacem.ViewChild(Pacem.P + '-suggest')
            ], PacemContenteditablePlaceholderElement.prototype, "_dropdown", void 0);
            __decorate([
                Pacem.Watch({ emit: false, converter: Pacem.PropertyConverters.Json })
            ], PacemContenteditablePlaceholderElement.prototype, "datasource", void 0);
            PacemContenteditablePlaceholderElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-contenteditable-placeholder', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: `<template>
<${Pacem.P}-span text="{{ ^item.viewValue }}" class="text-tech"></${Pacem.P}-span>
<${Pacem.P}-markdown hide="{{ $pacem.isNullOrEmpty(^item.data.definition) || ^item.viewValue === ^item.data.definition }}" class="${Pacem.PCSS}-margin margin-0 text-small" value="{{ ^item.data.definition }}"></${Pacem.P}-markdown>
</template>
<${Pacem.P}-suggest placeholder="Placeholder" class="pacem-button button" disabled="{{ $pacem.isNull(:host.range) }}"
              on-change=":host.execCommand($this.value)"
              css-class="{{ {'text-primary': :host.isRelevant(:host.range)} }}" 
              compare-by="placeholder" text-property="placeholder" itemtemplate="{{ ::_itemtemplate }}" prevent-focus="true" allow-typing="false"></${Pacem.P}-suggest>`
                })
            ], PacemContenteditablePlaceholderElement);
            Scaffolding.PacemContenteditablePlaceholderElement = PacemContenteditablePlaceholderElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="utils.ts" />
/// <reference path="../contenteditable.ts" />
/// <reference path="types.ts" />
var Pacem;
(function (Pacem) {
    var Components;
    (function (Components) {
        var Scaffolding;
        (function (Scaffolding) {
            let PacemContenteditableWrapCommandElement = class PacemContenteditableWrapCommandElement extends Scaffolding.PacemContenteditableButtonCommandElement {
                isRelevant(range) {
                    return !Pacem.Utils.isNull(Scaffolding.ContenteditableUtils.findSurroundingNode(range, this.tagname));
                }
                exec() {
                    return new Promise((resolve, _) => {
                        const tagName = this.tagname;
                        if (!Pacem.Utils.isNullOrEmpty(tagName)) {
                            const range = this.range;
                            const alreadyEl = Scaffolding.ContenteditableUtils.findSurroundingNode(range, tagName)
                                || Scaffolding.ContenteditableUtils.findSurroundingNode(range.startContainer, tagName)
                                || Scaffolding.ContenteditableUtils.findSurroundingNode(range.endContainer, tagName);
                            if (Pacem.Utils.isNull(alreadyEl)) {
                                // WRAP
                                const elementsToWrap = Scaffolding.ContenteditableUtils.findSurroundingSiblingBlockElements(range);
                                if (!Pacem.Utils.isNullOrEmpty(elementsToWrap)) {
                                    const newChild = document.createElement(tagName);
                                    if (elementsToWrap.length === 1) {
                                        // replace
                                        const repl = elementsToWrap[0];
                                        range.setStart(repl, 0);
                                        range.setEnd(repl, repl.childNodes.length);
                                        const frag = range.extractContents();
                                        newChild.append(frag);
                                        Scaffolding.ContenteditableUtils.copyAttributes(newChild, repl);
                                        repl.parentElement.insertBefore(newChild, repl);
                                        repl.remove();
                                    }
                                    else {
                                        // wrap
                                        range.setStartBefore(elementsToWrap[0]);
                                        range.setEndAfter(elementsToWrap[elementsToWrap.length - 1]);
                                        const frag = range.extractContents();
                                        newChild.append(frag);
                                        range.insertNode(newChild);
                                    }
                                    const r = Scaffolding.ContenteditableUtils.select(newChild, true);
                                    r.collapse();
                                }
                            }
                            else {
                                // UNWRAP
                                range.setStart(alreadyEl, 0);
                                range.setEnd(alreadyEl, alreadyEl.childNodes.length);
                                // replace or unwrap
                                let replace = false;
                                const childNodes = alreadyEl.childNodes;
                                for (let j = 0; j < childNodes.length; j++) {
                                    const child = childNodes.item(j);
                                    if (!Scaffolding.ContenteditableUtils.isBlockElement(child)) {
                                        replace = true;
                                        break;
                                    }
                                }
                                if (replace) {
                                    const p = document.createElement('p');
                                    Scaffolding.ContenteditableUtils.copyAttributes(p, alreadyEl);
                                    p.append(range.extractContents());
                                    alreadyEl.parentNode.replaceChild(p, alreadyEl);
                                    const r = Scaffolding.ContenteditableUtils.select(p, true);
                                    r.collapse();
                                }
                                else {
                                    // unwrap
                                    alreadyEl.parentNode.replaceChild(range.extractContents(), alreadyEl);
                                    const r = Scaffolding.ContenteditableUtils.select(range.endContainer, true);
                                    r.collapse();
                                }
                            }
                        }
                        resolve();
                    });
                }
            };
            __decorate([
                Pacem.Watch({ converter: Pacem.PropertyConverters.String })
            ], PacemContenteditableWrapCommandElement.prototype, "tagname", void 0);
            PacemContenteditableWrapCommandElement = __decorate([
                Pacem.CustomElement({
                    tagName: Pacem.P + '-contenteditable-wrapcommand', shadow: Pacem.Defaults.USE_SHADOW_ROOT,
                    template: Scaffolding.CONTENTELEMENT_BUTTONCOMMAND_TEMPLATE
                })
            ], PacemContenteditableWrapCommandElement);
            Scaffolding.PacemContenteditableWrapCommandElement = PacemContenteditableWrapCommandElement;
        })(Scaffolding = Components.Scaffolding || (Components.Scaffolding = {}));
    })(Components = Pacem.Components || (Pacem.Components = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../../dist/js/swagger-types.d.ts" />
var Pacem;
(function (Pacem) {
    var Scaffolding;
    (function (Scaffolding) {
        var OpenApi;
        (function (OpenApi) {
            const ApiMethod = Pacem.Net.HttpMethod;
            class SwaggerParser {
                async load(url, headers) {
                    let resp = await fetch(url, {
                        mode: 'cors', credentials: 'omit', headers: headers
                    });
                    try {
                        let json = await resp.json();
                        return this.parse(json, url);
                    }
                    catch (e) {
                        return null;
                    }
                }
                _findDefinitionName(definitionHashTag) {
                    var pattern = /#\/definitions\/(.+)/;
                    var arr = pattern.exec(definitionHashTag);
                    if (arr == null || arr.length < 2)
                        return definitionHashTag;
                    return arr[1];
                }
                parse(content, url) {
                    let j = content;
                    if (typeof j === 'string') {
                        j = JSON.parse(j);
                    }
                    const json = j;
                    let definitions = {};
                    for (let def in json.definitions) {
                        let name = this._findDefinitionName(def);
                        definitions[name] = json.definitions[def];
                    }
                    let baseUrl = '';
                    if (json.host && json.schemes.length > 0) {
                        baseUrl = json.schemes[0] + '://' + json.host + json.basePath;
                    }
                    else if (url) {
                        // add scheme, host and basePath just-in-case
                        let parsed = /^(https?):\/\/([^\/]+)/.exec(url);
                        if (parsed && parsed.length) {
                            if (!(json.schemes) && parsed.length > 1) {
                                json.schemes = [parsed[1]];
                            }
                            if (!json.host && parsed.length > 2) {
                                json.host = parsed[2];
                                json.basePath = '';
                            }
                            baseUrl = parsed[0];
                        }
                    }
                    else {
                        console.warn('Not able to find a base url from the OpenApi specs.');
                    }
                    let retval = { endpoints: [], definitions: definitions, baseUrl: baseUrl };
                    for (let path in json.paths) {
                        let src = json.paths[path];
                        for (let method of [ApiMethod.Get, ApiMethod.Delete, ApiMethod.Post, ApiMethod.Put]) {
                            let op = src[method.toLowerCase()];
                            if (op) {
                                let endpoint = this._tryGetEndpoint(json, op, path, method);
                                retval.endpoints.push(endpoint);
                            }
                        }
                    }
                    return retval;
                }
                _tryGetEndpoint(json, op, path, method) {
                    return {
                        response: this._tryGetResponse(json, op),
                        path: path,
                        method: method,
                        parameters: this._tryGetParameters(json, op)
                    };
                }
                _translateType(type, format) {
                    switch (type) {
                        case 'number':
                        case 'integer':
                            return OpenApi.ApiParameterType.Number;
                        case 'boolean':
                            return OpenApi.ApiParameterType.Boolean;
                        case 'string':
                            switch (format) {
                                case 'date':
                                case 'date-time':
                                    return OpenApi.ApiParameterType.Datetime;
                                case 'byte':
                                    return OpenApi.ApiParameterType.Binary;
                                case 'binary':
                                    throw `Binary octets not supported.`;
                            }
                            return OpenApi.ApiParameterType.String;
                    }
                    return OpenApi.ApiParameterType.String;
                }
                _tryGetParameters(json, operation) {
                    return (operation.parameters || []).map(p => {
                        const pb = p;
                        let retval = {
                            name: pb.name,
                            required: pb.required || false
                        };
                        let type = p.type;
                        if (p.schema) {
                            let pbody = p;
                            retval.type = OpenApi.ApiParameterType.Object;
                            let name = retval.fullType = this._findDefinitionName(pbody.schema.$ref);
                            retval.meta = json.definitions[name];
                        }
                        else if (type) {
                            retval.type = this._translateType(type, p.format);
                        }
                        return retval;
                    });
                }
                _tryGetResponse(json, operation) {
                    let ok = operation.responses['200'];
                    if (!ok || !ok.schema)
                        return null;
                    let type = ok.schema.type || 'object', meta, name;
                    if (ok.schema.$ref) {
                        name = this._findDefinitionName(ok.schema.$ref);
                        meta = json.definitions[name];
                    }
                    else {
                        meta = ok.schema;
                        if (ok.schema.items) {
                            if (ok.schema.items.hasOwnProperty('$ref')) {
                                name = this._findDefinitionName(ok.schema.items.$ref);
                                meta = json.definitions[name];
                            }
                            else {
                                meta = ok.schema.items;
                            }
                        }
                    }
                    return { type: type, fullType: name, meta: meta };
                }
            }
            OpenApi.SwaggerParser = SwaggerParser;
        })(OpenApi = Scaffolding.OpenApi || (Scaffolding.OpenApi = {}));
    })(Scaffolding = Pacem.Scaffolding || (Pacem.Scaffolding = {}));
})(Pacem || (Pacem = {}));
/// <reference path="../../../../dist/js/pacem-core.d.ts" />
/// <reference path="../../../../dist/js/swagger-types.d.ts" />
var Pacem;
(function (Pacem) {
    var Scaffolding;
    (function (Scaffolding) {
        var OpenApi;
        (function (OpenApi) {
            ;
            let ApiParameterType;
            (function (ApiParameterType) {
                ApiParameterType["String"] = "string";
                ApiParameterType["Number"] = "number";
                ApiParameterType["Datetime"] = "datetime";
                ApiParameterType["Boolean"] = "boolean";
                ApiParameterType["Binary"] = "binary";
                ApiParameterType["Object"] = "object";
            })(ApiParameterType = OpenApi.ApiParameterType || (OpenApi.ApiParameterType = {}));
            const $refPattern = /^#\/definitions\/(.+)$/;
            function getOpenApiDefinition(manifest, $ref) {
                var rec = $refPattern.exec($ref);
                if (rec && rec.length > 1) {
                    return { name: rec[1], schema: manifest.definitions[rec[1]] };
                }
                return null;
            }
            OpenApi.getOpenApiDefinition = getOpenApiDefinition;
        })(OpenApi = Scaffolding.OpenApi || (Scaffolding.OpenApi = {}));
    })(Scaffolding = Pacem.Scaffolding || (Pacem.Scaffolding = {}));
})(Pacem || (Pacem = {}));
