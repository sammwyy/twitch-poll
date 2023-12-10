import { VERSION } from "./constants";

function clearPersistentData() {
  localStorage.clear();
}

function mustForget(key: string) {
  const rawVersion = localStorage.getItem(key + "_version");

  if (rawVersion == null || parseInt(rawVersion) != VERSION) {
    return true;
  }

  return false;
}

function load<V>(key: string): V | null {
  const rawSettings = localStorage.getItem(key);
  const value = rawSettings ? JSON.parse(rawSettings) : null;
  return value ? (value as V) : null;
}

export function tryLoad<V>(key: string) {
  if (mustForget(key)) {
    clearPersistentData();
    return null;
  }

  return load<V>(key);
}

export function save(key: string, value: unknown) {
  const rawSettings = JSON.stringify(value);
  localStorage.setItem(key, rawSettings);
  localStorage.setItem(key + "_version", VERSION.toString());
}
