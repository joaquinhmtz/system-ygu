import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormComponent } from './form/form.component';
import { FormManualComponent } from './form-manual/form-manual.component';
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: 'new',
    component: FormComponent,
    canActivate: [ AuthGuardService ],
  },
  {
    path: 'new-manual',
    component: FormManualComponent,
    canActivate: [ AuthGuardService ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovementsRoutingModule { }
