export const isTextValid = (string: string): boolean => {
  if (!string.trim()) {
    return false;
  }

  if (/[a-zA-Z\d]/.test(string)) {
    if (!string.includes("ID") && !string.includes("IP")) {
      return false;
    }
  }

  if (string.includes("||")) {
    return false;
  }

  if (string.includes(" | ")) {
    return false;
  }

  if (string.includes(" ? ")) {
    return false;
  }

  if (string.includes(",")) {
    return false;
  }

  if (string.includes(" | ")) {
    return false;
  }

  return true;
};
