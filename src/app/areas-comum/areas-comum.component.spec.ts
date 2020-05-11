import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasComumComponent } from './areas-comum.component';

describe('AreasComumComponent', () => {
  let component: AreasComumComponent;
  let fixture: ComponentFixture<AreasComumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasComumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasComumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
