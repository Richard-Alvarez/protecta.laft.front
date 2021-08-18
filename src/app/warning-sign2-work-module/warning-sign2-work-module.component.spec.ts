import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningSign2WorkModuleComponent } from './warning-sign2-work-module.component';

describe('WarningSign2WorkModuleComponent', () => {
  let component: WarningSign2WorkModuleComponent;
  let fixture: ComponentFixture<WarningSign2WorkModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningSign2WorkModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningSign2WorkModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
