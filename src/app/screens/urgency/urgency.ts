import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-urgency',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-background flex items-center justify-center p-6 pt-24 pb-32">
      <main class="w-full max-w-lg bg-surface border-2 border-urgent rounded-3xl p-8 md:p-10 text-center shadow-2xl relative overflow-hidden">
        
        <!-- Subtle urgent background glow -->
        <div class="absolute top-0 left-0 w-full h-2 bg-urgent"></div>
        
        <div class="w-20 h-20 bg-urgent text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-6 shadow-lg shadow-urgent/30">
          !
        </div>
        
        <h1 class="text-3xl md:text-4xl font-bold text-urgent mb-4 leading-tight">
          {{ languageService.screens().urgencyTitle }}
        </h1>
        <p class="text-xl text-text-primary mb-8 leading-relaxed font-sans">
          {{ languageService.screens().urgencyDesc }}
        </p>
        
        @if (languageService.activeLanguage().code !== 'en') {
          <div class="bg-surface-container-low p-4 rounded-xl mb-8 border border-border">
            <p class="text-sm font-bold text-text-secondary mb-1">Money lost just now?</p>
            <p class="text-xs text-text-secondary font-sans">If money was just taken, call 1930 immediately to block the transaction and reduce damage.</p>
          </div>
        }

        <div class="flex flex-col gap-5">
          @if (!hasCalled()) {
            <!-- Initial State -->
            <a class="flex items-center justify-center gap-3 bg-urgent text-white no-underline p-5 rounded-2xl text-2xl font-bold w-full shadow-lg hover:scale-[1.02] transition-transform" href="tel:1930" (click)="onCallClicked()">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {{ languageService.screens().call1930 }}
            </a>

            <div class="relative text-center my-2">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-border"></div></div>
              <span class="relative bg-surface px-4 text-text-secondary font-bold text-sm">OR</span>
            </div>

            <a class="block bg-surface text-text-primary border-2 border-border no-underline p-4 rounded-xl text-lg font-bold transition-colors hover:border-text-primary hover:bg-surface-container-low" routerLink="/login">
              {{ languageService.screens().continueFiling }}
            </a>
            @if (languageService.activeLanguage().code !== 'en') {
              <span class="text-xs text-text-secondary -mt-3 font-sans">Continue registering case after calling</span>
            }

          } @else {
            <!-- Post-Call State -->
            <a class="block bg-primary text-white no-underline p-5 rounded-2xl text-xl font-bold w-full shadow-lg hover:scale-[1.02] transition-transform animate-pulse-once" routerLink="/login">
              {{ languageService.screens().continueFiling }}
              <svg class="inline-block ml-2 -mt-1" aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            @if (languageService.activeLanguage().code !== 'en') {
              <span class="text-xs text-text-secondary -mt-3 font-sans">Continue registering case after calling</span>
            }

            <div class="relative text-center my-2">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-border"></div></div>
              <span class="relative bg-surface px-4 text-text-secondary font-bold text-sm">OR</span>
            </div>

            <a class="flex items-center justify-center gap-3 bg-surface text-urgent border-2 border-urgent no-underline p-4 rounded-xl text-lg font-bold w-full hover:bg-urgent/10 transition-colors" href="tel:1930">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Call 1930 Again
            </a>
          }
        </div>
      </main>

      <div class="fixed bottom-0 left-0 right-0 p-6 flex items-center bg-gradient-to-t from-background to-transparent z-10 pointer-events-none">
        <button class="w-14 h-14 rounded-full bg-surface text-text-primary border-2 border-border flex items-center justify-center cursor-pointer shadow-md hover:bg-surface-container-low hover:scale-105 transition-all pointer-events-auto" (click)="goBack()" aria-label="Go back">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>
    </div>
  `,
  styles: `
    @keyframes pulse-once {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(140, 54, 0, 0.7); }
      50% { transform: scale(1.02); box-shadow: 0 0 0 15px rgba(140, 54, 0, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(140, 54, 0, 0); }
    }
    .animate-pulse-once {
      animation: pulse-once 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `
})
export class UrgencyComponent {
  protected readonly languageService = inject(LanguageService);
  private readonly location = inject(Location);
  
  protected hasCalled = signal(false);

  protected onCallClicked() {
    this.hasCalled.set(true);
  }

  protected goBack(): void {
    this.location.back();
  }
}
