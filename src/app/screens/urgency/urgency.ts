import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-urgency',
  imports: [RouterLink],
  template: `
    <div class="screen-container">
      <main class="urgency-card">
        <div class="warning-icon">!</div>
        <h1>{{ languageService.screens().urgencyTitle }}</h1>
        <p class="description">{{ languageService.screens().urgencyDesc }}</p>
        
        @if (languageService.activeLanguage().code !== 'en') {
          <div class="english-fallback-group">
            <p class="fallback-title">Money lost just now?</p>
            <p class="fallback-desc">If money was just taken, call 1930 immediately to block the transaction and reduce damage.</p>
          </div>
        }

        <div class="actions-container">
          <a class="call-action" href="tel:1930">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {{ languageService.screens().call1930 }}
          </a>

          <div class="divider">
            <span>OR</span>
          </div>

          <a class="continue-action" routerLink="/login">
            {{ languageService.screens().continueFiling }}
          </a>
          
          @if (languageService.activeLanguage().code !== 'en') {
            <div class="english-fallback-group-inline">
              <span class="fallback-desc">Continue registering case after calling</span>
            </div>
          }
        </div>
      </main>

      <div class="bottom-action-bar">
        <button class="back-btn standalone" (click)="goBack()" aria-label="Go back">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>
    </div>
  `,
  styles: `
    .screen-container {
      min-height: calc(100vh - 80px);
      padding: calc(88px + 1rem) 1rem 6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-bg);
    }
    .urgency-card {
      background: var(--color-surface);
      border: 3px solid var(--color-urgent);
      border-radius: 20px;
      padding: 2.5rem 2rem;
      text-align: center;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 12px 24px rgba(193, 18, 31, 0.15);
    }
    .warning-icon {
      width: 80px;
      height: 80px;
      background: var(--color-urgent);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: bold;
      margin: 0 auto 1.5rem;
    }
    h1 {
      font-size: 2.2rem;
      color: var(--color-urgent);
      margin-bottom: 1rem;
      line-height: 1.1;
    }
    .description {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      color: var(--color-text-primary);
      line-height: 1.5;
    }
    .actions-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .call-action {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      background: var(--color-urgent);
      color: white;
      text-decoration: none;
      padding: 1.25rem;
      border-radius: 12px;
      font-size: 1.5rem;
      font-weight: bold;
      width: 100%;
      box-shadow: 0 4px 6px rgba(193, 18, 31, 0.2);
      transition: transform 0.2s;
    }
    .call-action:hover {
      transform: scale(1.02);
    }
    .divider {
      position: relative;
      text-align: center;
    }
    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      border-top: 1px solid var(--color-border);
      z-index: 0;
    }
    .divider span {
      background: var(--color-surface);
      padding: 0 1rem;
      color: var(--color-text-secondary);
      font-weight: bold;
      position: relative;
      z-index: 1;
    }
    .continue-action {
      display: block;
      background: var(--color-surface);
      color: var(--color-text-primary);
      border: 2px solid var(--color-border);
      text-decoration: none;
      padding: 1rem;
      border-radius: 12px;
      font-size: 1.15rem;
      font-weight: bold;
      transition: all 0.2s;
    }
    .continue-action:hover {
      border-color: var(--color-text-primary);
      background: #f9f9f9;
    }
    .english-fallback-group {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .english-fallback-group-inline {
      margin-top: -1rem;
    }
    .fallback-title {
      font-size: 0.95rem;
      font-weight: bold;
      color: #666;
      margin-bottom: 0.25rem;
    }
    .fallback-desc {
      font-size: 0.85rem;
      color: #888;
    }

    .bottom-action-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      background: linear-gradient(to top, var(--color-bg), transparent);
      z-index: 10;
    }
    .back-btn.standalone {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: white;
      color: var(--color-text-primary);
      border: 2px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: background 0.2s, transform 0.2s;
    }
    .back-btn.standalone:hover {
      background: #f1f1f1;
      transform: scale(1.05);
    }
  `
})
export class UrgencyComponent {
  protected readonly languageService = inject(LanguageService);
  private readonly location = inject(Location);

  protected goBack(): void {
    this.location.back();
  }
}
