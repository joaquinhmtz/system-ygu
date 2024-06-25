import { Component, OnInit } from '@angular/core';

import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { SessionService } from 'src/app/shared/services/session.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-missing-list',
  templateUrl: './missing-list.component.html',
  styleUrls: ['./missing-list.component.css']
})
export class MissingListComponent implements OnInit {

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
    private swal: SweetalertService,
    private http: HttpService,
    private session: SessionService
  ) {}

  ngOnInit(): void {
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

  UploadFile(event:any, data:any, document:string) {
    const file:File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("uploadMissingFile", file, file.name);
      formData.append("movement", JSON.stringify({ _id: data._id, document: document }));

      this.swal.loading("Subiendo archivo", "Espere un momento...");
      this.http.HTTP_POST("/api/v1/archive/missing-file", formData)
        .subscribe((res: any) => {
          this.swal.close();
          this.GetData();
        }, (err) => {
          this.session.CheckError(err);
        });
      // this.documentsRequired.forEach((item:any, index:number) => {
      //   if (item.type === typeFile) {
      //     item.fileName = file.name;
      //     item.size = file.size;
      //     item.realSize = this.GetFileSize(file.size);
      //     item.file = file;
      //     this.sendFile(this.documentsRequired[index]);
      //   }
      // });
    }
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
}
