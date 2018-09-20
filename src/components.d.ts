/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
/* tslint:disable */

import '@stencil/core';


import {
  ComponentFactory,
} from './components/fixtable-grid/fixtable-grid';
import {
  ColumnDef,
  FixtableOptions,
} from './components/fixtable-grid/fixtable-grid';


declare global {
  interface HTMLElement {
    componentOnReady?: () => Promise<this | null>;
  }

  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;

    forceUpdate(): void;
  }

  interface HTMLAttributes {}

  namespace StencilComponents {

    interface FixtableCell {
      'cellFactory': ComponentFactory;
      'column': any;
      'row': any;
    }

    interface FixtableDemo {

    }

    interface FixtableGrid {
      'columns': ColumnDef[];
      'data': any[];
      'options': FixtableOptions;
    }
  }


    interface HTMLFixtableCellElement extends StencilComponents.FixtableCell, HTMLStencilElement {}

    var HTMLFixtableCellElement: {
      prototype: HTMLFixtableCellElement;
      new (): HTMLFixtableCellElement;
    };
    

    interface HTMLFixtableDemoElement extends StencilComponents.FixtableDemo, HTMLStencilElement {}

    var HTMLFixtableDemoElement: {
      prototype: HTMLFixtableDemoElement;
      new (): HTMLFixtableDemoElement;
    };
    

    interface HTMLFixtableGridElement extends StencilComponents.FixtableGrid, HTMLStencilElement {}

    var HTMLFixtableGridElement: {
      prototype: HTMLFixtableGridElement;
      new (): HTMLFixtableGridElement;
    };
    

  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {
    'fixtable-cell': JSXElements.FixtableCellAttributes;
    'fixtable-demo': JSXElements.FixtableDemoAttributes;
    'fixtable-grid': JSXElements.FixtableGridAttributes;
    }
  }

  namespace JSXElements {

    export interface FixtableCellAttributes extends HTMLAttributes {
      'cellFactory'?: ComponentFactory;
      'column'?: any;
      'row'?: any;
    }

    export interface FixtableDemoAttributes extends HTMLAttributes {

    }

    export interface FixtableGridAttributes extends HTMLAttributes {
      'columns'?: ColumnDef[];
      'data'?: any[];
      'options'?: FixtableOptions;
    }
  }

  interface HTMLElementTagNameMap {
    'fixtable-cell': HTMLFixtableCellElement
    'fixtable-demo': HTMLFixtableDemoElement
    'fixtable-grid': HTMLFixtableGridElement
  }

  interface ElementTagNameMap {
    'fixtable-cell': HTMLFixtableCellElement;
    'fixtable-demo': HTMLFixtableDemoElement;
    'fixtable-grid': HTMLFixtableGridElement;
  }
}
declare global { namespace JSX { interface StencilJSX {} } }

export declare function defineCustomElements(window: any): void;