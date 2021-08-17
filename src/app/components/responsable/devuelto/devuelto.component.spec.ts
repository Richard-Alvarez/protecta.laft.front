import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevueltoComponent } from './devuelto.component';

describe('DevueltoComponent', () => {
  let component: DevueltoComponent;
  let fixture: ComponentFixture<DevueltoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevueltoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevueltoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
