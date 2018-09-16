import { Component, Prop } from '@stencil/core';
import {VNode} from "@stencil/core/dist/declarations";

export interface ColumnDef {
  property: string;
  cellConstructor?: (row: any, col: any) => Element;
}

export interface FixtableOptions {
  tableClass?: string;
  rowSelection?: boolean;
  checkBoxHeaderElement?: () => Element
  columns: ColumnDef[]
  cellConstructor?: (row: any, column: ColumnDef) => VNode
}

export const defaultFixtableOptions = {
  rowSelection: false,
  cellConstructor: (row: any, column: ColumnDef) => {
    let virtualElement = h('span', null, row[column.property]);
    return virtualElement;
  }
};


@Component({
  tag: 'fixtable-grid',
  styleUrl: 'fixtable-grid.css',
})
export class FixtableGrid {

  @Prop() data: any[];
  @Prop() options: FixtableOptions;
  @Prop() columnFilters: any[];


  render() {

    let {options, data, columnFilters} = this;

    // Merge defaults (May want to put this in the onLoad lifecycle hook)
    options = {...defaultFixtableOptions, ...options};
    columnFilters = columnFilters || [];

    return (
      <div class={'fixtable ' +  (columnFilters.length ? 'fixtable-has-filter' : '')}>

        {/* We keep an empty element here for fixtable-vanilla to inject the headers.
            The properties will be managed by fixtable-vanilla */}
        <div class="fixtable-header"></div>


        {/* Same as above, this will be populated with the contents generated below, but
            placed here in order to be managed by fixtable and not move with the interior
            contents are scrolled */}
        {columnFilters.length ?
          <div class="fixtable-filters">
            {/* TODO: Add filters here*/}
          </div> : null
        }

        <div class="fixtable-inner">
          <table class={options.tableClass}>
            <thead>
              {/** Column Labels **/}
              <tr class="fixtable-column-headers">
                {options.rowSelection ?
                  options.checkBoxHeaderElement()
                  : null
                }
                {
                  options.columns.map((columnDef) => {
                    return (
                      <th
                        >
                          {/* Put the sorting logic back into the logic above*/}
                          {columnDef.property}
                      </th>
                    )
                  })
                }
              </tr>
              {/** Column Filters **/}
              <tr>

              </tr>
            </thead>
            <tbody>

            {/** Table Rows **/}
            {
              data.map((row/* , rowIndex*/) =>
                <tr
                >
                  {
                    options.columns.map((col /*(, colIndex)*/) => {
                      return (
                        <td>
                          {/* TODO: Allow for custom constructors for cells
                          */}
                          {
                              col.cellConstructor ?
                                col.cellConstructor(row, col) :
                                options.cellConstructor(row, col)
                          }
                        </td>
                      )
                    })
                  }
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
