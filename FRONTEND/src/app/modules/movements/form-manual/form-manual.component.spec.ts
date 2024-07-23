import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormManualComponent } from './form-manual.component';

describe('FormManualComponent', () => {
  let component: FormManualComponent;
  let fixture: ComponentFixture<FormManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormManualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
