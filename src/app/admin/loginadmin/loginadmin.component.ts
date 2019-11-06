import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppError } from 'src/app/shared/errors/app-error';
import { Unauthorized } from 'src/app/shared/errors/unauthorized';

@Component({
  selector: 'app-loginadmin',
  templateUrl: './loginadmin.component.html',
  styleUrls: ['./loginadmin.component.css']
})
export class LoginadminComponent implements OnInit {
  public form = {
    email: null,
    password: null
  };
  invalidLogin = false;
   error: any;

  constructor(
    // private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.invalidLogin = false;
  }

  onSubmit() {
    this.authService.login(this.form)
      .subscribe(
        result => {
          this.invalidLogin = false;
          this.router.navigate(['admin/dashboard']);
      },
      (error: AppError) => {
        if(error instanceof Unauthorized){
          this.invalidLogin = true;
        }
      }
      );
  }
}
