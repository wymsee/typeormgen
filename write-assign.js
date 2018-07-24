const { boolTypes, dateTypes } = require('./constants');

module.exports = function(info, tab, conf) {
    let content = `${tab}assign(props?: GenPartial<${conf.get('model')}>) {
${tab}${tab}super.assign(props);
`;

    let transformers = '';
    Object.keys(info).forEach(name => {
        const col = info[name];
        if (boolTypes.indexOf(col.type) > -1 && col.length === 1) {
            transformers += `${tab.repeat(3)}if (typeof props.${name} !== 'undefined') {
${tab.repeat(4)}this.${name} = booleanTransformer.from(props.${name});
${tab.repeat(3)}}
`;
        } else if (dateTypes.indexOf(col.type) > -1) {
            if (conf.get('moment')) {
                transformers += `${tab.repeat(3)}if (typeof props.${name} !== 'undefined') {
${tab.repeat(4)}this.${name} = momentTransformer.from(props.${name});
${tab.repeat(3)}}
`;
            } else {
                transformers += `${tab.repeat(3)}if (typeof props.${name} !== 'undefined') {
${tab.repeat(4)}this.${name} = new Date(props.${name});
${tab.repeat(3)}}
`;
            }
        } else if (conf.get('big') && col.type === 'decimal') {
            transformers += `${tab.repeat(3)}if (typeof props.${name} !== 'undefined') {
${tab.repeat(4)}this.${name} = bigTransformer.from(props.${name});
${tab.repeat(3)}}
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
    
`;

    return content;
};
