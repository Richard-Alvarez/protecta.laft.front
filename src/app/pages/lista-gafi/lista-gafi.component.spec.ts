import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaGafiComponent } from './lista-gafi.component';

describe('ListaGafiComponent', () => {
  let component: ListaGafiComponent;
  let fixture: ComponentFixture<ListaGafiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaGafiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaGafiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
