/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SSSAPIService } from './../sss-api.service';

describe('Service: Api', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SSSAPIService]
    });
  });

  it('should ...', inject([SSSAPIService], (service: SSSAPIService) => {
    expect(service).toBeTruthy();
  }));
});
