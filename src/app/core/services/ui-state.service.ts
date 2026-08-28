import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  public readonly isProcessing = signal(false);
  public readonly processingMessage = signal('Processing your data, this might take some time...');

  public showProcessing(message?: string) {
    if (message) {
      this.processingMessage.set(message);
    }
    this.isProcessing.set(true);
  }

  public hideProcessing() {
    this.isProcessing.set(false);
  }
}
