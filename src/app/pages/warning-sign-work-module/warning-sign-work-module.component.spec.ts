import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningSignWorkModuleComponent } from './warning-sign-work-module.component';

describe('WarningSignWorkModuleComponent', () => {
  let component: WarningSignWorkModuleComponent;
  let fixture: ComponentFixture<WarningSignWorkModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningSignWorkModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningSignWorkModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
