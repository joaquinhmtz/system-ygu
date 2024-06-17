import { Component, OnInit } from '@angular/core';

import { HttpService } from 'src/app/shared/services/http.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

   total: number = 0;
   users:Array<any> = [];
   p: any;
   params: any = {
    filters: {
      username: undefined,
      fullname: undefined,
      status: true
    },
    pagination: {
      page: 1,
      limit: 10
    }
   };
   band: any = {
    counting: true,
    showFilters: false
   };

   constructor(
    private http: HttpService,
    private session: SessionService,
    private swal: SweetalertService
   ) {}

   ngOnInit() {
    this.GetData();
   }

   async GetData(event?:any) {
    this.swal.loading("Cargando resultados...");
    if (event) this.params.pagination.page = event;
    await this.GetUsers();
    await this.GetTotal();
   }

   GetUsers() {
    return new Promise<Boolean>((resolve, reject) => {
      this.http.HTTP_POST("/api/v1/users/list", this.params)
        .subscribe((res: any) => {
          this.swal.close();
          this.users = res.data;
          resolve(true);
        }, err => {
          this.session.CheckError(err);
        });
    });
   }

   GetTotal() {
    return new Promise<void>((resolve, reject) => {
      this.http.HTTP_POST("/api/v1/users/count", this.params)
        .subscribe((res: any) => {
          this.total = res.total;
          this.band.counting = false;
        }, err => {
          this.session.CheckError(err);
        });
    });
   }

   SetDataFilters(e:any) {
    this.params.pagination.page = 1;
    this.params.filters = e;
    this.GetData();
   }
}
