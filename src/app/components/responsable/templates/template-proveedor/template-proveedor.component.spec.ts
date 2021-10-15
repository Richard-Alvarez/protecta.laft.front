import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateProveedorComponent } from './template-proveedor.component';

describe('TemplateProveedorComponent', () => {
  let component: TemplateProveedorComponent;
  let fixture: ComponentFixture<TemplateProveedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
