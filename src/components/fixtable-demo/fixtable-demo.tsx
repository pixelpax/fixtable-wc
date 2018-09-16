import { Component} from '@stencil/core';

const example1 = {
  data: [
      {
        first: 'George'
      }
  ],
  columns: [
    {
      property: 'first'
    }
  ],
  options: {

  }
};

@Component({
  tag: 'fixtable-demo',
  styleUrl: 'fixtable-demo.css',
  shadow: true
})
export class FixtableDemo {

  render() {

    return (
      <div>
        <h3>Simple Example</h3>
        <p>This Fixtable loads and renders all of its content without any pagination or filtering.</p>
        <fixtable-grid columns={example1.columns} options={example1.options} data={example1.data}></fixtable-grid>
      </div>
    );
  }
}
