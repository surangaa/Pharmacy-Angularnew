import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService extends DataService {

  constructor(http: HttpClient) { 
    super('http://127.0.0.1:8000/api/stocks', http);
  }
}
