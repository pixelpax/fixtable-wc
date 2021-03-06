import {Component, Prop, State, Element, Event, EventEmitter} from '@stencil/core';
import get from 'lodash/get';
import Fixtable from 'fixtable/dist/fixtable';

// For some reason this works in sandbox, but stencil doesn't distribute the delcaration
// import {VNode} from "@stencil/core/dist/declarations";
type VNode = any;

export interface Column {
  key: string;
  label?: string;
  cellComponentFactory?: ComponentFactory;
  width?: number;
  sortable?: boolean;
  compareFn?: (x: any, y: any) => number;
  filterFn?: (x: any) => boolean;
  defaultFilterValue?: any;
  filterable?: boolean;
}


export type JSXFactory = (...args: any[]) => VNode;
export type DOMElementFactory = (...args: any[]) => HTMLElement;

export type ComponentFactory = JSXFactory |
                               DOMElementFactory

export interface OnUpdateResponse {
  entities: any[]
  total: number;
}

export interface OnUpdateParameters {
  pageNumber?: number;
  pageSize?: number;
  filters?: {[key: string]: string}
  sortBy?: string;
  sortDirection?: string;
}

export interface FixtableOptions {
  fixtableClass?: string;
  tableClass?: string;
  columnFilters?: any[];
  rowSelection?: boolean;
  checkBoxHeader?: () => Element;
  selectableRows?: boolean;
  cellComponentFactory?: ComponentFactory;
  pageSizeChoices?: number[];
  width?: number;
  //TODO: Fix this to be strictly typed
  // onUpdate?: <T extends OnUpdateResponse>(onUpdateParameters?: OnUpdateParameters) => Promise<T>;
  clientProcessing?: boolean;
}

export const defaultFixtableOptions = {
  fixtableClass: '',
  tableClass: '',
  rowSelection: false,
  pageSizeChoices: [10, 25, 50, 100],

  // EXAMPLE: How you'd write the table cell if inserting directly into the
  // cellComponentFactory: (row: any, column: Column) => {
  //   return <span>{get(row, column.key)}</span>
  // }
  // TODO: Rename lose factory
  cellComponentFactory: (row: any, column: Column) => {
    let newCell =  document.createElement('span');
    const contents = get(row, column.key);
    newCell.innerText = contents ? contents : '';
    return newCell;
  }
};

type ColumnFilter = {
  value: any;
  column: Column;
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
    rows: any[];
    sortColumn: Column;
    sortDirection: number;
    columnFilters: {[key:string]: ColumnFilter};
  } = {
    rows: [],
    sortColumn: null,
    sortDirection: 1,
    columnFilters: {}
  };

  private nextRowKey: number;

  sortColumn: Column;
  sortDirection: number; // 1 will sort low-to-high, -1 will sort high-to-low
  columnFilters: {[key:string]: ColumnFilter} = {};
  pageNumber:  number = 1;
  pageSize: number = 25;


  isLoading: boolean = false;
  displayedRows: any = [];

  @State()
  selectedRows: boolean[] = [];
  selectionModified: boolean = false;

  @Prop() rows: any[];
  @Prop() options: FixtableOptions;
  @Prop() columns: Column[];
  @Prop() total: number = null;

  @Event() onPageChange: EventEmitter<OnUpdateParameters>;
  @Event() updateSelection: EventEmitter<any[]>;

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

  componentWillLoad() {

    // TODO: Validate Props

    // Set some initial values
    this.nextRowKey = 0;

    // Initialize filter models for filterable columns
    this.columns.forEach((column: Column) => {
      if (column.filterable) {
        this.columnFilters[column.key] = {
          column,
          value: column.defaultFilterValue || ''
        }
      }
    });

    // If server-driven, run update and toggle isLoading
    this.updateRows();
    this.displayedRows = this.keyedData;
    this.fillSelectedRowsArray(false);
  }

  componentWillUpdate() {
    // this.total = this.total ? this.total : null;
    this.displayedRows = this.keyedData;
    this.isLoading = false;

    // This could lead to danger if more logic is happening here
    if (!this.selectionModified) {
      this.fillSelectedRowsArray(false);
    }
  }

  componentDidLoad() {
    this.initializeFixtable();
  }

  static _defaultCompareFn(x, y) {
      return x > y ? 1 : -1;
  }

  static defaultFilterFn(filterValue: any, row: any, column: Column) {
    if (filterValue && typeof filterValue === 'string') {
      return row[column.key] && row[column.key].includes(filterValue)
    } else {
      return true;
    }
  }

  get filteredData() {
    return this.keyedData.filter((row) => {
      return Object.keys(this.columnFilters).reduce((aggregate, columnKey) => {
        const filterFn = this.columnFilters[columnKey].column.filterFn || FixtableGrid.defaultFilterFn;
        return aggregate && filterFn(this.columnFilters[columnKey].value, row, this.columnFilters[columnKey].column)
      }, true)
    });
  }

  clientProcessedRows() {

    // If we have a new filter column value, re-filter
    if (this._sortedDataCache.columnFilters !== this.columnFilters) {
        this._sortedDataCache.rows = this.filteredData;
      this._sortedDataCache.sortDirection = 1;
      this._sortedDataCache.sortColumn = null;
      this._sortedDataCache.columnFilters = this.columnFilters;

    // Updated the sorted cache if the sort column has changed
    } else if (this.sortColumn && this.sortColumn !== this._sortedDataCache.sortColumn) {
      try {
        let sortMethod = this.sortColumn.compareFn || FixtableGrid._defaultCompareFn;
        this._sortedDataCache.rows = this.filteredData.sort((datum0, datum1) => {
          return sortMethod(datum0[this.sortColumn.key], datum1[this.sortColumn.key]);
        });
        this._sortedDataCache.sortColumn = this.sortColumn;
      } catch (e) {
        console.error(`Could not sort by ${this.sortColumn.key}. Check your compare function.`, e);
      }

    // If they are sorting by the same column but changed direction
    } else if (this._sortedDataCache.sortDirection !== this.sortDirection) {
      this._sortedDataCache.rows = this._sortedDataCache.rows.reverse();
      this._sortedDataCache.sortDirection = this.sortDirection;
    }

    return this._sortedDataCache.rows;
  }


  get keyedData() {
    return this.rows.map((row) => {
      if (!row._fixtableKey) {
        row._fixtableKey = this.nextRowKey;
        this.nextRowKey++;
      }
      return row;
    });
  }

  updateRows() {
    if (!this.options.clientProcessing) {
      let filters = {};
      filters = Object.keys(this.columnFilters).map((columnKey) => {
        filters[columnKey] = this.columnFilters[columnKey].value;
      });
      const sortDirection = this.sortDirection === 1 ? 'asc' : 'desc';

      let sortBy;
      if (this.sortColumn) {
        sortBy = this.sortColumn.key;
      }

      const {pageSize, pageNumber} = this;

      this.isLoading = true;
      this.onPageChange.emit({filters, sortBy, sortDirection, pageSize, pageNumber});
    } else {
      this.displayedRows = [...this.clientProcessedRows()];
    }
  }

  onColumnHeaderClicked(column: Column) {
    if(column.sortable) {
      if (this.sortColumn && this.sortColumn === column) {
        this.sortDirection = -this.sortDirection;
      } else {
        this.sortColumn = column;
        this.sortDirection = 1;
      }
      this.updateRows()
    }
  }

  onColumnFilterChange(column: Column, newValue: string) {
    //TODO: Check if we're doing client-side filtering, if not pass the filter as a value
    this.columnFilters = {
      ...this.columnFilters,
      [column.key]: {...this.columnFilters[column.key], value: newValue}
    };

    this.updateRows();
  }

  onChangePageNumber(newPageNumber: string) {

    this.pageNumber = Number(newPageNumber);
    this.updateRows();
  }

  onNextPage() {
    this.pageNumber++;
    this.updateRows();
  }

  onPreviousPage() {
    this.pageNumber--;
    this.updateRows();
  }

  get lastPage() {
    return this.total ? Math.ceil(this.total/this.pageSize) : 1;
  }

  fillSelectedRowsArray(value: boolean) {
    this.selectedRows = [] as boolean[];
    for (let i=0; i < this.rows.length; i++) {
      this.selectedRows.push(value);
    }
  }

  onToggleSelectAll() {
    if (!this.selectedRows.every(r => r)) {
      this.fillSelectedRowsArray(true);
    } else {
      this.fillSelectedRowsArray(false);
    }
    this.broadcastUpdateSelection();
  }

  onToggleRow(rowIndex: number) {
    this.selectedRows[rowIndex] = !this.selectedRows[rowIndex];
    this.selectedRows = [...this.selectedRows];
    this.broadcastUpdateSelection();
  }

  broadcastUpdateSelection() {
    this.selectionModified = true;

    let returnSection = this.selectedRows.map((val, i) => {
      if (val) {
        return this.rows[i]
      } else {
        return null;
      }
    }).filter(row => row);

    this.updateSelection.emit(returnSection);
  }

  render() {

    let {options, columns} = this;

    // Merge defaults (May want to put this in the onLoad lifecycle hook)
    options = {...defaultFixtableOptions, ...options};

    // Convoluted way of getting a list of integers from 1..N
    let pageNumbers;
    pageNumbers = [];
    if (this.lastPage !== 1) {
      for (let i = 1; i <= this.lastPage; i++) {
        pageNumbers.push(i);
      }
    }

    return (
      <div class={'fixtable fixtable-purecloud '
                  + options.fixtableClass + ' '
                  + (Object.keys(this.columnFilters).length ? 'fixtable-has-filter' : '')}>

        {/* We keep an empty element here for fixtable-vanilla to inject the headers.
            The properties will be managed by fixtable-vanilla */}
        <div class="fixtable-header"></div>


        {/* Same as above, this will be populated with the contents generated below, but
            placed here in order to be managed by fixtable and not move with the interior
            contents are scrolled */}
        <div class="fixtable-filters"></div>

        <div class="fixtable-inner">
          <table class={options.tableClass}>
            <thead>
              {/** Column Labels **/}
              <tr class="fixtable-column-headers">
                {
                  this.options.selectableRows ?
                  <th>
                    <div class="fixtable-checkbox">
                      <input type="checkbox" onChange={this.onToggleSelectAll.bind(this)}/>
                    </div>
                  </th>
                  : null
                }
                {
                  columns.map((column) => {
                    let caretClass = this.sortColumn === column ? 'fixtable-caret' : '';
                    if (this.sortDirection !== 1) {
                      caretClass += ' fixtable-caret-reversed';
                    }
                    return (
                      <th
                        >
                        <div onClick={()=>{this.onColumnHeaderClicked(column)}}>
                          {/* Put the sorting logic back into the logic above*/}
                          <span class={caretClass}></span>
                          <span>
                            {column.label || column.key}
                          </span>
                        </div>
                      </th>
                    )
                  })
                }
              </tr>
              {/** Column Filters **/}
              <tr class="fixtable-column-filters">
              {
                this.options.selectableRows ?
                  <th></th>
                  : null
              }
              {
                this.columns.map((column) =>
                  <th>
                    <div>
                      {
                        column.filterable ?
                          <input value={this.columnFilters[column.key].value} type="text" onInput={(e) => {this.onColumnFilterChange(column, (e as any).target.value)}
                          }/>
                          : null
                      }
                    </div>
                  </th>
                )
              }
              </tr>
            </thead>

            {/** Table Rows **/}
            {
              !this.isLoading ?
             <tbody>
             {
               this.displayedRows.map((row, i) =>
                <tr key={row._fixtableKey}>
                {
                  this.options.selectableRows ?
                    <td>
                      <div class="fixtable-checkbox" >
                         <input type="checkbox" checked={this.selectedRows[i]} onChange={this.onToggleRow.bind(this, i)}/>
                      </div>
                    </td>
                    : null
                }
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
              : null
            }
          </table>
        </div>
        {
          this.isLoading ?
            <div class="fixtable-centered">
              <span>Loading!</span>
            </div>
            : null
        }
        <div class="fixtable-footer">
          <span class="page-number" onClick={() => this.onPreviousPage()} style={{visibility: this.pageNumber === 1 ? 'hidden' : 'visible'}}>Previous</span>
          {
            pageNumbers.map((i) => {
              return <span class="page-number" onClick={this.onChangePageNumber.bind(this, i)}>{i}</span>
            })
          }
          <span class="page-number" onClick={() => this.onNextPage()} style={{visibility: this.pageNumber === this.lastPage ? 'hidden' : 'visible'}}>Next</span>
        </div>
      </div>
    );
  }
}

