import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  name;
  constructor() { }

  ngOnInit(): void {
    this.name = sessionStorage.getItem('name');
    console.log('name of user',name);
  }

  logout(){
    console.log('logout called');
    sessionStorage.setItem('name', '');
  }
  
}
