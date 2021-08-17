import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { S2FormComponent } from './s2-form.component';

describe('S2FormComponent', () => {
  let component: S2FormComponent;
  let fixture: ComponentFixture<S2FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ S2FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(S2FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
