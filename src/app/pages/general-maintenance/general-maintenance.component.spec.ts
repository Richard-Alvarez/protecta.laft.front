import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralMaintenanceComponent } from './general-maintenance.component';

describe('GeneralMaintenanceComponent', () => {
  let component: GeneralMaintenanceComponent;
  let fixture: ComponentFixture<GeneralMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
