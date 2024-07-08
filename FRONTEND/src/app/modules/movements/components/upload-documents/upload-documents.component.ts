import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css']
})
export class UploadDocumentsComponent implements OnInit {

  @Output() sendFiles = new EventEmitter<Object>();
  @Output() sendDeleteFile = new EventEmitter<Object>();
  @Input() paymentMethod:any = String;
  @Input('changePaymentMethod') changePaymentMethod:any = Subject;
  
  documentsRequired: any = [{
    type: "Factura (XML)",
    controlName: "invoiceXML",
    size: undefined,
    realSize: undefined,
    file: undefined,
    fileName: undefined,
    accept: ".xml"
  },
  {
    type: "Factura (PDF)",
    controlName: "invoicePDF",
    size: undefined,
    realSize: undefined,
    file: undefined,
    fileName: undefined,
    accept: "application/pdf"
  },
  {
    type: "Comprobante de pago (PDF)",
    controlName: "voucherOfPayment",
    size: undefined,
    realSize: undefined,
    file: undefined,
    fileName: undefined,
    accept: "application/pdf"
  }];

  constructor(){}

  ngOnInit(): void {
    this.InitRequiredDocuments();
    this.changePaymentMethod.subscribe((e:any) => {
      this.paymentMethod = e;
      this.InitRequiredDocuments();
    });
    
  }

  InitRequiredDocuments() {
    if (this.paymentMethod !== null || this.paymentMethod !== undefined || this.paymentMethod !== "") {
      if (this.paymentMethod === "PUE") {
        for (let i = 0; i < this.documentsRequired.length; i++) {
          if (this.documentsRequired[i].controlName === "partialXML") this.documentsRequired.splice(i, 1);
          if (this.documentsRequired[i].controlName === "partialXML") this.documentsRequired.splice(i, 1);
        }
      } else if (this.paymentMethod === "PPD") {
        this.documentsRequired.push({
          type: "Complemento1 (XML)",
          controlName: "partialXML",
          size: undefined,
          realSize: undefined,
          file: undefined,
          fileName: undefined,
          accept: ".xml"
        },
        {
          type: "Complemento1 (PDF)",
          controlName: "partialXML",
          size: undefined,
          realSize: undefined,
          file: undefined,
          fileName: undefined,
          accept: "application/pdf"
        });
      }
    }
  }

  UploadFile(event:any, typeFile:string) {
    console.log("event**", event);
    console.log("typeFile**", typeFile);
    const file:File = event.target.files[0];

    if (file) {
      this.documentsRequired.forEach((item:any, index:number) => {
        if (item.type === typeFile) {
          item.fileName = file.name;
          item.size = file.size;
          item.realSize = this.GetFileSize(file.size);
          item.file = file;
          this.sendFile(this.documentsRequired[index]);
        }
      });
    }
  }

  UploadExtraFile(event:any) {
    const file:File = event.target.files[0];

    this.documentsRequired.push({
      type: "Archivo (S/Clasificación)",
      size: file.size,
      realSize: this.GetFileSize(file.size),
      file: file,
      fileName: file.name,
      controlName: "extraDocuments",
      index: 0
    });
    this.documentsRequired[this.documentsRequired.length-1].index = (this.documentsRequired.length-1);

    this.sendFile(this.documentsRequired[this.documentsRequired.length-1]);
  }

  sendFile(file:any) {
    this.sendFiles.emit(file);
  }

  deleteFile(file:any, index:number) {
    this.documentsRequired.forEach((item:any, index:number) => {
      if (file.type !== "Archivo (S/Clasificación)") {
        if (item.type === file.type) {
          item.size = undefined;
          item.realSize = undefined;
          item.file = undefined;
          item.fileName = undefined;
        }
      }
    });
    if (file.type === "Archivo (S/Clasificación)") this.documentsRequired.splice(index, 1);
    this.sendDeleteFile.emit(file);
  }

  GetFileSize(size:number):string {
    let fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
    let i = 0;
    while(size > 900) {
      size /= 1024;
      i++;
    }
    let exactSize = (Math.round(size*100)/100)+' '+fSExt[i];
    
    return exactSize;
  }
}
