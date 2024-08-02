import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';

@Component({
  selector: 'app-form-manual',
  templateUrl: './form-manual.component.html',
  styleUrls: ['./form-manual.component.css']
})
export class FormManualComponent implements OnInit {

  changePaymentMethod:Subject<any> = new Subject();
  setUrlFile:Subject<any> = new Subject();
  setPartialXML:Subject<any> = new Subject();

  movementForm:any = FormGroup;
  userLog: any = {};
  catalogs: any = {
    enterprises: [],
    clients: [],
    billingTypes : [{ name: "CLIENTE (INGRESO)" }, { name: "PROVEEDOR (EGRESO)" }, { name: "ESTADO DE CUENTA" },  { name: "IMPUESTOS" }],
    banks: [],
    entities: [],
    months: [{ name: "ENERO" }, { name: "FEBRERO" }, { name: "MARZO" }, { name: "ABRIL" }, { name: "MAYO" }, { name: "JUNIO" }, { name: "JULIO" }, 
      { name: "AGOSTO" }, { name: "SEPTIEMBRE" }, { name: "OCTUBRE" }, { name: "NOVIEMBRE" }, { name: "DICIEMBRE" }
    ],
    types: [],
    paymentMethods: [{ name: "PPD" }, { name: "PUE" }],
    typeReceipts: [{ name: "FACTURA" }, { name: "COMPLEMENTO" }],
  };
  band: any = {
    newClient: false,
    typeInvoice: undefined,
    newBank: undefined,
    newTypeOfTax: undefined,
    newEntity: undefined
  }

  constructor(
    private formBuilder: FormBuilder,
    private swal: SweetalertService,
    private http: HttpService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.InitCatalogs();
    this.userLog = this.session.GetUser();
    this.userLog = JSON.parse(this.userLog);
    this.movementForm.controls["user"].setValue({
      _id: this.userLog._id,
      fullname: this.userLog.fullname
    });
  }

  SaveMovement() {
    this.band.submit = true;
    if (!this.movementForm.valid) return;
    if (this.band.typeInvoice === "entry" || this.band.typeInvoice === "output") {
      let client = this.movementForm.controls["client"].value;
      if (!this.band.newClient) {
        if (client !== undefined || client !== "" || client !== null) {
          this.movementForm.controls["client"].setValue({
            name: client.name,
            rfc: client.rfc,
            cfdi: client.cfdi
          });
        }
      } else {
        this.movementForm.controls["client"].setValue({
          name: client
        });
      }
    } else if (this.band.typeInvoice === "statement") {
      let bank = this.movementForm.controls["bank"].value;
      if (!this.band.newBank) {
        if (bank !== undefined || bank !== "" || bank !== null) {
          this.movementForm.controls["bank"].setValue({
            name: bank.name
          });
        }
      } else {
        this.movementForm.controls["bank"].setValue({
          name: bank
        });
      }
    } else if (this.band.typeInvoice === "taxation") {
      let entity = this.movementForm.controls["entity"].value;
      if (!this.band.newEntity) {
        if (entity !== undefined || entity !== "" || entity !== null) {
          this.movementForm.controls["entity"].setValue({
            name: entity.name
          });
        }
      } else {
        this.movementForm.controls["entity"].setValue({
          name: entity
        });
      }
    }
    
    let date = new Date(this.movementForm.controls["invoice"].controls["invoiceDate"].value);
    date.setHours(18);
    date.setDate(date.getDate() + 1);
    this.movementForm.controls["invoice"].controls["invoiceDate"].setValue(date);
    if (this.band.newClient) this.movementForm.controls["newClient"].setValue(true);
    if (this.band.newBank) this.movementForm.controls["newBank"].setValue(true);
    if (this.band.newTypeOfTax) this.movementForm.controls["newTypeOfTax"].setValue(true);
    if (this.band.newEntity) this.movementForm.controls["newEntity"].setValue(true);

    this.swal.confirmContent("¿Desea registrar el movimiento?", this.BuildSwalHTML(), (result:any) => {
      if (result.value) {
        this.swal.loading("Registrando movimiento", "Espere un momento...");
        this.http.HTTP_POST("/api/v1/movement/save", this.movementForm.value)
          .subscribe((res:any) => {
            this.swal.close();
            this.swal.success("¡Guardado exitóso!", res.message);
            this.router.navigate(["/app/archive"]);
          }, (err) => {
            this.session.CheckError(err);
          });
      }
    });
  }

  BuildSwalHTML():string {
    let html = "<ul>";

    if (this.movementForm.value.paymentMethod === "PPD" || this.movementForm.value.paymentMethod === "PUE") {
      if (this.returnDocumentValue("invoiceXML") === undefined || this.returnDocumentValue("invoiceXML") === null || this.returnDocumentValue("invoiceXML") === "") {
        html += "<li> Falta archivo <b>Factural (XML)</b>";
      }
      if (this.returnDocumentValue("invoicePDF") === undefined || this.returnDocumentValue("invoicePDF") === null || this.returnDocumentValue("invoicePDF") === "") {
        html += "<li> Falta archivo <b>Factural (PDF)</b>";
      }
      if (this.returnDocumentValue("voucherOfPayment") === undefined || this.returnDocumentValue("voucherOfPayment") === null || this.returnDocumentValue("voucherOfPayment") === "") {
        html += "<li> Falta archivo <b>Comprobante de pago (PDF)</b>";
      }
    }
    if (this.movementForm.value.paymentMethod === "PPD") {
      if (this.returnDocumentValue("partialXML") === undefined || this.returnDocumentValue("partialXML") === null || this.returnDocumentValue("partialXML") === "") {
        html += "<li> Falta archivo <b>Complemento1 (XML)</b>";
      }
      if (this.returnDocumentValue("partialPDF") === undefined || this.returnDocumentValue("partialPDF") === null || this.returnDocumentValue("partialPDF") === "") {
        html += "<li> Falta archivo <b>Complemento1 (PDF)</b>";
      }
    }
    if (this.returnInvoiceValue("typeInvoice") === "ESTADO DE CUENTA") {
      if (this.returnDocumentValue("documentStatementPDF") === undefined || this.returnDocumentValue("documentStatementPDF") === null || this.returnDocumentValue("documentStatementPDF") === "") {
        html += "<li> Falta archivo <b>Archivo (PDF)</b>";
      }
    }

    if (this.returnInvoiceValue("typeInvoice") === "IMPUESTOS") {
      if (this.returnDocumentValue("paymentDocumentPDF") === undefined || this.returnDocumentValue("paymentDocumentPDF") === null || this.returnDocumentValue("paymentDocumentPDF") === "") {
        html += "<li> Falta archivo <b>Documento de pago (PDF)</b>";
      }
      if (this.returnDocumentValue("calculingDocumentPDF") === undefined || this.returnDocumentValue("calculingDocumentPDF") === null || this.returnDocumentValue("calculingDocumentPDF") === "") {
        html += "<li> Falta archivo <b>Documento cálculo de pago (PDF)</b>";
      }
    }

    html+="</ul>";

    return html;
  }

  ChangeForm() {
    switch(this.returnInvoiceValue("typeInvoice")) {
      case "CLIENTE (INGRESO)":
        this.band.typeInvoice = "entry";
        this.movementForm.controls["entity"].setValue(undefined);
        this.movementForm.controls["bank"].setValue(undefined);
        this.movementForm.controls["invoice"].controls["statementMonth"].setValue(undefined);
        this.movementForm.controls["invoice"].controls["typeOfTax"].setValue(undefined);
        this.movementForm.controls["observations"].setValue(undefined);
      break;
      case "PROVEEDOR (EGRESO)":
        this.band.typeInvoice = "output";
        this.movementForm.controls["entity"].setValue(undefined);
        this.movementForm.controls["bank"].setValue(undefined);
        this.movementForm.controls["invoice"].controls["statementMonth"].setValue(undefined);
        this.movementForm.controls["invoice"].controls["typeOfTax"].setValue(undefined);
        this.movementForm.controls["observations"].setValue(undefined);
      break;
      case "ESTADO DE CUENTA":
        this.GetCatalogBanks();
        this.band.typeInvoice = "statement";
        this.movementForm.controls["client"].setValue(undefined);
        this.movementForm.controls["typeReceipt"].setValue(undefined);
        this.movementForm.controls["paymentMethod"].setValue(undefined);
        this.movementForm.controls["total"].setValue(undefined);
      break;
      case "IMPUESTOS":
        this.GetCatalogTypesOfTax();
        this.GetCatalogEntity();
        this.band.typeInvoice = "taxation";
        this.movementForm.controls["client"].setValue(undefined);
        this.movementForm.controls["typeReceipt"].setValue(undefined);
        this.movementForm.controls["paymentMethod"].setValue(undefined);
        this.movementForm.controls["total"].setValue(undefined);
      break;
      default:
        this.band.typeInvoice = "";
        this.movementForm.controls["client"].setValue(undefined);
        this.movementForm.controls["typeReceipt"].setValue(undefined);
        this.movementForm.controls["paymentMethod"].setValue(undefined);
        this.movementForm.controls["total"].setValue(undefined);
        this.movementForm.controls["entity"].setValue(undefined);
        this.movementForm.controls["bank"].setValue(undefined);
        this.movementForm.controls["invoice"].controls["statementMonth"].setValue(undefined);
        this.movementForm.controls["invoice"].controls["typeOfTax"].setValue(undefined);
        this.movementForm.controls["observations"].setValue(undefined);
      break;
    }
  }

  async InitCatalogs() {
    await this.GetCatalogEnterprises();
    await this.GetCatalogClients();
  }

  GetCatalogEnterprises() {
    return new Promise<Boolean>((resolve, reject) => {
      this.http.HTTP_GET("/api/v1/catalogs/enterprises")
        .subscribe((res:any) => {
          this.catalogs.enterprises = res;
          resolve(true);
        }, (err) => {
          this.session.CheckError(err);
        });
    });
  }

  GetCatalogClients() {
    return new Promise<Boolean>((resolve, reject) => {
      this.http.HTTP_GET("/api/v1/catalogs/clients")
        .subscribe((res:any) => {
          this.catalogs.clients = res;
          resolve(true);
        }, (err) => {
          this.session.CheckError(err);
        });
    });
  }

  GetCatalogBanks() {
    this.http.HTTP_GET("/api/v1/catalogs/banks")
      .subscribe((res:any) => {
        this.catalogs.banks = res;
      }, (err) => {
        this.session.CheckError(err);
      });
  }

  GetCatalogTypesOfTax() {
    this.http.HTTP_GET("/api/v1/catalogs/typesOfTax")
      .subscribe((res:any) => {
        this.catalogs.types = res;
      }, (err) => {
        this.session.CheckError(err);
      });
  }

  GetCatalogEntity() {
    this.http.HTTP_GET("/api/v1/catalogs/entities")
      .subscribe((res:any) => {
        this.catalogs.entities = res;
      }, (err) => {
        this.session.CheckError(err);
      });
  }

  initForm() {
    this.movementForm = this.formBuilder.group({
      enterprise: new FormControl(undefined),
      client: new FormControl(undefined),
      entity: new FormControl(undefined),
      bank: new FormControl(undefined),
      observations: new FormControl(undefined),

      paymentMethod: new FormControl(undefined),
      typeReceipt: new FormControl(undefined),
      total: new FormControl(undefined),
      invoice: this.formBuilder.group({
        invoiceDate: new FormControl(undefined),
        invoiceFolio: new FormControl(undefined),
        methodOfPayment: new FormControl(undefined),
        typeInvoice: new FormControl(undefined),
        nameMovement: new FormControl(undefined),
        statementMonth: new FormControl(undefined),
        typeOfTax: new FormControl(undefined)
      }),
      documents: this.formBuilder.group({
        invoiceXML: new FormControl(undefined),
        invoicePDF: new FormControl(undefined),
        voucherOfPayment: new FormControl(undefined),
        partialXML: new FormControl(undefined),
        partialPDF: new FormControl(undefined),

        documentStatementPDF: new FormControl(undefined),
        paymentDocumentPDF: new FormControl(undefined),
        calculingDocumentPDF: new FormControl(undefined)
      }),
      extraDocuments: this.formBuilder.array([]),
      user: this.formBuilder.group({
        _id : new FormControl(undefined),
        fullname: new FormControl(undefined)
      }),
      newClient: new FormControl(false),
      newBank: new FormControl(false),
      newTypeOfTax: new FormControl(false),
      newEntity: new FormControl(false)
    });
  }

  SendForChooseDocumentsRequired(value: any) {
    this.changePaymentMethod.next(value);
  }

  async UploadPartialXML(data:any) {
    let url = await this.UploadFile(data.file);
    this.movementForm.controls["documents"].controls[data.controlName].setValue(url);
    data["path"] = url;
    this.setPartialXML.next(data);
  }

  UploadFile(file:File) {
    return new Promise<String>((resolve, reject) => {
      const formData = new FormData();
      formData.append("uploadFile", file, file.name);

      this.swal.loading("Subiendo archivo", "Espere un momento...");
      this.http.HTTP_POST("/api/v1/movement/upload-file", formData)
        .subscribe((res: any) => {
          this.swal.close();

          resolve(res.data);

        }, (err) => {
          this.session.CheckError(err);
        });
    })
  }

  async SetFiles(event: any) {
    let url = await this.UploadFile(event.file);
    if (event.type === "Archivo (S/Clasificación)") this.extraDocuments.push(this.formBuilder.group({path: new FormControl(url), index: new FormControl(event.index)}));
    else this.movementForm.controls["documents"].controls[event.controlName].setValue(url);
    this.setUrlFile.next({ url: url, type: event.type });
  }

  DeleteFile(event:any) {
    let url;
    if (event.controlName !== "extraDocuments") url = this.returnDocumentValue(event.controlName);
    else {
      this.extraDocuments.value.forEach((item:any, index:number) => {
        if (event.index == item.index) {
          url = item.path;
          this.extraDocuments.removeAt(index);
        }
      });
    }

    this.http.HTTP_POST("/api/v1/movement/delete-file", { path: url })
      .subscribe((res:any) => {
        if (event.controlName !== "extraDocuments") this.movementForm.controls["documents"].controls[event.controlName].setValue("");
      }, (err) => {
        this.session.CheckError(err);
      });
  }

  SendUrlFile(event: any) {
    console.log("aqui mero entra en send url", event);
  }

  returnInvoiceValue(field:any) {
    return this.movementForm.controls["invoice"].controls[field].value;
  }

  get extraDocuments() {
    return this.movementForm.controls["extraDocuments"] as FormArray;
  }

  returnDocumentValue(field:any) {
    return this.movementForm.controls["documents"].controls[field].value;
  }
}
