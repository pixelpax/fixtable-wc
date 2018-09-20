import {Component, Prop, Element} from '@stencil/core';
import {FactoryTaker} from '../factory-taker/factory-taker';
import {ComponentFactory} from "../fixtable-grid/fixtable-grid";


@Component({
  tag: 'fixtable-cell',
  styleUrl: 'fixtable-cell.scss',
  shadow: false
})
export class FixtableCell extends FactoryTaker {

  @Element() _element:  HTMLElement;

  @Prop()
  row: any;

  @Prop()
  column: any;

  @Prop()
  componentFactory: ComponentFactory;

  propKeys() {
    return ['row', 'column']
  }

}
