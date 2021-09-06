import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoComplementoComponent } from './mantenimiento-complemento.component';

describe('MantenimientoComplementoComponent', () => {
  let component: MantenimientoComplementoComponent;
  let fixture: ComponentFixture<MantenimientoComplementoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoComplementoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoComplementoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
