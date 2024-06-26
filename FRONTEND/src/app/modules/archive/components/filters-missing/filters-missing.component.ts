import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters-missing',
  templateUrl: './filters-missing.component.html',
  styleUrls: ['./filters-missing.component.css']
})
export class FiltersMissingComponent {

  @Output() sendDataFilters = new EventEmitter<Object>();
  
  filtersForm: any = FormGroup;
  catalogs: any = {
    billingTypes : [{ name: "INGRESO" }, { name: "EGRESO" }],
    clientTypes : [{ name: "CLIENTE" }, { name: "PROVEEDOR" }, { name: "ESTADO DE CUENTA" }],
    documentTyp : [{ name: "FACTURA (PDF)" }, { name: "FACTURA (XML)" }, { name: "COMPROBANTE DE PAGO" }, { name: "COMPLEMENTO1 (PDF)" }, { name: "COMPLEMENTO1 (XML)" }],
  };

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  SendFiltersInfo() {
    this.sendDataFilters.emit(this.filtersForm.value);
  }

  CleanFormcontrol(controlName:string) {
    if (controlName === "total") this.filtersForm.controls[controlName].setValue(0);
    else this.filtersForm.controls[controlName].setValue(undefined);
    this.SendFiltersInfo();
  }

  initForm() {
    this.filtersForm = this.formBuilder.group({
      enterprise: new FormControl(undefined),
      client: new FormControl(undefined),
      typeInvoice: new FormControl(undefined),
      type: new FormControl(undefined),
      document: new FormControl(undefined)
    })
  }
}
