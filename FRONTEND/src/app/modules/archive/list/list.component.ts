import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from 'src/app/shared/services/http.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  
  total: number = 0;
  archives:Array<any> = [];
  p: any;
  params: any = {
    filters: {
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
    private swal: SweetalertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.GetData();
  }

  async GetData(event?:any) {
    this.swal.loading("Cargando resultados...");
    if (event) this.params.pagination.page = event;
    await this.GetArchive();
    await this.GetTotal();
  }

  GetArchive() {
    return new Promise<Boolean>((resolve, reject) => {
      this.http.HTTP_POST("/api/v1/archive/list", this.params)
        .subscribe((res: any) => {
          this.swal.close();
          this.archives = res.data;
          resolve(true);
        }, err => {
          this.session.CheckError(err);
        });
    });
  }

  GetTotal() {
    return new Promise<void>((resolve, reject) => {
      this.http.HTTP_POST("/api/v1/archive/count", this.params)
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

  View(url:string) {
    let path = environment.server + '/' + url;
    window.open(path, '_blank');
  }

  Download(url:string) {
    let data = environment.server + '/' + url;

    this.http.HTTP_DOWNLOAD(data)
      .subscribe((blob:any) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = data;
        a.click();
        URL.revokeObjectURL(objectUrl);
      }, (err) => {
        this.session.CheckError(err);
      });
  }

  GenerateZip(data:any) {
    this.swal.loading("Generando ZIP", "Espere un momento...");

    this.http.HTTP_POST("/api/v1/archive/zip", { _id: data._id })
      .subscribe((res: any) => {
        this.swal.close();
        setTimeout(() => {
          this.DownloadZIP(res.data);
        },300);
        console.log(res);
      }, (err) => {
        this.session.CheckError(err);
      });
  }

  DownloadZIP(url:string) {
    let data = environment.server + '/' + url;

    this.http.HTTP_DOWNLOAD_ZIP(environment.server, url)
      .subscribe((blob:any) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        document.body.appendChild(a);
        a.download = data;
        a.click();
        URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
        this.DeleteFile(url);
      }, (err) => {
        this.session.CheckError(err);
      });
  }

  DeleteFile(url:string) {
    this.http.HTTP_POST("/api/v1/movement/delete-file", { path: url })
      .subscribe((res:any) => {
      }, (err) => {
        this.session.CheckError(err);
      });
  }
}
