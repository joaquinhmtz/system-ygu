import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalTypeMovementComponent } from '../components/modal-type-movement/modal-type-movement.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @ViewChild('modalChooseType', { static: true }) modalChooseType:any = ModalTypeMovementComponent;
  movementForm:any = FormGroup;
  band: any = {
    typeRegister: "",
    hiddenForm: true,
    submit: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private swal: SweetalertService,
    private http: HttpService,
    private session: SessionService
  ){}
  
  ngOnInit(): void {
    this.initForm();
    setTimeout(() => {
      this.ChooseType();
    }, 300);
  }

  SaveMovement() {
    this.band.submit = true;
    if (!this.movementForm.valid) return;

    this.swal.confirmContent("¿Desea registrar el movimiento?", this.BuildSwalHTML(), (result:any) => {
      if (result.value) {
        console.log("Se guarda");
      }
    });

    console.log("Válido");
  }

  SetXMLData(event: any) {
    this.band.typeRegister = event.type;
    this.band.hiddenForm = false;
    if (this.band.typeRegister === "xml") this.SetMovementForm(event);
  }

  SetMovementForm(data:any) {
    this.movementForm.setValue({
      enterprise: data.enterprise,
      client: data.client,
      paymentMethod: data.paymentMethod ? data.paymentMethod : "",
      total: data.total,
      invoice: {
        invoiceDate: data.invoiceDate ? data.invoiceDate : undefined,
        invoiceFolio: data.invoiceFolio ? data.invoiceFolio : undefined,
        methodOfPayment: data.methodOfPayment ? data.methodOfPayment : undefined,
      },
      documents: {
        invoiceXML: "",
        invoicePDF: "",
        voucherOfPayment: "",
        partialXML: "",
        partialPDF: "",
      }
    });
  }

  async SetFiles(event: any) {
    let url = await this.UploadFile(event.file);
    this.movementForm.controls["documents"].controls[event.controlName].setValue(url);
    
    console.log("movementForm***", this.movementForm.value);
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
    let url = this.returnDocumentValue(event.controlName);

    this.http.HTTP_POST("/api/v1/movement/delete-file", { path: url })
      .subscribe((res:any) => {
        this.movementForm.controls["documents"].controls[event.controlName].setValue("");
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
    if (this.returnDocumentValue("partialXML") === undefined || this.returnDocumentValue("partialXML") === null || this.returnDocumentValue("partialXML") === "") {
      html += "<li> Falta archivo <b>Parcial1 (XML)</b>";
    }
    if (this.returnDocumentValue("partialPDF") === undefined || this.returnDocumentValue("partialPDF") === null || this.returnDocumentValue("partialPDF") === "") {
      html += "<li> Falta archivo <b>Parcial1 (PDF)</b>";
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
        rfc: new FormControl(undefined, Validators.required),
        cfdi: new FormControl(undefined),
      }),
      paymentMethod: new FormControl(undefined, Validators.required),
      total: new FormControl(0, Validators.required),
      invoice: this.formBuilder.group({
        invoiceDate: new FormControl(undefined),
        invoiceFolio: new FormControl(undefined),
        methodOfPayment: new FormControl(undefined)
      }),
      documents: this.formBuilder.group({
        invoiceXML: new FormControl(undefined),
        invoicePDF: new FormControl(undefined),
        voucherOfPayment: new FormControl(undefined),
        partialXML: new FormControl(undefined),
        partialPDF: new FormControl(undefined),
      })
    });
  }

  returnDocumentValue(field:any) {
    return this.movementForm.controls["documents"].controls[field].value;
  }

  ChooseType() {
    this.modalChooseType.toggleModal();
  }

}
