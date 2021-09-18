import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateS1Component } from './template-s1.component';

describe('TemplateS1Component', () => {
  let component: TemplateS1Component;
  let fixture: ComponentFixture<TemplateS1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateS1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateS1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
