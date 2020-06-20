import { ButanMigratedTemplatePage } from './app.po';

describe('ButanMigrated App', function() {
  let page: ButanMigratedTemplatePage;

  beforeEach(() => {
    page = new ButanMigratedTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
