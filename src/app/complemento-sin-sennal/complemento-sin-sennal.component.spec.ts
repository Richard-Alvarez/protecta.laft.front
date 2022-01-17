import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementoSinSennalComponent } from './complemento-sin-sennal.component';

describe('ComplementoSinSennalComponent', () => {
  let component: ComplementoSinSennalComponent;
  let fixture: ComponentFixture<ComplementoSinSennalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplementoSinSennalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplementoSinSennalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
