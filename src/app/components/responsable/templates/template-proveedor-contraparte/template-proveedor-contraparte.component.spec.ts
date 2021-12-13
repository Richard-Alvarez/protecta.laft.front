import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateProveedorContraparteComponent } from './template-proveedor-contraparte.component';

describe('TemplateProveedorContraparteComponent', () => {
  let component: TemplateProveedorContraparteComponent;
  let fixture: ComponentFixture<TemplateProveedorContraparteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateProveedorContraparteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateProveedorContraparteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
