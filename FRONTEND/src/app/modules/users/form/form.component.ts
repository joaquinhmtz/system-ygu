import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

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
  actionForm: string = "save";
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
    private router: Router,
    private routeParams: ActivatedRoute
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
    this.routeParams.params
      .subscribe((params:any) => {
        if (params && params.id) {
          this.actionForm = "update";
          this.getUser(params.id);
        }
    });
    this.initForm();
    this.getProfiles();
  }

  sendForm() {
    this.band.submit = true;
    if (!this.userForm.valid) return;
    
    if (this.actionForm === "save") this.userForm.removeControl("_id");
    if (this.actionForm === "update") this.userForm.controls["username"].enable();

    this.swal.loading("Guardando usuario", "Espere un momento...");
    this.http.HTTP_POST((this.actionForm === "save" ? "/api/v1/users/save" : "/api/v1/users/update"), this.userForm.value)
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

  getUser(_id:any) {
    this.http.HTTP_GET(`/api/v1/users/byId/${_id}`)
    .subscribe((res:any) => {
      this.setUser(res.data);
    }, (err) => {
      this.session.CheckError(err);
    });
  }

  setUser(user:any) {
    this.userForm.setValue({
      _id: user._id,
      name: user.name,
      lastname: user.lastname,
      lastname2: user.lastname2,
      fullname: user.fullname,
      email: user.email,
      username: user.username,
      password: "",
      password2: "",
      profile: user.profile,
      changePassword: false
    });
    this.userForm.controls["username"].disable();
    this.userForm.controls["password"].disable();
    this.userForm.controls["password2"].disable();
  }

  SetValidatorsPassword() {
    if (this.userForm.controls["changePassword"].value) {
      this.userForm.controls["password"].enable();
      this.userForm.controls["password2"].enable();
    } 
    else {
      this.userForm.controls["password"].disable();
      this.userForm.controls["password2"].disable();
    }
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      _id: new FormControl(""),
      name: new FormControl("", Validators.required),
      lastname: new FormControl("", Validators.required),
      lastname2: new FormControl(""),
      fullname: new FormControl(""),
      email: new FormControl(""),
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      password2: new FormControl("", Validators.required),
      profile: new FormControl(undefined, Validators.required),
      changePassword: new FormControl(false)
    })
  }
}
