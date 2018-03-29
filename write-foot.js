const { boolTypes, dateTypes } = require('./constants');

module.exports = function(info, tab, conf) {
    let content = `${tab}constructor(props?: GenPartial<${conf.get('model')}>) {
${tab}${tab}super(props);
`;

    let transformers = '';
    Object.keys(info).forEach(name => {
        const col = info[name];
        if (boolTypes.indexOf(col.type) > -1 && col.length === 1) {
            transformers += `${tab.repeat(3)}this.${name} = booleanTransformer.from(props.${name});
`;
        } else if (dateTypes.indexOf(col.type) > -1) {
            if (conf.get('moment')) {
                transformers += `${tab.repeat(3)}this.${name} = momentTransformer.from(props.${name});
`;
            } else {
                transformers += `${tab.repeat(3)}if (props.${name}) {
${tab.repeat(3)}this.${name} = new Date(props.${name});
${tab.repeat(2)}}
`;
            }
        } else if (conf.get('big') && col.type === 'decimal') {
            transformers += `${tab.repeat(3)}this.${name} = bigTransformer.from(props.${name});
`;
        }
    });

    if (transformers !== '') {
        content += `
${tab.repeat(2)}if (props) {
${transformers}${tab.repeat(2)}}
`;
    }

    content += `${tab}}
}
`;

    return content;
};
