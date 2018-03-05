const fs = require('fs');
const { numberTypes, dateTypes } = require('./constants');
const readBase = require('./read-base');
const writeRules = require('./write-rules');

module.exports = function(info, nconf) {
    const base = nconf.get('base');
    const model = nconf.get('model');
    const moment = nconf.get('moment');
    const out = nconf.get('out');
    const rules = nconf.get('rules');
    const table = nconf.get('table');
    const tabs = nconf.get('tabs');
    const tabSize = nconf.get('tabSize');

    const tab = tabs ? '\t' : ' '.repeat(tabSize);

    let baseInfo = null;
    if (base) {
        baseInfo = readBase(base, out);
    }

    let hasDate = false;
    if (moment) {
        hasDate = Object.keys(info).find(col => dateTypes.indexOf(info[col].type) > -1);
    }
    let content = writeHead(table, model, baseInfo, hasDate, rules);

    Object.keys(info).forEach(col => {
        content += writeColumn(col, info[col], tab, moment);
    });

    if (nconf.get('rules')) {
        content += writeRules(info, tab);
    }

    content += writeFoot(model, tab);

    return fs.writeFileSync(out, content);
};

function writeHead(table, name, baseInfo, hasDate, rules) {
    let content = `import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
`;
    if (rules) {
        content += `import * as joi from 'joi';
`;
    }

    if (hasDate) {
        content += `import { Moment } from 'moment';
`;
    }

    if (baseInfo) {
        content += `import ${baseInfo.name} from '${baseInfo.path}'
`;
    }

    content += `
@Entity('${table}')
export default class ${name} `;

    if (baseInfo) {
        content += `extends ${baseInfo.name} `;
    }

    content += `{
`;

    return content;
}

function writeColumn(col, info, tab, moment) {
    let type = 'string';
    if (numberTypes.indexOf(info.type) > -1) {
        type = 'number';
    } else if (dateTypes.indexOf(info.type) > -1) {
        if (moment) {
            type = 'Moment | Date';
        } else {
            type = 'Date';
        }
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

function writeFoot(model, tab) {
    return `${tab}constructor(props?: Partial<${model}>) {
${tab}${tab}super(props);
${tab}}
}

`;
}
