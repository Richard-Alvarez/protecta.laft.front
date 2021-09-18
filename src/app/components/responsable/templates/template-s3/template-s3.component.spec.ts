import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateS3Component } from './template-s3.component';

describe('TemplateS3Component', () => {
  let component: TemplateS3Component;
  let fixture: ComponentFixture<TemplateS3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateS3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateS3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
