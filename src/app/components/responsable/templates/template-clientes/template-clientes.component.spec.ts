import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateClientesComponent } from './template-clientes.component';

describe('TemplateClientesComponent', () => {
  let component: TemplateClientesComponent;
  let fixture: ComponentFixture<TemplateClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
