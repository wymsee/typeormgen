module.exports = function(info, tab, conf) {
    let content = `${tab}constructor(props?: GenPartial<${conf.get('model')}>) {
`;
    if (conf.get('base')) {
        content += `${tab}${tab}super(props);
`;
    } else {
        content += `${tab}${tab}this.assign(props);
`;
    }

    content += `${tab}}
}`;
    return content;
};
