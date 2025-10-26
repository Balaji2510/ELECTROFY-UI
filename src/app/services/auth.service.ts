import { Injectable, signal } from '@angular/core';

export type GoogleUser = { name: string, picture: string, email: string };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<GoogleUser | null>(this.getUserFromSession());

  private getUserFromSession(): GoogleUser | null {
    const userStr = sessionStorage.getItem('google_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setCurrentUser(user: GoogleUser | null) {
    this.currentUser.set(user);
    if (user) {
      sessionStorage.setItem('google_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('google_user');
    }
  }
}