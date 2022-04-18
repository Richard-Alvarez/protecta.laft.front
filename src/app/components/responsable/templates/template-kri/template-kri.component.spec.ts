import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateKRIComponent } from './template-kri.component';

describe('TemplateKRIComponent', () => {
  let component: TemplateKRIComponent;
  let fixture: ComponentFixture<TemplateKRIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateKRIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateKRIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
