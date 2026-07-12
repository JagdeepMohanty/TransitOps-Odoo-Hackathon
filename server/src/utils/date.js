const isExpired = (date) => new Date(date) < new Date();

const toISODate = (date) => new Date(date).toISOString();

module.exports = { isExpired, toISODate };
