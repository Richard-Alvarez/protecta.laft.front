import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { S1FormComponent } from './s1-form.component';

describe('S1FormComponent', () => {
  let component: S1FormComponent;
  let fixture: ComponentFixture<S1FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ S1FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(S1FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
