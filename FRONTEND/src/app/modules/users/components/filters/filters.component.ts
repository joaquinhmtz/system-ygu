import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {

  @Output() sendDataFilters = new EventEmitter<Object>();
  
  filtersForm: any = FormGroup;

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
    this.filtersForm.controls[controlName].setValue(undefined);
    this.SendFiltersInfo();
  }

  initForm() {
    this.filtersForm = this.formBuilder.group({
      username: new FormControl(undefined),
      fullname: new FormControl(undefined),
      status: new FormControl(true)
    })
  }
}
