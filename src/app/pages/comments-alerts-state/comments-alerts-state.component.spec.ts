import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsAlertsStateComponent } from './comments-alerts-state.component';

describe('CommentsAlertsStateComponent', () => {
  let component: CommentsAlertsStateComponent;
  let fixture: ComponentFixture<CommentsAlertsStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsAlertsStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsAlertsStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
