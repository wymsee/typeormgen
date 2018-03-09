const { numberTypes, dateTypes } = require('./constants');

module.exports = function(info, tab) {
    let content = `${tab}static rules() {
${tab}${tab}return {
`;

    Object.keys(info).forEach(col => {
        content += `${tab.repeat(3)}${col}: ${getJoiRule(info[col])}
`;
    });
    content = content.slice(0, -1);
    content += `${tab.repeat(2)}};
${tab}}

`;
    return content;
};

function getJoiRule(info) {
    let rule;
    if (numberTypes.indexOf(info.type) > -1) {
        rule = 'joi.number()';
        if (info.type.indexOf('int') > -1) {
            rule += '.integer()';
        }
    } else if (dateTypes.indexOf(info.type) > -1) {
        rule = 'joi.date()';
    } else {
        rule = 'joi.string()';
        if (info.length && !Number.isNaN(info.length)) {
            rule += `.max(${info.length})`;
        }
    }

    if (info.nullable) {
        rule += '.allow(null)';
    }

    return rule += ',';
}
