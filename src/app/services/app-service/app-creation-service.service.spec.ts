import { TestBed } from '@angular/core/testing';

import { AppCreationServiceService } from './app-creation-service.service';

describe('AppCreationServiceService', () => {
  let service: AppCreationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppCreationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
