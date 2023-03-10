var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { getCharacterLength, setIcon } from '../common/utils';
const { prefix } = config;
const name = `${prefix}-input`;
let Input = class Input extends SuperComponent {
    constructor() {
        super(...arguments);
        this.options = {
            multipleSlots: true,
        };
        this.externalClasses = [
            'class',
            `${prefix}-class`,
            `${prefix}-class-prefix-icon`,
            `${prefix}-class-label`,
            `${prefix}-class-input`,
            `${prefix}-class-clearable`,
            `${prefix}-class-suffix`,
            `${prefix}-class-suffix-icon`,
            `${prefix}-class-tips`,
        ];
        this.behaviors = ['wx://form-field'];
        this.properties = props;
        this.data = {
            prefix,
            classPrefix: name,
            classBasePrefix: prefix,
        };
        this.lifetimes = {
            ready() {
                const { value } = this.properties;
                this.updateValue(value);
            },
        };
        this.observers = {
            prefixIcon(prefixIcon) {
                const obj = setIcon('prefixIcon', prefixIcon, '');
                this.setData(Object.assign({}, obj));
            },
            suffixIcon(suffixIcon) {
                const obj = setIcon('suffixIcon', suffixIcon, '');
                this.setData(Object.assign({}, obj));
            },
            clearable(clearable) {
                const obj = setIcon('clearable', clearable, 'close-circle-filled');
                this.setData(Object.assign({}, obj));
            },
        };
        this.methods = {
            updateValue(value) {
                const { maxcharacter, maxlength } = this.properties;
                if (maxcharacter && maxcharacter > 0 && !Number.isNaN(maxcharacter)) {
                    const { length, characters } = getCharacterLength('maxcharacter', value, maxcharacter);
                    this.setData({
                        value: characters,
                        count: length,
                    });
                }
                else if (maxlength > 0 && !Number.isNaN(maxlength)) {
                    const { length, characters } = getCharacterLength('maxlength', value, maxlength);
                    this.setData({
                        value: characters,
                        count: length,
                    });
                }
                else {
                    this.setData({
                        value,
                        count: value ? String(value).length : 0,
                    });
                }
            },
            onInput(e) {
                const { value, cursor, keyCode } = e.detail;
                this.updateValue(value);
                this.triggerEvent('change', { value: this.data.value, cursor, keyCode });
            },
            onFocus(e) {
                this.triggerEvent('focus', e.detail);
            },
            onBlur(e) {
                this.triggerEvent('blur', e.detail);
            },
            onConfirm(e) {
                this.triggerEvent('enter', e.detail);
            },
            onSuffixClick() {
                this.triggerEvent('click', { trigger: 'suffix' });
            },
            onSuffixIconClick() {
                this.triggerEvent('click', { trigger: 'suffix-icon' });
            },
            clearInput(e) {
                this.triggerEvent('clear', e.detail);
                this.setData({ value: '' });
            },
            onKeyboardHeightChange(e) {
                this.triggerEvent('keyboardheightchange', e.detail);
            },
        };
    }
};
Input = __decorate([
    wxComponent()
], Input);
export default Input;
