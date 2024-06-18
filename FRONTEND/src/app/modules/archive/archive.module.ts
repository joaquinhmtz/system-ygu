import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    ArchiveRoutingModule
  ]
})
export class ArchiveModule { }
