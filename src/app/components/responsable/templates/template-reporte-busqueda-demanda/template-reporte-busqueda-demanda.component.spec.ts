import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateReporteBusquedaDemandaComponent } from './template-reporte-busqueda-demanda.component';

describe('TemplateReporteBusquedaDemandaComponent', () => {
  let component: TemplateReporteBusquedaDemandaComponent;
  let fixture: ComponentFixture<TemplateReporteBusquedaDemandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateReporteBusquedaDemandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateReporteBusquedaDemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
