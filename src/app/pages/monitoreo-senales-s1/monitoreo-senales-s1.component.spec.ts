import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoSenalesS1Component } from './monitoreo-senales-s1.component';

describe('MonitoreoSenalesS1Component', () => {
  let component: MonitoreoSenalesS1Component;
  let fixture: ComponentFixture<MonitoreoSenalesS1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoSenalesS1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoSenalesS1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
