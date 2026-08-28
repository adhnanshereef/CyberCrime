import { Component, ElementRef, Input, ViewChild, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  imports: [CommonModule],
  template: `
    <div class="w-full bg-surface-container-low border border-border p-4 rounded-3xl shadow-sm flex flex-col gap-4 max-w-sm relative overflow-hidden">
      <div class="flex items-center gap-4">
        <button class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary" (click)="togglePlay()">
          @if (isPlaying()) {
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          } @else {
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="ml-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          }
        </button>
        <div class="flex-1 flex items-center gap-1 h-8">
          @for (level of audioLevels(); track $index) {
            <div class="w-1.5 bg-primary/80 rounded-full transition-all duration-75" [style.height.%]="level"></div>
          }
        </div>
      </div>
    </div>
    <audio #audioEl [src]="audioBase64" (ended)="handleAudioEnd()" class="hidden"></audio>
  `
})
export class AudioPlayerComponent implements OnDestroy {
  @Input({ required: true }) audioBase64!: string;
  @ViewChild('audioEl') audioElRef?: ElementRef<HTMLAudioElement>;

  protected isPlaying = signal(false);
  protected audioLevels = signal<number[]>(Array(20).fill(10));

  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private playbackSource: MediaElementAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private dataArray: Uint8Array | null = null;

  protected togglePlay() {
    if (!this.audioElRef) return;
    const el = this.audioElRef.nativeElement;
    
    if (el.paused) {
      this.isPlaying.set(true);
      this.setupPlaybackVisualizer(el);
      el.play().catch(e => console.error("Playback failed", e));
    } else {
      el.pause();
      this.isPlaying.set(false);
    }
  }
  
  protected handleAudioEnd() {
    this.isPlaying.set(false);
  }

  private setupPlaybackVisualizer(el: HTMLAudioElement) {
    if (this.playbackSource) {
      if (this.audioContext?.state === 'suspended') {
        this.audioContext.resume();
      }
      this.startDrawingWave();
      return; 
    }
    
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    try {
      this.playbackSource = this.audioContext.createMediaElementSource(el);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.playbackSource.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    } catch (e) {
      console.warn('Playback source already connected', e);
    }

    this.startDrawingWave();
  }

  private startDrawingWave() {
    if (!this.analyser) return;
    
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!this.isPlaying()) {
        this.audioLevels.set(Array(20).fill(10));
        return; 
      }
      
      if (!this.analyser || !this.dataArray) return;
      
      this.animationFrameId = requestAnimationFrame(draw);
      this.analyser.getByteFrequencyData(this.dataArray as any);
      
      const newLevels = [];
      const step = Math.max(1, Math.floor(bufferLength / 20));
      for (let i = 0; i < 20; i++) {
        const val = this.dataArray[i * step] || 0;
        const boost = Math.pow(val / 255, 0.7); 
        const percent = Math.max(10, boost * 100);
        newLevels.push(percent);
      }
      this.audioLevels.set(newLevels);
    };
    
    draw(); 
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
