import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject, take } from 'rxjs';
import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authChanged = new Subject<boolean>();
  private user: User | undefined;

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService
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
    this.uiService.loadingStateChanged.next(true);
    this.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.auth.signOut();
        this.router.navigate(['/login']);
      })
      .catch((error) => this.handleError(error))
      .finally(() => {
        this.uiService.loadingStateChanged.next(false);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
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
      .catch((error) => this.handleError(error))
      .finally(() => {
        this.uiService.loadingStateChanged.next(false);
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

  handleError(error: any) {
    let msg = 'Unknown error occurred';
    switch (error.code) {
      case 'auth/email-already-in-use':
        msg = 'This email has already registered';
        break;
      case 'auth/weak-password':
        msg = 'Password is not strong enough';
        break;
      case 'auth/user-not-found':
        msg = 'The user not found';
        break;
      case 'auth/wrong-password':
        msg = 'The password is not correct';
        break;
    }

    this.uiService.showSnackbar(msg, undefined);
  }
}
