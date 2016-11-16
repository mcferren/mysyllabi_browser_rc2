/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SSSConfigService } from './../sss-config.service';

describe('Service: SSSConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SSSConfigService]
    });
  });

  it('should ...', inject([SSSConfigService], (service: SSSConfigService) => {
    expect(service).toBeTruthy();
  }));
});
