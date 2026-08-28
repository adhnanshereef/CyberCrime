import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ComplaintStateService, ComplaintDraft } from '../../core/services/complaint-state.service';
import { UiStateService } from '../../core/services/ui-state.service';
import { AudioPlayerComponent } from '../../shared/components/audio-player/audio-player';

@Component({
  selector: 'app-review',
  imports: [CommonModule, AudioPlayerComponent],
  template: `
    <div class="min-h-screen bg-background text-on-background flex flex-col font-primary pb-32">
      <main class="flex-grow flex flex-col items-center max-w-2xl mx-auto w-full px-6 pt-12">
        
        <header class="text-center mb-10 w-full animate-fade-in">
          <div class="w-16 h-16 bg-primary-container text-on-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-primary/20">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-primary mb-3">
            Review Details
          </h1>
          <p class="text-lg text-text-secondary font-sans">
            Please verify the information before submitting.
          </p>
        </header>

        @if (draft) {
          <div class="w-full flex flex-col gap-6 animate-fade-in" style="animation-delay: 0.1s; animation-fill-mode: both;">
            
            @if (!draft.isAnonymous) {
              <!-- Personal Details -->
              <section class="bg-surface border border-border rounded-3xl p-6 shadow-sm">
                <h2 class="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Personal Details
                </h2>
                
                <div class="flex flex-col gap-4 font-sans">
                  <div class="flex justify-between items-start gap-4 border-b border-border pb-4">
                    <span class="text-text-secondary font-bold shrink-0">Name</span>
                    <span class="text-right font-medium">{{ draft.basicDetails?.name }}</span>
                  </div>
                  <div class="flex justify-between items-start gap-4 border-b border-border pb-4">
                    <span class="text-text-secondary font-bold shrink-0">Address</span>
                    <span class="text-right font-medium text-sm">{{ draft.basicDetails?.address }}</span>
                  </div>
                  <div class="flex justify-between items-start gap-4 border-b border-border pb-4">
                    <span class="text-text-secondary font-bold shrink-0">Mobile</span>
                    <span class="text-right font-medium">+91 {{ draft.mobileNumber }}</span>
                  </div>
                  
                  @if (draft.basicDetails?.idImageBase64) {
                    <div class="flex flex-col gap-3 pt-2">
                      <span class="text-text-secondary font-bold">National ID ({{ draft.basicDetails?.idType || 'Document' }})</span>
                      <div class="flex flex-col sm:flex-row gap-4 items-start">
                        <img [src]="draft.basicDetails?.idImageBase64" class="w-32 h-24 object-contain bg-surface-container-low rounded-xl border border-border shrink-0" />
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold"
                             [class.bg-success/10]="draft.basicDetails?.idNameMatch" [class.text-success]="draft.basicDetails?.idNameMatch"
                             [class.bg-urgent/10]="!draft.basicDetails?.idNameMatch" [class.text-urgent]="!draft.basicDetails?.idNameMatch">
                          @if (draft.basicDetails?.idNameMatch) {
                            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Name Match Verified
                          } @else {
                            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            Name Mismatch Detected
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </section>
            }

            <!-- Initial Statement -->
            <section class="bg-surface border border-border rounded-3xl p-6 shadow-sm">
              <h2 class="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Your Statement
              </h2>
              
              <div class="flex flex-col gap-6 font-sans">
                @if (draft.whatHappenedAudioBase64) {
                  <div class="w-full flex flex-col gap-2">
                    <span class="text-sm font-bold text-text-secondary uppercase tracking-wider">Audio Recording</span>
                    <app-audio-player [audioBase64]="draft.whatHappenedAudioBase64"></app-audio-player>
                  </div>
                }

                @if (draft.whatHappenedText) {
                  <div class="flex flex-col gap-2">
                    <span class="text-sm font-bold text-text-secondary uppercase tracking-wider">Original Text</span>
                    <div class="bg-surface-container-highest p-4 rounded-xl border border-border">
                      <p class="whitespace-pre-wrap font-medium">{{ draft.whatHappenedText }}</p>
                    </div>
                  </div>
                  
                  @if (draft.aiAnalysis?.original_transcript && draft.aiAnalysis?.original_transcript !== draft.whatHappenedText) {
                    <div class="flex flex-col gap-2 mt-2">
                      <span class="text-sm font-bold text-text-secondary uppercase tracking-wider">English Translation</span>
                      <div class="bg-surface-container-low p-4 rounded-xl border border-border border-l-4 border-l-primary">
                        <p class="whitespace-pre-wrap font-medium">{{ draft.aiAnalysis?.original_transcript }}</p>
                      </div>
                    </div>
                  }
                } @else {
                  <div class="flex flex-col gap-2">
                    <span class="text-sm font-bold text-text-secondary uppercase tracking-wider">English Transcript</span>
                    <div class="bg-surface-container-low p-4 rounded-xl border border-border border-l-4 border-l-primary">
                      <p class="whitespace-pre-wrap font-medium">{{ draft.aiAnalysis?.original_transcript || 'No transcript available.' }}</p>
                    </div>
                  </div>
                }
              </div>
            </section>

            <!-- Extracted Details -->
            @if (draft.aiAnalysis?.extracted_details) {
              <section class="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h2 class="font-bold text-xl text-primary flex items-center gap-2">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  Extracted Information
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-text-secondary uppercase tracking-wider">Category</span>
                    <span class="text-base font-bold text-on-surface">{{ draft.aiAnalysis?.extracted_details?.category || 'N/A' }}</span>
                  </div>
                  
                  @if (draft.aiAnalysis?.extracted_details?.incident_date) {
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-text-secondary uppercase tracking-wider">Date</span>
                      <span class="text-base font-bold text-on-surface">{{ draft.aiAnalysis?.extracted_details?.incident_date }}</span>
                    </div>
                  }
                  
                  @if (draft.aiAnalysis?.extracted_details?.amount_lost) {
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-text-secondary uppercase tracking-wider">Amount</span>
                      <span class="text-base font-bold text-on-surface">₹{{ draft.aiAnalysis?.extracted_details?.amount_lost }}</span>
                    </div>
                  }
                  
                  @if (draft.aiAnalysis?.extracted_details?.platform || draft.aiAnalysis?.extracted_details?.bank_or_app_name) {
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-text-secondary uppercase tracking-wider">Platform / Bank</span>
                      <span class="text-base font-bold text-on-surface">{{ draft.aiAnalysis?.extracted_details?.platform || draft.aiAnalysis?.extracted_details?.bank_or_app_name }}</span>
                    </div>
                  }
                </div>
                
                @if (draft.aiAnalysis?.extracted_details?.suspect_info) {
                  <div class="flex flex-col mt-2">
                    <span class="text-xs font-bold text-text-secondary uppercase tracking-wider">Suspect Info</span>
                    <div class="bg-primary/5 p-3 rounded-lg border border-primary/20">
                      <span class="text-sm font-medium text-on-surface">{{ draft.aiAnalysis?.extracted_details?.suspect_info }}</span>
                    </div>
                  </div>
                }
              </section>
            }

            <section class="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h2 class="font-bold text-xl text-primary flex items-center gap-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Additional Details
              </h2>
              <div class="flex flex-col gap-4">
                @if (hasAnswers()) {
                  <div class="flex flex-col gap-4 pt-2">
                    @for (q of getQuestions(); track q.id) {
                      @if (draft.answers?.[q.id]) {
                        <div class="flex flex-col gap-2">
                          <span class="text-sm font-bold text-text-secondary uppercase tracking-wider">{{ q.question }}</span>
                          <div class="bg-surface-container-highest p-4 rounded-xl border border-border">
                            <p class="whitespace-pre-wrap font-medium">{{ draft.answers[q.id] }}</p>
                          </div>
                          @if (draft.rawImages?.[q.id]) {
                            <div class="flex flex-col gap-3 pt-2">
                              <img [src]="draft.rawImages[q.id]" class="w-full h-auto max-h-48 object-contain bg-surface-container-low rounded-xl border border-border" />
                              
                              @if (draft.aiAnalysis?.extracted_details?.utr_transaction_id) {
                                <div class="bg-green-50 p-3 rounded-lg border border-green-200 flex flex-col gap-1">
                                  <span class="text-xs font-bold text-green-700 uppercase">Analyzed UTR / Transaction ID</span>
                                  <span class="text-base font-bold text-green-900">{{ draft.aiAnalysis?.extracted_details?.utr_transaction_id }}</span>
                                </div>
                              }
                            </div>
                          }
                        </div>
                      }
                    }
                  </div>
                }
              </div>
            </section>

            <!-- Case Summary -->
            <section class="bg-surface border border-border rounded-3xl p-6 shadow-sm">
              <h2 class="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Case Summary
              </h2>
              
              <div class="flex flex-col gap-4 font-sans">
                <div class="flex justify-between items-start gap-4 border-b border-border pb-4">
                  <span class="text-text-secondary font-bold shrink-0">Category</span>
                  <span class="text-right font-medium bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">{{ draft.aiAnalysis?.category || 'Not specified' }}</span>
                </div>
                
                @if (draft.incidentDate) {
                  <div class="flex justify-between items-start gap-4 border-b border-border pb-4">
                    <span class="text-text-secondary font-bold shrink-0">Incident Time</span>
                    <span class="text-right font-medium capitalize">{{ draft.incidentDate.replace('_', ' ') }}</span>
                  </div>
                }

                @if (draft.aiAnalysis?.extracted_details?.amount_lost) {
                  <div class="flex justify-between items-start gap-4 border-b border-border pb-4">
                    <span class="text-text-secondary font-bold shrink-0">Amount Lost</span>
                    <span class="text-right font-bold text-urgent text-lg">₹{{ draft.aiAnalysis?.extracted_details?.amount_lost }}</span>
                  </div>
                }

                @if (draft.aiAnalysis?.extracted_details?.bank_or_app_name) {
                  <div class="flex justify-between items-start gap-4 border-b border-border pb-4">
                    <span class="text-text-secondary font-bold shrink-0">Platform/Bank</span>
                    <span class="text-right font-medium">{{ draft.aiAnalysis?.extracted_details?.bank_or_app_name }}</span>
                  </div>
                }

                @if (draft.aiAnalysis?.extracted_details?.utr_transaction_id) {
                  <div class="flex justify-between items-start gap-4 border-b border-border pb-4">
                    <span class="text-text-secondary font-bold shrink-0">Transaction ID</span>
                    <span class="text-right font-mono font-bold">{{ draft.aiAnalysis?.extracted_details?.utr_transaction_id }}</span>
                  </div>
                }

                @if (draft.screenshotBase64) {
                  <div class="flex flex-col gap-3 pt-2">
                    <span class="text-text-secondary font-bold">Screenshot Evidence</span>
                    <img [src]="draft.screenshotBase64" class="w-full h-auto max-h-48 object-contain bg-surface-container-low rounded-xl border border-border" />
                  </div>
                }
              </div>
            </section>

          </div>
        } @else {
          <div class="text-center text-text-secondary py-12">
            No active case found.
          </div>
        }

      </main>

      <div class="fixed bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
        <div class="flex bg-surface rounded-full overflow-hidden w-full max-w-sm shadow-xl border border-border pointer-events-auto">
          <button class="flex items-center justify-center px-6 py-4 bg-transparent text-primary hover:bg-surface-container-low transition-colors border-r border-border" (click)="goBack()" aria-label="Go back">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <button class="flex-1 bg-transparent text-primary font-bold text-xl hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed" (click)="submit()" [disabled]="!draft">
            Submit
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
export class ReviewComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly stateService = inject(ComplaintStateService);
  private readonly uiState = inject(UiStateService);

  protected draft: ComplaintDraft | null = null;

  constructor() {
    this.draft = this.stateService.currentDraft();
  }

  protected hasAnswers(): boolean {
    return !!this.draft?.answers && Object.keys(this.draft.answers).length > 0;
  }

  protected getQuestions() {
    return this.draft?.aiAnalysis?.follow_up_questions || [];
  }

  protected async submit() {
    if (!this.draft) return;
    
    this.uiState.showProcessing('Filing complaint securely...');
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500));
    
    // Move to submitted list
    this.stateService.saveAsSubmitted();
    this.uiState.hideProcessing();

    this.router.navigate(['/success']);
  }

  protected goBack(): void {
    this.location.back();
  }
}
