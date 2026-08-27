import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LANGUAGES, LanguageConfig } from '../config/languages.config';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'complaint-language';
  private readonly selectedCode = signal(this.readStoredLanguage());

  readonly languages = LANGUAGES;
  readonly activeLanguage = computed<LanguageConfig>(() =>
    LANGUAGES.find((language) => language.code === this.selectedCode()) ?? LANGUAGES[0],
  );

  readonly navigation = computed(() => this.activeLanguage().navigation);

  constructor() {
    this.setLanguage(this.selectedCode());
  }

  private readStoredLanguage(): string {
    try {
      const storedCode = this.document.defaultView?.localStorage.getItem(this.storageKey);
      return LANGUAGES.some((language) => language.code === storedCode) ? storedCode ?? 'en' : 'en';
    } catch {
      return 'en';
    }
  }

  setLanguage(code: string): void {
    const language = LANGUAGES.find((entry) => entry.code === code);
    if (!language) {
      return;
    }

    this.selectedCode.set(language.code);
    try {
      this.document.defaultView?.localStorage.setItem(this.storageKey, language.code);
    } catch {
      // Language selection still works when storage is unavailable.
    }
    this.document.documentElement.style.setProperty('--font-primary', language.fontStack);
    this.document.documentElement.dataset['language'] = language.code;
    this.document.documentElement.lang = language.code;
    this.document.documentElement.dir = language.direction;
  }
}
