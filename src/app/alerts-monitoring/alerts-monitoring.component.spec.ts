import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsMonitoringComponent } from './alerts-monitoring.component';

describe('AlertsMonitoringComponent', () => {
  let component: AlertsMonitoringComponent;
  let fixture: ComponentFixture<AlertsMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
