import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  constructor() { }

  success(title = '', text = '', callback?:any){
    let options: any = { 
      title: title, 
      text: text, 
      icon: 'success',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      timer: 1500,
      onBeforeOpen: () => {
        Swal.hideLoading();
      }
    };
    if(callback){
      Swal.fire(options).then((result) => {
        callback(result);
      });
    }else{
      Swal.fire(options);
    }
  }

  error(title = '', text = '', callback?:any){
    let options: any = { 
      title: title, 
      text: text, 
      icon: 'error',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      onBeforeOpen: () => {
        Swal.hideLoading();
      }
    };
    if(callback){
      Swal.fire(options).then((result) => {
        callback(result);
      });
    }else{
      Swal.fire(options);
    }
  }

  info(title = '', text = '', callback?:any) {
    let options: any = {
      title: title, 
      text: text, 
      icon: 'warning', 
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      onBeforeOpen: () => {
        Swal.hideLoading();
      }
    };
    if(callback){
      Swal.fire(options).then((result) => {
        callback(result);
      });
    }else{
      Swal.fire(options);
    }
  }

  confirm(title = '', text = '', callbackConfirm?:any) {
    let options: any = {
      icon: 'warning',
      title : title,
      text : text,
      allowOutsideClick : false,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      allowEscapeKey : true,
      reverseButtons: true
    };

    Swal.fire(options).then(function (result){
      if(result.value){
        callbackConfirm(result);
      }else{
        callbackConfirm({ value: false });
      }
    });
  }
  
  loading(title = '', text = '') {
    let options: any = {
      title : title,
      text: text,
      allowOutsideClick : false,
      allowEscapeKey : false,
      onOpen: () => {
          Swal.showLoading();
      }
    };
    Swal.fire(options);
  }

  close() {
    Swal.close();
  }

  toastSuccess(title = '') {
    let Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: title
    });
  }
}
