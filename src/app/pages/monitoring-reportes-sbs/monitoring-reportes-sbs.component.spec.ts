import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringReportesSbsComponent } from './monitoring-reportes-sbs.component';

describe('MonitoringReportesSbsComponent', () => {
  let component: MonitoringReportesSbsComponent;
  let fixture: ComponentFixture<MonitoringReportesSbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringReportesSbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringReportesSbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
