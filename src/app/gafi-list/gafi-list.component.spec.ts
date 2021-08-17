import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GafiListComponent } from './gafi-list.component';

describe('GafiListComponent', () => {
  let component: GafiListComponent;
  let fixture: ComponentFixture<GafiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GafiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GafiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
