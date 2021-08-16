import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PriceService {


  private routeURL: String = `${environment.apiBaseUrl}price/`;
  constructor(protected http: HttpClient) { }

  create(item) {
    // title = title.toLowerCase( );
    console.log('price create service', item);
    return this.http.post(`${this.routeURL}create`, item);
  }

  // findAll() {
  //   return this.http.get(`${this.routeURL}/findAll`, this.setHeaders());
  // }
  findAll(id) {
    return this.http.get(`${this.routeURL}/findAll/${id}`);
  }

  /**
   * Update record
   */
  update(id: Number, item) {
    return this.http.put(`${this.routeURL}update/${id}`, item);
  }

  /**
   * Update record
   */
  updateSum( item) {
    return this.http.put(`${this.routeURL}updateSum`, item);
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
  delete(title, id: number) {
    // title = title.toLowerCase( );
    console.log('service', title);
    return this.http.put(`${this.routeURL}delete/${id}`, title);
    // return this.http.delete(`${this.routeURL}delete/${id}`);
  }

}
