import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaHistoriaComponent } from './lista-historia.component';

describe('ListaHistoriaComponent', () => {
  let component: ListaHistoriaComponent;
  let fixture: ComponentFixture<ListaHistoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaHistoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaHistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
