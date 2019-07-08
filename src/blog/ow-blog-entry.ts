import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { BlogData } from "./ow-blog-viewer";
import { subscribeTo } from "./subscribable";

@customElement('ow-blog-entry')
export class OwBlogEntry extends LitElement {

  @property({attribute: true})
  entry: string;

  connectedCallback(): void {
    super.connectedCallback();

    subscribeTo<BlogData>(
      this,
      'owblogdata',
      (value: BlogData) => {
        this.entry = value.entry;
        this.requestUpdate();
      })
    ;
  }

  protected render(): TemplateResult | void {
    return html`story: ${this.entry}`;
  }
}




