import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRegistroComponent } from './lista-registro.component';



describe('ListaRegistroComponent', () => {
  let component: ListaRegistroComponent;
  let fixture: ComponentFixture<ListaRegistroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaRegistroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
