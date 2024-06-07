import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { StartOffComponent } from './start-off/start-off.component';

const routes: Routes = [
  {
    path: "main",
    component: StartOffComponent
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'users',
        loadChildren: () => import(`./../users/users.module`).then(m => m.UsersModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
