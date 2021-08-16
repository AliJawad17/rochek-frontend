import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { ResponseContentType } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class PDFService {

  pdfMake: any;
  // private routeURL: String = `${environment.apiBaseUrl}customer/`;
  constructor(protected http: HttpClient) { }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generatePdf(docDefinition) {

    await this.loadPdfMaker();

    const def = { content: docDefinition };
    this.pdfMake.createPdf(def).open();
  }

  // getPdfFromPrint(base64) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'

  //   });
  //   const options = { headers: headers, responseType: ResponseContentType.Blob };
  //   const url = environment.NewApiUrl + environment.version2 + '/Templates/ImageToPdf';
  //   return this.http.post(url, base64, { headers: headers, observe: 'response', responseType: 'blob' }
  //   ).pipe(
  //     map(
  //       (res) => {
  //         var blob = new Blob([res.body], { type: 'application/pdf' })
  //         window.saveAs(blob, base64.FileName);
  //         return true
  //       })
  //   );

  // }
}
