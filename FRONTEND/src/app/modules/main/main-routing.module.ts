import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';

import { MainComponent } from './main/main.component';
import { StartOffComponent } from './start-off/start-off.component';

const routes: Routes = [
  {
    path: "main",
    component: StartOffComponent,
    canActivate: [ AuthGuardService ],
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [ AuthGuardService ],
    children: [
      {
        path: 'users',
        loadChildren: () => import(`./../users/users.module`).then(m => m.UsersModule)
      },
      {
        path: 'archive',
        loadChildren: () => import(`./../archive/archive.module`).then(m => m.ArchiveModule)
      },
      {
        path: 'movements',
        loadChildren: () => import(`./../movements/movements.module`).then(m => m.MovementsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
