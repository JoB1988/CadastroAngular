import { TestBed } from '@angular/core/testing';

import { MoradorInterceptor } from './morador.interceptor';

describe('MoradorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MoradorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: MoradorInterceptor = TestBed.inject(MoradorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
