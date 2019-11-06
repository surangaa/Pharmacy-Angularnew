import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import { AppError } from '../errors/app-error';
import { NotFoundError } from '../errors/not-found-error';
import { BadInput } from '../errors/bad-input';
import { UnprocessableEntity } from '../errors/unprocessable-entity';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { Unauthorized } from '../errors/unauthorized';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://127.0.0.1:8000/api/auth/login';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };
  httpClient: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) { }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public readToken(): any {
    const token = localStorage.getItem('token');
    return this.jwtHelper.decodeToken(token);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('no token');
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }

  getUsersRole() {
    const tokenPayload = decode(localStorage.getItem('token'));
    return tokenPayload.role;
  }

  getUsersId() {
    const tokenPayload = decode(localStorage.getItem('token'));
    return tokenPayload.id;
  }

  login(credentials) {
    return this.http.post(this.url, credentials, this.httpOptions)
      .map((response: any) => {
        if (response && response.access_token) {
          localStorage.setItem('token', response.access_token);
          return true;
        }
        return false;
      }).catch(this.handleError);
  }

  SendPassswordReset(data) {

  }


  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  protected handleError(error: Response) {
    if (error.status === 400) {
      return Observable.throw(new BadInput(error.json));
    }
    if (error.status === 401) {
      return Observable.throw(new Unauthorized(error.json));
    }
    if (error.status === 404) {
      return Observable.throw(new NotFoundError());
    }
    if (error.status === 422) {
      return Observable.throw(new UnprocessableEntity(error));
    }
    return Observable.throw(new AppError(error.json));
  }


}
