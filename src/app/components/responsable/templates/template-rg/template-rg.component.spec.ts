import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateRGComponent } from './template-rg.component';

describe('TemplateRGComponent', () => {
  let component: TemplateRGComponent;
  let fixture: ComponentFixture<TemplateRGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateRGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateRGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
