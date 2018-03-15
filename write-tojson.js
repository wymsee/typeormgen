const { forbiddenExportCols } = require('./constants');

module.exports = function(info, tab) {
	let content = `${tab}toJSON() {
${tab.repeat(2)}return {
`;
	
	Object.keys(info).forEach(col => {
		if (forbiddenExportCols.indexOf(col) == -1) {
			content += `${tab.repeat(3)}${col}: this.${col},
`;
		}
	});
	content = content.slice(0, -2);
	content += '\n';
	content += `${tab.repeat(2)}};
${tab}}

`;
	return content;
};
