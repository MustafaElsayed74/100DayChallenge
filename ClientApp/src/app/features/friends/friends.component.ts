import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendService, FriendDto, FriendRequestDto, UserSummaryDto } from '../../core/services/friend.service';

@Component({
    selector: 'app-friends',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
    activeTab: 'my-friends' | 'find-friends' = 'my-friends';

    friends: FriendDto[] = [];
    pendingRequests: FriendRequestDto[] = [];

    searchQuery: string = '';
    searchResults: UserSummaryDto[] = [];
    isSearching: boolean = false;

    constructor(private friendService: FriendService) { }

    ngOnInit(): void {
        this.loadFriendsData();
    }

    loadFriendsData(): void {
        this.friendService.getFriends().subscribe((res: FriendDto[]) => this.friends = res);
        this.friendService.getPendingRequests().subscribe((res: FriendRequestDto[]) => this.pendingRequests = res);
    }

    onSearch(): void {
        if (!this.searchQuery.trim()) return;
        this.isSearching = true;
        this.friendService.searchUsers(this.searchQuery).subscribe({
            next: (res: UserSummaryDto[]) => {
                this.searchResults = res;
                this.isSearching = false;
            },
            error: () => this.isSearching = false
        });
    }

    sendRequest(email: string): void {
        if (!confirm(`Send friend request to ${email}?`)) return;
        this.friendService.sendRequest(email).subscribe({
            next: () => {
                alert('Request sent!');
                // Update local state to reflect sent
                const user = this.searchResults.find(u => u.email === email);
                if (user) user.hasPendingRequest = true;
            },
            error: (err: any) => alert(err.error?.message || 'Failed to send request')
        });
    }

    acceptRequest(id: number): void {
        this.friendService.acceptRequest(id).subscribe({
            next: () => {
                this.loadFriendsData();
            },
            error: (err: any) => alert(err.error?.message || 'Failed to accept')
        });
    }

    declineRequest(id: number): void {
        if (!confirm('Decline this request?')) return;
        this.friendService.declineRequest(id).subscribe({
            next: () => {
                this.loadFriendsData(); // Should remove it from list
            },
            error: (err: any) => alert(err.error?.message || 'Failed to decline')
        });
    }
}
