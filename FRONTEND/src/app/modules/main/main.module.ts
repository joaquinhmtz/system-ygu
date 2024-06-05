import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainComponent } from './main/main.component';
import { SidebarComponent } from './../../core/components/sidebar/sidebar.component';
import { NavbarComponent } from './../../core/components/navbar/navbar.component';
import { HeaderComponent } from './../../core/components/header/header.component';
import { MainRoutingModule } from './main-routing.module';


@NgModule({
  declarations: [
    MainComponent,
    SidebarComponent,
    NavbarComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
