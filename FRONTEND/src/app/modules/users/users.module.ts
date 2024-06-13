import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { ListComponent } from './list/list.component';
import { UsersRoutingModule } from './users-routing.module';
import { FormComponent } from './form/form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ListComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class UsersModule { }
