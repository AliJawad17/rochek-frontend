import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuotationsService {


  private routeURL: String = `${environment.apiBaseUrl}`;
  constructor(protected http: HttpClient) { }

  private messageSource = new BehaviorSubject({});
  currentMessage = this.messageSource.asObservable();

  changeMessage(message) {
    this.messageSource.next(message)
  }

  create(item, title) {
    title = title.toLowerCase( );
    return this.http.post(`${this.routeURL}${title}/create`, item);
  }

  // findAll() {
  //   return this.http.get(`${this.routeURL}/findAll`, this.setHeaders());
  // }
  findAll(title, id) {
    title = title.toLowerCase( );
    return this.http.get(`${this.routeURL}${title}/findAll/${id}`);
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
  delete(title, id: number) {
    title = title.toLowerCase( );
    return this.http.delete(`${this.routeURL}${title}/delete/${id}`);
    // return this.http.delete(`${this.routeURL}delete/${id}`);
  }

}
