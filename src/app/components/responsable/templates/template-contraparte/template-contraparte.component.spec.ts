import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateContraparteComponent } from './template-contraparte.component';

describe('TemplateContraparteComponent', () => {
  let component: TemplateContraparteComponent;
  let fixture: ComponentFixture<TemplateContraparteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateContraparteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateContraparteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
