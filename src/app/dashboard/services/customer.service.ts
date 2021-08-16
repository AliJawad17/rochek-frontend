import { Injectable } from '@angular/core';
import { HttpClient,  } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private routeURL: String = `${environment.apiBaseUrl}customer/`;
  constructor(protected http: HttpClient) { }


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

  createPdf(id,  item){
    return this.http.put(`${this.routeURL}createPdf/${id}`, item);
  }

  // downloadPDF(url): any {
  //   const options = { responseType: ResponseContentType.Blob  };
  //   return this.http.get(url, options).map(
  //   (res) => {
  //       return new Blob([res.blob()], { type: 'application/pdf' });
  //   });
  // }

  
}
