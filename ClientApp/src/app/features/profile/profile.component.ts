import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService, NotificationSettings } from '../../core/services/notification.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    profileForm: FormGroup;
    passwordForm: FormGroup;
    loading = false;
    successMessage = '';

    // Notification settings
    notificationsEnabled = false;
    notificationPermission: NotificationPermission | 'unsupported' = 'default';
    reminderHour = 18;
    encouragementInterval = 4;
    errorMessage = '';

    avatars = [
        'assets/avatars/avatar-1.png', 'assets/avatars/avatar-2.png', 'assets/avatars/avatar-3.png',
        'assets/avatars/avatar-4.png', 'assets/avatars/avatar-5.png', 'assets/avatars/avatar-6.png',
        'assets/avatars/avatar-7.png', 'assets/avatars/avatar-8.png', 'assets/avatars/avatar-9.png',
        'assets/avatars/avatar-10.png', 'assets/avatars/avatar-11.png', 'assets/avatars/avatar-12.png'
    ];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private notificationService: NotificationService
    ) {
        this.profileForm = this.fb.group({
            fullName: ['', Validators.required],
            avatar: ['']
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit() {
        this.loadProfile();
        this.loadNotificationSettings();
    }

    loadNotificationSettings() {
        this.notificationPermission = this.notificationService.getPermissionStatus();
        const settings = this.notificationService.getSettings();
        this.notificationsEnabled = settings.enabled;
        this.reminderHour = settings.reminderHour;
        this.encouragementInterval = settings.encouragementIntervalHours;
    }

    async toggleNotifications() {
        const newState = !this.notificationsEnabled;
        const success = await this.notificationService.setEnabled(newState);
        if (success) {
            this.notificationsEnabled = newState;
            this.notificationPermission = this.notificationService.getPermissionStatus();
            this.successMessage = newState ? 'Notifications enabled!' : 'Notifications disabled';
        } else {
            this.errorMessage = 'Could not enable notifications. Please allow notifications in your browser.';
        }
    }

    saveNotificationSettings() {
        const settings: NotificationSettings = {
            enabled: this.notificationsEnabled,
            reminderHour: this.reminderHour,
            encouragementIntervalHours: this.encouragementInterval,
            lastEncouragementTime: this.notificationService.getSettings().lastEncouragementTime
        };
        this.notificationService.saveSettings(settings);
        this.successMessage = 'Notification settings saved!';
    }

    async testNotification() {
        const success = await this.notificationService.testNotification();
        if (!success) {
            this.errorMessage = 'Could not send test notification. Please check browser permissions.';
        }
    }

    loadProfile() {
        this.authService.getProfile().subscribe({
            next: (user) => {
                this.profileForm.patchValue({
                    fullName: user.fullName,
                    avatar: user.avatar
                });
            },
            error: () => this.errorMessage = 'Failed to load profile'
        });
    }

    onProfileSubmit() {
        if (this.profileForm.invalid) return;
        this.loading = true;
        this.successMessage = '';
        this.errorMessage = '';

        this.authService.updateProfile(this.profileForm.value).subscribe({
            next: () => {
                this.successMessage = 'Profile updated successfully!';
                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Update failed';
                this.loading = false;
            }
        });
    }

    onPasswordSubmit() {
        if (this.passwordForm.invalid) return;
        this.loading = true;
        this.successMessage = '';
        this.errorMessage = '';

        this.authService.changePassword(this.passwordForm.value).subscribe({
            next: () => {
                this.successMessage = 'Password changed successfully!';
                this.passwordForm.reset();
                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Change password failed';
                this.loading = false;
            }
        });
    }

    selectAvatar(avatar: string) {
        this.profileForm.patchValue({ avatar });
    }
}
