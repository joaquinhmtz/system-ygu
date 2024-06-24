import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { MissingListComponent } from './missing-list/missing-list.component';
import { ListComponent } from './list/list.component';
import { ArchiveRoutingModule } from './archive-routing.module';


@NgModule({
  declarations: [
    MissingListComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    ArchiveRoutingModule,
    NgxPaginationModule
  ]
})
export class ArchiveModule { }
