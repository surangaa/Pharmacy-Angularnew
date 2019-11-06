import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  Users: any = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
      this.loadOthers();
  }

  loadOthers() {
    this.userService.getAll().subscribe(
      usersData => {
        console.log(usersData);
        this.Users = usersData;
      }
    );
  }
}
