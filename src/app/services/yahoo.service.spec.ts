import { TestBed } from '@angular/core/testing';

import { YahooService } from './yahoo.service';

describe('YahooService', () => {
  let service: YahooService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YahooService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
