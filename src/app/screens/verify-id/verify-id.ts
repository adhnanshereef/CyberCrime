import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ComplaintStateService } from '../../core/services/complaint-state.service';
import { AiService } from '../../core/services/ai.service';

@Component({
  selector: 'app-verify-id',
  imports: [CommonModule],
  template: `
    <div class="screen-container bg-vibrant-blue">
      <div class="wave-bg"></div>
      
      <div class="content-wrapper">
        <header class="screen-header">
          <h1>Identity Verification</h1>
          <p class="desc">Please upload your National ID to verify your name ({{ expectedName }}).</p>
        </header>

        <main class="input-card">
          <div class="form-group">
            <label class="form-label">National ID Proof</label>
            <p class="helper-text">Upload your Aadhar, PAN, Voter ID, or Passport.</p>
            
            @if (idImageBase64()) {
              <div class="id-preview-container">
                <img [src]="idImageBase64()" alt="ID Preview" class="id-preview-img" />
                
                @if (isProcessingId()) {
                  <div class="id-status processing">Processing ID...</div>
                } @else if (idType()) {
                  <div class="id-status" [class.success]="idNameMatch()" [class.error]="!idNameMatch()">
                    <strong>{{ idType() }} Detected</strong>
                    <span>{{ idNameMatch() ? 'Name verified successfully!' : 'Name mismatch detected.' }}</span>
                  </div>
                }

                <button class="remove-btn" (click)="removeId()">Remove and Try Again</button>
              </div>
            } @else {
              <label class="upload-btn">
                <input type="file" accept="image/*" hidden (change)="onIdSelected($event)">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                Upload ID Photo
              </label>
            }
          </div>
        </main>
      </div>

      <div class="bottom-action-bar">
        <div class="action-pill">
          <button class="back-btn" (click)="goBack()">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          
          <button class="next-btn" (click)="goNext()" [disabled]="!canProceed() || isProcessingId()">
            Review Details
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
    .helper-text {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.5rem;
    }
    
    .upload-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1.5rem;
      background: #f5f5f5;
      color: #1976d2;
      border: 2px dashed #1976d2;
      border-radius: 12px;
      font-weight: bold;
      font-size: 1.2rem;
      cursor: pointer;
    }

    .id-preview-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: #f9f9f9;
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid #eee;
    }
    .id-preview-img {
      width: 100%;
      max-height: 250px;
      object-fit: contain;
      border-radius: 8px;
    }
    .id-status {
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.25rem;
    }
    .id-status.processing { background: #fff3e0; color: #e65100; }
    .id-status.success { background: #e8f5e9; color: #1b5e20; }
    .id-status.error { background: #ffebee; color: #b71c1c; }

    .remove-btn {
      padding: 0.75rem;
      background: #ffebee;
      color: #d32f2f;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
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
export class VerifyIdComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly stateService = inject(ComplaintStateService);
  private readonly aiService = inject(AiService);

  public expectedName = '';
  public idImageBase64 = signal<string | null>(null);
  public isProcessingId = signal(false);
  public idType = signal<string | null>(null);
  public idNameMatch = signal<boolean>(false);

  constructor() {
    const draft = this.stateService.currentDraft();
    if (draft?.basicDetails) {
      this.expectedName = draft.basicDetails.name || 'Unknown User';
      this.idImageBase64.set(draft.basicDetails.idImageBase64 || null);
      this.idType.set(draft.basicDetails.idType || null);
      this.idNameMatch.set(draft.basicDetails.idNameMatch || false);
    } else {
      this.router.navigate(['/basic-details']);
    }
  }

  canProceed(): boolean {
    return this.idImageBase64() !== null && !this.isProcessingId();
  }

  async onIdSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      this.isProcessingId.set(true);
      
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
      let base64 = '';
      
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0, width, height);
        base64 = canvas.toDataURL('image/jpeg', 0.6);
      } else {
        throw new Error("Canvas context failed");
      }

      this.idImageBase64.set(base64);

      // Verify ID
      const res = await this.aiService.verifyId(base64, this.expectedName);
      this.idType.set(res.id_type);
      this.idNameMatch.set(res.name_match);
      
      // Save it immediately to the draft so it's not lost on refresh
      const existingBasicDetails = this.stateService.currentDraft()?.basicDetails || {} as any;
      this.stateService.updateDraft({
        basicDetails: {
          ...existingBasicDetails,
          idImageBase64: base64,
          idType: res.id_type,
          idNameMatch: res.name_match
        }
      } as any);
      
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to process ID card.");
      this.idImageBase64.set(null);
    } finally {
      this.isProcessingId.set(false);
    }
  }

  removeId() {
    this.idImageBase64.set(null);
    this.idType.set(null);
    this.idNameMatch.set(false);
    
    const existingBasicDetails = this.stateService.currentDraft()?.basicDetails || {} as any;
    this.stateService.updateDraft({
      basicDetails: {
        ...existingBasicDetails,
        idImageBase64: null,
        idType: null,
        idNameMatch: false
      }
    } as any);
  }

  goNext() {
    if (!this.canProceed()) return;
    this.router.navigate(['/review']);
  }

  goBack() {
    this.location.back();
  }
}
