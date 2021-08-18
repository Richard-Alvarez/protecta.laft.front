import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaSeleccionComponent } from './carga-seleccion.component';

describe('CargaSeleccionComponent', () => {
  let component: CargaSeleccionComponent;
  let fixture: ComponentFixture<CargaSeleccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaSeleccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
