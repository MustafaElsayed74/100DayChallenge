import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  email: string;
  fullName: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  private loadUser() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      this.userSubject.next({ ...JSON.parse(userStr), token });
    }
  }

  register(data: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, data).pipe(
      tap(user => this.handleAuthSuccess(user))
    );
  }

  login(data: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, data).pipe(
      tap(user => this.handleAuthSuccess(user))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(user: User) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify({ email: user.email, fullName: user.fullName }));
    this.userSubject.next(user);
  }

  get token(): string | null {
    return this.userSubject.value?.token || null;
  }
}
