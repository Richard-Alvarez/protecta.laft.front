import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningSign4WorkModuleComponent } from './warning-sign4-work-module.component';

describe('WarningSign4WorkModuleComponent', () => {
  let component: WarningSign4WorkModuleComponent;
  let fixture: ComponentFixture<WarningSign4WorkModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningSign4WorkModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningSign4WorkModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
