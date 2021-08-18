import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoSenalesRg2Component } from './monitoreo-senales-rg2.component';

describe('MonitoreoSenalesRg2Component', () => {
  let component: MonitoreoSenalesRg2Component;
  let fixture: ComponentFixture<MonitoreoSenalesRg2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoSenalesRg2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoSenalesRg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
