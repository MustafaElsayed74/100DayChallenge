import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="auth.user$ | async as user">
      <div class="logo" routerLink="/dashboard">100DayHabitat</div>
      <div class="user-info">
        <button class="theme-btn" (click)="theme.toggleTheme()">
            {{ (theme.isDarkMode$ | async) ? '☀️' : '🌙' }}
        </button>
        <span>{{ user.fullName }}</span>
        <button (click)="auth.logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--card-bg);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      transition: background-color 0.3s, border-color 0.3s;
    }
    .logo {
      font-weight: 800;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--text-color);
    }
    .user-info {
      display: flex;
      gap: 1rem;
      align-items: center;
      color: var(--text-color);
    }
    button {
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      color: var(--text-color);
      transition: all 0.2s;
      font-family: inherit;
      &:hover { background: var(--bg-color); }
    }
    .theme-btn {
        font-size: 1.2rem;
        padding: 0.3rem 0.8rem;
        border: none;
        background: transparent;
        &:hover { background: rgba(0,0,0,0.05); }
    }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService, public theme: ThemeService) { }
}
