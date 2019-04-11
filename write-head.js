const { boolTypes, dateTypes } = require('./constants');

module.exports = function(info, columns, baseInfo, conf) {
    const hasBool = Object.keys(info).find(col => {
        return (boolTypes.indexOf(info[col].type) > -1 && info[col].length === 1);
    });

    let hasDate = false;
    if (conf.get('moment')) {
        hasDate = Object.keys(info).find(col => {
            return dateTypes.indexOf(info[col].type) > -1;
        });
    }

    let hasDecimal = false;
    if (conf.get('big')) {
        hasDecimal = Object.keys(info).find(col => {
            return info[col].type === 'decimal';
        });
    }

    let content = '';
    if (hasDecimal) {
        content += `import { Big } from 'big.js';
`;
    }


    if (conf.get('rules')) {
        content += `import * as joi from 'joi';
`;
    }

    if (conf.get('moment') && hasDate) {
        content += `import { Moment } from 'moment';
`;
    }

    content += 'import { Column';
    if (columns.createDate) {
        content += ', CreateDateColumn';
    }
    content += ', Entity';
    if (columns.primary) {
        content += ', PrimaryColumn';
    }
    if (columns.primaryGenerated || columns.primaryGeneratedUUID) {
        content += ', PrimaryGeneratedColumn';
    }
    if (columns.updateDate) {
        content += ', UpdateDateColumn';
    }
    if (columns.version) {
        content += ', VersionColumn';
    }
    if (conf.get('browser')) {
        content += ` } from 'typeorm/browser';
`;
    } else {
        content += ` } from 'typeorm';
`;
    }


    content += 'import { GenPartial';
    if (hasDecimal || hasBool || hasDate) {
        content += ', ';
    } else {
        content += ' ';
    }

    if (hasDecimal) {
        content += 'bigTransformer';

        if (hasBool || hasDate) {
            content += ', ';
        } else {
            content += ' ';
        }
    }

    if (hasBool) {
        content += 'booleanTransformer';

        if (hasDate) {
            content += ', ';
        } else {
            content += ' ';
        }
    }

    if (hasDate) {
        content += `momentTransformer `;
    }

    content += `} from '@synconset/typeormutils';
`;

    if (baseInfo) {
        content += `
import ${baseInfo.name} from '${baseInfo.path}';
`;
    }

    content += `
@Entity('${conf.get('table')}')
export${conf.get(' default ') ? 'default' : '  '}class ${conf.get('model')} `;

    if (baseInfo) {
        content += `extends ${baseInfo.name} `;
    }

    content += `{
`;

    return content;
};
