import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FriendDto {
    id: number;
    friendId: string;
    fullName: string;
    userName: string;
    email: string;
    avatar: string;
    becameFriendsOn: string;
}

export interface FriendRequestDto {
    id: number;
    requesterId: string;
    requesterName: string;
    requesterUserName: string;
    requesterAvatar: string;
    sentOn: string;
}

export interface UserSummaryDto {
    userId: string;
    fullName: string;
    userName: string;
    email: string;
    avatar: string;
    isFriend: boolean;
    hasPendingRequest: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class FriendService {
    private apiUrl = `${environment.apiUrl}/friendrequests`;

    constructor(private http: HttpClient) { }

    getFriends(): Observable<FriendDto[]> {
        return this.http.get<FriendDto[]>(this.apiUrl);
    }

    getPendingRequests(): Observable<FriendRequestDto[]> {
        return this.http.get<FriendRequestDto[]>(`${this.apiUrl}/requests/pending`);
    }

    searchUsers(query: string): Observable<UserSummaryDto[]> {
        return this.http.get<UserSummaryDto[]>(`${this.apiUrl}/search?query=${query}`);
    }

    sendRequest(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/send`, { email });
    }

    acceptRequest(requestId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/accept/${requestId}`, {});
    }

    declineRequest(requestId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/decline/${requestId}`, {});
    }
}
