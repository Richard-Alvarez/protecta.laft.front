import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAlertsComponent } from './profile-alerts.component';

describe('ProfileAlertsComponent', () => {
  let component: ProfileAlertsComponent;
  let fixture: ComponentFixture<ProfileAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
