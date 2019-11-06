import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppError } from '../errors/app-error';
import { NotFoundError } from '../errors/not-found-error';
import { BadInput } from '../errors/bad-input';
import { UnprocessableEntity } from '../errors/unprocessable-entity';
import { Unauthorized } from '../errors/unauthorized';
import { ConflictState } from '../errors/conflict-state';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private url: string, protected http: HttpClient) { }

  getAll() {
    return this.http.get(this.url)
      .catch(this.handleError);
  }

  getById(id) {
    return this.http.get(`${this.url}/${id}`)
      .catch(this.handleError);
  }

  create(resource) {
    return this.http.post(this.url, resource , this.httpOptions)
      .catch(this.handleError);
  }

  update(resource, id) {
    return this.http.put(`${this.url}/${id}`, resource, this.httpOptions)
      .catch(this.handleError);
  }

  delete(id) {
    return this.http.delete(`${this.url}/${id}`)
      .catch(this.handleError);
  }

  getPaginateData(urlWithParams){
    console.log(this.url + urlWithParams);
    return this.http.get(this.url + urlWithParams)
      .catch(this.handleError);
  }

  protected handleError(error: Response) {
    if (error.status === 400) {
      return Observable.throw(new BadInput(error.json));
    }
    if (error.status === 401) {
      return Observable.throw(new Unauthorized(error.json));
    }
    if (error.status === 404) {
      return Observable.throw(new NotFoundError() );
    }
    if(error.status === 422) {
      return Observable.throw(new UnprocessableEntity(error ));
    }
    if(error.status === 409) {
      return Observable.throw(new ConflictState(error ));
    }
    return Observable.throw(new AppError(error.json));
  }

}
