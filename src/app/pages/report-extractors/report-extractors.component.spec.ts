import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportExtractorsComponent } from './report-extractors.component';

describe('ReportExtractorsComponent', () => {
  let component: ReportExtractorsComponent;
  let fixture: ComponentFixture<ReportExtractorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportExtractorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportExtractorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
