import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateC2Component } from './template-c2.component';

describe('TemplateC2Component', () => {
  let component: TemplateC2Component;
  let fixture: ComponentFixture<TemplateC2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateC2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateC2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
