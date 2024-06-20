import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css']
})
export class UploadDocumentsComponent {

  @Output() sendFiles = new EventEmitter<Object>();
  @Output() sendDeleteFile = new EventEmitter<Object>();
  
  documentsRequired: any = [{
    type: "Facura (XML)",
    controlName: "invoiceXML",
    size: undefined,
    realSize: undefined,
    file: undefined,
    fileName: undefined,
    accept: ".xml"
  },
  {
    type: "Facura (PDF)",
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
  },
  {
    type: "Parcial1 (XML)",
    controlName: "partialXML",
    size: undefined,
    realSize: undefined,
    file: undefined,
    fileName: undefined,
    accept: ".xml"
  },
  {
    type: "Parcial1 (PDF)",
    controlName: "partialPDF",
    size: undefined,
    realSize: undefined,
    file: undefined,
    fileName: undefined,
    accept: "application/pdf"
  }];

  UploadFile(event:any, typeFile:string) {
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

  sendFile(file:any) {
    this.sendFiles.emit(file);
  }

  deleteFile(file:any) {
    this.documentsRequired.forEach((item:any, index:number) => {
      if (item.type === file.type) {
        item.size = undefined;
        item.realSize = undefined;
        item.file = undefined;
        item.fileName = undefined;
      }
    });
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
