import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Observable  } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private API: string = environment.server;

  constructor(
    private http : HttpClient
  ) { }

  HTTP_POST(endpoint:string, data:any):Observable<any>{
    return this.http
      .post(`${this.API}${endpoint}`,data)
      .pipe(catchError(this.handleError))
  }

  HTTP_GET(endpoint:string, params?:any):Observable<any>{
    return this.http
      .get(`${this.API}${endpoint}`,{params:params})
      .pipe(catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse){
		return throwError(error.error);
  }
}
