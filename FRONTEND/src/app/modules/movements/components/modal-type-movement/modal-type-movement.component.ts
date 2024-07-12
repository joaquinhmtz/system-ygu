import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { HttpService } from 'src/app/shared/services/http.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';

@Component({
  selector: 'app-modal-type-movement',
  templateUrl: './modal-type-movement.component.html',
  styleUrls: ['./modal-type-movement.component.css']
})
export class ModalTypeMovementComponent implements OnInit {

  @Output() sendXMLData = new EventEmitter<Object>();
  showModal:Boolean = false;

  constructor(
    private http: HttpService,
    private session: SessionService,
    private swal: SweetalertService
  ) {}
  
  ngOnInit(): void {
    
  }

  UploadXML(event:any) {
    const file:File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("invoiceXml", file, file.name);

      this.swal.loading("Extrayendo información", "Espere un momento...");
      this.http.HTTP_POST("/api/v1/movement/read-xml", formData)
        .subscribe((res: any) => {
          this.swal.close();
          this.toggleModal();
          res.data["type"] = "xml";
          res.data["invoiceXML"] = file;
          this.sendData(res.data);
        }, (err) => {
          this.session.CheckError(err);
        });
    }
  }

  sendData(data:any) {
    this.sendXMLData.emit(data);
  }

  toggleModal(){
    this.showModal = !this.showModal;
  }

}
