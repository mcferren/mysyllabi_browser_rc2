/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SSSTabService } from './../sss-tab.service';

describe('Service: Tab', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SSSTabService]
    });
  });

  it('should ...', inject([SSSTabService], (service: SSSTabService) => {
    expect(service).toBeTruthy();
  }));
});
