import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C1DetailCompanyComponent } from './c1-detail-company.component';

describe('C1DetailCompanyComponent', () => {
  let component: C1DetailCompanyComponent;
  let fixture: ComponentFixture<C1DetailCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C1DetailCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C1DetailCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
