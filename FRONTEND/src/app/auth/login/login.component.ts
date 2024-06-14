import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpService } from 'src/app/shared/services/http.service';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  @ViewChild("emailLogin") emailLogin!: ElementRef;
  loginForm:any = FormGroup;
  band: any = {
    submit: false
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private swal: SweetalertService,
    private session: SessionService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    setTimeout(()=>{
      this.emailLogin.nativeElement.focus();
    },0); 
  }

  ngOnInit() {
    this.initForm();
    this.session.CleanSessionStorage();
  }

  login() {
    this.band.submit = true;
    if (!this.loginForm.valid) return;

    this.swal.loading("Iniciando sesión...", "Espere un momento");
    this.http.HTTP_POST("/v1/login", this.loginForm.value)
      .subscribe((res:any) => {
        this.swal.close();
        this.swal.toastSuccess(`Bienvenido ${res?.user?.name}`);
        this.session.SetSessionStorage(res.user, res.token);
        this.router.navigate(["/app/main"]);
      }, (err) => {
        this.swal.info('Autenticación fallida', err.message);
      });
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    })
  }

}
