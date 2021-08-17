import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMaintenanceComponent } from './profile-maintenance.component';

describe('ProfileMaintenanceComponent', () => {
  let component: ProfileMaintenanceComponent;
  let fixture: ComponentFixture<ProfileMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
