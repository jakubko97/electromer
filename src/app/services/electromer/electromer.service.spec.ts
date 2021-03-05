import { TestBed } from '@angular/core/testing';

import { ElectromerService } from './electromer.service';

describe('ElectromerService', () => {
  let service: ElectromerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectromerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
