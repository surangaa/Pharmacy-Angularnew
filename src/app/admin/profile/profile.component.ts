import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public form = {
    CurrentPassword: null,
    Password: null,
    confirmPassword: null,
  };

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {

  }

  onSubmit() {
    this.userService.changeUserPassword(this.authService.getUsersId(), this.form).subscribe(
      data => this.handleResponse(data),
    );
  }

  handleResponse(data) {

  }

}
