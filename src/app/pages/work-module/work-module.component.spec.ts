import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkModuleComponent } from './work-module.component';

describe('WorkModuleComponent', () => {
  let component: WorkModuleComponent;
  let fixture: ComponentFixture<WorkModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
