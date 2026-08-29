import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { ComplaintStateService } from '../../core/services/complaint-state.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-background text-on-background flex flex-col font-primary">
      <main class="flex-grow flex flex-col items-center justify-center max-w-lg mx-auto w-full px-6 pt-12 pb-32">
        
        <header class="text-center mb-10 w-full">
          <div class="w-20 h-20 bg-surface-container-highest text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-primary mb-3">
            {{ isTrackingMode ? 'Track Your Case' : 'Sign in with Mobile' }}
          </h1>
          <p class="text-lg text-text-secondary font-sans">
            {{ isTrackingMode ? 'Enter the number used to file the complaint.' : 'Enter your mobile number to begin.' }}
          </p>
        </header>

        <form class="w-full bg-surface border border-border rounded-3xl p-8 shadow-sm flex flex-col gap-6" (ngSubmit)="sendOtp()">
          
          @if (!otpSent()) {
            <div class="flex flex-col gap-2">
              <label for="mobile" class="text-lg font-bold text-text-secondary">Mobile Number</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 font-sans text-lg text-text-secondary font-bold">+91</span>
                <input 
                  type="tel" 
                  id="mobile" 
                  name="mobile"
                  [(ngModel)]="mobileNumber" 
                  class="w-full bg-background border-2 border-border rounded-xl px-4 py-4 pl-14 text-xl font-sans focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder="10-digit number" 
                  maxlength="10" 
                  required
                  [disabled]="isLoading()">
              </div>
            </div>

            <button type="submit" class="w-full bg-primary text-white py-4 rounded-xl text-xl font-bold shadow-md hover:bg-primary-container hover:-translate-y-0.5 transition-all outline-none focus-visible:ring-4 focus-visible:ring-primary/50" [disabled]="isLoading() || mobileNumber.length !== 10" [class.opacity-50]="isLoading() || mobileNumber.length !== 10">
              {{ isLoading() ? 'Sending...' : 'Send OTP' }}
            </button>
          } @else {
            <div class="flex flex-col gap-2">
              <label for="otp" class="text-lg font-bold text-text-secondary">Enter OTP</label>
              <p class="text-sm text-text-secondary mb-2 font-sans">Sent to +91 {{ mobileNumber }} <button type="button" class="text-primary font-bold hover:underline" (click)="otpSent.set(false)">(Change)</button></p>
              <input 
                type="text" 
                id="otp" 
                name="otp"
                [(ngModel)]="otpValue" 
                class="w-full bg-background border-2 border-border rounded-xl px-4 py-4 text-center text-3xl tracking-[0.5em] font-sans font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="0000" 
                maxlength="4" 
                required
                [disabled]="isLoading()">
            </div>

            <button type="button" class="w-full bg-primary text-white py-4 rounded-xl text-xl font-bold shadow-md hover:bg-primary-container hover:-translate-y-0.5 transition-all outline-none focus-visible:ring-4 focus-visible:ring-primary/50" (click)="verifyOtp()" [disabled]="isLoading() || otpValue.length !== 4" [class.opacity-50]="isLoading() || otpValue.length !== 4">
              {{ isLoading() ? 'Verifying...' : 'Verify & Continue' }}
            </button>
          }

        </form>

      </main>

      <div class="fixed bottom-0 left-0 right-0 p-6 flex items-center justify-center bg-gradient-to-t from-background to-transparent z-10 pointer-events-none">
        <button class="w-16 h-16 rounded-full bg-surface text-primary border-2 border-border flex items-center justify-center cursor-pointer shadow-lg hover:bg-surface-container-low hover:-translate-y-1 transition-all pointer-events-auto outline-none focus-visible:ring-4 focus-visible:ring-primary" (click)="goBack()" aria-label="Go back">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>
    </div>
  `
})
export class LoginComponent {
  protected readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly stateService = inject(ComplaintStateService);

  public mobileNumber = '';
  public otpValue = '';
  
  public otpSent = signal(false);
  public isLoading = signal(false);
  
  public isTrackingMode = false;

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl'] === '/track') {
        this.isTrackingMode = true;
      }
    });
  }

  async sendOtp() {
    if (this.mobileNumber.length !== 10) return;
    this.isLoading.set(true);
    // Fake network request
    await new Promise(r => setTimeout(r, 600));
    this.isLoading.set(false);
    this.otpSent.set(true);
  }

  async verifyOtp() {
    if (this.otpValue.length !== 4) return;
    this.isLoading.set(true);
    await new Promise(r => setTimeout(r, 800));
    this.isLoading.set(false);
    
    // Login the user to properly set current user state and initialize draft
    this.stateService.login(this.mobileNumber);

    if (this.isTrackingMode) {
      this.router.navigate(['/track']);
    } else {
      this.router.navigate(['/what-happened']);
    }
  }

  goBack() {
    this.location.back();
  }
}
