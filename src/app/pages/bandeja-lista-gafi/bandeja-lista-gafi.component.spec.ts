import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaListaGafiComponent } from './bandeja-lista-gafi.component';

describe('C1DetailCompanyComponent', () => {
  let bandejaListaGafiComponent: BandejaListaGafiComponent;
  let fixture: ComponentFixture<BandejaListaGafiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejaListaGafiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaListaGafiComponent);
    bandejaListaGafiComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(bandejaListaGafiComponent).toBeTruthy();
  });
});
