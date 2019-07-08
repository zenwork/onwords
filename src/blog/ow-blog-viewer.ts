import { customElement, html, LitElement, TemplateResult } from "lit-element";
import { publish, Subscribable, SubscribableWrapper } from "./subscribable";

@customElement('ow-blog-viewer')
export class OwBlogViewer extends LitElement {
  private published: SubscribableWrapper<BlogData>;

  constructor() {
    super();
    const data: BlogData = new BlogData("foo bar baz");
    this.published = publish<BlogData>(this, data);
  }

  protected render(): TemplateResult | void {
    // language=html
    return html`
        <slot></slot>
    `;
  }
}

export class BlogData extends Subscribable {
  entry: string;

  constructor(entry: string) {
    super('owblogdata');
    this.entry = entry;
  }
}
