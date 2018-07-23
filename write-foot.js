module.exports = function(info, tab, conf) {
    let content = `${tab}constructor(props?: GenPartial<${conf.get('model')}>) {
${tab}${tab}super(props);
${tab}}
}
`;

    return content;
};
