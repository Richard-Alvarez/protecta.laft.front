import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateC3Component } from './template-c3.component';

describe('TemplateC3Component', () => {
  let component: TemplateC3Component;
  let fixture: ComponentFixture<TemplateC3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateC3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateC3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
