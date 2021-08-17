import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C1FormComponent } from './c1-form.component';

describe('C1FormComponent', () => {
  let component: C1FormComponent;
  let fixture: ComponentFixture<C1FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C1FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C1FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
