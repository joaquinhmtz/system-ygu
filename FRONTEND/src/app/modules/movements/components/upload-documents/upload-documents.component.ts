import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

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
  @Input('setUrlFile') setUrlFile:any = Subject;
  @Input('setPartialXML') setPartialXML:any = Subject;
  
  documentsRequired: any = [];
  documentsOfPayment: any = [{
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
  documentsOfstatements: any = [{
    type: "Archivo (PDF)",
    controlName: "documentStatementPDF",
    size: undefined,
    realSize: undefined,
    file: undefined,
    fileName: undefined,
    accept: "application/pdf"
  }];
  documentsOfTax: any = [{
    type: "Archivo de pago (PDF)",
    controlName: "paymentDocumentPDF",
    size: undefined,
    realSize: undefined,
    file: undefined,
    fileName: undefined,
    accept: "application/pdf"
  }, {
    type: "Archivo de cálculo (PDF)",
    controlName: "calculingDocumentPDF",
    size: undefined,
    realSize: undefined,
    file: undefined,
    fileName: undefined,
    accept: "application/pdf"
  }];

  constructor(){}

  ngOnInit(): void {
    //this.InitRequiredDocuments();
    this.changePaymentMethod.subscribe((e:any) => {
      console.log(e)
      this.paymentMethod = e;
      this.InitRequiredDocumentsV2();
      // this.InitRequiredDocuments();
    });
    this.setPartialXML.subscribe((e:any) => {
      this.documentsRequired[0].fileName = e.file.name;
      this.documentsRequired[0].file = e.file;
      this.documentsRequired[0].realSize = this.GetFileSize(e.file.size);
      this.documentsRequired[0].size = e.file.size;
      this.documentsRequired[0].path = e.path;
    });
    this.setUrlFile.subscribe((e:any) => {
      this.documentsRequired.forEach((item:any, index:number) => {
        if (item.type === e.type) {
          item.path = e.url;
        }
      });
    });
    
  }

  InitRequiredDocuments() {
    if (this.paymentMethod !== null || this.paymentMethod !== undefined || this.paymentMethod !== "") {
      if (this.paymentMethod === "PUE") {
        for (let i = 0; i < this.documentsRequired.length; i++) {
          if (this.documentsRequired[i].controlName === "partialPDF") this.documentsRequired.splice(i, 1);
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
          controlName: "partialPDF",
          size: undefined,
          realSize: undefined,
          file: undefined,
          fileName: undefined,
          accept: "application/pdf"
        });
      }
    }
  }

  InitRequiredDocumentsV2() {
    if (this.paymentMethod === null) this.documentsRequired = [];
    if (this.paymentMethod !== null || this.paymentMethod !== undefined || this.paymentMethod !== "") {
      if (this.paymentMethod === "ESTADO DE CUENTA" || this.paymentMethod === "IMPUESTOS") {
        if (this.documentsRequired.length >= 1) {
          for (let i = 0; i < this.documentsRequired.length; i++) {
            if (this.documentsRequired[i] && this.documentsRequired[i].controlName === "invoiceXML") this.documentsRequired.splice(i, 1);
            if (this.documentsRequired[i] && this.documentsRequired[i].controlName === "invoicePDF") this.documentsRequired.splice(i, 1);
            if (this.documentsRequired[i] && this.documentsRequired[i].controlName === "voucherOfPayment") this.documentsRequired.splice(i, 1);
            if (this.documentsRequired[i] && this.documentsRequired[i].controlName === "partialPDF") this.documentsRequired.splice(i, 1);
            if (this.documentsRequired[i] && this.documentsRequired[i].controlName === "partialXML") this.documentsRequired.splice(i, 1);
          }
        }
        if (this.paymentMethod === "ESTADO DE CUENTA") this.documentsRequired = this.documentsOfstatements;
        if (this.paymentMethod === "IMPUESTOS") this.documentsRequired = this.documentsOfTax;
      } else if (this.paymentMethod === "CLIENTE (INGRESO)" || this.paymentMethod === "PROVEEDOR (EGRESO)" || this.paymentMethod === "PPD" || this.paymentMethod === "PUE") {
        if (this.paymentMethod === "PPD") {
          this.documentsRequired = this.documentsOfPayment;
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
            controlName: "partialPDF",
            size: undefined,
            realSize: undefined,
            file: undefined,
            fileName: undefined,
            accept: "application/pdf"
          });
        } else if (this.paymentMethod === "PUE") {
          this.documentsRequired = this.documentsOfPayment;
          for (let i = 0; i < this.documentsRequired.length; i++) {
            if (this.documentsRequired[i].controlName === "partialXML") this.documentsRequired.splice(i, 1);
            if (this.documentsRequired[i].controlName === "partialPDF") this.documentsRequired.splice(i, 1);
          }
        }
      }
    }
  }

  UploadFile(event:any, typeFile:string) {
    //console.log("event**", event);
    //console.log("typeFile**", typeFile);
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

  View(file:any) {
    let path = environment.server + '/' + file.path;
    window.open(path, '_blank');
  }
}
