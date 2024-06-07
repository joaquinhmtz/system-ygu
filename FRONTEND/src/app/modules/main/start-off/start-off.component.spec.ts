import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartOffComponent } from './start-off.component';

describe('StartOffComponent', () => {
  let component: StartOffComponent;
  let fixture: ComponentFixture<StartOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
