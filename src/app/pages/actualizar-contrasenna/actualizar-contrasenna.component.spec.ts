import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarContrasennaComponent } from './actualizar-contrasenna.component';

describe('ActualizarContrasennaComponent', () => {
  let component: ActualizarContrasennaComponent;
  let fixture: ComponentFixture<ActualizarContrasennaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualizarContrasennaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarContrasennaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
