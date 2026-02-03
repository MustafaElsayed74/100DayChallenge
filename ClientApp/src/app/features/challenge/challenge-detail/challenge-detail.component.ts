import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChallengeService, Challenge, ChallengeDay, DayStatus } from '../../../core/services/challenge.service';
import { ConfettiService } from '../../../core/services/confetti.service';

@Component({
    selector: 'app-challenge-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './challenge-detail.component.html',
    styleUrls: ['./challenge-detail.component.scss']
})
export class ChallengeDetailComponent implements OnInit {
    challenge: Challenge | null = null;
    days: ChallengeDay[] = [];

    selectedDay: ChallengeDay | null = null;
    modalStatus: DayStatus = DayStatus.Pending;
    modalNote: string = '';

    showCelebrationModal: boolean = false;
    celebrationQuote: string = '';

    DayStatus = DayStatus; // For template enum access

    constructor(
        private route: ActivatedRoute,
        private challengeService: ChallengeService,
        private router: Router,
        private confettiService: ConfettiService
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loadChallenge(+id);
            }
        });
    }

    loadChallenge(id: number) {
        this.challengeService.getChallenge(id).subscribe(data => {
            this.challenge = data;
            this.days = data.days || [];
            this.calculateStats();
        });
    }

    getDayClass(day: ChallengeDay): string {
        const isToday = this.isToday(day.date);
        const statusClass = DayStatus[day.status].toLowerCase();
        return `${statusClass} ${isToday ? 'today' : ''}`;
    }

    isToday(dateStr: string): boolean {
        const d = new Date(dateStr);
        const today = new Date();
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    }

    openDay(day: ChallengeDay) {
        this.selectedDay = day;
        this.modalStatus = day.status;
        this.modalNote = day.note || '';
    }

    closeModal() {
        this.selectedDay = null;
        this.showCelebrationModal = false;
    }

    saveDay() {
        if (this.challenge && this.selectedDay) {
            this.challengeService.updateDay(
                this.challenge.id,
                this.selectedDay.dayNumber,
                +this.modalStatus, // Ensure number
                this.modalNote
            ).subscribe(updatedDay => {
                const index = this.days.findIndex(d => d.dayNumber === updatedDay.dayNumber);
                if (index !== -1) {
                    this.days[index] = updatedDay;
                }
                this.calculateStats();

                // Check for completion
                if (this.challenge && this.challenge.completedDays === this.days.length) {
                    this.celebrationQuote = this.getRandomQuote();
                    this.showCelebrationModal = true;
                    this.confettiService.celebrate();
                }

                this.selectedDay = null; // Close day modal
            });
        }
    }

    private quotes = [
        "Discipline is the bridge between goals and accomplishment.",
        "Success doesn't just find you. You have to go out and get it.",
        "The harder you work for something, the greater you'll feel when you achieve it.",
        "Don't stop when you're tired. Stop when you're done.",
        "Your future is created by what you do today, not tomorrow.",
        "It always seems impossible until it's done.",
        "Great job! You proved to yourself that you can do hard things."
    ];

    private getRandomQuote(): string {
        const index = Math.floor(Math.random() * this.quotes.length);
        return this.quotes[index];
    }

    deleteChallenge() {
        if (!this.challenge) return;
        if (confirm('Are you sure you want to delete this challenge? This cannot be undone.')) {
            this.challengeService.deleteChallenge(this.challenge.id).subscribe(() => {
                this.router.navigate(['/']);
            });
        }
    }

    calculateStats() {
        if (!this.challenge || !this.days) return;

        this.challenge.completedDays = this.days.filter(d => d.status === DayStatus.Completed).length;

        // Simple Current Streak Calculation
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sortedDays = [...this.days].sort((a, b) => a.dayNumber - b.dayNumber);
        const pastDays = sortedDays
            .filter(d => new Date(d.date) <= today)
            .sort((a, b) => b.dayNumber - a.dayNumber); // Descending

        let streak = 0;
        for (const day of pastDays) {
            if (day.status === DayStatus.Completed) {
                streak++;
            } else if (this.isToday(day.date) && day.status === DayStatus.Pending) {
                // Allow today to be pending
                continue;
            } else {
                break;
            }
        }
        this.challenge.currentStreak = streak;
    }
}
