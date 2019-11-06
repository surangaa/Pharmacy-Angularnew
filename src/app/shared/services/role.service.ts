import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends DataService {

  constructor(http: HttpClient) {
  super('http://127.0.0.1:8000/api/roles', http);
 }

}
