export function readStorage(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key);

    if (rawValue === null) {
      return fallbackValue;
    }

    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
}

export function readPlainStorage(key, fallbackValue = null) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export function writePlainStorage(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    return;
  }
}