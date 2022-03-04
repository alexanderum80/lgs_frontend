import { TestBed } from '@angular/core/testing';

import { TablesGameService } from './tables-game.service';

describe('TablesGameService', () => {
  let service: TablesGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablesGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
