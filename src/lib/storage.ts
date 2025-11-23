type StorageKey = 'presgen-saved-gifts' | 'presgen-saved-recipients' | 'presgen-current-gift-data';

export function getStorageItem<T>(key: StorageKey): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function setStorageItem<T>(key: StorageKey, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
  }
}

export function removeStorageItem(key: StorageKey): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(key);
}

