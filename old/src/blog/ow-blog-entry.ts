// import { SubscriberMixin } from "bubblesub";
import { SubscriberMixin } from "bubblesub/dist/SubscriberMixin";
import { customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { mix } from 'mix-with';
import { BLOG_DATA, BlogData, updateBlogData } from "./model";

@customElement('ow-blog-entry')
export class OwBlogEntry extends mix(LitElement).with(SubscriberMixin) {

  @property({attribute: true})
  entry: string;

  connectedCallback(): void {
    super.connectedCallback();
    this.subscribe<BlogData>(BLOG_DATA, updateBlogData(this, 'entry'));
  }

  protected render(): TemplateResult | void {
    // language=html
    return html`story: ${this.entry}`;
  }
}




