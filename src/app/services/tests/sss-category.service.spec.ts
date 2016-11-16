/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SSSCategoryService } from './../sss-category.service';

describe('Service: SSSCategory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SSSCategoryService]
    });
  });

  it('should ...', inject([SSSCategoryService], (service: SSSCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
