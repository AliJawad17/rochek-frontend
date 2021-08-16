import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  private routeURL: String = `${environment.apiBaseUrl}user/`;
  constructor(protected http: HttpClient) { }

  // login(item): Observable<Object> {
  login(item) {
    console.log('item service', item);
    return this.http.post(`${this.routeURL}login`, item)
      .pipe(response => {
        // let res = response.json();
        // my change
        let res = response;
        // console.log('login service response', res);
        // sessionStorage.setItem('id', res['userId']);
        // sessionStorage.setItem('name', res['name']);
        // // sessionStorage.setItem('email', res['email']);
        // // sessionStorage.setItem('value', res['isSuperUser']);
        // sessionStorage.setItem('token', res['token']);

        return res;
        // return true;
      })
      //.catch(this.handleError);
  }

}
