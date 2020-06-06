import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogReservasComponent } from './log-reservas.component';

describe('LogReservasComponent', () => {
  let component: LogReservasComponent;
  let fixture: ComponentFixture<LogReservasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogReservasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
