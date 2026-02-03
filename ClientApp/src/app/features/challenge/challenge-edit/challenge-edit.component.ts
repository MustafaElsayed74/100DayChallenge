import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ChallengeService } from '../../../core/services/challenge.service';

@Component({
    selector: 'app-challenge-edit',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './challenge-edit.component.html',
    styleUrls: ['./challenge-edit.component.scss']
})
export class ChallengeEditComponent implements OnInit {
    challengeId: number = 0;
    model: any = {
        title: '',
        goalDescription: '',
        notes: ''
    };
    loading = true;

    constructor(
        private challengeService: ChallengeService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.challengeId = +id;
            this.loadChallenge(this.challengeId);
        }
    }

    loadChallenge(id: number) {
        this.challengeService.getChallenge(id).subscribe({
            next: (c) => {
                this.model = {
                    title: c.title,
                    goalDescription: c.goalDescription,
                    notes: c.notes || ''
                };
                this.loading = false;
            },
            error: () => {
                alert('Could not load challenge');
                this.router.navigate(['/']);
            }
        });
    }

    onSubmit() {
        this.challengeService.updateChallenge(this.challengeId, this.model).subscribe({
            next: () => {
                this.router.navigate(['/challenge', this.challengeId]);
            },
            error: (err) => {
                console.error('Failed to update challenge', err);
                alert('Failed to update challenge');
            }
        });
    }
}
