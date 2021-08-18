import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWarningrg2DatabaseComponent } from './view-warningrg2-database.component';

describe('ViewWarningrg2DatabaseComponent', () => {
  let component: ViewWarningrg2DatabaseComponent;
  let fixture: ComponentFixture<ViewWarningrg2DatabaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWarningrg2DatabaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWarningrg2DatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
