import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { FormComponent } from './form/form.component';
import { MovementsRoutingModule } from './movements-routing.module';
import { ModalTypeMovementComponent } from './components/modal-type-movement/modal-type-movement.component';
import { PimpXmlDataComponent } from './components/pimp-xml-data/pimp-xml-data.component';
import { UploadDocumentsComponent } from './components/upload-documents/upload-documents.component';
import { FormManualComponent } from './form-manual/form-manual.component';

@NgModule({
  declarations: [
    FormComponent,
    ModalTypeMovementComponent,
    PimpXmlDataComponent,
    UploadDocumentsComponent,
    FormManualComponent
  ],
  imports: [
    CommonModule,
    MovementsRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    NgSelectModule
  ],
  entryComponents: [
    ModalTypeMovementComponent
  ]
})
export class MovementsModule { }
