import { Component, OnInit } from '@angular/core';
import { QuotationsService } from '../services/quotations.service';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-quotations',
  templateUrl: './add-quotations.component.html',
  styleUrls: ['./add-quotations.component.css']
})
export class AddQuotationsComponent implements OnInit {

  customerId;
  sidesTables = [];
  constructor(
    private quotationsService: QuotationsService,
    private customerService: CustomerService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId');
    this.getAllData();
    console.log(this.sidesTables);
  }

  getAllData(){
    this.customerService.findAll().subscribe((res)=>{
      console.log('customer response', res['result']);
      this.sidesTables = res['result'];
    })
    // this.quotationsService.findAll('north', this.customerId).subscribe(res=>{
    //   this.sidesTables[2] = res['result'];
    //   // this.directionSum.north = this.calculateOppervlakte(this.sidesTables[2].rowData, 2);
    // })
    // this.quotationsService.findAll('south', this.customerId).subscribe(res=>{
    //   this.sidesTables[3] = res['result'];
    //   // this.directionSum.south = this.calculateOppervlakte(this.sidesTables[3].rowData, 3);
    // })
    // this.quotationsService.findAll('east', this.customerId).subscribe(res=>{
    //   this.sidesTables[0] = res['result'];
    //   // this.directionSum.east = this.calculateOppervlakte(this.sidesTables[0].rowData, 0);
    // })
    // this.quotationsService.findAll('west', this.customerId).subscribe(res=>{
    //   this.sidesTables[1] = res['result'];
    //   // this.directionSum.west = this.calculateOppervlakte(this.sidesTables[1].rowData, 1);
    // })
  }

  deleteCustomer(id){
    this.customerService.delete(id).subscribe((res)=>{
      // console.log('delete customer response', res);
      this.getAllData();
    })
    
  }

  updateCustomer(item){
    this.quotationsService.changeMessage({id: item._id, fullname: item.fullname});
    // console.log('update customer response', item);
    localStorage.setItem('customerId', item._id);
    localStorage.setItem('customerName', item.fullname);
    this.router.navigate(['./dashboard/quotations']);
  }  

  viewCustomer(item){
    this.quotationsService.changeMessage({id: item._id, fullname: item.fullname});
    // console.log('view customer response', item);
    localStorage.setItem('customerId', item._id);
    localStorage.setItem('customerName', item.fullname);
    this.router.navigate(['./dashboard/quotations']);
  }
  newQuotation(){
    
    localStorage.setItem('customerId', '');
    localStorage.setItem('customerName', '');
    console.log('new quotation called', localStorage.getItem('customerId'));
  }

}
