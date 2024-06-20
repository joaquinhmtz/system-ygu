import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PimpXmlDataComponent } from './pimp-xml-data.component';

describe('PimpXmlDataComponent', () => {
  let component: PimpXmlDataComponent;
  let fixture: ComponentFixture<PimpXmlDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PimpXmlDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PimpXmlDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
