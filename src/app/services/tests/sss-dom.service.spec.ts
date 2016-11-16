/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SSSDOMService } from './../sss-dom.service';

describe('Service: SSSDOM', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SSSDOMService]
    });
  });

  it('should ...', inject([SSSDOMService], (service: SSSDOMService) => {
    expect(service).toBeTruthy();
  }));
});
