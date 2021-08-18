import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProfileMaintenanceComponent } from './modal-profile-maintenance.component';

describe('ModalProfileMaintenanceComponent', () => {
  let component: ModalProfileMaintenanceComponent;
  let fixture: ComponentFixture<ModalProfileMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProfileMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProfileMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
