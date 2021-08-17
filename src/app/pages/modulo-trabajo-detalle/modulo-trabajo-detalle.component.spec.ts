import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloTrabajoDetalleComponent } from './modulo-trabajo-detalle.component';

describe('ModuloTrabajoDetalleComponent', () => {
  let component: ModuloTrabajoDetalleComponent;
  let fixture: ComponentFixture<ModuloTrabajoDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuloTrabajoDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloTrabajoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
