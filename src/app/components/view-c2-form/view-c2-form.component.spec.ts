import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewC2FormComponent } from './view-c2-form.component';

describe('ViewC2FormComponent', () => {
  let component: ViewC2FormComponent;
  let fixture: ComponentFixture<ViewC2FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewC2FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewC2FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
