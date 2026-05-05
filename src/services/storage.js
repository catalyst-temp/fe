const prefix = "bisnis-online:";

export function loadStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(`${prefix}${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStorage(key, value) {
  window.localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
}
