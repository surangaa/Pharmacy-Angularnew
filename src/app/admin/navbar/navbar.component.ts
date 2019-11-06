import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
public loggedIn: boolean;
public users: any = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    // this.Auth.authStatus.subscribe(value => this.loggedIn = value);

  }

  // public get loggedInUser(): boolean {
  //   return localStorage.getItem('access_token') !== null;
  // }
}
