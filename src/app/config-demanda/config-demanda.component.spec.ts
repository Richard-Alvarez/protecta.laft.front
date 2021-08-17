import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigDemandaComponent } from './config-demanda.component';

describe('ConfigDemandaComponent', () => {
  let component: ConfigDemandaComponent;
  let fixture: ComponentFixture<ConfigDemandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigDemandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigDemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
