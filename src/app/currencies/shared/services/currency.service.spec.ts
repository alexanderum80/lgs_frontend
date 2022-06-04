import { TestBed } from '@angular/core/testing';

import { CurrenciesService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrenciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrenciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
