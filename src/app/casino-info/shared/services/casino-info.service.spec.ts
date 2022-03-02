import { TestBed } from '@angular/core/testing';

import { CasinoInfoService } from './casino-info.service';

describe('CasinoInfoService', () => {
  let service: CasinoInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasinoInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
