import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  collapseShow = "hidden";

  ngOnInit(): void {
    
  }

  toggleCollapseShow(classes:any) {
    this.collapseShow = classes;
  }
}
