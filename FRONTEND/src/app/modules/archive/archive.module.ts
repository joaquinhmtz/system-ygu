import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { MissingListComponent } from './missing-list/missing-list.component';
import { ListComponent } from './list/list.component';
import { ArchiveRoutingModule } from './archive-routing.module';
import { FiltersComponent } from './components/filters/filters.component';


@NgModule({
  declarations: [
    MissingListComponent,
    ListComponent,
    FiltersComponent
  ],
  imports: [
    CommonModule,
    ArchiveRoutingModule,
    NgxPaginationModule,
    FormsModule, 
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class ArchiveModule { }
