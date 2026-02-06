import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  email: string;
  fullName: string;
  avatar?: string;
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
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

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me`, data).pipe(
      tap((updatedData: any) => {
        const currentUser = this.userSubject.value;
        if (currentUser) {
          const newUser = { ...currentUser, ...updatedData };
          this.handleAuthSuccess(newUser);
        }
      })
    );
  }

  changePassword(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(user: User) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify({
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      userId: user.userId
    }));
    this.userSubject.next(user);
  }

  get token(): string | null {
    return this.userSubject.value?.token || null;
  }
}
