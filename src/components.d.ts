/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
/* tslint:disable */

import '@stencil/core';


import {
  Column,
  ComponentFactory,
} from './components/fixtable-grid/fixtable-grid';
import {
  Column as Column2,
  FixtableOptions,
  OnUpdateParameters,
} from './components/fixtable-grid/fixtable-grid';
import {
  EventEmitter,
} from '@stencil/core';


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

    interface FactoryTaker {
      'componentFactory': ComponentFactory;
    }

    interface FixtableCell {
      'column': Column;
      'componentFactory': ComponentFactory;
      'row': any;
    }

    interface FixtableDemo {

    }

    interface FixtableGrid {
      'columns': Column[];
      'options': FixtableOptions;
      'rows': any[];
      'total': number;
    }
  }


    interface HTMLFactoryTakerElement extends StencilComponents.FactoryTaker, HTMLStencilElement {}

    var HTMLFactoryTakerElement: {
      prototype: HTMLFactoryTakerElement;
      new (): HTMLFactoryTakerElement;
    };
    

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
    'factory-taker': JSXElements.FactoryTakerAttributes;
    'fixtable-cell': JSXElements.FixtableCellAttributes;
    'fixtable-demo': JSXElements.FixtableDemoAttributes;
    'fixtable-grid': JSXElements.FixtableGridAttributes;
    }
  }

  namespace JSXElements {

    export interface FactoryTakerAttributes extends HTMLAttributes {
      'componentFactory'?: ComponentFactory;
    }

    export interface FixtableCellAttributes extends HTMLAttributes {
      'column'?: Column;
      'componentFactory'?: ComponentFactory;
      'row'?: any;
    }

    export interface FixtableDemoAttributes extends HTMLAttributes {

    }

    export interface FixtableGridAttributes extends HTMLAttributes {
      'columns'?: Column[];
      'onOnPageChange'?: (event: CustomEvent<OnUpdateParameters>) => void;
      'onUpdateSelection'?: (event: CustomEvent<any[]>) => void;
      'options'?: FixtableOptions;
      'rows'?: any[];
      'total'?: number;
    }
  }

  interface HTMLElementTagNameMap {
    'factory-taker': HTMLFactoryTakerElement
    'fixtable-cell': HTMLFixtableCellElement
    'fixtable-demo': HTMLFixtableDemoElement
    'fixtable-grid': HTMLFixtableGridElement
  }

  interface ElementTagNameMap {
    'factory-taker': HTMLFactoryTakerElement;
    'fixtable-cell': HTMLFixtableCellElement;
    'fixtable-demo': HTMLFixtableDemoElement;
    'fixtable-grid': HTMLFixtableGridElement;
  }
}
declare global { namespace JSX { interface StencilJSX {} } }

export declare function defineCustomElements(window: any): void;