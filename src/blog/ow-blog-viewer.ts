import { Publication, PublisherMixin } from "bubblesub"
import { customElement, html, LitElement, TemplateResult } from "lit-element";
import { mix } from "mix-with";


@customElement('ow-blog-viewer')
export class OwBlogViewer extends mix(LitElement).with(PublisherMixin) {

  private published: Publication<BlogData>;

  constructor() {
    super();
    const name = 'owblogdata';
    this.published = this.publish<BlogData>(name, {entry: "foo bar baz"});
  }

  protected render(): TemplateResult | void {
    // language=html
    return html`
        <slot></slot>
    `;
  }
}

export interface BlogData {
  entry: string;
}
