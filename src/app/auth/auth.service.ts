import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject, take } from 'rxjs';
import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { TrainingService } from '../training/training.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authChanged = new Subject<boolean>();
  private user: User | undefined;

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private trainingService: TrainingService
  ) {}

  initAuthListener() {
    this.auth.authState.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.user = {
          email: user.email ?? '',
          userId: user.uid ?? '',
        };
        this.authChanged.next(true);
        this.router.navigate(['/training']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.auth.signOut();
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.code);
      });
  }

  login(authData: AuthData) {
    this.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        console.log(result);
        this.user = {
          email: result.user?.email ?? '',
          userId: result.user?.uid ?? '',
        };
        this.authChanged.next(true);
        this.router.navigate(['/training']);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logout() {
    this.trainingService.cancelSubs();
    this.auth.signOut();
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
