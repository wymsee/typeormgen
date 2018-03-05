const fs = require('fs');
const path = require('path');

module.exports = function(base, out) {
    const content = fs.readFileSync(base, { encoding: 'utf-8' });

    let relative = path.relative(out, base);
    if (/\.\.\/\.\.\//.test(relative)) {
        relative = relative.slice(3);
    } else {
        relative = relative.slice(1);
    }

    const index = relative.search(/\.(j|t)sx?/);
    relative = relative.slice(0, index - relative.length);

    const matches = /class\s+(\w+)(\s+extends\s+\w+)?\s+{/.exec(content);

    if (!matches || !matches[1]) {
        throw new Error('Could not parse a class name out of the base file.  Are you sure this file contains a javascript or typescript class?');
    }

    return {
        name: matches[1],
        path: relative
    };
};
