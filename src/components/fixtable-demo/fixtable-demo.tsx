import {Component, State} from '@stencil/core';
import { getDemoData } from "./fixtable-demo.data";
import { OnUpdateParameters, OnUpdateResponse } from "../fixtable-grid/fixtable-grid";

const data = getDemoData();

// const example1 = {
//   rows: data,
//   columns: [
//     {
//       key: 'name',
//       sortable: true,
//       filterable: true
//     },
//     {
//       key: 'address',
//       sortable: true,
//       filterable: true
//     },
//     {
//       key: 'alignment'
//     }
//   ],
//   options: {
//     fixtableClass: "restrict-height"
//   }
// };

const example2 = {
  rows: [],
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
    fixtableClass: "restrict-height",
    onUpdate() {
      return new Promise<OnUpdateResponse>((resolve) => {
        setTimeout(() => resolve({entities: data, total: data.length}), 1000);
      });
    }
  }
};

@Component({
  tag: 'fixtable-demo',
  styleUrl: 'fixtable-demo.scss',
  shadow: true
})
export class FixtableDemo {

  @State()
  rows0: any[];

  @State()
  total0: number;

  componentWillLoad() {
    this.rows0 = [];
  }

  onUpdate(updateParams: OnUpdateParameters) {
    console.log(updateParams);
    // return new Promise<OnUpdateResponse>((resolve) => {
    //   setTimeout(() => resolve({entities: data, total: data.length}), 1000);
    // });
    setTimeout(() => {
      this.rows0 = getDemoData();
      this.total0 = this.rows0.length;
    }, 1000)
  }

  render() {

    return (
      <div>
        <h3></h3>
        <p>This Fixtable loads content asynchronously with pagination.</p>
        <div class="row">
          <div class="col-md-8">
            <fixtable-grid
              columns={example2.columns}
              options={example2.options}
              rows={this.rows0}
              total={this.total0}
              onOnPageChange={(event: CustomEvent<OnUpdateParameters>) => this.onUpdate(event.detail)}
            ></fixtable-grid>
          </div>
        </div>
      </div>
    );
  }
}
