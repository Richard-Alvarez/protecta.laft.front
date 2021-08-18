import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoEstadisticoComponent } from './grafico-estadistico.component';

describe('GraficoEstadisticoComponent', () => {
  let component: GraficoEstadisticoComponent;
  let fixture: ComponentFixture<GraficoEstadisticoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficoEstadisticoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoEstadisticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
