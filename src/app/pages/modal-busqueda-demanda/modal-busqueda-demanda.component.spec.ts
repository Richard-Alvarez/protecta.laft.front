import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBusquedaDemandaComponent } from './modal-busqueda-demanda.component';

describe('ModalBusquedaDemandaComponent', () => {
  let component: ModalBusquedaDemandaComponent;
  let fixture: ComponentFixture<ModalBusquedaDemandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBusquedaDemandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBusquedaDemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
