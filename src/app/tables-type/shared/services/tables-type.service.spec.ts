import { TestBed } from '@angular/core/testing';

import { TablesTypeService } from './tables-type.service';

describe('TablesTypeService', () => {
  let service: TablesTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablesTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
