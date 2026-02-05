import { Injectable } from '@angular/core';
import { ChallengeService, Challenge, DayStatus } from './challenge.service';

export interface NotificationSettings {
    enabled: boolean;
    reminderHour: number; // Hour of day to check for missed days (0-23)
    encouragementIntervalHours: number; // Hours between encouragement messages
    lastEncouragementTime: number; // Timestamp of last encouragement
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly SETTINGS_KEY = 'notification_settings';
    private encouragementTimer: ReturnType<typeof setInterval> | null = null;

    private encouragementMessages = [
        "💪 Keep going! Every day counts towards your goal!",
        "🌟 You're doing amazing! Don't break the chain!",
        "🔥 Stay focused! Your future self will thank you!",
        "🚀 One day at a time, one step closer to success!",
        "🎯 Champions are made through consistency!",
        "✨ Today is another opportunity to grow!",
        "💎 Discipline equals freedom. Keep pushing!",
        "🏆 You've got this! Check your challenge!",
        "⭐ Small daily improvements lead to stunning results!",
        "🌈 Believe in yourself - you're capable of amazing things!"
    ];

    constructor(private challengeService: ChallengeService) { }

    /**
     * Initialize the notification system
     */
    async initialize(): Promise<void> {
        const settings = this.getSettings();

        if (settings.enabled && this.isSupported()) {
            await this.requestPermission();
            this.checkMissedDays();
            this.startEncouragementTimer();
        }
    }

    /**
     * Check if browser notifications are supported
     */
    isSupported(): boolean {
        return 'Notification' in window;
    }

    /**
     * Get current permission status
     */
    getPermissionStatus(): NotificationPermission | 'unsupported' {
        if (!this.isSupported()) return 'unsupported';
        return Notification.permission;
    }

    /**
     * Request notification permission from user
     */
    async requestPermission(): Promise<boolean> {
        if (!this.isSupported()) return false;

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    /**
     * Get notification settings from localStorage
     */
    getSettings(): NotificationSettings {
        const stored = localStorage.getItem(this.SETTINGS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            enabled: true,
            reminderHour: 18, // 6 PM default
            encouragementIntervalHours: 4,
            lastEncouragementTime: 0
        };
    }

    /**
     * Save notification settings to localStorage
     */
    saveSettings(settings: NotificationSettings): void {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    }

    /**
     * Enable or disable notifications
     */
    async setEnabled(enabled: boolean): Promise<boolean> {
        const settings = this.getSettings();
        settings.enabled = enabled;
        this.saveSettings(settings);

        if (enabled) {
            const granted = await this.requestPermission();
            if (granted) {
                this.startEncouragementTimer();
                return true;
            }
            return false;
        } else {
            this.stopEncouragementTimer();
            return true;
        }
    }

    /**
     * Check for missed days across all challenges
     */
    checkMissedDays(): void {
        const settings = this.getSettings();
        const now = new Date();
        const currentHour = now.getHours();

        // Only check after the reminder hour
        if (currentHour < settings.reminderHour) return;

        this.challengeService.getChallenges().subscribe(challenges => {
            const pendingToday = this.findPendingTodayChallenges(challenges);

            if (pendingToday.length > 0) {
                this.showMissedDayNotification(pendingToday);
            }
        });
    }

    /**
     * Find challenges where today's day is still pending
     */
    private findPendingTodayChallenges(challenges: Challenge[]): Challenge[] {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return challenges.filter(challenge => {
            const startDate = new Date(challenge.startDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(challenge.endDate);
            endDate.setHours(0, 0, 0, 0);

            // Check if today falls within the challenge period
            if (today < startDate || today > endDate) return false;

            // Check if today's day is pending
            if (challenge.days) {
                const todayDay = challenge.days.find(day => {
                    const dayDate = new Date(day.date);
                    dayDate.setHours(0, 0, 0, 0);
                    return dayDate.getTime() === today.getTime();
                });

                return todayDay && todayDay.status === DayStatus.Pending;
            }

            return false;
        });
    }

    /**
     * Show notification for missed days
     */
    private showMissedDayNotification(challenges: Challenge[]): void {
        if (Notification.permission !== 'granted') return;

        const title = challenges.length === 1
            ? `Don't forget: ${challenges[0].title}`
            : `You have ${challenges.length} challenges waiting!`;

        const body = challenges.length === 1
            ? "You haven't checked in today. Keep your streak going! 🔥"
            : "Check in on your challenges to maintain your streaks! 🔥";

        this.showNotification(title, body, 'reminder');
    }

    /**
     * Start the encouragement message timer
     */
    private startEncouragementTimer(): void {
        this.stopEncouragementTimer();

        const settings = this.getSettings();
        const intervalMs = settings.encouragementIntervalHours * 60 * 60 * 1000;

        // Check if enough time has passed since last encouragement
        const timeSinceLast = Date.now() - settings.lastEncouragementTime;
        const initialDelay = Math.max(0, intervalMs - timeSinceLast);

        // Initial check after delay
        setTimeout(() => {
            this.sendEncouragementIfNeeded();

            // Then set regular interval
            this.encouragementTimer = setInterval(() => {
                this.sendEncouragementIfNeeded();
            }, intervalMs);
        }, initialDelay);
    }

    /**
     * Stop the encouragement timer
     */
    private stopEncouragementTimer(): void {
        if (this.encouragementTimer) {
            clearInterval(this.encouragementTimer);
            this.encouragementTimer = null;
        }
    }

    /**
     * Send encouragement message if user has pending challenges
     */
    private sendEncouragementIfNeeded(): void {
        this.challengeService.getChallenges().subscribe(challenges => {
            const pendingToday = this.findPendingTodayChallenges(challenges);

            if (pendingToday.length > 0) {
                const message = this.getRandomEncouragementMessage();
                this.showNotification('100DayHabitat', message, 'encouragement');

                // Update last encouragement time
                const settings = this.getSettings();
                settings.lastEncouragementTime = Date.now();
                this.saveSettings(settings);
            }
        });
    }

    /**
     * Get a random encouragement message
     */
    private getRandomEncouragementMessage(): string {
        const index = Math.floor(Math.random() * this.encouragementMessages.length);
        return this.encouragementMessages[index];
    }

    /**
     * Show a browser notification
     */
    private showNotification(title: string, body: string, tag: string): void {
        if (Notification.permission !== 'granted') return;

        const notification = new Notification(title, {
            body,
            icon: '/favicon.ico',
            tag, // Prevents duplicate notifications of same type
            requireInteraction: false
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);

        // Handle click - focus the app
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }

    /**
     * Manually trigger a test notification
     */
    async testNotification(): Promise<boolean> {
        const granted = await this.requestPermission();
        if (granted) {
            this.showNotification(
                '100DayHabitat Test',
                'Notifications are working! 🎉',
                'test'
            );
            return true;
        }
        return false;
    }
}
