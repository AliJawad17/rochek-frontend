import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {


  private routeURL: String = `${environment.apiBaseUrl}user/`;
  constructor(protected http: HttpClient) { }

  // login(item): Observable<Object> {
  register(item) {
    console.log('item service', item);
    return this.http.post(`${this.routeURL}signup`, item)
      .pipe(response => {
        // let res = response.json();
        // my change
        let res = response;
        console.log('register service response', res);
        // sessionStorage.setItem('id', res['id']);
        // sessionStorage.setItem('name', res['username']);
        // sessionStorage.setItem('email', res['email']);
        // sessionStorage.setItem('value', res['isSuperUser']);
        // sessionStorage.setItem('token', res['token']);

        return res;
        // return true;
      })
      //.catch(this.handleError);
  }

  create(item) {
    return this.http.post(`${this.routeURL}create`, item);
  }

  // findAll() {
  //   return this.http.get(`${this.routeURL}/findAll`, this.setHeaders());
  // }
  findAll() {
    return this.http.get(`${this.routeURL}findAll`);
  }

  /**
   * Update record
   */
  update(id: Number, item) {
    return this.http.put(`${this.routeURL}update/${id}`, item);
  }

  /**
   * Get single record
   */
  find(id: number) {
    return this.http.get(`${this.routeURL}find/${id}`);
  }

  /**
   * Delete record
   */
  delete(id: number) {
    return this.http.delete(`${this.routeURL}delete/${id}`);
  }

}
