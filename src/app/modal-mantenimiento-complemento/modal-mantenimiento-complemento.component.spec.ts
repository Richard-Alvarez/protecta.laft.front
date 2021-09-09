import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMantenimientoComplementoComponent } from './modal-mantenimiento-complemento.component';

describe('ModalMantenimientoComplementoComponent', () => {
  let component: ModalMantenimientoComplementoComponent;
  let fixture: ComponentFixture<ModalMantenimientoComplementoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMantenimientoComplementoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMantenimientoComplementoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
