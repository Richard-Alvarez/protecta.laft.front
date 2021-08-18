import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C3FormComponent } from './c3-form.component';

describe('C3FormComponent', () => {
  let component: C3FormComponent;
  let fixture: ComponentFixture<C3FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C3FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C3FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
