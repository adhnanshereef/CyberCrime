import { Component, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ComplaintStateService, ComplaintDraft } from '../../core/services/complaint-state.service';
import { AiService } from '../../core/services/ai.service';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-verify-id',
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-background text-on-background flex flex-col font-primary">
      <main class="flex-grow flex flex-col items-center max-w-lg mx-auto w-full px-6 pt-12 pb-32">
        
        <header class="text-center mb-10 w-full animate-fade-in">
          <div class="w-16 h-16 bg-surface-container-highest text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"/><line x1="7" y1="8" x2="7" y2="8"/><line x1="11" y1="8" x2="17" y2="8"/><line x1="11" y1="12" x2="17" y2="12"/><line x1="11" y1="16" x2="17" y2="16"/></svg>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-primary mb-3">
            Identity Verification
          </h1>
          <p class="text-lg text-text-secondary font-sans">
            Upload a clear photo of your National ID (Aadhaar, PAN, Passport, Voter ID).
          </p>
        </header>

        <div class="w-full bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 animate-fade-in" style="animation-delay: 0.1s; animation-fill-mode: both;">
          
          <div class="flex flex-col items-center gap-6 w-full">
            @if (idImageBase64()) {
              <div class="w-full flex flex-col gap-4">
                <div class="w-full border-2 border-border rounded-2xl overflow-hidden shadow-sm relative group">
                  <img [src]="idImageBase64()" class="w-full h-auto object-contain max-h-[300px] bg-surface-container-low" alt="Uploaded ID" />
                  <div class="absolute inset-0 bg-surface/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button class="bg-surface text-urgent border border-urgent/30 px-6 py-3 rounded-xl font-bold font-sans hover:bg-urgent hover:text-white transition-colors" (click)="removeImage()">
                      Upload Different ID
                    </button>
                  </div>
                </div>
                
                @if (idType()) {
                  <div class="bg-surface-container-low border border-border p-4 rounded-xl flex items-start gap-4">
                    <div class="p-2 rounded-full mt-1 shrink-0" 
                         [class.bg-success/20]="idNameMatch()" [class.text-success]="idNameMatch()"
                         [class.bg-urgent/20]="!idNameMatch()" [class.text-urgent]="!idNameMatch()">
                      @if (idNameMatch()) {
                        <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      } @else {
                        <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      }
                    </div>
                    <div>
                      <p class="font-bold text-lg text-text-primary mb-1">Detected: {{ idType() }}</p>
                      <p class="text-sm font-sans"
                         [class.text-success]="idNameMatch()"
                         [class.text-urgent]="!idNameMatch()">
                        {{ idNameMatch() ? 'Name matches your provided details perfectly.' : 'Name mismatch detected. The name on the ID does not clearly match the name you provided.' }}
                      </p>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <button 
                type="button"
                class="w-full border-2 border-dashed border-primary/50 rounded-3xl p-12 flex flex-col items-center gap-4 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
                (click)="fileInput.click()">
                <div class="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-primary shadow-sm">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <span class="text-xl font-bold text-primary">Tap to upload ID</span>
                <span class="text-sm text-text-secondary font-sans font-bold">Ensure all text is readable</span>
              </button>
            }
            
            <input 
              #fileInput 
              type="file" 
              accept="image/*" 
              capture="environment"
              class="hidden" 
              (change)="handleImageUpload($event)" />

            <canvas #imageCanvas style="display: none;"></canvas>
          </div>

        </div>
      </main>

      <div class="fixed bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none">
        <div class="flex bg-surface rounded-full overflow-hidden w-full max-w-sm shadow-xl border border-border pointer-events-auto">
          <button class="flex items-center justify-center px-6 py-4 bg-transparent text-primary hover:bg-surface-container-low transition-colors border-r border-border" (click)="goBack()" aria-label="Go back">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <button class="flex-1 bg-transparent text-primary font-bold text-xl hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed" (click)="goNext()" [disabled]="!canProceed()">
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
export class VerifyIdComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly stateService = inject(ComplaintStateService);
  private readonly aiService = inject(AiService);
  private readonly uiState = inject(UiStateService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('imageCanvas') imageCanvas!: ElementRef<HTMLCanvasElement>;

  public idImageBase64 = signal<string | null>(null);
  public idType = signal<string | null>(null);
  public idNameMatch = signal<boolean>(false);

  constructor() {
    const draft = this.stateService.currentDraft();
    if (draft?.basicDetails?.idImageBase64) {
      this.idImageBase64.set(draft.basicDetails.idImageBase64 || null);
      this.idType.set(draft.basicDetails.idType || null);
      this.idNameMatch.set(draft.basicDetails.idNameMatch || false);
    }
  }

  protected removeImage(): void {
    this.idImageBase64.set(null);
    this.idType.set(null);
    this.idNameMatch.set(false);
  }

  protected async handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const draft = this.stateService.currentDraft();
    const providedName = draft?.basicDetails?.name;
    
    if (!providedName) {
      alert("Error: Provided name is missing. Go back and fill your basic details.");
      return;
    }

    this.uiState.showProcessing('Verifying Identity Document...');
    try {
      const base64 = await this.compressImage(file);
      this.idImageBase64.set(base64);
      
      const res = await this.aiService.verifyId(base64, providedName);
      
      this.idType.set(res.id_type);
      this.idNameMatch.set(res.name_match);
    } catch (err) {
      console.error('ID Verification failed', err);
      alert('Failed to verify ID. Please try another clear photo.');
      this.removeImage();
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

  protected canProceed(): boolean {
    return this.idImageBase64() !== null && this.idType() !== null;
  }

  protected goNext(): void {
    if (!this.canProceed()) return;

    const draft: ComplaintDraft = this.stateService.currentDraft() || {} as ComplaintDraft;
    this.stateService.updateDraft({
      ...draft,
      basicDetails: {
        ...(draft.basicDetails || {}),
        idImageBase64: this.idImageBase64(),
        idType: this.idType(),
        idNameMatch: this.idNameMatch()
      }
    } as any);

    this.router.navigate(['/review']);
  }

  protected goBack(): void {
    this.location.back();
  }
}
