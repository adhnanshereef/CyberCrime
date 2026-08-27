import { Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LanguageService } from './core/services/language.service';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly languageService = inject(LanguageService);
  protected readonly isMenuOpen = signal(false);
  protected readonly isComplaintMenuOpen = signal(false);
  protected readonly isLanguageMenuOpen = signal(false);
  protected readonly languageSearch = signal('');
  protected readonly filteredLanguages = computed(() => {
    const search = this.languageSearch().trim().toLocaleLowerCase();
    return this.languageService.languages.filter((language) =>
      `${language.label} ${language.nativeLabel}`.toLocaleLowerCase().includes(search),
    );
  });

  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
    this.isComplaintMenuOpen.set(false);
    this.isLanguageMenuOpen.set(false);
  }

  protected toggleComplaintMenu(): void {
    this.isComplaintMenuOpen.update((isOpen) => !isOpen);
    this.isLanguageMenuOpen.set(false);
  }

  protected toggleLanguageMenu(): void {
    this.isLanguageMenuOpen.update((isOpen) => !isOpen);
    this.isComplaintMenuOpen.set(false);
  }

  protected onLanguageInput(event: Event): void {
    this.languageSearch.set((event.target as HTMLInputElement).value);
  }

  protected selectLanguage(code: string): void {
    this.languageService.setLanguage(code);
    this.isLanguageMenuOpen.set(false);
    this.languageSearch.set('');
  }

  protected closeMenus(): void {
    this.isMenuOpen.set(false);
    this.isComplaintMenuOpen.set(false);
    this.isLanguageMenuOpen.set(false);
  }
}
