import { customElement, html, LitElement, TemplateResult } from "lit-element";

@customElement('ow-blog')
export class OwBlog extends LitElement {

  constructor() {
    super();
  }

  protected render(): TemplateResult | void {
    // language=html
    return html`
        <ow-blog-viewer src="">
            <ow-blog-nav></ow-blog-nav>
            <ow-blog-entry-list>
                <ow-blog-entry-sections></ow-blog-entry-sections>
            </ow-blog-entry-list>
            <ow-blog-entry>
                selected article content
            </ow-blog-entry>
        </ow-blog-viewer>
    `;
  }
}
