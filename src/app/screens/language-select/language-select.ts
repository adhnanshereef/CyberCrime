import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-language-select',
  imports: [RouterLink],
  template: `
    <div class="screen-container bg-vibrant-green">
      <div class="wave-bg"></div>
      <div class="content-wrapper">
        <header class="screen-header">
          <h1>
            {{ languageService.screens().languageSelectTitle }}
          </h1>
          @if (languageService.activeLanguage().code !== 'en') {
            <p class="english-fallback">Select your language</p>
          }
        </header>
        
        <main class="options-list">
          @for (lang of languageService.languages; track lang.code) {
            <button 
              type="button" 
              class="option-card" 
              [class.selected]="lang.code === selectedLanguageCode()"
              (click)="selectLanguage(lang.code)">
              <span class="native-label">{{ lang.nativeLabel }}</span>
              <span class="english-label">{{ lang.label }}</span>
            </button>
          }
        </main>
      </div>

      <div class="bottom-action-bar" style="flex-direction: column; gap: 1rem;">
        <div class="action-pill">
          <button class="back-btn" (click)="goBack()" aria-label="Go back">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <button class="next-btn" (click)="goNext()">Next</button>
        </div>
        <a class="track-link" routerLink="/login" [queryParams]="{returnUrl: '/track'}">Already filed a complaint? Track it here</a>
      </div>
    </div>
  `,
  styles: `
    .bg-vibrant-green {
      background-color: #1a7a1f; /* vibrant dark green */
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
      background-color: #27992e; /* lighter green top */
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
    .screen-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    .english-fallback {
      font-size: 1rem;
      opacity: 0.8;
    }
    .options-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }
    .option-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border: 3px solid transparent;
      background: #33a03a; /* slightly lighter than wave */
      border-radius: 12px;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
      color: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .option-card:hover {
      background: #3ebd46;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }
    .option-card.selected {
      border-color: #ffd54f; /* Yellow highlight border */
      background: #47c750;
      box-shadow: 0 0 0 2px #1a7a1f inset, 0 6px 12px rgba(0,0,0,0.15);
    }
    .native-label {
      font-size: 1.25rem;
      font-weight: bold;
    }
    .english-label {
      font-size: 1rem;
      color: rgba(255,255,255,0.85);
    }
    
    .bottom-action-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      display: flex;
      justify-content: center;
      background: linear-gradient(to top, rgba(26, 122, 31, 0.95), transparent);
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
      color: #1a7a1f;
      border: none;
      border-right: 2px solid rgba(26, 122, 31, 0.35); /* More visible dividing line */
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;
    }
    .back-btn:hover {
      background: #f1f8e9;
    }
    .next-btn {
      flex: 1;
      background: transparent;
      color: #1a7a1f;
      border: none;
      font-weight: bold;
      font-size: 1.15rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .next-btn:hover {
      background: #f1f8e9;
    }
    .track-link {
      color: white;
      text-decoration: underline;
      font-weight: bold;
      text-align: center;
      font-size: 1.1rem;
    }
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
