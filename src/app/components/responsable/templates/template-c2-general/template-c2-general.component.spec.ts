import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateC2GeneralComponent } from './template-c2-general.component';

describe('TemplateC2GeneralComponent', () => {
  let component: TemplateC2GeneralComponent;
  let fixture: ComponentFixture<TemplateC2GeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateC2GeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateC2GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
