import { TestBed } from '@angular/core/testing';

import { ReservasResolve } from './reservas.resolver.service';

describe('LogReservasService', () => {
  let service: ReservasResolve;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservasResolve);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
