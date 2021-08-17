import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningSign3WorkModuleComponent } from './warning-sign3-work-module.component';

describe('WarningSign3WorkModuleComponent', () => {
  let component: WarningSign3WorkModuleComponent;
  let fixture: ComponentFixture<WarningSign3WorkModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningSign3WorkModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningSign3WorkModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
