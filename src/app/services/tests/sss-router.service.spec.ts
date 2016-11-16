/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SSSRouterService } from './../sss-router.service';

describe('Service: SSSRouter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SSSRouterService]
    });
  });

  it('should ...', inject([SSSRouterService], (service: SSSRouterService) => {
    expect(service).toBeTruthy();
  }));
});
