import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaGeograficaComponent } from './zona-geografica.component';

describe('ZonaGeograficaComponent', () => {
  let component: ZonaGeograficaComponent;
  let fixture: ComponentFixture<ZonaGeograficaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonaGeograficaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonaGeograficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
