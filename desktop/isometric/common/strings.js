export const isEmptyOrNull = string => {
  return !string || !string.trim();
};

export const toDate = string => {
  if (!string) {
    return null;
  }

  const date = new Date(string);
  return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
};
