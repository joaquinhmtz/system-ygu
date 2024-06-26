import { Component, OnInit } from '@angular/core';

import { SessionService } from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  collapseShow = "hidden";
  permissions: any = {};

  constructor(
    private session: SessionService
  ) {}

  ngOnInit(): void {
    //Permisos para el modulo de usuarios
    this.permissions = this.session.GetPermissions(1);
  }

  toggleCollapseShow(classes:any) {
    this.collapseShow = classes;
  }
}
