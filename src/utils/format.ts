export const isTextValid = (string: string): boolean => {
  if (!string.trim()) {
    return false;
  }

  if (/[a-zA-Z]/.test(string)) {
    return false;
  }

  if (string.includes("||")) {
    return false;
  }

  if (string.includes(" | ")) {
    return false;
  }

  return true;
};
