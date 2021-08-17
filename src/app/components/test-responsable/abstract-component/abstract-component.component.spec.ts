import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractComponentComponent } from './abstract-component.component';

describe('AbstractComponentComponent', () => {
  let component: AbstractComponentComponent;
  let fixture: ComponentFixture<AbstractComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
