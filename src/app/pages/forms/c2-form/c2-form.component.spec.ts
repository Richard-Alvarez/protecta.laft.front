import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C2FormComponent } from './c2-form.component';

describe('C2FormComponent', () => {
  let component: C2FormComponent;
  let fixture: ComponentFixture<C2FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C2FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C2FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
