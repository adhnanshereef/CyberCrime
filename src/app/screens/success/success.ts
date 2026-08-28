import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-success',
  template: `
    <div class="min-h-screen bg-primary text-on-primary flex flex-col font-primary items-center justify-center p-6 pb-24 overflow-hidden relative">
      
      <!-- Background subtle shapes -->
      <div class="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <main class="w-full max-w-lg bg-surface text-on-background rounded-3xl p-8 md:p-12 text-center shadow-2xl relative z-10 animate-fade-in-up">
        
        <!-- Animated Checkmark -->
        <div class="check-wrapper mx-auto mb-8">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        <h1 class="text-3xl md:text-4xl font-bold text-primary mb-3">
          Complaint Submitted
        </h1>
        <p class="text-text-secondary font-sans mb-8">
          This is a prototype demonstration. No actual data was sent to the cybercrime portal.
        </p>

        <div class="bg-surface-container-low border border-border p-6 rounded-2xl mb-8">
          <p class="text-sm text-text-secondary uppercase tracking-wider font-bold mb-1">Acknowledgment Number</p>
          <p class="text-3xl font-mono font-bold text-primary tracking-widest">{{ ackNumber }}</p>
        </div>

        <div class="flex flex-col gap-3 font-sans text-left bg-primary/5 p-5 rounded-2xl border border-primary/20">
          <h3 class="font-bold text-primary flex items-center gap-2">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Next Steps
          </h3>
          <ul class="list-disc pl-5 text-sm text-text-secondary flex flex-col gap-1">
            <li>Call <strong>1930</strong> immediately if you haven't already.</li>
            <li>Contact your bank within 3 working days.</li>
            <li>Keep a copy of this acknowledgment number safe.</li>
          </ul>
        </div>
      </main>

      <div class="fixed bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-primary to-transparent z-10">
        <button class="w-full max-w-sm bg-surface text-primary py-4 rounded-full text-xl font-bold shadow-lg hover:bg-surface-container hover:scale-105 transition-all outline-none focus-visible:ring-4 focus-visible:ring-white/50" (click)="goHome()">
          Return Home
        </button>
      </div>
    </div>
  `,
  styles: `
    .animate-fade-in-up {
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Checkmark Animation */
    .check-wrapper {
      width: 90px;
      height: 90px;
    }
    .checkmark__circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 4;
      stroke-miterlimit: 10;
      stroke: var(--color-success, #2f6b3a);
      fill: none;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    .checkmark {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      display: block;
      stroke-width: 4;
      stroke: var(--color-success, #2f6b3a);
      stroke-miterlimit: 10;
      margin: 10% auto;
      box-shadow: inset 0px 0px 0px var(--color-success, #2f6b3a);
      animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    }
    .checkmark__check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
    }
    @keyframes stroke {
      100% { stroke-dashoffset: 0; }
    }
    @keyframes scale {
      0%, 100% { transform: none; }
      50% { transform: scale3d(1.1, 1.1, 1); }
    }
    @keyframes fill {
      100% { box-shadow: inset 0px 0px 0px 45px rgba(47, 107, 58, 0.1); }
    }
  `
})
export class SuccessComponent {
  private readonly router = inject(Router);
  protected readonly languageService = inject(LanguageService);

  public ackNumber = '2020' + Math.floor(Math.random() * 90000 + 10000);

  protected goHome(): void {
    this.router.navigate(['/']);
  }
}
