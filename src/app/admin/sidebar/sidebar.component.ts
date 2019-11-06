import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  isManager() {
    return this.authService.getUsersRole() === 'manager';
  }

  isStaff() {
    return this.authService.getUsersRole() === 'staff';
  }


}
