export class OwBlog extends HTMLElement {

  constructor() {
    super();
    this.textContent = 'blog'
  }
}

customElements.define('ow-blog', OwBlog);
