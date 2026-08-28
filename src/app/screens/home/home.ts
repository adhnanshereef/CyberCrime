import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <main id="home" class="home-page">
      <section class="hero" aria-labelledby="hero-title">
        <p class="eyebrow">A safer way to report online crime</p>
        <h1 id="hero-title">Report cybercrime.<br /><em>Get help sooner.</em></h1>
        <p class="hero-copy">Report financial fraud and other cybercrimes through a clear, guided process. You can use the portal in your preferred language.</p>
        <div class="hero-actions">
          <a class="primary-action" routerLink="/language-select">Register a complaint <span aria-hidden="true">→</span></a>
          <a class="secondary-action" href="#track-complaint">Track an existing complaint</a>
        </div>
      </section>
      <aside class="help-strip" aria-label="Emergency reporting information">
        <span class="help-icon" aria-hidden="true">!</span>
        <span><strong>Money lost just now?</strong> Call <a href="tel:1930">1930</a> immediately to report financial fraud.</span>
      </aside>
    </main>
  `
})
export class HomeComponent {
  protected readonly languageService = inject(LanguageService);
}
