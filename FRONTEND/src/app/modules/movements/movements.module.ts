import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormComponent } from './form/form.component';
import { MovementsRoutingModule } from './movements-routing.module';

@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    MovementsRoutingModule
  ]
})
export class MovementsModule { }
