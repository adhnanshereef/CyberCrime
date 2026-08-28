import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ComplaintStateService } from '../../core/services/complaint-state.service';

@Component({
  selector: 'app-review',
  imports: [CommonModule],
  template: `
    <div class="screen-container bg-vibrant-blue">
      <div class="wave-bg"></div>
      
      <div class="content-wrapper">
        <header class="screen-header">
          <h1>Review Complaint</h1>
          <p class="desc">Please review your information before final submission.</p>
        </header>

        <main class="input-card" *ngIf="draft; else noDraft">
          @if (!draft.isAnonymous) {
            <!-- Basic Details -->
            <section class="review-section">
              <h2 class="section-title">Personal Details</h2>
              <div class="review-item">
                <span class="review-label">Name</span>
                <span class="review-value">{{ draft.basicDetails?.name }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Address</span>
                <span class="review-value">{{ draft.basicDetails?.address }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Mobile</span>
                <span class="review-value">{{ draft.mobileNumber }}</span>
              </div>
              @if (draft.basicDetails?.idImageBase64) {
                <div class="review-item" style="margin-top: 1rem;">
                  <span class="review-label">National ID ({{ draft.basicDetails?.idType || 'Document' }})</span>
                  <div class="id-review-card">
                    <img [src]="draft.basicDetails?.idImageBase64" class="review-image-inline" />
                    <div class="id-status-badge" [class.success]="draft.basicDetails?.idNameMatch" [class.error]="!draft.basicDetails?.idNameMatch">
                      {{ draft.basicDetails?.idNameMatch ? 'Name Match Verified' : 'Name Mismatch Detected' }}
                    </div>
                  </div>
                </div>
              }
            </section>
          }

          <!-- Complaint Details -->
          <section class="review-section">
            <h2 class="section-title">Initial Statement</h2>
            
            @if (draft.whatHappenedText) {
              <div class="review-item">
                <span class="review-label">Original Statement (Typed)</span>
                <span class="review-value statement-text">
                  {{ draft.whatHappenedText }}
                </span>
              </div>
              <div class="review-item" style="margin-top: 1rem;">
                <span class="review-label">Translated Statement (English)</span>
                <span class="review-value statement-text translation-text">
                  {{ draft.aiAnalysis?.original_transcript || 'No translation available.' }}
                </span>
              </div>
            } @else {
              <div class="review-item">
                <span class="review-label">Translated Transcript (English)</span>
                <span class="review-value statement-text translation-text">
                  {{ draft.aiAnalysis?.original_transcript || 'No transcript available.' }}
                </span>
              </div>
            }

            @if (draft.whatHappenedAudioBase64) {
              <div class="review-item" style="margin-top: 1rem;">
                <span class="review-label">Voice Recording</span>
                <audio controls [src]="draft.whatHappenedAudioBase64" class="custom-audio-player"></audio>
              </div>
            }
          </section>

          <!-- Extracted Info -->
          @if (draft.aiAnalysis?.extracted_details) {
            <section class="review-section">
              <h2 class="section-title">Extracted Information</h2>
              <div class="review-item">
                <span class="review-label">Category</span>
                <span class="review-value">{{ draft.aiAnalysis?.extracted_details?.category || 'N/A' }}</span>
              </div>
              <div class="review-item" *ngIf="draft.aiAnalysis?.extracted_details?.incident_date">
                <span class="review-label">Date</span>
                <span class="review-value">{{ draft.aiAnalysis?.extracted_details?.incident_date }}</span>
              </div>
              <div class="review-item" *ngIf="draft.aiAnalysis?.extracted_details?.amount_lost">
                <span class="review-label">Amount</span>
                <span class="review-value">₹{{ draft.aiAnalysis?.extracted_details?.amount_lost }}</span>
              </div>
              <div class="review-item" *ngIf="draft.aiAnalysis?.extracted_details?.platform">
                <span class="review-label">Platform / Bank</span>
                <span class="review-value">{{ draft.aiAnalysis?.extracted_details?.platform || draft.aiAnalysis?.extracted_details?.bank_or_app_name }}</span>
              </div>
              <div class="review-item" *ngIf="draft.aiAnalysis?.extracted_details?.suspect_info">
                <span class="review-label">Suspect Info</span>
                <span class="review-value">{{ draft.aiAnalysis?.extracted_details?.suspect_info }}</span>
              </div>
            </section>
          }

          <!-- Dynamic Answers -->
          @if (hasAnswers()) {
            <section class="review-section">
              <h2 class="section-title">Additional Questions</h2>
              @for (q of getQuestions(); track q.id) {
                @if (draft.answers && draft.answers[q.id]) {
                  <div class="review-item answer-card">
                    <span class="review-label">{{ q.question }}</span>
                    <span class="review-value" style="font-weight: bold; margin-top: 0.25rem;">
                      {{ draft.answers[q.id] }}
                    </span>
                    
                    @if (draft.rawImages && draft.rawImages[q.id]) {
                      <div class="inline-screenshot">
                        <img [src]="draft.rawImages[q.id]" alt="Screenshot" class="review-image-inline" />
                        
                        <!-- Show OCR extracted data specifically under the image if present -->
                        @if (draft.aiAnalysis?.extracted_details?.utr_transaction_id) {
                          <div class="ocr-data">
                            <span class="ocr-label">Analyzed UTR / Transaction ID:</span>
                            <span class="ocr-value">{{ draft.aiAnalysis?.extracted_details?.utr_transaction_id }}</span>
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
        
        <ng-template #noDraft>
          <div class="input-card">
            <p style="text-align: center; color: #d32f2f;">No draft found. Please start over.</p>
          </div>
        </ng-template>
      </div>

      <div class="bottom-action-bar">
        <div class="action-pill">
          <button class="back-btn" (click)="goBack()">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          
          <button class="next-btn submit-btn" (click)="submit()">
            Submit Complaint
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
      color: #0d47a1;
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
      background: #e3f2fd;
      color: #0d47a1;
      border-left: 4px solid #1976d2;
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
    .submit-btn {
      background: #1976d2;
      color: white;
    }
  `
})
export class ReviewComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly stateService = inject(ComplaintStateService);

  public readonly draft = this.stateService.currentDraft();

  hasAnswers(): boolean {
    return !!this.draft?.answers && Object.keys(this.draft.answers).length > 0;
  }

  getQuestions() {
    return this.draft?.aiAnalysis?.follow_up_questions || [];
  }

  goBack() {
    this.location.back();
  }

  submit() {
    console.log('Submitting payload:', this.draft);
    
    // Save the final submission to a separate submitted storage key
    if (this.draft) {
      const submissions = JSON.parse(localStorage.getItem('ncrc_submitted') || '[]');
      submissions.push({
        ...this.draft,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('ncrc_submitted', JSON.stringify(submissions));
    }

    // Clear the active draft
    localStorage.removeItem('ncrc_drafts');
    
    this.router.navigate(['/success']);
  }
}
