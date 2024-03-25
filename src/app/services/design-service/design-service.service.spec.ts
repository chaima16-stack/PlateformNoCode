import { TestBed } from '@angular/core/testing';

import { DesignServiceService } from './design-service.service';

describe('DesignServiceService', () => {
  let service: DesignServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
