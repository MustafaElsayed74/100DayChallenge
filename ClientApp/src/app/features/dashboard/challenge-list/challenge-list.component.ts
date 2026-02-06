import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeService, Challenge } from '../../../core/services/challenge.service';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-challenge-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './challenge-list.component.html',
    styleUrls: ['./challenge-list.component.scss']
})
export class ChallengeListComponent implements OnInit {
    challenges: Challenge[] = [];
    currentUserId: string = '';

    constructor(private challengeService: ChallengeService, private authService: AuthService) { }

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            if (user) this.currentUserId = user.userId;
        });

        this.challengeService.getChallenges().subscribe(data => {
            this.challenges = data;
        });
    }

    isFriendChallenge(challenge: Challenge): boolean {
        return !!challenge.ownerId && challenge.ownerId !== this.currentUserId;
    }

    getProgress(challenge: Challenge): number {
        const start = new Date(challenge.startDate).getTime();
        const end = new Date(challenge.endDate).getTime();
        const totalDuration = (end - start) / (1000 * 3600 * 24) + 1; // +1 to include end date

        if (totalDuration <= 0) return 0;

        return (challenge.completedDays / totalDuration) * 100;
    }
}
