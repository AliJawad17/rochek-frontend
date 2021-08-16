import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './users/users.component';
import { QuotationsComponent } from './quotations/quotations.component';
import { AddQuotationsComponent } from './add-quotations/add-quotations.component';
// import { RoiInputSectionComponent } from './quotations/ROI/roi-input-section/roi-input-section.component';

const routes: Routes = [
  { path: '', component: DashboardComponent ,children:[
    { path: '', component: UsersComponent  },
    { path: 'quotations', component: QuotationsComponent,},
    { path: 'addquotations', component: AddQuotationsComponent,
    // children:[{path:'roi', component: RoiInputSectionComponent}]
  },
  // {path:'roi', component: RoiInputSectionComponent }
  ] },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
