import { Component, inject, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { ComplaintStateService, ComplaintDraft } from '../../core/services/complaint-state.service';
import { AiService } from '../../core/services/ai.service';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-dynamic-questions',
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-background text-on-background flex flex-col font-primary">
      <main class="flex-grow flex flex-col items-center max-w-3xl mx-auto w-full px-6 pt-12 pb-32">
        
        @if (currentQuestion()) {
          <header class="text-center mb-10 w-full animate-fade-in">
            <h1 class="text-3xl md:text-4xl font-bold text-primary mb-3">
              {{ currentQuestion()!.question }}
            </h1>
          </header>

          <div class="w-full bg-surface border-2 border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 animate-fade-in" style="animation-delay: 0.1s; animation-fill-mode: both;">
            
            @if (currentQuestion()!.type === 'text') {
              <div class="flex flex-col gap-2">
                <textarea 
                  [(ngModel)]="currentAnswer" 
                  rows="4"
                  placeholder="Type your answer here..."
                  class="w-full bg-background border-2 border-border rounded-2xl p-6 text-xl font-sans focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none placeholder-text-secondary/50">
                </textarea>
              </div>
            }

            @if (currentQuestion()!.type === 'select' && currentQuestion()!.options) {
              <div class="flex flex-col gap-4">
                @for (option of currentQuestion()!.options; track option) {
                  <button 
                    type="button" 
                    class="flex items-center justify-between p-6 border-2 rounded-2xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary w-full text-left"
                    [class.border-primary]="currentAnswer() === option"
                    [class.bg-primary-container]="currentAnswer() === option"
                    [class.text-on-primary]="currentAnswer() === option"
                    [class.border-border]="currentAnswer() !== option"
                    [class.bg-surface]="currentAnswer() !== option"
                    [class.hover:border-primary/50]="currentAnswer() !== option"
                    (click)="currentAnswer.set(option)">
                    <span class="text-xl font-bold font-sans">{{ option }}</span>
                    
                    @if (currentAnswer() === option) {
                      <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    }
                  </button>
                }
              </div>
            }
            
            @if (currentQuestion()!.type === 'file_or_text') {
              <div class="flex flex-col items-center gap-6 w-full">
                @if (selectedImageBase64()) {
                  <div class="w-full border-2 border-border rounded-2xl overflow-hidden shadow-sm relative group">
                    <img [src]="selectedImageBase64()" class="w-full h-auto object-contain bg-surface-container-low max-h-[400px]" alt="Uploaded file" />
                    <div class="absolute inset-0 bg-surface/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button class="bg-surface text-urgent border border-urgent/30 px-6 py-3 rounded-xl font-bold font-sans hover:bg-urgent hover:text-white transition-colors" (click)="selectedImageBase64.set(null)">
                        Remove Image
                      </button>
                    </div>
                  </div>
                } @else {
                  <button 
                    type="button"
                    class="w-full border-2 border-dashed border-primary/50 rounded-3xl p-8 flex flex-col items-center gap-4 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    (click)="fileInput.click()">
                    <div class="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-primary shadow-sm">
                      <svg aria-hidden="true" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <span class="text-lg font-bold text-primary">Tap to select photo (Optional)</span>
                  </button>
                  
                  <div class="flex items-center gap-4 w-full text-text-secondary">
                    <div class="flex-1 h-px bg-border"></div>
                    <span class="font-bold text-sm uppercase">Or type details</span>
                    <div class="flex-1 h-px bg-border"></div>
                  </div>

                  <textarea 
                    [(ngModel)]="currentAnswer" 
                    rows="2"
                    placeholder="Type details if you don't have a screenshot..."
                    class="w-full bg-background border-2 border-border rounded-2xl p-4 text-lg font-sans focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none placeholder-text-secondary/50">
                  </textarea>
                }
                
                <input 
                  #fileInput 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  class="hidden" 
                  (change)="onFileSelected($event)" />

                <canvas #imageCanvas style="display: none;"></canvas>
              </div>
            }

          </div>
        }
      </main>

      <div class="fixed bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
        <div class="flex bg-surface rounded-full overflow-hidden w-full max-w-sm shadow-xl border border-border pointer-events-auto">
          <button class="flex items-center justify-center px-6 py-4 bg-transparent text-primary hover:bg-surface-container-low transition-colors border-r border-border" (click)="goBack()" aria-label="Go back">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <button class="flex-1 bg-transparent text-primary font-bold text-xl hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed" (click)="nextQuestion()" [disabled]="!canProceed()">
            Next
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
export class DynamicQuestionsComponent {
  protected readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly stateService = inject(ComplaintStateService);
  private readonly uiState = inject(UiStateService);
  private readonly aiService = inject(AiService);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
  @ViewChild('imageCanvas') imageCanvas?: ElementRef<HTMLCanvasElement>;

  protected activeIndex = signal(0);
  protected currentAnswer = signal<string>('');
  protected selectedImageBase64 = signal<string | null>(null);

  protected questions = computed(() => {
    const draft = this.stateService.currentDraft();
    return draft?.aiAnalysis?.follow_up_questions || [];
  });

  protected answers = signal<Record<string, string>>(this.stateService.currentDraft()?.answers || {});

  public readonly currentQuestion = computed(() => {
    const qs = this.questions();
    const idx = this.activeIndex();
    if (idx >= qs.length) return null;

    let q = qs[idx];
    
    // Evaluate condition if it exists
    if (q.condition) {
      const parentAns = this.answers()[q.condition.dependsOn];
      if (parentAns !== q.condition.value) {
        // Skip this question if condition fails
        setTimeout(() => this.activeIndex.update(i => i + 1), 0);
        return null;
      }
    }
    
    return q;
  });

  constructor() {
    if (this.questions().length === 0) {
      this.finish();
    }
  }

  protected canProceed(): boolean {
    const ans = this.currentAnswer()?.trim();
    const img = this.selectedImageBase64();
    return !!ans || !!img;
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uiState.showProcessing('Compressing image...');
    try {
      const base64 = await this.compressImage(file);
      this.selectedImageBase64.set(base64);
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to process image. Please try again.');
    } finally {
      this.uiState.hideProcessing();
    }
  }

  private compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (!this.imageCanvas) return reject('No canvas');
          const canvas = this.imageCanvas.nativeElement;
          const ctx = canvas.getContext('2d');
          
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1024;
          
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  protected async nextQuestion() {
    if (!this.canProceed()) return;
    
    const q = this.currentQuestion();
    if (!q) return;

    this.uiState.showProcessing('Processing response...');

    try {
      let finalAnswer = this.currentAnswer();
      const draft: ComplaintDraft = this.stateService.currentDraft() || {} as ComplaintDraft;
      const currentImages = draft.rawImages || {};

      if (this.selectedImageBase64()) {
        this.uiState.showProcessing('Analyzing screenshot...');
        const ocrData = await this.aiService.processScreenshot(this.selectedImageBase64()!);
        
        // Merge OCR data into our extracted_details
        if (draft.aiAnalysis) {
          draft.aiAnalysis.extracted_details = {
            ...(draft.aiAnalysis.extracted_details || {}),
            ...ocrData,
            // Fallback for fields not explicitly matching but extracted
            category: draft.aiAnalysis.extracted_details.category
          };
          this.stateService.updateDraft({ aiAnalysis: draft.aiAnalysis } as any);
        }
        finalAnswer = finalAnswer ? `Screenshot Provided & Analyzed. Details: ${finalAnswer}` : 'Screenshot Provided & Analyzed';
        
        // Save the raw image mapped to this question ID
        currentImages[q.id] = this.selectedImageBase64()!;
      }

      this.answers.update(a => ({ ...a, [q.id]: finalAnswer }));
      
      // Persist to state service immediately
      this.stateService.updateDraft({ 
        answers: this.answers(),
        rawImages: currentImages
      } as any);
      
      this.currentAnswer.set('');
      this.selectedImageBase64.set(null);
      this.activeIndex.update(i => i + 1);

      if (this.activeIndex() >= this.questions().length) {
        this.finish();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process. Please try again.');
    } finally {
      this.uiState.hideProcessing();
    }
  }

  protected goBack(): void {
    if (this.activeIndex() > 0) {
      this.activeIndex.update(i => i - 1);
      const q = this.currentQuestion();
      if (q) {
        this.currentAnswer.set(this.answers()[q.id] || '');
      }
    } else {
      this.location.back();
    }
  }

  private finish() {
    const draft = this.stateService.currentDraft();
    if (draft?.isAnonymous) {
      this.router.navigate(['/review']);
    } else {
      this.router.navigate(['/basic-details']);
    }
  }
}
