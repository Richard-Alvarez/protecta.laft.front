import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateColaboradorComponent } from './template-colaborador.component';

describe('TemplateColaboradorComponent', () => {
  let component: TemplateColaboradorComponent;
  let fixture: ComponentFixture<TemplateColaboradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateColaboradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
