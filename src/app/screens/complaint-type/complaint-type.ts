import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { ComplaintStateService } from '../../core/services/complaint-state.service';

@Component({
  selector: 'app-complaint-type',
  template: `
    <div class="screen-container bg-vibrant-purple">
      <div class="wave-bg"></div>
      
      <div class="content-wrapper">
        <main class="split-options">
          <button type="button" class="large-option-card" (click)="selectType('women')">
            <div class="icon-wrapper">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 class="card-title">{{ languageService.screens().reportAnonymously }}</h2>
            <p class="card-desc">{{ languageService.screens().reportAnonymouslyDesc }}</p>
            
            @if (languageService.activeLanguage().code !== 'en') {
              <div class="english-fallback-group">
                <span class="fallback-title">Report Anonymously</span>
                <span class="fallback-desc">Case of Women/Children</span>
              </div>
            }
          </button>

          <button type="button" class="large-option-card" (click)="selectType('fraud')">
            <div class="icon-wrapper">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h2 class="card-title">{{ languageService.screens().reportComplaint }}</h2>
            <p class="card-desc">{{ languageService.screens().reportComplaintDesc }}</p>
            
            @if (languageService.activeLanguage().code !== 'en') {
              <div class="english-fallback-group">
                <span class="fallback-title">Report a Complaint</span>
                <span class="fallback-desc">Financial Fraud</span>
              </div>
            }
          </button>
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
    .bg-vibrant-purple {
      background-color: #311b92; /* vibrant deep purple */
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
      background-color: #4527a0; /* lighter purple top */
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
      align-items: center;
      justify-content: center;
    }
    .split-options {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
      max-width: 640px;
    }
    @media (min-width: 600px) {
      .split-options {
        flex-direction: row;
        align-items: stretch;
      }
    }
    .large-option-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2.5rem 1.5rem;
      background: #512da8; /* slightly lighter than wave */
      border: 4px solid transparent;
      border-radius: 20px;
      text-decoration: none;
      color: white;
      transition: all 0.2s ease;
      cursor: pointer;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }
    .large-option-card:hover {
      background: #5e35b1;
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.3);
      border-color: #ffd54f;
    }
    .icon-wrapper {
      margin-bottom: 1.5rem;
      color: #311b92;
      background: white;
      width: 96px;
      height: 96px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-title {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
      font-family: inherit;
    }
    .card-desc {
      font-size: 1.1rem;
      color: rgba(255,255,255,0.85);
    }
    .english-fallback-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.2);
      width: 100%;
    }
    .fallback-title {
      font-size: 1rem;
      color: rgba(255,255,255,0.9);
    }
    .fallback-desc {
      font-size: 0.9rem;
      color: rgba(255,255,255,0.7);
    }

    .bottom-action-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      background: linear-gradient(to top, rgba(49, 27, 146, 0.95), transparent);
      z-index: 10;
    }
    .back-btn.standalone {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: white;
      color: #311b92;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: background 0.2s, transform 0.2s;
    }
    .back-btn.standalone:hover {
      background: #f1f1f1;
      transform: scale(1.05);
    }
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
