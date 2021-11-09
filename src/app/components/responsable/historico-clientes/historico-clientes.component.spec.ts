import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoClientesComponent } from './historico-clientes.component';

describe('HistoricoResponsableComponent', () => {
  let component: HistoricoClientesComponent;
  let fixture: ComponentFixture<HistoricoClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
