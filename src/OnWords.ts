import { css, html, LitElement } from '../node_modules/lit-element/lit-element';

export default class OnWords extends LitElement {
  private readonly heading: string;
  constructor() {
    super();
    this.heading = 'Hello flo!';
  }

  static get styles() {
    return css`
      :host {
        background: grey;
        display: block;
        padding: 25px;
      }
    `;
  }

  static get properties() {
    return {
      heading: { type: String },
    };
  }

  render() {
    return html`
      <h2>${this.heading}</h2>
      <div>
        <slot></slot>
      </div>
    `;
  }
}
