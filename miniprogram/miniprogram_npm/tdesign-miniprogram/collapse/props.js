const props = {
    style: {
        type: String,
        value: '',
    },
    defaultExpandAll: {
        type: Boolean,
        value: false,
    },
    disabled: {
        type: Boolean,
    },
    expandIcon: {
        type: Boolean,
        value: true,
    },
    expandMutex: {
        type: Boolean,
        value: false,
    },
    theme: {
        type: String,
        value: 'default',
    },
    value: {
        type: Array,
        value: null,
    },
    defaultValue: {
        type: Array,
        value: [],
    },
};
export default props;
