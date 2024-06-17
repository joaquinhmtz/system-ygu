import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

import { ListComponent } from './list/list.component';
import { UsersRoutingModule } from './users-routing.module';
import { FormComponent } from './form/form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FiltersComponent } from './components/filters/filters.component';

@NgModule({
  declarations: [
    ListComponent,
    FormComponent,
    FiltersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    NgSelectModule,
    NgxPaginationModule
  ]
})
export class UsersModule { }
