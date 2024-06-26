import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersMissingComponent } from './filters-missing.component';

describe('FiltersMissingComponent', () => {
  let component: FiltersMissingComponent;
  let fixture: ComponentFixture<FiltersMissingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersMissingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersMissingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
