import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoSenalesComponent } from './monitoreo-senales.component';

describe('MonitoreoSenalesComponent', () => {
  let component: MonitoreoSenalesComponent;
  let fixture: ComponentFixture<MonitoreoSenalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoSenalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoSenalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
