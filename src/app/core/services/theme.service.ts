import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'cfm_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(this.getInitialValue());

  constructor() {
    this.applyTheme(this.isDark());
  }

  toggle(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    this.applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  }

  private applyTheme(dark: boolean): void {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  private getInitialValue(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
