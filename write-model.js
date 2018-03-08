const fs = require('fs-extra');
const { numberTypes, dateTypes } = require('./constants');
const readBase = require('./read-base');
const writeHead = require('./write-head');
const writeRules = require('./write-rules');

function hasColumn(column, info) {
    return Object.keys(info).find(col => col === column);
}

module.exports = function(info, nconf) {
    const base = nconf.get('base');
    const model = nconf.get('model');
    const moment = nconf.get('moment');
    const out = nconf.get('out');
    const rules = nconf.get('rules');
    const table = nconf.get('table');
    const tabs = nconf.get('tabs');
    const tabSize = nconf.get('tabSize');
    const columns = {
        primaryGenerated: hasColumn(nconf.get('primaryGeneratedColumn'), info),
        primaryGeneratedUUID: hasColumn(nconf.get('primaryGeneratedColumnUUID'), info),
        primary: hasColumn(nconf.get('primaryColumn'), info),
        createDate: hasColumn(nconf.get('createDateColumn'), info),
        updateDate: hasColumn(nconf.get('updateDateColumn'), info),
        version: hasColumn(nconf.get('versionColumn'), info)
    };

    const tab = tabs ? '\t' : ' '.repeat(tabSize);

    let baseInfo = null;
    if (base) {
        baseInfo = readBase(base, out);
    }

    let hasDate = false;
    if (moment) {
        hasDate = Object.keys(info).find(col => dateTypes.indexOf(info[col].type) > -1);
    }
    let content = writeHead(table, model, columns, baseInfo, hasDate, rules);

    Object.keys(info).forEach(col => {
        content += writeColumn(col, info[col], tab, columns, moment);
    });

    if (nconf.get('rules')) {
        content += writeRules(info, tab);
    }

    content += writeFoot(model, tab);

    return fs.outputFileSync(out, content);
};

function writeColumn(col, info, tab, columns, moment) {
    let options = `'${info.type}'`;

    let type = 'string';
    if (numberTypes.indexOf(info.type) > -1) {
        type = 'number';
    } else if (dateTypes.indexOf(info.type) > -1) {
        if (moment) {
            type = 'Moment';
            options = `{ type: '${info.type}', transformer: momentTransformer }`;
        } else {
            type = 'Date';
        }
    }

    let decorator = '@Column';
    if (columns.primaryGenerated === col) {
        decorator = '@PrimaryGeneratedColumn';
        options = '';
    } else if (columns.primaryGeneratedUUID === col) {
        decorator = `@PrimaryGeneratedColumn`;
        options = `'uuid'`;
    } else if (columns.primaryColumn === col) {
        decorator = '@PrimaryColumn';
    } else if (columns.createDate === col) {
        decorator = '@CreateDateColumn';
    } else if (columns.updateDate === col) {
        decorator = '@UpdateDateColumn';
    } else if (columns.version === col) {
        decorator = '@VersionColumn';
    }

    return `${tab}${decorator}(${options})
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
