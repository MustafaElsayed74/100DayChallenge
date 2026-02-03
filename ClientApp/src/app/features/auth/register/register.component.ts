import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'] // Reusing login styles or separate? Let's assume shared or copied.
})
export class RegisterComponent {
    registerForm: FormGroup;
    error: string = '';

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
        this.registerForm = this.fb.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.auth.register(this.registerForm.value).subscribe({
                next: () => this.router.navigate(['/dashboard']),
                error: (err) => this.error = err.error?.message || 'Registration failed.'
            });
        }
    }
}
