import { Parser } from 'json2csv';

export const exportToCsv = (fields, data) => {
  const parser = new Parser({ fields });
  return parser.parse(data);
};
