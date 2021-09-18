import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateC1Component } from './template-c1.component';

describe('TemplateC1Component', () => {
  let component: TemplateC1Component;
  let fixture: ComponentFixture<TemplateC1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateC1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateC1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
