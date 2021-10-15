import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateClientesSimplificadoComponent } from './template-clientes-simplificado.component';

describe('TemplateClientesSimplificadoComponent', () => {
  let component: TemplateClientesSimplificadoComponent;
  let fixture: ComponentFixture<TemplateClientesSimplificadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateClientesSimplificadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateClientesSimplificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
