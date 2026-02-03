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
        <a routerLink="/profile" class="profile-link">
            <img class="user-avatar" *ngIf="user.avatar" [src]="user.avatar" alt="Avatar">
            <span class="user-avatar-placeholder" *ngIf="!user.avatar">👤</span>
            <span class="user-name">{{ user.fullName }}</span>
        </a>
        <button (click)="auth.logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--card-bg);
      padding: 0.8rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      transition: background-color 0.3s, border-color 0.3s;
    }
    @media (max-width: 600px) {
        .navbar {
            padding: 0.8rem 1rem;
        }
        .logo {
            font-size: 1rem;
        }
    }
    .logo {
      font-weight: 800;
      font-size: 1.4rem;
      cursor: pointer;
      color: var(--text-color);
      text-decoration: none;
    }
    .user-info {
      display: flex;
      gap: 0.8rem;
      align-items: center;
      color: var(--text-color);
    }
    .profile-link {
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: var(--text-color);
        padding: 0.4rem;
        border-radius: 8px;
        transition: background-color 0.2s;
        
        &:hover {
            background-color: var(--bg-color);
        }
    }
    .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--highlight-color);
    }
    .user-avatar-placeholder {
        font-size: 1.5rem;
    }
    .user-name {
        font-weight: 500;
    }
    @media (max-width: 500px) {
        .user-name {
            display: none;
        }
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
      font-size: 0.9rem;
      &:hover { background: var(--bg-color); }
    }
    .theme-btn {
        font-size: 1.2rem;
        padding: 0.3rem 0.6rem;
        border: none;
        background: transparent;
        &:hover { background: rgba(0,0,0,0.05); }
    }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService, public theme: ThemeService) { }
}
