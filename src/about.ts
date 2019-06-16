// Extend an HTMLElement or another custom element
export class AboutView extends HTMLElement {
  static wcName = 'about-view';

  // This is called when our element is attached to the DOM
  connectedCallback() {
    this.innerHTML = `<h1>All About onWords!</h1>`;
  }
}

// Tell the browser to associate the '<home-view>' tag with AboutView class
customElements.define(AboutView.wcName, AboutView);


