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
        
        <div class="profile-dropdown-container" (click)="toggleDropdown()">
            <img class="user-avatar" *ngIf="user.avatar" [src]="user.avatar" alt="Avatar">
            <span class="user-avatar-placeholder" *ngIf="!user.avatar">👤</span>
            <span class="user-name">{{ user.fullName }}</span>
            <span class="dropdown-arrow">▼</span>

            <div class="dropdown-menu" *ngIf="isDropdownOpen">
                <a routerLink="/profile" class="dropdown-item">
                    <span>👤</span> My Profile
                </a>
                <div class="dropdown-divider"></div>
                <button (click)="auth.logout()" class="dropdown-item logout-item">
                    <span>🚪</span> Logout
                </button>
            </div>
        </div>
        
        <!-- Backdrop to close dropdown when clicking outside -->
        <div class="dropdown-backdrop" *ngIf="isDropdownOpen" (click)="closeDropdown($event)"></div>
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
      position: relative;
      z-index: 100;
    }
    @media (max-width: 600px) {
        .navbar {
            padding: 0.8rem 1rem;
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
      position: relative;
    }
    
    .profile-dropdown-container {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 0.4rem 0.8rem;
        border-radius: 8px;
        transition: background-color 0.2s;
        border: 1px solid transparent;

        &:hover {
            background-color: var(--bg-color);
            border-color: var(--border-color);
        }
    }

    .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--highlight-color);
        flex-shrink: 0;
    }
    .user-avatar-placeholder {
        font-size: 1.5rem;
    }
    .user-name {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 120px;
    }
    .dropdown-arrow {
        font-size: 0.7rem;
        opacity: 0.7;
    }
    
    @media (max-width: 600px) {
        .user-name, .dropdown-arrow {
            display: none;
        }
        .profile-dropdown-container {
            padding: 0;
            border: none;
            &:hover { background: transparent; border: none; }
        }
    }

    /* Dropdown Styles */
    .dropdown-menu {
        position: absolute;
        top: 120%;
        right: 0;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        width: 180px;
        overflow: hidden;
        animation: slideDown 0.2s ease-out;
        z-index: 1001;
    }

    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0.8rem 1rem;
        width: 100%;
        text-align: left;
        background: transparent;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        font-family: 'Outfit', sans-serif;
        font-size: 1rem;
        text-decoration: none;
        transition: background 0.2s;

        &:hover {
            background: var(--bg-color);
        }
    }

    .logout-item {
        color: #ff4757;
    }

    .dropdown-divider {
        height: 1px;
        background: var(--border-color);
        margin: 0;
    }

    .dropdown-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999;
        cursor: default;
    }

    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .theme-btn {
        font-size: 1.2rem;
        padding: 0.3rem 0.6rem;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 50%;
        transition: background 0.2s;
        &:hover { background: rgba(0,0,0,0.05); }
    }
  `]
})
export class NavbarComponent {
  isDropdownOpen = false;

  constructor(public auth: AuthService, public theme: ThemeService) { }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = false;
  }
}
