import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterSmallComponent } from '../core/components/footer-small/footer-small.component';
import { DropdownTableComponent } from './components/dropdown-table/dropdown-table.component';

@NgModule({
  declarations: [
    FooterSmallComponent,
    DropdownTableComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FooterSmallComponent,
    DropdownTableComponent
  ]
})
export class SharedModule { }
