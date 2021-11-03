import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaDemandaComponent } from './busqueda-demanda.component';

describe('BusquedaDemandaComponent', () => {
  let component: BusquedaDemandaComponent;
  let fixture: ComponentFixture<BusquedaDemandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaDemandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaDemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
