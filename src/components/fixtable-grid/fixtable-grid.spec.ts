import { TestWindow } from '@stencil/core/testing';
import { FixtableGrid } from './fixtable-grid';

const rows = [
  {
    first: 'Abe',
    last: 'Lincoln'
  },
  {
    first: 'George',
    last: 'Washington'
  },
  {
    first: 'Donald',
    last: 'Trump'
  }
];


describe('fixtable-client', () => {
  it('should build', () => {
    expect(new FixtableGrid()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLFixtableGridElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [FixtableGrid],
        html: '<fixtable-grid></fixtable-grid>'
      });
    });
    //
    // it('should work without parameters', () => {
    //   expect(element.textContent.trim()).toEqual('Hello, World! I\'m');
    // });

  //   it('should work with a first name', async () => {
  //     element.first = 'Peter';
  //     await testWindow.flush();
  //     expect(element.textContent.trim()).toEqual('Hello, World! I\'m Peter');
  //   });
  //
  //   it('should work with a last name', async () => {
  //     element.last = 'Parker';
  //     await testWindow.flush();
  //     expect(element.textContent.trim()).toEqual('Hello, World! I\'m  Parker');
  //   });
  //
  //   it('should work with both a first and a last name', async () => {
  //     element.first = 'Peter';
  //     element.last = 'Parker';
  //     await testWindow.flush();
  //     expect(element.textContent.trim()).toEqual('Hello, World! I\'m Peter Parker');
  //   });
  });
});
