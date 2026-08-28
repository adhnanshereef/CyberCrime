import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ComplaintStateService } from '../../core/services/complaint-state.service';
import { ComplaintDraft } from '../../core/services/complaint-state.service';

@Component({
  selector: 'app-track',
  imports: [CommonModule],
  template: `
    <div class="screen-container bg-vibrant-purple">
      <div class="wave-bg"></div>
      
      <div class="content-wrapper">
        
        @if (!activeCase()) {
          <header class="screen-header">
            <h1>My Cases</h1>
            <p class="desc">Tracking status for {{ mobileNumber }}</p>
          </header>

          <main class="cases-list">
            @if (myCases().length === 0) {
              <div class="empty-state">
                <p>No complaints found for this number.</p>
                <button class="primary-btn mt-4" (click)="fileNew()">File a New Complaint</button>
              </div>
            } @else {
              @for (c of myCases(); track c.submittedAt; let idx = $index) {
                <div class="case-card clickable" (click)="openCase(c)">
                  <div class="case-header">
                    <div>
                      <span class="case-id">NCRC-{{ generateFakeId(c.submittedAt) }}</span>
                      <span class="case-date">{{ c.submittedAt | date:'mediumDate' }}</span>
                    </div>
                    <span class="case-category">{{ c.aiAnalysis?.extracted_details?.category || 'General Complaint' }}</span>
                  </div>

                  <div class="progress-container compact">
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width]="getFakeProgress(c.submittedAt) + '%'"></div>
                    </div>
                  </div>

                  <div class="case-details-summary">
                    <span class="label">Summary:</span>
                    <span class="value summary-text">{{ c.aiAnalysis?.original_transcript || c.whatHappenedText || 'N/A' }}</span>
                  </div>
                  
                  <div class="view-details-prompt">
                    Tap to view full details
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              }
              
              <button class="secondary-btn mt-4" (click)="fileNew()">File Another Complaint</button>
            }
          </main>
        } @else {
          <!-- DETAILED VIEW -->
          <header class="screen-header">
            <h1>Case Details</h1>
            <p class="desc">NCRC-{{ generateFakeId(activeCase()?.submittedAt) }}</p>
          </header>

          <main class="input-card detailed-case">
            <!-- Progress Tracker -->
            <div class="progress-container large">
              <div class="progress-bar">
                <div class="progress-fill" [style.width]="getFakeProgress(activeCase()?.submittedAt) + '%'"></div>
              </div>
              <div class="progress-status">
                <span>Submitted</span>
                <span>Processing</span>
                <span>Action Taken</span>
              </div>
            </div>

            @if (!activeCase()?.isAnonymous) {
              <div class="review-section">
                <h2 class="section-title">Personal Details</h2>
                <div class="review-item">
                  <span class="review-label">Name</span>
                  <span class="review-value">{{ activeCase()?.basicDetails?.name }}</span>
                </div>
                <div class="review-item" style="margin-top: 1rem;">
                  <span class="review-label">Address</span>
                  <span class="review-value">{{ activeCase()?.basicDetails?.address }}</span>
                </div>
                <div class="review-item" style="margin-top: 1rem;">
                  <span class="review-label">Mobile</span>
                  <span class="review-value">{{ activeCase()?.mobileNumber }}</span>
                </div>
                @if (activeCase()?.basicDetails?.idImageBase64) {
                  <div class="review-item" style="margin-top: 1rem;">
                    <span class="review-label">National ID ({{ activeCase()?.basicDetails?.idType || 'Document' }})</span>
                    <div class="id-review-card">
                      <img [src]="activeCase()?.basicDetails?.idImageBase64" class="review-image-inline" />
                      <div class="id-status-badge" [class.success]="activeCase()?.basicDetails?.idNameMatch" [class.error]="!activeCase()?.basicDetails?.idNameMatch">
                        {{ activeCase()?.basicDetails?.idNameMatch ? 'Name Match Verified' : 'Name Mismatch Detected' }}
                      </div>
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Initial Statement -->
            <section class="review-section">
              <h2 class="section-title">Initial Statement</h2>
              
              @if (activeCase()?.whatHappenedText) {
                <div class="review-item">
                  <span class="review-label">Original Statement (Typed)</span>
                  <span class="review-value statement-text">
                    {{ activeCase()?.whatHappenedText }}
                  </span>
                </div>
                <div class="review-item" style="margin-top: 1rem;">
                  <span class="review-label">Translated Statement (English)</span>
                  <span class="review-value statement-text translation-text">
                    {{ activeCase()?.aiAnalysis?.original_transcript || 'No translation available.' }}
                  </span>
                </div>
              } @else {
                <div class="review-item">
                  <span class="review-label">Translated Transcript (English)</span>
                  <span class="review-value statement-text translation-text">
                    {{ activeCase()?.aiAnalysis?.original_transcript || 'No transcript available.' }}
                  </span>
                </div>
              }

              @if (activeCase()?.whatHappenedAudioBase64) {
                <div class="review-item" style="margin-top: 1rem;">
                  <span class="review-label">Voice Recording</span>
                  <audio controls [src]="activeCase()?.whatHappenedAudioBase64" class="custom-audio-player"></audio>
                </div>
              }
            </section>

            <!-- Dynamic Answers -->
            @if (hasAnswers(activeCase())) {
              <section class="review-section">
                <h2 class="section-title">Additional Questions</h2>
                @for (q of getQuestions(activeCase()); track q.id) {
                  @if (activeCase()?.answers && activeCase()?.answers[q.id]) {
                    <div class="review-item answer-card">
                      <span class="review-label">{{ q.question }}</span>
                      <span class="review-value" style="font-weight: bold; margin-top: 0.25rem;">
                        {{ activeCase()?.answers[q.id] }}
                      </span>
                      
                      @if (activeCase()?.rawImages && activeCase()?.rawImages[q.id]) {
                        <div class="inline-screenshot">
                          <img [src]="activeCase()?.rawImages[q.id]" alt="Screenshot" class="review-image-inline" />
                          
                          @if (activeCase()?.aiAnalysis?.extracted_details?.utr_transaction_id) {
                            <div class="ocr-data">
                              <span class="ocr-label">Analyzed UTR / Transaction ID:</span>
                              <span class="ocr-value">{{ activeCase()?.aiAnalysis?.extracted_details?.utr_transaction_id }}</span>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                }
              </section>
            }
          </main>
        }

      </div>
      
      <div class="bottom-action-bar">
        @if (!activeCase()) {
          <button class="back-btn standalone" (click)="logout()" aria-label="Logout">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </button>
        } @else {
          <button class="primary-btn" style="max-width: 400px; color: #4a148c; background: white;" (click)="closeCase()">
            Back to Cases
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    .bg-vibrant-purple {
      background-color: #4a148c; /* deep purple */
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
      background-color: #6a1b9a; 
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

    .cases-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .case-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 12px 24px rgba(0,0,0,0.15);
      color: var(--color-text-primary);
    }
    .case-card.clickable {
      cursor: pointer;
      transition: transform 0.2s;
    }
    .case-card.clickable:hover {
      transform: translateY(-2px);
    }
    .case-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .case-id {
      display: block;
      font-weight: bold;
      font-size: 1.2rem;
      color: #4a148c;
    }
    .case-date {
      font-size: 0.9rem;
      color: #666;
    }
    .case-category {
      background: #f3e5f5;
      color: #6a1b9a;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: bold;
      text-align: right;
      max-width: 150px;
    }

    .progress-container {
      margin-bottom: 1rem;
    }
    .progress-container.large {
      margin-bottom: 2rem;
      background: #f3e5f5;
      padding: 1.5rem;
      border-radius: 12px;
    }
    .progress-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .progress-fill {
      height: 100%;
      background: #4a148c;
      border-radius: 4px;
      transition: width 1s ease-in-out;
    }
    .progress-status {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #666;
      font-weight: bold;
    }

    .case-details-summary {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .case-details-summary .label {
      font-size: 0.85rem;
      color: #666;
      font-weight: bold;
    }
    .summary-text {
      font-size: 1rem;
      color: #333;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .view-details-prompt {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
      font-size: 0.9rem;
      font-weight: bold;
      color: #4a148c;
    }

    /* Detailed Case Styling borrowed from Review */
    .input-card.detailed-case {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      color: var(--color-text-primary);
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .review-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
    }
    .review-section:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .section-title {
      font-size: 1.3rem;
      color: #4a148c;
      margin: 0 0 0.5rem 0;
    }
    .review-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .answer-card {
      background: #f9f9f9;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #eee;
    }
    .review-label {
      font-size: 0.9rem;
      font-weight: bold;
      color: #757575;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .review-value {
      font-size: 1.1rem;
      color: #212121;
    }
    .statement-text {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
      font-style: italic;
      white-space: pre-wrap;
    }
    .translation-text {
      background: #f3e5f5;
      color: #4a148c;
      border-left: 4px solid #6a1b9a;
    }

    .custom-audio-player {
      width: 100%;
      height: 40px;
      outline: none;
      border-radius: 50px;
    }

    .inline-screenshot {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
      background: white;
      padding: 0.5rem;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }
    .review-image-inline {
      width: 100%;
      max-height: 250px;
      object-fit: contain;
      border-radius: 4px;
      background: #f5f5f5;
    }
    .ocr-data {
      background: #e8f5e9;
      padding: 0.75rem;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .ocr-label {
      font-size: 0.8rem;
      font-weight: bold;
      color: #2e7d32;
      text-transform: uppercase;
    }
    .ocr-value {
      font-size: 1.1rem;
      font-weight: bold;
      color: #1b5e20;
    }
    .id-review-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .id-status-badge {
      padding: 0.5rem;
      text-align: center;
      border-radius: 6px;
      font-weight: bold;
      font-size: 0.9rem;
    }
    .id-status-badge.success { background: #e8f5e9; color: #1b5e20; }
    .id-status-badge.error { background: #ffebee; color: #b71c1c; }

    .mt-4 { margin-top: 1.5rem; }
    .primary-btn { width: 100%; padding: 1rem; background: white; color: #4a148c; border: none; border-radius: 8px; font-size: 1.15rem; font-weight: bold; cursor: pointer; }
    .secondary-btn { width: 100%; padding: 1rem; background: rgba(255,255,255,0.2); color: white; border: 2px solid white; border-radius: 8px; font-size: 1.15rem; font-weight: bold; cursor: pointer; }
    
    .empty-state { text-align: center; background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; }

    .bottom-action-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: 1.5rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(to top, rgba(74, 20, 140, 0.95), transparent); z-index: 10; }
    .back-btn.standalone { width: 56px; height: 56px; border-radius: 50%; background: white; color: #4a148c; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: background 0.2s, transform 0.2s; }
  `
})
export class TrackComponent {
  private readonly router = inject(Router);
  private readonly stateService = inject(ComplaintStateService);

  public mobileNumber = '';
  public myCases = signal<any[]>([]);
  public activeCase = signal<any | null>(null);

  constructor() {
    const draft = this.stateService.currentDraft();
    this.mobileNumber = draft?.mobileNumber || '';
    
    if (!this.mobileNumber) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/track' } });
      return;
    }

    this.loadCases();
  }

  private loadCases() {
    const all = JSON.parse(localStorage.getItem('ncrc_submitted') || '[]');
    const filtered = all.filter((c: any) => c.mobileNumber === this.mobileNumber);
    filtered.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    this.myCases.set(filtered);
  }

  generateFakeId(timestampStr: string): string {
    if (!timestampStr) return '000000';
    let hash = 0;
    for (let i = 0; i < timestampStr.length; i++) {
      hash = timestampStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash).toString().substring(0, 6).padStart(6, '0');
  }

  getFakeProgress(timestampStr: string): number {
    if (!timestampStr) return 30;
    const charCode = timestampStr.charCodeAt(timestampStr.length - 1) || 0;
    return 20 + (charCode % 60);
  }

  hasAnswers(c: any): boolean {
    return !!c?.answers && Object.keys(c.answers).length > 0;
  }

  getQuestions(c: any): any[] {
    return c?.aiAnalysis?.follow_up_questions || [];
  }

  openCase(c: any) {
    this.activeCase.set(c);
    window.scrollTo(0, 0);
  }

  closeCase() {
    this.activeCase.set(null);
    window.scrollTo(0, 0);
  }

  fileNew() {
    this.stateService.updateDraft({} as any);
    this.router.navigate(['/language']);
  }

  logout() {
    this.stateService.updateDraft({} as any);
    this.router.navigate(['/language']);
  }
}
