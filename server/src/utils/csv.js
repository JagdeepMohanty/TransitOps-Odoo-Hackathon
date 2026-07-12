const { Parser } = require('json2csv');

const exportToCsv = (fields, data) => {
  const parser = new Parser({ fields });
  return parser.parse(data);
};

module.exports = { exportToCsv };
