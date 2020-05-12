import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoradorDialogComponent } from './morador-dialog.component';

describe('MoradorDialogComponent', () => {
  let component: MoradorDialogComponent;
  let fixture: ComponentFixture<MoradorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoradorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoradorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
