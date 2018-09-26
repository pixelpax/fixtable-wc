import {Component, State} from '@stencil/core';
import { getDemoData } from "./fixtable-demo.data";

const data = getDemoData();

const example1 = {
  data: data,
  columns: [
    {
      key: 'name',
      sortable: true
    },
    {
      key: 'address',
      sortable: true
    },
    {
      key: 'alignment'
    }
  ],
  options: {
    fixtableClass: "restrict-height"
  }
};

const example2 = {
  data: data,
  columns: [
    {
      key: 'name',
      label: 'Name'
    },
    {
      key: 'address',
      label: 'Address'
    },
    {
      key: 'alignment'
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

  @State()
  data1: any[];

  componentWillLoad() {
    this.data1 = example1.data;
  }

  addAdditionalRow() {
    this.data1 = [
      ...this.data1,
      {name: 'Talisa Stark', address: 'House Stark', alignment: 'Good'}
    ]
  }

  // @State()
  // reversibleData: any[];
  //
  // willLoadComponent() {
  //   this.reversibleData = [
  //     'foo',
  //     'bar',
  //     'baz'
  //   ]
  // }
  //
  // reverseData() {
  //   this.reversibleData = this.reversibleData.reverse();
  // }

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
        <h3></h3>
        <p>This Fixtable loads all of its content at once but paginates it on the client.</p>
        <div class="row">
          <div class="col-md-8">
            <fixtable-grid
              columns={example2.columns}
              options={example2.options}
              data={example2.data}
            ></fixtable-grid>
          </div>
        </div>
      </div>
    );
  }
}
