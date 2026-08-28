import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplaintStateService, ComplaintDraft } from '../../core/services/complaint-state.service';

@Component({
  selector: 'app-basic-details',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-background text-on-background flex flex-col font-primary">
      <main class="flex-grow flex flex-col items-center max-w-lg mx-auto w-full px-6 pt-12 pb-32">
        
        <header class="text-center mb-10 w-full animate-fade-in">
          <div class="w-16 h-16 bg-primary-container text-on-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-primary/20">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-primary mb-3">
            Your Information
          </h1>
          <p class="text-lg text-text-secondary font-sans">
            Almost done! Just a few personal details.
          </p>
        </header>

        <form class="w-full bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 animate-fade-in" style="animation-delay: 0.1s; animation-fill-mode: both;">
          
          <div class="flex flex-col gap-2">
            <label class="text-lg font-bold text-text-secondary">Full Name</label>
            <input 
              type="text" 
              [(ngModel)]="name" 
              name="name"
              placeholder="e.g. Rahul Sharma"
              autocomplete="name"
              class="w-full bg-background border-2 border-border rounded-xl px-4 py-4 text-xl font-sans focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors">
          </div>
          
          <div class="flex flex-col gap-2">
            <label class="text-lg font-bold text-text-secondary">Full Address</label>
            <textarea 
              [(ngModel)]="address" 
              name="address"
              placeholder="House no., Street, City, Pincode"
              rows="3"
              class="w-full bg-background border-2 border-border rounded-xl px-4 py-4 text-xl font-sans focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"></textarea>
          </div>
          
        </form>

      </main>

      <div class="fixed bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
        <div class="flex bg-surface rounded-full overflow-hidden w-full max-w-sm shadow-xl border border-border pointer-events-auto">
          <button class="flex items-center justify-center px-6 py-4 bg-transparent text-primary hover:bg-surface-container-low transition-colors border-r border-border" (click)="goBack()" aria-label="Go back">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <button class="flex-1 bg-transparent text-primary font-bold text-xl hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed" (click)="goNext()" [disabled]="!canProceed()">
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `
})
export class BasicDetailsComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly stateService = inject(ComplaintStateService);

  public name = signal('');
  public address = signal('');

  constructor() {
    const draft = this.stateService.currentDraft();
    if (draft?.basicDetails) {
      this.name.set(draft.basicDetails.name || '');
      this.address.set(draft.basicDetails.address || '');
    }
  }

  protected canProceed(): boolean {
    return this.name().trim().length > 0 && this.address().trim().length > 0;
  }

  protected goNext(): void {
    if (!this.canProceed()) return;

    const draft: ComplaintDraft = this.stateService.currentDraft() || {} as ComplaintDraft;
    this.stateService.updateDraft({
      ...draft,
      basicDetails: {
        ...(draft.basicDetails || {}),
        name: this.name(),
        address: this.address()
      }
    } as any);

    this.router.navigate(['/verify-id']);
  }

  protected goBack(): void {
    this.location.back();
  }
}
