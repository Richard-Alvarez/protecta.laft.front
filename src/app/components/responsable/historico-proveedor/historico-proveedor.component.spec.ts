import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoProveedorComponent } from './historico-proveedor.component';

describe('HistoricoProveedorComponent', () => {
  let component: HistoricoProveedorComponent;
  let fixture: ComponentFixture<HistoricoProveedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
