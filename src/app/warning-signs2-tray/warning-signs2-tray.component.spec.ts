import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningSigns2TrayComponent } from './warning-signs2-tray.component';

describe('WarningSigns2TrayComponent', () => {
  let component: WarningSigns2TrayComponent;
  let fixture: ComponentFixture<WarningSigns2TrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningSigns2TrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningSigns2TrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
