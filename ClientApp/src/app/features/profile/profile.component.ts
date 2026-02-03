import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    profileForm: FormGroup;
    passwordForm: FormGroup;
    loading = false;
    successMessage = '';
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
        private router: Router
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
