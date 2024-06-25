import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Output() sendDataFilters = new EventEmitter<Object>();
  
  filtersForm: any = FormGroup;
  catalogs: any = {
    billingTypes : [{ name: "INGRESO" }, { name: "EGRESO" }],
    clientTypes : [{ name: "CLIENTE" }, { name: "PROVEEDOR" }, { name: "ESTADO DE CUENTA" }]
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
      initDate: new FormControl(undefined),
      endDate: new FormControl(undefined),
      total: new FormControl(0)
    })
  }
}
