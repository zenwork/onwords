// Extend an HTMLElement or another custom element
export class HomeView extends HTMLElement {
  static wcName = 'home-view';

  // This is called when our element is attached to the DOM
  connectedCallback() {
    this.innerHTML = `<h1>Welcome home!</h1>`;
  }
}

// Tell the browser to associate the '<home-view>' tag with HomeView class
customElements.define('home-view', HomeView);



