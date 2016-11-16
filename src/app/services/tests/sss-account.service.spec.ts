/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SSSAccountService } from './../sss-account.service';

describe('Service: SSSAccount', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SSSAccountService]
    });
  });

  it('should ...', inject([SSSAccountService], (service: SSSAccountService) => {
    expect(service).toBeTruthy();
  }));
});
