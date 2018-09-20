import { Component, Prop, Element } from '@stencil/core';
import {ComponentFactory} from "../fixtable-grid/fixtable-grid";
import {VNode} from "@stencil/core/dist/declarations";


@Component({
  tag: 'fixtable-cell',
  styleUrl: 'fixtable-cell.scss',
  shadow: false
})
export class FixtableCell {

  @Element() element: HTMLElement;

  @Prop() row: any;
  @Prop() column: any;
  @Prop() cellFactory: ComponentFactory;

  _cellComponent: VNode | HTMLElement;
  _insertAfterRender: boolean;

  componentWillLoad() {
    this._cellComponent = this.cellFactory(this.row, this.column);
    this._insertAfterRender = this._cellComponent instanceof HTMLElement;
  }

  componentDidUpdate() {
    this.element.appendChild(this._cellComponent as HTMLElement);
  }

  componentDidLoad() {
    this.element.appendChild(this._cellComponent as HTMLElement);
  }

  render() {
    if (!this._insertAfterRender) {
      return this._cellComponent;
    } else {
      return <div></div>
    }
  }


}
