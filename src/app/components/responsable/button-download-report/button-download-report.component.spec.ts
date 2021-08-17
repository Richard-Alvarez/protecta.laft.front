import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonDownloadReportComponent } from './button-download-report.component';

describe('ButtonDownloadReportComponent', () => {
  let component: ButtonDownloadReportComponent;
  let fixture: ComponentFixture<ButtonDownloadReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonDownloadReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonDownloadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
