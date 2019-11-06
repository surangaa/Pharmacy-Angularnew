import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { NgForm } from '@angular/forms';
import { Role } from 'src/app/models/role.model';
import { RoleService } from 'src/app/shared/services/role.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppError } from 'src/app/shared/errors/app-error';


declare var $;

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  // roles: Role[] = [
  //   {id: 1 , name: 'manager'},
  //   { id: 2, name: 'staff' },

  // ];
  constructor(
    private usersService: UserService,
    private roleService: RoleService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  public users: any = [];
  public roles: any = [];
  @ViewChild('usersTable') Table;
  @ViewChild('f') userForm: NgForm;
  public dataTableUser: any;
  buttonValue = 'Add';
  currentUser: number;
  user = {
    name: '',
    role: '',
    code: '',
    street: '',
    city: '',
    contact: '',
    email: '',
    // password: ''

  };

  // staffmembers = ['admin', 'staff member'];
  selectedvalue: number;
  ngOnInit() {
    this.buttonValue = 'Add';
    this.loadUsers();
    this.loadOthers();
  }

  getCurrentLoginUserId() {
    return this.authService.getUsersId();
  }

  loadUsers() {
    if ($.fn.DataTable.isDataTable(this.Table.nativeElement)) {
      $(this.Table.nativeElement).dataTable().fnDestroy();
    }
    this.usersService.getAll().subscribe(
      userData => {
        this.users = userData;
        this.dataTableUser = $(this.Table.nativeElement);
        setTimeout(() => {
          this.dataTableUser.DataTable();
        }, 1);
      }, (err) => {
      }, () => {
      }
    );

  }

  loadOthers() {
    this.roleService.getAll().subscribe(
      roleData => {
        console.log(roleData);
        this.roles = roleData;
      }
    );
  }

  onSubmit() {
    console.log(this.userForm);
    this.user.name = this.userForm.value.user;
    this.user.code = this.userForm.value.code;
    this.user.street = this.userForm.value.street;
    this.user.city = this.userForm.value.city;
    this.user.role = this.userForm.value.role;
    this.user.contact = this.userForm.value.contact;
    this.user.email = this.userForm.value.email;
    // this.user.password = this.userForm.value.password;
    this.saveUserToServer(this.user);
  }

  saveUserToServer(user) {
    if (this.buttonValue === 'Add') {
      this.usersService.create(user).subscribe(
        (result) => {
          this.resetUserForm();
          this.loadUsers();
          this.toastr.success('Staff User created Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Staff User create Failed');
        }
      );
    } else {
      this.usersService.update(user, this.currentUser).subscribe(
        (result) => {
          this.resetUserForm();
          this.loadUsers();
          this.toastr.success('Staff User updated Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Staff User update Failed');
        }
      );
    }
  }

  updateUser(id) {
    this.buttonValue = 'Edit';
    this.usersService.getById(id).subscribe((result: any) => {
      console.log('result');
      console.log(result);
      this.currentUser = result.id;
      this.userForm.setValue({
        user: result.Name,
        city: result.city,
        code: result.code,
        street: result.street,
        contact: result.contact,
        role: result.role[0],
        email: result.email,
        // password: result.password,
      });
    });
  }

  resetUserForm() {
    this.buttonValue = 'Add';
    this.userForm.reset();
  }

  resetUserPassword(userId) {
    this.usersService.resetUserPassword(userId).subscribe(
      (userData) => {
        this.toastr.success('Staff User Reset Password Success');
      },
      (error: AppError) => {
        this.toastr.error('Staff User Reset Password Failed');
      }
    );
  }

  deleteUser(user) {
    if (confirm('Are you sure to delete ' + user.user)) {
      this.usersService.delete(user.id).subscribe(
        (result: any) => {
          this.loadUsers();
          this.toastr.success('Staff User deleted Successfully');
        },
        (error: AppError) => {
          this.toastr.error('Staff User deletion Failed');
        }
      );
    }
  }







}





