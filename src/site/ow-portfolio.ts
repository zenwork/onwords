export class OwPortfolio extends HTMLElement {

  constructor() {
    super();
    this.textContent = 'portfolio'
  }
}

customElements.define('ow-portfolio', OwPortfolio);
