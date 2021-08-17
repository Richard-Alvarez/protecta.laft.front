import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningSignsTrayComponent } from './warning-signs-tray.component';

describe('WarningSignsTrayComponent', () => {
  let component: WarningSignsTrayComponent;
  let fixture: ComponentFixture<WarningSignsTrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningSignsTrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningSignsTrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
