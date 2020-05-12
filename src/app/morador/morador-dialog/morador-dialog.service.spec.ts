import { TestBed } from '@angular/core/testing';

import { MoradorDialogService } from './morador-dialog.service';

describe('MoradorDialogService', () => {
  let service: MoradorDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoradorDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
