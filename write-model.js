const fs = require('fs');

const numberTypes = ['int', 'tinyint', 'smallint', 'mediumint', 'bigint', 'float', 'double', 'real'];
const dateTypes = ['datetime', 'time', 'timestamp', 'date', 'year'];

module.exports = function(info, nconf) {
    const base = nconf.get('base');
    const model = nconf.get('model');
    const out = nconf.get('out');
    const table = nconf.get('table');
    const tabs = nconf.get('tabs');
    const tabSize = nconf.get('tabSize');

    const tab = tabs ? '\t' : ' '.repeat(tabSize);

    const hasDate = Object.keys(info).find(col => dateTypes.indexOf(info[col].type) > -1);
    let content = writeHead(table, model, base, hasDate);

    Object.keys(info).forEach(col => {
        content += writeColumn(col, info[col], tab);
    });

    content += writeRules(info, tab);

    content += writeFoot(model, tab);

    return fs.writeFileSync(out, content);
};

function writeHead(table, name, base, hasDate) {
    let content = `import { Column, Entity } from 'typeorm';
import * as joi from 'joi';
`;
    if (hasDate) {
        content += `import { Moment } from 'moment';
`;
    }

    content += `
@Entity('${table}')
export default class ${name} `;

    if (base) {
        content += `extends ${base} `;
    }
    content += `{
`;

    return content;
}

function writeColumn(col, info, tab) {
    let type = 'string';
    if (numberTypes.indexOf(info.type) > -1) {
        type = 'number';
    } else if (dateTypes.indexOf(info.type) > -1) {
        type = 'Moment | Date';
    }

    if (type === 'number' && col === 'id') {
        return `${tab}@PrimaryGeneratedColumn()
${tab}id: number;

`;
    }

    return `${tab}@Column('${info.type}')
${tab}${col}: ${type};

`;
}

function writeRules(info, tab) {
    let content = `${tab}static rules() {
${tab}${tab}return {
`;

    Object.keys(info).forEach(col => {
        content += `${tab.repeat(3)}${col}: ${getJoiRule(info)}
`;
    });

    content += `${tab.repeat(2)}};
${tab}}

`;
    return content;
}

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
        if (info.length) {
            rule += `.max(${info.length})`;
        }
    }

    if (info.nullable) {
        rule += '.allow(null)';
    }

    return rule += ';';
}

function writeFoot(model, tab) {
    return `${tab}constructor(props?: Partial<${model}>) {
${tab}${tab}super(props);
${tab}}
}

`;
}
