export const isExpired = (date) => new Date(date) < new Date();

export const toISODate = (date) => new Date(date).toISOString();
