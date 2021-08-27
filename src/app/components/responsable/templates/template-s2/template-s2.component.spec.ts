import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateS2Component } from './template-s2.component';

describe('TemplateS2Component', () => {
  let component: TemplateS2Component;
  let fixture: ComponentFixture<TemplateS2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateS2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateS2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
