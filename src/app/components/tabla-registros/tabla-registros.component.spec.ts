import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaRegistrosComponent } from './tabla-registros.component';

describe('TablaRegistrosComponent', () => {
  let component: TablaRegistrosComponent;
  let fixture: ComponentFixture<TablaRegistrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaRegistrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaRegistrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
