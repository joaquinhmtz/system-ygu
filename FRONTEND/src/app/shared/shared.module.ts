import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterSmallComponent } from '../core/components/footer-small/footer-small.component';

@NgModule({
  declarations: [
    FooterSmallComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FooterSmallComponent
  ]
})
export class SharedModule { }
