import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

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
    private formBuilder: FormBuilder
  ) {}

  ngAfterViewInit() {
    setTimeout(()=>{
      this.emailLogin.nativeElement.focus();
    },0); 
  }

  ngOnInit() {
    this.initForm();
  }

  login() {
    this.band.submit = true;
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    })
  }

}
