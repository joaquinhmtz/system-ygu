import { Component } from '@angular/core';

@Component({
  selector: 'app-start-off',
  templateUrl: './start-off.component.html',
  styleUrls: ['./start-off.component.css']
})
export class StartOffComponent {

  views: any = [{
    title: "Archivero",
    img: "assets/imgs/archive.jpg",
    path: "/app/archive"
  }, {
    title: "Registrar movimiento",
    img: "assets/imgs/register-mov.jpg",
    path: "/app/movements/new"
  }, {
    title: "Archivos faltantes",
    img: "assets/imgs/search.jpg",
    path: "/app/archive/missing"
  }];
}
