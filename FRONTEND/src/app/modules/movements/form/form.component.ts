import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ModalTypeMovementComponent } from '../components/modal-type-movement/modal-type-movement.component';
import { UploadDocumentsComponent } from '../components/upload-documents/upload-documents.component';
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

  movementForm:any = FormGroup;
  userLog: any;
  catalogs: any = {
    billingTypes : [{ name: "INGRESO" }, { name: "EGRESO" }],
    clientTypes : [{ name: "CLIENTE" }, { name: "PROVEEDOR" }, { name: "ESTADO DE CUENTA" }]
  };
  band: any = {
    typeRegister: "",
    hiddenForm: true,
    submit: false
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
    setTimeout(() => {
      this.ChooseType();
    }, 300);
  }

  SaveMovement() {
    this.band.submit = true;
    if (!this.movementForm.valid) return;

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
  }

  SetMovementForm(data:any) {
    this.movementForm.setValue({
      enterprise: data.enterprise,
      client: {
        name: data.client.name,
        rfc: data.client.rfc,
        cfdi: data.client.cfdi,
        type: null
      },
      paymentMethod: data.paymentMethod ? data.paymentMethod : "",
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
      extraDocuments: []
    });
  }

  async SetFiles(event: any) {
    let url = await this.UploadFile(event.file);
    if (event.type === "Archivo (S/Clasificación)") this.extraDocuments.push(this.formBuilder.group({path: new FormControl(url), index: new FormControl(event.index)}));
    else this.movementForm.controls["documents"].controls[event.controlName].setValue(url);
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
        html += "<li> Falta archivo <b>Parcial1 (XML)</b>";
      }
      if (this.returnDocumentValue("partialPDF") === undefined || this.returnDocumentValue("partialPDF") === null || this.returnDocumentValue("partialPDF") === "") {
        html += "<li> Falta archivo <b>Parcial1 (PDF)</b>";
      }
    }

    html+="</ul>";

    return html;
  }

  initForm() {
    this.movementForm = this.formBuilder.group({
      enterprise: this.formBuilder.group({
        name: new FormControl(undefined, Validators.required),
        rfc: new FormControl(undefined, Validators.required),
      }),
      client: this.formBuilder.group({
        name: new FormControl(undefined, Validators.required),
        type: new FormControl(undefined, Validators.required),
        rfc: new FormControl(undefined),
        cfdi: new FormControl(undefined),
      }),
      paymentMethod: new FormControl(undefined, Validators.required),
      total: new FormControl(0, Validators.required),
      invoice: this.formBuilder.group({
        invoiceDate: new FormControl(undefined),
        invoiceFolio: new FormControl(undefined),
        methodOfPayment: new FormControl(undefined),
        typeInvoice: new FormControl(undefined, Validators.required),
        nameMovement: new FormControl(undefined, Validators.required)
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
      })
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
