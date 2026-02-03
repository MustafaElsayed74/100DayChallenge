import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ChallengeService } from '../../../core/services/challenge.service';

@Component({
  selector: 'app-challenge-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './challenge-create.component.html',
  styleUrls: ['./challenge-create.component.scss']
})
export class ChallengeCreateComponent {
  model: any = {
    title: '',
    goalDescription: '',
    startDate: new Date().toISOString().split('T')[0], // Default to today
    durationDays: 100,
    notes: ''
  };

  constructor(private challengeService: ChallengeService, private router: Router) {}

  onSubmit() {
    this.challengeService.createChallenge(this.model).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Failed to create challenge', err);
        alert('Failed to create challenge. Check console for details.');
      }
    });
  }
}
