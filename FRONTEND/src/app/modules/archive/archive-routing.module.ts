import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { MissingListComponent } from './missing-list/missing-list.component';
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [ AuthGuardService ],
  },
  {
    path: 'missing',
    component: MissingListComponent,
    canActivate: [ AuthGuardService ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchiveRoutingModule { }
