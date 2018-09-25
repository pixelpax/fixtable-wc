import {Component, Prop, Element} from '@stencil/core';
import {FactoryTaker} from '../factory-taker/factory-taker';
import {ColumnDef, ComponentFactory} from "../fixtable-grid/fixtable-grid";


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
  column: ColumnDef;

  @Prop()
  componentFactory: ComponentFactory;

  propKeys() {
    return ['row', 'column']
  }

}
