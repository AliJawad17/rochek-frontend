import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import {BrowserAnimationsModule} from '@angular/platform browser/animations';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { UsersComponent } from './users/users.component';
import { QuotationsComponent } from './quotations/quotations.component';
import { AgGridModule } from 'ag-grid-angular';

import { HttpClientModule } from '@angular/common/http';
import { SignaturePadModule } from 'angular2-signaturepad';
// import {MatTableModule} from '@angular/material/table';
// import {MatExpansionModule} from '@angular/material/expansion';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatButtonModule} from '@angular/material/button';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AddQuotationsComponent } from './add-quotations/add-quotations.component';
import { RegisterService } from 'src/app/dashboard/services/register.service';
import { QuotationsService } from 'src/app/dashboard/services/quotations.service';
import { PriceService } from './services/price.service';
import { CustomerService } from './services/customer.service';
import { ROIService } from './services/roi.service';
import { PDFService } from './services/pdf.service';
// import { RoiComponent } from './quotations/ROI/roi-calculation-section/roi/roi.component';
// import { RoiInputSectionComponent } from './quotations/ROI/roi-input-section/roi-input-section.component';
// import { RoiCalculationSectionComponent } from './quotations/ROI/roi-calculation-section/roi-calculation-section.component';

@NgModule({
  declarations: [
    DashboardComponent, 
    HeaderComponent, 
    FooterComponent, 
    SidebarComponent, 
    UsersComponent, 
    QuotationsComponent, 
    AddQuotationsComponent, 
    // BrowserAnimationsModule
    // RoiInputSectionComponent, RoiCalculationSectionComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    SignaturePadModule,
    // BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    FormsModule,
    AgGridModule.withComponents([])
  ],
  providers:[RegisterService, QuotationsService, PriceService, CustomerService, ROIService, PDFService]
})


export class DashboardModule { }
