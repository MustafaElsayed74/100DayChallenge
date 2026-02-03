import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private darkModeSource = new BehaviorSubject<boolean>(false);
    isDarkMode$ = this.darkModeSource.asObservable();

    constructor() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.setDarkMode(true);
        }
    }

    toggleTheme() {
        this.setDarkMode(!this.darkModeSource.value);
    }

    private setDarkMode(isDark: boolean) {
        this.darkModeSource.next(isDark);
        if (isDark) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }
}
