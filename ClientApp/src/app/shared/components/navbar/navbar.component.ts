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

       <button class="mobile-menu-btn" (click)="toggleMobileMenu()">☰</button>
       
       <div class="nav-links" [class.open]="isMobileMenuOpen">
         <a routerLink="/dashboard" routerLinkActive="active" class="nav-link" (click)="closeMobileMenu()">Dashboard</a>
         <a routerLink="/friends" routerLinkActive="active" class="nav-link" (click)="closeMobileMenu()">Friends</a>
         
         <div class="user-display">
             <span class="user-name">{{ user.fullName || user.email }}</span>
         </div>
         
         <button class="logout-btn" (click)="auth.logout()">Logout</button>
       </div>
     </nav>
   `,
    styles: [`
     .navbar {
       background: var(--bg-color);
       padding: 1rem 2rem;
       display: flex;
       justify-content: space-between;
       align-items: center;
       position: relative;
       z-index: 100;
     }

     .mobile-menu-btn {
       display: none;
       background: transparent;
       border: none;
       font-size: 1.5rem;
       color: var(--text-color);
       cursor: pointer;
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
         transition: all 0.3s ease;
     }
     
     .nav-link {
         color: var(--secondary-text);
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

     @media (max-width: 768px) {
       .navbar {
         padding: 1rem;
       }

       .mobile-menu-btn {
         display: block;
       }

       .nav-links {
         position: absolute;
         top: 100%;
         left: 0;
         right: 0;
         background: var(--card-bg); /* Use card bg for dropdown */
         flex-direction: column;
         padding: 1rem;
         gap: 1rem;
         border-bottom: 1px solid var(--border-color);
         box-shadow: 0 4px 10px rgba(0,0,0,0.1);
         
         /* Hidden state */
         opacity: 0;
         pointer-events: none;
         transform: translateY(-10px);

         &.open {
           opacity: 1;
           pointer-events: all;
           transform: translateY(0);
         }
       }
     }
   `]
})
export class NavbarComponent {
    isDropdownOpen = false;
    isMobileMenuOpen = false;

    constructor(public auth: AuthService, public theme: ThemeService) { }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    closeDropdown(event: Event) {
        event.stopPropagation();
        this.isDropdownOpen = false;
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    closeMobileMenu() {
        this.isMobileMenuOpen = false;
    }
}
