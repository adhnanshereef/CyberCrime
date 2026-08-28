import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-language-select',
  imports: [],
  template: `
    <div class="min-h-screen bg-background text-on-background flex flex-col font-primary">
      <main class="flex-grow flex flex-col items-center max-w-container-max-width mx-auto w-full px-6 pt-12 pb-32">
        
        <header class="text-center mb-10 w-full">
          <h1 class="text-4xl md:text-5xl font-bold text-primary mb-3">
            {{ languageService.screens().languageSelectTitle }}
          </h1>
          @if (languageService.activeLanguage().code !== 'en') {
            <p class="text-lg text-text-secondary font-sans">Select your language</p>
          }
        </header>
        
        <div class="w-full max-w-xl mx-auto flex flex-col gap-4">
          @for (lang of languageService.languages; track lang.code) {
            <button 
              type="button" 
              class="flex justify-between items-center p-6 border-2 rounded-2xl transition-all duration-200 cursor-pointer w-full text-left font-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
              [class.border-primary]="lang.code === selectedLanguageCode()"
              [class.bg-primary-container]="lang.code === selectedLanguageCode()"
              [class.text-on-primary]="lang.code === selectedLanguageCode()"
              [class.border-transparent]="lang.code !== selectedLanguageCode()"
              [class.bg-surface]="lang.code !== selectedLanguageCode()"
              [class.shadow-md]="lang.code !== selectedLanguageCode()"
              [class.shadow-lg]="lang.code === selectedLanguageCode()"
              [class.-translate-y-1]="lang.code === selectedLanguageCode()"
              (click)="selectLanguage(lang.code)">
              
              <span class="text-2xl font-bold">{{ lang.nativeLabel }}</span>
              <span class="text-lg font-sans" 
                    [class.text-on-primary]="lang.code === selectedLanguageCode()"
                    [class.opacity-80]="lang.code === selectedLanguageCode()"
                    [class.text-text-secondary]="lang.code !== selectedLanguageCode()">
                {{ lang.label }}
              </span>
            </button>
          }
        </div>
      </main>

      <div class="fixed bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
        
        <div class="flex bg-surface rounded-full overflow-hidden w-full max-w-sm shadow-xl border border-border pointer-events-auto">
          <button class="flex items-center justify-center px-6 py-4 bg-transparent text-primary hover:bg-surface-container-low transition-colors border-r border-border" (click)="goBack()" aria-label="Go back">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <button class="flex-1 bg-transparent text-primary font-bold text-xl hover:bg-surface-container-low transition-colors" (click)="goNext()">
            Next
          </button>
        </div>
      </div>
    </div>
  `
})
export class LanguageSelectComponent {
  protected readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  
  protected readonly selectedLanguageCode = signal(this.languageService.activeLanguage().code);

  protected selectLanguage(code: string): void {
    this.selectedLanguageCode.set(code);
  }

  protected goBack(): void {
    this.location.back();
  }

  protected goNext(): void {
    this.languageService.setLanguage(this.selectedLanguageCode());
    this.router.navigate(['/complaint-type']);
  }
}
