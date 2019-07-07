import { html, css, LitElement } from 'lit-element';

export default class OnWords extends LitElement {
  constructor() {
    super();
    this.heading = 'Hello world!';
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
