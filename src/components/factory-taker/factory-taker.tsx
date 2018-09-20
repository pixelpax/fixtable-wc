import {Component, Prop} from '@stencil/core';
import {ComponentFactory} from "../fixtable-grid/fixtable-grid";
import {VNode} from "@stencil/core/dist/declarations";


@Component({
  tag: 'factory-taker'
})
export class FactoryTaker {

  @Prop() componentFactory: ComponentFactory;

  _element: HTMLElement;

  _cellComponent: VNode | HTMLElement;
  _insertAfterRender: boolean;

  propKeys(): string[] {
    return []
  }

  useFactory(): VNode | HTMLElement {
    let props = this.propKeys().map((propKey) => this[propKey]);
    try {
      return this.componentFactory(...props);
    } catch (e) {
      console.error(`
      Error when calling supplied componentFactory in ${this.constructor.name} with the following arguments:`,
        ...props,
        e);
      //TODO: We should replace this with the default value for this factory
      return <div></div>
    }
  }

  componentWillLoad() {
    this._cellComponent = this.useFactory();
    this._insertAfterRender = this._cellComponent instanceof HTMLElement;
  }

  componentDidUpdate() {
    if (this._insertAfterRender) {
      this._element.appendChild(this._cellComponent as HTMLElement);
    }
  }

  componentDidLoad() {
    if (this._insertAfterRender) {
      this._element.appendChild(this._cellComponent as HTMLElement);
    }
  }

  render() {
    if (!this._insertAfterRender) {
      return this._cellComponent;
    }
  }


}
