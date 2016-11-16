import { MysyllabiRc2Page } from './app.po';

describe('mysyllabi-rc-2 App', function() {
  let page: MysyllabiRc2Page;

  beforeEach(() => {
    page = new MysyllabiRc2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
