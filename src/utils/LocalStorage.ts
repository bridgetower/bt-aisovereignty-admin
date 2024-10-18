export class LocalStorageService {
  static setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  static getItem(key: string) {
    const value = localStorage.getItem(key);
    return value ?? null;
  }
  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
  static clear() {
    localStorage.clear();
  }
  static removeItems(keys: string[]) {
    keys.forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
