import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePericitySettingsComponent } from './time-pericity-settings.component';

describe('TimePericitySettingsComponent', () => {
  let component: TimePericitySettingsComponent;
  let fixture: ComponentFixture<TimePericitySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimePericitySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePericitySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
