import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authChanged = new Subject<boolean>();
  private user: User | undefined;

  constructor(private router: Router) {}

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
    this.authChanged.next(true);
    this.router.navigate(['/training']);
  }

  login(authData: AuthData) {
    this.registerUser(authData);
  }

  logout() {
    this.user = undefined;
    this.authChanged.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return !!this.user;
  }
}
