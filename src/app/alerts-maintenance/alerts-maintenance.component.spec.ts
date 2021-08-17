import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsMaintenanceComponent } from './alerts-maintenance.component';

describe('AlertsMaintenanceComponent', () => {
  let component: AlertsMaintenanceComponent;
  let fixture: ComponentFixture<AlertsMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
