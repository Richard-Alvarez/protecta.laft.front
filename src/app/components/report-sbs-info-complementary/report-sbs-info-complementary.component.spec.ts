import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSbsInfoComplementaryComponent } from './report-sbs-info-complementary.component';

describe('ReportSbsInfoComplementaryComponent', () => {
  let component: ReportSbsInfoComplementaryComponent;
  let fixture: ComponentFixture<ReportSbsInfoComplementaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSbsInfoComplementaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSbsInfoComplementaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
