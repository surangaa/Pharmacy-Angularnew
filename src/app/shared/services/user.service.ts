import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService {

  constructor(http: HttpClient) {
    super('http://127.0.0.1:8000/api/users', http);
  }

  resetUserPassword(userId){
    return this.http.get('http://127.0.0.1:8000/api/users/reset/' + userId)
      .catch(this.handleError);
  }

  changeUserPassword(userId, data){
    return this.http.post('http://127.0.0.1:8000/api/users/change/' + userId, data)
      .catch(this.handleError);
  }

}
