import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ChallengeService } from '../../../core/services/challenge.service';
import { FriendService, FriendDto } from '../../../core/services/friend.service';

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

    viewers: any[] = [];
    friends: FriendDto[] = [];
    selectedFriendId: string = '';

    constructor(
        private challengeService: ChallengeService,
        private friendService: FriendService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.challengeId = +id;
            this.loadChallenge(this.challengeId);
            this.loadViewers();
            this.loadFriends();
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

    loadViewers() {
        this.challengeService.getViewers(this.challengeId).subscribe({
            next: (res) => this.viewers = res,
            error: (err) => console.error('Error loading viewers', err)
        });
    }

    loadFriends() {
        this.friendService.getFriends().subscribe({
            next: (res) => this.friends = res,
            error: (err) => console.error('Error loading friends', err)
        });
    }

    addViewer() {
        if (!this.selectedFriendId) return;
        this.challengeService.addViewer(this.challengeId, this.selectedFriendId).subscribe({
            next: () => {
                this.selectedFriendId = '';
                this.loadViewers();
            },
            error: (err) => alert(err.error?.message || 'Failed to add viewer')
        });
    }

    removeViewer(userId: string) {
        if (!confirm('Remove this viewer?')) return;
        this.challengeService.removeViewer(this.challengeId, userId).subscribe({
            next: () => this.loadViewers(),
            error: (err) => alert(err.error?.message || 'Failed to remove viewer')
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
