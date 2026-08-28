import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { ComplaintStateService } from '../../core/services/complaint-state.service';

@Component({
  selector: 'app-complaint-type',
  template: `
    <div class="min-h-screen bg-background text-on-background flex flex-col font-primary">
      <main class="flex-grow flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-6 pt-12 pb-32">
        
        <header class="text-center mb-10 w-full">
          <h1 class="text-4xl md:text-5xl font-bold text-primary mb-3">
            What are you reporting?
          </h1>
          <p class="text-xl text-text-secondary font-sans">
            Choose the category that best describes your situation.
          </p>
        </header>

        <div class="flex flex-col sm:flex-row items-stretch gap-6 w-full">
          <!-- Anonymous / Women / Children -->
          <button type="button" class="group flex-1 flex flex-col items-center justify-center text-center p-8 bg-surface border-2 border-transparent rounded-3xl transition-all duration-300 hover:border-primary hover:-translate-y-2 hover:shadow-2xl shadow-sm outline-none focus-visible:ring-4 focus-visible:ring-primary-container" (click)="selectType('women')">
            <div class="w-24 h-24 mb-6 rounded-full bg-surface-container-highest text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 class="text-3xl font-bold text-primary mb-2">{{ languageService.screens().reportAnonymously }}</h2>
            <p class="text-lg text-text-secondary font-sans">{{ languageService.screens().reportAnonymouslyDesc }}</p>
            
            @if (languageService.activeLanguage().code !== 'en') {
              <div class="w-full mt-6 pt-6 border-t border-border flex flex-col gap-1">
                <span class="text-base text-text-primary font-bold">Report Anonymously</span>
                <span class="text-sm text-text-secondary font-sans">Case of Women/Children</span>
              </div>
            }
          </button>

          <!-- Financial Fraud -->
          <button type="button" class="group flex-1 flex flex-col items-center justify-center text-center p-8 bg-surface border-2 border-transparent rounded-3xl transition-all duration-300 hover:border-primary hover:-translate-y-2 hover:shadow-2xl shadow-sm outline-none focus-visible:ring-4 focus-visible:ring-primary-container" (click)="selectType('fraud')">
            <div class="w-24 h-24 mb-6 rounded-full bg-surface-container-highest text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <!-- Minimalist doodle accent -->
              <svg class="absolute -top-4 -right-4 text-text-secondary opacity-30" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M11 11L15 15M15 11L11 15"></path><circle cx="13" cy="13" r="10"></circle></svg>
            </div>
            <h2 class="text-3xl font-bold text-primary mb-2">{{ languageService.screens().reportComplaint }}</h2>
            <p class="text-lg text-text-secondary font-sans">{{ languageService.screens().reportComplaintDesc }}</p>
            
            @if (languageService.activeLanguage().code !== 'en') {
              <div class="w-full mt-6 pt-6 border-t border-border flex flex-col gap-1">
                <span class="text-base text-text-primary font-bold">Report a Complaint</span>
                <span class="text-sm text-text-secondary font-sans">Financial Fraud</span>
              </div>
            }
          </button>
        </div>
      </main>

      <div class="fixed bottom-0 left-0 right-0 p-6 flex items-center justify-center bg-gradient-to-t from-background to-transparent z-10 pointer-events-none">
        <button class="w-16 h-16 rounded-full bg-surface text-primary border-2 border-border flex items-center justify-center cursor-pointer shadow-lg hover:bg-surface-container-low hover:-translate-y-1 transition-all pointer-events-auto outline-none focus-visible:ring-4 focus-visible:ring-primary" (click)="goBack()" aria-label="Go back">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>
    </div>
  `
})
export class ComplaintTypeComponent {
  protected readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly stateService = inject(ComplaintStateService);
  
  protected selectType(type: 'women' | 'fraud'): void {
    if (type === 'fraud') {
      this.router.navigate(['/urgency']);
    } else if (type === 'women') {
      this.stateService.updateDraft({ isAnonymous: true, mobileNumber: 'Anonymous' } as any);
      this.router.navigate(['/what-happened']);
    }
  }

  protected goBack(): void {
    this.location.back();
  }
}
