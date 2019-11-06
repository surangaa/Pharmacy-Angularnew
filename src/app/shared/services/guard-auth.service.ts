import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, CanActivate, CanActivateChild } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardAuthService implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  canActivateChild(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
