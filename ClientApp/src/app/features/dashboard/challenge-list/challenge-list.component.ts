import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeService, Challenge } from '../../../core/services/challenge.service';
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

    constructor(private challengeService: ChallengeService) { }

    ngOnInit() {
        this.challengeService.getChallenges().subscribe(data => {
            this.challenges = data;
        });
    }

    getProgress(challenge: Challenge): number {
        const start = new Date(challenge.startDate).getTime();
        const end = new Date(challenge.endDate).getTime();
        const totalDuration = (end - start) / (1000 * 3600 * 24) + 1; // +1 to include end date

        if (totalDuration <= 0) return 0;

        return (challenge.completedDays / totalDuration) * 100;
    }
}
