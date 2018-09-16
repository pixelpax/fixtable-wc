import { Component} from '@stencil/core';
import { getDemoData } from "./fixtable-demo.data";

const example1 = {
  data: getDemoData(),
  columns: [
    {
      property: 'name'
    },
    {
      property: 'address'
    },
    {
      property: 'alignment'
    }
  ],
  options: {
    fixtableClass: "restrict-height"
  }
};

@Component({
  tag: 'fixtable-demo',
  styleUrl: 'fixtable-demo.scss',
  shadow: true
})
export class FixtableDemo {

  render() {

    return (
      <div>
        <h3>Simple Example</h3>
        <p>This Fixtable loads and renders all of its content without any pagination or filtering.</p>
        <div class="row">
          <div class="col-md-8">
              <fixtable-grid
                columns={example1.columns}
                options={example1.options}
                data={example1.data}
              ></fixtable-grid>
          </div>
        </div>
      </div>
    );
  }
}
