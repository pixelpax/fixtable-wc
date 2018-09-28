import {Component, Prop, Element} from '@stencil/core';
import {FactoryTaker} from '../factory-taker/factory-taker';
import {Column, ComponentFactory} from "../fixtable-grid/fixtable-grid";


@Component({
  tag: 'fixtable-cell',
  styleUrl: 'fixtable-cell.scss',
  shadow: false
})
export class FixtableCell extends FactoryTaker {

  @Element() _element:  HTMLElement;

  @Prop()
  row;

  @Prop()
  column: Column;

  @Prop()
  componentFactory: ComponentFactory;

  propKeys() {
    return ['row', 'column']
  }

}
