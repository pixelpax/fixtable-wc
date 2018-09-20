import { Component, Prop, Element } from '@stencil/core';
import {VNode} from "@stencil/core/dist/declarations";
import Fixtable from 'fixtable/dist/fixtable';

export interface ColumnDef {
  property: string;
  cellComponentFactory?: ComponentFactory;
  width?: number;
}

export type JSXFactory = (...args: any[]) => VNode;
export type DOMElementFactory = (...args: any[]) => HTMLElement;

// Could add this back to the menu if there's any demand for it
// export interface JSXComponentInterface {
//   new: () => {
//     render: () => VNode
//   }
// }

export type ComponentFactory = JSXFactory |
                               DOMElementFactory

export interface FixtableOptions {
  fixtableClass?: string;
  tableClass?: string;
  columnFilters?: any[];
  rowSelection?: boolean;
  checkBoxHeaderElement?: () => Element;
  cellComponentFactory?: ComponentFactory;
}

export const defaultFixtableOptions = {
  fixtableClass: '',
  tableClass: '',
  rowSelection: false,

  // EXAMPLE: How you'd write the table cell if inserting directly into the
  // cellComponentFactory: (row: any, column: ColumnDef) => {
  //   return <span>{row[column.property]}</span>
  // }
  cellComponentFactory: (row: any, column: ColumnDef) => {
    let newCell =  document.createElement('span');
    newCell.innerText = row[column.property];
    return newCell;
  }
};

const checkboxColumnWidth = 40;

@Component({
  tag: 'fixtable-grid',
  styleUrl: 'fixtable-grid.scss',
  shadow: false
})
export class FixtableGrid {

  _fixtable: any;

  @Prop() data: any[];
  @Prop() options: FixtableOptions;
  @Prop() columns: ColumnDef[];
  @Element() element: HTMLElement;

  _initializeFixtable() {
    let fixtableEl = this.element.querySelector('.fixtable');

    let fixtable = new Fixtable(fixtableEl, true); //TODO: Differentiate between debug mode and non

    // account for the row selection checkbox column, if present
    let indexOffset = 1;
    if (this.options.rowSelection) {
      indexOffset++;
      fixtable.setColumnWidth(1, checkboxColumnWidth);
    }

    this.columns.forEach( (column, index) => {
      if (column.width) {
        fixtable.setColumnWidth(index + indexOffset, column.width)
      }
    });

    fixtable.setDimensions();
    this._fixtable = fixtable;
  }

  componentDidLoad() {
    this._initializeFixtable();
  }

  render() {

    let {options, data, columns} = this;

    // Merge defaults (May want to put this in the onLoad lifecycle hook)
    options = {...defaultFixtableOptions, ...options};
    let {columnFilters} = options;
    columnFilters = columnFilters || [];

    return (
      <div class={'fixtable '
                  + options.fixtableClass + ' '
                  + (columnFilters.length ? 'fixtable-has-filter' : '')}>

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
                  columns.map((columnDef) => {
                    return (
                      <th
                        >
                        <div>
                          {/* Put the sorting logic back into the logic above*/}
                          {columnDef.property}
                        </div>
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
                <tr>
                  {
                    columns.map((col /*(, colIndex)*/) => {
                      return (
                        <td>
                          <fixtable-cell
                            componentFactory={
                              col.cellComponentFactory ?
                                col.cellComponentFactory :
                                options.cellComponentFactory
                            }
                            row={row}
                            column={col}
                          >
                          </fixtable-cell>
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
