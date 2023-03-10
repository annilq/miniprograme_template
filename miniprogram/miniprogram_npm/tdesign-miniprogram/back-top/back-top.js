var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
const { prefix } = config;
const name = `${prefix}-back-top`;
let BackTop = class BackTop extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [`${prefix}-class`, `${prefix}-class-icon`, `${prefix}-class-text`];
        this.options = {
            multipleSlots: true,
        };
        this.properties = props;
        this.relations = {
            '../pull-down-refresh/pull-down-refresh': {
                type: 'ancestor',
            },
        };
        this.data = {
            prefix,
            classPrefix: name,
        };
        this.observers = {
            icon() {
                this.setIcon();
            },
        };
        this.lifetimes = {
            ready() {
                this.setIcon();
            },
        };
        this.methods = {
            setIcon() {
                const { icon } = this.properties;
                if (!icon) {
                    this.setData({ iconName: '', iconData: {} });
                }
                else if (typeof icon === 'string') {
                    this.setData({
                        iconName: icon,
                        iconData: {},
                    });
                }
                else if (typeof icon === 'object') {
                    this.setData({
                        iconName: '',
                        iconData: icon,
                    });
                }
                else {
                    this.setData({ iconName: 'backtop', iconData: {} });
                }
            },
            toTop() {
                var _a;
                this.triggerEvent('to-top');
                if (this.$parent) {
                    (_a = this.$parent) === null || _a === void 0 ? void 0 : _a.setScrollTop(0);
                }
                else {
                    wx.pageScrollTo({
                        scrollTop: 0,
                        duration: 300,
                    });
                }
            },
        };
    }
};
BackTop = __decorate([
    wxComponent()
], BackTop);
export default BackTop;
