import {Component, Prop, Element, State} from '@stencil/core';
import {VNode} from "@stencil/core/dist/declarations";
import Fixtable from 'fixtable/dist/fixtable';

export interface ColumnDef {
  key: string;
  label?: string;
  cellComponentFactory?: ComponentFactory;
  width?: number;
  sortable?: boolean;
  compareFn?: (x: any, y: any) => number;
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
  // TODO: Rename lose factory
  cellComponentFactory: (row: any, column: ColumnDef) => {
    let newCell =  document.createElement('span');
    newCell.innerText = row[column.key];
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
  private _sortedDataCache: {
    data: any[];
    sortColumn: ColumnDef;
  } = {data: [], sortColumn: null};

  private nextRowId: number;

  @State() sortColumn: ColumnDef;

  @Prop() data: any[];
  @Prop() options: FixtableOptions;
  @Prop() columns: ColumnDef[];
  @Element() element: HTMLElement;

  // TODO: Get rid of underscores for private methods and attributes
  private initializeFixtable() {
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
    this.initializeFixtable();
    this.nextRowId = 0;
  }

  static _defaultCompareFn(x, y) {
      return x > y ? 1 : -1;
  }

  clientSortedData() {
    try {
      // Updated the sorted cache if the sort column has changed
      if (this._sortedDataCache.sortColumn !== this.sortColumn) {
        let sortMethod = this.sortColumn.compareFn || FixtableGrid._defaultCompareFn;
        this._sortedDataCache.data = this.keyedData.sort((datum0, datum1) => {
          return sortMethod(datum0[this.sortColumn.key], datum1[this.sortColumn.key]);
        });
        this._sortedDataCache.sortColumn = this.sortColumn;
      }

      //
      return this._sortedDataCache.data;
    } catch (e) {
      console.error(`Could not sort by ${this.sortColumn.key}. Check your compare function.`, e);
    }
  }


  get keyedData() {
    return this.data.map((row) => {
      if (!row._fixtableKey) {
        row._fixtableKey = this.nextRowId;
        this.nextRowId++;
      }
      return row;
    });
  }

  processedData() {
    if (this.sortColumn) {
      return this.clientSortedData()
    } else {
      return this.keyedData;
    }
  }

  onColumnHeaderClicked(column: ColumnDef) {
    if(column.sortable) {
      this.sortColumn = column;
    }
  }


  render() {

    let {options, columns} = this;

    // Merge defaults (May want to put this in the onLoad lifecycle hook)
    options = {...defaultFixtableOptions, ...options};
    let {columnFilters} = options;
    columnFilters = columnFilters || [];

    let pd = this.processedData();

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
                  columns.map((column) => {
                    return (
                      <th
                        >
                        <button onClick={()=>{this.onColumnHeaderClicked(column)}}>
                          {/* Put the sorting logic back into the logic above*/}
                          {column.label || column.key}
                        </button>
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
              pd.map((row) =>
                <tr key={row._fixtableKey}>
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
        <div class='fixtable-footer'>
        </div>
      </div>
    );
  }
}
