import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SweetalertService } from 'src/app/shared/services/sweetalert.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private router: Router,
    private swa: SweetalertService
  ) { }

  SetSessionStorage(user:Object, token:string) {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
  }

  CleanSessionStorage(){
    sessionStorage.clear();
  }

  GetToken() {
    return sessionStorage.getItem("token");
  }

  CheckError (error:any) {
    if (error.status === 401 && error.message === 'Tu sesión ha expirado.' || error.status === 401 && error.message === 'Token no válido.') {
      setTimeout(() => {
        this.swa.info('Sesión cerrada', 'Por seguridad cerramos tu sesión, por favor vuelve a ingresar.', (res:Boolean) => {
          if (res) this.router.navigateByUrl('/login');
        });
      }, 300);
    } else {
      this.swa.error(error.message, '');
    }
  }
}
