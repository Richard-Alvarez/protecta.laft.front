import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcCompanyDetailComponent } from './nc-company-detail.component';

describe('NcCompanyDetailComponent', () => {
  let component: NcCompanyDetailComponent;
  let fixture: ComponentFixture<NcCompanyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NcCompanyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcCompanyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
