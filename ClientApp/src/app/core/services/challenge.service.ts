import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Challenge {
    id: number;
    title: string;
    goalDescription: string;
    startDate: string;
    endDate: string;
    notes: string;
    completedDays: number;
    skippedDays: number;
    currentStreak: number;
    days?: ChallengeDay[];
    ownerId?: string;
    ownerName?: string;
}

export interface ChallengeDay {
    dayNumber: number;
    date: string;
    status: DayStatus; // 0=Pending, 1=Completed, 2=Skipped
    completedAt?: string;
    note?: string;
}

export enum DayStatus {
    Pending = 0,
    Completed = 1,
    Skipped = 2,
    Missed = 3
}

@Injectable({
    providedIn: 'root'
})
export class ChallengeService {
    private apiUrl = `${environment.apiUrl}/challenge`;

    constructor(private http: HttpClient) { }

    getChallenges(): Observable<Challenge[]> {
        return this.http.get<Challenge[]>(this.apiUrl);
    }

    createChallenge(data: any): Observable<Challenge> {
        return this.http.post<Challenge>(this.apiUrl, data);
    }

    getChallenge(id: number): Observable<Challenge> {
        return this.http.get<Challenge>(`${this.apiUrl}/${id}`);
    }

    updateDay(challengeId: number, dayNumber: number, status: DayStatus, note?: string): Observable<ChallengeDay> {
        return this.http.patch<ChallengeDay>(`${this.apiUrl}/${challengeId}/days/${dayNumber}`, { status, note });
    }

    deleteChallenge(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    updateChallenge(id: number, data: any): Observable<Challenge> {
        return this.http.put<Challenge>(`${this.apiUrl}/${id}`, data);
    }

    addViewer(id: number, viewerId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/viewers/${viewerId}`, {});
    }

    removeViewer(id: number, viewerId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}/viewers/${viewerId}`);
    }

    getViewers(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${id}/viewers`);
    }
}
