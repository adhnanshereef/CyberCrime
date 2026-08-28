import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  template: `
    <div class="success-screen">
      <div class="checkmark-circle">
        <div class="background"></div>
        <div class="checkmark draw"></div>
      </div>
      
      <h1>Complaint Submitted</h1>
      <p>Your complaint has been successfully registered.</p>
      
      <button class="home-btn" (click)="goHome()">Return Home</button>
    </div>
  `,
  styles: `
    .success-screen {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #0d47a1;
      color: white;
      text-align: center;
      padding: 2rem;
    }

    h1 {
      margin-top: 2rem;
      font-size: 2.2rem;
      font-weight: bold;
    }

    p {
      margin-top: 1rem;
      font-size: 1.2rem;
      opacity: 0.9;
      max-width: 400px;
    }

    .home-btn {
      margin-top: 3rem;
      padding: 1rem 2.5rem;
      background: white;
      color: #0d47a1;
      border: none;
      border-radius: 50px;
      font-weight: bold;
      font-size: 1.1rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    /* Checkmark Animation */
    .checkmark-circle {
      width: 120px;
      height: 120px;
      position: relative;
      display: inline-block;
      vertical-align: top;
    }
    
    .checkmark-circle .background {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #4caf50;
      position: absolute;
      animation: scale 0.5s ease-out forwards;
      transform: scale(0);
    }

    .checkmark.draw:after {
      animation-duration: 800ms;
      animation-timing-function: ease;
      animation-name: checkmark;
      animation-fill-mode: forwards;
      animation-delay: 0.3s;
      transform: scaleX(-1) rotate(135deg);
    }
    
    .checkmark:after {
      opacity: 1;
      height: 60px;
      width: 30px;
      transform-origin: left top;
      border-right: 6px solid white;
      border-top: 6px solid white;
      content: '';
      left: 25px;
      top: 60px;
      position: absolute;
    }

    @keyframes scale {
      0% { transform: scale(0); }
      80% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    @keyframes checkmark {
      0% {
        height: 0;
        width: 0;
        opacity: 1;
      }
      20% {
        height: 0;
        width: 30px;
        opacity: 1;
      }
      40% {
        height: 60px;
        width: 30px;
        opacity: 1;
      }
      100% {
        height: 60px;
        width: 30px;
        opacity: 1;
      }
    }
  `
})
export class SuccessComponent {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}
