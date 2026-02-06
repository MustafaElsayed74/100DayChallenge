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
      <div class="logo-section" routerLink="/dashboard">
          <img src="assets/icon.svg" alt="DayStreaker Logo" class="logo-img">
          <span class="logo-text">DayStreaker</span>
      </div>
      
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
        <a routerLink="/friends" routerLinkActive="active" class="nav-link">Friends</a>
        
        <div class="user-display">
            <span class="user-name">{{ user.fullName || user.email }}</span>
        </div>
        
        <button class="logout-btn" (click)="auth.logout()">Logout</button>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      background: var(--bg-color); /* Match body bg or card bg? Screenshot looks like body bg or slightly darker */
      padding: 1.2rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      /* No border in screenshot, or very subtle */
    }
    
    .logo-section {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        text-decoration: none;
        
        .logo-img {
            height: 32px;
            width: 32px;
            /* No filter needed for SVG as it has its own colors */
        }
        
        .logo-text {
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--primary-color);
        }
    }

    .nav-links {
        display: flex;
        align-items: center;
        gap: 2rem;
    }
    
    .nav-link {
        color: var(--secondary-text); /* Dimmed */
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
        
        &:hover, &.active {
            color: var(--primary-color);
        }
    }
    
    .user-display {
        color: var(--secondary-text);
        font-weight: 500;
    }
    
    .logout-btn {
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--primary-color);
        padding: 0.5rem 1.2rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
            background: rgba(255, 46, 85, 0.1);
            border-color: var(--primary-color);
        }
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
