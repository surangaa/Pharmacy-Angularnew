import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ItemStockService extends DataService {
  
  constructor(http: HttpClient) { 
    super('http://127.0.0.1:8000/api/itemstocks', http);
  }

  handleResponse(data){

  }

  handleerror(error){
    
  }
}
