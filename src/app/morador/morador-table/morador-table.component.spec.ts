import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoradorTableComponent } from './morador-table.component';

describe('MoradorTableComponent', () => {
  let component: MoradorTableComponent;
  let fixture: ComponentFixture<MoradorTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoradorTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoradorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
