import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplaintStateService } from '../../core/services/complaint-state.service';

@Component({
  selector: 'app-basic-details',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="screen-container bg-vibrant-blue">
      <div class="wave-bg"></div>
      
      <div class="content-wrapper">
        <header class="screen-header">
          <h1>Your Information</h1>
          <p class="desc">Almost done! Just a few personal details.</p>
        </header>

        <main class="input-card">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input 
              type="text" 
              class="custom-input" 
              [(ngModel)]="name" 
              placeholder="e.g. Rahul Sharma"
              autocomplete="name">
          </div>
          
          <div class="form-group">
            <label class="form-label">Full Address</label>
            <textarea 
              class="custom-input" 
              [(ngModel)]="address" 
              placeholder="House Number, Street, City, State..."
              rows="4"
              autocomplete="street-address"></textarea>
          </div>
        </main>
      </div>

      <div class="bottom-action-bar">
        <div class="action-pill">
          <button class="back-btn" (click)="goBack()">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          
          <button class="next-btn" (click)="goNext()" [disabled]="!canProceed()">
            Next Step
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .bg-vibrant-blue {
      background-color: #0d47a1;
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
      background-color: #1976d2; 
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
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }
    .screen-header { text-align: center; margin-bottom: 2rem; }
    h1 { font-size: 2.2rem; margin-bottom: 0.5rem; font-weight: bold; }
    .desc { font-size: 1.1rem; color: rgba(255,255,255,0.9); }
    
    .input-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      color: var(--color-text-primary);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-label {
      font-weight: bold;
      color: #0d47a1;
      font-size: 1.1rem;
    }
    
    .custom-input {
      width: 100%;
      padding: 1rem;
      border: 2px solid var(--color-border);
      border-radius: 8px;
      font-size: 1.1rem;
      font-family: inherit;
      resize: vertical;
    }
    .custom-input:focus {
      border-color: #1976d2;
      outline: none;
    }

    .bottom-action-bar {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      padding: 1.5rem;
      display: flex;
      justify-content: center;
      background: linear-gradient(to top, rgba(13, 71, 161, 0.95), transparent);
      z-index: 10;
    }
    .action-pill {
      display: flex;
      background: white;
      border-radius: 50px;
      overflow: hidden;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.25);
    }
    .back-btn {
      padding: 1rem 1.5rem;
      background: transparent;
      color: #0d47a1;
      border: none;
      border-right: 2px solid rgba(13, 71, 161, 0.35);
      cursor: pointer;
    }
    .next-btn {
      flex: 1;
      background: transparent;
      color: #0d47a1;
      border: none;
      font-weight: bold;
      font-size: 1.15rem;
      cursor: pointer;
    }
    .next-btn:disabled { opacity: 0.5; cursor: not-allowed; }
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

  canProceed(): boolean {
    return this.name().trim().length > 2 && this.address().trim().length > 5;
  }

  goNext() {
    if (!this.canProceed()) return;

    // Keep existing ID data if present
    const existingBasicDetails = this.stateService.currentDraft()?.basicDetails || {} as any;

    this.stateService.updateDraft({
      basicDetails: {
        ...existingBasicDetails,
        name: this.name(),
        address: this.address()
      }
    } as any);

    this.router.navigate(['/verify-id']);
  }

  goBack() {
    this.location.back();
  }
}
