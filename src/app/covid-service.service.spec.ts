import { TestBed } from '@angular/core/testing';

import { CovidServiceService } from './covid-service.service';

describe('CovidServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CovidServiceService = TestBed.get(CovidServiceService);
    expect(service).toBeTruthy();
  });
});
