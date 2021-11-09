import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoColaboradorComponent } from './historico-colaborador.component';

describe('HistoricoColaboradorComponent', () => {
  let component: HistoricoColaboradorComponent;
  let fixture: ComponentFixture<HistoricoColaboradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoColaboradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
