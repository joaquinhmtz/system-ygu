import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @ViewChild("nameUser") nameUser!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  @ViewChild('passwordConfirm') passwordConfirm!: ElementRef; 
  userForm:any = FormGroup;
  source: any;
  sourceConfirm: any;
  band: any = {
    submit: false,
    showPass: false,
    showPass2: false,
    lock: false,
    samePass: true
  }
  catalogs: any = {
    profiles: [{id:1,name:"Administrador"}]
  };
  patternPass: any = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%*.]).{8,}$/;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngAfterViewInit() {
    setTimeout(()=>{
      this.nameUser.nativeElement.focus();
    },0); 
    this.source = fromEvent(this.password.nativeElement, 'keyup');
    this.sourceConfirm = fromEvent(this.passwordConfirm.nativeElement, 'keyup');
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
  }

  ngOnInit() {
    this.initForm();
  }

  save() {
    this.band.submit = true;
    if (!this.userForm.valid) return;
    console.log("form valid***", this.userForm)
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
