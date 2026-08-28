import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { ComplaintStateService } from '../../core/services/complaint-state.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="screen-container bg-vibrant-teal">
      <div class="wave-bg"></div>
      
      <div class="content-wrapper">
        <header class="screen-header">
          <h1>{{ isTracking ? 'Track Your Case' : languageService.screens().loginTitle }}</h1>
          <p class="desc">{{ isTracking ? 'Login to check case status' : languageService.screens().loginDesc }}</p>
        </header>
        
        <main class="login-card">
          @if (step() === 'mobile') {
            <div class="input-group">
              <span class="country-code">+91</span>
              <input 
                type="tel" 
                [(ngModel)]="mobile" 
                [placeholder]="languageService.screens().mobilePlaceholder"
                maxlength="10"
                class="mobile-input">
            </div>
            
            <button class="primary-btn mt-4" [disabled]="mobile().length !== 10" (click)="sendOtp()">
              {{ languageService.screens().sendOtp }}
            </button>
          } @else {
            <div class="success-banner">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              {{ languageService.screens().otpSent }}
            </div>
            
            <div class="input-group">
              <input 
                type="text" 
                inputmode="numeric"
                pattern="[0-9]*"
                [(ngModel)]="otp" 
                [placeholder]="languageService.screens().enterOtp"
                maxlength="6"
                class="otp-input">
            </div>
            
            <button class="primary-btn mt-4" [disabled]="otp().length < 4" (click)="verifyOtp()">
              {{ languageService.screens().verifyOtp }}
            </button>
          }
        </main>
      </div>

      <div class="bottom-action-bar">
        <button class="back-btn standalone" (click)="goBack()" aria-label="Go back">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>
    </div>
  `,
  styles: `
    .bg-vibrant-teal {
      background-color: #00695c;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      color: white;
    }
    .wave-bg {
      position: absolute;
      top: 0; left: 0; right: 0; height: 50%;
      background-color: #00897b; 
      border-bottom-left-radius: 50% 20%;
      border-bottom-right-radius: 50% 20%;
      z-index: 0;
    }
    .content-wrapper {
      position: relative;
      z-index: 1;
      flex: 1;
      padding: calc(88px + 2rem) 1rem 7rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 500px;
      margin: 0 auto;
      width: 100%;
    }
    .screen-header { text-align: center; margin-bottom: 2rem; }
    h1 { font-size: 2.2rem; margin-bottom: 0.5rem; font-weight: bold; }
    .desc { font-size: 1.1rem; color: rgba(255,255,255,0.9); }

    .login-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      width: 100%;
      box-shadow: 0 12px 24px rgba(0,0,0,0.2);
      color: var(--color-text-primary);
    }
    .input-group {
      display: flex;
      align-items: center;
      border: 2px solid var(--color-border);
      border-radius: 8px;
      overflow: hidden;
      background: #f9f9f9;
      transition: border-color 0.2s;
    }
    .input-group:focus-within { border-color: #00695c; }
    .country-code { padding: 1rem; font-weight: bold; color: var(--color-text-secondary); background: #eee; border-right: 1px solid var(--color-border); }
    .mobile-input, .otp-input { flex: 1; padding: 1rem; border: none; font-size: 1.2rem; outline: none; background: transparent; font-family: inherit; }
    .otp-input { text-align: center; letter-spacing: 0.5rem; font-weight: bold; }
    .mt-4 { margin-top: 1.5rem; }
    .primary-btn { width: 100%; padding: 1rem; background: #00695c; color: white; border: none; border-radius: 8px; font-size: 1.15rem; font-weight: bold; cursor: pointer; transition: background 0.2s; }
    .primary-btn:hover:not(:disabled) { background: #004d40; }
    .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .success-banner { display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #2e7d32; background: #e8f5e9; padding: 0.75rem; border-radius: 8px; margin-bottom: 1.5rem; font-weight: bold; }

    .bottom-action-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: 1.5rem; display: flex; align-items: center; background: linear-gradient(to top, rgba(0, 105, 92, 0.95), transparent); z-index: 10; }
    .back-btn.standalone { width: 56px; height: 56px; border-radius: 50%; background: white; color: #00695c; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: background 0.2s, transform 0.2s; }
    .back-btn.standalone:hover { background: #f1f1f1; transform: scale(1.05); }
  `
})
export class LoginComponent {
  protected readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly stateService = inject(ComplaintStateService);
  
  protected readonly step = signal<'mobile' | 'otp'>('mobile');
  protected readonly mobile = signal('');
  protected readonly otp = signal('');

  get isTracking(): boolean {
    return this.route.snapshot.queryParamMap.get('returnUrl') === '/track';
  }

  protected sendOtp(): void {
    if (this.mobile().length === 10) {
      this.step.set('otp');
    }
  }

  protected verifyOtp(): void {
    if (this.otp().length >= 4) {
      // Mock verification success
      this.stateService.login(this.mobile());
      
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/what-happened';
      this.router.navigate([returnUrl]);
    }
  }

  protected goBack(): void {
    if (this.step() === 'otp') {
      this.step.set('mobile');
      this.otp.set('');
    } else {
      this.location.back();
    }
  }
}
