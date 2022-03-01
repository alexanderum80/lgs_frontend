import { TestBed } from '@angular/core/testing';

import { LendersService } from './lenders.service';

describe('LendersService', () => {
  let service: LendersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LendersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
