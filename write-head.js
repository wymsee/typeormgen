module.exports = function(table, name, columns, baseInfo, hasDate, rules) {
    let content = '';
    if (rules) {
        content += `import * as joi from 'joi';
`;
    }

    if (hasDate) {
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
    content += ` } from 'typeorm';
`;


    if (hasDate) {
        content += `import { momentTransformer } from 'typeormgen';
`;
    }

    if (baseInfo) {
        content += `
import ${baseInfo.name} from '${baseInfo.path}';
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
