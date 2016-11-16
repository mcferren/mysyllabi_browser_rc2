/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SSSProxyService } from './../sss-proxy.service';

describe('Service: SSSProxy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SSSProxyService]
    });
  });

  it('should ...', inject([SSSProxyService], (service: SSSProxyService) => {
    expect(service).toBeTruthy();
  }));
});
