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
    let columns = [
      {
        property: 'first'
      }
    ];
    let options = {

    };

    return (
      <fixtable-grid columns={columns} options={options} data={data}></fixtable-grid>
    );
  }
}
