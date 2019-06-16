export class OwHome extends HTMLElement {

  constructor() {
    super();
    this.textContent = 'home'
  }
}

customElements.define('ow-home', OwHome);
