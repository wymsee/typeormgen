const fs = require('fs-extra');
const { boolTypes, numberTypes, dateTypes } = require('./constants');
const readBase = require('./read-base');
const writeAssign = require('./write-assign');
const writeFoot = require('./write-foot');
const writeHead = require('./write-head');
const writeRules = require('./write-rules');
const writeTojson = require('./write-tojson');

function hasColumn(column, info) {
    return Object.keys(info).find(col => col === column);
}

module.exports = function(info, nconf) {
    const base = nconf.get('base');
    const out = nconf.get('out');
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

    let content = writeHead(info, columns, baseInfo, nconf);

    Object.keys(info).forEach(col => {
        content += writeColumn(col, info[col], tab, columns, nconf);
    });

    if (nconf.get('rules')) {
        content += writeRules(info, tab);
    }

    if (nconf.get('toJSON')) {
        content += writeTojson(info, tab);
    }

    content += writeAssign(info, tab, nconf);
    content += writeFoot(info, tab, nconf);

    return fs.outputFileSync(out, content);
};

function writeColumn(col, info, tab, columns, conf) {
    let options = `'${info.type}'`;

    let type = 'string';
    if (boolTypes.indexOf(info.type) > -1 && info.length === 1) {
        type = 'boolean';
        options = `{ type: '${info.type}', transformer: booleanTransformer }`;
    } else if (numberTypes.indexOf(info.type) > -1) {
        type = 'number';
    } else if (dateTypes.indexOf(info.type) > -1) {
        if (conf.get('moment')) {
            type = 'Moment';
            options = `{ type: '${info.type}', transformer: momentTransformer }`;
        } else {
            type = 'Date';
        }
    } else if (conf.get('big') && info.type === 'decimal') {
        type = 'Big';
        options = `{ type: '${info.type}', transformer: bigTransformer }`;
    }

    let decorator = '@Column';
    if (columns.primaryGenerated === col) {
        decorator = '@PrimaryGeneratedColumn';
        options = '';
    } else if (columns.primaryGeneratedUUID === col) {
        decorator = `@PrimaryGeneratedColumn`;
        options = `'uuid'`;
    } else if (columns.primary === col) {
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
