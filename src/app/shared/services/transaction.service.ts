import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends DataService {

  constructor(http: HttpClient) {
    super('http://127.0.0.1:8000/api/transactions', http);
  }

  createReturnTransaction(resource){
    return this.http.post('http://127.0.0.1:8000/api/transactions/correct', resource)
      .catch(this.handleError);
  }

}
