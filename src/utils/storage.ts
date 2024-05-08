class StorageService {
  private readonly PREFIX = 'thoth';

  getToken(): string | null {
    return window.localStorage.getItem(`${this.PREFIX}_token`);
  }

  setToken(token: string): void {
    window.localStorage.setItem(`${this.PREFIX}_token`, token);
  }

  clearToken(): void {
    window.localStorage.removeItem(`${this.PREFIX}_token`);
  }
}

const storage = new StorageService();

export { storage };
