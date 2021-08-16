import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterService } from 'src/app/dashboard/services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  fg: FormGroup;
  deleteId = 0;
  updataData = false;
  data = new Array() ; 
  registerUser;
  isAdmin;
  user = {name:'', email:''}

   constructor(
     private fb: FormBuilder,
     private registerService: RegisterService,
     public activeModal: NgbModal,
     private router: Router,
    ){
      // this.fg.reset();
  }

  ngOnInit(): void {
    this.getData();
    
    this.fg = this.fb.group({
      fullname:'',
      email:'', 
      password:''
    });
  }

  register(){
    this.registerUser = this.fg.value;
    this.registerService.register(this.registerUser).subscribe(response => {
      // console.log('user component response', response);
      this.getData();
    });
    // console.log("Form was submitted!");
    
  }

  update(){
    this.registerUser = this.fg.value;
    console.log('user component response', this.registerUser);
    this.registerService.update(this.registerUser.id, this.registerUser).subscribe(response => {
      // console.log('user component response', response);
      this.getData();
    });
    this.user.name = '';
    this.user.email = '';
  }

  delete(){
    this.registerService.delete(this.deleteId).subscribe(response=>{
        let d = this.getData();
    })
  }

  deleteModalId(id){
    this.deleteId = id;
  }

  updateModalId(data){
    console.log('update data', data);
    this.updataData = true;
    this.user.email = data.email;
    this.user.name = data.fullname;
    
  }

  getData() {
    this.data = [];
    this.isAdmin = sessionStorage.getItem('value1');
    this.registerService.findAll().subscribe(response => {
      let j = 0;
      console.log('admin response', this.isAdmin);
      // debugger;
      if(this.isAdmin == 'true'){
        for(var i=0; i<response['result'].length; i++){
          var obj = response['result'][i];
          // console.log('obj response', obj);
          if(obj.email != 'admin@gmail.com'){
            obj['id'] = j+1;
            this.data[j] = obj;
            j++;
          }
          
        }
      }else if (this.isAdmin == 'false') {
        console.log('user admin th', this.isAdmin);
        this.router.navigate(['../../dashboard/addquotations']);
      }
      
      console.log('users data', this.data);
      // this.data = response['result'];
    });
    // this.data = [
    //   {id:1, fullname:'Ali', email:'ali@ngxoft.com'},
    //   {id:2, fullname:'Jawad', email:'jawad@ngxoft.com'},
    //   {id:3, fullname:'Sabir', email:'sabir@ngxoft.com'}
    // ];
  }
 
}


