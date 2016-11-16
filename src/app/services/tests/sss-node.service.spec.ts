/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SSSNodeService } from './../sss-node.service';

describe('Service: SSSNode', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SSSNodeService]
    });
  });

  it('should ...', inject([SSSNodeService], (service: SSSNodeService) => {
    expect(service).toBeTruthy();
  }));
});
