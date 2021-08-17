import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoreService } from '../services/core.service';

@Injectable({
  providedIn: 'root'
})

export class LaftService {

  constructor(
    private core: CoreService,
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'

    })
  }; 
  get(url: string): Observable<any> {
    return this.http.get(`${url}`);
  }

  post(url: string, data: any): Observable<any> {
    return this.http.post(`${url}`, data);
  }

  put(url: string, data: any): Observable<any> {
    return this.http.put(`${url}`, data);
  }
}
