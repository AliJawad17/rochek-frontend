import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }
  isAdmin;
  ngOnInit(): void {
    this.isAdmin = sessionStorage.getItem('value1');
    // console.log('admin', this.isAdmin, sessionStorage.getItem('value1'));
    // if (this.email != 'admin@gmail.com'){
    //   this.isAdmin = true;
    // }
  }
  sidebarToggle(){
    document.getElementById('nav-bar').classList.toggle('width40');
    document.getElementById('main-content-area').classList.toggle('toggle-main-content');
    document.getElementById('header_toggle_icon').classList.toggle('header_toggle_postion');
  }
}
