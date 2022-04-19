import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateReportDemandaIndividualComponent } from './template-report-demanda-individual.component';

describe('TemplateReportDemandaIndividualComponent', () => {
  let component: TemplateReportDemandaIndividualComponent;
  let fixture: ComponentFixture<TemplateReportDemandaIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateReportDemandaIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateReportDemandaIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
