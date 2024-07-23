import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ModalTypeMovementComponent } from '../components/modal-type-movement/modal-type-movement.component';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @ViewChild('modalChooseType', { static: true }) modalChooseType:any = ModalTypeMovementComponent;
  changePaymentMethod:Subject<any> = new Subject();
  setUrlFile:Subject<any> = new Subject();
  setPartialXML:Subject<any> = new Subject();

  movementForm:any = FormGroup;
  userLog: any;
  catalogs: any = {
    billingTypes : [{ name: "CLIENTE (INGRESO)" }, { name: "PROVEEDOR (EGRESO)" }, { name: "ESTADO DE CUENTA" },  { name: "IMPUESTOS" }],
    clientTypes : [{ name: "CLIENTE" }, { name: "PROVEEDOR" }, { name: "ESTADO DE CUENTA" }],
    enterprises: [],
    clients: [],
    paymentMethods: [{ name: "PPD" }, { name: "PUE" }],
    typeReceipts: [{ name: "FACTURA" }, { name: "COMPLEMENTO" }]
  };
  band: any = {
    typeRegister: "",
    hiddenForm: true,
    submit: false,
    newClient: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private swal: SweetalertService,
    private http: HttpService,
    private session: SessionService,
    private router: Router
  ){}
  
  ngOnInit(): void {
    this.initForm();
    this.userLog = this.session.GetUser();
    this.userLog = JSON.parse(this.userLog);
    this.movementForm.controls["user"].setValue({
      _id: this.userLog._id,
      fullname: this.userLog.fullname
    });
    setTimeout(() => {
      this.ChooseType();
    }, 300);
  }

  SaveMovement() {
    this.band.submit = true;
    if (!this.movementForm.valid) return;
    let client = this.movementForm.controls["client"].value;
    if (!this.band.newClient) {
      this.movementForm.controls["client"].setValue({
        name: client.name,
        rfc: client.rfc,
        cfdi: client.cfdi
      });
    } else {
      this.movementForm.controls["client"].setValue({
        name: client
      });
    }
    if (this.band.typeRegister === "manual") {
      let date = new Date(this.movementForm.controls["invoice"].controls["invoiceDate"].value);
      date.setHours(18);
      date.setDate(date.getDate() + 1);
      this.movementForm.controls["invoice"].controls["invoiceDate"].setValue(date);
      if (this.band.newClient) this.movementForm.controls["newClient"].setValue(true);
    }

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

  SetXMLData(event: any) {
    this.band.typeRegister = event.type;
    this.band.hiddenForm = false;
    if (this.band.typeRegister === "xml") this.SetMovementForm(event);
    else {
      //this.InitCatalogs()
      this.router.navigateByUrl("/app/movements/new-manual");
    }
    if (event.invoiceXML && event.invoiceXML !== undefined) {
      let invoiceXML = {
        type: "Factura (XML)",
        controlName: "invoiceXML",
        file: event.invoiceXML
      };
      this.UploadPartialXML(invoiceXML);
    }
  }

  SetMovementForm(data:any) {
    this.movementForm.setValue({
      client: data.client,
      enterprise: {
        name: data.enterprise.name,
        rfc: data.enterprise.rfc,
        cfdi: data.enterprise.cfdi
      },
      paymentMethod: data.paymentMethod ? data.paymentMethod : "",
      typeReceipt: data.typeReceipt ? data.typeReceipt : "",
      total: data.total,
      invoice: {
        invoiceDate: data.invoiceDate ? data.invoiceDate : undefined,
        invoiceFolio: data.invoiceFolio ? data.invoiceFolio : undefined,
        methodOfPayment: data.methodOfPayment ? data.methodOfPayment : undefined,
        typeInvoice: null,
        nameMovement: null
      },
      documents: {
        invoiceXML: "",
        invoicePDF: "",
        voucherOfPayment: "",
        partialXML: "",
        partialPDF: "",
      },
      user: {
        _id : this.userLog._id,
        fullname: this.userLog.fullname
      },
      extraDocuments: [],
      newClient: false
    });
  }

  async SetFiles(event: any) {
    let url = await this.UploadFile(event.file);
    if (event.type === "Archivo (S/Clasificación)") this.extraDocuments.push(this.formBuilder.group({path: new FormControl(url), index: new FormControl(event.index)}));
    else this.movementForm.controls["documents"].controls[event.controlName].setValue(url);
    this.setUrlFile.next({ url: url, type: event.type });
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

  async UploadPartialXML(data:any) {
    let url = await this.UploadFile(data.file);
    this.movementForm.controls["documents"].controls[data.controlName].setValue(url);
    data["path"] = url;
    this.setPartialXML.next(data);
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

  BuildSwalHTML():string {
    let html = "<ul>";

    if (this.returnDocumentValue("invoiceXML") === undefined || this.returnDocumentValue("invoiceXML") === null || this.returnDocumentValue("invoiceXML") === "") {
      html += "<li> Falta archivo <b>Factural (XML)</b>";
    }
    if (this.returnDocumentValue("invoicePDF") === undefined || this.returnDocumentValue("invoicePDF") === null || this.returnDocumentValue("invoicePDF") === "") {
      html += "<li> Falta archivo <b>Factural (PDF)</b>";
    }
    if (this.returnDocumentValue("voucherOfPayment") === undefined || this.returnDocumentValue("voucherOfPayment") === null || this.returnDocumentValue("voucherOfPayment") === "") {
      html += "<li> Falta archivo <b>Comprobante de pago (PDF)</b>";
    }
    if (this.movementForm.value.paymentMethod === "PPD") {
      if (this.returnDocumentValue("partialXML") === undefined || this.returnDocumentValue("partialXML") === null || this.returnDocumentValue("partialXML") === "") {
        html += "<li> Falta archivo <b>Complemento1 (XML)</b>";
      }
      if (this.returnDocumentValue("partialPDF") === undefined || this.returnDocumentValue("partialPDF") === null || this.returnDocumentValue("partialPDF") === "") {
        html += "<li> Falta archivo <b>Complemento1 (PDF)</b>";
      }
    }

    html+="</ul>";

    return html;
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

  initForm() {
    this.movementForm = this.formBuilder.group({
      enterprise: new FormControl(undefined, Validators.required),
      client: new FormControl(undefined, Validators.required),
      paymentMethod: new FormControl(undefined, Validators.required),
      typeReceipt: new FormControl(undefined, Validators.required),
      total: new FormControl(0, Validators.required),
      invoice: this.formBuilder.group({
        invoiceDate: new FormControl(undefined, Validators.required),
        invoiceFolio: new FormControl(undefined),
        methodOfPayment: new FormControl(undefined),
        typeInvoice: new FormControl(undefined, Validators.required),
        nameMovement: new FormControl(undefined)
      }),
      documents: this.formBuilder.group({
        invoiceXML: new FormControl(undefined),
        invoicePDF: new FormControl(undefined),
        voucherOfPayment: new FormControl(undefined),
        partialXML: new FormControl(undefined),
        partialPDF: new FormControl(undefined),
      }),
      extraDocuments: this.formBuilder.array([]),
      user: this.formBuilder.group({
        _id : new FormControl(undefined),
        fullname: new FormControl(undefined)
      }),
      newClient: new FormControl(false)
    });
  }

  returnDocumentValue(field:any) {
    return this.movementForm.controls["documents"].controls[field].value;
  }

  get extraDocuments() {
    return this.movementForm.controls["extraDocuments"] as FormArray;
  }

  SendPaymentMethod() {
    this.changePaymentMethod.next(this.movementForm.controls.paymentMethod.value);
  }

  ChooseType() {
    this.modalChooseType.toggleModal();
  }

}
