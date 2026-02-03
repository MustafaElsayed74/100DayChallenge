import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    error: string = '';

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.auth.login(this.loginForm.value).subscribe({
                next: () => this.router.navigate(['/dashboard']),
                error: (err) => this.error = err.error?.message || 'Login failed.'
            });
        }
    }
}
