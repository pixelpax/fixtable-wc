import { Component} from '@stencil/core';

@Component({
  tag: 'fixtable-demo',
  styleUrl: 'fixtable-demo.css',
  shadow: true
})
export class FixtableDemo {

  render() {
    let data = [
      {
        first: 'George'
      }
    ];
    let options = {
      columns: [
        {
          property: 'first'
        }
      ]
    };

    return (
      <fixtable-grid options={options} data={data}></fixtable-grid>
    );
  }
}
