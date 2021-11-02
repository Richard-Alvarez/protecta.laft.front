import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUpdateComponent } from './navbar-update.component';

describe('NavbarUpdateComponent', () => {
  let component: NavbarUpdateComponent;
  let fixture: ComponentFixture<NavbarUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
