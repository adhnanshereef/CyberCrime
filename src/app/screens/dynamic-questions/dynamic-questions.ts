import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplaintStateService } from '../../core/services/complaint-state.service';
import { AiService } from '../../core/services/ai.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-dynamic-questions',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="screen-container bg-vibrant-blue">
      <div class="wave-bg"></div>
      
      <div class="content-wrapper">
        <header class="screen-header">
          <h1>Additional Details</h1>
          <p class="desc">Please help us with a few more details</p>
        </header>

        <main class="input-card">
          @if (currentQuestion(); as q) {
            <h2 class="question-title">{{ q.question }}</h2>

            @if (q.type === 'text') {
              <input type="text" class="custom-input" [(ngModel)]="currentAnswer" placeholder="Type here...">
            }

            @if (q.type === 'select' && q.options) {
              <div class="options-container">
                @for (opt of q.options; track opt) {
                  <button 
                    class="option-btn" 
                    [class.active]="currentAnswer() === opt"
                    (click)="currentAnswer.set(opt)">
                    {{ opt }}
                  </button>
                }
              </div>
            }

            @if (q.type === 'file_or_text') {
              <div class="file-text-container">
                <input type="text" class="custom-input" [(ngModel)]="currentAnswer" placeholder="Type UTR or details...">
                
                <div class="divider"><span>OR</span></div>
                
                @if (selectedImageBase64()) {
                  <div class="image-preview">
                    <img [src]="selectedImageBase64()" alt="Preview" />
                    <button class="remove-btn" (click)="selectedImageBase64.set(null)">Remove</button>
                  </div>
                } @else {
                  <label class="upload-btn">
                    <input type="file" accept="image/*" hidden (change)="onFileSelected($event)">
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                    Upload Screenshot
                  </label>
                }
              </div>
            }
          } @else {
            <div class="all-done">
              <h2>All questions answered!</h2>
              <p>We have all the details we need for now.</p>
            </div>
          }
        </main>
      </div>

      <div class="bottom-action-bar">
        <div class="action-pill">
          <button class="back-btn" (click)="goBack()">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          
          @if (currentQuestion()) {
            <button class="next-btn" (click)="nextQuestion()" [disabled]="!canProceed()">
              @if (isProcessing()) { Processing... } @else { Next }
            </button>
          } @else {
            <button class="next-btn" (click)="finish()">Review Details</button>
          }
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
    }
    .question-title {
      font-size: 1.4rem;
      margin-bottom: 1.5rem;
      color: #0d47a1;
      line-height: 1.3;
    }
    
    .custom-input {
      width: 100%;
      padding: 1rem;
      border: 2px solid var(--color-border);
      border-radius: 8px;
      font-size: 1.1rem;
      font-family: inherit;
    }
    .custom-input:focus {
      border-color: #1976d2;
      outline: none;
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .option-btn {
      padding: 1.25rem;
      background: #f5f5f5;
      border: 2px solid transparent;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: bold;
      color: var(--color-text-secondary);
      cursor: pointer;
      text-align: left;
    }
    .option-btn.active {
      background: #e3f2fd;
      border-color: #1976d2;
      color: #0d47a1;
    }

    .file-text-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: #888;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #ddd;
    }
    .divider span { padding: 0 10px; font-weight: bold; font-size: 0.9rem; }
    
    .upload-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1.25rem;
      background: #1976d2;
      color: white;
      border-radius: 12px;
      font-weight: bold;
      font-size: 1.1rem;
      cursor: pointer;
    }
    .image-preview {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .image-preview img {
      width: 100%;
      max-height: 250px;
      object-fit: cover;
      border-radius: 12px;
      border: 2px solid #ddd;
    }
    .remove-btn {
      padding: 0.75rem;
      background: #ffebee;
      color: #d32f2f;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
    }

    .all-done {
      text-align: center;
      padding: 2rem 0;
      color: #2e7d32;
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
export class DynamicQuestionsComponent {
  private readonly stateService = inject(ComplaintStateService);
  private readonly aiService = inject(AiService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  private readonly questions = computed(() => {
    const draft = this.stateService.currentDraft();
    return draft?.aiAnalysis?.follow_up_questions || [];
  });

  public readonly answers = signal<Record<string, string>>({});
  
  public readonly activeIndex = signal(0);
  public readonly currentAnswer = signal('');
  public readonly selectedImageBase64 = signal<string | null>(null);
  public readonly isProcessing = signal(false);

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

  canProceed(): boolean {
    if (this.isProcessing()) return false;
    const ans = this.currentAnswer()?.trim();
    const img = this.selectedImageBase64();
    return !!ans || !!img;
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Compress image to avoid Supabase Edge Function memory limits
    const bitmap = await createImageBitmap(file);
    const MAX_DIMENSION = 1024;
    
    let width = bitmap.width;
    let height = bitmap.height;
    
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      if (width > height) {
        height = Math.round((height * MAX_DIMENSION) / width);
        width = MAX_DIMENSION;
      } else {
        width = Math.round((width * MAX_DIMENSION) / height);
        height = MAX_DIMENSION;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(bitmap, 0, 0, width, height);
      // Export as compressed JPEG to save memory
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
      this.selectedImageBase64.set(compressedBase64);
    } else {
      // Fallback if canvas fails
      const reader = new FileReader();
      reader.onload = () => this.selectedImageBase64.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async nextQuestion() {
    if (!this.canProceed()) return;
    
    const q = this.currentQuestion();
    if (!q) return;

    this.isProcessing.set(true);

    try {
      let finalAnswer = this.currentAnswer();

      if (this.selectedImageBase64()) {
        const ocrData = await this.aiService.processScreenshot(this.selectedImageBase64()!);
        
        // Merge OCR data into our extracted_details
        const draft = this.stateService.currentDraft();
        if (draft && draft.aiAnalysis) {
          draft.aiAnalysis.extracted_details = {
            ...draft.aiAnalysis.extracted_details,
            ...ocrData
          };
          this.stateService.updateDraft({ aiAnalysis: draft.aiAnalysis } as any);
        }
        finalAnswer = 'Screenshot Provided & Analyzed';
      }

      this.answers.update(a => ({ ...a, [q.id]: finalAnswer }));
      
      this.currentAnswer.set('');
      this.selectedImageBase64.set(null);
      this.activeIndex.update(i => i + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to process image. Please try again.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  goBack() {
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

  finish() {
    console.log('All questions done', this.stateService.currentDraft());
    // TODO: Route to review screen
  }
}
