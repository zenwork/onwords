import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import mix from "mix-with";
import { SubscriberMixin } from "../shared/publishable/SubscriberMixin";
import { BlogData } from "./ow-blog-viewer";

@customElement('ow-blog-entry')
export class OwBlogEntry extends mix(LitElement).with(SubscriberMixin) {

  @property({attribute: true})
  entry: string;

  connectedCallback(): void {
    super.connectedCallback();

    const update = (value: BlogData) => {
      this.entry = value.entry;
      this.requestUpdate();
    };

    this.subscribe<BlogData>('owblogdata', update);
  }

  protected render(): TemplateResult | void {
    // language=html
    return html`story: ${this.entry}`;
  }
}




