import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

import { HttpService } from 'src/app/shared/services/http.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @ViewChild("nameUser") nameUser!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  @ViewChild('passwordConfirm') passwordConfirm!: ElementRef; 
  @ViewChild('username') username!: ElementRef; 
  userForm:any = FormGroup;
  source: any;
  sourceConfirm: any;
  sourceUsername: any;
  band: any = {
    submit: false,
    showPass: false,
    showPass2: false,
    lock: false,
    samePass: true
  }
  catalogs: any = {
    profiles: []
  };
  patternEmail: any = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
  patternPass: any = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%*.]).{8,}$/;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private session: SessionService,
    private swal: SweetalertService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    setTimeout(()=>{
      this.nameUser.nativeElement.focus();
    },0); 
    this.source = fromEvent(this.password.nativeElement, 'keyup');
    this.sourceConfirm = fromEvent(this.passwordConfirm.nativeElement, 'keyup');
    this.sourceUsername = fromEvent(this.username.nativeElement, 'keyup');
    this.source.pipe(debounceTime(100)).subscribe((c:any) => {
      if (this.userForm.controls["password"].value !== undefined || this.userForm.controls["password"].value !== null) {
        this.validatePassword();
      }
    });
    this.sourceConfirm.pipe(debounceTime(100)).subscribe((c:any) => {
      if ((this.userForm.controls["password"].value !== undefined || this.userForm.controls["password"].value !== null) && (this.userForm.controls["password2"].value !== undefined || this.userForm.controls["password2"].value !== null)) {
        this.validateSamePassword();
      }
    });
    this.sourceUsername.pipe(debounceTime(100)).subscribe((c:any) => {
      if (this.userForm.controls["username"].value !== undefined || this.userForm.controls["username"].value !== null) {
        this.validateUniqueUsername();
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.getProfiles();
  }

  save() {
    this.band.submit = true;
    if (!this.userForm.valid) return;
    
    this.swal.loading("Guardando usuario", "Espere un momento...");
    this.http.HTTP_POST("/api/v1/users/save", this.userForm.value)
      .subscribe((res:any) => {
        this.swal.close();
        this.swal.success("¡Guardado exitóso!", res.message);
        this.router.navigate(["/app/users"]);
      }, (err) => {
        this.session.CheckError(err);
      });
  }

  validatePassword() {
    const validations = document.querySelectorAll(".validation-psswd");

    if (validations.length > 0) {
      if ((/(?=.*?[a-z])/).test(this.userForm.controls["password"].value) && this.userForm.controls["password"].value !== undefined) {
        validations[0].classList.remove("fa-times-circle");
        validations[0].classList.add("fa-check-circle");
      } else {
        validations[0].classList.remove("fa-check-circle");
        validations[0].classList.add("fa-times-circle");
      }
  
      if ((/(?=.*?[A-Z])/).test(this.userForm.controls["password"].value) && this.userForm.controls["password"].value !== undefined) {
        validations[1].classList.remove("fa-times-circle");
        validations[1].classList.add("fa-check-circle");
      } else {
        validations[1].classList.remove("fa-check-circle");
        validations[1].classList.add("fa-times-circle");
      }
  
      if ((/(?=.*?[0-9])/).test(this.userForm.controls["password"].value) && this.userForm.controls["password"].value !== undefined) {
        validations[2].classList.remove("fa-times-circle");
        validations[2].classList.add("fa-check-circle");
      } else {
        validations[2].classList.remove("fa-check-circle");
        validations[2].classList.add("fa-times-circle");
      }
  
      if ((/(?=.*?[!@#$%*.])/).test(this.userForm.controls["password"].value) && this.userForm.controls["password"].value !== undefined) {
        validations[3].classList.remove("fa-times-circle");
        validations[3].classList.add("fa-check-circle");
      } else {
        validations[3].classList.remove("fa-check-circle");
        validations[3].classList.add("fa-times-circle");
      }
  
      if ((/.{8,}/).test(this.userForm.controls["password"].value) && this.userForm.controls["password"].value !== undefined) {
        validations[4].classList.remove("fa-times-circle");
        validations[4].classList.add("fa-check-circle");
      } else {
        validations[4].classList.remove("fa-check-circle");
        validations[4].classList.add("fa-times-circle");
      }
    }
  }

  validateSamePassword() {
    if (this.userForm.controls["password"].value !== this.userForm.controls["password2"].value) {
      this.band.samePass = false;
      this.userForm.controls['password2'].setErrors({ 'notSame': true });
    } else  {
      this.band.samePass = true;
      this.userForm.controls['password2'].setErrors(null);
    }
  }

  validateUniqueUsername() {
    this.http.HTTP_GET("/api/v1/users/validate-username", { username: this.userForm.controls["username"].value })
      .subscribe((res:any) => {
        if (!res?.unique) this.userForm.controls['username'].setErrors({ 'notUnique': true });
        else this.userForm.controls['username'].setErrors(null);
      }, (err) => {
        this.session.CheckError(err);
      });
  }

  getProfiles() {
    this.http.HTTP_GET("/api/v1/catalogs/profiles", {})
      .subscribe((res:any) => {
        this.catalogs.profiles = res;
      }, (err) => {
        this.session.CheckError(err);
      });
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      lastname: new FormControl("", Validators.required),
      lastname2: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      password2: new FormControl("", Validators.required),
      profile: new FormControl(undefined, Validators.required),
    })
  }
}
