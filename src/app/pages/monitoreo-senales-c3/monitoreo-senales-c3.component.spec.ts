import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoSenalesC3Component } from './monitoreo-senales-c3.component';

describe('MonitoreoSenalesC3Component', () => {
  let component: MonitoreoSenalesC3Component;
  let fixture: ComponentFixture<MonitoreoSenalesC3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoSenalesC3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoSenalesC3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
