import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTypeMovementComponent } from './modal-type-movement.component';

describe('ModalTypeMovementComponent', () => {
  let component: ModalTypeMovementComponent;
  let fixture: ComponentFixture<ModalTypeMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTypeMovementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTypeMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
