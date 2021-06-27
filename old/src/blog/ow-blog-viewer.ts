import { Publication, PublisherMixin } from "bubblesub/dist/PublisherMixin"
import { customElement, html, LitElement, TemplateResult } from "lit-element";
import { mix } from 'mix-with';
import { BLOG_DATA, BlogData } from "./model";


@customElement('ow-blog-viewer')
export class OwBlogViewer extends mix(LitElement).with(PublisherMixin) {

  private published: Publication<BlogData>;


  constructor() {
    super();

    this.published = this.publish<BlogData>(BLOG_DATA, {entry: "this is a publishable"});
    setTimeout(() => {this.published.update({entry: "this is an updated publishable"})}, 5000);
  }

  protected render(): TemplateResult | void {
    // language=html
    return html`
        <slot></slot>
    `;
  }
}


