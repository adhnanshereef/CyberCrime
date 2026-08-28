import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LanguageService } from './core/services/language.service';
import { UiStateService } from './core/services/ui-state.service';
import { ComplaintStateService } from './core/services/complaint-state.service';

@Component({
  imports: [NgOptimizedImage, RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  encapsulation: ViewEncapsulation.None,
})
export class App {
  protected readonly languageService = inject(LanguageService);
  protected readonly uiState = inject(UiStateService);
  protected readonly stateService = inject(ComplaintStateService);
  private readonly router = inject(Router);
  
  protected readonly isFlowRoute = signal(false);
  
  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // If we are not on the root path, we are in the flow
      this.isFlowRoute.set(event.urlAfterRedirects !== '/');
    });
  }
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

  protected selectType(type: 'women' | 'fraud'): void {
    this.closeMenus();
    if (type === 'fraud') {
      this.router.navigate(['/urgency']);
    } else if (type === 'women') {
      this.stateService.updateDraft({ isAnonymous: true, mobileNumber: 'Anonymous' } as any);
      this.router.navigate(['/what-happened']);
    }
  }

  protected closeMenus(): void {
    this.isMenuOpen.set(false);
    this.isComplaintMenuOpen.set(false);
    this.isLanguageMenuOpen.set(false);
  }
}
